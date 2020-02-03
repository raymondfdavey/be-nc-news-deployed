exports.up = function(knex) {
  console.log("creating users table");
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .unique();
    usersTable.string("name").notNullable();
    usersTable.string("avatar_url", 1000).notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping users table");
  return knex.schema.dropTable("users");
};
