const router = require('express').Router();
const Task = require('../models/task');
const User = require('../models/user');
const { authenticateToken } = require("./auth");

//console.log("Entered task.js");
// Create new task
router.post("/create-task",authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const { id } = req.headers;
    console.log(title , desc ,id);
    const newTask = new Task({ title: title, desc: desc });
    console.log(newTask);
    const savedTask = await newTask.save();
    const taskId = savedTask._id;
    console.log(taskId);
    await User.findByIdAndUpdate(id, { $push: {tasks: taskId._id} });
    res.status(200).json({ message: "Task Created"});
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});
router.get("/get-all-tasks",authenticateToken, async (req, res) =>{
    try{
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "tasks",
            options: {sort: { createdAt: -1 }},
        });
        res.status(200).json({data: userData});
    }catch (error){
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

//delete Tasks
//router.delete("/delete-task/:id",authenticateToken, async (req, res) =>{
router.delete("/delete-task/:id", async (req, res) =>{
    try{
        const { id } = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId , { $pull: {tasks: id}});
        res.status(200).json({message: "Task deleted Successfully...refresh to view change"});
    }catch{
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

//update Tasks
router.put("/update-task/:id",authenticateToken, async (req, res) =>{
    try{
        const { id } = req.params;
        const { title, desc} =req.body;
        await Task.findByIdAndUpdate(id, {title: title, desc: desc});
        res.status(200).json({message: "Task updated Successfully"});
    }catch{
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

//update important Tasks
router.put("/update-imp-task/:id",authenticateToken, async (req, res) =>{
    try{
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const ImpTask = TaskData.important;
        await Task.findByIdAndUpdate(id, {important: !ImpTask});
        res.status(200).json({message: "Important Successfully"});
    }catch{
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

//update complete Tasks
router.put("/update-complete-task/:id",authenticateToken, async (req, res) =>{
    try{
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const CompleteTask = TaskData.complete;
        await Task.findByIdAndUpdate(id, {complete: !CompleteTask});
        res.status(200).json({message: "Updated Successfully"});
    }catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

//get important Tasks
router.get("/get-imp-task",authenticateToken, async (req, res) =>{
    try{
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { important: true },
            options: {sort: { createdAt: -1 }},
        });
        const ImpTaskData = Data.tasks;
        res.status(200).json({data: ImpTaskData});
    }catch{
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

//get complete Tasks
router.get("/get-completed-task",authenticateToken, async (req, res) =>{
    try{
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { complete: true },
            options: {sort: { createdAt: -1 }},
        });
        const CompTaskData = Data.tasks;
        res.status(200).json({data: CompTaskData});
    }catch{
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

//get incomplete Tasks
router.get("/get-incomplete-task",authenticateToken, async (req, res) =>{
    try{
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { complete: false },
            options: {sort: { createdAt: -1 }},
        });
        const CompTaskData = Data.tasks;
        res.status(200).json({data: CompTaskData});
    }catch{
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});

module.exports = router;