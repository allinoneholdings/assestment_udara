import mongoose from "mongoose";

const signupSchema  = new mongoose.Schema({
    name: String,
    age: Number,
    birthday: Date,
    createdAt: { type: Date, default: Date.now },
    role: String,
    password: String
});

export default mongoose.model("User", signupSchema);