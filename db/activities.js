const client = require('./client');

async function createActivity({ name, description }) {
  const { rows } = await client.query(
    `
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [name, description]
  );

  return rows;
}

async function getAllActivities() {
  const { rows } = await client.query(`
    SELECT * FROM activities;
    `);

  return rows;
}

module.exports = { createActivity, getAllActivities };
