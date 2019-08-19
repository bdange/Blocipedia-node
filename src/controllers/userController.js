const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const secretKey = process.env.SECRET_KEY;
const publishableKey = process.env.PUBLISHABLE_KEY;
const stripe = require("stripe")(secretKey);

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },
  create(req, res, next) {
    //#1
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    // #2
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        // #3
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function() {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  upgrade(req, res, next) {
    res.render("users/upgrade", { publishableKey });
  },

  payment(req, res, next) {
    let payment = 1500;
    stripe.customers
      .create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer => {
        stripe.charges.create({
          amount: payment,
          description: "Blocipedia Premium Membership",
          currency: "usd",
          customer: customer.id
        });
      })
      .then(charge => {
        userQueries.upgrade(req.user.dataValues.id);
        res.render("users/payment_success");
      });
  },

  downgrade(req, res, next) {
    userQueries.downgrade(req.user.dataValues.id);
    wikiQueries.downgradePrivateWikis(req.user.dataValues.id);
    req.flash("notice", "You are no longer a premium user!");
    res.redirect("/");
  },

  showCollaborations(req, res, next) {
    userQueries.getUser(req.user.id, (err, result) => {
      if (err || user == null) {
        console.log("THIS IS THE ERROR: " + err);
        res.redirect(404, "/");
      } else {
        user = result["user"];
        collaborator = result["collaborator"];
        {
          res.render("users/collaborations", { collaborator });
        }
      }
    });
  }
};
