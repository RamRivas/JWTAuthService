import { Pool } from 'pg';
import {
    HOST,
    USER,
    PASSWORD,
    DATABASE,
    MAX,
    IDLETIMEOUTMILLIS,
    CONNECTIONTIMEOUTMILLIS,
} from './config';

export const pool: Pool = new Pool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    max: MAX as unknown as number,
    idleTimeoutMillis: IDLETIMEOUTMILLIS as unknown as number,
    connectionTimeoutMillis: CONNECTIONTIMEOUTMILLIS as unknown as number,
});

// export const pool: Pool = new Pool(DBConfig);
