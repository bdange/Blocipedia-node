const User = require("./models").User;
const bcrypt = require("bcryptjs");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  // #2
  createUser(newUser, callback) {
    // #3
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    // #4
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
      .then(user => {
        const msg = {
          to: newUser.email,
          from: "test@example.com",
          subject: "New user confirmation",
          text: "Welcome to Blocipedia!",
          html:
            "<strong>Welcome to Blocipedia and a new world of Wikis</strong>"
        };
        sgMail.send(msg);
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
        console.log(err);
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
        console.log(err);
      });
  }
};
