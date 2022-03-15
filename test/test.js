/* eslint-disable no-shadow */
/* eslint-disable no-undef */
const chai = require("chai");
const chaiHTTP = require("chai-http");

const server = require("../src/server");

chai.should();

chai.use(chaiHTTP);
chai.use(require("chai-things"));

describe("Auth API's", () => {
  describe("check register, login flow", () => {
    it("should create a user and result error in second time creation then login and then delete the user", (done) => {
      // create user
      chai
        .request(server)
        .post("/signup")
        .send({
          email: "tester.mayank00@gmail.com",
          password: "tester.mayank00@gmail.com",
          firstName: "mayank",
          lastName: "jaiswal",
        })
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(201);

          // create second time with same email
          chai
            .request(server)
            .post("/signup")
            .send({
              email: "tester.mayank00@gmail.com",
              password: "tester.mayank00@gmail.com",
              firstName: "mayank",
              lastName: "jaiswal",
            })
            .end((err, res) => {
              if (err) done(err);

              res.should.have.status(400);
              res.body.should.have.property("error");
              res.body.error.should.have.property("errorType", "Bad Request");
              res.body.error.should.have.property("errorMessage", "Email id already exists");

              // login
              chai
                .request(server)
                .post("/login")
                .send({
                  email: "tester.mayank00@gmail.com",
                  password: "tester.mayank00@gmail.com",
                })
                .end((err, res) => {
                  if (err) done(err);

                  res.should.have.status(200);
                  res.body.should.be.a("object");
                  res.body.should.have.a.property("data");
                  res.body.data.should.be.a("object");
                  res.body.data.should.have.a.property("token");
                  const { token } = res.body.data;

                  // delete user
                  chai
                    .request(server)
                    .delete("/users?email=tester.mayank00@gmail.com")
                    .set("Authorization", `Bearer ${token}`)
                    .end((err, res) => {
                      if (err) {
                        done(err);
                      } else {
                        res.should.have.status(200);
                        done();
                      }
                    });
                });
            });
        });
    });
  });
});

describe("Weather API's --- ", () => {
  describe("GET /weather", () => {
    it("Fetch weather forecast for next 5 days of Indore location", (done) => {
      chai
        .request(server)
        .get("/weather")
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("object");
          res.body.data.should.have.a.property("count");
          res.body.data.should.have.a.property("location");
          res.body.data.should.have.a.property("unit");
          res.body.data.data.should.be.a("array");
          res.body.data.data.length.should.be.eql(5);
          res.body.data.data.should.all.have.property("date");
          res.body.data.data.should.all.have.property("main");
          res.body.data.data.should.all.have.property("temp");

          done();
        });
    });
  });
});

describe("News API's", () => {
  let token = null;

  before(
    "get a token",
    () =>
      new Promise((resolve, reject) => {
        chai
          .request(server)
          .post("/signup")
          .send({
            email: "tester.mayank02@gmail.com",
            password: "tester.mayank02@gmail.com",
            firstName: "mayank",
            lastName: "jaiswal",
          })
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              res.should.have.status(201);

              chai
                .request(server)
                .post("/login")
                .send({
                  email: "tester.mayank02@gmail.com",
                  password: "tester.mayank02@gmail.com",
                })
                .end((err, res) => {
                  if (err) {
                    reject(err);
                  } else {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.a.property("data");
                    res.body.data.should.be.a("object");
                    res.body.data.should.have.a.property("token");
                    token = res.body.data.token;
                    resolve();
                  }
                });
            }
          });
      })
  );

  after(
    "delete user",
    () =>
      new Promise((resolve, reject) => {
        chai
          .request(server)
          .delete("/users?email=tester.mayank02@gmail.com")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              res.should.have.status(200);
              resolve();
            }
          });
      })
  );

  describe("GET /news", () => {
    it("should give authorization error", (done) => {
      chai
        .request(server)
        .get("/news")
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("GET /news", () => {
    it("Fetch news", (done) => {
      chai
        .request(server)
        .get("/news")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);

          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.have.a.property("count");
          res.body.data.data.should.be.a("array");
          res.body.data.data.should.all.have.property("headline");
          res.body.data.data.should.all.have.property("link");
          res.body.data.data.should.all.have.property("publishedAt");

          done();
        });
    });
  });
});
