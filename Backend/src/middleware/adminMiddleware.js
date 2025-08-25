const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");
require("dotenv").config();

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("token not available");

        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;
        if (!_id)
            throw new Error("Invalid token");
        
        const result = await User.findById(_id);


        if (payload.role != 'admin') {
            throw new Error("not admin");
        }

        if (!result) {
            throw new Error("User Does not exist");
        }


        const isblocked = await redisClient.exists(`token:${token}`);
        if (isblocked)
            throw new Error("Invalid Token");

        req.result = result;


        next();
    } catch (err) {
        res.status(401).send("Error " + err.message);
        console.log("error :" + err);
    };
}


module.exports = adminMiddleware;