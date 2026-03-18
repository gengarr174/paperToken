import * as db from "../database/connection.js";

export default class Upload{
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
            VALUES (?,?,?,?,?)`,
            [this.file.filename,
             this.file.originalname,
             this.file.size,
             this.file.path,
             this.session.userId]
        );
    }

    valida(){
        if(!this.file){
            this.errors.push("Nenhum arquivo enviado")
        }
        if(!this.file.filename){
            this.errors.push("Erro ao gerar nome do arquivo");
        }
        if(!this.file.originalName){
            this.errors.push("Arquivo sem nome");
        }
        if(this.file.size > (5*1024*1024)){
            this.errors.push("Tamanho de arquivo superior a 5MB");
        }
        if(!this.file.path){
            this.errors.push("Pasta destino não encontrada");
        }
        if(!this.session?.user?.id){
            this.errors.push("Usuário não autenticado");
        }
    }
}