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
        data: { name?: string; password?: string }
    ): Promise<SafeUser | null> {
        const updates: string[] = [];
        const values: (string | undefined)[] = [];

        if (data.name !== undefined) {
            updates.push("name");
            values.push(data.name);
        }
        if (data.password !== undefined) {
            updates.push("password");
            values.push(data.password);
        }

        if (updates.length === 0) return this.findById(id);

        if (data.name && data.password) {
            const rows = await this.sql`
        UPDATE users SET name = ${data.name}, password = ${data.password}
        WHERE id = ${id}
        RETURNING id, user_type, name, email, created_at
      `;
            return (rows[0] as SafeUser) || null;
        } else if (data.name) {
            const rows = await this.sql`
        UPDATE users SET name = ${data.name}
        WHERE id = ${id}
        RETURNING id, user_type, name, email, created_at
      `;
            return (rows[0] as SafeUser) || null;
        } else if (data.password) {
            const rows = await this.sql`
        UPDATE users SET password = ${data.password}
        WHERE id = ${id}
        RETURNING id, user_type, name, email, created_at
      `;
            return (rows[0] as SafeUser) || null;
        }

        return null;
    }
}

export const userService = new UserService();
