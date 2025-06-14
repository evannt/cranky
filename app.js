const gameRoutes = require("./routes/game-router");
const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const db = require("./models/db");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/sounds", express.static(path.join(__dirname, "sounds")));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

const port = process.env.PORT || 4000;

app.use("/game", gameRoutes);

app.get("/", async (req, res) => {
    res.redirect("/game");
});

async function startServer() {
    try {
        await db.connect();
        app.listen(port, () => {
            console.log(`Stakes Poker started at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();
