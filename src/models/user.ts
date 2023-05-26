import {
    UserForInsertion,
    PreparedQuery,
    User,
    FilterParameter,
    UserForSignIn,
    SignInResponse,
    KeyValuePair,
} from '../types';
import { pool } from '../db';
import { PoolClient, QueryResult } from 'pg';
import {
    endTransaction,
    prepareSelectQuery,
    prepareUpdateQuery,
} from '../services/queryDesigner';
import { compare } from 'bcrypt';
import { rowsAffectedCounter } from '../services/general';
import { signUser } from './token';

export const signUp = async (
    userToInsert: UserForInsertion
): Promise<QueryResult> => {
    const client: PoolClient = await pool.connect();
    try {
        await client.query('BEGIN');
        const userValues: Array<any> = Object.values(userToInsert);

        const prepQuery: PreparedQuery = {
            name: 'signUp',
            text: 'INSERT INTO "user" (user_name, mail_address, pwd, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id',
            values: [...userValues],
        };

        const result: QueryResult = await client.query(prepQuery);

        await endTransaction(client);

        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    } finally {
        client.release();
    }
};

export const getAllUsers = async () => {
    const client: PoolClient = await pool.connect();
    try {
        const result: QueryResult = await client.query('SELECT * FROM "user"');
        const users: Array<User> = [];
        for (const element of result.rows) {
            const user: User = {
                ...element,
            };
            users.push(user);
        }
        return users;
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

export const filterUsers = async (
    filters: Array<FilterParameter>,
    operation: string
): Promise<Array<User>> => {
    const client: PoolClient = await pool.connect();
    try {
        const query = prepareSelectQuery(
            'user',
            `filterUsers${operation}`,
            undefined,
            filters
        );
        const result: QueryResult = await client.query(query);
        const users: Array<User> = [];
        for (const element of result.rows) {
            const user: User = {
                ...element,
            };
            users.push(user);
        }
        return users;
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

export const updateUsers = async (
    updateValuesPerUser: Array<Partial<User>>,
    users: Array<User>,
    operation: string
): Promise<number> => {
    const client: PoolClient = await pool.connect();
    try {
        const rowsAffected = rowsAffectedCounter();
        client.query('BEGIN');
        for (const element of users) {
            const { user_id } = element;
            const filters: Array<FilterParameter> = [
                {
                    key: 'user_id',
                    value: user_id,
                    operator: '=',
                },
            ];

            const userForUpdate: Partial<User> | undefined =
                updateValuesPerUser.find(
                    (current) => current.user_id === user_id
                );

            delete userForUpdate?.user_id;

            if (!userForUpdate)
                throw new Error(
                    'There are no arguments given for updating the given user'
                );

            const updateValues: Array<KeyValuePair> = [];
            for (const [key, value] of Object.entries(userForUpdate)) {
                const kvPair: KeyValuePair = {
                    key,
                    value,
                };
                updateValues.push(kvPair);
            }

            const preparedUpdateQuery: PreparedQuery = prepareUpdateQuery(
                updateValues,
                filters,
                'user',
                `updateUsers${operation}`
            );
            // console.log(preparedUpdateQuery);
            const result: QueryResult = await client.query(preparedUpdateQuery);

            result.rowCount > 0 && rowsAffected();
        }

        await client.query('COMMIT');
        return rowsAffected();
    } catch (error) {
        await client.query('ROLLBACK');
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    } finally {
        client.release();
    }
};

export const signIn = async (
    credentials: UserForSignIn
): Promise<SignInResponse> => {
    const client: PoolClient = await pool.connect();
    try {
        client.query('BEGIN');
        const { user_name, pwd } = credentials;
        const filters: Array<FilterParameter> = [
            {
                key: 'user_name',
                operator: '=',
                value: user_name,
            },
        ];
        const query: PreparedQuery = prepareSelectQuery(
            'user',
            'Login',
            ['user_id', 'user_name', 'pwd', 'forgot_pwd'],
            filters
        );
        const result: QueryResult = await client.query(query);

        const signInResponse: SignInResponse = {
            success: false,
            message: '',
            forgot_pwd: 0,
            tokens: {},
        };

        if (result.rowCount > 0) {
            const pwdMatch = await compare(pwd, result.rows[0].pwd);
            if (pwdMatch) {
                signInResponse.success = true;
                signInResponse.message = 'Now you are logged in';
                signInResponse.forgot_pwd = result.rows[0].forgot_pwd;
                signInResponse.tokens = await signUser(result.rows[0], client);
            } else {
                signInResponse.success = false;
                signInResponse.message = 'The given password is incorrect';
                delete signInResponse.forgot_pwd;
            }
        } else {
            signInResponse.success = false;
            signInResponse.message =
                // eslint-disable-next-line quotes
                "The given username doesn't exists in our database";
            delete signInResponse.forgot_pwd;
        }
        
        await endTransaction(client);

        return signInResponse;
    } catch (error) {
        await client.query('ROLLBACK');
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    } finally {
        client.release();
    }
};
