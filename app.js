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

hbs.registerHelper("checkIfUpOrDown", perc => perc > 0 ? 'text-success': 'text-danger');
hbs.registerHelper("amountFormatter", amount => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const projectName = "coinbutter";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

app.use((req,res,next) => {
    res.locals.connectedUser = req.session.user ? req.session.user : false;
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

/* app.get('/assets', (req, res, next) => {
    axios
    .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h')
    .then(responseFromApi => {
        res.render('./views/assets/assets.hbs', { assets: responseFromApi })
    })
    .catch((error) => console.log(error));
}); */

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;