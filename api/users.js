const express = require('express');
const usersRouter = express.Router();
const { createUser, getUserByName } = require('../db');

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByName({ username });

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'Username is taken, try again',
      });
    } else {
      const user = await createUser({ username, password });
      console.log(user, 'USER');
      res.send({ user: user });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
