import Employee from '../models/Employee';
import Store from '../models/Store';
import Address from '../models/Address';

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
    const employee = await Employee.findByPk(req.employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.destroy();

    return res.json({ success: 'Ok' });
  }
}
export default new OwnEmployeeController();
