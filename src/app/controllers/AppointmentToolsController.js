import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import Employee from '../models/Employee';
import Store from '../models/Store';
import Avatar from '../models/Avatar';
import Image from '../models/Image';

class AppointmentToolsController {
  async indexByCustumer(req, res) {
    const appointments = await Appointment.findAll({
      where: {
        custumer_id: req.params.custumer_id,
      },
      attributes: [
        'id',
        'past',
        'cancelable',
        'date',
        'canceled_at',
        'validated',
      ],
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name'],
          include: [
            {
              model: Image,
              as: 'image',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'name'],
          include: [
            {
              model: Avatar,
              as: 'avatar',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
      ],
      order: [['date', 'DESC']],
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
