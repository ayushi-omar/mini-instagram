const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    console.log("authorization", authorization);
    if (!authorization) {
        res.status(401).json({ error: "You must be login" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            res.status(401).json({ error: "You must be logged in" });
        }
        // console.log("payload", typeof (payload));

        const { _id } = payload;
        // console.log("id", payload._id);

        User.findById(_id).then(userData => {
            // console.log("userData>", JSON.stringify(userData));
            req.user = userData;
            next();
        })
    })

}