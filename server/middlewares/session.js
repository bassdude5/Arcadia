const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Change this to true if you're using HTTPS
});

module.exports = sessionMiddleware;