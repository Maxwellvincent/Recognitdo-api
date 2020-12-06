// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: "postgres://localhost/smart-brain"
    // connection: "postgres://localhost/smart_brain" // for Mac 
    // connection: process.env.DATABASE_URL
  },

  test: {
    client: 'pg',
    connection: "postgres://localhost/smartbrain-test"
  },
  
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
