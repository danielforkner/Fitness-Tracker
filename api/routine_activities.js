const express = require('express');
const {
  updateRoutineActivity,
  getRoutineById,
  getRoutineByRoutineActivityId,
  destroyRoutineActivity,
} = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const routine_activitiesRouter = express.Router();

routine_activitiesRouter.use('/', (req, res, next) => {
  const prefix = `Bearer `;
  const auth = req.header('Authorization');

  if (!auth) {
    res.status(409);
    next({ name: 'authorization error', message: 'not authorized' });
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const user = jwt.verify(token, JWT_SECRET);

      if (!user) {
        res.status(401);
        next({ name: 'bad id', message: 'no id known' });
      } else {
        req.user = user;
        next();
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

routine_activitiesRouter.patch(
  '/:routineActivityId',
  async (req, res, next) => {
    const id = req.params.routineActivityId;
    const { count, duration } = req.body;
    let creatorId = req.user.id;

    try {
      const { routineId } = await getRoutineByRoutineActivityId(id);
      const targetedRoutine = await getRoutineById(routineId);
      if (creatorId !== targetedRoutine.creatorId) {
        res.status(409);
        next({
          name: 'unauthorized',
          message: 'you are unathroized to edit this routine',
        });
      } else {
        const updated = await updateRoutineActivity({
          id,
          count,
          duration,
        });
        res.send(updated);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

routine_activitiesRouter.delete(
  '/:routineActivityId',
  async (req, res, next) => {
    const routineActivityId = req.params.routineActivityId;
    let creatorId = req.user.id;

    try {
      const { routineId } = await getRoutineByRoutineActivityId(
        routineActivityId
      );
      const targetedRoutine = await getRoutineById(routineId);
      if (creatorId !== targetedRoutine.creatorId) {
        res.status(409);
        next({
          name: 'unauthorized',
          message: 'you are unathroized to edit this routine',
        });
      } else {
        const deleted = await destroyRoutineActivity(routineActivityId);
        res.send(deleted);
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = routine_activitiesRouter;
