const connection = require("../db/connection");
const { fetchCommentsByArticleId } = require("../models/comments.model");

exports.fetchArticles = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", article_id)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 400, msg: "NOT FOUND" });
      }
      return result;
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 422, msg: "INFORMATION IN WRONG FORMAT" });
  }
  return connection("articles")
    .where("article_id", "=", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([updatedArticle]) => {
      if (updatedArticle === undefined) {
        return Promise.reject({ status: 400, msg: "NOT FOUND" });
      }
      return updatedArticle;
    });
};

exports.fetchAllArticlesAndComments = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "desc" && order !== "asc") {
    return Promise.reject({
      status: 422,
      msg: "ORDERING IS EITHER 'ASC' OR 'DESC"
    });
  }
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(chainedArticles => {
      if (author) {
        chainedArticles.where("articles.author", "=", author);
      }
      if (topic) {
        chainedArticles.where("articles.topic", "=", topic);
      }
    })
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 400, msg: "NOT FOUND" });
      }
      return result;
    });
};

/*
//hey future ray. maybe you should split the functionality of this model function. As in - you could have one function that creates the article comment key, one that gets all articles, and then a util function that combines them?// maybe change this to just fetch all comments and reduce em
  console.log("for messing");
  const articleCommentKey = () => {
    return connection("comments")
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
*/
