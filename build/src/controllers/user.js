'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.forgotPassword =
    exports.signInController =
    exports.signUpController =
        void 0;
const user_1 = require('../models/user');
const user_2 = require('../services/user');
const crypto_1 = require('crypto');
const mailer = __importStar(require('../services/mailer'));
const encrypter_1 = require('../services/encrypter');
const signUpController = async (req, res) => {
    try {
        const newUser = await (0, user_2.parseUserForInsertion)(req.body);
        const insertedUser = await (0, user_1.signUp)(newUser);
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
exports.signUpController = signUpController;
const signInController = async (req, res) => {
    try {
        const signInSubject = await (0, user_2.parseUserForSignIn)(req.body);
        const signInResponse = await (0, user_1.signIn)(signInSubject);
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
exports.signInController = signInController;
const forgotPassword = async (req, res) => {
    try {
        const filters = [
            {
                key: 'mail_address',
                value: req.body.mail_address,
                operator: '=',
            },
        ];
        const provisionalPwd = (0, crypto_1.randomBytes)(8).toString('hex');
        const users = await (0, user_1.filterUsers)(filters, 'ForgotPassword');
        if (users.length > 0) {
            const user = users[0];
            const updateValues = {
                user_id: user.user_id,
                pwd: await (0, encrypter_1.encrypt)(provisionalPwd),
                forgot_pwd: 1,
            };
            const rowsAffected = await (0, user_1.updateUsers)(
                [updateValues],
                [user],
                'ForgotPassword'
            );
            const body = {
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
exports.forgotPassword = forgotPassword;
