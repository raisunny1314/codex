const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true

    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', "python", "c++", "java", "c", "typescript"]////expanded as per use....neeedd
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "wrong", "error"]
    },
    runtime: {
        type: Number, // MiliSecond
        default: 0
    },
    memory: {
        type: Number, // MB
        default: 0
    },
    errorMessages: {
        type: String,
        default: " "
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    testcasesTotal: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true
});

//compound index...
submissionSchema.index({userId:1,problemId:1}) // -1 descending order ,, + ascending order
const submission = mongoose.model("submission", submissionSchema);

module.exports = submission;


 

