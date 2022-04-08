const mapRoutines = (rows) => {
  let map = {};
  for (const row of rows) {
    if (!map[row.id]) {
      map[row.id] = {
        id: row.id,
        isPublic: row.isPublic,
        creatorId: row.creatorId,
        creatorName: row.creatorName,
        name: row.name,
        goal: row.goal,
        activities: [],
      };
    }
    if (row.activityId) {
      map[row.id].activities.push({
        id: row.activityId,
        name: row.activityName,
        description: row.description,
        duration: row.duration,
        count: row.count,
      });
    }
  }

  return Object.values(map);
};

module.exports = { mapRoutines };
