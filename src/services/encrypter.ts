import Bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config';

export const encrypt = async (toEncrypt: string): Promise<string> => {
    try {
        if(SALT_ROUNDS === undefined ) throw new Error('Environment variable SALT_ROUNDS IS MISSING');
        const salt = Bcrypt.genSaltSync(parseInt(SALT_ROUNDS));
        return await Bcrypt.hash(toEncrypt, salt);
    } catch (error) {
        if(error instanceof Error) {
            console.log(error);
            throw error;
        } else {
            throw new Error ('Unknown error');
        }
    }
};
