import { Router } from "express";
import User from "../models/user.model.js";
const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        res.status(201).json({ status: "success", data: newUser });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});
usersRouter.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: "success", data: users });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

usersRouter.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ status: "error", message: "User not found" });
        }
        res.status(200).json({ status: "success", data: user });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default usersRouter;
