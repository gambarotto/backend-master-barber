module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'rating_stores',
      [
        {
          qty: 0,
          rating: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('rating_stores', null, {});
  },
};
