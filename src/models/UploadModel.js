import * as db from "../database/connection.js";

export default class Upload {
    constructor(file, session) {
        this.file = file;
        this.session = session
        this.errors = [];
    }
    async upload() {
        this.valida();
        if (this.errors.length > 0) return null;
        let status = false; 
        try {
            const user = await db.get(
                `SELECT tokens FROM users WHERE id = ?`,
                [this.session.user.id]
            );

            if (!user || user.tokens <= 0) {
                throw new Error("Sem tokens disponíveis");
            }
            await db.run("BEGIN TRANSACTION");
            status = true;
            await db.run(
                `INSERT INTO archives (name, original_name, size, type, path, user_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    this.file.filename,
                    this.file.originalname,
                    this.file.size,
                    this.file.mimetype,
                    this.file.path,
                    this.session.user.id
                ]
            );
            await db.run(
                `UPDATE users SET tokens = tokens - 1 WHERE id = ?`,
                [this.session.user.id]
            );
            await db.run("COMMIT");
            status = false;
            const tokens = await db.get(`SELECT tokens FROM users WHERE 
                    id = ?`,[this.session.user.id]);
            return tokens
        } catch (e) {
            if(status) await db.run("ROLLBACK");
            throw e;
        }
    }

    valida() {
        if (!this.file) {
            return this.errors.push("Nenhum arquivo enviado");
        }
        if (!this.file.filename) {
            return this.errors.push("Erro ao gerar nome do arquivo");
        }
        if (!this.file.originalname) {
            return this.errors.push("Arquivo sem nome");
        }
        if (this.file.size > (5 * 1024 * 1024)) {
            return this.errors.push("Tamanho de arquivo superior a 5MB");
        }
        if (this.file.size === 0) {
            this.errors.push("Arquivo vazio não permitido");
        }
        if (!this.file.path) {
            return this.errors.push("Pasta destino não encontrada");
        }
        if (!this.session?.user?.id) {
            return this.errors.push("Usuário não autenticado");
        }
    }
}