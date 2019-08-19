require("dotenv").config();
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const bcrypt = require("bcryptjs");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
      .then(user => {
        //  const msg = {
        //    to: newUser.email,
        //    from: "test@example.com",
        //    subject: "New user confirmation",
        //    text: "Welcome to Blocipedia!",
        //    html:
        //      "<strong>Welcome to Blocipedia and a new world of Wikis</strong>"
        //  };
        //  sgMail.send(msg);
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },
  upgrade(id) {
    return User.findByPk(id)
      .then(user => {
        if (!user) {
          return callback("User does not exist!");
        } else {
          return user.update({ role: "premium" });
        }
      })
      .catch(err => {
        callback(err);
      });
  },
  downgrade(id) {
    return User.findByPk(id)
      .then(user => {
        if (!user) {
          return callback("User does not exist!");
        } else {
          return user.update({ role: "standard" });
        }
      })
      .catch(err => {
        callback(err);
      });
  },
  getUser(id, callback) {
    let result = {};
    User.findByPk(id).then(user => {
      if (!user) {
        callback(404);
      } else {
        result["user"] = user;
        Collaborator.scope({ method: ["collaboratorFor", id] })
          .findAll()
          .then(collaborations => {
            result["collaborator"] = collaborator;
            callback(null, result);
          })
          .catch(err => {
            callback(err);
          });
      }
    });
  }
};
