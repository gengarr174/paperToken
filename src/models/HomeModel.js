import * as db from "../database/connection.js";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Home {

    static async countFiles(userID) {
        return await Promise.all([
            db.all(`SELECT COUNT(*) AS total_files
            FROM archives WHERE user_id = ?`,
            [userID]),
            db.all(`SELECT SUM(size) AS total_size
            FROM archives WHERE user_id = ?`,
            [userID]),
            db.all(`SELECT MAX(upload_date) AS last_upload
            FROM archives WHERE user_id = ?`,
            [userID])
        ]);
    }

    static async allFiles(userID) {
        return await db.all(
            `SELECT original_name, size, upload_date
             FROM archives
             WHERE user_id = ?
             ORDER BY upload_date DESC`,
            [userID]
        );
    }

    static async editFile(fileID, userID, original_name) {
        if (!fileID || isNaN(fileID)) return null;
        if (!original_name) return null;

        const result = await db.run(
            `UPDATE archives
             SET original_name = ? 
             WHERE id = ? AND user_id = ?`,
            [original_name, fileID, userID]
        );

        return result.changes > 0;
    }

    static async deleteFile(fileID, userID) {
        if (!fileID || isNaN(fileID)) return null;

        const result = await db.run(
            `DELETE FROM archives
            WHERE id = ? AND user_id = ?`,
            [fileID,userID]
        );

        return result.changes > 0;
    }

    static async downloadFile(fileID,userID){
        if(!fileID || isNaN(fileID)) return null;

        const result = await db.get(
            `SELECT path FROM archives 
            WHERE id = ? AND user_id = ?`,
            [fileID,userID]
        );

        if(!result) return null;
        
        return path.resolve(__dirname,"..",result.path);
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
            WHERE id = ? AND role != 'admin'`,
            [id]
        )

        return result.changes > 0;
    }
}

export default Home;