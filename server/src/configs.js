require("dotenv").config();

const {
  PROTOCOL,
  HOST,
  PORT,
  SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env;

module.exports = {
  protocol: PROTOCOL,
  host: HOST,
  port: PORT,
  secret: SECRET,
  spotify: {
    clientID: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
  },
};
