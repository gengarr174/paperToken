import bcrypt from "bcryptjs";
import validator from "validator";
import * as db from "../database/connection.js";

export default class User{
    static async editProfile(userId,name,last_name,email){
        if(!name) return null;
        if(!last_name) return null;
        if(!email || !validator.isEmail(email)) return null;

        const result = await db.run(
            `UPDATE users SET name = ? , last_name = ? , 
            email = ? WHERE id = ? `,
        [name.trim(),last_name.trim(),email.trim(),userId]);

        return result.changes > 0;
    }

    static async editPassword(userId,password,passwordNew){
        if(!password) return null;
        if(!passwordNew || passwordNew.lenght < 6) return null;

        const user = await db.get( 
            `SELECT password FROM users WHERE id = ?`,
        [userId]);

        if(!user) return null;

        if(!(await bcrypt.compare(password,user.password))) return null;

        const salt = await bcrypt.genSalt(12);
        const newPassword = await bcrypt.hash(passwordNew,salt);
        const result = await db.run(
            `UPDATE users SET password = ? WHERE id = ?`,
        [newPassword,userId]);

        return result.changes>0;
    }
}