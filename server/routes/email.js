const express = require('express');
const emailRouter = express.Router();
const nodemailer = require('nodemailer');
const randtoken = require('rand-token');
const connection = require('../dbConfig');
const dotenv = require('dotenv');
const emailVerification = require('../middlewares/emailVerification');
dotenv.config();

function sendEmail(email, token) {
  var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Email verification - Arcadia',
    html: `You requested for email verification, kindly use this link to verify your email address 
           <a href="http://localhost:3000/email/verify-email?token=${token}">Verify Email</a>`
  };

  mail.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

emailRouter.post('/send-email', emailVerification, function(req, res, next) {
  var email = req.body.email;
  connection.query('SELECT * FROM verifications WHERE email = ?', [email], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    } else {
      if (result.length > 0) {
        var token = randtoken.generate(20);
        if (result[0].verify === 0) {
          sendEmail(email, token);
          connection.query('UPDATE verifications SET token = ? WHERE email = ?', [token, email], function(err, result) {
            if (err) {
              console.log(err);
              res.status(500).send('Internal server error');
            } else {
              req.flash('success', 'The verification link has been sent to your email address');
              res.redirect('/');
            }
          });
        } else {
          req.flash('success', 'Email already verified');
          res.redirect('/');
        }
      } else {
        req.flash('error', 'The Email is not registered with us');
        res.redirect('/');
      }
    }
  });
});

emailRouter.get('/verify-email', emailVerification, function(req, res, next) {
  var token = req.query.token;
  connection.query('SELECT * FROM verifications WHERE token = ?', [token], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    } else {
      if (result.length > 0) {
        var email = result[0].email;
        if (result[0].verify === 0) {
          connection.query('UPDATE verifications SET verify = 1 WHERE email = ?', [email], function(err, result) {
            if (err) {
              console.log(err);
              res.status(500).send('Internal server error');
            } else {
              req.flash('success', 'Your email has been verified');
              res.redirect('/');
            }
          });
        } else {
          req.flash('error', 'The email has already verified');
          res.redirect('/');
        }
      } else {
        req.flash('error', 'Invalid verification link');
        res.redirect('/');
      }
    }
  });
});

module.exports = emailRouter;