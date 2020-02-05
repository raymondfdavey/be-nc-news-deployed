const commentsRouter = require("express").Router();
const {
  patchCommentsByCommentsId,
  removeCommentByCommentId
} = require("../controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentsByCommentsId)
  .delete(removeCommentByCommentId);

module.exports = commentsRouter;
