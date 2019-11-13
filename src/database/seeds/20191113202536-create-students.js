module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Luna',
          email: 'luna@email.com',
          age: 20,
          height: 1.68,
          weight: 52.0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Rafael',
          email: 'rafael@email.com',
          age: 33,
          height: 1.88,
          weight: 82.0,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Jax',
          email: 'jax@email.com',
          age: 47,
          height: 1.78,
          weight: 92.0,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('students', null, {});
  }
};
