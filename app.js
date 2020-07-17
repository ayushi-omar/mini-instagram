const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8000;
const { MONGOURI } = require('./config/keys');

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
    console.log("connected to mongo")
})
mongoose.connection.on("error", (err) => {
    console.log("Error in mongo", err);
})
require("./models/user");
require("./models/post");

// mongoose.model(user)
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })

}
app.listen(PORT, () => {
    console.log("server is running", PORT);
})

// heroku logs (to find the error)