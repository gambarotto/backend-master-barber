import fetch from 'node-fetch';
import Holiday from '../app/models/Holiday';

const holiday = async () => {
  const holidays = await Holiday.findOne({ where: { year: '2020' } });
  if (!holidays) {
    fetch(
      'https://api.calendario.com.br/?json=true&ano=2020&ibge=3525904&token=ZGdjZGV2ZWxvcGVyQGdtYWlsLmNvbSZoYXNoPTEyNTE5NjgyNw'
    )
      .then((res) => res.json())
      .then(async (json) => {
        const holidaysOk = await Holiday.create({
          year: '2020',
          ibge_code: '3525904',
          holidays: json,
        });
        return console.log(holidaysOk);
      });
  }
  return console.log('updated holidays');
};

export default holiday;
