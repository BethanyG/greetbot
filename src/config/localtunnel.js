// Module for creating a public tunnel to local server.
// This is ran separately from the app itself and along side with
// Node in `development` mode.
require('dotenv').config();

const localtunnel = require('localtunnel');
const config = {
  port: process.env.PORT,
  subdomain: { "subdomain": process.env.DEV_SUBDOMAIN }
}

localtunnel(config.port, config.subdomain, function (err, tunnel) {
  console.log(`App can be publicly accessed at ${tunnel.url}`);
});
