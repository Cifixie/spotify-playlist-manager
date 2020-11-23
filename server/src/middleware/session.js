const session = require("express-session");

module.exports = (app, { secret }) => {
  const requestHandler = session({
    secret,
    resave: true,
    saveUninitialized: true,
  });
  app.use(requestHandler);
  return requestHandler;
};
