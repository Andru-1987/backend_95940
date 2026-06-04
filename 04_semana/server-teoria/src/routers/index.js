import { Router } from "express";

const router = Router();

// UN CRUD
//base de data IN::MEMORY
let users = [];

router.get("/", (req, res) => {
    res.status(200).send({
        status: "OK",
        data: users,
    });
});

router.post("/", (req, res) => {
    const { name, email, password } = req.body;
    const user = { name, email, password };
    users.push(user);
    res.status(201).send({
        status: "OK",
        message: "User created successfully",
        data: user,
    });
});

router.patch("/:email", (req, res) => {
    const { email } = req.params;
    const { userUpdate } = req.body;

    let user = users.find((user) => user.email === email);

    console.log(user, userUpdate);

    const updatedUser = { ...user, ...userUpdate };

    let updateUsers = users.filter((user) => user.email != email);

    if (user) {
        updateUsers.push(updatedUser);
        users = updateUsers;
        res.status(200).send({
            status: "OK",
            message: "User updated successfully",
            data: users,
        });
    } else {
        res.status(404).send({
            status: "NOT_FOUND",
            message: "User not found",
        });
    }
});

router.delete("/:email", (req, res) => {
    const { email } = req.params;
    const user = users.find((user) => user.email === email);

    if (user) {
        users.splice(users.indexOf(user), 1);
        res.status(200).send({
            status: "OK",
            message: "User deleted successfully",
            data: user,
        });
    } else {
        res.status(404).send({
            status: "NOT_FOUND",
            message: "User not found",
        });
    }
});

export default router;
