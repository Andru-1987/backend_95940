import multer from "multer";

// configurar multer para subir archivos
const options = {
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
};

const storage = multer.diskStorage(options);

const upload = multer({ storage: storage });

export default upload;
