const articlesRouter = require("express").Router();
const {
  getArticlesById,
  patchArticle,
  getArticlesAndComments
} = require("../controllers/articles.controller");

const {
  postComment,
  getCommentsByArticleId
} = require("../controllers/comments.controller");
const { send405Error } = require("../errorHandling/error.functions");

articlesRouter
  .route("/")
  .get(getArticlesAndComments)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
