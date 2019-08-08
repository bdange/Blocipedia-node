const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki");

module.exports = {
  getAllPublicWikis(callback) {
    return Wiki.findAll({
      where: {
        private: "false"
      }
    })
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },
  getAllPrivateWikis(callback) {
    return Wiki.findAll({
      where: {
        private: "true"
      }
    })
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },
  addWiki(newWiki, callback) {
    console.log("Hitting the addwiki function");
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
      .then(wiki => {
        console.log("successfully addded up", wiki);
        callback(null, wiki);
      })
      .catch(err => {
        console.log("Failed to added up", err);
        callback(err);
      });
  },
  getWiki(id, callback) {
    return Wiki.findByPk(id)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  deleteWiki(id, callback) {
    return Wiki.destroy({
      where: { id }
    })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  updateWiki(req, updatedWiki, callback) {
    return Wiki.findByPk(req.params.id).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }

      const authorized = new Authorizer(req.user, wiki).update();

      if (authorized) {
        wiki
          .update(updatedWiki, {
            fields: Object.keys(updatedWiki)
          })
          .then(() => {
            callback(null, wiki);
          })
          .catch(err => {
            callback(err);
          });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  },

  downgradePrivateWikis(id) {
    return Wiki.findAll()
      .then(wikis => {
        wikis.forEach(wiki => {
          if (wiki.userId == id && wiki.private == true) {
            wiki.update({
              private: false
            });
          }
        });
      })
      .catch(err => {
        callback(err);
      });
  }
};
