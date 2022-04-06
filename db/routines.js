const client = require('./client');
const { mapRoutines } = require('./utils');

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

// you may get errors in the query where "creatorId"
// is unspecified or something like that
async function getAllRoutines() {
  const { rows } = await client.query(`
  select
  routines.id, "creatorId", "isPublic", routines.name, goal,
  routine_activities."routineId", routine_activities."activityId", duration, routine_activities.count,
  activities.name as "activityName", activities.description,
  users.username as "creatorName"
  from routines
  left join routine_activities on routine_activities."routineId" = routines.id
  left join activities on activities.id  = routine_activities."routineId"
  left join users on users.id = routines."creatorId";
      `);

  return mapRoutines(rows);
}

module.exports = {
  createRoutine,
  getRoutinesWithoutActivities,
  getAllRoutines,
};
