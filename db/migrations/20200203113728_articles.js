exports.up = function(knex) {
  console.log("making table");

  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.text("body", "longtext").notNullable();
    articlesTable
      .integer("votes")
      .defaultTo(0)
      .notNullable();
    articlesTable
      .string("topic")
      .references("topics.slug")
      .notNullable();
    articlesTable
      .string("author")
      .references("users.username")
      .notNullable();
    articlesTable.timestamp("created_at").notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping table");

  return knex.schema.dropTable("articles");
};
