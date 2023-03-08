// let user = { id: 1, username: "sam", password: "123" };

class PageRouter {
  constructor(express, noteService) {
    this.express = express;
    this.noteService = noteService;
  }

  router() {
    let router = this.express.Router();
    router.get("/", this.isLoggedIn, this.home.bind(this));
    router.get("/signup", this.notLoggedIn, this.signup.bind(this));
    router.get("/login", this.notLoggedIn, this.login.bind(this));
    return router;
  }

  home(req, res) {
    // this.noteService.list(user.id).then((data) => {
    console.log("user", req.user);
    this.noteService.list(req.user.id).then((data) => {
      res.render("index", {
        // user: user.username,
        user: req.user.username,
        notes: data,
      });
    });
  }

  signup(req, res) {
    res.render("signup", { error: req.flash("error") });
  }

  login(req, res) {
    res.render("login", { error: req.flash("error") });
  }

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
  }

  notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect("/");
  }
}

module.exports = PageRouter;
