const { Router } = require("express");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const { pickAll } = require("ramda");
const { getAbsolutePath } = require("../utils");
const fileService = require("../services/fileService");

const pickProfileDetails = pickAll([
  "id",
  "username",
  "displayName",
  "profileUrl",
]);

const verifyProfile = (
  accessToken,
  refreshToken,
  expires_in,
  profile,
  done
) => {
  const user = {
    ...pickProfileDetails(profile),
    auth: {
      accessToken,
      refreshToken,
      expires_in,
    },
  };
  fileService.write("user.json", user);
  done(null, user);
};

const createRoutes = () => {
  const router = Router();
  router.get(
    "/spotify",
    passport.authenticate("spotify", {
      scope: [
        "user-library-read",
        "playlist-read-private",
        "playlist-modify-private",
      ],
    })
  );
  router.get(
    "/spotify/callback",
    passport.authenticate("spotify", { failureRedirect: "/login" }),
    (_, res) => res.redirect("/")
  );
  return router;
};

module.exports = (app, { spotify }) => {
  passport.use(
    new SpotifyStrategy(
      { ...spotify, callbackURL: getAbsolutePath("/auth/spotify/callback") },
      verifyProfile
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/auth", createRoutes());

  return passport;
};
