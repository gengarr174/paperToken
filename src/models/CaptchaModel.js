import * as db from "../database/connection.js";

class Captcha {
    static async addToken(id) {
        if (!id) throw new Error("ID inválido");

        const result = await db.run(
            `UPDATE users 
             SET tokens = tokens + 1 
             WHERE id = ?`,
            [id]
        );

        if (result.changes === 0) {
            throw new Error("Usuário não encontrado");
        }

        return result;
    }
}

export default Captcha;