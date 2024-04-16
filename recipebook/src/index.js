const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Set the views directory
app.set('views', path.join(__dirname, 'client', 'html'));

// Set the view engine
app.set('view engine', 'html');

// Serve static files from the "client" directory
app.use(express.static("client"));

// Schema
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://keshavrajora122:22cs3034@cluster0.hzdpmg3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

connect.then(() => {
    console.log("Database connected Successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
});

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model("users", LoginSchema);

// Route to render login.html
app.get("/", (req, res) => {
    res.render("login");
});

// Route to render register.html
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const { name, username, email, phone, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    const userData = {
        name,
        username,
        email,
        phone,
        password
    };

    try {
        // Insert user data into MongoDB
        const insertedUser = await collection.insertOne(userData);
        console.log("User registered:", insertedUser.ops[0]);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
