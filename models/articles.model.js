const connection = require("../db/connection");
const { fetchUserByUsername } = require("../models/users.model");
const { fetchTopics } = require("../models/topics.model");

exports.fetchArticles = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", article_id)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "NOT FOUND" });
      }
      return result;
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "INFORMATION IN WRONG FORMAT" });
  }
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([updatedArticle]) => {
      if (updatedArticle === undefined) {
        return Promise.reject({ status: 404, msg: "NOT FOUND" });
      }
      return updatedArticle;
    });
};

exports.fetchAllArticlesAndComments = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
  // limit = 10,
  // p = 1
) => {
  if (order !== "desc" && order !== "asc") {
    return Promise.reject({
      status: 422,
      msg: "ORDERING IS EITHER 'ASC' OR 'DESC"
    });
  }
  return (
    connection
      .select("articles.*")
      .from("articles")
      .count({ comment_count: "comment_id" })
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify(chainedArticles => {
        if (author) {
          chainedArticles.where("articles.author", "=", author);
        }
        if (topic) {
          chainedArticles.where("articles.topic", "=", topic);
        }
      })
      // .limit(limit)
      // .offset(limit * (p - 1))
      .then(result => {
        if (result.length === 0) {
          if (author) {
            return Promise.all([fetchUserByUsername(author), result]).then(
              ([userCheck, result]) => {
                if (userCheck.length !== 0) {
                  return result;
                }
              }
            );
          }
          if (topic) {
            return Promise.all([fetchTopics(topic), result]).then(
              ([topicCheck, result]) => {
                if (topicCheck.length !== 0) {
                  return result;
                }
              }
            );
          }
        }
        return result;
      })
  );
};
