import * as db from "../database/connection.js";

class Home {

    static async allFiles(userId) {
        return await db.all(
            `SELECT original_name, size, upload_date
             FROM archives
             WHERE user_id = ?
             ORDER BY upload_date DESC`,
            [userId]
        );
    }

    static async editFile(id, user_id, original_name) {
        if (!id || isNaN(id)) return null;
        if (!original_name) return null;

        const result = await db.run(
            `UPDATE archives
             SET original_name = ? 
             WHERE id = ? AND user_id = ?`,
            [original_name, id, user_id]
        );

        return result.changes > 0;
    }

    static async deleteFile(id,userId) {
        if (!id || isNaN(id)) return null;

        const result = await db.run(
            `DELETE FROM archives
            WHERE id = ? AND user_id = ?`,
            [id,userId]
        );

        return result.changes > 0;
    }

    static async allUsers() {
        return await db.all(
            `SELECT id, name, last_name, email, role, status, tokens
             FROM users
             ORDER BY id DESC`
        );
    }

    static async changeStatusUser(id, status) {
        if (!id || isNaN(id)) return null;

        const result = await db.run(
            `UPDATE users
             SET status = ? WHERE id = ? AND role != 'admin'`,
            [status, id]
        );

        return result.changes > 0;
    }

    static async deleteUser(id) {
        if (!id || isNaN(id)) return null;

        const result = await db.run(
            `DELETE FROM users
            WHERE id = ?`,
            [id]
        )

        return result.changes > 0;
    }
}

export default Home;