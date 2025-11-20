import { Request, Response } from 'express';
import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { eq, and, between, isNull } from 'drizzle-orm';

import db from '../../config/database';
import { appointments, employees, schedules } from '../../db/schema';
import Fetch from '../../utils/fetch';

class AvailableController {
  async index(req: Request, res: Response): Promise<Response> {
    const { date } = req.query;
    const { employeeId } = req.params;
    if (!date) {
      return res.status(400).json({ error: 'Date is not sended' });
    }
    
    /** Busca as informações do employee */
    const employee = await db.query.employees.findFirst({
      where: eq(employees.id, Number(employeeId)),
      with: {
        schedule: {
          columns: {
            holiday: true,
            special: true,
            daysWeek: true,
          },
        },
      },
    });
    
    if (!employee || !employee.schedule) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const searchDate = Number(date);

    /** Busca os agendamentos referente ao dia selecionado */
    const appointmentsList = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.storeId, employee.jobId!),
          eq(appointments.employeeId, employee.id),
          isNull(appointments.canceledAt),
          between(appointments.date, startOfDay(searchDate), endOfDay(searchDate))
        )
      );
    
    // Verify if employee is in day off
    const dayWeek = new Date(searchDate).getDay();
    const employeeDaySchedule = (employee.schedule.daysWeek as any[]).filter(
      (day: any) => day.dayOfWeek === dayWeek
    );
    const isDayOff = employeeDaySchedule[0]?.dayOff;

    if (isDayOff) {
      return res.json([{ dayOff: true, time: '', value: '', available: null }]);
    }

    const dateFormatted = format(searchDate, 'dd/MM/yyyy');
    const year = new Date(searchDate).getFullYear();
    // Verifica se o dia selecionado é um feriado
    const isHoliday = await Fetch.holidays(dateFormatted, year);

    let scheduleEmployee: any[] = [];

    if (isHoliday) {
      return res.status(400).json({ error: ' is a holiday' });
    }
    
    scheduleEmployee = employeeDaySchedule[0]?.scheduleParsed || [];

    const available = scheduleEmployee.map((time: string) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, Number(hour)), Number(minute)),
        0
      );
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointmentsList.find((a) => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
