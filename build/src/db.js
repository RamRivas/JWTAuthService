'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.pool = void 0;
const pg_1 = require('pg');
// export const pool: Pool = new Pool({
//     host: 'localhost',
//     user: 'postgres',
//     password: 'pgAhuacate',
//     database: 'tiny_store',
//     max: 20,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000,
// });
console.log(process.env.password);
exports.pool = new pg_1.Pool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    max: process.env.max,
    idleTimeoutMillis: process.env.idleTimeoutMillis,
    connectionTimeoutMillis: process.env.connectionTimeoutMillis,
});
// export const pool: Pool = new Pool(DBConfig);
