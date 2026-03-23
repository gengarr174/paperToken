import * as db from "../database/connection.js";

class Captcha {
    static async addToken(id) {
        if (!id || isNaN(id)) throw new Error("ID inválido");
        
        const user = await db.get(
            `SELECT tokens FROM users WHERE id =?`,
        [id]);

        if(!user) throw new Error("Usuário não encontrado");
        if(user.status === "banned") throw new Error("Usuário banido");    
        if(user.tokens >= 101) throw new Error("Limite de tokens atingido");

        const result = await db.run(
            `UPDATE users SET tokens = tokens + 1 
             WHERE id = ?`,
            [id]
        );

        if (result.changes === 0)
            throw new Error("Usuário não encontrado");

        return result.tokens;
    }
}

export default Captcha;