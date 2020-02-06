const {
  fetchArticles,
  updateArticle,
  fetchAllArticlesAndComments
} = require("../models/articles.model");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};
exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then(article => res.status(202).send({ article }))
    .catch(err => next(err));
};

exports.getArticlesAndComments = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  fetchAllArticlesAndComments(sort_by, order, author, topic)
    .then(articles => {
      if (articles.length === 0) {
        res.status(200).send({ msg: "NO ARTICLES MATCHING REQUEST FOUND" });
      } else {
        res.status(200).send({ articles });
      }
    })
    .catch(err => next(err));
};
