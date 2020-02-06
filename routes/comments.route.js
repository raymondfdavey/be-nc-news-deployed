const commentsRouter = require("express").Router();
const {
  patchCommentsByCommentsId,
  removeCommentByCommentId
} = require("../controllers/comments.controller");
const { send405Error } = require("../errorHandling/error.functions");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentsByCommentsId)
  .delete(removeCommentByCommentId)
  .all(send405Error);

module.exports = commentsRouter;
