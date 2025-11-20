import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import db from '../../config/database';
import { employees, stores, users, avatars } from '../../database/schema';
import { hashPassword, checkPassword } from '../../utils/password';

class EmployeeController {
  async index(req: Request, res: Response): Promise<Response> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const employeesList = await db
      .select()
      .from(employees)
      .where(eq(employees.jobId, user.storeId!));
    
    return res.json(employeesList);
  }

  async indexByStore(req: Request, res: Response): Promise<Response> {
    const employeesList = await db.query.employees.findMany({
      where: eq(employees.jobId, Number(req.params.store_id)),
      columns: {
        id: true,
        name: true,
        email: true,
        responsibility: true,
        jobId: true,
        scheduleId: true,
      },
      with: {
        avatar: {
          columns: {
            id: true,
            path: true,
          },
        },
      },
    });

    // Transformar para o formato esperado
    const formatted = employeesList.map((emp) => ({
      ...emp,
      job_id: emp.jobId,
      schedule_id: emp.scheduleId,
      avatar: emp.avatar
        ? {
            ...emp.avatar,
            url: `http://192.168.15.22:3333/avatars/${emp.avatar.path}`,
          }
        : null,
    }));

    return res.json(formatted);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .limit(1);
    
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const [employeeExists] = await db
      .select()
      .from(employees)
      .where(eq(employees.email, req.body.email))
      .limit(1);
    
    if (employeeExists) {
      return res.status(401).json({ error: 'Email already exists' });
    }

    const passwordHash = await hashPassword(req.body.password);
    const [newEmployee] = await db
      .insert(employees)
      .values({
        name: req.body.name,
        email: req.body.email,
        passwordHash,
        responsibility: req.body.responsibility,
        jobId: Number(req.params.store_id),
      })
      .returning({
        id: employees.id,
        name: employees.name,
        email: employees.email,
        responsibility: employees.responsibility,
      });

    return res.json(newEmployee);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, Number(req.params.employee_id)))
      .limit(1);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const { email, oldPassword } = req.body;
    if (email !== employee.email) {
      const [emailExists] = await db
        .select()
        .from(employees)
        .where(eq(employees.email, email))
        .limit(1);
      if (emailExists) {
        return res.status(401).json({ error: 'Email already exists' });
      }
    }
    
    if (oldPassword && !(await checkPassword(oldPassword, employee.passwordHash))) {
      return res.status(400).json({ error: 'Passwords does not match' });
    }

    const updateData: any = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.responsibility) updateData.responsibility = req.body.responsibility;
    if (req.body.password) {
      updateData.passwordHash = await hashPassword(req.body.password);
    }
    if (req.body.schedule_id) updateData.scheduleId = req.body.schedule_id;

    const [updated] = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, Number(req.params.employee_id)))
      .returning({
        name: employees.name,
        responsibility: employees.responsibility,
      });

    return res.json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const [deleted] = await db
      .delete(employees)
      .where(eq(employees.id, Number(req.params.employee_id)))
      .returning();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.json({ success: 'Ok' });
  }
}

export default new EmployeeController();
