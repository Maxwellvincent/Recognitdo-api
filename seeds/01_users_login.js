const bcrypt = require('bcrypt-nodejs');
const hash = bcrypt.hashSync("123");

exports.seed = function(knex) {
  // Deletes ALL existing entries
    return knex('login').del()
    .then(() => {
      return knex('users').del()
    })
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: '1',
          name: 'John',
          email: 'john@example.com',
          entries: 0,
          joined: new Date()
        },
        { id: '2',
          name: 'Sally',
          email: 'sally@example.com',
          entries: 0,
          joined: new Date()
        },
      ]);
    })
    .then(() => {
      //insert login entries
      return knex('login').insert([
        {
          id: 1,
          hash,
          email: 'john@example.com'
        },
        {
          id:2,
          hash,
          email: 'sally@example.com'
        }
      ])
    });
};
