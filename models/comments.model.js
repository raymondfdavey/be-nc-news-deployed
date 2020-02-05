const connection = require("../db/connection");

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  if (order !== "desc" && order !== "asc") {
    return Promise.reject({
      status: 422,
      msg: "ORDERING IS EITHER 'ASC' OR 'DESC"
    });
  }
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by, order)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 400, msg: "NOT FOUND" });
      }
      return result;
    });
};

exports.createComment = body => {
  return connection
    .insert(body)
    .into("comments")
    .returning("*")
    .then(([result]) => result);
};

exports.updateCommentsByCommentId = (comment_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 422, msg: "INFORMATION IN WRONG FORMAT" });
  }
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([updatedComment]) => {
      if (updatedComment === undefined) {
        return Promise.reject({ status: 400, msg: "NOT FOUND" });
      }
      return updatedComment;
    });
};

exports.deleteCommentByCommentId = comment_id => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then(result => {
      if (result === 0) {
        return Promise.reject({ status: 400, msg: "NOT FOUND" });
      } else {
        return result;
      }
    });
};
