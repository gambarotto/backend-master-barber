import fetch from 'node-fetch';

const Fetch = {
  holidays: async (date, year) => {
    return fetch(
      `https://api.calendario.com.br/?json=true&ano=${year}&ibge=3525904&token=ZGdjZGV2ZWxvcGVyQGdtYWlsLmNvbSZoYXNoPTEyNTE5NjgyNw`
    )
      .then((res) => res.json())
      .then(async (json) => {
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
