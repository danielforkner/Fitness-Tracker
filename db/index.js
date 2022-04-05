// require and re-export all files in this db directory (users, activities...)
const { createUser } = require('./users');
const { createActivity, getAllActivities } = require('./activities');
const { addActivityToRoutine } = require('./routine_activities');
const { createRoutine, getRoutinesWithoutActivities } = require('./routines');

module.exports = {
  createUser,
  createActivity,
  createRoutine,
  getRoutinesWithoutActivities,
  getAllActivities,
  addActivityToRoutine,
};
