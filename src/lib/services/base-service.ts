import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL!;

export const sql = neon(connectionString);

export class BaseService {
    protected sql = sql;
}
