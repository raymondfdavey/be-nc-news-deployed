const {
  createComment,
  fetchCommentsByArticleId,
  updateCommentsByCommentId,
  deleteCommentByCommentId,
  fetchCommentByCommentId
} = require("../models/comments.model");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  body.article_id = article_id;
  body.author = body.username;
  delete body.username;
  createComment(body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

exports.patchCommentsByCommentsId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentsByCommentId(comment_id, inc_votes)
    .then(comment => res.status(200).send({ comment }))
    .catch(err => next(err));
};

exports.removeCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByCommentId(comment_id)
    .then(result => {
      if (result === 1) {
        res.status(204).send();
      }
    })
    .catch(err => next(err));
};

exports.getCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  fetchCommentByCommentId(comment_id)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => next(err));
};
