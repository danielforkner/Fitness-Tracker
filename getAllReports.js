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

    console.log(JSON.stringify(attachActivitiesToRoutines(rows), null, 2));
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
      routinesById[routine.id] = {
        id: routine.id,
        creatorId: routine.creatorId,
        creatorName: routine.creatorName,
        isPublic: routine.isPublic,
        name: routine.name,
        goal: routine.goal,
        activities: [],
      };
    }
    routinesById[routine.id].activities.push({
      id: routine.activityId,
      name: routine.activityName,
      description: routine.description,
      duration: routine.duration,
      count: routine.count,
    });
  });
  //   return routinesById;
  return Object.values(routinesById);
};

getAllReports();
