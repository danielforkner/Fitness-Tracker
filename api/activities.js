const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities, createActivity} = require("../db")

activitiesRouter.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities()
        if (activities) {
            res.send(activities)
        } else {
            res.status(409)
            next ({
            name: "Activities Error",
            message: "Can't get activities!",
        });
        }
        
    } catch ({ name, message }) {
        next({ name, message });
    } 
})

activitiesRouter.post('/', async (req, res, next) => {
    const { name, description } = req.body
    console.log("THIS IS IN THE POST FUNCTION")
    try {
        const newActivity = await createActivity({ name, description })
        res.send (newActivity)
        
    } catch ({ name, message }) {
        next({ name, message });
    } 
})

activitiesRouter.patch('/:activityId', async (req, res, next) => {
    
})

module.exports = activitiesRouter