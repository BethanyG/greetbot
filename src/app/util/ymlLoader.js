const YAML = require('yamljs');
const path = require('path');
const glob = require('glob');

const resources = []
const messageTemplates = []
// const resourcesData = YAML.load(path.join(__dirname, '..', 'routes', 'data', 'slash', 'resources', 'resourcesData.yml'));
glob("**/*.yml", { "cwd": path.join(__dirname, '..', 'routes', 'data', 'resources'), 'absolute': true }, function (err, files) {
	files.forEach(file => {
    resources.push(YAML.load(path.resolve(file)));
	});
});

glob("**/*.yml", { "cwd": path.join(__dirname, '..', 'routes', 'data', 'slash', 'resources', 'messageTemplates'), 'absolute': true }, function (err, files) {
	files.forEach(file => {
		messageTemplates.push( {[path.basename(file, '.yml')]: YAML.load(path.resolve(file)) } );
	});
});

module.exports = { resources, messageTemplates };
