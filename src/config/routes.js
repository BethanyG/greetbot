const express = require('express');
const router = express.Router();
const path = require('path');

const resourcesController = require(path.join(__dirname, '..', 'controllers', 'resources'));

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
  // .put(resourcesController.updateResource);

module.exports = { router };
