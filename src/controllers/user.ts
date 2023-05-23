import { filterUsers, signIn, signUp, updateUsers } from '../models/user';
import { Request, Response } from 'express';
import { parseUserForInsertion, parseUserForSignIn } from '../services/user';
import { FilterParameter, SignInResponse, User, UserForSignIn } from '../types';
import { randomBytes } from 'crypto';
import * as mailer from '../services/mailer';
import { Options } from 'nodemailer/lib/mailer';
import { encrypt } from '../services/encrypter';

export const signUpController = async (req: Request, res: Response) => {
    try {
        const newUser = await parseUserForInsertion(req.body);
        const insertedUser = await signUp(newUser);

        res.status(200).json({
            code: 200,
            message: 'You have signed up in "Tiny Store"',
            data: insertedUser.rows,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('Unexpected error');
        }
    }
};

export const signInController = async (req: Request, res: Response) => {
    try {
        const signInSubject: UserForSignIn = await parseUserForSignIn(req.body);
        const signInResponse: SignInResponse = await signIn(signInSubject);

        res.status(200).json({
            code: 200,
            message: signInResponse.message,
            data: {
                signInResponse,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('Unexpected error');
        }
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const filters: Array<FilterParameter> = [
            {
                key: 'mail_address',
                value: req.body.mail_address,
                operator: '=',
            },
        ];

        const provisionalPwd = randomBytes(8).toString('hex');

        const users: Array<User> = await filterUsers(filters, 'ForgotPassword');

        if (users.length > 0) {
            const user: User = users[0];
            const updateValues: Partial<User> = {
                user_id: user.user_id,
                pwd: await encrypt(provisionalPwd),
                forgot_pwd: 1,
            };

            const rowsAffected: number = await updateUsers(
                [updateValues],
                [user],
                'ForgotPassword'
            );

            const body: Options = {
                from: process.env.SENDER_EMAIL,
                to: req.body.mail_address,
                subject: 'Provisional Password',
                html: `<div>Here is your provisional password for Tiny Store: ${provisionalPwd}</div>`,
            };
            mailer.send(body);

            res.status(200).json({
                code: 200,
                message: 'A provisional password was sent to your mail',
                rowsAffected,
            });
        } else {
            throw new Error(
                'There are no users who match with the given filters'
            );
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('Unexpected error');
        }
    }
};
