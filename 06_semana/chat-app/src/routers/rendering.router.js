import { Router } from "express";
const renderingRouter = Router();

renderingRouter.get("/", (req, res) => res.redirect("/chat"));
renderingRouter.get("/chat", (req, res) =>
    res.render("chat", { title: "Chat Coderhouse" }),
);

export default renderingRouter;
