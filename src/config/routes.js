const express = require('express');
const router = express.Router();
const path = require('path');

const resourcesController = require(path.join(__dirname, '..', 'controllers', 'resources'));
const welcomeController = require(path.join(__dirname, '..', 'controllers', 'welcome'));

// Notes on Slack endpoint commands:
//   - A given `slash` command is fired whenever a user evokes the "slash ---"
//     in a channel.
//   - Each function attempts to confirm a verification token & then executes
//     various commmand scenarios.
//   - Command extentions for each slash command can be added via case
//     statements in the various command files.

// Assign all methods for /resources route
router.route('/resources')
  // Used to display the current resources,
  // as an aid to creating Slack markdown formatting
  .get(resourcesController.getAll)
  // The Slack endpoint command
  .post(resourcesController.postResources);

// Assign all methods for /resources/:name route
router.route('/resources/:name')
  // Shows the current route fields
  .get(resourcesController.getResource)
  // Saves any changes to the resource in development
  .post(resourcesController.updateResource);


// Assign all methods for /welcome route
router.route('/welcome')
  // The Slack endpoint command
  .post(welcomeController.postWelcome);

module.exports = { router };
