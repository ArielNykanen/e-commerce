const express = require('express');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

const authCtrl = require('../controllers/auth');

const router = express.Router();

router.get('/login', authCtrl.getLogin);
router.get('/signup', authCtrl.getSignUp);

router.post('/login', 
[
  body('email')
  .isEmail()
  .withMessage('Please enter a valid email'),
  body('password', 'please enter valid password')
  .isLength({ min:5 })
  .isAlphanumeric(),
], authCtrl.postLogin);
router.post('/logout', authCtrl.postLogout);
router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .trim()
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('Email is forbiden!');
        // }
        // return true;
        
        return User.findOne({ where: { email: value } })
          .then(userDoc => {
            console.log(userDoc);
            
            if (userDoc) {
              return Promise.reject(
                'Email is already registred, please pick different one.'
              );
            }
          });
      }),
    body(
      'password',
      'Please enter at least 5 characters long password and only alphanumeric!'
    )
      .isLength({ min: 5 })
      .trim()
      .isAlphanumeric(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords needs to match!')
        }
        return true;
      }),
    body(
      'firstName',
      'Please enter a name.'
    )
      .isLength({ min: 2 })
      .trim()
      .isAlphanumeric(),
    body('lastName',
      'Please enter valid last name.'
    )
      .isLength({ min: 2 })
      .trim()
      .isAlphanumeric(),
    body('address',
      'Address field cannot be empty.'
    )
      .isLength({ min: 1 })
  ]
  , authCtrl.postSignUp);

module.exports = router;