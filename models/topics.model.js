const connection = require("../db/connection");

exports.fetchTopics = topic => {
  return connection
    .select()
    .table("topics")
    .modify(chain => {
      if (topic) {
        chain.where("slug", "=", topic);
      }
    })
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "NOT FOUND" });
      } else {
        return result;
      }
    });
};
