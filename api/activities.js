const express = require('express');
const activitiesRouter = express.Router();
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
} = require('../db');

activitiesRouter.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    if (activities) {
      res.send(activities);
    } else {
      res.status(409);
      next({
        name: 'Activities Error',
        message: "Can't get activities!",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.post('/', async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newActivity = await createActivity({ name, description });
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.patch('/:activityId', async (req, res, next) => {
  let id = req.params.activityId;
  let { name, description } = req.body;
  try {
    const response = await updateActivity({ id, name, description });
    res.send(response);
  } catch ({ error }) {
    throw error;
  }
});

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
  let id = req.params.activityId;
  try {
    const activity = await getActivityById(id);
    const routines = await getPublicRoutinesByActivity(activity);
    res.send(routines);
  } catch (error) {
    throw error;
  }
});

module.exports = activitiesRouter;
