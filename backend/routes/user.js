const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

router.post("/sign-in", async (req, res) => {
    //res.send("Hello World");
    try{
    const { username } = req.body;
    const { email } = req.body;
    //console.log(username , email);
    const existingUser = await User.findOne({ username: username });
    //console.log(existingUser);
    const existingEmail = await User.findOne({ email: email });
    //console.log(existingEmail);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    } else if (username.length < 5) {
        return res
            .status(400)
            .json({ message: "Username should have at least 5 characters" });
    }
    if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const hashPass = await bcrypt.hash(req.body.password , 10);
    //console.log(hashPass);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPass,
    });
    //console.log(newUser);
    await newUser.save();
    //console.log("newUser created");
    return res.status(200).json({messgae:"Signin successfully"});
    }catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server error" });
    }
    // Additional code for creating a new user would go here
});

//Login
router.post("/log-in" , async(req,res) => {
    const { username, password } = req.body;
    //console.log(username , password)
    const existingUser = await User.findOne({ username: username});
    //console.log(existingUser);
    if (!existingUser) {
        //console.log("INvalid User");
        return res.status(400).json({ message: "Invalid Credentials" }); 
    }
    bcrypt.compare(password, existingUser.password, (err,data)=>{
        //console.log("Inside bcrypt");
        if(data){
            //console.log("Inside password If");
            const authClaims = [{name:username},{jti: jwt.sign({}, "TheOG_GOAT")}];
            //console.log(authClaims);
            const token = jwt.sign({authClaims} , "TheOG_GOAT" , { expiresIn: "2d"});
            //console.log(token);
            res.status(200).json({id: existingUser._id, token: token});
        }else{
            //console.log("Inside password else");
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    });
});

module.exports = router;