'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const user_1 = require('../controllers/user');
const router = express_1.default.Router();
router.route('/signUp').post(user_1.signUpController);
router.route('/signIn').post(user_1.signInController);
router.route('/forgotPassword').put(user_1.forgotPassword);
exports.default = router;
