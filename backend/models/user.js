const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasks: [{
        type: mongoose.Types.ObjectId, //mongoose.Schema.Types.ObjectId,   //
        ref:"task",
    }],
},
   { timestamps: true }
)
module.exports = mongoose.model("user" , userSchema); 