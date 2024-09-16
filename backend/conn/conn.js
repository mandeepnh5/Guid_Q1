const express = require('express');
const mongoose = require("mongoose");
const conn = async () => {
    try{
        console.log(process.env.MONGO_URI);
        const response = await mongoose.connect(`${process.env.MONGO_URI}`);
        if(response) {
            console.log("connected to Database")
        }
    }catch (error) {
        console.log(error);
    }
};
conn();