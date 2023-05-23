'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.parseUserForSignIn =
    exports.parseUserForInsertion =
    exports.parseEmailAddress =
    exports.isACorrectEmailAddress =
    exports.isNotAnExistingUserName =
        void 0;
const user_1 = require('../models/user');
const encrypter_1 = require('./encrypter');
const general_1 = require('./general');
const role_1 = require('./role');
const parseUsername = async (usernameFromRequest, forInsert) => {
    try {
        if (!(0, general_1.isString)(usernameFromRequest)) {
            throw new Error('Incorrect format or missing user name');
        }
        if (forInsert) {
            if (
                !(await (0, exports.isNotAnExistingUserName)(
                    usernameFromRequest
                ))
            ) {
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
const parsePwd = async (pwdFromRequest, forInsert) => {
    if (!(0, general_1.isString)(pwdFromRequest)) {
        throw new Error('Incorrect format or missing pwd');
    }
    return forInsert
        ? await (0, encrypter_1.encrypt)(pwdFromRequest)
        : pwdFromRequest;
};
const isNotAnExistingUserName = async (usernameFromRequest) => {
    try {
        const filters = [
            {
                key: 'user_name',
                operator: '=',
                value: usernameFromRequest,
            },
        ];
        const users = await (0, user_1.filterUsers)(
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
exports.isNotAnExistingUserName = isNotAnExistingUserName;
const isACorrectEmailAddress = (emailAddressFromRequest) => {
    try {
        console.log(emailAddressFromRequest);
        // eslint-disable-next-line no-useless-escape
        if (
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
exports.isACorrectEmailAddress = isACorrectEmailAddress;
const parseEmailAddress = (emailAddressFromRequest) => {
    try {
        if (
            !(0, general_1.isString)(emailAddressFromRequest) &&
            !(0, exports.isACorrectEmailAddress)(emailAddressFromRequest)
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
exports.parseEmailAddress = parseEmailAddress;
const parseUserForInsertion = async (object) => {
    try {
        const newUser = {
            user_name: await parseUsername(object.user_name, true),
            mail_address: (0, exports.parseEmailAddress)(object.mail_address),
            pwd: await parsePwd(object.pwd, true),
            role_id: await (0, role_1.parseRole)(object.role),
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
exports.parseUserForInsertion = parseUserForInsertion;
const parseUserForSignIn = async (object) => {
    try {
        const userForSignIn = {
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
exports.parseUserForSignIn = parseUserForSignIn;
