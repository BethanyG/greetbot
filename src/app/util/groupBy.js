const groupBy = (array, key) => {
  return array.reduce( (hash,elem) => {
    (hash[elem[key]] = hash[elem[key]] || []).push(elem);
    return hash;
  }, {});
};

const groupByArray = (array, key) => {
  return array.reduce( (hash, elem) => {
    let v = key instanceof Function ? key(elem) : elem[key];
    let el = hash.find((r) => r && r.key === v);
    if (el) {
      el.values.push(elem);
    } else {
      hash.push({ key: v, values: [elem] });
    }
    return hash;
  }, []);
};

module.exports = { groupBy, groupByArray };
