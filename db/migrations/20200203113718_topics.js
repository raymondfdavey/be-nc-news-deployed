exports.up = function(knex) {
  console.log("START");

  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .unique("slug");
    topicsTable.string("description", 2000).notNullable();
  });
};

exports.down = function(knex) {
  console.log("START");

  return knex.schema.dropTable("topics");
};
