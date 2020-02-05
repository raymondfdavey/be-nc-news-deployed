\c nc_news_test;


SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id;


return connection.select("articles.*").from("articles").count({comment_count: "comment_id"}).leftJoin("comments", "comments.article_id","articles.article_id").groupBy("articles.articles_id")

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