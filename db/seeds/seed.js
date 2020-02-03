const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .returning("*");
      const usersInsertions = knex("users")
        .insert(userData)
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(([topicsInsertions, usersInsertions]) => {
      const newArticles = formatDates(articleData);
      return knex
        .insert(newArticles)
        .into("articles")
        .returning("*");
    })
    .then(reformattedArticles => {
      const articleRef = makeRefObj(reformattedArticles);
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
