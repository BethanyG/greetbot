const express = require('express');
const router = express.Router();
const path = require('path');

const resourcesController = require(path.join(__dirname, '..', 'controllers', 'resources'));

router.route('/resources')
  .get(resourcesController.getAll)

module.exports = { router };
