const client = require('./client');

async function createRoutine({ creatorId, isPublic, name, goal }) {
  const { rows } = await client.query(
    `
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [creatorId, isPublic, name, goal]
  );

  return rows;
}

async function getRoutinesWithoutActivities() {
  const { rows } = await client.query(`
    SELECT * FROM routines;
    `);

  return rows;
}

// include activities
async function getAllRoutines() {
  const { rows } = await client.query(`
      SELECT routines.name FROM routines;
      `);

  return rows;
}

module.exports = {
  createRoutine,
  getRoutinesWithoutActivities,
  getAllRoutines,
};
