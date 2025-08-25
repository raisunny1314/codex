const express = require("express");
const {submitCode, runCode} = require("../controllers/userSubmission")
const submitRouter = express.Router();

const userMiddleware = require('../middleware/userMiddleware');



submitRouter.post("/submit/:id",userMiddleware,submitCode);
submitRouter.post("/runCode/:id",userMiddleware,runCode);

module.exports = submitRouter;