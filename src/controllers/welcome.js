const path = require('path');
const YAML = require('yamljs');
const fs = require('fs');

const slashWelcome = require(path.join('routes', 'endpoints', 'slash', 'welcome', 'welcome'));

const postWelcome = (req, res) => {
  slashWelcome.resources(req, res);
};

module.exports = { postWelcome };
