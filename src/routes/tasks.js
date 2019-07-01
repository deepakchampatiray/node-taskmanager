const express = require('express');
const Task = require('../models/task');
const authMiddleware = require('../middleware/auth');
const router = new express.Router();

router.post("/tasks", authMiddleware, async (req, res) => {
    const task = new Task(req.body);
    task.owner = req.user._id;
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Filter Usage: /tasks?completed={true|false}
// Pagination Usage: /tasks?limit={Number}&skip={Number}
// Sorting Usage: /tasks?sortBy={column}_{asc|desc}
router.get("/tasks", authMiddleware, async (req, res) => {
    try {
        //const tasks = await Task.find({owner: req.user._id});
        let match = {};
        if(req.query.completed) {
            match.completed = req.query.completed === 'true';
        }
        let sort = {};
        if(req.query.sortBy) {
            let sortParam = req.query.sortBy.split('_');
            sort[sortParam[0]] = sortParam[1]==='desc'?-1:1;
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if (!!task)
            res.send(task);
        else
            res.status(404).send("Task Not found")
    } catch (e) {
        res.status(500).send();
    }
})

router.patch("/tasks/:id", authMiddleware, async (req, res) => {
    const updatableFields = ['description', 'completed'];
    const taskData = req.body;
    //console.log(taskData);
    if(Object.keys(taskData).every(key => updatableFields.includes(key))) {
        try {
            //const task = await Task.findByIdAndUpdate(req.params.id, taskData, {new: true, runValidators: true, setDefaultsOnInsert: true});
            const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
            if(task) {
                for(key in taskData) {
                    task.set(key, taskData[key]);
                }
                await task.save();
                res.send(task);
            } else {
                res.status(404).send("Task not found");
            }
            
        } catch (error) {
            res.status(500).send(error);
        }
        
    } else {
        res.status(400).send("Non updatable field detected");
    }
});

router.delete("/tasks/:id", authMiddleware, async (req, res)=>{
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(task) {
            res.send(task);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;