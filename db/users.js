const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function createUser({ username, password }) {
  let createdUser;
  const hashedPassword = bcrypt.hashSync(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password)
        values ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING id, username;
        `,
      [username, hashedPassword]
    );
    createdUser = user;

    return createdUser;
  } catch (error) {
    throw error;
  }
}

// this function is for exporting purposes so we don't have to import bsync again somewhere else
function checkHash(password, hash) {
  if (bcrypt.compareSync(password, hash)) {
    return true;
  }
  return false;
}

async function getUser({ username, password }) {
  const user = await getUserByName({ username });
  const hashedPassword = user.password;

  if (checkHash(password, hashedPassword)) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT username
        FROM users
        WHERE username=$1 AND password=$2;
        `,
        [username, hashedPassword]
      );

      return user;
    } catch (error) {
      throw error;
    }
  } else {
    throw err; // bad password
  }
}

async function getUserByName({ username }) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT *
    FROM users
    WHERE username=$1;
    `,
    [username]
  );

  return user;
}

async function getUserById(userId) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT *
    FROM users
    WHERE id=$1;
    `,
    [userId]
  );

  return user;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByName,
  checkHash,
};
