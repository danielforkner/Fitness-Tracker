const express = require('express');
const usersRouter = express.Router();
const { createUser, getUserByName } = require('../db');

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // check password length
    if (password.length < 8) {
      next({
        name: 'password error',
        message: 'password must be 8 characters or longer',
      });
    }

    // check for duplicate user
    const _user = await getUserByName({ username });
    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'Username is taken, try again',
      });
    }

    const user = await createUser({ username, password });
    console.log(user, 'USER');
    res.send({ user: user });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
