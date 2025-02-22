import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import expressOasGenerator from '@mickeymond/express-oas-generator'
import session from "express-session"
import MongoStore from "connect-mongo";
import userRouter from "./routes/user.js";
import errorHandler from "errorhandler";
import cycleDataRouter from "./routes/cycleData.js";
import calendarRouter from "./routes/calendar.js";



//connect to db
await mongoose.connect(process.env.MONGO_URL)
console.log("Database is connected")

// use express
const app = express();
expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: ['users','auth','cycle'],
    mongooseModels: mongoose.modelNames()
    
    
})

app.use(cors({credentials:true ,origin:"*"}));
app.use(express.json());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URL

    })

}))

app.use("/api/v1", userRouter);
app.use("/api/v1", cycleDataRouter);
app.use("/api/v1/",calendarRouter);


expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect('/api-docs/'));
app.use(errorHandler({ log: false }));




// server set up

app.listen (3000,() => {
    console.log ("Live on 3000")
});