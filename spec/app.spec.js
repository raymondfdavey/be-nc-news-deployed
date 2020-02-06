process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
chai.use(chaiSorted);
const app = require("../app");
const request = require("supertest");
const { expect } = chai;
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => connection.destroy());
  describe("Invalid Methods /api/topics", () => {
    it("status:405", () => {
      const invalidMethods = ["put", "patch", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("Invalid Methods /api/users:username", () => {
    it("status:405", () => {
      const invalidMethods = ["put", "patch", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users/:username")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("Invalid Methods /api/articles/:article_id", () => {
    it("status:405", () => {
      const invalidMethods = ["put", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/:article_id/")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("Invalid Methods /api/articles/article_id/comments", () => {
    it("status:405", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles/article_id/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("Invalid Methods /api/articles/", () => {
    it("status:405", () => {
      const invalidMethods = ["put", "patch", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("Invalid Methods /api/comments/comment_id", () => {
    it("status:405", () => {
      const invalidMethods = ["put", "post"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/comments/:comment_id")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/api/topics", () => {
    it("GET: 200 - responds with a topic object containing a slug and description for each topic", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.topics.forEach(topic => {
            expect(topic).to.have.keys(["slug", "description"]);
          });
        });
    });
  });
  describe("/api/users", () => {
    describe("/api/users/:username", () => {
      it("GET: 200 - responds with a user object containing the username, avatar url, and name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.eql({
              username: "rogersop",
              name: "paul",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
            });
          });
      });
      it("GET: 404 - responds with 404 code and NOT FOUND message if passed a username that does not exist", () => {
        return request(app)
          .get("/api/users/IDEFINITELYDONOTEXIST")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("NOT FOUND");
          });
      });
    });
  });
  describe("/api/articles", () => {
    it("GET: 200 - responds with an array of all articles with a comment count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.eql(12);
          body.articles.forEach(article => {
            expect(article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
          });
        });
    });
    describe("/api/articles/?sort_by", () => {
      it("GET: 200 - sorts results by created_at and in descending order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET: 200 - accepts a sort_by querie and sorts by that querie in descending order by default ", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("votes", {
              descending: true
            });
          });
      });
      it("GET: 200 - accepts a sort_by querie and an order querie and sorts by that querie in specified order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("votes");
          });
      });
      it("GET: 200 - accepts a different sort_by querie and an order querie and sorts by that querie in specified order ", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("article_id");
          });
      });
      it("GET: 200 - accepts an author querie and filters the results by author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
            body.articles.forEach(article => {
              expect(article.author).to.eql("butter_bridge");
            });
          });
      });
      it("GET: 200 - returns 200 code and NO ARTICLES MATCHING REQUEST FOUND message when articles requester for an author who does exist but has not written an article", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).to.eql("NO ARTICLES MATCHING REQUEST FOUND");
          });
      });
      it("GET: 200 - returns 200 code and NO ARTICLES MATCHING REQUEST FOUND message when articles are requested by a topic which exists but has no articles yet", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).to.eql("NO ARTICLES MATCHING REQUEST FOUND");
          });
      });
      it("GET: 200 - accepts an topic querie and filters the results by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
            body.articles.forEach(article => {
              expect(article.topic).to.eql("mitch");
            });
          });
      });
      it("GET: 200 - accepts a sort_by, order, and a topic querie and filters the sorted results by topic", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&topic=mitch&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("votes");
            body.articles.forEach(article => {
              expect(article.topic).to.eql("mitch");
            });
          });
      });
    });
  });
  describe("/api/articles?queries ERRORS", () => {
    it.only("GET: 400 - responds with 400 status and CANNOT PROCESS message if passed a sort-by querie where the sort criteria does not exist", () => {
      return request(app)
        .get("/api/articles?sort_by=IDON-TO-EXIST")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("CANNOT PROCESS");
        });
    });
    it("GET: 422 - responds with 422 status and CANNOT PROCESS message if passed an order querie where the sort criteria does not exist", () => {
      return request(app)
        .get("/api/articles?order=BANANAS")
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.eql("ORDERING IS EITHER 'ASC' OR 'DESC");
        });
    });
    it("GET: 200 - ignores querie if passed a querie which has incorrect structure", () => {
      return request(app)
        .get("/api/articles?blahblahdjhadjh")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.eql(12);
          body.articles.forEach(article => {
            expect(article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
          });
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("GET: 200 - responds with an article object with keys for author, title, article_id, body, topic, created_at, votes and a correct comment count", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.have.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at",
            "comment_count"
          );
          expect(body.article.comment_count).to.eql("2");
        });
    });
    it("GET: 404 - responds with 404 code and NOT FOUND if passed a valid article_id that does not exist", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("NOT FOUND");
        });
    });
    it("GET: 400 - responds with 400 code and BAD REQUEST if passed an invalid article_id", () => {
      return request(app)
        .get("/api/articles/imnotanumber")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("BAD REQUEST");
        });
    });
    it("PATCH: 202 - takes a new votes object of the form {inc_votes: newVote}, updates specified article with the votes specified and responds with the updated article", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: -100 })
        .expect(202)
        .then(({ body }) => {
          expect(body.article.votes).to.eql(-100);
          expect(body.article).to.have.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at"
          );
        });
    });
    it("PATCH: 202 - increments up as well as down", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 150 })
        .expect(202)
        .then(({ body }) => {
          expect(body.article.votes).to.eql(150);
        });
    });
    it("PATCH: 404 - responds with 404 and NOT FOUND if user tries to patch to valid but non existant article_id", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({ inc_votes: 150 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("NOT FOUND");
        });
    });
    it("PATCH: 400 - responds with 400 and BAD REQUEST if user tries to patch to an invalid article_id", () => {
      return request(app)
        .patch("/api/articles/imalsonotanumber")
        .send({ inc_votes: 150 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("BAD REQUEST");
        });
    });
    it("PATCH: 400 - responds with 400 and INFORMATION IN WRONG FORMAT if user tries to patch to a valid article_id with invalid data", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ blah: "NOT WHAT WE WANT" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("INFORMATION IN WRONG FORMAT");
        });
    });
    it("PATCH: 400 - responds with 400 and INFORMATION IN WRONG FORMAT if user tries to patch an object with no structure", () => {
      const rubbish = "rubbish";
      return request(app)
        .patch("/api/articles/2")
        .send({ rubbish })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("INFORMATION IN WRONG FORMAT");
        });
    });
    describe("/api/articles/:article_id/comments", () => {
      it("POST: 201 - accepts an object with username and body keys and responds with the posted comment", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            author: "rogersop",
            body: "absolutely, rootin, tootin, loved it"
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });
      it("POST: 404 - responds with 404 code and NOT FOUND message if user tries to post a comment to an valid but non-existant article", () => {
        return request(app)
          .post("/api/articles/999999/comments")
          .send({
            author: "rogersop",
            body: "absolutely, rootin, tootin, loved it"
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("RESOURCE NOT FOUND");
          });
      });
      it("POST: 400 - responds with 400 code and CANNOT PROCESS when passed a valid article id but invalid data", () => {
        return request(app)
          .post("/api/articles/3/comments")
          .send({
            wrong: "so wrong"
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("CANNOT PROCESS");
          });
      });
      it("GET: 200 - responds with an array of all of the comments for the article ID specified", () => {
        return request(app)
          .get("/api/articles/5/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.eql(2);
            body.comments.forEach(comment => {
              expect(comment.article_id).to.eql(5);
              expect(comment).to.have.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
            });
          });
      });
      it("GET: 404 - responds with 404 status code and NOT FOUND message when comments requested for article_id that is valid but does not exist", () => {
        return request(app)
          .get("/api/articles/999999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("NOT FOUND");
          });
      });
      it("GET: 400 - responds with 400 status code and Bad Request message when comments requested for article_id that is not valid", () => {
        return request(app)
          .get("/api/articles/notanumber46723863/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("BAD REQUEST");
          });
      });
      describe("/api/articles/:article_id/comments?queries", () => {
        it("GET: 200 - sorts results by created by and desc by default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("GET: 200 - accepts a sort_by querie and sorts by that querie in descending order ", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.sortedBy("votes", {
                descending: true
              });
            });
        });
        it("GET: 200 - accepts a sort_by querie and an order querie and sorts by that querie in specified order ", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.sortedBy("votes");
            });
        });
        it("GET: 200 - accepts a different sort_by querie and an order querie and sorts by that querie in specified order ", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.sortedBy("comment_id");
            });
        });
        describe("/api/articles/:article_id/comments?queries ERRORS", () => {
          it("GET: 400 - responds with 400 status and CANNOT PROCESS message if passed a sort-by querie where the sort criteria does not exist", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=BANANAS")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql("CANNOT PROCESS");
              });
          });
          it("GET: 400 - responds with 400 status and CANNOT PROCESS message if passed an order querie where the sort criteria does not exist", () => {
            return request(app)
              .get("/api/articles/1/comments?order=BANANAS")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.eql("ORDERING IS EITHER 'ASC' OR 'DESC");
              });
          });
          it("GET: 200 - ignores querie if passed a querie which has incorrect structure", () => {
            return request(app)
              .get("/api/articles/5/comments?blahblahdjhadjh")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).to.eql(2);
                body.comments.forEach(comment => {
                  expect(comment.article_id).to.eql(5);
                  expect(comment).to.have.keys(
                    "comment_id",
                    "author",
                    "article_id",
                    "votes",
                    "created_at",
                    "body"
                  );
                });
              });
          });
        });
      });
    });
  });
  describe("/api/comments", () => {
    describe("/api/comments/:comment_id", () => {
      it("PATCH: 200 - accepts an object with an increment votes object, updates the votes count on the comment with specifiec comment_id on the database. Responds with updated comments ", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ inc_votes: 100 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.eql(114);
          });
      });
      it("PATCH: 404 - responds with 404 and NOT FOUND if user tries to patch to valid but non existant comment_id", () => {
        return request(app)
          .patch("/api/comments/99999")
          .send({ inc_votes: 150 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("NOT FOUND");
          });
      });
      it("PATCH: 400 - responds with 400 and BAD REQUEST if user tries to patch to an invalid comment_id", () => {
        return request(app)
          .patch("/api/comments/imalsonotanumber")
          .send({ inc_votes: 150 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("BAD REQUEST");
          });
      });
      it("PATCH: 400 - responds with 400 and INFORMATION IN WRONG FORMAT if user tries to patch to a valid comment_id with invalid data", () => {
        return request(app)
          .patch("/api/comments/2")
          .send({ blah: "NOT WHAT WE WANT" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("INFORMATION IN WRONG FORMAT");
          });
      });
      it("DELETE: 204 - deletes the specified comment from the database", () => {
        return request(app)
          .delete("/api/comments/2")
          .expect(204);
      });
      it("DELETE: 404 - responds with 404 code and NOT FOUND message if comment_id is valid but non-existent ", () => {
        return request(app)
          .delete("/api/comments/999999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("NOT FOUND");
          });
      });
      it("DELETE: 400 - responds with 400 code and BAD REQUEST message if comment_id is not valid ", () => {
        return request(app)
          .delete("/api/comments/imnotintheappropriateformat")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("BAD REQUEST");
          });
      });
    });
  });
});
