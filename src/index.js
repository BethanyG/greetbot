/* jshint esversion: 6 */
require('dotenv').config();
require('app-module-path').addPath(`${__dirname}/app`);

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const YAML = require('yamljs');
const fs = require('fs');
const initalEvent = require('routes/endpoints/events/initial');
const slashWelcome = require('routes/endpoints/slash/welcome/welcome');
const slashResources = require('routes/endpoints/slash/resources/resources');
const initalResponse = require('routes/data/interactive/initialResponse');
const resourceData = require('util/ymlLoader').messageAttachments;
const groupByArray = require('util/groupBy').groupByArray;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + '/public'));

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

app.get('/resources', (req, res) => {
  const resourcesByLang = groupByArray(resourceData, 'language');
  const groupedResources = resourcesByLang.map( (lang) => {
    lang.values = groupByArray(lang.values, 'level');
    return lang;
  });
  res.render('resources/index', { title: 'Greetbot Resources', groupedResources: groupedResources });
});

app.get('/resources/:name', (req, res) => {
  const resource = resourceData.filter(resource => {
    return resource.name == req.params.name;
  })[0];
  const title = resource ? resource.name : "New resource"
  res.render('resources/show', { title: title, resource: resource });
});

app.post('/resources/:name', (req, res) => {
  const resource = req.body.resource;
  const ymltext = YAML.stringify(resource, 2);
  fs.writeFile(path.resolve(`${__dirname}`,'app','routes','data','slash','resources','messageAttachments',resource.language,resource.level, `${resource.name}.yml`), ymltext, (err) => {
    if (err) {
      console.log(err);
    }
  })
  res.redirect('/resources');
})

/*
 * Endpoint to receive events from Slack's Events API.
 * Handles:
 *   - url_verification: Returns challenge token sent when present.
 *   - event_callback: Confirm verification token & handle `team_join` event.
 */
app.post('/events', (req, res) => { initalEvent.eventWelcome(req, res); });

// Endpoints to receive various slash commands from Slack's API.
// Handles:
//   - A given `slash` command is fired whenever a user evokes the "slash ---"
//     in a channel.
//   - Each function attempts to confirm a verification token & then executes
//     various commmand scenarios.
//   - Command extentions for each slash command can be added via case
//     statements in the various command files.
app.post('/welcome', (req, res) => { slashWelcome.welcome(req, res); });
app.post('/resources', (req, res) => { slashResources.resources(req, res); });

// Endpoint to receive events from interactive welcome message on Slack.
// Checks the verification token before continuing.
app.post('/interactive-message', (req, res) => {
  initalResponse.welcomeResponse(req, res);
});


app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});

module.exports = app;
