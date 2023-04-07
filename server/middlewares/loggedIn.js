const loggedInMiddleware = function(req, _, next) {
    if (!req.session.loggedIn) {
      req.session.loggedIn = false;
    }
    next();
  };
  
  module.exports = loggedInMiddleware;
  