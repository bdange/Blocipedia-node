const Wiki = require("./models").Wiki;

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll()
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
  updateWiki(id, updatedWiki, callback) {
    return Wiki.findByPk(id).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }
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
    });
  }
};
