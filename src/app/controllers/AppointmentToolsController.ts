import { Request, Response } from 'express';
import { startOfDay, endOfDay } from 'date-fns';
import { eq, and, between, isNull, isNotNull } from 'drizzle-orm';

import db from '../../config/database';
import { appointments, stores, employees, avatars, images } from '../../database/schema';

class AppointmentToolsController {
  async indexByCustumer(req: Request, res: Response): Promise<Response> {
    const appointmentsList = await db.query.appointments.findMany({
      where: eq(appointments.custumerId, Number(req.params.custumer_id)),
      columns: {
        id: true,
        date: true,
        canceledAt: true,
        validated: true,
      },
      with: {
        store: {
          columns: {
            id: true,
            name: true,
          },
          with: {
            image: {
              columns: {
                id: true,
                path: true,
              },
            },
          },
        },
        employee: {
          columns: {
            id: true,
            name: true,
          },
          with: {
            avatar: {
              columns: {
                id: true,
                path: true,
              },
            },
          },
        },
      },
      orderBy: (appointments, { desc }) => [desc(appointments.date)],
    });

    // Transformar para o formato esperado
    const formatted = appointmentsList.map((apt) => ({
      id: apt.id,
      past: apt.date < new Date(),
      cancelable: true, // Calcular se necessário
      date: apt.date,
      canceled_at: apt.canceledAt,
      validated: apt.validated,
      store: apt.store
        ? {
            ...apt.store,
            image: apt.store.image
              ? {
                  ...apt.store.image,
                  url: `http://192.168.15.22:3333/images/${apt.store.image.path}`,
                }
              : null,
          }
        : null,
      employee: apt.employee
        ? {
            ...apt.employee,
            avatar: apt.employee.avatar
              ? {
                  ...apt.employee.avatar,
                  url: `http://192.168.15.22:3333/avatars/${apt.employee.avatar.path}`,
                }
              : null,
          }
        : null,
    }));

    return res.json(formatted);
  }

  async indexDayOrEmployee(req: Request, res: Response): Promise<Response> {
    const { date, employeeId } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is not sended' });
    }
    const searchDate = Number(date);

    const conditions = [
      eq(appointments.storeId, Number(req.params.store_id)),
      isNull(appointments.canceledAt),
      between(appointments.date, startOfDay(searchDate), endOfDay(searchDate)),
    ];

    if (employeeId) {
      conditions.push(eq(appointments.employeeId, Number(employeeId)));
    } else {
      conditions.push(isNotNull(appointments.employeeId));
    }

    const appointmentsList = await db
      .select()
      .from(appointments)
      .where(and(...conditions));
    
    return res.json(appointmentsList);
  }
}

export default new AppointmentToolsController();
