const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ValidateMiddleware } = require('../middlewares');

const signup = async (req, res) => {
    try {
        const validationResult = ValidateMiddleware.userSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                msg: "Validation Error",
            });
        }

        const { email, password } = validationResult.data;
        let user = await User.findOne({email: email});
        if (user) {
            return res.status(400).json({msg: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({email, password: hashedPassword});
        res.status(201).json({msg: "User created successfully"});

    } catch (error) {

        res.status(400).json({
            msg: "User not created successfully",
            err: error}
        );
    }
}

const signin = async (req, res) => {
    try {
        const validationResult = ValidateMiddleware.userSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({msg: "Invalid credentials"});
        }

        const {email, password} = validationResult.data;
        const user = await User.findOne({email});
        console.log("user ", user);
        if (!user) {
            return res.status(400).jsn({msg: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({msg: "Incorrect password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.json({token: token});
    } catch (error) {
        res.status(400).json({
            msg: "Error in signing in",
            error: error
        })
    }
}

module.exports = {
    signup,
    signin
}