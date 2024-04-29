import { Server } from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import DBConnection from "./config/DBConnection";
import mountRoutes from "./routes";

const app: express.Application = express();

app.use(express.json({ limit: '2kb' }));
app.use(cors());
app.use(compression());
app.use(ExpressMongoSanitize());
app.use(helmet());
app.use(hpp({ whitelist: ['type'] })); // ! Protect against HTTP parameters poll
app.use(express.static('uploads'));
dotenv.config();

const port = process.env.PORT;
let server: Server;
DBConnection().then(() => { server = app.listen(port, () => { console.log(`app is listen on port ${port}`); }); });
mountRoutes(app);

process.on("unhandledRejection", (err: Error) => {
    console.error(`unhandledRejection ${err.name} | ${err.message}`);
    server.close(() => {
        console.error("shutting the application down");
        process.exit(1);
    });
});