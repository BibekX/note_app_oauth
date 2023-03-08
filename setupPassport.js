module.exports = (app, knex, passport) => {
  //Set up passportJS
  app.use(passport.initialize());
  app.use(passport.session());

  //Serialize
  passport.serializeUser((user, done) => {
    //send the user id to the session
    done(null, user.id);
  });

  //Deserialize
  passport.deserializeUser(async (id, done) => {
    //take in the id from the session and use the id to verify the user
    const user = await knex("users").where({ id }).first();
    return user ? done(null, user) : done(null, false);
  });

  require("./strategy/local-strategy")(passport, knex);
  require("./strategy/facebook-strategy")(passport, knex);
  require("./strategy/google-strategy")(passport, knex);
};
