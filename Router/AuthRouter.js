class AuthRouter {
  constructor(express, passport) {
    this.express = express;
    this.passport = passport;
  }

  router() {
    //Handle Local Login
    let router = this.express.Router();
    router.post(
      "/signup",
      this.passport.authenticate("local-signup", {
        successRedirect: "/login",
        failureRedirect: "/signup",
        failureFlash: true,
      })
    );

    router.post(
      "/login",
      this.passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
      })
    );

    //Handle Facebook Login
    router.get(
      "/facebook",
      this.passport.authenticate("facebook", {
        scope: ["email", "public_profile"],
      })
    );

    router.get(
      "/facebook/callback",
      this.passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
      })
    );

    // Handle Google Login
    router.get(
      "/google",
      this.passport.authenticate("google", {
        scope: ["email", "profile"],
      })
    );

    router.get(
      "/google/callback",
      this.passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
      })
    );

    router.get("/logout", (req, res) => {
      req.logout(function (err) {
        if (err) {
          return err;
        }
        res.redirect("/login");
      });
    });

    return router;
  }
}

module.exports = AuthRouter;
