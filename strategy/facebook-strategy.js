const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = (passport, knex) => {
  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "https://localhost:3000/facebook/callback",
        profileFields: ["id", "email", "name"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await knex("users")
            .where({ facebook_id: profile.id })
            .first();
          if (!user) {
            let newUser = {
              facebook_id: profile.id,
              username: profile._json.email,
            };
            console.log("new User 1", newUser);
            let id = await knex("users").insert(newUser).returning("id"); //{id: 1}
            newUser.id = id[0].id;
            return done(null, newUser);
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done(null, false, { message: "Login with facebook failed" });
        }
      }
    )
  );
};
