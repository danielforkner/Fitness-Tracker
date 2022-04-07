const express = require('express');
const usersRouter = express.Router();
const { createUser, getUserByName } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

usersRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  console.log('ln 10 of users.js, auth header:', auth);
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { username } = jwt.verify(token, JWT_SECRET);
      console.log(username);

      if (username) {
        req.user = await getUserByName({ username });
        next();
      } else {
        res.status(409);
        next({ name: 'token error', message: 'token is invalid' });
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

usersRouter.get('/me', async (req, res, next) => {
  try {
    if (!req.user) {
      next({
        name: 'get/me error',
        message: 'you did not provide a valid user/token to get your data',
      });
    } else {
      res.send(req.user);
    }
  } catch ({ name, message }) {
    res.status(409);
    next({ name, message });
  }
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password',
    });
  }

  try {
    console.log(username);
    const user = await getUserByName({ username });
    if (user && user.password == password) {
      const token = jwt.sign(
        { id: user.id, username: username },
        process.env.JWT_SECRET,
        { expiresIn: '1w' }
      );
      res.send({
        message: "You're logged in!",
        token: token,
      });
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // check password length
    if (password.length < 8) {
      res.status(401);
      next({
        name: 'password error',
        message: 'password must be 8 characters or longer',
      });
    }

    // check for duplicate user
    const _user = await getUserByName({ username });
    if (_user) {
      res.status(401);
      next({
        name: 'UserExistsError',
        message: 'Username is taken, try again',
      });
    } else {
      const user = await createUser({ username, password });
      console.log(user, 'USER');
      res.send({ user });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
