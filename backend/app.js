const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn"); 
const cors = require("cors");
const mongoose = require("mongoose");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");
app.use(cors());
app.use(express.json());

// const conn = async () => {
//     try{
//         console.log(process.env.MONGO_URI);
//         const response = await mongoose.connect(`${process.env.MONGO_URI}`);
//         if(response) {
//             console.log("connected to Database")
//         }
//     }catch (error) {
//         console.log(error);

//     }
// };
// conn();

//          res.send("Hello Abi");
//     });
app.use("/api/v1",UserAPI);
app.use("/api/v2",TaskAPI);
const PORT = 1000;
console.log("Im here");
//localhost:1000/api/v1/sign-in
// app.use("/abijith", (req, res)=>{
//     res.send("Hello Abi");
// });
// app.use("/kris", (req, res)=>{
//     res.send("Hello Appa");
// });
app.use("/", (req, res)=>{
    res.send("Hello from backend");
});


//localhost:1000/api/v1/sign-in



app.listen(PORT, () => {
    console.log("Server Started");
});