'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GetAllRoles = void 0;
const db_1 = require('../db');
const GetAllRoles = async () => {
    const client = await db_1.pool.connect();
    try {
        const result = await client.query('SELECT * FROM "role"');
        const roles = [];
        for (const element of result.rows) {
            const role = {
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
exports.GetAllRoles = GetAllRoles;
