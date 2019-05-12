const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Cart = require('../models/cart');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: ''
  }
}));

exports.getLogin = (req, res, next) => {
  let message = false;
  // if (message.length > 0) {
  //   message = message[0];
  // } else {
  //   message = null;
  // }
  
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    validationErrors: []
  });
}

exports.getSignUp = (req, res, next) => {
  let message = false;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign-Up',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
    validationErrors: []
  });
}
exports.getReset = (req, res, next) => {
  let message = req.flash();
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset-password', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  });
}

exports.postSignUp = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const address = req.body.address;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sign-Up',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      isAuthenticated: req.session.isLoggedIn,
      validationErrors: errors.array(),
    });
  }
  bcrypt.hash(password, 12)
  .then(hashedPassword => {
      return User.create({
        firstName: firstName,
        lastName: lastName,
        address: address,
        email: email,
        password: hashedPassword,
        role: 1,
      });
    })
    .then(result => {
      return Cart.create({userId: result.id })
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log('\x1b[31m%s\x1b[23m', 'Error!!!! from auth CTRL, at line 24 reason: ' + err + ' ');
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postLogin = async (req, res, next) => {
  req.connection.remoteAddress
  const jwtToken = await jwt.sign({ userIp: req.connection.remoteAddress }, req.connection.remoteAddress);
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      isAuthenticated: req.session.isLoggedIn,
      validationErrors: errors.array(),
    });
  }
  User.findOne({ where: { email: email } })
  .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password,
          },
          isAuthenticated: req.session.isLoggedIn,
          validationErrors: [],
        });
    }
    if (user.role !== 'Admin') {
      req.session.isAdmin = false;
    } else {
      req.session.isAdmin = true;
    }

      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              req.session.jwt = jwtToken;
              res.redirect('/');
            });
          }
          if (!req.session.user.role !== 'Admin') {
            req.session.isAdmin = false;
          } else {
            pageObject.session.isAdmin = true;
          }

          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password,
            },
            isAdmin: req.session.isAdmin,
            isAuthenticated: req.session.isLoggedIn,
            validationErrors: [],
          });
        })
        .catch(err => {
          console.log('\x1b[31m%s\x1b[23m', 'Error!!!! from auth password validation, at line 58 reason: ' + err + ' ');
          res.redirect('/login');

        })

    })
    .catch(err => {
      const error = new Error();
      error.httpStatusCode = 500;
      return next(error);
    });
}



exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
    console.log(err);
  });
}