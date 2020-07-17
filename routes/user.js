const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const requiredLogin = require("../middleware/requiredLogin");

module.exports = router;

router.get("/user/:id", requiredLogin, (req, res) => {
    // console.log("req.params user>>", req.params);
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            // console.log("other user>>", user);
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err });
                    }
                    // console.log("posts user>>", posts);
                    let result = { user, posts }
                    res.json(result);
                })
        }).catch(err => {
            res.status(404).json({ err: "User not find" })
        })
})

router.put("/follow", requiredLogin, (req, res) => {
    // Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.user._id } }, { new: true })

    User.findByIdAndUpdate(req.body.followId,
        { $push: { followers: req.user._id } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            User.findByIdAndUpdate(req.user._id,
                { $push: { followings: req.body.followId } },
                { new: true })
                .select("-password")
                .then(resultData => {
                    res.json({ user: resultData, searchUser: result })
                }).catch(e => res.status(422).json({ err: e }))
        })
})

router.put("/unfollow", requiredLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId,
        { $pull: { followers: req.user._id } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            User.findByIdAndUpdate(req.user._id,
                { $pull: { followings: req.body.followId } },
                { new: true })
                .select("-password")
                .then(resultData => {
                    res.json({ user: resultData, searchUser: result })
                }).catch(e => res.status(422).json({ err: e }))
        })
})

router.put("/uploadProfile", requiredLogin, (req, res) => {
    // console.log("uploadProfile", req.body.url);
    User.findByIdAndUpdate(req.user._id, { $set: { profile: req.body.url } }, { new: true }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        res.json(result);
    })
})

router.post("/search-users", (req, res) => {
    let userPattern = new RegExp("^" + req.body.query);
    User.find({ email: { $regex: userPattern } })
        .select("_id email")
        .then(user => {
            res.json({ user });
        }).catch(e => console.log("err", e));
})