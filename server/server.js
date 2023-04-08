// Main modules
const express = require('express');
const phpExpress = require('php-express')({ binPath: 'php' });
const path = require('path');
const app = express();
const port = process.env.SERVER_PORT || 3001;

// Routes to external files
const pagesRouter = require('./routes/form');
const emailRouter = require('./routes/email');
const apiRouter = require('./routes/api-call');
const accountRouter = require('./routes/account');

// Middlewares
const corsMiddleware = require('./middlewares/cors');
const sessionMiddleware = require('./middlewares/session');
const loggedInMiddleware = require('./middlewares/loggedIn.js');

// Use middleware functions
app.use(corsMiddleware);
app.use(sessionMiddleware);
app.use(loggedInMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));

// The phpExpress middleware
app.engine('php', phpExpress.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'php');

// route to form and recommend
app.use('/pages', [pagesRouter, emailRouter]);
app.use('/account', accountRouter);
app.use('/api', apiRouter);

// Serve CSS files with the correct content type
app.get('*.css', function(req, res, next) {
  res.header('Content-Type', 'text/css');
  next();
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

try {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
} catch (err) {
  console.error(err);
}
