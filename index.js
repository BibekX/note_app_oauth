// Require all of the libraries needed
const https = require("https");
const fs = require("fs");

// NPM installed modules
const { create } = require("express-handlebars");
const express = require("express");
const knexFile = require("./knexfile").development;
const knex = require("knex")(knexFile);
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
require("dotenv").config();

const app = express();

//Set up port number
const port = 3000;

//Require Local modules
const PageRouter = require("./Router/PageRouter");
const AuthRouter = require("./Router/AuthRouter");
const NoteService = require("./Service/NoteService");
const NoteRouter = require("./Router/NoteRouter");
const setupPassport = require("./setupPassport");

//Set up session
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

//Setup Passport
setupPassport(app, knex, passport);

//The code below returns the current year
const hbs = create({
  helpers: {
    year() {
      return new Date().getFullYear();
    },
  },
});

// Set up handlebars as our view engine - handlebars will responsible for rendering our HTML
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Serves the public directory to the root of our server
app.use(express.static("public"));

// Set up middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(flash());

// Create a new instance of noteService and pass the file path/to/the/file where you want the service to read from and write to.
const noteService = new NoteService(knex);

// Set up PageRouter
app.use("/", new PageRouter(express, noteService).router());

// Set up AuthRouter
app.use("/", new AuthRouter(express, passport).router());

// Set up the NoteRouter - handle the requests and responses in the note, read from a file and return the actual data, get the note from your JSON file and return to the clients browser.
app.use("/api/notes", new NoteRouter(noteService, express).router()); //sending our data

module.exports = app;

//Setup Server
const options = {
  cert: fs.readFileSync("./localhost.crt"),
  key: fs.readFileSync("./localhost.key"),
};

https
  .createServer(options, app)
  .listen(port, () => console.log(`Listening to port ${port}`));
