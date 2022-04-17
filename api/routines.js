const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require('../db');
const routinesRouter = express.Router();

routinesRouter.get('/', async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    throw error;
  }
});

routinesRouter.patch('/:routineId', async (req, res, next) => {
  const id = req.params.routineId;
  const { isPublic, name, goal } = req.body;
  try {
    const updated = await updateRoutine({ id, isPublic, name, goal });
    res.send(updated);
  } catch (error) {
    throw error;
  }
});

routinesRouter.delete('/:routineId', async (req, res, next) => {
  const id = req.params.routineId;
  try {
    const destroyed = await destroyRoutine(id);
    res.send(destroyed);
  } catch (error) {
    throw error;
  }
});

routinesRouter.post('/:routineId/activities', async (req, res, next) => {
  const routineId = req.params.routineId;
  const { activityId, count, duration } = req.body;
  try {
    const routines = await getRoutineActivitiesByRoutine(routineId);
    const duplicate = routines.some(
      (routine) => routine.activityId === activityId
    );
    if (duplicate) {
      res.status(409);
      next({
        name: 'duplicate error',
        message: 'you cannot add a duplicate activity to this routine',
      });
    } else {
      const added = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      res.send(added);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.post('/', async (req, res, next) => {
  const { isPublic, name, goal } = req.body;

  const prefix = `Bearer `;
  const auth = req.header('Authorization');

  if (!auth) {
    res.status(409);
    next({ name: 'authorization error', message: 'not authorized' });
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      let creatorId = id;
      if (!id) {
        res.status(401);
        next({ name: 'bad id', message: 'no id known' });
      } else {
        const newRoutine = await createRoutine({
          creatorId,
          isPublic,
          name,
          goal,
        });
        res.send(newRoutine);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    res.status(404);
    next({
      name: 'Authorization Header Error',
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

module.exports = routinesRouter;
