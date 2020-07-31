import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import Employee from '../models/Employee';
import Schedule from '../models/Schedule';
import Fetch from '../../utils/fetch';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;
    const { employeeId } = req.params;
    if (!date) {
      return res.status(400).json({ error: 'Date is not sended' });
    }
    /** Busca as informações do employee */
    const employee = await Employee.findByPk(employeeId, {
      include: [
        {
          model: Schedule,
          as: 'schedule',
          attributes: ['holiday', 'special', 'days_week'],
        },
      ],
    });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const searchDate = Number(date);

    /** Busca os agendamentos referente ao dia selecionado */
    const appointments = await Appointment.findAll({
      where: {
        store_id: employee.job_id,
        employee_id: employee.id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });
    // Verify if employee is in day off
    const dayWeek = new Date(searchDate).getDay();
    // const dayWeek = 3;
    console.log(JSON.stringify(employee.schedule));
    const employeeDaySchedule = employee.schedule.days_week.filter(
      (day) => day.dayOfWeek === dayWeek
    );
    const isDayOff = employeeDaySchedule[0].dayOff;

    if (isDayOff) {
      return res.json([{ dayOff: true, time: '', value: '', available: null }]);
    }

    const dateFormatted = format(searchDate, 'dd/MM/yyyy');
    const year = new Date(searchDate).getFullYear();
    // Verifica se o dia selecionado é um feriado
    const isHoliday = await Fetch.holidays(dateFormatted, year);

    let scheduleEmployee = [];

    if (isHoliday) {
      // TODO ajust holiday
      // scheduleEmployee = employee.schedule.holiday;
      return res.status(400).json({ error: ' is a holiday' });
    }
    // scheduleEmployee = employee.schedule.days_week.filter(
    //   (item) => item.dayOfWeek === dayWeek
    // );
    scheduleEmployee = employeeDaySchedule[0].scheduleParsed;

    const available = scheduleEmployee.map((time) => {
      // time = 09:00
      const [hour, minute] = time.split(':');
      // hour = 09 / minute = 00
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      // value = 2020-05-18T12:00:00.484Z
      return {
        time, // 09:00
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        // value = 2020-05-18T09:00:00-03:00
        available:
          isAfter(value, new Date()) &&
          !appointments.find((a) => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}
export default new AvailableController();
