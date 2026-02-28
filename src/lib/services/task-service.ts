import { BaseService } from "./base-service";

export interface Task {
    id: string;
    user_id: string;
    name: string;
    description: string;
    is_complete: boolean;
    created_at: string;
}

class TaskService extends BaseService {
    async createTask(
        userId: string,
        data: { name: string; description?: string }
    ): Promise<Task> {
        const description = data.description || "";
        const rows = await this.sql`
      INSERT INTO tasks (user_id, name, description)
      VALUES (${userId}, ${data.name}, ${description})
      RETURNING *
    `;
        return rows[0] as Task;
    }

    async getTasksByUser(userId: string): Promise<Task[]> {
        const rows = await this.sql`
      SELECT * FROM tasks WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
        return rows as Task[];
    }

    async getAllTasks(): Promise<(Task & { user_name?: string; user_email?: string })[]> {
        const rows = await this.sql`
      SELECT t.*, u.name as user_name, u.email as user_email
      FROM tasks t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;
        return rows as (Task & { user_name?: string; user_email?: string })[];
    }

    async getTaskById(id: string): Promise<Task | null> {
        const rows = await this.sql`
      SELECT * FROM tasks WHERE id = ${id}
    `;
        return (rows[0] as Task) || null;
    }

    async updateTask(
        id: string,
        data: { name?: string; description?: string; is_complete?: boolean },
        userId: string,
        isAdmin: boolean
    ): Promise<Task | null> {
        const task = await this.getTaskById(id);
        if (!task) return null;
        if (!isAdmin && task.user_id !== userId) {
            throw new Error("FORBIDDEN");
        }

        const name = data.name ?? task.name;
        const description = data.description ?? task.description;
        const isComplete = data.is_complete ?? task.is_complete;

        const rows = await this.sql`
      UPDATE tasks
      SET name = ${name}, description = ${description}, is_complete = ${isComplete}
      WHERE id = ${id}
      RETURNING *
    `;
        return (rows[0] as Task) || null;
    }

    async deleteTask(
        id: string,
        userId: string,
        isAdmin: boolean
    ): Promise<boolean> {

        const task = await this.getTaskById(id);
        if (!task) return false;
        if (!isAdmin && task.user_id !== userId) {
            throw new Error("FORBIDDEN");
        }

        const rows = await this.sql`
      DELETE FROM tasks WHERE id = ${id} RETURNING id
    `;
        return rows.length > 0;
    }
}

export const taskService = new TaskService();
