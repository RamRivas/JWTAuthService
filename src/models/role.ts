import { Role } from '../types';
import { pool } from '../db';
import { PoolClient, QueryResult } from 'pg';

export const GetAllRoles = async (): Promise<Array<Role>> => {
    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query('SELECT * FROM "role"');

        const roles: Array<Role> = [];
        for (const element of result.rows) {
            const role: Role = {
                ...element,
            };
            roles.push(role);
        }

        return roles;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    } finally {
        client.release();
    }
};
