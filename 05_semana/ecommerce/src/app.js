import express from "express";
import { engine } from "express-handlebars";
import routerViews from "./routers/views.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// archivos estaticos
app.use(express.static("./public"));
app.use(express.static("./uploads"));

// configurar nuestro motor de plantillas
app.engine("handlebars", engine());

app.set("view engine", "handlebars");
app.set("views", "./views");

app.use("/", routerViews);

export default app;
