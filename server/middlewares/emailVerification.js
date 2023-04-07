const connection = require('../dbConfig');

function emailVerification(req, res, next) {
  const email = req.session.email;

  connection.query(`SELECT * FROM verifications WHERE email = '${email}'`, function (err, rows) {
    if (err) throw err;

    if (rows.length === 1) {
      if (rows[0].verify === 1) {
        // Email is verified, proceed to the next middleware
        next();
      } else {
        // Email is not verified, redirect to the verification page
        res.redirect('/verification');
      }
    } else {
      res.redirect('/login');
    }
  });
}

module.exports = emailVerification;
