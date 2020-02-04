const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.select().table("topics");
};
