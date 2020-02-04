const {
  createComment,
  fetchCommentsByArticleId
} = require("../models/comments.model");

exports.postComment = (req, res, next) => {
  console.log("in comment controller");
  const { article_id } = req.params;
  const { body } = req;
  body.article_id = article_id;
  createComment(body).then(postedComment => {
    res.status(201).send({ postedComment });
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id).then(comments => {
    res.status(200).send({ comments });
  });
};
