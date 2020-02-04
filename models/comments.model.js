const connection = require("../db/connection");

exports.fetchCommentsByArticleId = article_id => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id);
};

exports.createComment = body => {
  return connection
    .insert(body)
    .into("comments")
    .returning("*")
    .then(([result]) => result);
};
