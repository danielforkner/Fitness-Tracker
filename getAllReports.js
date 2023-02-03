const client = require('./db/client');

const getAllReports = async () => {
  try {
    await client.connect();
    const { rows } = await client.query(`
        SELECT routines.*, duration, count, activities.id as "activityId", activities.name as "activityName", description, username as "creatorName"
        FROM routines
            JOIN routine_activities ON routines.id = routine_activities."routineId"
            JOIN activities ON activities.id = routine_activities."activityId"
            JOIN users ON "creatorId" = users.id;
        `);

    console.log(attachActivitiesToRoutines(rows));
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
};

const attachActivitiesToRoutines = (routines) => {
  const routinesById = {};
  routines.forEach((routine) => {
    if (!routinesById[routine.id]) {
      routinesById[routine.id] = routine;
      routine.activities = [];
    }
  });
  return routinesById;
};

getAllReports();
