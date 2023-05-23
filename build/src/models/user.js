'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.signIn =
    exports.updateUsers =
    exports.filterUsers =
    exports.getAllUsers =
    exports.signUp =
        void 0;
const db_1 = require('../db');
const queryDesigner_1 = require('../services/queryDesigner');
const bcrypt_1 = require('bcrypt');
const general_1 = require('../services/general');
const signUp = async (userToInsert) => {
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        const userValues = Object.values(userToInsert);
        const prepQuery = {
            name: 'signUp',
            text: 'INSERT INTO "user" (user_name, mail_address, pwd, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id',
            values: [...userValues],
        };
        const result = await client.query(prepQuery);
        await client.query('COMMIT');
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
exports.signUp = signUp;
const getAllUsers = async () => {
    const client = await db_1.pool.connect();
    try {
        const result = await client.query('SELECT * FROM "user"');
        const users = [];
        for (const element of result.rows) {
            const user = {
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
exports.getAllUsers = getAllUsers;
const filterUsers = async (filters, operation) => {
    const client = await db_1.pool.connect();
    try {
        const query = (0, queryDesigner_1.prepareSelectQuery)(
            'user',
            `filterUsers${operation}`,
            undefined,
            filters
        );
        const result = await client.query(query);
        const users = [];
        for (const element of result.rows) {
            const user = {
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
exports.filterUsers = filterUsers;
const updateUsers = async (updateValuesPerUser, users, operation) => {
    const client = await db_1.pool.connect();
    try {
        const rowsAffected = (0, general_1.rowsAffectedCounter)();
        client.query('BEGIN');
        for (const element of users) {
            const { user_id } = element;
            const filters = [
                {
                    key: 'user_id',
                    value: user_id,
                    operator: '=',
                },
            ];
            const userForUpdate = updateValuesPerUser.find(
                (current) => current.user_id === user_id
            );
            delete userForUpdate?.user_id;
            if (!userForUpdate)
                throw new Error(
                    'There are no arguments given for updating the given user'
                );
            const updateValues = [];
            for (const [key, value] of Object.entries(userForUpdate)) {
                const kvPair = {
                    key,
                    value,
                };
                updateValues.push(kvPair);
            }
            const preparedUpdateQuery = (0, queryDesigner_1.prepareUpdateQuery)(
                updateValues,
                filters,
                'user',
                `updateUsers${operation}`
            );
            // console.log(preparedUpdateQuery);
            const result = await client.query(preparedUpdateQuery);
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
exports.updateUsers = updateUsers;
const signIn = async (credentials) => {
    const client = await db_1.pool.connect();
    try {
        const { user_name, pwd } = credentials;
        const filters = [
            {
                key: 'user_name',
                operator: '=',
                value: user_name,
            },
        ];
        const query = (0, queryDesigner_1.prepareSelectQuery)(
            'user',
            'Login',
            ['user_name', 'pwd', 'forgot_pwd'],
            filters
        );
        const result = await client.query(query);
        const signInResponse = {
            success: false,
            message: '',
            forgot_pwd: 0,
        };
        if (result.rowCount > 0) {
            const pwdMatch = await (0, bcrypt_1.compare)(
                pwd,
                result.rows[0].pwd
            );
            if (pwdMatch) {
                signInResponse.success = true;
                signInResponse.message = 'Now you are logged in';
                signInResponse.forgot_pwd = result.rows[0].forgot_pwd;
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
        return signInResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};
exports.signIn = signIn;
