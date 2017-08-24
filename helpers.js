module.exports = {
  contains: (target, source) =>
    typeof source === "string"
      ? source.toLowerCase().indexOf(target.toLowerCase()) > -1
      : false
};
