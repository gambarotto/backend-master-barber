interface DaySchedule {
  dayOfWeek: number;
  dayOff: boolean;
  schedule: {
    entrance: string[];
    exit: string[];
    lunch: string[];
  };
}

interface ScheduleData {
  dayOfWeek: number;
  dayOff: boolean;
  schedule: {
    entrance: string[];
    exit: string[];
    lunch: string[];
  };
  scheduleParsed: string[];
}

interface HolidayData {
  entrance: string[];
  exit: string[];
  lunch: string[];
}

const formatSchedule = {
  /* eslint-disable no-plusplus */
  scheduleWeek(data: DaySchedule[]): ScheduleData[] {
    const daysWeek = data;

    const schedule = daysWeek.map((day) => {
      const { entrance, exit, lunch } = day.schedule;

      const hourEntrance = entrance[0].split(':');

      const hourExit = exit[0].split(':');

      const arrBeforeLunch: string[] = [];
      const arrAfterLunch: string[] = [];
      if (lunch.length === 0) {
        for (let i = Number(hourEntrance[0]); i < Number(hourExit[0]); i++) {
          arrBeforeLunch.push(`${i}:00`);
        }
      } else {
        const hourEntranceLunch = lunch[0].split(':');
        const hourExitLunch = lunch[1].split(':');

        for (let i = Number(hourEntrance[0]); i < Number(hourEntranceLunch[0]); i++) {
          arrBeforeLunch.push(`${i}:00`);
        }
        for (let i = Number(hourExitLunch[0]); i < Number(hourExit[0]); i++) {
          arrAfterLunch.push(`${i}:00`);
        }
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
  scheduleHoliday(data: HolidayData): string[] {
    const holiday = data;

    const { entrance, exit, lunch } = holiday;
    const hourEntrance = entrance[0].split(':');
    const hourExit = exit[0].split(':');

    const arrBeforeLunch: string[] = [];
    const arrAfterLunch: string[] = [];

    if (lunch.length === 0) {
      for (let i = Number(hourEntrance[0]); i < Number(hourExit[0]); i++) {
        arrBeforeLunch.push(`${i}:00`);
      }
    } else {
      const hourEntranceLunch = lunch[0].split(':');
      const hourExitLunch = lunch[1].split(':');

      for (let i = Number(hourEntrance[0]); i < Number(hourEntranceLunch[0]); i++) {
        arrBeforeLunch.push(`${i}:00`);
      }
      for (let i = Number(hourExitLunch[0]); i < Number(hourExit[0]); i++) {
        arrAfterLunch.push(`${i}:00`);
      }
    }

    return [...arrBeforeLunch, ...arrAfterLunch];
  },
};

export default formatSchedule;

