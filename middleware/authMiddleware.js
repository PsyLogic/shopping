module.exports = (req, resp, next) => {
  return !req.session.user ? resp.redirect("/login") : next();
};
