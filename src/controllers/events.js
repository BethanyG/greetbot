const path = require('path');

const initalEvent = require(path.join('routes', 'endpoints', 'events', 'initial'));

const postEvent = (req, res) => {
  initalEvent.eventWelcome(req, res);
};

module.exports = { postEvent };
