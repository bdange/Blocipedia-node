const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
  beforeEach(done => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then(res => {
      User.create({
        username: "username",
        email: "user@gmail.com",
        password: "123456"
      }).then(user => {
        this.user = user;

        Wiki.create({
          title: "Studying at Bloc",
          body: "This is quite a committment to say the least."
        }).then(wiki => {
          this.wiki = wiki;
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create a wiki object with a title, body and user", done => {
      Wiki.create({
        title: "Wiki title created",
        body: "Wiki body created"
      })
        .then(wiki => {
          expect(wiki.title).toBe("Wiki title created");
          expect(wiki.body).toBe("Wiki body created");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it("should not create a wiki object without a title or body", done => {
      Wiki.create({
        title: "Wiki without a body"
      })
        .then(wiki => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Wiki.body cannot be null");
          done();
        });
    });
  });

  describe("#setUser()", () => {
    it("should associate a wiki and a user together", done => {
      User.create({
        username: "user_name",
        email: "user@gmail.com",
        password: "123456"
      }).then(newUser => {
        expect(this.wiki.userId).toBe(this.user.id);

        this.wiki.setUser(newUser).then(post => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });

  describe("#getUser()", () => {
    it("should return the associated wiki", done => {
      this.wiki.getUser().then(associateUser => {
        expect(associateUser.email).toBe("user@gmail.com");
        done();
      });
    });
  });
});
