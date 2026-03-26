import validator from "validator";
import bcrypt from "bcryptjs";
import * as db from "../database/connection.js";
import "dotenv/config";

export default class Login {
    // Inicializa os dados recebidos e o estado da classe
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    // Faz a autenticação do usuário
    async login() {
        this.validaLogin();
        try {
            if (this.errors.length > 0) return;

            const user = await db.get(
                `SELECT id, name, last_name, email, password, status, role, tokens
                 FROM users
                 WHERE email = ?`,
                [this.body.email]
            );

            if (!user) return this.errors.push("Usuário não encontrado");

            if (user.status === "banned") {
                return this.errors.push("Usuário banido");
            }

            if (!(await bcrypt.compare(this.body.password, user.password))) {
                return this.errors.push("E-mail ou senha inválida");
            }

            this.user = {
                id: user.id,
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                status: user.status,
                role: user.role,
                tokens: user.tokens
            };
        } catch (e) {
            this.errors.push(e);
            throw e;
        }
    }
    // Cadastra um novo usuário no sistema
    async register() {
        this.validaRegister();
        if (this.errors.length > 0) return;

        await this.userExists();
        if (this.errors.length > 0) return;

        try {
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(this.body.password, salt);
            const role = this.body.accessKey === process.env.ADMIN_KEY ? "admin" : "user";

            const result = await db.run(
                `INSERT INTO users (name, last_name, email, password, role)
                 VALUES (?, ?, ?, ?, ?)`,
                [this.body.name, this.body.last_name, this.body.email, hash, role]
            );

            const user = await db.get(
                `SELECT id, name, last_name, email, role, tokens 
                 FROM users WHERE id = ?`,
                [result.lastID]
            );

            this.user = {
                id: user.id,
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                status: user.status,
                role: user.role,
                tokens: user.tokens
            };
        } catch (e) {
            if (e.message.includes("UNIQUE")) return this.errors.push("E-mail já cadastrado");
            throw e;
        }
    }
    // Verifica se já existe usuário com o e-mail informado
    async userExists() {
        const user = await db.get(
            `SELECT id
             FROM users
             WHERE email = ?`,
            [this.body.email]
        );

        if (user) this.errors.push("E-mail já cadastrado");
    }
    // Valida os dados do login
    validaLogin() {
        this.cleanUp();

        if (!this.body.email || !validator.isEmail(this.body.email)) {
            this.errors.push("E-mail inválido");
        }

        if (!this.body.password) {
            this.errors.push("Digite uma senha");
        }
    }
    // Valida os dados do cadastro
    validaRegister() {
        this.cleanUp();

        if (!this.body.name || this.body.name.length < 2) {
            this.errors.push("Nome inválido");
        }

        if (!this.body.last_name || this.body.last_name.length < 2) {
            this.errors.push("Sobrenome inválido");
        }

        if (!this.body.email || !validator.isEmail(this.body.email)) {
            this.errors.push("E-mail inválido");
        }

        if (!this.body.password) this.errors.push("Digite uma senha");

        if (
            this.body.password &&
            (this.body.password.length < 6 || this.body.password.length > 50)
        ) {
            this.errors.push("A senha deve ter entre 6 e 50 caracteres.");
        }

        if (this.body.password !== this.body.password2) {
            this.errors.push("As senhas devem ser iguais");
        }
    }
    // Normaliza os dados recebidos antes das validações
    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== "string") {
                this.body[key] = "";
            }
        }
        this.body = {
            name: this.body.name || "",
            last_name: this.body.last_name || "",
            email: (this.body.email || "").toLowerCase(),
            password: this.body.password || "",
            password2: this.body.password2 || "",
            accessKey: this.body.accessKey || ""
        };
    }
}