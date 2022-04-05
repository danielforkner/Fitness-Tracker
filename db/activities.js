const client = require('./client');

async function createActivity({ name, description }) {
  const { rows : [activity] } = await client.query(
    `
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [name, description]
  );

  return activity;
}

async function getAllActivities() {
  const { rows } = await client.query(`
    SELECT * FROM activities;
    `);

  return rows;
}


async function updateActivity({ id, name, description }) {
  const { rows: [activities] } = await client.query(`
    UPDATE activities 
    SET name=$2, description=$3
    WHERE id=$1
    RETURNING *;
    `,
    [id, name, description]
    );

  return activities;
}

module.exports = { 
  createActivity, 
  getAllActivities,
  updateActivity
};
