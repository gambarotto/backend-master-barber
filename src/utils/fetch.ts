import fetch from 'node-fetch';

interface Holiday {
  date: string;
  [key: string]: any;
}

const Fetch = {
  holidays: async (date: string, year: number): Promise<boolean> => {
    return fetch(
      `https://api.calendario.com.br/?json=true&ano=${year}&ibge=3525904&token=ZGdjZGV2ZWxvcGVyQGdtYWlsLmNvbSZoYXNoPTEyNTE5NjgyNw`
    )
      .then((res) => res.json())
      .then(async (json: Holiday[]) => {
        // console.log(json);
        if (json.find((holiday) => holiday.date === date)) {
          // console.log(true);
          return true;
        }
        // console.log(false);
        return false;
      });
  },
};

export default Fetch;

