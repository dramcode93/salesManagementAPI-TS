namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        mongoDB_URL: string;
        NODE_ENV: 'development' | 'production';
    };
};