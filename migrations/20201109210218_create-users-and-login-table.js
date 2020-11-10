
exports.up = function(knex) {
    return knex.schema.dropTableIfExists('users')
        .createTable('users', (table) => {
        table.increments();
        table.text('name');
        table.text('email').unique().notNullable();
        table.bigInteger('entries').defaultTo(0);
        table.timestamp('joined').defaultTo(knex.fn.now()).notNullable();
    })

  .createTable('login', (table) => {
      table.increments();
      table.string('hash').notNullable();
      table.text('email').unique().notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('login')
    .dropTable('users')
};
