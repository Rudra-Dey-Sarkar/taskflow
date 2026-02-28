# TaskFlow - Task Management Platform

A secure, scalable, and role-based task management SaaS application built using Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, and Neon PostgreSQL.

## Core Features

- **Authentication System**: Secure JWT-based authentication using HTTP-only cookies and bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct user and admin roles, safeguarded by Next.js Edge Middleware for routing and API protection.
- **Task Management**: Comprehensive CRUD capabilities. Regular users manage their personal tasks, while administrators possess full oversight to view, edit, or delete any task across the platform.
- **Administrative Dashboard**: A dedicated panel for administrators to monitor registered users, manage roles, and track overall platform statistics.
- **Dynamic Theming**: Built-in support for light and dark modes, utilizing next-themes for seamless transitions without hydration mismatches.
- **Modern Interface**: A polished, responsive user interface powered by ShadCN UI, Tailwind CSS, and Lucide icons.
- **API Architecture**: A well-structured, versioned API (v1) designed for scalability.
- **Edge Compatibility**: Custom JWT verification using the jose library to ensure full compatibility with Next.js Edge Runtime middleware.

## Technology Stack

- **Frontend Core**: Next.js 15 (App Router), React, TypeScript
- **Styling & UI**: Tailwind CSS, ShadCN UI, next-themes
- **Forms & Validation**: React Hook Form, Zod
- **Backend Architecture**: Next.js Route Handlers (Node.js/Edge environments)
- **Database Operations**: Neon (Serverless PostgreSQL), standard pg driver for seeding and migrations
- **Security implementation**: jose (Edge environment JWTs), bcryptjs

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Neon PostgreSQL Database connection string (or any standard PostgreSQL instance)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and populate it with your specific credentials:
   ```env
   DATABASE_URL="postgres://<user>:<password>@<host>/<database>?sslmode=require"
   JWT_SECRET="your_secure_random_jwt_secret_key"
   ADMIN_EMAIL="admin@taskflow.com"
   ADMIN_PASSWORD="@TaskFlow9595"
   ```

4. **Initialize Database and Seed Admin User:**
   The project includes a robust seeding script that automatically runs the necessary SQL migrations to create the `users` and `tasks` tables, and provisions the initial administrator account based on your environment variables.
   ```bash
   npm run db-seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Access the Application:**
   Open a browser and navigate to `http://localhost:3000`.

---

## Authentication Flow and Roles

- **Registration**: New accounts can be created via `/auth/register`. By default, all new accounts are assigned the standard `user` role.
- **Login**: Authentication is handled at `/auth/login`. Upon success, a secure HTTP-only JWT cookie is set. Authenticated users attempting to visit the root path are automatically redirected to their respective dashboards.
- **Admin Access**: The initial administrator account is created during the `npm run db:seed` step. Log in with those credentials to access the `/admin` panel, which provides full control over all users and tasks.

---

## Database Schema Overview

The application utilizes a streamlined relational schema:

**users Table:**
- `id` (UUID, Primary Key)
- `user_type` (VARCHAR, 'user' or 'admin')
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, hashed)
- `created_at` (TIMESTAMPTZ)

**tasks Table:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key referencing users.id, Cascade Delete)
- `name` (VARCHAR)
- `description` (TEXT)
- `is_complete` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

---

## API Endpoints (v1)

### Authentication
- `POST /api/v1/auth/register` - Register a new user account
- `POST /api/v1/auth/login` - Authenticate credentials and receive a JWT cookie
- `POST /api/v1/auth/logout` - Invalidate the session by clearing the JWT cookie
- `GET /api/v1/auth/me` - Retrieve the profile details of the currently authenticated user

### Tasks
- `GET /api/v1/tasks` - List tasks (Users retrieve their own; Admins retrieve all system tasks)
- `POST /api/v1/tasks` - Create a new task entry
- `GET /api/v1/tasks/[id]` - Retrieve details for a specific task
- `PUT /api/v1/tasks/[id]` - Update task details or completion status
- `DELETE /api/v1/tasks/[id]` - Remove a task from the system

### Users (Administrative Access Only)
- `GET /api/v1/users` - Retrieve a list of all registered users
- `GET /api/v1/users/[id]` - Retrieve profile details for a specific user
- `PUT /api/v1/users/[id]` - Modify a user's details, including role escalation or password resets
- `DELETE /api/v1/users/[id]` - Permanently remove a user and cascade delete all their associated tasks

---

## Architecture and Scalability Considerations

This application is architected to support future growth and maintainability:

1. **Service Layer Abstraction**: Database interactions are isolated within `/src/lib/services`. This keeps route handlers focused entirely on HTTP logic. If the underlying database technology changes or a caching mechanism (like Redis) is introduced, modifications are confined to the service layer.
2. **Stateless Authentication Mechanism**: By storing JWTs in HTTP-only cookies, the application mitigates XSS vulnerabilities while allowing the backend to operate without maintaining server-side session state, facilitating horizontal scaling.
3. **Edge-Optimized Middleware**: Utilizing the `jose` library ensures that JWT verification executes efficiently at the Next.js Edge layer. Unauthorized traffic is intercepted and redirected before ever reaching the core application server, significantly reducing unnecessary compute load.
4. **Serverless Database Integration**: The integration with Neon PostgreSQL handles connection pooling effectively for serverless environments, preventing the connection exhaustion issues frequently encountered when connecting serverless functions to traditional RDS instances.

## Validation and Security Measures

- **Input Sanitization and Validation**: All incoming API requests are rigorously validated against Zod schemas before processing.
- **Cryptographic Hashing**: User passwords are encrypted using bcryptjs with appropriate salt rounds.
- **Authorization Checks**: APIs perform strict validations comparing the `user_id` of the requested resource against the `id` contained within the verified JWT to prevent Insecure Direct Object Reference (IDOR) vulnerabilities. Admins possess bypass privileges for these ownership checks.
