module.exports = {
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  host: '172.17.0.2',
  dialect: 'postgres',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
