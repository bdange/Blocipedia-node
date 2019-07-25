const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.redirect("wikis/index", { wikis });
      }
    });
  },
  new(req, res, next) {
    res.render("wikis/new");
  },
  create(req, res, next) {
    let newWiki = {
      title: req.body.title,
      description: req.body.description
    };
    wikiQueries.addWiki(newWiki, (err, wiki) => {
      if (err) {
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(300, `/wikis/${wiki.id}`);
      }
    });
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/show", { wiki });
      }
    });
  }
};
