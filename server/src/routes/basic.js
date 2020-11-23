const { Router } = require("express");
const { ensureAuthenticated } = require("../utils");

const router = Router();

router.get("/me", ensureAuthenticated, function (req, res) {
  res.json({ user: req.user });
});

module.exports = router;
