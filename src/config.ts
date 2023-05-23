import dotenv from 'dotenv';

dotenv.config();

export const {
    PORT,
    CTX,
    host,
    user,
    password,
    database,
    max,
    idleTimeoutMillis,
    connectionTimeoutMillis,
    SENDER_EMAIL,
    SENDER_PWD,
    SALT_ROUNDS,
} = process.env;
