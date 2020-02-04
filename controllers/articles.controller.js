const {
  fetchArticles,
  updateArticle,
  fetchAllArticlesAndComments
} = require("../models/articles.model");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticles(article_id).then(article => {
    res.status(200).send({ article });
  });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes).then(article =>
    res.status(202).send({ article })
  );
};

exports.getArticlesAndComments = (req, res, next) => {
  fetchAllArticlesAndComments().then(all_articles => {
    res.status(200).send({ all_articles });
  });
};
