import sqlite3 from "sqlite3";
import "dotenv/config";

const sqlite = sqlite3.verbose();
const dbPath = process.env.DB_PATH;

let db;

function connect() {
    if (!dbPath) throw new Error("DB_PATH não definido no .env");

    if (db) return db;
    
    db = new sqlite.Database(dbPath,(err)=>{
        if(err) throw new Error(err.message);
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
                role TEXT CHECK(role IN ('admin','user')) NOT NULL,
                status TEXT CHECK(status IN ('active','banned')) DEFAULT 'active',
                tokens INTEGER DEFAULT 10 CHECK(tokens>=0)
            )`
        );

        db.run(`
            CREATE TABLE IF NOT EXISTS archives (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                original_name TEXT NOT NULL,
                size INTEGER NOT NULL,
                type TEXT NOT NULL,
                path TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
            resolve({ lastID: this.lastID, changes: this.changes });
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