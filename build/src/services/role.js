'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.parseRole = exports.isValidRole = void 0;
const role_1 = require('../models/role');
const general_1 = require('./general');
const isValidRole = async (roleFromRequest) => {
    try {
        const roles = await (0, role_1.GetAllRoles)();
        return (
            roles.find((current) => current.role_id === roleFromRequest) !=
            undefined
        );
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};
exports.isValidRole = isValidRole;
const parseRole = async (roleFromRequest) => {
    try {
        if (
            !(0, general_1.isString)(roleFromRequest) &&
            !(0, general_1.isInteger)(roleFromRequest)
        ) {
            throw new Error('Incorrect format or missing role');
        }
        if (!(await (0, exports.isValidRole)(roleFromRequest))) {
            throw new Error('The given role does not exist');
        }
        return roleFromRequest;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};
exports.parseRole = parseRole;
