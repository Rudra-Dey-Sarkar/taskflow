# Prime Access Task Manager

A secure, scalable, role-based Task Management SaaS application built with Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, and Neon PostgreSQL.

## Features

- **Authentication**: JWT-based authentication using HTTP-only cookies and bcrypt for password hashing.
- **Role-Based Access Control**: `user` and `admin` roles, protected by Next.js Edge Middleware.
- **Task Management**: Full CRUD capabilities for tasks. Users manage their own tasks, while Admins have full access to view, edit, or delete any task.
- **Admin Panel**: Dedicated dashboard for administrators to view and manage registered users and global project statistics.
- **Modern UI**: Polished interface powered by ShadCN UI, Tailwind CSS, and Lucide Icons.
- **API Versioning**: Scalable `v1` API route structure.
- **Edge Compatible**: Custom JWT handling with `jose` to support Next.js Edge Runtime middleware.

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, ShadCN UI, React Hook Form, Zod.
- **Backend**: Next.js Route Handlers, Node.js.
- **Database**: Neon (Serverless PostgreSQL), plain SQL migrations.
- **Security**: jose (Edge environment JWTs), bcryptjs.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Neon PostgreSQL Database (or any PostgreSQL instance)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd prime-access-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add:
   ```env
   DATABASE_URL="postgres://<user>:<password>@<host>/<database>?sslmode=require"
   JWT_SECRET="your_super_secret_jwt_key"
   ```

4. Run Database Migrations:
   This project uses a custom migration script to keep things lightweight. Run the script to create the required tables (`users` and `tasks`):
   ```bash
   npm run migrate
   ```
   *(Or run `npx tsx migrations/migrate.ts` manually)*

5. Start the Development Server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and explore.

---

## 🔑 Authentication & Roles

- **Sign Up**: Create an account via `/auth/register`. New accounts default to the `user` role.
- **Log In**: Access your account via `/auth/login`. This sets an HTTP-only JWT cookie.
- **Promoting an Admin**: To test the admin panel, you must manually change the `user_type` column to `admin` in your PostgreSQL database for a specific user:
  ```sql
  UPDATE users SET user_type = 'admin' WHERE email = 'your@email.com';
  ```

---

## 📡 API Endpoints (v1)

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Authenticate and receive a JWT cookie
- `POST /api/v1/auth/logout` - Clear the JWT cookie
- `GET /api/v1/auth/me` - Get current authenticated user details

### Tasks
- `GET /api/v1/tasks` - List tasks (Users see their own, Admins see all)
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/:id` - Get a specific task
- `PUT /api/v1/tasks/:id` - Update a task (Users can update own, Admins can update any)
- `DELETE /api/v1/tasks/:id` - Delete a task (Users can delete own, Admins can delete any)

### Users (Admin Only)
- `GET /api/v1/users` - List all registered users
- `GET /api/v1/users/:id` - Get a specific user profile
- `DELETE /api/v1/users/:id` - Delete a user and their associated tasks

---

## 🏗️ Architecture & Scalability

This application is designed with scalability in mind:

1. **Service Layer Pattern**: Database logic is isolated in `/src/lib/services`. This allows controllers/route-handlers to remain thin. If the database provider changes or a caching layer (like Redis) is introduced, only the services need to be modified.
2. **Stateless Authentication**: JWTs stored in HTTP-only cookies prevent XSS while allowing the application backend to remain completely stateless.
3. **Edge Middleware**: Using `jose` instead of `jsonwebtoken` ensures that authentication verification happens at the Next.js Edge layer. Unauthorized requests are rejected before hitting the core application server, reducing server load.
4. **Serverless Database**: Integration with Neon PostgreSQL seamlessly scales connections for serverless functions, preventing connection exhaustion typical in traditional standard RDS instances.

## 🛡️ Validation & Security

- **Inputs**: All incoming API requests are strictly validated using `Zod` schemas.
- **Passwords**: Hashed with `bcryptjs` with salt round factors.
- **Data Protection**: APIs check the `user_id` on the fetched resources vs the `user_id` inside the verified JWT to prevent IDOR (Insecure Direct Object Reference).

## Developed For
Backend Developer (Intern) Assignment.
