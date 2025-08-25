

//CRUD
const express = require("express");

const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const { createProblem,    updateProblem,  deleteProblem, getAllproblemById, getAllproblem ,solvedProblemByUser,submittedProblem} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");


//create
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);
problemRouter.get("/getAllProblem/:id", adminMiddleware, getAllproblemById);  //filter:::::::>>>> Problem.find{difficulty:"easy"}.skip(20).limit(10)
problemRouter.get("/getAllProblem", adminMiddleware, getAllproblem); /// using pagination method  

problemRouter.get("/problemSolvedUser",userMiddleware, solvedProblemByUser);///submission Schema ::::::::>>>>> Code:language:time:memory:Status:pending/accepted.compilation errror/wronG Answer/TEST CASSES /SUBMITTED TIME/USER_ID/PROBLEM_ID
problemRouter.get("/submittedProblem/:id", userMiddleware,submittedProblem);

///// votes {$gte:100}
//    tags:{$in ["arr","hashmap"]}   



module.exports = problemRouter;


