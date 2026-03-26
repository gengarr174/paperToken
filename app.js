import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import helmet from "helmet";
import connectSql from "connect-sqlite3";
import "dotenv/config";
import methodOverride from "method-override";
import { fileURLToPath } from "url";

import routes from "./src/routes.js";
import { checkCsrfErr, pageError, globalMid, globalError } from "./src/middlewares/middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const SQLiteStore = connectSql(session);

//Evita conflito com <script>
app.use(helmet({ contentSecurityPolicy: false }));
// Permite ler dados de formulários no req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Permite usar métodos como PUT, PATCH e DELETE via formulário
app.use(methodOverride("_method"));
// Define a pasta de arquivos estáticos
app.use(express.static(path.resolve(__dirname, "public")));

// Configura a sessão da aplicação
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new SQLiteStore({
        db: "sessions.sqlite",
        dir: "./database"
    }),
    resave: false,
    saveUninitialized: false, // só salva a sessão quando houver dados
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "lax"
    }
}));

app.use(flash());
app.use(globalMid);
app.use(routes);
app.use(checkCsrfErr);
app.use(pageError);
app.use(globalError);

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

export default app;