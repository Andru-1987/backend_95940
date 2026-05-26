import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/", (request, response) => {
    response.json({ message: "Hello from users router" });
});

export default usersRouter;
