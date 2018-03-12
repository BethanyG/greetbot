const filterResources = (resourceList, filters) => {
  resourceList.filter(resource => {
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

}

module.exports = { filterResources };
