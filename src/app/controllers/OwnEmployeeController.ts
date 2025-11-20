import { Request, Response } from 'express';
import { startOfDay, endOfDay } from 'date-fns';
import { eq, and, between } from 'drizzle-orm';

import db from '../../config/database';
import { employees, stores, addresses, schedules, appointments } from '../../db/schema';
import { checkPassword, hashPassword } from '../../utils/password';

class OwnEmployeeController {
  async index(req: Request, res: Response): Promise<Response> {
    const employee = await db.query.employees.findFirst({
      where: eq(employees.id, req.employeeId!),
      columns: {
        name: true,
        email: true,
        responsibility: true,
      },
      with: {
        job: {
          columns: {
            name: true,
            email: true,
            tel: true,
          },
          with: {
            address: {
              columns: {
                street: true,
                number: true,
                state: true,
                zipcode: true,
              },
            },
          },
        },
        schedule: {
          columns: {
            holiday: true,
            special: true,
            daysWeek: true,
          },
        },
      },
    });

    return res.json(employee);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, req.employeeId!))
      .limit(1);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const { email, oldPassword } = req.body;
    if (email !== employee.email) {
      const [emailExists] = await db
        .select()
        .from(employees)
        .where(eq(employees.email, email))
        .limit(1);
      if (emailExists) {
        return res.status(401).json({ error: 'Email already exists' });
      }
    }
    
    if (oldPassword && !(await checkPassword(oldPassword, employee.passwordHash))) {
      return res.status(400).json({ error: 'Passwords does not match' });
    }

    const updateData: any = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.responsibility) updateData.responsibility = req.body.responsibility;
    if (req.body.password) {
      updateData.passwordHash = await hashPassword(req.body.password);
    }

    const [updated] = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, req.employeeId!))
      .returning({
        name: employees.name,
        responsibility: employees.responsibility,
      });

    return res.json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const [deleted] = await db
      .delete(employees)
      .where(eq(employees.id, req.employeeId!))
      .returning();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.json({ success: 'Ok' });
  }

  async listAppointments(req: Request, res: Response): Promise<Response> {
    const {
      initialdate: initialDate,
      finaldate: finalDate,
      page = 1,
    } = req.query;

    const appointmentsList = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.employeeId, req.employeeId!),
          between(
            appointments.date,
            startOfDay(Number(initialDate)),
            endOfDay(Number(finalDate))
          )
        )
      )
      .orderBy(appointments.date)
      .limit(20)
      .offset((Number(page) - 1) * 20);

    const count = appointmentsList.length;

    if (count === 0) {
      return res.json({ appointments: 'You does not have appointments' });
    }

    return res.json({ count, rows: appointmentsList });
  }

  async deleteAppointments(req: Request, res: Response): Promise<Response> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, Number(req.params.appointments_id)))
      .limit(1);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    return res.json({ success: 'ok' });
  }

  async validationAppointiment(req: Request, res: Response): Promise<Response> {
    const date = Number(new Date().getTime());
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.id, Number(req.params.appointments_id)),
          between(appointments.date, startOfDay(date), endOfDay(date))
        )
      )
      .limit(1);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const [updated] = await db
      .update(appointments)
      .set({ validated: req.body.validated })
      .where(eq(appointments.id, Number(req.params.appointments_id)))
      .returning();

    return res.json(updated);
  }
}

export default new OwnEmployeeController();
