import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Store from '../models/Store';
import Employee from '../models/Employee';
import Appointment from '../models/Appointment';
import Custumer from '../models/Custumer';

class AppointmentController {
  async index(req, res) {
    const { storeId } = req.query;
    const appointments = await Appointment.findAll({
      where: { store_id: storeId },
    });

    res.json(appointments);
  }

  async store(req, res) {
    const { employee_id: employeeId, custumer_id: custumerId } = req.body;
    const store = await Store.findByPk(req.params.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const custumer = await Custumer.findByPk(custumerId);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }
    // const dayOfWeek = parseISO(req.body.date).getDay();
    // // 0 = Dom, 1 = Seg, ..., 6 = Sáb

    const appointment = await Appointment.create({
      date: req.body.date,
      employee_id: employeeId,
      custumer_id: custumerId,
      store_id: req.params.store_id,
    });
    return res.json(appointment);
  }

  async indexDayOrEmployee(req, res) {
    // Timestamp date (date picker)
    const { date, employeeId } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date is not sended' });
    }
    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        store_id: req.params.store_id,
        employee_id: employeeId || {
          [Op.not]: null,
        },
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });
    return res.json(appointments);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.canceled_at = new Date();
    await appointment.save();
    return res.json(appointment);
  }
}
export default new AppointmentController();
