const { Router } = require("express");
const fetch = require("node-fetch");
const pick = require("lodash/pick");
const { ensureAuthenticated } = require("../utils");
const fileService = require("../services/fileService");

const router = Router();
const api = "https://api.spotify.com/v1";

const artistProperties = ["id", "name", "genres"];
const featureProperties = [
  "duration_ms",
  "key",
  "mode",
  "acousticness",
  "danceability",
  "energy",
  "instrumentalness",
  "liveness",
  "loudness",
  "speechiness",
  "valence",
  "tempo",
];

const createTracks = (items, features, artists) =>
  items.map(({ added_at, track }, index) => {
    return {
      id: track.id,
      added_at,
      name: track.name,
      preview: track.preview_url,
      artists: track.artists.map((artist) => artists[artist.id]),
      features: features[track.id],
    };
  });

const getAudioFeatures = async (items, init) => {
  const ids = items.map((item) => item.track.id);
  const result = await fetch(api + "/audio-features/?ids=" + ids, init);
  const { audio_features } = await result.json();
  return audio_features.reduce((features, feature) => {
    features[feature.id] = pick(feature, featureProperties);
    return features;
  }, {});
};
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const getArtists = async (items, init) => {
  const ids = items
    .flatMap((item) => item.track.artists.map((artist) => artist.id))
    .filter(onlyUnique);
  const result = await fetch(api + "/artists/?ids=" + ids, init);
  const { artists } = await result.json();
  return artists.reduce((artists, artist) => {
    artists[artist.id] = pick(artist, artistProperties);
    return artists;
  }, {});
};

const getAll = async (href, init) => {
  const result = await fetch(href, init);
  const { items, next } = await result.json();
  const audio_features = await getAudioFeatures(items, init);
  const artists = await getArtists(items, init);
  const mappedItems = createTracks(items, audio_features, artists);
  if (next) {
    return mappedItems.concat(await getAll(next, init));
  }
  return mappedItems;
};

router.get("/tracks", ensureAuthenticated, async (req, res) => {
  const headers = { Authorization: `Bearer ${req.user.auth.accessToken}` };
  const items = await getAll(api + "/me/tracks", {
    headers,
  });

  fileService.write("tracks.json", items);
  res.json({ status: "done" });
});

router.get("/analized", async (req, res) => {
  const tracks = fileService.read("tracks.json");
  res.json(tracks);
});

const preset = new Map();
router.get("/preset", async (req, res) => {
  res.json(preset.entries());
});
router.put("/preset", async (req, res) => {
  debugger;
  res.json(preset.entries());
});

module.exports = router;
