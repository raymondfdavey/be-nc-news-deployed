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

articlesRouter.route("/").get(getArticlesAndComments);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId);

module.exports = articlesRouter;
