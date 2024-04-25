namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        mongoDB_URL: string;
        Base_URL: string;
        NODE_ENV: 'development' | 'production';
        JWT_SECRET_KEY: string;
        JWT_RESET_SECRET_KEY: string;
        EXPIRED_TIME: string;
        EXPIRED_RESET_TIME: string;
        EMAIL_HOST: string;
        EMAIL_PORT: number;
        EMAIL_SECURE: boolean;
        EMAIL_USERNAME: string;
        EMAIL_PASSWORD: string;
        APP_NAME: string;
    };
};