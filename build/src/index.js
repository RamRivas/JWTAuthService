'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.main = void 0;
const express_1 = __importDefault(require('express'));
const morgan_1 = __importDefault(require('morgan'));
const routes_1 = __importDefault(require('./routes'));
const main = () => {
    const { PORT, CTX } = process.env;
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    for (const element of routes_1.default) {
        app.use(`/api${element.prefix}`, element.router);
    }
    app.get('/ping', (_req, res) => {
        console.log('Someone pinged here');
        res.send('pong');
    });
    CTX === 'dev' && app.use((0, morgan_1.default)('dev'));
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
exports.main = main;
