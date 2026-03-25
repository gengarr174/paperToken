import multer from "multer";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function hash256(name){
    return crypto.createHash("sha256").update(name).digest('hex');
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.resolve(__dirname,"..","..","uploads"));
    },
    filename: (req,file,cb) =>{
        const ext = file.originalname.split(".").pop();
        const hashName = hash256(file.originalname + Date.now());
        cb(null,hashName + "." + ext);
    } 
})

const limits = {
    fileSize: 5 * 1024 * 1024,
    files: 1
}

function fileFilter(req,file,cb){
    const allowedMimeTypes = [
        "image/png",
        "image/jpeg",
        "text/plain"
    ];

    if(allowedMimeTypes.includes(file.mimetype)) cb(null,true)
    else {
        const err = new Error("Tipo de arquivo não permitido.");
        err.code = "INVALID_FILE_TYPE";
        cb(err);
    }
}

const upload = multer({
    storage,
    limits, 
    fileFilter
});

export default upload