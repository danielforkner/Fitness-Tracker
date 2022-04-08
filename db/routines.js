const client = require('./client');
const { mapRoutines } = require('./utils');

async function createRoutine({ creatorId, isPublic, name, goal }) {
  const {
    rows: [routine],
  } = await client.query(
    `
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [creatorId, isPublic, name, goal]
  );
  return routine;
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    SELECT * FROM routines
    WHERE routines.id = $1
    `,
      [id]
    );
    return routine;
  } catch (error) {
    console.error('error in getRoutineById from routines.js');
    throw error;
  }
}

async function updateRoutine({ id, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    UPDATE routines SET 
      "isPublic"=COALESCE($2, routines."isPublic"),
      name=COALESCE($3, name),
      goal=COALESCE($4, goal)
    WHERE routines.id=$1
    RETURNING *;
    `,
      [id, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    console.error('error in updateRoutine from routines.js');
    throw error;
  }
}

async function getRoutineActivitiesByRoutine(routine) {
  try {
    const { rows } = await client.query(
      `
    SELECT * 
    FROM routine_activities
    WHERE routine_activities."routineId"=$1;
    `,
      [routine.id]
    );
    return rows;
  } catch (error) {
    console.error('error in getRoutineActivitiesByRoutine from routines.js');
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
    DELETE FROM routines 
      WHERE routines.id=$1;
    `,
      [id]
    );
    await client.query(
      `
    DELETE FROM routine_activities 
      WHERE routine_activities."routineId"=$1;
    `,
      [id]
    );
  } catch (error) {
    console.error('error in destroyRoutine from routines.js');
    throw error;
  }
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
  try {
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
  } catch (error) {
    console.error('error in getAllRoutines from routines.js');
    throw error;
  }
}

// MAKE NEW QUERIES INSTEAD OF CALLING GETALLROUTINES
// if db has 1,000,000 routines and you just want a few,
// only request a few from the db
async function getAllPublicRoutines() {
  try {
    let all = await getAllRoutines(); // NEW CLIENT.QUERY HERE
    return all.filter((routine, i) => routine.isPublic);
  } catch (error) {
    console.error('error in getAllPublicRoutines from routines.js');
    throw error;
  }
}

async function getAllRoutinesByUser(user) {
  try {
    let all = await getAllRoutines(); // NEW CLIENT.QUERY HERE
    return all.filter((routine, i) => {
      return routine.creatorName === user.username;
    });
  } catch (error) {
    console.error('error in getAllRoutinesByUser from routines.js');
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    let all = await getAllRoutinesByUser({ username });
    const filtered = all.filter((routine, i) => {
      return routine.isPublic;
    });
    return filtered;

  } catch (error) {
    console.error('error in getPublicRoutinesByUser from routines.js');
    throw error;
  }
}

async function getPublicRoutinesByActivity(activity) {
  try {
    let { rows } = await client.query(
      `
    select
    routines.id, "creatorId", "isPublic", routines.name, goal,
    routine_activities."routineId", routine_activities."activityId", duration, routine_activities.count,
    activities.name as "activityName", activities.description,
    users.username as "creatorName"
    from routines
    left join routine_activities on routine_activities."routineId" = routines.id
    left join activities on activities.id  = routine_activities."routineId"
    left join users on users.id = routines."creatorId"
    WHERE routine_activities."activityId" = $1;
    `,
      [activity.id]
    );

    return mapRoutines(rows);
  } catch (error) {
    console.error('error in getPublicRoutinesByActivity from routines.js');
    throw error;
  }
}

module.exports = {
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  getRoutineActivitiesByRoutine,
};
