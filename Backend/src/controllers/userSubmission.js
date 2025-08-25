const Problem = require("../models/problem");
const Submission = require("../models/submission_schema");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problem_util");
const User = require("../models/user");

const submitCode = async (req, res) => {
    try {

        const userId = req.result._id; // user ka sab information isme haiii
        const problemId = req.params.id;

        let { code, language } = req.body;


        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("some field missing");
        }
        if (language === 'cpp')
            language = 'c++'
        console.log(language)
        //
        const problem = await Problem.findById(problemId);
        //test cases hidden hai toh pehle DB me entry karo fir jab judge0 se result status ayaga tb DB ko update kar dene kaaa
        //    if (!problem) {
        //     return res.status(404).send("Problem not found");
        // }
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            // testCasesPassed: 0,
            status: "pending",
            testcasesTotal: problem.hiddenTestCases.length
        })

        //judge ko code submit karna  hai

        const languageId = getLanguageById(language);

        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output

        }));
        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token);
        /////sb array me ayge sab token    [dce7bbc5-a8c9-4159-a28f-ac264e48c371 , ed737ca-ee34-454d-a06f-bbc73836473e , 9670af73-519f-4136-869c-340086d406db]

        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for (const test of testResult) {
            if (test.status_id == 3) {

                testCasesPassed++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory, test.memory);


            } else {
                if (test.status_id == 4) {
                    status = 'error';
                    errorMessage = test.stderr;
                } else {
                    status = 'wrong';
                    errorMessage = test.stderr;

                }
            }
        }

        // store the result in Database in submission
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessages = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        await submittedResult.save();
        //problemID ko inser karunga userSchema me  if usme nhi rhega present
        if (!req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }
        const accepted = (status == "accepted")

        res.status(200).json({
            accepted,
            totalTestCases: submittedResult.testcasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory
        });


        // used memory and time
        //    memory: 200kb,150kb,100kb ==>>>> 200kb
        //time:2,3,1 ===== > 6 sec

        //    language_id: 63,
        // stdin: '-1 5',
        // expected_output: null,
        // stdout: '4\n',
        // status_id: 3,
        // created_at: '2025-07-29T12:13:54.425Z',
        // finished_at: '2025-07-29T12:13:54.664Z',
        // time: '0.019',
        // memory: 8432,
        // stderr: null,
        // token: '5547369f-5466-49ac-9197-e7ada4de2756'

    } catch (err) {
        res.status(500).send("Internal Server Error" + err);
    }
}

const runCode = async (req, res) => {
    try {

        const userId = req.result._id; // user ka sab information isme haiii
        const problemId = req.params.id;

        let { code, language } = req.body;

        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("some field missing");
        }
        //
        const problem = await Problem.findById(problemId);
        //test cases hidden hai toh pehle DB me entry karo fir jab judge0 se result status ayaga tb DB ko update kar dene kaaa
        if (!problem) {
            return res.status(404).send("Problem not found");
        }
        if (language === 'cpp')
            language = 'c++'

        //judge ko code submit karna  hai

        const languageId = getLanguageById(language);

        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output

        }));
        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token);
        /////sb array me ayge sab token    [dce7bbc5-a8c9-4159-a28f-ac264e48c371 , ed737ca-ee34-454d-a06f-bbc73836473e , 9670af73-519f-4136-869c-340086d406db]

        const testResult = await submitToken(resultToken);
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = true;
        let errorMessage = null;

        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time)
                memory = Math.max(memory, test.memory);
            } else {
                if (test.status_id == 4) {
                    status = false
                    errorMessage = test.stderr
                }
                else {
                    status = false
                    errorMessage = test.stderr
                }
            }
        }

        res.status(200).json({
            success: status,
            testcase: testResult,
            runtime,
            memory

        });


        // used memory and time
        //    memory: 200kb,150kb,100kb ==>>>> 200kb
        //time:2,3,1 ===== > 6 sec

        //    language_id: 63,
        // stdin: '-1 5',
        // expected_output: null,
        // stdout: '4\n',
        // status_id: 3,
        // created_at: '2025-07-29T12:13:54.425Z',
        // finished_at: '2025-07-29T12:13:54.664Z',
        // time: '0.019',
        // memory: 8432,
        // stderr: null,
        // token: '5547369f-5466-49ac-9197-e7ada4de2756'

    } catch (err) {
        res.status(500).send("Internal Server Error" + err);
    }
}

module.exports = { submitCode, runCode };