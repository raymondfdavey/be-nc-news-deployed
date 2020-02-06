const commentsRouter = require("express").Router();
const {
  patchCommentsByCommentsId,
  removeCommentByCommentId,
  getCommentByCommentId
} = require("../controllers/comments.controller");
const { send405Error } = require("../errorHandling/error.functions");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentsByCommentsId)
  .delete(removeCommentByCommentId)
  .get(getCommentByCommentId)
  .all(send405Error);

module.exports = commentsRouter;
