const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Submission = require("../models/submission_schema");



const register = async (req, res) => {
    try {
        validate(req.body);
        const { first_name, email_id, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "user";


        const user = await User.create(req.body);
        const token = jwt.sign({ _id: user, email_id: email_id, role: "user" }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });


        const reply = {
            first_name: user.first_name,
            email_id: user.email_id,
            _id: user._id,
            role: user.role,

        }
        res.status(201).json({
            user: reply,
            message: "SignUp Successfully"
        });



    } catch (err) {
        res.status(400).send("Error" + err);
    }
}

const login = async (req, res) => {
    try {
        const { email_id, password } = req.body;
        if (!email_id)
            throw new Error("invalid Credentials");
        if (!password)
            throw new Error("invalid Credentials");

        const user = await User.findOne({ email_id });

        const match = await bcrypt.compare(password, user.password);//{req.body.password , databash_pass}
        if (!match)
            throw new Error("invalid Credentials");

        const reply = {
            first_name: user.first_name,
            email_id: user.email_id,
            _id: user._id,
            role: user.role,

        }

        const token = jwt.sign({ _id: user._id, email_id: user.email_id, role: user.role }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
     res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None"
});

        // res.status(200).send("Logged in  Successfully");//data to frontend
        res.status(200).json({
            user: reply,   
            token,
            message: "Login Successfully"
        });



    } catch (err) {
        res.status(401).send("Error " + err.message)
    }
}

const logout = async (req, res) => {

    try {

        /// Token add krdunga redis me fir koie aya toh blocklist me daal dungaaaa
        const { token } = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        //cookeis clear
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.status(201).send("Logged Out Successfully")
    } catch (err) {
        res.status(503).send("Error " + err);
    }
}


//admin register
const adminRegister = async (req, res) => {
    try {
        validate(req.body);
        const { first_name, email_id, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "admin";


        const user = await User.create(req.body);
        const token = await jwt.sign({ _id: user, email_id: email_id, role: "admin" }, process.env.JWT_KEY, { expiresIn: 60 * 60 })//user.role
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(201).send("User Registered Successfully");



    } catch (err) {
        res.status(400).send("Error" + err);
    }
}

//delete Profile
const DeleteProfile = async (req, res) => {
    try {
        //delete from user
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        //delete the submission history
        await Submission.deleteMany(userId)

        res.status(200).send("deleted Successfully")
    } catch (err) {
        res.status.send("server error:" + err);
    }
}

module.exports = { register, login, logout, adminRegister, DeleteProfile };
