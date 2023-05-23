declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            CTX: string;
            HOST: string;
            USER: string;
            PASSWORD: string;
            DATABASE: string;
            MAX: number;
            IDLETIMEOUTMILLIS: number;
            CONNECTIONTIMEOUTMILLIS: number;
            SENDER_EMAIL: string;
            SENDER_PWD: string;
            SALT_ROUNDS: number;
        }
    }
}

export {};
