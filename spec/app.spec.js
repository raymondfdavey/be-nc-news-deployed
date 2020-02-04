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
  describe("/api/topics", () => {
    it("GET: 200 - responds with a topic object containing a slug and description for each topic", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          res.body.topics.forEach(topic => {
            expect(topic).to.have.keys(["slug", "description"]);
          });
        });
    });
  });
  describe("/api/users", () => {
    describe("/:username", () => {
      it("GET: 200 - responds with a user object containing the username, avatar url, and name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(res => {
            expect(res.body.user).to.eql([
              {
                username: "rogersop",
                name: "paul",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
              }
            ]);
          });
      });
    });
  });
  describe("/api/articles", () => {
    it.only("GET: 200 - responds with an array of all articles with a comment count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(result => console.log(result.body.all_articles));
    });
    describe("/:article_id", () => {
      it("GET: 200 - responds with an article object with keys for author, title, article_id, body, topic, created_at, votes and a correct comment count", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(res => {
            expect(res.body.article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comments"
            );
            expect(res.body.article.comments).to.eql(2);
          });
      });
      it("PATCH: 202 - takes a new votes object of the form {inc_votes: newVote}, updates specified article with the votes specified and responds with the updated article", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: -100 })
          .expect(202)
          .then(result => {
            expect(result.body.article.votes).to.eql(-100);
            expect(result.body.article).to.have.keys(
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
          .then(result => {
            expect(result.body.article.votes).to.eql(150);
          });
      });
      describe("/comments", () => {
        it("POST: 201 - accepts an object with username and body keys and responds with the posted comment", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              author: "rogersop",
              body: "absolutely, rootin, tootin, loved it"
            })
            .expect(201)
            .then(result => {
              expect(result.body.postedComment).to.have.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
            });
        });
        it("GET: 200 - responds with an array of all of the comments for the article ID specified", () => {
          return request(app)
            .get("/api/articles/5/comments")
            .expect(200)
            .then(result => {
              expect(result.body.comments.length).to.eql(2);
              result.body.comments.forEach(comment => {
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
