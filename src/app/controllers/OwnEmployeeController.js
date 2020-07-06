import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Employee from '../models/Employee';
import Store from '../models/Store';
import Schedule from '../models/Schedule';
import Address from '../models/Address';
import Appointment from '../models/Appointment';

class OwnEmployeeController {
  async index(req, res) {
    const employee = await Employee.findByPk(req.employeeId, {
      attributes: ['name', 'email', 'responsibility', 'days_off'],
      include: [
        {
          model: Store,
          as: 'job',
          attributes: ['name', 'email', 'tel'],
          include: [
            {
              model: Address,
              as: 'address',
              attributes: ['street', 'number', 'state', 'zipcode'],
            },
          ],
        },
        {
          model: Schedule,
          as: 'schedule',
          attributes: ['holiday', 'special', 'days_week'],
        },
      ],
    });

    return res.json(employee);
  }

  async update(req, res) {
    const employee = await Employee.findByPk(req.employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const { email, oldPassword } = req.body;
    if (email !== employee.email) {
      const emailExists = await Employee.findOne({
        where: { email },
      });
      if (emailExists) {
        return res.status(401).json({ error: 'Email already exists' });
      }
    }
    if (oldPassword && !(await employee.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Passwords does not match' });
    }

    const {
      name,
      responsibility,
      // schedule,
      // eslint-disable-next-line camelcase
      days_off,
    } = await employee.update(req.body);

    return res.json({
      name,
      responsibility,
      days_off,
    });
  }

  async delete(req, res) {
    const employee = await Employee.findByPk(req.employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.destroy();

    return res.json({ success: 'Ok' });
  }

  async listAppointments(req, res) {
    const {
      initialdate: initialDate,
      finaldate: finalDate,
      page = 1,
    } = req.query;

    const appointments = await Appointment.findAndCountAll({
      where: {
        employee_id: req.employeeId,
        date: {
          [Op.between]: [
            startOfDay(Number(initialDate)),
            endOfDay(Number(finalDate)),
          ],
        },
      },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (appointments.count === 0) {
      return res.json({ appointments: 'You does not have appointments' });
    }

    return res.json(appointments);
  }

  async deleteAppointments(req, res) {
    const appointment = await Appointment.findByPk(req.params.appointments_id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    return res.json({ success: 'ok' });
  }

  async validationAppointiment(req, res) {
    const date = Number(new Date().getTime());
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.appointments_id,
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.validated = req.body.validated;
    await appointment.save();

    return res.json(appointment);
  }
}
export default new OwnEmployeeController();
