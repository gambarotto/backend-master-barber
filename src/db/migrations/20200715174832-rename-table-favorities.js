module.exports = {
  up: (queryInterface) => {
    return queryInterface.renameTable('favorities', 'favorites');
  },

  down: (queryInterface) => {
    return queryInterface.renameTable('favorites', 'favorities');
  },
};
