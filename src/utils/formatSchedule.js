const formatSchedule = {
  /* eslint-disable no-plusplus */
  scheduleWeek(data) {
    const daysWeek = data;

    const schedule = daysWeek.map((day) => {
      const { entrance, exit, lunch } = day.schedule;
      const hourEntrance = entrance[0].split(':');
      const hourExit = exit[0].split(':');
      const hourEntranceLunch = lunch[0].split(':');
      const hourExitLunch = lunch[1].split(':');

      const arrBeforeLunch = [];
      const arrAfterLunch = [];

      for (let i = hourEntrance[0]; i < hourEntranceLunch[0]; i++) {
        arrBeforeLunch.push(`${i}:00`);
      }
      for (let i = hourExitLunch[0]; i < hourExit[0]; i++) {
        arrAfterLunch.push(`${i}:00`);
      }

      return {
        dayOfWeek: day.dayOfWeek,
        dayOff: day.dayOff,
        schedule: day.schedule,
        scheduleParsed: [...arrBeforeLunch, ...arrAfterLunch],
      };
    });
    return schedule;
  },
  scheduleHoliday(data) {
    const holiday = data;

    const { entrance, exit, lunch } = holiday;
    const hourEntrance = entrance[0].split(':');
    const hourExit = exit[0].split(':');

    const arrBeforeLunch = [];
    const arrAfterLunch = [];

    if (lunch.length === 0) {
      for (let i = hourEntrance[0]; i < hourExit[0]; i++) {
        arrBeforeLunch.push(`${i}:00`);
      }
    } else {
      const hourEntranceLunch = lunch[0].split(':');
      const hourExitLunch = lunch[1].split(':');

      for (let i = hourEntrance[0]; i < hourEntranceLunch[0]; i++) {
        arrBeforeLunch.push(`${i}:00`);
      }
      for (let i = hourExitLunch[0]; i < hourExit[0]; i++) {
        arrAfterLunch.push(`${i}:00`);
      }
    }

    return [...arrBeforeLunch, ...arrAfterLunch];
  },
};

export default formatSchedule;
