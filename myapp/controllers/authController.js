
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Account created successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        req.session.userId = user._id;

    res.status(200).json({
    message: "Login successful",
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
});

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};