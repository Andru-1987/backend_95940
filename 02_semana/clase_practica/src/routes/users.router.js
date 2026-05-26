import { Router } from "express";

const usersRouter = Router();

const llamadoSourcePersonas = () => {
    const personas = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
    ];

    const randomState = Math.random();

    if (randomState < 0.5) {
        throw new Error("Random error");
    }

    return new Promise(
        (resolve, reject) => {
            setTimeout(() => {
                if (randomState < 0.5) {
                    reject(new Error("Random error"));
                } else {
                    resolve(personas);
                }
            }, 1000);
        },
        // (resolve) => setTimeout(() => resolve(personas), 2000)
    );
};

usersRouter.get("/", async (request, response) => {
    const data = await llamadoSourcePersonas();
    console.log(data);
    response.json({ message: "Hello from users router", data });
});

usersRouter.get("/dragon-ball", async (request, response) => {
    const URL = "https://dragonball-api.com/api/characters";
    const data = await fetch(URL);

    /**fetch
     * .then( (res) => res.json())
     * .then( (json) => response.json({ message: "Hello from dragon ball router", json }))
     */

    const json = await data.json();
    response.json({ message: "Hello from dragon ball router", json });
});

export default usersRouter;
