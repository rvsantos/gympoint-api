module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('registrations', 'status', {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('registrations', 'status');
  }
};
