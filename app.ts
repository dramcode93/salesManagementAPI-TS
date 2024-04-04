import { Server } from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

const app: express.Application = express();
app.use(express.json({ limit: '2kb' }));
app.use(cors());
app.use(compression());
app.use(ExpressMongoSanitize());
app.use(helmet());
app.use(hpp({ whitelist: [] }));
dotenv.config();
const PORT = process.env.port;
let server: Server;
server = app.listen(PORT, () => { console.log(`app is listen on port ${PORT}`); });

process.on("unhandledRejection", (err: Error) => {
    console.error(`unhandledRejection ${err.name} | ${err.message}`);
    server.close(() => {
        console.error("shutting the application down");
        process.exit(1);
    });
});