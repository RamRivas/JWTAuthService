import express from 'express';
import morgan from 'morgan';
import Routes from './routes';
import { PORT, CTX } from './config';

export const main = () => {
    // const { PORT, CTX } = process.env;
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    for (const element of Routes) {
        app.use(`/api${element.prefix}`, element.router);
    }

    app.get('/ping', (_req, res) => {
        console.log('Someone pinged here');
        res.send('pong');
    });

    CTX === 'dev' && app.use(morgan('dev'));

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
