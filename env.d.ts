namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        mongoDB_URL: string;
        NODE_ENV: 'development' | 'production';
        JWT_SECRET_KEY: string;
        JWT_RESET_SECRET_KEY: string;
        EXPIRED_TIME: string;
        EXPIRED_RESET_TIME: string;
    };
};