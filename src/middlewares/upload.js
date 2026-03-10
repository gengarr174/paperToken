import multer from "multer";
import crypto from "crypto";

function hash256(name){
    return crypto.createHash("sha256").update(name).digest('hex');
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename: (req,file,cb) =>{
        const ext = file.originalname.split(".").pop();
        const hashName = hash256(file.originalname + Date.now());
        cb(null,hashName + "." + ext);
    } 
})

const limits = {
    fileSize: 5 * 1024 * 1024
}

function fileFilter(req,file,cb){
    const allowedMimeTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "text/plain"
    ];

    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null,true)
    } else {
        cb( new Error ("Unaccepted file type. Only PNG, JPG, or TXT files are accepted."));
    }
}

export const upload = multer({
    storage,
    limits, 
    fileFilter
});