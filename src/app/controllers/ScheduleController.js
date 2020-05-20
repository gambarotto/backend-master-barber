/* eslint-disable camelcase */
import Store from '../models/Store';
import Schedule from '../models/Schedule';
import Employee from '../models/Employee';

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
    const schedule = await Schedule.create(req.body);
    if (!schedule) {
      return res.status(401).json({ error: 'Error on save' });
    }
    owner.schedule_id = schedule.id;
    await owner.save();
    const { id, holiday, special, owner_id, owner_type, days_week } = schedule;
    return res.json({
      id,
      holiday,
      special,
      owner_id,
      owner_type,
      days_week,
    });
  }

  async update(req, res) {
    const schedule = await Schedule.findByPk(req.params.schedule_id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const { id, saturday, sunday, holiday, special } = await schedule.update(
      req.body
    );
    return res.json({
      id,
      saturday,
      sunday,
      holiday,
      special,
    });
  }
}

export default new ScheduleController();
