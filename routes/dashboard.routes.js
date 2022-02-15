const router = require("express").Router();

/* GET home page */
router.get("/dashboard", (req, res, next) => {
  res.render("dashboard");
});

module.exports = router;
