import validator from "validator";
import bcrypt from "bcryptjs";
import db from "../database/connection.js";
import "dotenv/config"

export class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida()
        if (this.errors.length > 0) return;

        const user = await db.get(
            `SELECT id, email, password, status, role, tokens
             FROM users
             WHERE email = ?`,
            [this.body.email]
        );

        if (!user) return this.errors.push("Usuario nao encontrado");

        if (!(await bcrypt.compare(this.body.password, user.password))) {
            return this.errors.push("Senha invalida");
        }

        this.user = {
            id: user.id,
            email: user.email,
            status: user.status,
            role: user.role,
            tokens: user.tokens
        }
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();
        if (this.errors.length > 0) return;

        try {
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(this.body.password, salt);
            const role = this.body.acessKey === process.env.ADMIN_KEY ? "admin" : "user"

            const result = await db.run(
                `INSERT INTO users (name, last_name, email, password, role)
                 VALUES (?, ?, ?, ?, ?)`,
                [this.body.name, this.body.last_name, this.body.email, hash, role]
            )
            this.user = {
                id: result.id,
                email: this.body.email
            }
        } catch (e) {
            if (e.message.includes('UNIQUE')) return this.errors.push("E-mail ja cadastrado");
            throw e;
        }
    }

    async userExists() {
        const user = await db.get(
            `SELECT id, email, password
             FROM users
             WHERE email = ?`,
            [this.body.email]
        );
        if (user) this.errors.push("E-mail ja cadastrado");
    }

    valida() {
        this.cleanUp();

        if (!this.body.email || !validator.isEmail(this.body.email)) {
            this.errors.push("E-mail invalido");
        }

        if (!this.body.password) this.errors.push("Digite um senha");

        if (this.body.password &&
            (this.body.password.length < 6 ||
                this.body.password.length > 50)) {
            this.errors.push("Senha deve ter entre 6 e 50 caracteres.")
        }

        if (!(this.body.password === this.body.password2)) {
            this.errors.push("As senhas devem ser iguais");
        }
    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== "string") {
                this.body[key] = "";
            }
        }
        this.body = {
            name: this.body.name || "",
            last_name: this.body.last_name || "",
            email: this.body.email || "",
            password: this.body.password || "",
            password2: this.body.password2 || "",
            acessKey: this.body.acessKey || ""
        }
    }
}