const router = require("express").Router();

const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const User = require("../models/User.model.js");
const Transaction = require("../models/Transaction.model.js");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Routes

router.post('transaction/create', (req, res) => {
  
}); 

// Module export

module.exports = router;