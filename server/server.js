// Main modules
const express = require('express');
const phpExpress = require('php-express')({ binPath: 'php' });
const path = require('path');
const app = express();
const port = 3000;

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


// The phpExpress middleware
app.engine('php', phpExpress.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'php');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// route to form and recommend
app.use('/pages', [pagesRouter, emailRouter]);
app.use('/account', accountRouter);
app.use('/api', apiRouter);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});