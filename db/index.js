// require and re-export all files in this db directory (users, activities...)
const { createUser, getUser, getUserById } = require('./users');
const {
  createActivity,
  getAllActivities,
  updateActivity,
  getActivityById,
} = require('./activities');
const { addActivityToRoutine } = require('./routine_activities');
const {
  createRoutine,
  getRoutinesWithoutActivities,
  getAllRoutines,
} = require('./routines');

module.exports = {
  createUser,
  createActivity,
  createRoutine,
  getRoutinesWithoutActivities,
  getAllActivities,
  addActivityToRoutine,
  getUser,
  getUserById,
  updateActivity,
  getActivityById,
  getAllRoutines,
};
