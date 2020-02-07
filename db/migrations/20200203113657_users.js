exports.up = function(knex) {
  return knex.schema.createTable("users", usersTable => {
    console.log("making table");
    usersTable
      .string("username")
      .primary()
      .unique();
    usersTable.string("name").notNullable();
    usersTable.string("avatar_url", 1000).notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping table");

  return knex.schema.dropTable("users");
};
