import bcrypt from "bcryptjs";
import validator from "validator";
import * as db from "../database/connection.js";

export default class User {
    // Atualiza os dados básicos do perfil do usuário
    static async editProfile(userId, name, last_name, email) {
        if (!name) return null;
        if (!last_name) return null;
        if (!email || !validator.isEmail(email)) return null;

        const result = await db.run(
            `UPDATE users 
             SET name = ?, last_name = ?, email = ?
             WHERE id = ?`,
            [name.trim(), last_name.trim(), email.trim(), userId]
        );

        return result.changes > 0;
    }
    // Atualiza a senha do usuário após validar a senha atual
    static async editPassword(userId, password, passwordNew) {
        if (!password) return null;
        if (!passwordNew || passwordNew.length < 6) return null;
        // Busca a senha atual do usuário
        const user = await db.get(
            `SELECT password FROM users WHERE id = ?`,
            [userId]
        );

        if (!user) return null;
        // Confere se a senha atual está correta
        if (!(await bcrypt.compare(password, user.password))) return null;
        // Gera o hash da nova senha
        const salt = await bcrypt.genSalt(12);
        const newPassword = await bcrypt.hash(passwordNew, salt);
        // Salva a nova senha no banco
        const result = await db.run(
            `UPDATE users SET password = ? WHERE id = ?`,
            [newPassword, userId]
        );
        return result.changes > 0;
    }
}