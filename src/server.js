import "./config/env.js"
import app from "./app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongo connected");

    app.listen(3000, ()=>{
    console.log("server running on port 3000");
} );
});

