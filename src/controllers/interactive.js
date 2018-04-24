const path = require('path');

const initalResponse = require(path.join('routes', 'data', 'interactive', 'initialResponse'));

const postResponse = (req, res) => {
  initalResponse.welcomeResponse(req, res);
};

module.exports = { postResponse };
