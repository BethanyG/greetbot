const path = require('path');

const slashWelcome = require(path.join('routes', 'endpoints', 'slash', 'welcome', 'welcome'));

const postWelcome = (req, res) => {
  slashWelcome.welcome(req, res);
};

module.exports = { postWelcome };
