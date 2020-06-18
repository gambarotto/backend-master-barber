const obj = {
  week_schedule: [
    {
      dayOfWeek: 0, // Domingo
      dayOff: false,
      schedule: {
        entrance: ['12:00'],
        exit: ['18:00'],
        lunch: ['16:00', '17:00'],
      },
    },
    {
      dayOfWeek: 1,
      dayOff: true,
      schedule: {
        entrance: ['10:00'],
        exit: ['18:00'],
        lunch: ['14:00', '15:00'],
      },
    },
    {
      dayOfWeek: 2,
      dayOff: false,
      schedule: {
        entrance: ['10:00'],
        exit: ['18:00'],
        lunch: ['14:00', '15:00'],
      },
    },
    {
      dayOfWeek: 3,
      schedule: {
        entrance: ['09:00'],
        exit: ['17:00'],
        lunch: ['14:00', '15:00'],
      },
    },
    {
      dayOfWeek: 4,
      dayOff: false,
      schedule: {
        entrance: ['11:00'],
        exit: ['20:00'],
        lunch: ['14:00', '15:00'],
      },
    },
    {
      dayOfWeek: 5,
      dayOff: false,
      schedule: {
        entrance: ['10:00'],
        exit: ['18:00'],
        lunch: ['14:00', '15:00'],
      },
    },
    {
      dayOfWeek: 6,
      dayOff: false,
      schedule: {
        entrance: ['10:00'],
        exit: ['18:00'],
        lunch: ['14:00', '15:00'],
      },
    },
    {
      holidays: 7,
      dayOff: false,
      schedule: {
        entrance: ['14:00'],
        exit: ['18:00'],
        lunch: [],
      },
    },
  ],
};

export default obj;
