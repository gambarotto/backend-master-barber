import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Employee from '../models/Employee';
import authConfig from '../../config/auth';

async function employeeAuth(req, res, next) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(400).json({ error: 'Token not provider' });
  }

  const [, token] = authHeaders.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    const employee = await Employee.findByPk(decoded.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee Auth invalid' });
    }
    req.employeeId = employee.id;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

export default employeeAuth;
