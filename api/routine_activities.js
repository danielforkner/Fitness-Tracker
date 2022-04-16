const express = require('express');
const {
  updateRoutineActivity,
  getRoutineById,
  getRoutineByRoutineActivityId,
} = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const routine_activitiesRouter = express.Router();

routine_activitiesRouter.patch(
  '/:routineActivityId',
  async (req, res, next) => {
    const routineActivityId = req.params.routineActivityId;
    const { count, duration } = req.body;
    const prefix = `Bearer `;
    const auth = req.header('Authorization');

    if (!auth) {
      res.status(409);
      next({ name: 'authorization error', message: 'not authorized' });
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      try {
        const user = jwt.verify(token, JWT_SECRET);
        let creatorId = user.id;
        const { routineId } = await getRoutineByRoutineActivityId(
          routineActivityId
        );
        const targetedRoutine = await getRoutineById(routineId);
        if (!user.id) {
          res.status(401);
          next({ name: 'bad id', message: 'no id known' });
        }
        if (creatorId !== targetedRoutine.creatorId) {
          console.log('UNATHORIZED');
          res.status(409);
          next({
            name: 'unauthorized',
            message: 'you are unathroized to edit this routine',
          });
        } else {
          const updated = await updateRoutineActivity({
            routineActivityId,
            count,
            duration,
          });
          console.log('UPDATED', updated);
          res.send(updated);
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
  }
);

// let newRoutineActivityData = {
//     routineId: 3,
//     activityId: 8,
//     count: 25,
//     duration: 200,
//   };

// describe('PATCH /routine_activities/:routineActivityId (**)', () => {
//     it('Updates the count or duration on the routine activity', async () => {
//       const { data: respondedRoutineActivity } = await axios.patch(
//         `${API_URL}/api/routine_activities/${routineActivityToCreateAndUpdate.id}`,
//         newRoutineActivityData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       expect(respondedRoutineActivity.count).toEqual(
//         newRoutineActivityData.count
//       );
//       expect(respondedRoutineActivity.duration).toEqual(
//         newRoutineActivityData.duration
//       );

module.exports = routine_activitiesRouter;
