'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.encrypt = void 0;
const bcrypt_1 = __importDefault(require('bcrypt'));
// import { SALT_ROUNDS } from '../config';
const encrypt = async (toEncrypt) => {
    return await bcrypt_1.default.hash(toEncrypt, 10);
};
exports.encrypt = encrypt;
