const Hashids = require('hashids/cjs');

class HashIds {
  get() {
    return new Hashids('', 9);
  }
}

module.exports = HashIds
