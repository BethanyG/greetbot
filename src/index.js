/* jshint esversion: 6 */
require('dotenv').config();
require('app-module-path').addPath(`${__dirname}/app`);

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const initalResponse = require('routes/data/interactive/initialResponse');

const app = express();
const router = require(path.join(__dirname, 'config', 'routes')).router;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded && application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'CodeBuddies Greetbot',
    headline: 'The Welcome/Code of Conduct app for CodeBuddies is running.',
    paragraph: 'Follow the instructions in the README on GitHub to clone/configure this Slack App & your environment variables.'
  });
});

app.use(router);


// Endpoint to receive events from interactive welcome message on Slack.
// Checks the verification token before continuing.
app.post('/interactive-message', (req, res) => {
  initalResponse.welcomeResponse(req, res);
});


app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});

module.exports = app;
