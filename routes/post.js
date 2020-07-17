const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requiredLogin = require("../middleware/requiredLogin");

module.exports = router;

router.get("/allPost", requiredLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-_id")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log("err", err);
    });
});

router.get("/myFollowingPost", requiredLogin, (req, res) => {
  // Post.find({ postedBy: { $in: [...req.user.followings, req.user._id] } }).populate("postedBy", "_id name")
  Post.find({ postedBy: { $in: req.user.followings } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-_id")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log("err", err);
    });
});

router.post("/createPost", requiredLogin, (req, res) => {
  const { title, body, url } = req.body;
  if (!title || !body || !url) {
    return res.status(422).json({ error: "Please Add all fields" });
  }
  req.user.password = undefined;
  const post = new Post({ title, body, postedBy: req.user, photo: url });
  post
    .save()
    .then((postData) => {
      res.json({ post: postData });
    })
    .catch((err) => {
      console.log("errr", err);
    });
});

router.get("/myPost", requiredLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name email")
    .then((myPosts) => {
      return res.json(myPosts);
    })
    .catch((err) => {
      console.log("err", err);
    });
});

router.put("/like", requiredLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.user._id } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", requiredLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.user._id } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", requiredLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletePost/:postId", requiredLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, result) => {
      if (err || !result) {
        return res.status(422).json({ errr: err });
      } else if (result.postedBy._id.toString() == req.user._id.toString()) {
        result
          .remove()
          .then((removeData) => {
            res.json(removeData);
          })
          .catch((err) => console.log("err"));
      }
    });
});

router.put("/deleteComment/:postId", requiredLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.params.postId,
    { $pull: { comments: { postedBy: req.user._id, text: req.body.text } } },
    { new: true }
  )
    .populate("postedBy", "_id")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ errr: err });
      } else {
        res.json(result);
      }
    });
});
