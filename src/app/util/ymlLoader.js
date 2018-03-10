const YAML = require('yamljs');
const path = require('path');
const glob = require('glob');

const resources = []
const messageTemplates = []
// const resourcesData = YAML.load(path.join(__dirname, '..', 'routes', 'data', 'slash', 'resources', 'resourcesData.yml'));

glob("**/*.yml", { "cmd": path.join(__dirname, '..', 'data', 'resources') }, function (err, files) {
	files.forEach(file => {
		resources.push(YAML.load(file));
	});
});

glob("**/*.yml", { "cmd": path.join(__dirname, '..', 'data', 'slash', 'resources', 'messageTemplates') }, function (err, files) {
	files.forEach(file => {
		messageTemplates.push( {[path.basename(file, '.yml')]: YAML.load(file) } );
	});
});

module.exports = { resources, messageTemplates };
