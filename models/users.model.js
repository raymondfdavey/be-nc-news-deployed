const connection = require("../db/connection");

exports.fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .then(results => {
      if (results.length === 0) {
        return Promise.reject({ status: 404, msg: "NOT FOUND" });
      }
      return results;
    });
};
