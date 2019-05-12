const pageObject = require('../util/globalPageObject')
const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {
  try {
    await jwt.verify(req.session.jwt, req.connection.remoteAddress);
  } catch (error) {
    if (error) {
      req.session.isLoggedIn = false;
      return res.redirect('/login');
    }    
  }
  
  if(!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  next();
}