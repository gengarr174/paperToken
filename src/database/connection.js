import sqlite3 from "sqlite3";
import "dotenv/config";

const sqlite = sqlite3.verbose();
const dbPath = process.env.DB_PATH;

let db;

export function connect() {
    if (db) return db;
    
    db = new sqlite.Database(dbPath,(err)=>{
        if(err) console.error(err.message);
    });

    db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON");

        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'active',
                tokens INTEGER DEFAULT 10
            )`
        );

        db.run(`
            CREATE TABLE IF NOT EXISTS archives (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                original_name TEXT NOT NULL,
                size INTEGER NOT NULL,
                path TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`
        );
    })
    return db;
}

export function run(sql, params = []) {
    const database = connect();
    return new Promise((resolve, reject) => {
        database.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, changes: this.changes });
        });
    });
}
export function get(sql, params = []) {
    const database = connect();
    return new Promise((resolve, reject) => {
        database.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

export function all(sql, params = []) {
    const database = connect();
    return new Promise((resolve, reject) => {
        database.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}