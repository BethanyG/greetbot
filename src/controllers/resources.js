const path = require('path');

const resourceData = require(path.join('util', 'ymlLoader')).messageAttachments;
const groupByArray = require(path.join('util', 'groupBy')).groupByArray;
const slashResources = require(path.join('routes', 'endpoints', 'slash', 'resources', 'resources'));

const getAll = (req, res) => {
  const resourcesByLang = groupByArray(resourceData, 'language');
  const groupedResources = resourcesByLang.map( (lang) => {
    lang.values = groupByArray(lang.values, 'level');
    return lang;
  });
  res.render('resources/index', { title: 'Greetbot Resources', groupedResources: groupedResources });
};

const postResources = (req, res) => {
  slashResources.resources(req, res);
}

module.exports = { getAll, postResources };
