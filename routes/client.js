const clientCtrl = require('../controllers/client');
const { check, body } = require('express-validator/check');
const User = require('../models/user');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');


router.get('/user/settings', isAuth, clientCtrl.getUserDetails);
router.post('/user/save-changes', isAuth,
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
        if (req.session.user.email !== value) {

          return User.findOne({ where: { email: value } })
          .then(userDoc => {
            console.log(userDoc);
            
            if (userDoc) {
              return Promise.reject(
                'Email is already registred, please pick different one.'
                );
              }
            });
        } else {
          return true;
        }
      }),
    body(
      'firstName',
      'Please enter a valid name.'
    )
      .isLength({ min: 2 })
      .trim()
      .isAlphanumeric(),
    body('lastName',
      'Please enter a valid last name.'
    )
      .isLength({ min: 2 })
      .trim()
      .isAlphanumeric(),
    body('address',
      'Address field cannot be empty.'
    )
      .isLength({ min: 1 })
     
  ], clientCtrl.saveUserChanges);


module.exports = router;
