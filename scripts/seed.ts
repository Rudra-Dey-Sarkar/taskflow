import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is not set in .env.local");
    process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD is not set in .env.local");
    process.exit(1);
}

const client = new Client({
    connectionString: DATABASE_URL,
});

async function runSeed() {
    try {
        console.log("Starting database seeding...");
        await client.connect();

        // 1. Run Migrations
        const migrationsDir = path.join(process.cwd(), "migrations");
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));

        files.sort();

        for (const file of files) {
            console.log(`Running migration:- ${file} `);
            const filePath = path.join(migrationsDir, file);
            const statement = fs.readFileSync(filePath, "utf8");
            await client.query(statement);
            console.log(`Completed:- ${file} `);
        }

        // 2. Seed Admin User
        console.log("Seeding admin user...");

        // Check if admin already exists
        const { rows: existingAdmins } = await client.query('SELECT id FROM users WHERE email = $1', [ADMIN_EMAIL]);

        if (existingAdmins.length > 0) {
            console.log("Admin user already exists. Skipping insertion.");
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD as string, 10);

            // Insert admin
            await client.query(
                `INSERT INTO users(name, email, password, user_type) VALUES($1, $2, $3, $4)`,
                ['Admin', ADMIN_EMAIL, hashedPassword, 'admin']
            );
            console.log("Admin user seeded successfully!");
        }

        console.log("Seeding complete!");
        await client.end();
        process.exit(0);

    } catch (error) {
        console.error("Seeding failed:", error);
        await client.end();
        process.exit(1);
    }
}

runSeed();
