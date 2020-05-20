module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'custumers',
      [
        {
          name: 'Cliente 01',
          email: 'cliente01@cliente.com',
          password_hash: '123456',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('custumers', null, {});
  },
};
