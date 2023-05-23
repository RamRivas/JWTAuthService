import { filterUsers } from '../models/user';
import {
    FilterParameter,
    User,
    UserForInsertion,
    UserForSignIn,
} from '../types';
import { encrypt } from './encrypter';
import { isString } from './general';
import { parseRole } from './role';

const parseUsername = async (
    usernameFromRequest: string,
    forInsert: boolean
): Promise<string> => {
    try {
        if (!isString(usernameFromRequest)) {
            throw new Error('Incorrect format or missing user name');
        }
        if (forInsert) {
            if (!(await isNotAnExistingUserName(usernameFromRequest))) {
                throw new Error('The given username already exists');
            }
        }

        return usernameFromRequest;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};

const parsePwd = async (
    pwdFromRequest: any,
    forInsert: boolean
): Promise<string> => {
    if (!isString(pwdFromRequest)) {
        throw new Error('Incorrect format or missing pwd');
    }
    return forInsert ? await encrypt(pwdFromRequest) : pwdFromRequest;
};

export const isNotAnExistingUserName = async (
    usernameFromRequest: string
): Promise<boolean> => {
    try {
        const filters: Array<FilterParameter> = [
            {
                key: 'user_name',
                operator: '=',
                value: usernameFromRequest,
            },
        ];
        const users: Array<User> = await filterUsers(
            filters,
            'ExistingUsernameLookup'
        );

        return users.length === 0;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};

export const isACorrectEmailAddress = (
    emailAddressFromRequest: string
): string => {
    try {
        console.log(emailAddressFromRequest);
        if (
            // eslint-disable-next-line no-useless-escape
            !/^\w+([\.-]?\\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                emailAddressFromRequest
            )
        ) {
            throw new Error('The given email address is not valid');
        }

        return emailAddressFromRequest;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};

export const parseEmailAddress = (emailAddressFromRequest: string): string => {
    try {
        if (
            !isString(emailAddressFromRequest) &&
            !isACorrectEmailAddress(emailAddressFromRequest)
        ) {
            throw new Error('Invalid or missing email address');
        }

        return emailAddressFromRequest;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};

export const parseUserForInsertion = async (
    object: any
): Promise<UserForInsertion> => {
    try {
        const newUser: UserForInsertion = {
            user_name: await parseUsername(object.user_name, true),
            mail_address: parseEmailAddress(object.mail_address),
            pwd: await parsePwd(object.pwd, true),
            role_id: await parseRole(object.role),
        };
        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};

export const parseUserForSignIn = async (
    object: any
): Promise<UserForSignIn> => {
    try {
        const userForSignIn: UserForSignIn = {
            user_name: await parseUsername(object.user_name, false),
            pwd: await parsePwd(object.pwd, false),
        };
        return userForSignIn;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};
