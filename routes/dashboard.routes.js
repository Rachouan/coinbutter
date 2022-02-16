const router = require("express").Router();

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/dashboard", isLoggedIn, (req, res, next) => {
  res.render("dashboard");
});

router.get("/dashboard", isLoggedOut, (req, res, next) => {
  res.render("../views/auth/signup.hbs");
}); 

module.exports = router;
