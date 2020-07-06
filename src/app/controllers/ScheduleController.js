/* eslint-disable camelcase */
import Sequelize from 'sequelize';
import databaseConfig from '../../config/database';

import Store from '../models/Store';
import Schedule from '../models/Schedule';
import Employee from '../models/Employee';
import formatSchedule from '../../utils/formatSchedule';

class ScheduleController {
  async store(req, res) {
    let owner = null;
    const OwnerType = req.body.owner_type;
    if (OwnerType === 'store') {
      owner = await Store.findByPk(req.body.owner_id);
      if (!owner) {
        return res.status(404).json({ error: 'Store not found' });
      }
    } else {
      owner = await Employee.findByPk(req.body.owner_id);
      if (!owner) {
        return res.status(404).json({ error: 'Employee not found' });
      }
    }

    const sequelize = new Sequelize(databaseConfig);
    const trx = await sequelize.transaction();

    /** Formatando o objeto schedule */
    const schHoliday = req.body.holiday;
    const data = {
      ...req.body,
      holiday:
        schHoliday.entrance.length === 0
          ? []
          : formatSchedule.scheduleHoliday(schHoliday),
      days_week: formatSchedule.scheduleWeek(req.body.days_week),
    };

    try {
      const schedule = await Schedule.create(data, { transaction: trx });
      owner.schedule_id = schedule.id;
      await owner.save({ transaction: trx });
      trx.commit();
      const {
        id,
        holiday,
        special,
        owner_id,
        owner_type,
        days_week,
      } = schedule;
      return res.json({
        id,
        holiday,
        special,
        owner_id,
        owner_type,
        days_week,
      });
    } catch (error) {
      trx.rollback();
      return res.status(400).json({ error: 'Error on save' });
    }
  }

  async update(req, res) {
    const schedule = await Schedule.findByPk(req.params.schedule_id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    const schHoliday = req.body.holiday;
    const data = {
      ...req.body,
      holiday:
        schHoliday.entrance.length === 0
          ? []
          : formatSchedule.scheduleHoliday(schHoliday),
      days_week: formatSchedule.scheduleWeek(req.body.days_week),
    };

    const {
      id,
      holiday,
      special,
      owner_id,
      owner_type,
      days_week,
    } = await schedule.update(data);
    return res.json({
      id,
      holiday,
      special,
      owner_id,
      owner_type,
      days_week,
    });
  }
}

export default new ScheduleController();
