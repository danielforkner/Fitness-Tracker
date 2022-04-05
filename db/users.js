const client = require('./client');

async function createUser({ username, password }) {
  const {
    rows: [user],
  } = await client.query(
    `
    INSERT INTO users(username, password)
    values ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING username;
    `,
    [username, password]
  );

  return user;
}

async function getUser({ username, password }) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT username
    FROM users
    WHERE username=$1 AND password=$2;
    `,
    [username, password]
  );

  return user;
}

async function getUserById( id ) {
  const {
    rows,
  } = await client.query(
    `
    SELECT username
    FROM users
    WHERE id=$1;
    `,
    [id]
  );

  return rows;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
};
