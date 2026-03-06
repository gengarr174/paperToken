import path from "path";
import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

const dbPath = process.env.NODE_ENV === "production" ?
    "/database/data.db" : path.resolve(__dirname, "database", "data.db");

let db;

export function connect() {
    if (db) return db;

    db.run(`
        CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )    
    `);

    db.run(`
        INSERT INTO roles VALUES     
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role INTEGER NOT NULL,
            FOREIGN KEY (role) REFERENCES roles (id)
        )`
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS archives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL,
            id_user INTEGER NOT NULL,
            FOREIGN KEY (id_user) REFERENCES users(id)
        )
    `);
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


