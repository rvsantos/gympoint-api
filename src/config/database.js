module.exports = {
  development: {
    username: 'postgres',
    password: 'docker',
    database: 'gympoint',
    host: '172.17.0.2',
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: 'docker',
    database: 'gympoint_test',
    host: '172.17.0.2',
    dialect: 'postgres'
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
