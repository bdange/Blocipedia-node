const Wiki = require("./models").Wiki;

module.exports = {
  getAllWikis(callback) {
    return Wiki.all()
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },
  getWiki(id, callback) {
    return Wiki.findByPk(id)
      .then(topic => {
        callback(null, topic);
      })
      .catch(err => {
        callback(err);
      });
  },
  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      description: newWiki.description
    })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  }
};
