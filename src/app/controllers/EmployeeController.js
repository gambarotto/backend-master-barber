import Employee from '../models/Employee';
import Store from '../models/Store';
import User from '../models/User';

class EmployeeController {
  async index(req, res) {
    const user = await User.findByPk(req.userId);
    const employees = await Employee.findAll({
      where: { job_id: user.store_id },
    });
    return res.json(employees);
  }

  async store(req, res) {
    const store = await Store.findByPk(req.params.store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    const employeeExists = await Employee.findOne({
      where: { email: req.body.email },
    });
    if (employeeExists) {
      return res.status(401).json({ error: 'Email already exists' });
    }

    const { id, name, email, responsibility } = await Employee.create(req.body);

    return res.json({
      id,
      name,
      email,
      responsibility,
    });
  }

  async update(req, res) {
    const employee = await Employee.findByPk(req.params.employee_id);
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
      schedule,
      // eslint-disable-next-line camelcase
      days_off,
    } = await employee.update(req.body);

    return res.json({
      name,
      responsibility,
      schedule,
      days_off,
    });
  }

  async delete(req, res) {
    const employee = await Employee.findByPk(req.params.employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.destroy();

    return res.json({ success: 'Ok' });
  }
}

export default new EmployeeController();
