import { BaseService } from "./base-service";

export interface User {
    id: string;
    user_type: "user" | "admin";
    name: string;
    email: string;
    password: string;
    created_at: string;
}

export type SafeUser = Omit<User, "password">;

class UserService extends BaseService {
    async createUser(data: {
        name: string;
        email: string;
        password: string;
        user_type?: "user" | "admin";
    }): Promise<SafeUser> {
        const userType = data.user_type || "user";
        const rows = await this.sql`
      INSERT INTO users (name, email, password, user_type)
      VALUES (${data.name}, ${data.email}, ${data.password}, ${userType})
      RETURNING id, user_type, name, email, created_at
    `;
        return rows[0] as SafeUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        const rows = await this.sql`
      SELECT * FROM users WHERE email = ${email}
    `;
        return (rows[0] as User) || null;
    }

    async findById(id: string): Promise<SafeUser | null> {
        const rows = await this.sql`
      SELECT id, user_type, name, email, created_at FROM users WHERE id = ${id}
    `;
        return (rows[0] as SafeUser) || null;
    }

    async getAllUsers(): Promise<SafeUser[]> {
        const rows = await this.sql`
      SELECT id, user_type, name, email, created_at FROM users ORDER BY created_at DESC
    `;
        return rows as SafeUser[];
    }

    async deleteUser(id: string): Promise<boolean> {
        const rows = await this.sql`
      DELETE FROM users WHERE id = ${id} RETURNING id
    `;
        return rows.length > 0;
    }

    async updateUser(
        id: string,
        data: { name?: string; password?: string; user_type?: "user" | "admin" }
    ): Promise<SafeUser | null> {
        const updates: string[] = [];
        const values: (string | "user" | "admin")[] = [];

        let paramIndex = 1;

        if (data.name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(data.name);
        }
        if (data.password !== undefined) {
            updates.push(`password = $${paramIndex++}`);
            values.push(data.password);
        }
        if (data.user_type !== undefined) {
            updates.push(`user_type = $${paramIndex++}`);
            values.push(data.user_type);
        }

        if (updates.length === 0) return this.findById(id);

        values.push(id);
        const queryText = `
            UPDATE users 
            SET ${updates.join(", ")}
            WHERE id = $${paramIndex}
            RETURNING id, user_type, name, email, created_at
        `;

        try {
            const rows = await (this.sql as any)([queryText], ...values);
            return (rows[0] as SafeUser) || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export const userService = new UserService();
