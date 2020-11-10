// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: "postgres://localhost/smart-brain"
  },

  test: {
    client: 'pg',
    connection: "postgres://localhost/smart-brain-test"
  },
  
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
