import * as db from "../database/connection.js";

class Captcha {
    static async addToken(id) {
        if (!id || isNaN(id)) throw new Error("ID inválido"); // verifica se o ID é um número válido

        const user = await db.get(
            `SELECT tokens, status FROM users WHERE id = ?`,
            [id]
        );

        //tratamento de erros do user
        if (!user) throw new Error("Usuário não encontrado");
        if (user.status === "banned") throw new Error("Usuário banido");
        if (user.tokens >= 101) throw new Error("Limite de tokens atingido");

        const update = await db.run(
            `UPDATE users SET tokens = tokens + 1 WHERE id = ?`,
            [id]
        );

        if (update.changes === 0) {
            throw new Error("Erro ao adicionar token");
        }

        const result = await db.get(
            `SELECT tokens FROM users WHERE id = ?`,
            [id]
        );

        return result.tokens;
    }
}

export default Captcha;