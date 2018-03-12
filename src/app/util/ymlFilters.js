const filterResources = (resourceList, filters) => {
  return resourceList.filter(resource => {
    let keep = false;
    for (var filter in filters) {
      if (!filters.hasOwnProperty(filter)) continue;

      if (filters[filter].includes(resource[filter])) {
        keep = true;
      }
    }
    return keep;
  })
}

const filterTemplates = (resources, messageTemplates) => {
  let toKeep = {};
  resources.forEach(resource => {
    if (toKeep.hasOwnProperty(resource['language'])a2) {
      if (!toKeep[resource['language']].includes(resource['level'])){
        toKeep[resource['language']].push(resource['level']);
      }
    } else {
      toKeep[resource['language']] = [resource['level']];
    }
  })
  for (var template in messageTemplates) {
    let language = template['language'].toLowerCase();
    let level = template['level'].toLowerCase();
    if (!(toKeep.hasOwnProperty(language) && toKeep[language].includes(level))) {
      delete messageTemplates[template];
    }
  }
  return messageTemplates;
}

module.exports = { filterResources, filterTemplates };
