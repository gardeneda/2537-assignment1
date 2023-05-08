/* 
    Checks if the user has a valid session/cookie.
    If not redirects them to the login page.
*/
exports.checkCookie = (req, res, next) => {
    if (!req.session.authenticated) {
      res.redirect("login");
      return;
    }
    next();
};
  
