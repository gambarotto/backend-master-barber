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
// import Store from '../models/Store';
import Schedule from '../models/Schedule';
import Holiday from '../models/Holiday';

class AvailableController {
  async index(req, res) {
    const { date, employeeId } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is not sended' });
    }
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
    if (employee.days_off.indexOf(dayWeek) >= 0) {
      return res.json({ error: 'Employee is off' });
    }

    // Verifica se o dia selecionado é um feriado
    const dateFormatted = format(searchDate, 'dd/MM/yyyy');
    const { holidays } = await Holiday.findOne({
      where: { year: '2020' },
      attributes: ['holidays'],
    });
    let isHoliday = false;

    if (holidays.find((holiday) => holiday.date === dateFormatted)) {
      isHoliday = true;
    }

    let scheduleEmployee = [];

    if (isHoliday) {
      scheduleEmployee = employee.schedule.holiday;
    } else {
      scheduleEmployee = employee.schedule.days_week.filter(
        (item) => item.dayOfWeek === dayWeek
      );
      scheduleEmployee = [...scheduleEmployee[0].schedule];
    }
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
