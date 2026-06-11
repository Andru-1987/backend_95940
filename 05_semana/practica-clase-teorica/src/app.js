import express from "express";
import { engine } from "express-handlebars";
import multer from "multer";
import FileManager from "./manager/FileManager.js";

const app = express();

const fileManager = new FileManager();

/**CONSIGNA
 * --> LLevar a poder subir de manera masiva archivos, limite 10 archivos
 */

// servir archivos estáticos
app.use(express.static("public"));

// configurar multer para subir archivos
const options = {
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
};

const storage = multer.diskStorage(options);

const upload = multer({ storage: storage });

// configurar handlebars y Helpers para express
//

app.engine(
    "handlebars",
    engine({
        helpers: {
            calculateSubTotal: (price, quantity) => price * quantity,
        },
    }),
);

app.set("view engine", "handlebars");
app.set("views", "views");

app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

app.get("/catalogo", (req, res) => {
    res.render("catalog");
});

app.get("/carrito", (req, res) => {
    const items = [
        { name: "Laptop Lenovo ThinkPad", price: 1200, quantity: 15 },
        { name: 'Monitor Samsung 24"', price: 250, quantity: 30 },
        { name: "Teclado Mecánico Redragon", price: 80, quantity: 45 },
        { name: "Mouse Logitech G203", price: 35, quantity: 60 },
        { name: "Auriculares HyperX Cloud", price: 95, quantity: 25 },
        { name: "Webcam Logitech C920", price: 70, quantity: 20 },
        { name: "Disco SSD Kingston 1TB", price: 110, quantity: 40 },
        { name: "Memoria RAM Corsair 16GB", price: 75, quantity: 50 },
        { name: "Placa de Video RTX 4060", price: 450, quantity: 10 },
        { name: "Procesador AMD Ryzen 7", price: 320, quantity: 18 },
        { name: "Notebook HP Pavilion", price: 980, quantity: 12 },
        { name: "Impresora Epson EcoTank", price: 290, quantity: 14 },
        { name: "Router TP-Link AX1800", price: 85, quantity: 35 },
        { name: "Tablet Samsung Galaxy Tab", price: 420, quantity: 16 },
        { name: "Smartphone Xiaomi Redmi Note", price: 280, quantity: 22 },
        { name: "Parlante JBL Flip", price: 130, quantity: 28 },
        { name: "Smartwatch Amazfit GTR", price: 150, quantity: 19 },
        { name: "Cámara Canon EOS M50", price: 750, quantity: 8 },
        { name: "Micrófono Blue Yeti", price: 140, quantity: 17 },
        { name: "Dock USB-C Anker", price: 65, quantity: 33 },
    ];

    res.render("cart", { items });
});

app.get("/upload", (req, res) => {
    res.render("uploader");
});

app.post("/uploader", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    await fileManager.addUploadedFile(req.file);

    res.json({
        message: "File uploaded successfully.",
        file: req.file,
        filePath: req.file.path,
    });
});

app.get("/upload-multiple", (req, res) => {
    res.render("multiple");
});

app.post("/uploader-multiple", upload.array("files"), async (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files uploaded.");
    }

    await fileManager.addUploadedFiles(req.files);

    res.json({
        message: "Files uploaded successfully.",
        files: req.files.map((file) => file.path),
    });
});

export default app;
