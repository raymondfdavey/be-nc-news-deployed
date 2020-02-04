const connection = require("../db/connection");
const { fetchCommentsByArticleId } = require("../models/comments.model");

exports.fetchArticles = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .then(article => {
      return Promise.all([article, fetchCommentsByArticleId(article_id)]).then(
        ([article, comments]) => {
          const [newArticle] = article;
          newArticle.comments = comments.length;
          return newArticle;
        }
      );
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([updatedArticle]) => {
      return updatedArticle;
    });
};

exports.fetchAllArticlesAndComments = () => {
  console.log("for messing");
  const articleCommentKey = () => {
    return connection("articles")
      .join("comments", "articles.article_id", "=", "comments.article_id")
      .select("*")
      .then(result => {
        const newObj = {};
        result.forEach(comment => {
          if (newObj[comment.article_id] === undefined) {
            newObj[comment.article_id] = 1;
          } else {
            newObj[comment.article_id] += 1;
          }
        });
        return newObj;
      });
  };

  const allArticles = () => {
    return connection.select("*").from("articles");
  };
  return Promise.all([articleCommentKey(), allArticles()]).then(
    ([key, articles]) => {
      const articlesWithCommentCount = articles.map(article => {
        const newObj = { ...article };
        if (Object.keys(key).includes(article.article_id.toString())) {
          newObj.comments = key[article.article_id];
        } else {
          newObj.comments = 0;
        }
        return newObj;
      });
      return articlesWithCommentCount;
    }
  );
};
/*
exports.fetchAllArticlesAndComments = () => {
  console.log("for messing");
  return connection("articles")
    .join("comments", "articles.article_id", "=", "comments.article_id")
    .select("*")
    .then(result => {
      const newObj = {};
      result.forEach(comment => {
        if (newObj[comment.article_id] === undefined) {
          newObj[comment.article_id] = 1;
        } else {
          newObj[comment.article_id] += 1;
        }
      });
      return Promise.all([]);
    });
};
*/
