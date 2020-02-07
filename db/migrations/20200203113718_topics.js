exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .unique("slug");
    topicsTable.string("description", 2000).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("topics");
};
