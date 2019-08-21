const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;

module.exports = {
  publicIndex(req, res, next) {
    wikiQueries.getAllPublicWikis((err, wikis) => {
      if (err) {
        console.log("this is the error", err);
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/public", { wikis });
      }
    });
  },
  privateIndex(req, res, next) {
    wikiQueries.getAllPrivateWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/private", { wikis });
      }
    });
  },
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    console.log(req);
    console.log(req.user);
    if (authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id
      };
      console.log(req.body);
      console.log(newWiki);
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          res.redirect(500, "wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, result) => {
      wiki = result["wiki"];
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        collaborators = result["collaborators"];
        const authorized = new Authorizer(
          req.user,
          wiki,
          collaborators
        ).showCollaborators();
        if (authorized) {
          wiki.body = markdown.toHTML(wiki.body);
          res.render("wikis/show", { wiki });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis`);
        }
      }
    });
  },
  destroy(req, res, next) {
    wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
      if (err) {
        res.redirect(500, `/wikis/${wiki.id}`);
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },
  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, result) => {
      wiki = result["wiki"];
      collaborators = result["collaborators"];
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki, collaborators).edit();
        if (authorized) {
          res.render("wikis/edit", { wiki, collaborators });
        } else {
          req.flash("You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },
  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }
};
