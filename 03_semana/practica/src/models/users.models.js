// Se encarga de la logica del usuario // schema

import crypto from "crypto";

class UserModel {
    constructor({ name, lastName, email, password }) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = this.#hashPassword(password);
    }

    #hashPassword(password) {
        return crypto.createHash("sha256").update(password).digest("hex");
    }
}

export default UserModel;
