//code by shantanav mukherjee written on 30/09/2026

const express = require("express");
const cors =require("cors");

const app = express();
const allowedrOrigins = ["*"];
const corsOptions = {
    origin: (origin, callback) => {
        if (origin == undefined || allowedrOrigins.find(o => o === origin) == undefined){
            return callback(new Error("Not allowed by CORS"));
        }else{
            return callback(null,true);
        }
    },
        callback: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        preflightContinue: false,
        optionsSuccessStatus: 200,
        maxAge: 86400,
        exposedHeaders: ["Content-Type", "Authorization"],
        origin: (origin, callback) => {
            if (origin == undefined || allowedrOrigins.find(o => o === origin) == undefined){
                return callback(new Error("Not allowed by CORS"));
            }else{
                return callback(null,true);
            }
        }
}

cors.use(corsOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);