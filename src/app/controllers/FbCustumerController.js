/* eslint-disable camelcase */
import Custumer from '../models/Custumer';
import FbCustumer from '../models/FbCustumer';

class FbCustumerController {
  // async index(req, res) {
  //   const custumer = await Custumer.findByPk(req.custumer_id);

  //   return res.json(custumer);
  // }

  async store(req, res) {
    const custumer = await Custumer.findByPk(req.params.custumer_id);
    if (!custumer) {
      return res.status(404).json({ error: 'Custumer not found' });
    }

    const { id_facebook } = await FbCustumer.create({
      id_facebook: req.body.id_facebook,
      token: req.body.token,
      avatar_url: req.body.avatar_url,
    });

    const { id, name, email, id_fb } = await custumer.update({
      name: req.body.name,
      email: req.body.email,
      id_fb: id_facebook,
    });

    return res.json({
      id,
      name,
      email,
      id_fb,
    });
  }

  //   async update(req, res) {
  //     const employee = await Employee.findByPk(req.params.employee_id);
  //     if (!employee) {
  //       return res.status(404).json({ error: 'Employee not found' });
  //     }
  //     const { email, oldPassword } = req.body;
  //     if (email !== employee.email) {
  //       const emailExists = await Employee.findOne({
  //         where: { email },
  //       });
  //       if (emailExists) {
  //         return res.status(401).json({ error: 'Email already exists' });
  //       }
  //     }
  //     if (oldPassword && !(await employee.checkPassword(oldPassword))) {
  //       return res.status(400).json({ error: 'Passwords does not match' });
  //     }

  //     const {
  //       name,
  //       responsibility,
  //       schedule,
  //       // eslint-disable-next-line camelcase
  //       days_off,
  //     } = await employee.update(req.body);

  //     return res.json({
  //       name,
  //       responsibility,
  //       schedule,
  //       days_off,
  //     });
  //   }

  //   async delete(req, res) {
  //     const employee = await Employee.findByPk(req.params.employee_id);
  //     if (!employee) {
  //       return res.status(404).json({ error: 'Employee not found' });
  //     }

  //     await employee.destroy();

  //     return res.json({ success: 'Ok' });
  //   }
}

export default new FbCustumerController();
