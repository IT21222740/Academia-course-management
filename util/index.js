const jwt = require("jsonwebtoken");
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3h",
    }
  );
};

// Helper function to find overlapping sessions
const findOverlappingSessions = async (updatedSessions, existingTimetables) => {
  // Array to store any found overlaps
  const overlaps = [];

  // Convert updatedSessions to a more convenient format
  // Create a Map where each key is a day and the value is an array of sessions for that day
  const updatedSessionsMap = new Map();
  // Loop over each day in updatedSessions
  for (const updatedDay of updatedSessions) {
    // Loop over each session in the current day
    for (const updatedSession of updatedDay.sessions) {
      // Convert the session start time to milliseconds since the Unix Epoch
      const updatedSessionStartTime = new Date(`1970-01-01T${updatedSession.time}:00Z`).getTime();
      // Calculate the session end time in milliseconds since the Unix Epoch
      const updatedSessionEndTime = updatedSessionStartTime + updatedSession.duration * 60 * 1000;
      // If the Map doesn't already have an entry for the current day, create one with an empty array as the value
      if (!updatedSessionsMap.has(updatedDay.day)) {
        updatedSessionsMap.set(updatedDay.day, []);
      }
      // Get the array of sessions for the current day
      const daySessions = updatedSessionsMap.get(updatedDay.day);
      // Loop over each session in the current day
      for (const session of daySessions) {
        // Check if the current session overlaps with the updated session
        // Two sessions overlap if the start time of one is within the duration of the other
        // and they share at least one location or resource ID
        if (
          (
            (updatedSessionStartTime >= session.startTime && updatedSessionStartTime < session.endTime) ||
            (session.startTime >= updatedSessionStartTime && session.startTime < updatedSessionEndTime)
          ) &&
          (
            session.location.some(loc => updatedSession.location.includes(loc)) ||
            session.resource_ids.some(id => updatedSession.resource_ids.includes(id))
          )
        ) {
          // If an overlap is found, throw an error
          const error = new Error('Overlapping sessions within the provided timetable') ;
          error.status = 400;
          throw error;
        }
      }
      // If there are no overlaps with the updated session, add it to the array of sessions for the current day
      daySessions.push({
        ...updatedSession,
        startTime: updatedSessionStartTime,
        endTime: updatedSessionEndTime,
      });
    }
  }


  // Loop over each timetable in existingTimetables
  for (const timetable of existingTimetables) {
    // Loop over each day in the current timetable
    for (const weekday of timetable.weekdays) {
      // If the Map has an entry for the current day, check for overlaps between the updated sessions and the existing sessions
      if (updatedSessionsMap.has(weekday.day)) {
        // Loop over each session in the current day
        for (const session of weekday.sessions) {
          // Convert the session start time to milliseconds since the Unix Epoch
          const sessionStartTime = new Date(`1970-01-01T${session.time}:00Z`).getTime();
          // Calculate the session end time in milliseconds since the Unix Epoch
          const sessionEndTime = sessionStartTime + session.duration * 60 * 1000;
          // Loop over each updated session for the current day
          for (const updatedSession of updatedSessionsMap.get(weekday.day)) {
            // Check if the current session overlaps with the updated session
            if (
              (
                (sessionStartTime >= updatedSession.startTime && sessionStartTime < updatedSession.endTime) ||
                (updatedSession.startTime >= sessionStartTime && updatedSession.startTime < sessionEndTime)
              )
            ) {
              // If an overlap is found, add it to the overlaps array
              const overlappingLocations = session.location.filter(loc => updatedSession.location.includes(loc.toString()));
              const overlappingResourceIds = session.resource_ids.filter(id => updatedSession.resource_ids.includes(id.toString()));
              if(overlappingLocations.length || overlappingResourceIds.length){
                overlaps.push({
                  day: weekday.day,
                  time: `${new Date(sessionStartTime).toISOString().substr(11, 5)} - ${new Date(sessionEndTime).toISOString().substr(11, 5)}`,
                  location: overlappingLocations,
                  resource_ids: overlappingResourceIds,
                });
              }
            }
          }
        }
      }
    }
  }

  return overlaps;
};

module.exports = {
  generateToken,
  findOverlappingSessions,
};
