import { Pool } from 'pg';
import {
    host,
    user,
    password,
    database,
    max,
    idleTimeoutMillis,
    connectionTimeoutMillis,
} from './config';

export const pool: Pool = new Pool({
    host,
    user,
    password,
    database,
    max: max as unknown as number,
    idleTimeoutMillis: idleTimeoutMillis as unknown as number,
    connectionTimeoutMillis: connectionTimeoutMillis as unknown as number,
});

// export const pool: Pool = new Pool(DBConfig);
