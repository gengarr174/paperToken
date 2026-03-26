import { createLogger, format, transports } from "winston";
import path from "path";
import { fileURLToPath } from "url";

// Define o caminho da pasta de logs
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logPath = path.join(__dirname, "..", "..", "log", "error.log"); // caminho completo do arquivo

// Configuração do logger
const logger = createLogger({
    format: format.combine(
        format.errors({ stack: true }), // inclui o stack trace do erro
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // adiciona data e hora
        format.json() // formata o log em JSON
    ),
    transports: [
        new transports.File({ filename: logPath, level: "error" }), // salva apenas erros em arquivo
        new transports.Console() // exibe logs no console
    ]
});

export default logger;