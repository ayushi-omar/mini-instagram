const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: { type: String },
    expireOn: { type: Date },
    followers: [{ type: ObjectId, ref: "User" }],
    followings: [{ type: ObjectId, ref: "User" }],
    profile: { type: String, default: "https://res.cloudinary.com/mini-instagram/image/upload/v1589307724/samples/people/boy-snow-hoodie.jpg" },

})

mongoose.model("User", userSchema);