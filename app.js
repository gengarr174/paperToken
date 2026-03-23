import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import helmet from "helmet";
import csrf from "csurf";
import connectSql from "connect-sqlite3";
import "dotenv/config";
import methodOverride from "method-override";
import { fileURLToPath } from "url";

import routes from "./src/routes.js";
import { csrfMidWare, checkCsrfErr, globalMid } from "./src/middlewares/middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const SQLiteStore = connectSql(session);

app.use(helmet({contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.resolve(__dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new SQLiteStore({
        db: "sessions.sqlite",
        dir: "./database"
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "lax"
    }
}));
app.use(express.static(path.resolve("public")));
app.use(flash());

app.use(csrf());
app.use(csrfMidWare);
app.use(globalMid);
app.use(routes);
app.use(checkCsrfErr);

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");


export default app;