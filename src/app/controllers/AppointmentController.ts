import { Request, Response } from 'express';
import { startOfDay, endOfDay } from 'date-fns';
import { eq, and, between, isNull, isNotNull } from 'drizzle-orm';

import db from '../../config/database';
import { stores, employees, appointments, custumers } from '../../database/schema';
import verifyIsCancelable from '../../utils/verifyIsCancelable';

class AppointmentController {
  async index(req: Request, res: Response): Promise<Response> {
    const { storeId } = req.query;
    const appointmentsList = await db
      .select()
      .from(appointments)
      .where(eq(appointments.storeId, Number(storeId)));

    return res.json(appointmentsList);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const { employee_id: employeeId, custumer_id: custumerId } = req.body;
    
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, custumerId))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    const [newAppointment] = await db
      .insert(appointments)
      .values({
        date: new Date(req.body.date),
        employeeId,
        custumerId,
        storeId: Number(req.params.store_id),
        validated: false,
      })
      .returning();
    
    return res.json(newAppointment);
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

  async delete(req: Request, res: Response): Promise<Response> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, Number(req.params.appointment_id)))
      .limit(1);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const [custumer] = await db
      .select()
      .from(custumers)
      .where(eq(custumers.id, Number(req.params.custumer_id)))
      .limit(1);
    
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    if (verifyIsCancelable(appointment.date)) {
      return res.status(404).json({ error: 'Appointment can not be canceled' });
    }

    // await db
    //   .update(appointments)
    //   .set({ canceledAt: new Date() })
    //   .where(eq(appointments.id, Number(req.params.appointment_id)));

    return res.json(appointment);
  }
}

export default new AppointmentController();
