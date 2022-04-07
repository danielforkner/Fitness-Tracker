const express = require('express');
const usersRouter = express.Router();
const { createUser, getUserByName } = require('../db');
const jwt = require('jsonwebtoken')

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
        console.log(username)
      const user = await getUserByName( {username} );
      console.log(user)
      if (user && user.password == password) {
        const token = jwt.sign({ id:user.id, username:username}, process.env.JWT_SECRET, { expiresIn: '1w' })
        console.log(token)
        res.send({ 
          message: "You're logged in!",
          token: token 
        });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });


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
    console.log(_user, "_USER")
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
