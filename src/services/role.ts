import { GetAllRoles } from '../models/role';
import { Role } from '../types';
import { isInteger, isString } from './general';

export const isValidRole = async (
    roleFromRequest: number
): Promise<boolean> => {
    try {
        const roles: Array<Role> = await GetAllRoles();
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

export const parseRole = async (roleFromRequest: any): Promise<number> => {
    try {
        if (!isString(roleFromRequest) && !isInteger(roleFromRequest)) {
            throw new Error('Incorrect format or missing role');
        }
        if (!(await isValidRole(roleFromRequest))) {
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
