// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
const app = express();

const path = require('path');

// Axios
/* const axios = require('axios'); */

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
hbs.registerPartials(__dirname + '/views/partials');

require("./helpers")(hbs);

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const projectName = "coinbutter";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

app.use((req,res,next) => {
    res.locals.connectedUser = req.session.user ? req.session.user : false;
    console.log(res.locals.connectedUser);
    next();
});

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const dashboard = require("./routes/dashboard.routes");
app.use("/dashboard", dashboard);

const portfolio = require("./routes/portfolio.routes");
app.use("/portfolio", portfolio);

const transactions = require("./routes/transaction.routes");
app.use("/portfolio", transactions);

const coins = require("./routes/coin.routes");
app.use("/coins", coins);

const assets = require("./routes/assets.routes");
app.use("/", assets);

const activation = require("./routes/activation.routes");
app.use("/", activation);

const profile = require("./routes/profile.routes");
app.use("/", profile);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;