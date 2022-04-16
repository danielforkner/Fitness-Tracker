// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require('express');
const apiRouter = express.Router();
const usersRouter = require('./users');
const activitiesRouter = require('./activities');
const routinesRouter = require('./routines');
const routine_activitiesRouter = require('./routine_activities.js');

apiRouter.get('/health', (req, res, next) => {
  res.send({ message: 'Server is listening...' });
});

apiRouter.use('/users', usersRouter);

apiRouter.use('/activities', activitiesRouter);

apiRouter.use('/routines', routinesRouter);

apiRouter.use('/routine_activities', routine_activitiesRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
