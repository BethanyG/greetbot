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
};

const getResource = (req, res) => {
  const resource = resourceData.filter(resource => {
    return resource.name = req.params.name;
  })[0];
  res.render('resources/show', { title: resource.name, resource: resource });
};

module.exports = { getAll, postResources, getResource };
// app.get('/resources/:name', (req, res) => {
//   const resource = resourceData.filter(resource => {
//     return resource.name == req.params.name;
//   })[0];
//   const title = resource ? resource.name : "New resource"
//   res.render('resources/show', { title: title, resource: resource });
// });

// app.post('/resources/:name', (req, res) => {
//   const resource = req.body.resource;
//   const ymltext = YAML.stringify(resource, 2);
//   fs.writeFile(path.resolve(`${__dirname}`,'app','routes','data','slash','resources','messageAttachments',resource.language,resource.level, `${resource.name}.yml`), ymltext, (err) => {
//     if (err) {
//       console.log(err);
//     }
//   })
//   res.redirect('/resources');
// })

