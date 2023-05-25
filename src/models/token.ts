import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, CTX } from '../config';
import { QueryResult, PoolClient } from 'pg';
import { prepareInsertQuery } from '../services/queryDesigner';
import { KeyValuePair, TokenForInsertion, Credentials } from '../types';

const generateAccessToken = (user: object): string => {
    try {
        if (ACCESS_TOKEN_SECRET === undefined)
            throw new Error('Missing ACCESS_TOKEN_SECRET');
        return jwt.sign({ user }, ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
    } catch (error) {
        CTX === 'dev' && console.log(error);
        if (error instanceof Error) {
            throw new Error(
                `${error.message}. ${
                    CTX === 'dev' ? `Path ${__dirname}${__filename}` : ''
                }`
            );
        } else {
            throw new Error('Unexpected error');
        }
    }
};

const generateRefreshToken = (user: object): string => {
    try {
        if (REFRESH_TOKEN_SECRET === undefined)
            throw new Error('Missing REFRESH_TOKEN_SECRET');
        return jwt.sign({ user }, REFRESH_TOKEN_SECRET);
    } catch (error) {
        CTX === 'dev' && console.log(error);
        if (error instanceof Error) {
            throw new Error(
                `${error.message}. ${
                    CTX === 'dev' ? `Path ${__dirname}${__filename}` : ''
                }`
            );
        } else {
            throw new Error('Unexpected error');
        }
    }
};

export const insertToken = async (
    tokenToInsert: TokenForInsertion,
    client: PoolClient
): Promise<QueryResult> => {
    try {
        const insertValues: KeyValuePair[] = [];
        for (const [key, value] of Object.entries(tokenToInsert)) {
            const kvPair = {
                key,
                value,
            };
            insertValues.push(kvPair);
        }

        const prepQuery = prepareInsertQuery(
            'insertToken',
            insertValues,
            'token'
        );

        const result: QueryResult = await client.query(prepQuery);

        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};

export const signUser = async (
    user: any,
    client: PoolClient
): Promise<Credentials> => {
    try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const token = {
            refresh_token: refreshToken,
            creation_date: new Date(),
            user_id: user.user_id
        };

        await insertToken(token, client);

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        CTX === 'dev' && console.log(error);
        if (error instanceof Error) {
            throw new Error(
                `${error.message}. ${
                    CTX === 'dev' ? `Path ${__dirname}${__filename}` : ''
                }`
            );
        } else {
            throw new Error('Unexpected error');
        }
    }
};
