import Bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config';

export const encrypt = async (toEncrypt: string): Promise<string> => {
    return await Bcrypt.hash(toEncrypt, SALT_ROUNDS as unknown as number);
};
