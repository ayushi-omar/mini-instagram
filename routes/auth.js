const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requiredLogin");
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const { SENDGRID_API, EMAIL_URL } = require("../config/keys");
// const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport")

const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: SENDGRID_API
    }
}));

// const transporter = nodemailer.createTransport(sgTransport({
//     auth: {
//         api_key: "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"
//     }
// }))

// 5_3h0bsxS5S_12oddQS3aw


router.get("/protected", requireLogin, (req, res) => {
    console.log("Protected", req.user);
})

router.post("/signup", (req, res) => {
    console.log("req", req.body);
    const { name, email, password, url } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please provide all field" });
    }
    User.findOne({ email }).then(savedUser => {
        if (savedUser) {
            return res.status(422).json({ error: "User Already exists" });
        }
        bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({ email, name, password: hashedPassword, profile: url });
                user.save().then(userData => {
                    console.log("userDtaa>", userData);
                    const email = {
                        to: userData.email,
                        from: 'ayushi.omar@gmail.com',
                        subject: 'Welcome to Minigram',
                        html: '<b>Welcome to my own small instagram. Hope you enjoy</b>'
                    };
                    mailer.sendMail(email, function (err, res) {
                        if (err) {
                            console.log(err)
                        }
                        console.log(res);
                    });
                    // transporter.sendMail({
                    //     to: userData.email,
                    //     from: "onreply@minintagram.com",
                    //     subject: "signup successfully",
                    //     html: "<h1>Welcome to mini instagram</h1>"
                    // })
                    res.json({ message: "save successfully" })
                }).catch(err => {
                    console.log("err>>", err);
                })
            });

    })
        .catch(err => {
            console.log("err>>", err);
        })
})

router.post("/signin", (req, res) => {
    console.log("req", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "please provide email or password!!!" });
    }
    User.findOne({ email: email }).then(savedUser => {
        console.log("savedUser", savedUser);
        if (!savedUser) {
            return res.status(422).json({ error: "invalid email/password" });
        }
        bcrypt.compare(password, savedUser.password).then((doMatch) => {
            if (doMatch) {
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                const { _id, name, email, followings, followers, profile } = savedUser
                res.json({ token, user: { _id, name, email, followings, followers, profile } })
            } else {
                return res.status(422).json({ error: "invalid email/password" });
            }
        }).catch(err => {
            console.log("err", err);
        });
    })
})

router.post("/resetPassword", (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log("resend password err>>", err);
        }
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email })
            .then(user => {
                console.log("user>>", JSON.stringify(user))
                if (!user) {
                    res.status(422).json({ err: "User not found" })
                }
                user.resetToken = token;
                user.expireOn = Date.now() + 3600000;
                user.save().then(result => {
                    if (result) {
                        mailer.sendMail({
                            to: user.email,
                            from: "ayushi.omar@gmail.com",
                            subject: "Password reset",
                            html: `<p>You requested for password reset</p>
                            <h5>click here to <a href="${EMAIL_URL}/reset/${token}">reset password</a></h5>`
                        })
                        res.json({ msg: "Check your email" });
                    }
                })

            })
    })
})

router.post("/newPassword", (req, res) => {
    console.log("newPassword>>>>");
    const newPassword = req.body.password;
    const token = req.body.token;
    User.findOne({ resetToken: token, expireOn: { $gte: new Date() } })
        .then(user => {
            if (!user) {
                res.status(422).json({ msg: "Session has been expired" })
            }
            console.log("newPassword", newPassword, user);
            bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = undefined;
                    user.expireOn = undefined;
                    user.save().then(savedUser => {
                        res.json({ msg: "Password update successfully" })
                    })
                })
        }).catch(err => console.log("err", err));

})

module.exports = router;
