const { getLanguageById, submitBatch, submitToken } = require("../utils/problem_util");
const Problem = require("../models/problem");
const User = require("../models/user");
const submission = require("../models/submission_schema");
const SolutionVideo = require("../models/solutionVideo");

const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body;

    try {
        //source_code
        //language_id
        //stdin
        //expectedOutput

        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);

            //creating batch submission
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output

            }));

            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map((value) => value.token);
            /////sb array me ayge sab token    [dce7bbc5-a8c9-4159-a28f-ac264e48c371 , ed737ca-ee34-454d-a06f-bbc73836473e , 9670af73-519f-4136-869c-340086d406db]

            const testResult = await submitToken(resultToken);

            console.log(testResult.status);
            for (const test of testResult) {
                if (test.status_id != 3) {
                    return res.status(400).send("Error Occurred");
                }
            }

            /// we can store it in pur DataBase

        }
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id

        });

        res.status(201).send("Problem created Successfully");



    } catch (err) {
        res.status(400).send("Error: " + err);
    }

}


const updateProblem = async (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body;

    try {
        if (!id) {
            return res.status(400).send("Missing Id field")
        }

        const DsaProblem = await Problem.findById(id);
        if (!DsaProblem) {
            return res.status.send("Id is not present")
        }


        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);

            //creating batch submission
            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output

            }));

            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map((value) => value.token);
            /////sb array me ayge sab token    [dce7bbc5-a8c9-4159-a28f-ac264e48c371 , ed737ca-ee34-454d-a06f-bbc73836473e , 9670af73-519f-4136-869c-340086d406db]

            const testResult = await submitToken(resultToken);

            for (const test of testResult) {
                if (test.status_id != 3) {
                    return res.status(400).send("Error Occurred");
                }
            }

            /// we can store it in pur DataBase

        }

        const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });

        res.status(200).send(newProblem);

    } catch (err) {
        res.status(500).send("Error: " + err);
    }

}


const deleteProblem = async (req, res) => {

    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).send("Missing Id field")
        }



        const isDeleted = await Problem.findByIdAndDelete(id);
        if (!isDeleted) {
            return res.status(404).send("Problem is missing")
        }

        res.status(200).send("Problem is deleted Successfully");


    } catch (err) {
        res.status(400).send("Error: " + err);
    }

}


const getAllproblemById = async (req, res) => {

    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send("id is missing");


        }

        const fetchProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');//select particular to show to user {{  agar chahte h koie ek field na aaye to  minus FieldName} examle: -hiddenCase} ORR const fetchProblem = await Problem.findById(id).select('-hiddenCase');

        if (!fetchProblem) {
            res.status(404).send("Problem is not availabale");
        }

        const videos = await SolutionVideo.findOne({ problemId: id });

        if (videos) {
            const responseData = {
                ...fetchProblem.toObject(),
                secureUrl: videos.secureUrl,
                thumbnailUrl: videos.thumbnailUrl,
                duration: videos.duration

            }

            return res.status(200).send(responseData);
        }
        res.status(200).send(fetchProblem);

    } catch (err) {
        res.status(404).send("Error: " + err);
    }
}

const getAllproblem = async (req, res) => {
    try {
        const fetchProblem = await Problem.find({}).select("_id title difficulty tags ");
        if (fetchProblem.length == 0) {
            res.status().send("Problem is not availabale");
        }

        res.status(201).send(fetchProblem);
    } catch (err) {
        res.status(404).send("Error: " + err);


    }
}


const solvedProblemByUser = async (req, res) => {
    try {
        //  const count = req.result.problemSolved.length;
        //  res.status(200).send(count)

        const user = await req.result.populate({
            path: "problemSolved",
            select: "_id title difficulty tags"
        })
        res.status(200).send(user.problemSolved);

    } catch (err) {
        res.status("error" + err)
    }
}



const submittedProblem = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;

        const ans = await submission.find({ userId, problemId });
        if (ans.length == 0) {
            res.status(200).send("No Submission");
        }
        res.status(200).send(ans);
    } catch (err) {
        res.status(500).send("Error:" + err);
    }
}
module.exports = { createProblem, updateProblem, deleteProblem, getAllproblemById, getAllproblem, solvedProblemByUser, submittedProblem };