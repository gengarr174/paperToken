import db from "../database/connection.js";

export class Upload{
    constructor(file,session){
        this.file = file;
        this.session = session
        this.errors = [];
    }
    async upload(){
        this.valida();
        if(this.errors.length> 0) return;

        await db.run(
            `INSERT INTO archives (name,original_name,size,path,user_id)
            VALUES (?,?,?,?,?)
            `,
            [this.file.filename,this.file.originalName,
                this.file.size,this.file.path,this.session.userId]
        );
    }

    valida(){
        this.cleanUp();
        if(!this.file.filename){
            this.errors.push("Erro na criptografia do filename");
        }
        if(!this.file.originalName){
            this.errors.push("Arquivo sem nome");
        }
        if(this.file.size > (5*1024*1024)){
            this.errors.push("Tamanho de arquivo superior a 5MB");
        }
        if(!this.file.path){
            this.errors.push("Pasta destino nao encontrada");
        }
        if(!this.session.userId){
            this.errors.push("Id do usuario nao identificado");
        }
    }

    cleanUp(){
        for (let key in this.file){
            if(typeof this.file[key] !== "string"){
                this.file[key] = ""
            }
        }
        for (let key in this.session){
            if(typeof this.session.user[key] !== "string"){
                this.session.user[key] = ""
            }
        }
        this.file = {
            filename: this.file.filename || "",
            originalName: this.file.originalname || "",
            size: this.file.size || "",
            path: this.file.path || ""
        }
        this.session = {
            userId: this.session.user.id || ""
        }
    }
}