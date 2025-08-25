const mongoose = require("mongoose");
const { Schema } = mongoose;


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },

    last_name: {
        type: String,
        required: false,
        minLength: 3,
        maxLength: 20
    },
    email_id: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true
    },
    age: {
        type: Number,
        min: 6,
        max: 50
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    problemSolved: {
        type: [
            {
                type: Schema.Types.ObjectId,////added with the problem id
                ref: "problem"
            }],
        unique: true

    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

userSchema.post("findOneAndDelete",async function (userinfo){
    if(userinfo){
        await mongoose.model("submission_schema").deleteMany({userId:userinfo._id});
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User;