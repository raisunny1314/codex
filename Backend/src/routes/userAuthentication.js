const express = require("express");
const authRouter = express.Router();


const { register, login, logout, adminRegister, DeleteProfile } = require("../controllers/userAuthent");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");



//Register

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/admin/register", adminMiddleware, adminRegister);

// authRouter.post("/getProfile",getProfile);

authRouter.delete("/deleteProfile", userMiddleware, DeleteProfile);

authRouter.get("/check", userMiddleware, (req, res) => {

    const reply = {
        first_name: req.result.first_name,
        email_id: req.result.email_id,
        _id: req.result._id,
        role:req.result.role,
    }
    res.status(200).json({
        user: reply,
        message: 'Valid User'
    })
})
module.exports = authRouter;

//login
//logout
//GetProgile