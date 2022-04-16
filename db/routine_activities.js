const client = require('./client');

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );
    return activity;
  } catch (error) {
    console.error('error in addActivityToRoutine from activities.js');
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routineId],
    } = await client.query(
      `
      SELECT routine_activities.id
      FROM routine_activities
      WHERE id=$1;
    `,
      [id]
    );
    return routineId;
  } catch (error) {
    throw error;
  }
}

async function getRoutineByRoutineActivityId(id) {
  try {
    const {
      rows: [routineId],
    } = await client.query(
      `
      SELECT routine_activities."routineId"
      FROM routine_activities
      WHERE id=$1;
    `,
      [id]
    );
    return routineId;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ routineActivityId, count, duration }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    UPDATE routine_activities SET 
      count=COALESCE($2, count),
      duration=COALESCE($3, duration)
    WHERE id=$1
    RETURNING *;
    `,
      [routineActivityId, count, duration]
    );
    return activity;
  } catch (error) {
    console.error('error in updateRoutineActivity from routine_activities.js');
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    DELETE FROM routine_activities 
      WHERE routine_activities.id=$1
      RETURNING *;
    `,
      [id]
    );
    return activity;
  } catch (error) {
    console.error('error in destroyRoutineActivity from routine_routines.js');
    throw error;
  }
}

module.exports = {
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineByRoutineActivityId,
  getRoutineActivityById,
};
