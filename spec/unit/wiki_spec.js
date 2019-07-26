const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {
  beforeEach(done => {
    this.wiki;

    sequelize
      .sync({ force: true })
      .then(res => {
        Wiki.create({
          title: "Studying at Bloc",
          body: "This is quite a committment to say the least.",
          wikiId: this.wiki.id
        }).then(wiki => {
          this.wiki = wiki;
          done();
        });
      })
      .catch(err => {
        console.log(err);
        done();
      });
  });
  describe("#create()", () => {
    it("should create a wiki object with a title and body", done => {
      Wiki.create({
        title: "Wiki title created",
        body: "Wiki body created",
        wikiId: this.wiki.id
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
          expect(err.message).toContain("Wiki body cannot be null");
          done();
        });
    });
  });
});
