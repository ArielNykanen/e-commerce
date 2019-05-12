const User = require('../models/user');
const { validationResult } = require('express-validator/check')

// For simple future changes
const userDetailsTitle = 'User Details'


// For simple future changes end

exports.getUserDetails = (req, res, next) => {
  const user = req.session.user;
  let message = false;
  res.status(200).render('client/details', {
    pageTitle: userDetailsTitle,
    path: '/user/settings',
    errorMessage: message,
    oldInput: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
    },
    validationErrors: [],
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin
  })

}



exports.saveUserChanges = async (req, res, next) => {
  const updatedFirstName = req.body.firstName;
  const updatedLastName = req.body.lastName;
  const updatedAddress = req.body.address;
  const updatedEmail = req.body.email;
  
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    console.log(errors.array());
    
    return res.status(422).render('client/details', {
      path: '/user/settings',
      pageTitle: userDetailsTitle,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        firstName: updatedFirstName,
        lastName: updatedLastName,
        email: updatedEmail,
        address: updatedAddress,
      },
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      validationErrors: errors.array(),
    });
  }


  const user = await User.findByPk(req.session.user.id);
  await user.update(
    {
      firstName: updatedFirstName,
      lastName: updatedLastName,
      email: updatedEmail, 
      address: updatedAddress
    },

  );


  // saves session details after success save
  req.session.user = user;

  res.status(200).redirect('/user/settings')
}