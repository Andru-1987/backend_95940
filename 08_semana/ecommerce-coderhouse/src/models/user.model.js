import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // siempre puede ser quereable
    age: { type: Number, required: true, min: 0, max: 120 },
});

const User = mongoose.model("User", userSchema);

export default User;
