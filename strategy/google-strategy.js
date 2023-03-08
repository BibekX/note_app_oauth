const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

module.exports = (passport, knex) => {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://localhost:3000/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await knex("users")
            .where({ google_id: profile.id })
            .first();
          if (!user) {
            let newUser = {
              google_id: profile.id,
              username: profile._json.email,
            };
            let id = await knex("users").insert(newUser).returning("id");
            newUser.id = id[0].id;
            return done(null, newUser);
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done(null, false);
        }
      }
    )
  );
};
