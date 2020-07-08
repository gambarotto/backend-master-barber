import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AppointmentToolsController {
  async indexByCustumer(req, res) {
    const appointments = await Appointment.findAll({
      where: {
        custumer_id: req.params.custumer_id,
      },
    });

    res.json(appointments);
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
}
export default new AppointmentToolsController();
