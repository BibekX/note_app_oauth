const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

module.exports = (passport, knex) => {
  //Set up Local Strategy
  //SignUp
  passport.use(
    "local-signup",
    new LocalStrategy(
      //PassportJS expects username by default, if you're using email instead of username, add usernameField property and set it's value to "email"
      // passReqToCallback allows us to grab inputs other than username and password. For example name, phone and so on
      // { usernameField: "email", passReqToCallback: true },
      async (username, password, done) => {
        //Check if the user exists in the database
        let user = await knex("users").where({ username }).first(); // {id: 1, username..} | undefined
        if (user) {
          //if user exists then don't authenticate the user
          return done(null, false, {
            message: "Username already exists in the database",
          });
        }

        let salt = 10; //adding random string to make the hash less predictable
        const hash = await bcrypt.hash(password, salt); //hash password
        let newUser = {
          username,
          password: hash,
        };
        //insert new user credentials to the database
        const id = await knex("users").insert(newUser).returning("id"); //[{id: 1}]
        newUser.id = id[0]["id"];
        //authenticate user
        return done(null, newUser);
      }
    )
  );

  //Login
  passport.use(
    "local-login",
    new LocalStrategy(
      // { usernameField: "email" },
      async (username, password, done) => {
        //Check if the user exists in the database
        const user = await knex("users").where({ username }).first(); // {id: 1, username: a, password: 2@10.....}

        if (!user) {
          //if user does not exists then don't authenticate the user
          return done(null, false, {
            message: "User does not exist in the database",
          });
        }
        //hashing the entered password and comparing with the hash password from the database
        const result = await bcrypt.compare(password, user.password);
        return result
          ? done(null, user)
          : done(null, false, { message: "Incorrect Password" });
      }
    )
  );
};
