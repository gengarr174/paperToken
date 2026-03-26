import * as db from "../database/connection.js";

export default class Upload {
    // Inicializa os dados do arquivo e da sessão
    constructor(file, session) {
        this.file = file;
        this.session = session;
        this.errors = [];
    }

    // Salva o arquivo no banco e desconta 1 token do usuário
    async upload() {
        this.valida();
        if (this.errors.length > 0) return null;
        let statusTrasaction = false;
        try {
            // Busca a quantidade de tokens do usuário
            const user = await db.get(
                `SELECT tokens FROM users WHERE id = ?`,
                [this.session.user.id]
            );
            if (!user || user.tokens <= 0) throw new Error("Sem tokens disponíveis");

            // Inicia a transação para garantir consistência
            await db.run("BEGIN TRANSACTION");
            statusTrasaction = true;
            // Salva os dados do arquivo no banco
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
            // Desconta 1 token do usuário
            await db.run(
                `UPDATE users SET tokens = tokens - 1 WHERE id = ?`,
                [this.session.user.id]
            );
            // Finaliza a transação
            await db.run("COMMIT");
            statusTrasaction = false;
            // Retorna a nova quantidade de tokens
            const tokens = await db.get(
                `SELECT tokens FROM users WHERE id = ?`,
                [this.session.user.id]
            );
            return tokens;
        } catch (e) {
            // Desfaz a transação em caso de erro
            if (statusTrasaction) await db.run("ROLLBACK");
            throw e;
        }
    }
    // Valida os dados do arquivo antes do upload
    valida() {
        if (!this.file) return this.errors.push("Nenhum arquivo enviado");

        if (!this.file.filename) return this.errors.push("Erro ao gerar o nome do arquivo");

        if (!this.file.originalname) return this.errors.push("Arquivo sem nome");

        if (this.file.size > (5 * 1024 * 1024)) return this.errors.push("Tamanho do arquivo superior a 5 MB");

        if (this.file.size === 0) return this.errors.push("Arquivo vazio não permitido");
    

        if (!this.file.path) return this.errors.push("Pasta de destino não encontrada");
        
        if (!this.session?.user?.id) return this.errors.push("Usuário não autenticado");
    }
}