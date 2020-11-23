const configs = require("./configs");

const getAbsolutePath = (path) => {
  const { protocol, host, port } = configs;
  return `${protocol}://${host}:${port}${path}`;
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/spotify");
}

module.exports = {
  ensureAuthenticated,
  getAbsolutePath,
};
