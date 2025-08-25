const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const authRouter = require("./routes/userAuthentication");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemCreate");
const submitRouter = require("./routes/submit");
const  cors = require("cors");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator")
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());



app.use("/user", authRouter);
app.use("/problem",problemRouter);
app.use("/submission",submitRouter);
app.use("/ai",aiRouter);
app.use("/video",videoRouter);


const initializeConnect = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB connected")
        app.listen(process.env.PORT, () => {

            console.log("Server listening to port Number " + process.env.PORT);
        });
    } catch (err) { console.log("Error" + err) };
}
initializeConnect();


// main().then(async () => {
//     app.listen(process.env.PORT, () => {
//         console.log("Server listening to port Number " + process.env.PORT);
//     });

// }).catch(err => console.log("Error" + err));