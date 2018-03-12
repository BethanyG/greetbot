const YAML = require('yamljs');
const path = require('path');
const glob = require('glob');

const messageAttachments = []
const messageBodies = []

// "cwd" sets the initial directory to start looking in
// "absolute" returns an absolute path to the file, so YAML doesn't get confused
glob("**/*.yml", { "cwd": path.join(__dirname, '..', 'routes', 'data', 'slash', 'resources', 'messageAttachments'), 'absolute': true }, function (err, files) {
  files.forEach(file => {
    messageAttachments.push(YAML.load(path.resolve(file)));
  });
});

glob("**/*.yml", { "cwd": path.join(__dirname, '..', 'routes', 'data', 'slash', 'resources', 'messageBodies'), 'absolute': true }, function (err, files) {
  files.forEach(file => {
    messageBodies.push( {[path.basename(file, '.yml')]: YAML.load(path.resolve(file)) } );
  });
});

module.exports = { messageAttachments, messageBodies };
