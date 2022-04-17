// require and re-export all files in this db directory (users, activities...)
const { createUser, getUser, getUserById, getUserByName } = require('./users');
const {
  createActivity,
  getAllActivities,
  updateActivity,
  getActivityById,
} = require('./activities');
const {
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineByRoutineActivityId,
  getRoutineActivityById,
} = require('./routine_activities');
const {
  createRoutine,
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
  getRoutineActivitiesByRoutine,
} = require('./routines');

module.exports = {
  createUser,
  getUserByName,
  createActivity,
  createRoutine,
  getRoutineById,
  updateRoutine,
  getRoutinesWithoutActivities,
  getAllActivities,
  addActivityToRoutine,
  getUser,
  getUserById,
  updateActivity,
  getActivityById,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  destroyRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineByRoutineActivityId,
  getRoutineActivityById,
};
