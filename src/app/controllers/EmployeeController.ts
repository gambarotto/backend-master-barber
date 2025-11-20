import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

import { db } from '../../config/database';
import { employees, stores, users, avatars } from '../../db/schemas';
import { hashPassword, checkPassword } from '../../utils/password';

type User = InferSelectModel<typeof users>;
type Employee = InferSelectModel<typeof employees>;
type Store = InferSelectModel<typeof stores>;

class EmployeeController {
  async index(req: Request, res: Response): Promise<Response> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!))
      .limit(1);
    const user: User | undefined = result[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const employeesList = await db
      .select()
      .from(employees)
      .where(eq(employees.job_id, user.store_id!));

    return res.json(employeesList);
  }

  async indexByStore(req: Request, res: Response): Promise<Response> {
    const employeesList = await db.query.employees.findMany({
      where: eq(employees.job_id, Number(req.params.store_id)),
      columns: {
        id: true,
        name: true,
        email: true,
        responsibility: true,
        job_id: true,
        schedule_id: true,
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
    const storeResult = await db
      .select()
      .from(stores)
      .where(eq(stores.id, Number(req.params.store_id)))
      .limit(1);
    const store: Store | undefined = storeResult[0];

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const { name, email, password, responsibility } = req.body as {
      name: string;
      email: string;
      password: string;
      responsibility: string;
    };
    const employeeResult = await db
      .select()
      .from(employees)
      .where(eq(employees.email, email))
      .limit(1);
    const employeeExists: Employee | undefined = employeeResult[0];

    if (employeeExists) {
      return res.status(401).json({ error: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const [newEmployee] = await db
      .insert(employees)
      .values({
        name,
        email,
        password_hash: passwordHash,
        responsibility,
        job_id: Number(req.params.store_id),
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
    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.id, Number(req.params.employee_id)))
      .limit(1);
    const employee: Employee | undefined = result[0];

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const { email, oldPassword, name, responsibility, password, schedule_id } =
      req.body as {
        email?: string;
        oldPassword?: string;
        name?: string;
        responsibility?: string;
        password?: string;
        schedule_id?: number;
      };
    if (email && email !== employee.email) {
      const emailResult = await db
        .select()
        .from(employees)
        .where(eq(employees.email, email))
        .limit(1);
      const emailExists: Employee | undefined = emailResult[0];
      if (emailExists) {
        return res.status(401).json({ error: 'Email already exists' });
      }
    }

    if (
      oldPassword &&
      !(await checkPassword(oldPassword, employee.password_hash))
    ) {
      return res.status(400).json({ error: 'Passwords does not match' });
    }

    const updateData: {
      name?: string;
      email?: string;
      responsibility?: string;
      password_hash?: string;
      schedule_id?: number;
    } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (responsibility) updateData.responsibility = responsibility;
    if (password) {
      updateData.password_hash = await hashPassword(password);
    }
    if (schedule_id) updateData.schedule_id = schedule_id;

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
    const result = await db
      .delete(employees)
      .where(eq(employees.id, Number(req.params.employee_id)))
      .returning();
    const deleted: Employee | undefined = result[0];

    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.json({ success: 'Ok' });
  }
}

export default new EmployeeController();
