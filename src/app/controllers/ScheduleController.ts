/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { stores, schedules, employees } from '../../database/schema';
import formatSchedule from '../../utils/formatSchedule';

class ScheduleController {
  async show(req: Request, res: Response): Promise<Response> {
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, Number(req.params.employee_id)))
      .limit(1);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    if (!employee.scheduleId) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    const [schedule] = await db
      .select({
        id: schedules.id,
        holiday: schedules.holiday,
        special: schedules.special,
        ownerId: schedules.ownerId,
        ownerType: schedules.ownerType,
        daysWeek: schedules.daysWeek,
      })
      .from(schedules)
      .where(eq(schedules.id, employee.scheduleId))
      .limit(1);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    return res.json({
      ...schedule,
      owner_id: schedule.ownerId,
      owner_type: schedule.ownerType,
      days_week: schedule.daysWeek,
    });
  }

  async store(req: Request, res: Response): Promise<Response> {
    const OwnerType = req.body.owner_type;
    let ownerId: number | null = null;
    
    if (OwnerType === 'store') {
      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.id, req.body.owner_id))
        .limit(1);
      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }
      ownerId = store.id;
    } else {
      const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.id, req.body.owner_id))
        .limit(1);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      ownerId = employee.id;
    }

    /** Formatando o objeto schedule */
    const schHoliday = req.body.holiday;
    const data = {
      ownerId: req.body.owner_id,
      ownerType: req.body.owner_type as 'store' | 'employee',
      holiday:
        schHoliday.entrance.length === 0
          ? []
          : formatSchedule.scheduleHoliday(schHoliday),
      daysWeek: formatSchedule.scheduleWeek(req.body.days_week),
      special: req.body.special || [],
    };

    try {
      const [schedule] = await db
        .insert(schedules)
        .values(data)
        .returning();
      
      if (OwnerType === 'store') {
        await db
          .update(stores)
          .set({ scheduleId: schedule.id })
          .where(eq(stores.id, ownerId));
      } else {
        await db
          .update(employees)
          .set({ scheduleId: schedule.id })
          .where(eq(employees.id, ownerId));
      }
      
      return res.json({
        id: schedule.id,
        holiday: schedule.holiday,
        special: schedule.special,
        owner_id: schedule.ownerId,
        owner_type: schedule.ownerType,
        days_week: schedule.daysWeek,
      });
    } catch (error) {
      return res.status(400).json({ error: 'Error on save' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const [schedule] = await db
      .select()
      .from(schedules)
      .where(eq(schedules.id, Number(req.params.schedule_id)))
      .limit(1);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    const schHoliday = req.body.holiday;
    const data = {
      holiday:
        schHoliday.entrance.length === 0
          ? []
          : formatSchedule.scheduleHoliday(schHoliday),
      daysWeek: formatSchedule.scheduleWeek(req.body.days_week),
      special: req.body.special || schedule.special,
    };

    const [updated] = await db
      .update(schedules)
      .set(data)
      .where(eq(schedules.id, Number(req.params.schedule_id)))
      .returning();
    
    return res.json({
      id: updated.id,
      holiday: updated.holiday,
      special: updated.special,
      owner_id: updated.ownerId,
      owner_type: updated.ownerType,
      days_week: updated.daysWeek,
    });
  }
}

export default new ScheduleController();
