import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    //el email va a ser mi campo primario de busqueda optimizada --> index
    email: { type: String, required: true, unique: true , index:true},
    password: { type: String, required: true, select: false }, // siempre puede ser quereable
    age: { type: Number, required: true, min: 0, max: 120 },
});


// darle una indexacion combinada por dos campos
// userSchema.index({ firstName: 1, lastName: 1 });

const User = mongoose.model("User", userSchema);

export default User;
