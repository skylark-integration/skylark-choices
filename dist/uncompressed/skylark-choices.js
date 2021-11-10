/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-choices/vendors/fuse',[],function () { 
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isArray(value) {
    return !Array.isArray ? getTag(value) === '[object Array]' : Array.isArray(value);
  } // Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js

  var INFINITY = 1 / 0;
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  function isString(value) {
    return typeof value === 'string';
  }
  function isNumber(value) {
    return typeof value === 'number';
  } // Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js

  function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && getTag(value) == '[object Boolean]';
  }
  function isObject(value) {
    return _typeof(value) === 'object';
  } // Checks if `value` is object-like.

  function isObjectLike(value) {
    return isObject(value) && value !== null;
  }
  function isDefined(value) {
    return value !== undefined && value !== null;
  }
  function isBlank(value) {
    return !value.trim().length;
  } // Gets the `toStringTag` of `value`.
  // Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js

  function getTag(value) {
    return value == null ? value === undefined ? '[object Undefined]' : '[object Null]' : Object.prototype.toString.call(value);
  }

  var EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';
  var INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
  var LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = function LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key) {
    return "Invalid value for key ".concat(key);
  };
  var PATTERN_LENGTH_TOO_LARGE = function PATTERN_LENGTH_TOO_LARGE(max) {
    return "Pattern length exceeds max of ".concat(max, ".");
  };
  var MISSING_KEY_PROPERTY = function MISSING_KEY_PROPERTY(name) {
    return "Missing ".concat(name, " property in key");
  };
  var INVALID_KEY_WEIGHT_VALUE = function INVALID_KEY_WEIGHT_VALUE(key) {
    return "Property 'weight' in key '".concat(key, "' must be a positive integer");
  };

  var hasOwn = Object.prototype.hasOwnProperty;

  var KeyStore = /*#__PURE__*/function () {
    function KeyStore(keys) {
      var _this = this;

      _classCallCheck(this, KeyStore);

      this._keys = [];
      this._keyMap = {};
      var totalWeight = 0;
      keys.forEach(function (key) {
        var obj = createKey(key);
        totalWeight += obj.weight;

        _this._keys.push(obj);

        _this._keyMap[obj.id] = obj;
        totalWeight += obj.weight;
      }); // Normalize weights so that their sum is equal to 1

      this._keys.forEach(function (key) {
        key.weight /= totalWeight;
      });
    }

    _createClass(KeyStore, [{
      key: "get",
      value: function get(keyId) {
        return this._keyMap[keyId];
      }
    }, {
      key: "keys",
      value: function keys() {
        return this._keys;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return JSON.stringify(this._keys);
      }
    }]);

    return KeyStore;
  }();
  function createKey(key) {
    var path = null;
    var id = null;
    var src = null;
    var weight = 1;

    if (isString(key) || isArray(key)) {
      src = key;
      path = createKeyPath(key);
      id = createKeyId(key);
    } else {
      if (!hasOwn.call(key, 'name')) {
        throw new Error(MISSING_KEY_PROPERTY('name'));
      }

      var name = key.name;
      src = name;

      if (hasOwn.call(key, 'weight')) {
        weight = key.weight;

        if (weight <= 0) {
          throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
        }
      }

      path = createKeyPath(name);
      id = createKeyId(name);
    }

    return {
      path: path,
      id: id,
      weight: weight,
      src: src
    };
  }
  function createKeyPath(key) {
    return isArray(key) ? key : key.split('.');
  }
  function createKeyId(key) {
    return isArray(key) ? key.join('.') : key;
  }

  function get(obj, path) {
    var list = [];
    var arr = false;

    var deepGet = function deepGet(obj, path, index) {
      if (!isDefined(obj)) {
        return;
      }

      if (!path[index]) {
        // If there's no path left, we've arrived at the object we care about.
        list.push(obj);
      } else {
        var key = path[index];
        var value = obj[key];

        if (!isDefined(value)) {
          return;
        } // If we're at the last value in the path, and if it's a string/number/bool,
        // add it to the list


        if (index === path.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
          list.push(toString(value));
        } else if (isArray(value)) {
          arr = true; // Search each item in the array.

          for (var i = 0, len = value.length; i < len; i += 1) {
            deepGet(value[i], path, index + 1);
          }
        } else if (path.length) {
          // An object. Recurse further.
          deepGet(value, path, index + 1);
        }
      }
    }; // Backwards compatibility (since path used to be a string)


    deepGet(obj, isString(path) ? path.split('.') : path, 0);
    return arr ? list : list[0];
  }

  var MatchOptions = {
    // Whether the matches should be included in the result set. When `true`, each record in the result
    // set will include the indices of the matched characters.
    // These can consequently be used for highlighting purposes.
    includeMatches: false,
    // When `true`, the matching function will continue to the end of a search pattern even if
    // a perfect match has already been located in the string.
    findAllMatches: false,
    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength: 1
  };
  var BasicOptions = {
    // When `true`, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    isCaseSensitive: false,
    // When true, the matching function will continue to the end of a search pattern even if
    includeScore: false,
    // List of properties that will be searched. This also supports nested properties.
    keys: [],
    // Whether to sort the result list, by score
    shouldSort: true,
    // Default sort function: sort by ascending score, ascending index
    sortFn: function sortFn(a, b) {
      return a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1;
    }
  };
  var FuzzyOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,
    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,
    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100
  };
  var AdvancedOptions = {
    // When `true`, it enables the use of unix-like search commands
    useExtendedSearch: false,
    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: get,
    // When `true`, search will ignore `location` and `distance`, so it won't matter
    // where in the string the pattern appears.
    // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
    ignoreLocation: false,
    // When `true`, the calculation for the relevance score (used for sorting) will
    // ignore the field-length norm.
    // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
    ignoreFieldNorm: false
  };
  var Config = _objectSpread2({}, BasicOptions, {}, MatchOptions, {}, FuzzyOptions, {}, AdvancedOptions);

  var SPACE = /[^ ]+/g; // Field-length norm: the shorter the field, the higher the weight.
  // Set to 3 decimals to reduce index size.

  function norm() {
    var mantissa = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var cache = new Map();
    var m = Math.pow(10, mantissa);
    return {
      get: function get(value) {
        var numTokens = value.match(SPACE).length;

        if (cache.has(numTokens)) {
          return cache.get(numTokens);
        }

        var norm = 1 / Math.sqrt(numTokens); // In place of `toFixed(mantissa)`, for faster computation

        var n = parseFloat(Math.round(norm * m) / m);
        cache.set(numTokens, n);
        return n;
      },
      clear: function clear() {
        cache.clear();
      }
    };
  }

  var FuseIndex = /*#__PURE__*/function () {
    function FuseIndex() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$getFn = _ref.getFn,
          getFn = _ref$getFn === void 0 ? Config.getFn : _ref$getFn;

      _classCallCheck(this, FuseIndex);

      this.norm = norm(3);
      this.getFn = getFn;
      this.isCreated = false;
      this.setIndexRecords();
    }

    _createClass(FuseIndex, [{
      key: "setSources",
      value: function setSources() {
        var docs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        this.docs = docs;
      }
    }, {
      key: "setIndexRecords",
      value: function setIndexRecords() {
        var records = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        this.records = records;
      }
    }, {
      key: "setKeys",
      value: function setKeys() {
        var _this = this;

        var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        this.keys = keys;
        this._keysMap = {};
        keys.forEach(function (key, idx) {
          _this._keysMap[key.id] = idx;
        });
      }
    }, {
      key: "create",
      value: function create() {
        var _this2 = this;

        if (this.isCreated || !this.docs.length) {
          return;
        }

        this.isCreated = true; // List is Array<String>

        if (isString(this.docs[0])) {
          this.docs.forEach(function (doc, docIndex) {
            _this2._addString(doc, docIndex);
          });
        } else {
          // List is Array<Object>
          this.docs.forEach(function (doc, docIndex) {
            _this2._addObject(doc, docIndex);
          });
        }

        this.norm.clear();
      } // Adds a doc to the end of the index

    }, {
      key: "add",
      value: function add(doc) {
        var idx = this.size();

        if (isString(doc)) {
          this._addString(doc, idx);
        } else {
          this._addObject(doc, idx);
        }
      } // Removes the doc at the specified index of the index

    }, {
      key: "removeAt",
      value: function removeAt(idx) {
        this.records.splice(idx, 1); // Change ref index of every subsquent doc

        for (var i = idx, len = this.size(); i < len; i += 1) {
          this.records[i].i -= 1;
        }
      }
    }, {
      key: "getValueForItemAtKeyId",
      value: function getValueForItemAtKeyId(item, keyId) {
        return item[this._keysMap[keyId]];
      }
    }, {
      key: "size",
      value: function size() {
        return this.records.length;
      }
    }, {
      key: "_addString",
      value: function _addString(doc, docIndex) {
        if (!isDefined(doc) || isBlank(doc)) {
          return;
        }

        var record = {
          v: doc,
          i: docIndex,
          n: this.norm.get(doc)
        };
        this.records.push(record);
      }
    }, {
      key: "_addObject",
      value: function _addObject(doc, docIndex) {
        var _this3 = this;

        var record = {
          i: docIndex,
          $: {}
        }; // Iterate over every key (i.e, path), and fetch the value at that key

        this.keys.forEach(function (key, keyIndex) {
          // console.log(key)
          var value = _this3.getFn(doc, key.path);

          if (!isDefined(value)) {
            return;
          }

          if (isArray(value)) {
            (function () {
              var subRecords = [];
              var stack = [{
                nestedArrIndex: -1,
                value: value
              }];

              while (stack.length) {
                var _stack$pop = stack.pop(),
                    nestedArrIndex = _stack$pop.nestedArrIndex,
                    _value = _stack$pop.value;

                if (!isDefined(_value)) {
                  continue;
                }

                if (isString(_value) && !isBlank(_value)) {
                  var subRecord = {
                    v: _value,
                    i: nestedArrIndex,
                    n: _this3.norm.get(_value)
                  };
                  subRecords.push(subRecord);
                } else if (isArray(_value)) {
                  _value.forEach(function (item, k) {
                    stack.push({
                      nestedArrIndex: k,
                      value: item
                    });
                  });
                }
              }

              record.$[keyIndex] = subRecords;
            })();
          } else if (!isBlank(value)) {
            var subRecord = {
              v: value,
              n: _this3.norm.get(value)
            };
            record.$[keyIndex] = subRecord;
          }
        });
        this.records.push(record);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          keys: this.keys,
          records: this.records
        };
      }
    }]);

    return FuseIndex;
  }();
  function createIndex(keys, docs) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$getFn = _ref2.getFn,
        getFn = _ref2$getFn === void 0 ? Config.getFn : _ref2$getFn;

    var myIndex = new FuseIndex({
      getFn: getFn
    });
    myIndex.setKeys(keys.map(createKey));
    myIndex.setSources(docs);
    myIndex.create();
    return myIndex;
  }
  function parseIndex(data) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref3$getFn = _ref3.getFn,
        getFn = _ref3$getFn === void 0 ? Config.getFn : _ref3$getFn;

    var keys = data.keys,
        records = data.records;
    var myIndex = new FuseIndex({
      getFn: getFn
    });
    myIndex.setKeys(keys);
    myIndex.setIndexRecords(records);
    return myIndex;
  }

  function computeScore(pattern) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$errors = _ref.errors,
        errors = _ref$errors === void 0 ? 0 : _ref$errors,
        _ref$currentLocation = _ref.currentLocation,
        currentLocation = _ref$currentLocation === void 0 ? 0 : _ref$currentLocation,
        _ref$expectedLocation = _ref.expectedLocation,
        expectedLocation = _ref$expectedLocation === void 0 ? 0 : _ref$expectedLocation,
        _ref$distance = _ref.distance,
        distance = _ref$distance === void 0 ? Config.distance : _ref$distance,
        _ref$ignoreLocation = _ref.ignoreLocation,
        ignoreLocation = _ref$ignoreLocation === void 0 ? Config.ignoreLocation : _ref$ignoreLocation;

    var accuracy = errors / pattern.length;

    if (ignoreLocation) {
      return accuracy;
    }

    var proximity = Math.abs(expectedLocation - currentLocation);

    if (!distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }

    return accuracy + proximity / distance;
  }

  function convertMaskToIndices() {
    var matchmask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var minMatchCharLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Config.minMatchCharLength;
    var indices = [];
    var start = -1;
    var end = -1;
    var i = 0;

    for (var len = matchmask.length; i < len; i += 1) {
      var match = matchmask[i];

      if (match && start === -1) {
        start = i;
      } else if (!match && start !== -1) {
        end = i - 1;

        if (end - start + 1 >= minMatchCharLength) {
          indices.push([start, end]);
        }

        start = -1;
      }
    } // (i-1 - start) + 1 => i - start


    if (matchmask[i - 1] && i - start >= minMatchCharLength) {
      indices.push([start, i - 1]);
    }

    return indices;
  }

  // Machine word size
  var MAX_BITS = 32;

  function search(text, pattern, patternAlphabet) {
    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref$location = _ref.location,
        location = _ref$location === void 0 ? Config.location : _ref$location,
        _ref$distance = _ref.distance,
        distance = _ref$distance === void 0 ? Config.distance : _ref$distance,
        _ref$threshold = _ref.threshold,
        threshold = _ref$threshold === void 0 ? Config.threshold : _ref$threshold,
        _ref$findAllMatches = _ref.findAllMatches,
        findAllMatches = _ref$findAllMatches === void 0 ? Config.findAllMatches : _ref$findAllMatches,
        _ref$minMatchCharLeng = _ref.minMatchCharLength,
        minMatchCharLength = _ref$minMatchCharLeng === void 0 ? Config.minMatchCharLength : _ref$minMatchCharLeng,
        _ref$includeMatches = _ref.includeMatches,
        includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches,
        _ref$ignoreLocation = _ref.ignoreLocation,
        ignoreLocation = _ref$ignoreLocation === void 0 ? Config.ignoreLocation : _ref$ignoreLocation;

    if (pattern.length > MAX_BITS) {
      throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
    }

    var patternLen = pattern.length; // Set starting location at beginning text and initialize the alphabet.

    var textLen = text.length; // Handle the case when location > text.length

    var expectedLocation = Math.max(0, Math.min(location, textLen)); // Highest score beyond which we give up.

    var currentThreshold = threshold; // Is there a nearby exact match? (speedup)

    var bestLocation = expectedLocation; // Performance: only computer matches when the minMatchCharLength > 1
    // OR if `includeMatches` is true.

    var computeMatches = minMatchCharLength > 1 || includeMatches; // A mask of the matches, used for building the indices

    var matchMask = computeMatches ? Array(textLen) : [];
    var index; // Get all exact matches, here for speed up

    while ((index = text.indexOf(pattern, bestLocation)) > -1) {
      var score = computeScore(pattern, {
        currentLocation: index,
        expectedLocation: expectedLocation,
        distance: distance,
        ignoreLocation: ignoreLocation
      });
      currentThreshold = Math.min(score, currentThreshold);
      bestLocation = index + patternLen;

      if (computeMatches) {
        var i = 0;

        while (i < patternLen) {
          matchMask[index + i] = 1;
          i += 1;
        }
      }
    } // Reset the best location


    bestLocation = -1;
    var lastBitArr = [];
    var finalScore = 1;
    var binMax = patternLen + textLen;
    var mask = 1 << patternLen - 1;

    for (var _i = 0; _i < patternLen; _i += 1) {
      // Scan for the best match; each iteration allows for one more error.
      // Run a binary search to determine how far from the match location we can stray
      // at this error level.
      var binMin = 0;
      var binMid = binMax;

      while (binMin < binMid) {
        var _score2 = computeScore(pattern, {
          errors: _i,
          currentLocation: expectedLocation + binMid,
          expectedLocation: expectedLocation,
          distance: distance,
          ignoreLocation: ignoreLocation
        });

        if (_score2 <= currentThreshold) {
          binMin = binMid;
        } else {
          binMax = binMid;
        }

        binMid = Math.floor((binMax - binMin) / 2 + binMin);
      } // Use the result from this iteration as the maximum for the next.


      binMax = binMid;
      var start = Math.max(1, expectedLocation - binMid + 1);
      var finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen; // Initialize the bit array

      var bitArr = Array(finish + 2);
      bitArr[finish + 1] = (1 << _i) - 1;

      for (var j = finish; j >= start; j -= 1) {
        var currentLocation = j - 1;
        var charMatch = patternAlphabet[text.charAt(currentLocation)];

        if (computeMatches) {
          // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
          matchMask[currentLocation] = +!!charMatch;
        } // First pass: exact match


        bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch; // Subsequent passes: fuzzy match

        if (_i) {
          bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
        }

        if (bitArr[j] & mask) {
          finalScore = computeScore(pattern, {
            errors: _i,
            currentLocation: currentLocation,
            expectedLocation: expectedLocation,
            distance: distance,
            ignoreLocation: ignoreLocation
          }); // This match will almost certainly be better than any existing match.
          // But check anyway.

          if (finalScore <= currentThreshold) {
            // Indeed it is
            currentThreshold = finalScore;
            bestLocation = currentLocation; // Already passed `loc`, downhill from here on in.

            if (bestLocation <= expectedLocation) {
              break;
            } // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.


            start = Math.max(1, 2 * expectedLocation - bestLocation);
          }
        }
      } // No hope for a (better) match at greater error levels.


      var _score = computeScore(pattern, {
        errors: _i + 1,
        currentLocation: expectedLocation,
        expectedLocation: expectedLocation,
        distance: distance,
        ignoreLocation: ignoreLocation
      });

      if (_score > currentThreshold) {
        break;
      }

      lastBitArr = bitArr;
    }

    var result = {
      isMatch: bestLocation >= 0,
      // Count exact matches (those with a score of 0) to be "almost" exact
      score: Math.max(0.001, finalScore)
    };

    if (computeMatches) {
      var indices = convertMaskToIndices(matchMask, minMatchCharLength);

      if (!indices.length) {
        result.isMatch = false;
      } else if (includeMatches) {
        result.indices = indices;
      }
    }

    return result;
  }

  function createPatternAlphabet(pattern) {
    var mask = {};

    for (var i = 0, len = pattern.length; i < len; i += 1) {
      var char = pattern.charAt(i);
      mask[char] = (mask[char] || 0) | 1 << len - i - 1;
    }

    return mask;
  }

  var BitapSearch = /*#__PURE__*/function () {
    function BitapSearch(pattern) {
      var _this = this;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$location = _ref.location,
          location = _ref$location === void 0 ? Config.location : _ref$location,
          _ref$threshold = _ref.threshold,
          threshold = _ref$threshold === void 0 ? Config.threshold : _ref$threshold,
          _ref$distance = _ref.distance,
          distance = _ref$distance === void 0 ? Config.distance : _ref$distance,
          _ref$includeMatches = _ref.includeMatches,
          includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches,
          _ref$findAllMatches = _ref.findAllMatches,
          findAllMatches = _ref$findAllMatches === void 0 ? Config.findAllMatches : _ref$findAllMatches,
          _ref$minMatchCharLeng = _ref.minMatchCharLength,
          minMatchCharLength = _ref$minMatchCharLeng === void 0 ? Config.minMatchCharLength : _ref$minMatchCharLeng,
          _ref$isCaseSensitive = _ref.isCaseSensitive,
          isCaseSensitive = _ref$isCaseSensitive === void 0 ? Config.isCaseSensitive : _ref$isCaseSensitive,
          _ref$ignoreLocation = _ref.ignoreLocation,
          ignoreLocation = _ref$ignoreLocation === void 0 ? Config.ignoreLocation : _ref$ignoreLocation;

      _classCallCheck(this, BitapSearch);

      this.options = {
        location: location,
        threshold: threshold,
        distance: distance,
        includeMatches: includeMatches,
        findAllMatches: findAllMatches,
        minMatchCharLength: minMatchCharLength,
        isCaseSensitive: isCaseSensitive,
        ignoreLocation: ignoreLocation
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.chunks = [];

      if (!this.pattern.length) {
        return;
      }

      var addChunk = function addChunk(pattern, startIndex) {
        _this.chunks.push({
          pattern: pattern,
          alphabet: createPatternAlphabet(pattern),
          startIndex: startIndex
        });
      };

      var len = this.pattern.length;

      if (len > MAX_BITS) {
        var i = 0;
        var remainder = len % MAX_BITS;
        var end = len - remainder;

        while (i < end) {
          addChunk(this.pattern.substr(i, MAX_BITS), i);
          i += MAX_BITS;
        }

        if (remainder) {
          var startIndex = len - MAX_BITS;
          addChunk(this.pattern.substr(startIndex), startIndex);
        }
      } else {
        addChunk(this.pattern, 0);
      }
    }

    _createClass(BitapSearch, [{
      key: "searchIn",
      value: function searchIn(text) {
        var _this$options = this.options,
            isCaseSensitive = _this$options.isCaseSensitive,
            includeMatches = _this$options.includeMatches;

        if (!isCaseSensitive) {
          text = text.toLowerCase();
        } // Exact match


        if (this.pattern === text) {
          var _result = {
            isMatch: true,
            score: 0
          };

          if (includeMatches) {
            _result.indices = [[0, text.length - 1]];
          }

          return _result;
        } // Otherwise, use Bitap algorithm


        var _this$options2 = this.options,
            location = _this$options2.location,
            distance = _this$options2.distance,
            threshold = _this$options2.threshold,
            findAllMatches = _this$options2.findAllMatches,
            minMatchCharLength = _this$options2.minMatchCharLength,
            ignoreLocation = _this$options2.ignoreLocation;
        var allIndices = [];
        var totalScore = 0;
        var hasMatches = false;
        this.chunks.forEach(function (_ref2) {
          var pattern = _ref2.pattern,
              alphabet = _ref2.alphabet,
              startIndex = _ref2.startIndex;

          var _search = search(text, pattern, alphabet, {
            location: location + startIndex,
            distance: distance,
            threshold: threshold,
            findAllMatches: findAllMatches,
            minMatchCharLength: minMatchCharLength,
            includeMatches: includeMatches,
            ignoreLocation: ignoreLocation
          }),
              isMatch = _search.isMatch,
              score = _search.score,
              indices = _search.indices;

          if (isMatch) {
            hasMatches = true;
          }

          totalScore += score;

          if (isMatch && indices) {
            allIndices = [].concat(_toConsumableArray(allIndices), _toConsumableArray(indices));
          }
        });
        var result = {
          isMatch: hasMatches,
          score: hasMatches ? totalScore / this.chunks.length : 1
        };

        if (hasMatches && includeMatches) {
          result.indices = allIndices;
        }

        return result;
      }
    }]);

    return BitapSearch;
  }();

  var BaseMatch = /*#__PURE__*/function () {
    function BaseMatch(pattern) {
      _classCallCheck(this, BaseMatch);

      this.pattern = pattern;
    }

    _createClass(BaseMatch, [{
      key: "search",
      value: function search()
      /*text*/
      {}
    }], [{
      key: "isMultiMatch",
      value: function isMultiMatch(pattern) {
        return getMatch(pattern, this.multiRegex);
      }
    }, {
      key: "isSingleMatch",
      value: function isSingleMatch(pattern) {
        return getMatch(pattern, this.singleRegex);
      }
    }]);

    return BaseMatch;
  }();

  function getMatch(pattern, exp) {
    var matches = pattern.match(exp);
    return matches ? matches[1] : null;
  }

  var ExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(ExactMatch, _BaseMatch);

    var _super = _createSuper(ExactMatch);

    function ExactMatch(pattern) {
      _classCallCheck(this, ExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(ExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = text === this.pattern;
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, this.pattern.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^="(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^=(.*)$/;
      }
    }]);

    return ExactMatch;
  }(BaseMatch);

  var InverseExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(InverseExactMatch, _BaseMatch);

    var _super = _createSuper(InverseExactMatch);

    function InverseExactMatch(pattern) {
      _classCallCheck(this, InverseExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(InverseExactMatch, [{
      key: "search",
      value: function search(text) {
        var index = text.indexOf(this.pattern);
        var isMatch = index === -1;
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'inverse-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^!"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^!(.*)$/;
      }
    }]);

    return InverseExactMatch;
  }(BaseMatch);

  var PrefixExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(PrefixExactMatch, _BaseMatch);

    var _super = _createSuper(PrefixExactMatch);

    function PrefixExactMatch(pattern) {
      _classCallCheck(this, PrefixExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(PrefixExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = text.startsWith(this.pattern);
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, this.pattern.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'prefix-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^\^"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^\^(.*)$/;
      }
    }]);

    return PrefixExactMatch;
  }(BaseMatch);

  var InversePrefixExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(InversePrefixExactMatch, _BaseMatch);

    var _super = _createSuper(InversePrefixExactMatch);

    function InversePrefixExactMatch(pattern) {
      _classCallCheck(this, InversePrefixExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(InversePrefixExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = !text.startsWith(this.pattern);
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'inverse-prefix-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^!\^"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^!\^(.*)$/;
      }
    }]);

    return InversePrefixExactMatch;
  }(BaseMatch);

  var SuffixExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(SuffixExactMatch, _BaseMatch);

    var _super = _createSuper(SuffixExactMatch);

    function SuffixExactMatch(pattern) {
      _classCallCheck(this, SuffixExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(SuffixExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = text.endsWith(this.pattern);
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [text.length - this.pattern.length, text.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'suffix-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^"(.*)"\$$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^(.*)\$$/;
      }
    }]);

    return SuffixExactMatch;
  }(BaseMatch);

  var InverseSuffixExactMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(InverseSuffixExactMatch, _BaseMatch);

    var _super = _createSuper(InverseSuffixExactMatch);

    function InverseSuffixExactMatch(pattern) {
      _classCallCheck(this, InverseSuffixExactMatch);

      return _super.call(this, pattern);
    }

    _createClass(InverseSuffixExactMatch, [{
      key: "search",
      value: function search(text) {
        var isMatch = !text.endsWith(this.pattern);
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'inverse-suffix-exact';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^!"(.*)"\$$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^!(.*)\$$/;
      }
    }]);

    return InverseSuffixExactMatch;
  }(BaseMatch);

  var FuzzyMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(FuzzyMatch, _BaseMatch);

    var _super = _createSuper(FuzzyMatch);

    function FuzzyMatch(pattern) {
      var _this;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$location = _ref.location,
          location = _ref$location === void 0 ? Config.location : _ref$location,
          _ref$threshold = _ref.threshold,
          threshold = _ref$threshold === void 0 ? Config.threshold : _ref$threshold,
          _ref$distance = _ref.distance,
          distance = _ref$distance === void 0 ? Config.distance : _ref$distance,
          _ref$includeMatches = _ref.includeMatches,
          includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches,
          _ref$findAllMatches = _ref.findAllMatches,
          findAllMatches = _ref$findAllMatches === void 0 ? Config.findAllMatches : _ref$findAllMatches,
          _ref$minMatchCharLeng = _ref.minMatchCharLength,
          minMatchCharLength = _ref$minMatchCharLeng === void 0 ? Config.minMatchCharLength : _ref$minMatchCharLeng,
          _ref$isCaseSensitive = _ref.isCaseSensitive,
          isCaseSensitive = _ref$isCaseSensitive === void 0 ? Config.isCaseSensitive : _ref$isCaseSensitive,
          _ref$ignoreLocation = _ref.ignoreLocation,
          ignoreLocation = _ref$ignoreLocation === void 0 ? Config.ignoreLocation : _ref$ignoreLocation;

      _classCallCheck(this, FuzzyMatch);

      _this = _super.call(this, pattern);
      _this._bitapSearch = new BitapSearch(pattern, {
        location: location,
        threshold: threshold,
        distance: distance,
        includeMatches: includeMatches,
        findAllMatches: findAllMatches,
        minMatchCharLength: minMatchCharLength,
        isCaseSensitive: isCaseSensitive,
        ignoreLocation: ignoreLocation
      });
      return _this;
    }

    _createClass(FuzzyMatch, [{
      key: "search",
      value: function search(text) {
        return this._bitapSearch.searchIn(text);
      }
    }], [{
      key: "type",
      get: function get() {
        return 'fuzzy';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^(.*)$/;
      }
    }]);

    return FuzzyMatch;
  }(BaseMatch);

  var IncludeMatch = /*#__PURE__*/function (_BaseMatch) {
    _inherits(IncludeMatch, _BaseMatch);

    var _super = _createSuper(IncludeMatch);

    function IncludeMatch(pattern) {
      _classCallCheck(this, IncludeMatch);

      return _super.call(this, pattern);
    }

    _createClass(IncludeMatch, [{
      key: "search",
      value: function search(text) {
        var location = 0;
        var index;
        var indices = [];
        var patternLen = this.pattern.length; // Get all exact matches

        while ((index = text.indexOf(this.pattern, location)) > -1) {
          location = index + patternLen;
          indices.push([index, location - 1]);
        }

        var isMatch = !!indices.length;
        return {
          isMatch: isMatch,
          score: isMatch ? 0 : 1,
          indices: indices
        };
      }
    }], [{
      key: "type",
      get: function get() {
        return 'include';
      }
    }, {
      key: "multiRegex",
      get: function get() {
        return /^'"(.*)"$/;
      }
    }, {
      key: "singleRegex",
      get: function get() {
        return /^'(.*)$/;
      }
    }]);

    return IncludeMatch;
  }(BaseMatch);

  var searchers = [ExactMatch, IncludeMatch, PrefixExactMatch, InversePrefixExactMatch, InverseSuffixExactMatch, SuffixExactMatch, InverseExactMatch, FuzzyMatch];
  var searchersLen = searchers.length; // Regex to split by spaces, but keep anything in quotes together

  var SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
  var OR_TOKEN = '|'; // Return a 2D array representation of the query, for simpler parsing.
  // Example:
  // "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]

  function parseQuery(pattern) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return pattern.split(OR_TOKEN).map(function (item) {
      var query = item.trim().split(SPACE_RE).filter(function (item) {
        return item && !!item.trim();
      });
      var results = [];

      for (var i = 0, len = query.length; i < len; i += 1) {
        var queryItem = query[i]; // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)

        var found = false;
        var idx = -1;

        while (!found && ++idx < searchersLen) {
          var searcher = searchers[idx];
          var token = searcher.isMultiMatch(queryItem);

          if (token) {
            results.push(new searcher(token, options));
            found = true;
          }
        }

        if (found) {
          continue;
        } // 2. Handle single query matches (i.e, once that are *not* quoted)


        idx = -1;

        while (++idx < searchersLen) {
          var _searcher = searchers[idx];

          var _token = _searcher.isSingleMatch(queryItem);

          if (_token) {
            results.push(new _searcher(_token, options));
            break;
          }
        }
      }

      return results;
    });
  }

  // to a singl match

  var MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);
  /**
   * Command-like searching
   * ======================
   *
   * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
   * search in a given text.
   *
   * Search syntax:
   *
   * | Token       | Match type                 | Description                            |
   * | ----------- | -------------------------- | -------------------------------------- |
   * | `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
   * | `=scheme`   | exact-match                | Items that are `scheme`                |
   * | `'python`   | include-match              | Items that include `python`            |
   * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
   * | `^java`     | prefix-exact-match         | Items that start with `java`           |
   * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
   * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
   * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
   *
   * A single pipe character acts as an OR operator. For example, the following
   * query matches entries that start with `core` and end with either`go`, `rb`,
   * or`py`.
   *
   * ```
   * ^core go$ | rb$ | py$
   * ```
   */

  var ExtendedSearch = /*#__PURE__*/function () {
    function ExtendedSearch(pattern) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$isCaseSensitive = _ref.isCaseSensitive,
          isCaseSensitive = _ref$isCaseSensitive === void 0 ? Config.isCaseSensitive : _ref$isCaseSensitive,
          _ref$includeMatches = _ref.includeMatches,
          includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches,
          _ref$minMatchCharLeng = _ref.minMatchCharLength,
          minMatchCharLength = _ref$minMatchCharLeng === void 0 ? Config.minMatchCharLength : _ref$minMatchCharLeng,
          _ref$ignoreLocation = _ref.ignoreLocation,
          ignoreLocation = _ref$ignoreLocation === void 0 ? Config.ignoreLocation : _ref$ignoreLocation,
          _ref$findAllMatches = _ref.findAllMatches,
          findAllMatches = _ref$findAllMatches === void 0 ? Config.findAllMatches : _ref$findAllMatches,
          _ref$location = _ref.location,
          location = _ref$location === void 0 ? Config.location : _ref$location,
          _ref$threshold = _ref.threshold,
          threshold = _ref$threshold === void 0 ? Config.threshold : _ref$threshold,
          _ref$distance = _ref.distance,
          distance = _ref$distance === void 0 ? Config.distance : _ref$distance;

      _classCallCheck(this, ExtendedSearch);

      this.query = null;
      this.options = {
        isCaseSensitive: isCaseSensitive,
        includeMatches: includeMatches,
        minMatchCharLength: minMatchCharLength,
        findAllMatches: findAllMatches,
        ignoreLocation: ignoreLocation,
        location: location,
        threshold: threshold,
        distance: distance
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.query = parseQuery(this.pattern, this.options);
    }

    _createClass(ExtendedSearch, [{
      key: "searchIn",
      value: function searchIn(text) {
        var query = this.query;

        if (!query) {
          return {
            isMatch: false,
            score: 1
          };
        }

        var _this$options = this.options,
            includeMatches = _this$options.includeMatches,
            isCaseSensitive = _this$options.isCaseSensitive;
        text = isCaseSensitive ? text : text.toLowerCase();
        var numMatches = 0;
        var allIndices = [];
        var totalScore = 0; // ORs

        for (var i = 0, qLen = query.length; i < qLen; i += 1) {
          var searchers = query[i]; // Reset indices

          allIndices.length = 0;
          numMatches = 0; // ANDs

          for (var j = 0, pLen = searchers.length; j < pLen; j += 1) {
            var searcher = searchers[j];

            var _searcher$search = searcher.search(text),
                isMatch = _searcher$search.isMatch,
                indices = _searcher$search.indices,
                score = _searcher$search.score;

            if (isMatch) {
              numMatches += 1;
              totalScore += score;

              if (includeMatches) {
                var type = searcher.constructor.type;

                if (MultiMatchSet.has(type)) {
                  allIndices = [].concat(_toConsumableArray(allIndices), _toConsumableArray(indices));
                } else {
                  allIndices.push(indices);
                }
              }
            } else {
              totalScore = 0;
              numMatches = 0;
              allIndices.length = 0;
              break;
            }
          } // OR condition, so if TRUE, return


          if (numMatches) {
            var result = {
              isMatch: true,
              score: totalScore / numMatches
            };

            if (includeMatches) {
              result.indices = allIndices;
            }

            return result;
          }
        } // Nothing was matched


        return {
          isMatch: false,
          score: 1
        };
      }
    }], [{
      key: "condition",
      value: function condition(_, options) {
        return options.useExtendedSearch;
      }
    }]);

    return ExtendedSearch;
  }();

  var registeredSearchers = [];
  function register() {
    registeredSearchers.push.apply(registeredSearchers, arguments);
  }
  function createSearcher(pattern, options) {
    for (var i = 0, len = registeredSearchers.length; i < len; i += 1) {
      var searcherClass = registeredSearchers[i];

      if (searcherClass.condition(pattern, options)) {
        return new searcherClass(pattern, options);
      }
    }

    return new BitapSearch(pattern, options);
  }

  var LogicalOperator = {
    AND: '$and',
    OR: '$or'
  };
  var KeyType = {
    PATH: '$path',
    PATTERN: '$val'
  };

  var isExpression = function isExpression(query) {
    return !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
  };

  var isPath = function isPath(query) {
    return !!query[KeyType.PATH];
  };

  var isLeaf = function isLeaf(query) {
    return !isArray(query) && isObject(query) && !isExpression(query);
  };

  var convertToExplicit = function convertToExplicit(query) {
    return _defineProperty({}, LogicalOperator.AND, Object.keys(query).map(function (key) {
      return _defineProperty({}, key, query[key]);
    }));
  }; // When `auto` is `true`, the parse function will infer and initialize and add
  // the appropriate `Searcher` instance


  function parse(query, options) {
    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref3$auto = _ref3.auto,
        auto = _ref3$auto === void 0 ? true : _ref3$auto;

    var next = function next(query) {
      var keys = Object.keys(query);
      var isQueryPath = isPath(query);

      if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
        return next(convertToExplicit(query));
      }

      if (isLeaf(query)) {
        var key = isQueryPath ? query[KeyType.PATH] : keys[0];
        var pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];

        if (!isString(pattern)) {
          throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
        }

        var obj = {
          keyId: createKeyId(key),
          pattern: pattern
        };

        if (auto) {
          obj.searcher = createSearcher(pattern, options);
        }

        return obj;
      }

      var node = {
        children: [],
        operator: keys[0]
      };
      keys.forEach(function (key) {
        var value = query[key];

        if (isArray(value)) {
          value.forEach(function (item) {
            node.children.push(next(item));
          });
        }
      });
      return node;
    };

    if (!isExpression(query)) {
      query = convertToExplicit(query);
    }

    return next(query);
  }

  function computeScore$1(results, _ref) {
    var _ref$ignoreFieldNorm = _ref.ignoreFieldNorm,
        ignoreFieldNorm = _ref$ignoreFieldNorm === void 0 ? Config.ignoreFieldNorm : _ref$ignoreFieldNorm;
    results.forEach(function (result) {
      var totalScore = 1;
      result.matches.forEach(function (_ref2) {
        var key = _ref2.key,
            norm = _ref2.norm,
            score = _ref2.score;
        var weight = key ? key.weight : null;
        totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm));
      });
      result.score = totalScore;
    });
  }

  function transformMatches(result, data) {
    var matches = result.matches;
    data.matches = [];

    if (!isDefined(matches)) {
      return;
    }

    matches.forEach(function (match) {
      if (!isDefined(match.indices) || !match.indices.length) {
        return;
      }

      var indices = match.indices,
          value = match.value;
      var obj = {
        indices: indices,
        value: value
      };

      if (match.key) {
        obj.key = match.key.src;
      }

      if (match.idx > -1) {
        obj.refIndex = match.idx;
      }

      data.matches.push(obj);
    });
  }

  function transformScore(result, data) {
    data.score = result.score;
  }

  function format(results, docs) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$includeMatches = _ref.includeMatches,
        includeMatches = _ref$includeMatches === void 0 ? Config.includeMatches : _ref$includeMatches,
        _ref$includeScore = _ref.includeScore,
        includeScore = _ref$includeScore === void 0 ? Config.includeScore : _ref$includeScore;

    var transformers = [];
    if (includeMatches) transformers.push(transformMatches);
    if (includeScore) transformers.push(transformScore);
    return results.map(function (result) {
      var idx = result.idx;
      var data = {
        item: docs[idx],
        refIndex: idx
      };

      if (transformers.length) {
        transformers.forEach(function (transformer) {
          transformer(result, data);
        });
      }

      return data;
    });
  }

  var Fuse = /*#__PURE__*/function () {
    function Fuse(docs) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var index = arguments.length > 2 ? arguments[2] : undefined;

      _classCallCheck(this, Fuse);

      this.options = _objectSpread2({}, Config, {}, options);

      if (this.options.useExtendedSearch && !true) {
        throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
      }

      this._keyStore = new KeyStore(this.options.keys);
      this.setCollection(docs, index);
    }

    _createClass(Fuse, [{
      key: "setCollection",
      value: function setCollection(docs, index) {
        this._docs = docs;

        if (index && !(index instanceof FuseIndex)) {
          throw new Error(INCORRECT_INDEX_TYPE);
        }

        this._myIndex = index || createIndex(this.options.keys, this._docs, {
          getFn: this.options.getFn
        });
      }
    }, {
      key: "add",
      value: function add(doc) {
        if (!isDefined(doc)) {
          return;
        }

        this._docs.push(doc);

        this._myIndex.add(doc);
      }
    }, {
      key: "remove",
      value: function remove() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
          return (
            /* doc, idx */
            false
          );
        };
        var results = [];

        for (var i = 0, len = this._docs.length; i < len; i += 1) {
          var doc = this._docs[i];

          if (predicate(doc, i)) {
            this.removeAt(i);
            i -= 1;
            len -= 1;
            results.push(doc);
          }
        }

        return results;
      }
    }, {
      key: "removeAt",
      value: function removeAt(idx) {
        this._docs.splice(idx, 1);

        this._myIndex.removeAt(idx);
      }
    }, {
      key: "getIndex",
      value: function getIndex() {
        return this._myIndex;
      }
    }, {
      key: "search",
      value: function search(query) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$limit = _ref.limit,
            limit = _ref$limit === void 0 ? -1 : _ref$limit;

        var _this$options = this.options,
            includeMatches = _this$options.includeMatches,
            includeScore = _this$options.includeScore,
            shouldSort = _this$options.shouldSort,
            sortFn = _this$options.sortFn,
            ignoreFieldNorm = _this$options.ignoreFieldNorm;
        var results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
        computeScore$1(results, {
          ignoreFieldNorm: ignoreFieldNorm
        });

        if (shouldSort) {
          results.sort(sortFn);
        }

        if (isNumber(limit) && limit > -1) {
          results = results.slice(0, limit);
        }

        return format(results, this._docs, {
          includeMatches: includeMatches,
          includeScore: includeScore
        });
      }
    }, {
      key: "_searchStringList",
      value: function _searchStringList(query) {
        var searcher = createSearcher(query, this.options);
        var records = this._myIndex.records;
        var results = []; // Iterate over every string in the index

        records.forEach(function (_ref2) {
          var text = _ref2.v,
              idx = _ref2.i,
              norm = _ref2.n;

          if (!isDefined(text)) {
            return;
          }

          var _searcher$searchIn = searcher.searchIn(text),
              isMatch = _searcher$searchIn.isMatch,
              score = _searcher$searchIn.score,
              indices = _searcher$searchIn.indices;

          if (isMatch) {
            results.push({
              item: text,
              idx: idx,
              matches: [{
                score: score,
                value: text,
                norm: norm,
                indices: indices
              }]
            });
          }
        });
        return results;
      }
    }, {
      key: "_searchLogical",
      value: function _searchLogical(query) {
        var _this = this;

        var expression = parse(query, this.options);

        var evaluate = function evaluate(node, item, idx) {
          if (!node.children) {
            var keyId = node.keyId,
                searcher = node.searcher;

            var matches = _this._findMatches({
              key: _this._keyStore.get(keyId),
              value: _this._myIndex.getValueForItemAtKeyId(item, keyId),
              searcher: searcher
            });

            if (matches && matches.length) {
              return [{
                idx: idx,
                item: item,
                matches: matches
              }];
            }

            return [];
          }
          /*eslint indent: [2, 2, {"SwitchCase": 1}]*/


          switch (node.operator) {
            case LogicalOperator.AND:
              {
                var res = [];

                for (var i = 0, len = node.children.length; i < len; i += 1) {
                  var child = node.children[i];
                  var result = evaluate(child, item, idx);

                  if (result.length) {
                    res.push.apply(res, _toConsumableArray(result));
                  } else {
                    return [];
                  }
                }

                return res;
              }

            case LogicalOperator.OR:
              {
                var _res = [];

                for (var _i = 0, _len = node.children.length; _i < _len; _i += 1) {
                  var _child = node.children[_i];

                  var _result = evaluate(_child, item, idx);

                  if (_result.length) {
                    _res.push.apply(_res, _toConsumableArray(_result));

                    break;
                  }
                }

                return _res;
              }
          }
        };

        var records = this._myIndex.records;
        var resultMap = {};
        var results = [];
        records.forEach(function (_ref3) {
          var item = _ref3.$,
              idx = _ref3.i;

          if (isDefined(item)) {
            var expResults = evaluate(expression, item, idx);

            if (expResults.length) {
              // Dedupe when adding
              if (!resultMap[idx]) {
                resultMap[idx] = {
                  idx: idx,
                  item: item,
                  matches: []
                };
                results.push(resultMap[idx]);
              }

              expResults.forEach(function (_ref4) {
                var _resultMap$idx$matche;

                var matches = _ref4.matches;

                (_resultMap$idx$matche = resultMap[idx].matches).push.apply(_resultMap$idx$matche, _toConsumableArray(matches));
              });
            }
          }
        });
        return results;
      }
    }, {
      key: "_searchObjectList",
      value: function _searchObjectList(query) {
        var _this2 = this;

        var searcher = createSearcher(query, this.options);
        var _this$_myIndex = this._myIndex,
            keys = _this$_myIndex.keys,
            records = _this$_myIndex.records;
        var results = []; // List is Array<Object>

        records.forEach(function (_ref5) {
          var item = _ref5.$,
              idx = _ref5.i;

          if (!isDefined(item)) {
            return;
          }

          var matches = []; // Iterate over every key (i.e, path), and fetch the value at that key

          keys.forEach(function (key, keyIndex) {
            matches.push.apply(matches, _toConsumableArray(_this2._findMatches({
              key: key,
              value: item[keyIndex],
              searcher: searcher
            })));
          });

          if (matches.length) {
            results.push({
              idx: idx,
              item: item,
              matches: matches
            });
          }
        });
        return results;
      }
    }, {
      key: "_findMatches",
      value: function _findMatches(_ref6) {
        var key = _ref6.key,
            value = _ref6.value,
            searcher = _ref6.searcher;

        if (!isDefined(value)) {
          return [];
        }

        var matches = [];

        if (isArray(value)) {
          value.forEach(function (_ref7) {
            var text = _ref7.v,
                idx = _ref7.i,
                norm = _ref7.n;

            if (!isDefined(text)) {
              return;
            }

            var _searcher$searchIn2 = searcher.searchIn(text),
                isMatch = _searcher$searchIn2.isMatch,
                score = _searcher$searchIn2.score,
                indices = _searcher$searchIn2.indices;

            if (isMatch) {
              matches.push({
                score: score,
                key: key,
                value: text,
                idx: idx,
                norm: norm,
                indices: indices
              });
            }
          });
        } else {
          var text = value.v,
              norm = value.n;

          var _searcher$searchIn3 = searcher.searchIn(text),
              isMatch = _searcher$searchIn3.isMatch,
              score = _searcher$searchIn3.score,
              indices = _searcher$searchIn3.indices;

          if (isMatch) {
            matches.push({
              score: score,
              key: key,
              value: text,
              norm: norm,
              indices: indices
            });
          }
        }

        return matches;
      }
    }]);

    return Fuse;
  }();

  Fuse.version = '6.4.6';
  Fuse.createIndex = createIndex;
  Fuse.parseIndex = parseIndex;
  Fuse.config = Config;

  {
    Fuse.parseQuery = parse;
  }

  {
    register(ExtendedSearch);
  }

  return Fuse;

});
define('skylark-choices/vendors/is-mergeable-object',[],function(){
	function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	}

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value)

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	return isMergeableObject;
});
define('skylark-choices/vendors/deepmerge',[
	"./is-mergeable-object"
],function(defaultIsMergeableObject){

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function getMergeFunction(key, options) {
		if (!options.customMerge) {
			return deepmerge
		}
		var customMerge = options.customMerge(key)
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function(symbol) {
				return target.propertyIsEnumerable(symbol)
			})
			: []
	}

	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	}

	function propertyIsOnObject(object, property) {
		try {
			return property in object
		} catch(_) {
			return false
		}
	}

	// Protects from prototype poisoning and unexpected merging up the prototype chain.
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
			&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
				&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
	}

	function mergeObject(target, source, options) {
		var destination = {}
		if (options.isMergeableObject(target)) {
			getKeys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options)
			})
		}
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) {
				return
			}

			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
				destination[key] = getMergeFunction(key, options)(target[key], source[key], options)
			} else {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options)
			}
		})
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {}
		options.arrayMerge = options.arrayMerge || defaultArrayMerge
		options.isMergeableObject = options.isMergeableObject || defaultIsMergeableObject
		// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
		// implementations can use it. The caller may not replace it.
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified

		var sourceIsArray = Array.isArray(source)
		var targetIsArray = Array.isArray(target)
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	}

	return deepmerge
});
define('skylark-choices/reducers/items',[],function () {
    'use strict';
    const defaultState = [];
    return function items(state = defaultState, action) {
        switch (action.type) {
        case 'ADD_ITEM': {
                const newState = [
                    ...state,
                    {
                        id: action.id,
                        choiceId: action.choiceId,
                        groupId: action.groupId,
                        value: action.value,
                        label: action.label,
                        active: true,
                        highlighted: false,
                        customProperties: action.customProperties,
                        placeholder: action.placeholder || false,
                        keyCode: null
                    }
                ];
                return newState.map(obj => {
                    const item = obj;
                    item.highlighted = false;
                    return item;
                });
            }
        case 'REMOVE_ITEM': {
                return state.map(obj => {
                    const item = obj;
                    if (item.id === action.id) {
                        item.active = false;
                    }
                    return item;
                });
            }
        case 'HIGHLIGHT_ITEM': {
                return state.map(obj => {
                    const item = obj;
                    if (item.id === action.id) {
                        item.highlighted = action.highlighted;
                    }
                    return item;
                });
            }
        default: {
                return state;
            }
        }
    };
});
define('skylark-choices/reducers/groups',[],function () {
    'use strict';
    const defaultState = [];
    return function groups(state = defaultState, action) {
        switch (action.type) {
        case 'ADD_GROUP': {
                return [
                    ...state,
                    {
                        id: action.id,
                        value: action.value,
                        active: action.active,
                        disabled: action.disabled
                    }
                ];
            }
        case 'CLEAR_CHOICES': {
                return [];
            }
        default: {
                return state;
            }
        }
    };
});
define('skylark-choices/reducers/choices',[],function () {
    'use strict';
    const defaultState = [];
    return function choices(state = defaultState, action) {
        switch (action.type) {
        case 'ADD_CHOICE': {
                return [
                    ...state,
                    {
                        id: action.id,
                        elementId: action.elementId,
                        groupId: action.groupId,
                        value: action.value,
                        label: action.label || action.value,
                        disabled: action.disabled || false,
                        selected: false,
                        active: true,
                        score: 9999,
                        customProperties: action.customProperties,
                        placeholder: action.placeholder || false,
                        keyCode: null
                    }
                ];
            }
        case 'ADD_ITEM': {
                if (action.activateOptions) {
                    return state.map(obj => {
                        const choice = obj;
                        choice.active = action.active;
                        return choice;
                    });
                }
                if (action.choiceId > -1) {
                    return state.map(obj => {
                        const choice = obj;
                        if (choice.id === parseInt(action.choiceId, 10)) {
                            choice.selected = true;
                        }
                        return choice;
                    });
                }
                return state;
            }
        case 'REMOVE_ITEM': {
                if (action.choiceId > -1) {
                    return state.map(obj => {
                        const choice = obj;
                        if (choice.id === parseInt(action.choiceId, 10)) {
                            choice.selected = false;
                        }
                        return choice;
                    });
                }
                return state;
            }
        case 'FILTER_CHOICES': {
                return state.map(obj => {
                    const choice = obj;
                    choice.active = action.results.some(({item, score}) => {
                        if (item.id === choice.id) {
                            choice.score = score;
                            return true;
                        }
                        return false;
                    });
                    return choice;
                });
            }
        case 'ACTIVATE_CHOICES': {
                return state.map(obj => {
                    const choice = obj;
                    choice.active = action.active;
                    return choice;
                });
            }
        case 'CLEAR_CHOICES': {
                return defaultState;
            }
        default: {
                return state;
            }
        }
    };
});
define('skylark-choices/reducers/general',[],function () {
    'use strict';
    const defaultState = { loading: false };
    const general = (state = defaultState, action) => {
        switch (action.type) {
        case 'SET_IS_LOADING': {
                return { loading: action.isLoading };
            }
        default: {
                return state;
            }
        }
    };
    return general;
});
define('skylark-choices/lib/utils',[],function () {
    'use strict';
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
    const generateChars = length => Array.from({ length }, () => getRandomNumber(0, 36).toString(36)).join('');
    const generateId = (element, prefix) => {
        let id = element.id || element.name && `${ element.name }-${ generateChars(2) }` || generateChars(4);
        id = id.replace(/(:|\.|\[|\]|,)/g, '');
        id = `${ prefix }-${ id }`;
        return id;
    };
    const getType = obj => Object.prototype.toString.call(obj).slice(8, -1);
    const isType = (type, obj) => obj !== undefined && obj !== null && getType(obj) === type;
    const wrap = (element, wrapper = document.createElement('div')) => {
        if (element.nextSibling) {
            element.parentNode.insertBefore(wrapper, element.nextSibling);
        } else {
            element.parentNode.appendChild(wrapper);
        }
        return wrapper.appendChild(element);
    };
    const getAdjacentEl = (startEl, selector, direction = 1) => {
        if (!(startEl instanceof Element) || typeof selector !== 'string') {
            return undefined;
        }
        const prop = `${ direction > 0 ? 'next' : 'previous' }ElementSibling`;
        let sibling = startEl[prop];
        while (sibling) {
            if (sibling.matches(selector)) {
                return sibling;
            }
            sibling = sibling[prop];
        }
        return sibling;
    };
    const isScrolledIntoView = (element, parent, direction = 1) => {
        if (!element) {
            return false;
        }
        let isVisible;
        if (direction > 0) {
            isVisible = parent.scrollTop + parent.offsetHeight >= element.offsetTop + element.offsetHeight;
        } else {
            isVisible = element.offsetTop >= parent.scrollTop;
        }
        return isVisible;
    };
    const sanitise = value => {
        if (typeof value !== 'string') {
            return value;
        }
        return value.replace(/&/g, '&amp;').replace(/>/g, '&rt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    };
    const strToEl = (() => {
        const tmpEl = document.createElement('div');
        return str => {
            const cleanedInput = str.trim();
            tmpEl.innerHTML = cleanedInput;
            const firldChild = tmpEl.children[0];
            while (tmpEl.firstChild) {
                tmpEl.removeChild(tmpEl.firstChild);
            }
            return firldChild;
        };
    })();
    const sortByAlpha = ({value, label = value}, {
        value: value2,
        label: label2 = value2
    }) => label.localeCompare(label2, [], {
        sensitivity: 'base',
        ignorePunctuation: true,
        numeric: true
    });
    const sortByScore = (a, b) => a.score - b.score;
    const dispatchEvent = (element, type, customArgs = null) => {
        const event = new CustomEvent(type, {
            detail: customArgs,
            bubbles: true,
            cancelable: true
        });
        return element.dispatchEvent(event);
    };
    const existsInArray = (array, value, key = 'value') => array.some(item => {
        if (typeof value === 'string') {
            return item[key] === value.trim();
        }
        return item[key] === value;
    });
    const cloneObject = obj => JSON.parse(JSON.stringify(obj));
    const diff = (a, b) => {
        const aKeys = Object.keys(a).sort();
        const bKeys = Object.keys(b).sort();
        return aKeys.filter(i => bKeys.indexOf(i) < 0);
    };
    return {
        getRandomNumber: getRandomNumber,
        generateChars: generateChars,
        generateId: generateId,
        getType: getType,
        isType: isType,
        wrap: wrap,
        getAdjacentEl: getAdjacentEl,
        isScrolledIntoView: isScrolledIntoView,
        sanitise: sanitise,
        strToEl: strToEl,
        sortByAlpha: sortByAlpha,
        sortByScore: sortByScore,
        dispatchEvent: dispatchEvent,
        existsInArray: existsInArray,
        cloneObject: cloneObject,
        diff: diff
    };
});
define('skylark-choices/reducers/index',[
    'skylark-redux',
    './items',
    './groups',
    './choices',
    './general',
    '../lib/utils'
], function (redux, items, groups, choices, general, utils) {
    'use strict';
    const appReducer = redux.combineReducers({
        items,
        groups,
        choices,
        general
    });
    const rootReducer = (passedState, action) => {
        let state = passedState;
        if (action.type === 'CLEAR_ALL') {
            state = undefined;
        } else if (action.type === 'RESET_TO') {
            return utils.cloneObject(action.state);
        }
        return appReducer(state, action);
    };
    return rootReducer;
});
define('skylark-choices/store/store',[
    'skylark-redux',
    '../reducers/index'
], function (redux, rootReducer) {
    'use strict';
    return class Store {
        constructor() {
            this._store = redux.createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
        }
        subscribe(onChange) {
            this._store.subscribe(onChange);
        }
        dispatch(action) {
            this._store.dispatch(action);
        }
        get state() {
            return this._store.getState();
        }
        get items() {
            return this.state.items;
        }
        get activeItems() {
            return this.items.filter(item => item.active === true);
        }
        get highlightedActiveItems() {
            return this.items.filter(item => item.active && item.highlighted);
        }
        get choices() {
            return this.state.choices;
        }
        get activeChoices() {
            return this.choices.filter(choice => choice.active === true);
        }
        get selectableChoices() {
            return this.choices.filter(choice => choice.disabled !== true);
        }
        get searchableChoices() {
            return this.selectableChoices.filter(choice => choice.placeholder !== true);
        }
        get placeholderChoice() {
            return [...this.choices].reverse().find(choice => choice.placeholder === true);
        }
        get groups() {
            return this.state.groups;
        }
        get activeGroups() {
            const {groups, choices} = this;
            return groups.filter(group => {
                const isActive = group.active === true && group.disabled === false;
                const hasActiveOptions = choices.some(choice => choice.active === true && choice.disabled === false);
                return isActive && hasActiveOptions;
            }, []);
        }
        isLoading() {
            return this.state.general.loading;
        }
        getChoiceById(id) {
            return this.activeChoices.find(choice => choice.id === parseInt(id, 10));
        }
        getGroupById(id) {
            return this.groups.find(group => group.id === id);
        }
    };
});
define('skylark-choices/components/dropdown',[],function () {
    'use strict';
    return class Dropdown {
        constructor({element, type, classNames}) {
            this.element = element;
            this.classNames = classNames;
            this.type = type;
            this.isActive = false;
        }
        get distanceFromTopWindow() {
            return this.element.getBoundingClientRect().bottom;
        }
        getChild(selector) {
            return this.element.querySelector(selector);
        }
        show() {
            this.element.classList.add(this.classNames.activeState);
            this.element.setAttribute('aria-expanded', 'true');
            this.isActive = true;
            return this;
        }
        hide() {
            this.element.classList.remove(this.classNames.activeState);
            this.element.setAttribute('aria-expanded', 'false');
            this.isActive = false;
            return this;
        }
    };
});
define('skylark-choices/constants',['./lib/utils'], function (utils) {
    'use strict';
    const DEFAULT_CLASSNAMES = {
        containerOuter: 'choices',
        containerInner: 'choices__inner',
        input: 'choices__input',
        inputCloned: 'choices__input--cloned',
        list: 'choices__list',
        listItems: 'choices__list--multiple',
        listSingle: 'choices__list--single',
        listDropdown: 'choices__list--dropdown',
        item: 'choices__item',
        itemSelectable: 'choices__item--selectable',
        itemDisabled: 'choices__item--disabled',
        itemChoice: 'choices__item--choice',
        placeholder: 'choices__placeholder',
        group: 'choices__group',
        groupHeading: 'choices__heading',
        button: 'choices__button',
        activeState: 'is-active',
        focusState: 'is-focused',
        openState: 'is-open',
        disabledState: 'is-disabled',
        highlightedState: 'is-highlighted',
        selectedState: 'is-selected',
        flippedState: 'is-flipped',
        loadingState: 'is-loading',
        noResults: 'has-no-results',
        noChoices: 'has-no-choices'
    };
    const DEFAULT_CONFIG = {
        items: [],
        choices: [],
        silent: false,
        renderChoiceLimit: -1,
        maxItemCount: -1,
        addItems: true,
        addItemFilter: null,
        removeItems: true,
        removeItemButton: false,
        editItems: false,
        duplicateItemsAllowed: true,
        delimiter: ',',
        paste: true,
        searchEnabled: true,
        searchChoices: true,
        searchFloor: 1,
        searchResultLimit: 4,
        searchFields: [
            'label',
            'value'
        ],
        position: 'auto',
        resetScrollPosition: true,
        shouldSort: true,
        shouldSortItems: false,
        sorter: utils.sortByAlpha,
        placeholder: true,
        placeholderValue: null,
        searchPlaceholderValue: null,
        prependValue: null,
        appendValue: null,
        renderSelectedChoices: 'auto',
        loadingText: 'Loading...',
        noResultsText: 'No results found',
        noChoicesText: 'No choices to choose from',
        itemSelectText: 'Press to select',
        uniqueItemText: 'Only unique values can be added',
        customAddItemText: 'Only values matching specific conditions can be added',
        addItemText: value => `Press Enter to add <b>"${ utils.sanitise(value) }"</b>`,
        maxItemText: maxItemCount => `Only ${ maxItemCount } values can be added`,
        valueComparer: (value1, value2) => value1 === value2,
        fuseOptions: { includeScore: true },
        callbackOnInit: null,
        callbackOnCreateTemplates: null,
        classNames: DEFAULT_CLASSNAMES
    };
    const EVENTS = {
        showDropdown: 'showDropdown',
        hideDropdown: 'hideDropdown',
        change: 'change',
        choice: 'choice',
        search: 'search',
        addItem: 'addItem',
        removeItem: 'removeItem',
        highlightItem: 'highlightItem',
        highlightChoice: 'highlightChoice'
    };
    const ACTION_TYPES = {
        ADD_CHOICE: 'ADD_CHOICE',
        FILTER_CHOICES: 'FILTER_CHOICES',
        ACTIVATE_CHOICES: 'ACTIVATE_CHOICES',
        CLEAR_CHOICES: 'CLEAR_CHOICES',
        ADD_GROUP: 'ADD_GROUP',
        ADD_ITEM: 'ADD_ITEM',
        REMOVE_ITEM: 'REMOVE_ITEM',
        HIGHLIGHT_ITEM: 'HIGHLIGHT_ITEM',
        CLEAR_ALL: 'CLEAR_ALL'
    };
    const KEY_CODES = {
        BACK_KEY: 46,
        DELETE_KEY: 8,
        ENTER_KEY: 13,
        A_KEY: 65,
        ESC_KEY: 27,
        UP_KEY: 38,
        DOWN_KEY: 40,
        PAGE_UP_KEY: 33,
        PAGE_DOWN_KEY: 34
    };
    const TEXT_TYPE = 'text';
    const SELECT_ONE_TYPE = 'select-one';
    const SELECT_MULTIPLE_TYPE = 'select-multiple';
    const SCROLLING_SPEED = 4;
    return {
        DEFAULT_CLASSNAMES: DEFAULT_CLASSNAMES,
        DEFAULT_CONFIG: DEFAULT_CONFIG,
        EVENTS: EVENTS,
        ACTION_TYPES: ACTION_TYPES,
        KEY_CODES: KEY_CODES,
        TEXT_TYPE: TEXT_TYPE,
        SELECT_ONE_TYPE: SELECT_ONE_TYPE,
        SELECT_MULTIPLE_TYPE: SELECT_MULTIPLE_TYPE,
        SCROLLING_SPEED: SCROLLING_SPEED
    };
});
define('skylark-choices/components/container',[
    '../lib/utils',
    '../constants'
], function (utils, constants) {
    'use strict';
    return class Container {
        constructor({element, type, classNames, position}) {
            this.element = element;
            this.classNames = classNames;
            this.type = type;
            this.position = position;
            this.isOpen = false;
            this.isFlipped = false;
            this.isFocussed = false;
            this.isDisabled = false;
            this.isLoading = false;
            this._onFocus = this._onFocus.bind(this);
            this._onBlur = this._onBlur.bind(this);
        }
        addEventListeners() {
            this.element.addEventListener('focus', this._onFocus);
            this.element.addEventListener('blur', this._onBlur);
        }
        removeEventListeners() {
            this.element.removeEventListener('focus', this._onFocus);
            this.element.removeEventListener('blur', this._onBlur);
        }
        shouldFlip(dropdownPos) {
            if (typeof dropdownPos !== 'number') {
                return false;
            }
            let shouldFlip = false;
            if (this.position === 'auto') {
                shouldFlip = !window.matchMedia(`(min-height: ${ dropdownPos + 1 }px)`).matches;
            } else if (this.position === 'top') {
                shouldFlip = true;
            }
            return shouldFlip;
        }
        setActiveDescendant(activeDescendantID) {
            this.element.setAttribute('aria-activedescendant', activeDescendantID);
        }
        removeActiveDescendant() {
            this.element.removeAttribute('aria-activedescendant');
        }
        open(dropdownPos) {
            this.element.classList.add(this.classNames.openState);
            this.element.setAttribute('aria-expanded', 'true');
            this.isOpen = true;
            if (this.shouldFlip(dropdownPos)) {
                this.element.classList.add(this.classNames.flippedState);
                this.isFlipped = true;
            }
        }
        close() {
            this.element.classList.remove(this.classNames.openState);
            this.element.setAttribute('aria-expanded', 'false');
            this.removeActiveDescendant();
            this.isOpen = false;
            if (this.isFlipped) {
                this.element.classList.remove(this.classNames.flippedState);
                this.isFlipped = false;
            }
        }
        focus() {
            if (!this.isFocussed) {
                this.element.focus();
            }
        }
        addFocusState() {
            this.element.classList.add(this.classNames.focusState);
        }
        removeFocusState() {
            this.element.classList.remove(this.classNames.focusState);
        }
        enable() {
            this.element.classList.remove(this.classNames.disabledState);
            this.element.removeAttribute('aria-disabled');
            if (this.type === constants.SELECT_ONE_TYPE) {
                this.element.setAttribute('tabindex', '0');
            }
            this.isDisabled = false;
        }
        disable() {
            this.element.classList.add(this.classNames.disabledState);
            this.element.setAttribute('aria-disabled', 'true');
            if (this.type === constants.SELECT_ONE_TYPE) {
                this.element.setAttribute('tabindex', '-1');
            }
            this.isDisabled = true;
        }
        wrap(element) {
            utils.wrap(element, this.element);
        }
        unwrap(element) {
            this.element.parentNode.insertBefore(element, this.element);
            this.element.parentNode.removeChild(this.element);
        }
        addLoadingState() {
            this.element.classList.add(this.classNames.loadingState);
            this.element.setAttribute('aria-busy', 'true');
            this.isLoading = true;
        }
        removeLoadingState() {
            this.element.classList.remove(this.classNames.loadingState);
            this.element.removeAttribute('aria-busy');
            this.isLoading = false;
        }
        _onFocus() {
            this.isFocussed = true;
        }
        _onBlur() {
            this.isFocussed = false;
        }
    };
});
define('skylark-choices/components/input',[
    '../lib/utils',
    '../constants'
], function (utils, constants) {
    'use strict';
    return class Input {
        constructor({element, type, classNames, preventPaste}) {
            this.element = element;
            this.type = type;
            this.classNames = classNames;
            this.preventPaste = preventPaste;
            this.isFocussed = this.element === document.activeElement;
            this.isDisabled = element.disabled;
            this._onPaste = this._onPaste.bind(this);
            this._onInput = this._onInput.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._onBlur = this._onBlur.bind(this);
        }
        set placeholder(placeholder) {
            this.element.placeholder = placeholder;
        }
        get value() {
            return utils.sanitise(this.element.value);
        }
        set value(value) {
            this.element.value = value;
        }
        addEventListeners() {
            this.element.addEventListener('paste', this._onPaste);
            this.element.addEventListener('input', this._onInput, { passive: true });
            this.element.addEventListener('focus', this._onFocus, { passive: true });
            this.element.addEventListener('blur', this._onBlur, { passive: true });
        }
        removeEventListeners() {
            this.element.removeEventListener('input', this._onInput, { passive: true });
            this.element.removeEventListener('paste', this._onPaste);
            this.element.removeEventListener('focus', this._onFocus, { passive: true });
            this.element.removeEventListener('blur', this._onBlur, { passive: true });
        }
        enable() {
            this.element.removeAttribute('disabled');
            this.isDisabled = false;
        }
        disable() {
            this.element.setAttribute('disabled', '');
            this.isDisabled = true;
        }
        focus() {
            if (!this.isFocussed) {
                this.element.focus();
            }
        }
        blur() {
            if (this.isFocussed) {
                this.element.blur();
            }
        }
        clear(setWidth = true) {
            if (this.element.value) {
                this.element.value = '';
            }
            if (setWidth) {
                this.setWidth();
            }
            return this;
        }
        setWidth() {
            const {style, value, placeholder} = this.element;
            style.minWidth = `${ placeholder.length + 1 }ch`;
            style.width = `${ value.length + 1 }ch`;
        }
        setActiveDescendant(activeDescendantID) {
            this.element.setAttribute('aria-activedescendant', activeDescendantID);
        }
        removeActiveDescendant() {
            this.element.removeAttribute('aria-activedescendant');
        }
        _onInput() {
            if (this.type !== constants.SELECT_ONE_TYPE) {
                this.setWidth();
            }
        }
        _onPaste(event) {
            if (this.preventPaste) {
                event.preventDefault();
            }
        }
        _onFocus() {
            this.isFocussed = true;
        }
        _onBlur() {
            this.isFocussed = false;
        }
    };
});
define('skylark-choices/components/list',[
    '../constants'
], function (constants) {
    'use strict';
    return class List {
        constructor({element}) {
            this.element = element;
            this.scrollPos = this.element.scrollTop;
            this.height = this.element.offsetHeight;
        }
        clear() {
            this.element.innerHTML = '';
        }
        append(node) {
            this.element.appendChild(node);
        }
        getChild(selector) {
            return this.element.querySelector(selector);
        }
        hasChildren() {
            return this.element.hasChildNodes();
        }
        scrollToTop() {
            this.element.scrollTop = 0;
        }
        scrollToChildElement(element, direction) {
            if (!element) {
                return;
            }
            const listHeight = this.element.offsetHeight;
            const listScrollPosition = this.element.scrollTop + listHeight;
            const elementHeight = element.offsetHeight;
            const elementPos = element.offsetTop + elementHeight;
            const destination = direction > 0 ? this.element.scrollTop + elementPos - listScrollPosition : element.offsetTop;
            requestAnimationFrame(() => {
                this._animateScroll(destination, direction);
            });
        }
        _scrollDown(scrollPos, strength, destination) {
            const easing = (destination - scrollPos) / strength;
            const distance = easing > 1 ? easing : 1;
            this.element.scrollTop = scrollPos + distance;
        }
        _scrollUp(scrollPos, strength, destination) {
            const easing = (scrollPos - destination) / strength;
            const distance = easing > 1 ? easing : 1;
            this.element.scrollTop = scrollPos - distance;
        }
        _animateScroll(destination, direction) {
            const strength = constants.SCROLLING_SPEED;
            const choiceListScrollTop = this.element.scrollTop;
            let continueAnimation = false;
            if (direction > 0) {
                this._scrollDown(choiceListScrollTop, strength, destination);
                if (choiceListScrollTop < destination) {
                    continueAnimation = true;
                }
            } else {
                this._scrollUp(choiceListScrollTop, strength, destination);
                if (choiceListScrollTop > destination) {
                    continueAnimation = true;
                }
            }
            if (continueAnimation) {
                requestAnimationFrame(() => {
                    this._animateScroll(destination, direction);
                });
            }
        }
    };
});
define('skylark-choices/components/wrapped-element',[
    '../lib/utils'
], function (utils) {
    'use strict';
    return class WrappedElement {
        constructor({element, classNames}) {
            this.element = element;
            this.classNames = classNames;
            if (!(element instanceof HTMLInputElement) && !(element instanceof HTMLSelectElement)) {
                throw new TypeError('Invalid element passed');
            }
            this.isDisabled = false;
        }
        get isActive() {
            return this.element.dataset.choice === 'active';
        }
        get dir() {
            return this.element.dir;
        }
        get value() {
            return this.element.value;
        }
        set value(value) {
            this.element.value = value;
        }
        conceal() {
            this.element.classList.add(this.classNames.input);
            this.element.hidden = true;
            this.element.tabIndex = -1;
            const origStyle = this.element.getAttribute('style');
            if (origStyle) {
                this.element.setAttribute('data-choice-orig-style', origStyle);
            }
            this.element.setAttribute('data-choice', 'active');
        }
        reveal() {
            this.element.classList.remove(this.classNames.input);
            this.element.hidden = false;
            this.element.removeAttribute('tabindex');
            const origStyle = this.element.getAttribute('data-choice-orig-style');
            if (origStyle) {
                this.element.removeAttribute('data-choice-orig-style');
                this.element.setAttribute('style', origStyle);
            } else {
                this.element.removeAttribute('style');
            }
            this.element.removeAttribute('data-choice');
            this.element.value = this.element.value;
        }
        enable() {
            this.element.removeAttribute('disabled');
            this.element.disabled = false;
            this.isDisabled = false;
        }
        disable() {
            this.element.setAttribute('disabled', '');
            this.element.disabled = true;
            this.isDisabled = true;
        }
        triggerEvent(eventType, data) {
            utils.dispatchEvent(this.element, eventType, data);
        }
    };
});
define('skylark-choices/components/wrapped-input',[
    './wrapped-element'
], function (WrappedElement) {
    'use strict';
    return class WrappedInput extends WrappedElement {
        constructor({element, classNames, delimiter}) {
            super({
                element,
                classNames
            });
            this.delimiter = delimiter;
        }
        get value() {
            return this.element.value;
        }
        set value(items) {
            const itemValues = items.map(({value}) => value);
            const joinedValues = itemValues.join(this.delimiter);
            this.element.setAttribute('value', joinedValues);
            this.element.value = joinedValues;
        }
    };
});
define('skylark-choices/components/wrapped-select',[
    './wrapped-element'
], function (WrappedElement) {
    'use strict';
    return class WrappedSelect extends WrappedElement {
        constructor({element, classNames, template}) {
            super({
                element,
                classNames
            });
            this.template = template;
        }
        get placeholderOption() {
            return this.element.querySelector('option[value=""]') || this.element.querySelector('option[placeholder]');
        }
        get optionGroups() {
            return Array.from(this.element.getElementsByTagName('OPTGROUP'));
        }
        get options() {
            return Array.from(this.element.options);
        }
        set options(options) {
            const fragment = document.createDocumentFragment();
            const addOptionToFragment = data => {
                const option = this.template(data);
                fragment.appendChild(option);
            };
            options.forEach(optionData => addOptionToFragment(optionData));
            this.appendDocFragment(fragment);
        }
        appendDocFragment(fragment) {
            this.element.innerHTML = '';
            this.element.appendChild(fragment);
        }
    };
});
define('skylark-choices/components/index',[
    './dropdown',
    './container',
    './input',
    './list',
    './wrapped-input',
    './wrapped-select'
], function (Dropdown, Container, Input, List, WrappedInput, WrappedSelect) {
    'use strict';
    return {
        Dropdown,
        Container,
        Input,
        List,
        WrappedInput,
        WrappedSelect
    };
});
define('skylark-choices/templates',[],function () {
    'use strict';
    const TEMPLATES = {
        containerOuter({containerOuter}, dir, isSelectElement, isSelectOneElement, searchEnabled, passedElementType) {
            const div = Object.assign(document.createElement('div'), { className: containerOuter });
            div.dataset.type = passedElementType;
            if (dir) {
                div.dir = dir;
            }
            if (isSelectOneElement) {
                div.tabIndex = 0;
            }
            if (isSelectElement) {
                div.setAttribute('role', searchEnabled ? 'combobox' : 'listbox');
                if (searchEnabled) {
                    div.setAttribute('aria-autocomplete', 'list');
                }
            }
            div.setAttribute('aria-haspopup', 'true');
            div.setAttribute('aria-expanded', 'false');
            return div;
        },
        containerInner({containerInner}) {
            return Object.assign(document.createElement('div'), { className: containerInner });
        },
        itemList({list, listSingle, listItems}, isSelectOneElement) {
            return Object.assign(document.createElement('div'), { className: `${ list } ${ isSelectOneElement ? listSingle : listItems }` });
        },
        placeholder({placeholder}, value) {
            return Object.assign(document.createElement('div'), {
                className: placeholder,
                innerHTML: value
            });
        },
        item({item, button, highlightedState, itemSelectable, placeholder}, {
            id,
            value,
            label,
            customProperties,
            active,
            disabled,
            highlighted,
            placeholder: isPlaceholder
        }, removeItemButton) {
            const div = Object.assign(document.createElement('div'), {
                className: item,
                innerHTML: label
            });
            Object.assign(div.dataset, {
                item: '',
                id,
                value,
                customProperties
            });
            if (active) {
                div.setAttribute('aria-selected', 'true');
            }
            if (disabled) {
                div.setAttribute('aria-disabled', 'true');
            }
            if (isPlaceholder) {
                div.classList.add(placeholder);
            }
            div.classList.add(highlighted ? highlightedState : itemSelectable);
            if (removeItemButton) {
                if (disabled) {
                    div.classList.remove(itemSelectable);
                }
                div.dataset.deletable = '';
                const REMOVE_ITEM_TEXT = 'Remove item';
                const removeButton = Object.assign(document.createElement('button'), {
                    type: 'button',
                    className: button,
                    innerHTML: REMOVE_ITEM_TEXT
                });
                removeButton.setAttribute('aria-label', `${ REMOVE_ITEM_TEXT }: '${ value }'`);
                removeButton.dataset.button = '';
                div.appendChild(removeButton);
            }
            return div;
        },
        choiceList({list}, isSelectOneElement) {
            const div = Object.assign(document.createElement('div'), { className: list });
            if (!isSelectOneElement) {
                div.setAttribute('aria-multiselectable', 'true');
            }
            div.setAttribute('role', 'listbox');
            return div;
        },
        choiceGroup({group, groupHeading, itemDisabled}, {id, value, disabled}) {
            const div = Object.assign(document.createElement('div'), { className: `${ group } ${ disabled ? itemDisabled : '' }` });
            div.setAttribute('role', 'group');
            Object.assign(div.dataset, {
                group: '',
                id,
                value
            });
            if (disabled) {
                div.setAttribute('aria-disabled', 'true');
            }
            div.appendChild(Object.assign(document.createElement('div'), {
                className: groupHeading,
                innerHTML: value
            }));
            return div;
        },
        choice({item, itemChoice, itemSelectable, selectedState, itemDisabled, placeholder}, {
            id,
            value,
            label,
            groupId,
            elementId,
            disabled: isDisabled,
            selected: isSelected,
            placeholder: isPlaceholder
        }, selectText) {
            const div = Object.assign(document.createElement('div'), {
                id: elementId,
                innerHTML: label,
                className: `${ item } ${ itemChoice }`
            });
            if (isSelected) {
                div.classList.add(selectedState);
            }
            if (isPlaceholder) {
                div.classList.add(placeholder);
            }
            div.setAttribute('role', groupId > 0 ? 'treeitem' : 'option');
            Object.assign(div.dataset, {
                choice: '',
                id,
                value,
                selectText
            });
            if (isDisabled) {
                div.classList.add(itemDisabled);
                div.dataset.choiceDisabled = '';
                div.setAttribute('aria-disabled', 'true');
            } else {
                div.classList.add(itemSelectable);
                div.dataset.choiceSelectable = '';
            }
            return div;
        },
        input({input, inputCloned}, placeholderValue) {
            const inp = Object.assign(document.createElement('input'), {
                type: 'text',
                className: `${ input } ${ inputCloned }`,
                autocomplete: 'off',
                autocapitalize: 'off',
                spellcheck: false
            });
            inp.setAttribute('role', 'textbox');
            inp.setAttribute('aria-autocomplete', 'list');
            inp.setAttribute('aria-label', placeholderValue);
            return inp;
        },
        dropdown({list, listDropdown}) {
            const div = document.createElement('div');
            div.classList.add(list, listDropdown);
            div.setAttribute('aria-expanded', 'false');
            return div;
        },
        notice({item, itemChoice, noResults, noChoices}, innerHTML, type = '') {
            const classes = [
                item,
                itemChoice
            ];
            if (type === 'no-choices') {
                classes.push(noChoices);
            } else if (type === 'no-results') {
                classes.push(noResults);
            }
            return Object.assign(document.createElement('div'), {
                innerHTML,
                className: classes.join(' ')
            });
        },
        option({label, value, customProperties, active, disabled}) {
            const opt = new Option(label, value, false, active);
            if (customProperties) {
                opt.dataset.customProperties = customProperties;
            }
            opt.disabled = disabled;
            return opt;
        }
    };
    return TEMPLATES;
});
define('skylark-choices/actions/choices',[
    '../constants'
], function (constants) {
    'use strict';
    const addChoice = ({
        value, 
        label, 
        id, 
        groupId, 
        disabled, 
        elementId, 
        customProperties, 
        placeholder, 
        keyCode
    }) => ({
        type: constants.ACTION_TYPES.ADD_CHOICE,
        value,
        label,
        id,
        groupId,
        disabled,
        elementId,
        customProperties,
        placeholder,
        keyCode
    });
    const filterChoices = results => ({
        type: constants.ACTION_TYPES.FILTER_CHOICES,
        results
    });
    const activateChoices = (active = true) => ({
        type: constants.ACTION_TYPES.ACTIVATE_CHOICES,
        active
    });
    const clearChoices = () => ({ type: constants.ACTION_TYPES.CLEAR_CHOICES });
    return {
        addChoice: addChoice,
        filterChoices: filterChoices,
        activateChoices: activateChoices,
        clearChoices: clearChoices
    };
});
define('skylark-choices/actions/items',[
    '../constants'
], function (constants) {
    'use strict';
    const addItem = ({value, label, id, choiceId, groupId, customProperties, placeholder, keyCode}) => ({
        type: constants.ACTION_TYPES.ADD_ITEM,
        value,
        label,
        id,
        choiceId,
        groupId,
        customProperties,
        placeholder,
        keyCode
    });
    const removeItem = (id, choiceId) => ({
        type: constants.ACTION_TYPES.REMOVE_ITEM,
        id,
        choiceId
    });
    const highlightItem = (id, highlighted) => ({
        type: constants.ACTION_TYPES.HIGHLIGHT_ITEM,
        id,
        highlighted
    });
    return {
        addItem: addItem,
        removeItem: removeItem,
        highlightItem: highlightItem
    };
});
define('skylark-choices/actions/groups',['../constants'], function (constants) {
    'use strict';
    const addGroup = ({value, id, active, disabled}) => ({
        type: constants.ACTION_TYPES.ADD_GROUP,
        value,
        id,
        active,
        disabled
    });
    return { addGroup: addGroup };
});
define('skylark-choices/actions/misc',[],function () {
    'use strict';
    const clearAll = () => ({ type: 'CLEAR_ALL' });
    const resetTo = state => ({
        type: 'RESET_TO',
        state
    });
    const setIsLoading = isLoading => ({
        type: 'SET_IS_LOADING',
        isLoading
    });
    return {
        clearAll: clearAll,
        resetTo: resetTo,
        setIsLoading: setIsLoading
    };
});
define('skylark-choices/choices',[
    './vendors/fuse',
    './vendors/deepmerge',
    './store/store',
    './components/index',
    './constants',
    './templates',
    './actions/choices',
    './actions/items',
    './actions/groups',
    './actions/misc',
    './lib/utils'
], function (Fuse, merge, Store, components, constants, TEMPLATES, actionsChoices, items, groups, misc, h) {
    'use strict';
    const IS_IE11 = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
    const USER_DEFAULTS = {};
    class Choices {
        static get defaults() {
            return Object.preventExtensions({
                get options() {
                    return USER_DEFAULTS;
                },
                get templates() {
                    return TEMPLATES;
                }
            });
        }
        constructor(element = '[data-choice]', userConfig = {}) {
            this.config = merge.all([
                constants.DEFAULT_CONFIG,
                Choices.defaults.options,
                userConfig
            ], { arrayMerge: (_, sourceArray) => [...sourceArray] });
            const invalidConfigOptions = h.diff(this.config, constants.DEFAULT_CONFIG);
            if (invalidConfigOptions.length) {
                console.warn('Unknown config option(s) passed', invalidConfigOptions.join(', '));
            }
            const passedElement = typeof element === 'string' ? document.querySelector(element) : element;
            if (!(passedElement instanceof HTMLInputElement || passedElement instanceof HTMLSelectElement)) {
                throw TypeError('Expected one of the following types text|select-one|select-multiple');
            }
            this._isTextElement = passedElement.type === constants.TEXT_TYPE;
            this._isSelectOneElement = passedElement.type === constants.SELECT_ONE_TYPE;
            this._isSelectMultipleElement = passedElement.type === constants.SELECT_MULTIPLE_TYPE;
            this._isSelectElement = this._isSelectOneElement || this._isSelectMultipleElement;
            this.config.searchEnabled = this._isSelectMultipleElement || this.config.searchEnabled;
            if (![
                    'auto',
                    'always'
                ].includes(this.config.renderSelectedChoices)) {
                this.config.renderSelectedChoices = 'auto';
            }
            if (userConfig.addItemFilter && typeof userConfig.addItemFilter !== 'function') {
                const re = userConfig.addItemFilter instanceof RegExp ? userConfig.addItemFilter : new RegExp(userConfig.addItemFilter);
                this.config.addItemFilter = re.test.bind(re);
            }
            if (this._isTextElement) {
                this.passedElement = new components.WrappedInput({
                    element: passedElement,
                    classNames: this.config.classNames,
                    delimiter: this.config.delimiter
                });
            } else {
                this.passedElement = new components.WrappedSelect({
                    element: passedElement,
                    classNames: this.config.classNames,
                    template: data => this._templates.option(data)
                });
            }
            this.initialised = false;
            this._store = new Store();
            this._initialState = {};
            this._currentState = {};
            this._prevState = {};
            this._currentValue = '';
            this._canSearch = this.config.searchEnabled;
            this._isScrollingOnIe = false;
            this._highlightPosition = 0;
            this._wasTap = true;
            this._placeholderValue = this._generatePlaceholderValue();
            this._baseId = h.generateId(this.passedElement.element, 'choices-');
            this._direction = this.passedElement.dir;
            if (!this._direction) {
                const {direction: elementDirection} = window.getComputedStyle(this.passedElement.element);
                const {direction: documentDirection} = window.getComputedStyle(document.documentElement);
                if (elementDirection !== documentDirection) {
                    this._direction = elementDirection;
                }
            }
            this._idNames = { itemChoice: 'item-choice' };
            this._presetGroups = this.passedElement.optionGroups;
            this._presetOptions = this.passedElement.options;
            this._presetChoices = this.config.choices;
            this._presetItems = this.config.items;
            if (this.passedElement.value) {
                this._presetItems = this._presetItems.concat(this.passedElement.value.split(this.config.delimiter));
            }
            if (this.passedElement.options) {
                this.passedElement.options.forEach(o => {
                    this._presetChoices.push({
                        value: o.value,
                        label: o.innerHTML,
                        selected: o.selected,
                        disabled: o.disabled || o.parentNode.disabled,
                        placeholder: o.value === '' || o.hasAttribute('placeholder'),
                        customProperties: o.getAttribute('data-custom-properties')
                    });
                });
            }
            this._render = this._render.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._onBlur = this._onBlur.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this);
            this._onKeyDown = this._onKeyDown.bind(this);
            this._onClick = this._onClick.bind(this);
            this._onTouchMove = this._onTouchMove.bind(this);
            this._onTouchEnd = this._onTouchEnd.bind(this);
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseOver = this._onMouseOver.bind(this);
            this._onFormReset = this._onFormReset.bind(this);
            this._onAKey = this._onAKey.bind(this);
            this._onEnterKey = this._onEnterKey.bind(this);
            this._onEscapeKey = this._onEscapeKey.bind(this);
            this._onDirectionKey = this._onDirectionKey.bind(this);
            this._onDeleteKey = this._onDeleteKey.bind(this);
            if (this.passedElement.isActive) {
                if (!this.config.silent) {
                    console.warn('Trying to initialise Choices on element already initialised');
                }
                this.initialised = true;
                return;
            }
            this.init();
        }
        init() {
            if (this.initialised) {
                return;
            }
            this._createTemplates();
            this._createElements();
            this._createStructure();
            this._initialState = h.cloneObject(this._store.state);
            this._store.subscribe(this._render);
            this._render();
            this._addEventListeners();
            const shouldDisable = !this.config.addItems || this.passedElement.element.hasAttribute('disabled');
            if (shouldDisable) {
                this.disable();
            }
            this.initialised = true;
            const {callbackOnInit} = this.config;
            if (callbackOnInit && typeof callbackOnInit === 'function') {
                callbackOnInit.call(this);
            }
        }
        destroy() {
            if (!this.initialised) {
                return;
            }
            this._removeEventListeners();
            this.passedElement.reveal();
            this.containerOuter.unwrap(this.passedElement.element);
            this.clearStore();
            if (this._isSelectElement) {
                this.passedElement.options = this._presetOptions;
            }
            this._templates = null;
            this.initialised = false;
        }
        enable() {
            if (this.passedElement.isDisabled) {
                this.passedElement.enable();
            }
            if (this.containerOuter.isDisabled) {
                this._addEventListeners();
                this.input.enable();
                this.containerOuter.enable();
            }
            return this;
        }
        disable() {
            if (!this.passedElement.isDisabled) {
                this.passedElement.disable();
            }
            if (!this.containerOuter.isDisabled) {
                this._removeEventListeners();
                this.input.disable();
                this.containerOuter.disable();
            }
            return this;
        }
        highlightItem(item, runEvent = true) {
            if (!item) {
                return this;
            }
            const {id, groupId = -1, value = '', label = ''} = item;
            const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
            this._store.dispatch(items.highlightItem(id, true));
            if (runEvent) {
                this.passedElement.triggerEvent(constants.EVENTS.highlightItem, {
                    id,
                    value,
                    label,
                    groupValue: group && group.value ? group.value : null
                });
            }
            return this;
        }
        unhighlightItem(item) {
            if (!item) {
                return this;
            }
            const {id, groupId = -1, value = '', label = ''} = item;
            const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
            this._store.dispatch(items.highlightItem(id, false));
            this.passedElement.triggerEvent(constants.EVENTS.highlightItem, {
                id,
                value,
                label,
                groupValue: group && group.value ? group.value : null
            });
            return this;
        }
        highlightAll() {
            this._store.items.forEach(item => this.highlightItem(item));
            return this;
        }
        unhighlightAll() {
            this._store.items.forEach(item => this.unhighlightItem(item));
            return this;
        }
        removeActiveItemsByValue(value) {
            this._store.activeItems.filter(item => item.value === value).forEach(item => this._removeItem(item));
            return this;
        }
        removeActiveItems(excludedId) {
            this._store.activeItems.filter(({id}) => id !== excludedId).forEach(item => this._removeItem(item));
            return this;
        }
        removeHighlightedItems(runEvent = false) {
            this._store.highlightedActiveItems.forEach(item => {
                this._removeItem(item);
                if (runEvent) {
                    this._triggerChange(item.value);
                }
            });
            return this;
        }
        showDropdown(preventInputFocus) {
            if (this.dropdown.isActive) {
                return this;
            }
            requestAnimationFrame(() => {
                this.dropdown.show();
                this.containerOuter.open(this.dropdown.distanceFromTopWindow);
                if (!preventInputFocus && this._canSearch) {
                    this.input.focus();
                }
                this.passedElement.triggerEvent(constants.EVENTS.showDropdown, {});
            });
            return this;
        }
        hideDropdown(preventInputBlur) {
            if (!this.dropdown.isActive) {
                return this;
            }
            requestAnimationFrame(() => {
                this.dropdown.hide();
                this.containerOuter.close();
                if (!preventInputBlur && this._canSearch) {
                    this.input.removeActiveDescendant();
                    this.input.blur();
                }
                this.passedElement.triggerEvent(constants.EVENTS.hideDropdown, {});
            });
            return this;
        }
        getValue(valueOnly = false) {
            const values = this._store.activeItems.reduce((selectedItems, item) => {
                const itemValue = valueOnly ? item.value : item;
                selectedItems.push(itemValue);
                return selectedItems;
            }, []);
            return this._isSelectOneElement ? values[0] : values;
        }
        setValue(items) {
            if (!this.initialised) {
                return this;
            }
            items.forEach(value => this._setChoiceOrItem(value));
            return this;
        }
        setChoiceByValue(value) {
            if (!this.initialised || this._isTextElement) {
                return this;
            }
            const choiceValue = Array.isArray(value) ? value : [value];
            choiceValue.forEach(val => this._findAndSelectChoiceByValue(val));
            return this;
        }
        setChoices(choicesArrayOrFetcher = [], value = 'value', label = 'label', replaceChoices = false) {
            if (!this.initialised) {
                throw new ReferenceError(`setChoices was called on a non-initialized instance of Choices`);
            }
            if (!this._isSelectElement) {
                throw new TypeError(`setChoices can't be used with INPUT based Choices`);
            }
            if (typeof value !== 'string' || !value) {
                throw new TypeError(`value parameter must be a name of 'value' field in passed objects`);
            }
            if (replaceChoices) {
                this.clearChoices();
            }
            if (typeof choicesArrayOrFetcher === 'function') {
                const fetcher = choicesArrayOrFetcher(this);
                if (typeof Promise === 'function' && fetcher instanceof Promise) {
                    return new Promise(resolve => requestAnimationFrame(resolve)).then(() => this._handleLoadingState(true)).then(() => fetcher).then(data => this.setChoices(data, value, label, replaceChoices)).catch(err => {
                        if (!this.config.silent) {
                            console.error(err);
                        }
                    }).then(() => this._handleLoadingState(false)).then(() => this);
                }
                if (!Array.isArray(fetcher)) {
                    throw new TypeError(`.setChoices first argument function must return either array of choices or Promise, got: ${ typeof fetcher }`);
                }
                return this.setChoices(fetcher, value, label, false);
            }
            if (!Array.isArray(choicesArrayOrFetcher)) {
                throw new TypeError(`.setChoices must be called either with array of choices with a function resulting into Promise of array of choices`);
            }
            this.containerOuter.removeLoadingState();
            this._startLoading();
            choicesArrayOrFetcher.forEach(groupOrChoice => {
                if (groupOrChoice.choices) {
                    this._addGroup({
                        id: parseInt(groupOrChoice.id, 10) || null,
                        group: groupOrChoice,
                        valueKey: value,
                        labelKey: label
                    });
                } else {
                    this._addChoice({
                        value: groupOrChoice[value],
                        label: groupOrChoice[label],
                        isSelected: groupOrChoice.selected,
                        isDisabled: groupOrChoice.disabled,
                        customProperties: groupOrChoice.customProperties,
                        placeholder: groupOrChoice.placeholder
                    });
                }
            });
            this._stopLoading();
            return this;
        }
        clearChoices() {
            this._store.dispatch(actionsChoices.clearChoices());
            return this;
        }
        clearStore() {
            this._store.dispatch(misc.clearAll());
            return this;
        }
        clearInput() {
            const shouldSetInputWidth = !this._isSelectOneElement;
            this.input.clear(shouldSetInputWidth);
            if (!this._isTextElement && this._canSearch) {
                this._isSearching = false;
                this._store.dispatch(d.activateChoices(true));
            }
            return this;
        }
        _render() {
            if (this._store.isLoading()) {
                return;
            }
            this._currentState = this._store.state;
            const stateChanged = this._currentState.choices !== this._prevState.choices || this._currentState.groups !== this._prevState.groups || this._currentState.items !== this._prevState.items;
            const shouldRenderChoices = this._isSelectElement;
            const shouldRenderItems = this._currentState.items !== this._prevState.items;
            if (!stateChanged) {
                return;
            }
            if (shouldRenderChoices) {
                this._renderChoices();
            }
            if (shouldRenderItems) {
                this._renderItems();
            }
            this._prevState = this._currentState;
        }
        _renderChoices() {
            const {activeGroups, activeChoices} = this._store;
            let choiceListFragment = document.createDocumentFragment();
            this.choiceList.clear();
            if (this.config.resetScrollPosition) {
                requestAnimationFrame(() => this.choiceList.scrollToTop());
            }
            if (activeGroups.length >= 1 && !this._isSearching) {
                const activePlaceholders = activeChoices.filter(activeChoice => activeChoice.placeholder === true && activeChoice.groupId === -1);
                if (activePlaceholders.length >= 1) {
                    choiceListFragment = this._createChoicesFragment(activePlaceholders, choiceListFragment);
                }
                choiceListFragment = this._createGroupsFragment(activeGroups, activeChoices, choiceListFragment);
            } else if (activeChoices.length >= 1) {
                choiceListFragment = this._createChoicesFragment(activeChoices, choiceListFragment);
            }
            if (choiceListFragment.childNodes && choiceListFragment.childNodes.length > 0) {
                const {activeItems} = this._store;
                const canAddItem = this._canAddItem(activeItems, this.input.value);
                if (canAddItem.response) {
                    this.choiceList.append(choiceListFragment);
                    this._highlightChoice();
                } else {
                    this.choiceList.append(this._getTemplate('notice', canAddItem.notice));
                }
            } else {
                let dropdownItem;
                let notice;
                if (this._isSearching) {
                    notice = typeof this.config.noResultsText === 'function' ? this.config.noResultsText() : this.config.noResultsText;
                    dropdownItem = this._getTemplate('notice', notice, 'no-results');
                } else {
                    notice = typeof this.config.noChoicesText === 'function' ? this.config.noChoicesText() : this.config.noChoicesText;
                    dropdownItem = this._getTemplate('notice', notice, 'no-choices');
                }
                this.choiceList.append(dropdownItem);
            }
        }
        _renderItems() {
            const activeItems = this._store.activeItems || [];
            this.itemList.clear();
            const itemListFragment = this._createItemsFragment(activeItems);
            if (itemListFragment.childNodes) {
                this.itemList.append(itemListFragment);
            }
        }
        _createGroupsFragment(groups, choices, fragment = document.createDocumentFragment()) {
            const getGroupChoices = group => choices.filter(choice => {
                if (this._isSelectOneElement) {
                    return choice.groupId === group.id;
                }
                return choice.groupId === group.id && (this.config.renderSelectedChoices === 'always' || !choice.selected);
            });
            if (this.config.shouldSort) {
                groups.sort(this.config.sorter);
            }
            groups.forEach(group => {
                const groupChoices = getGroupChoices(group);
                if (groupChoices.length >= 1) {
                    const dropdownGroup = this._getTemplate('choiceGroup', group);
                    fragment.appendChild(dropdownGroup);
                    this._createChoicesFragment(groupChoices, fragment, true);
                }
            });
            return fragment;
        }
        _createChoicesFragment(choices, fragment = document.createDocumentFragment(), withinGroup = false) {
            const {renderSelectedChoices, searchResultLimit, renderChoiceLimit} = this.config;
            const filter = this._isSearching ? h.sortByScore : this.config.sorter;
            const appendChoice = choice => {
                const shouldRender = renderSelectedChoices === 'auto' ? this._isSelectOneElement || !choice.selected : true;
                if (shouldRender) {
                    const dropdownItem = this._getTemplate('choice', choice, this.config.itemSelectText);
                    fragment.appendChild(dropdownItem);
                }
            };
            let rendererableChoices = choices;
            if (renderSelectedChoices === 'auto' && !this._isSelectOneElement) {
                rendererableChoices = choices.filter(choice => !choice.selected);
            }
            const {placeholderChoices, normalChoices} = rendererableChoices.reduce((acc, choice) => {
                if (choice.placeholder) {
                    acc.placeholderChoices.push(choice);
                } else {
                    acc.normalChoices.push(choice);
                }
                return acc;
            }, {
                placeholderChoices: [],
                normalChoices: []
            });
            if (this.config.shouldSort || this._isSearching) {
                normalChoices.sort(filter);
            }
            let choiceLimit = rendererableChoices.length;
            const sortedChoices = this._isSelectOneElement ? [
                ...placeholderChoices,
                ...normalChoices
            ] : normalChoices;
            if (this._isSearching) {
                choiceLimit = searchResultLimit;
            } else if (renderChoiceLimit && renderChoiceLimit > 0 && !withinGroup) {
                choiceLimit = renderChoiceLimit;
            }
            for (let i = 0; i < choiceLimit; i += 1) {
                if (sortedChoices[i]) {
                    appendChoice(sortedChoices[i]);
                }
            }
            return fragment;
        }
        _createItemsFragment(items, fragment = document.createDocumentFragment()) {
            const {shouldSortItems, sorter, removeItemButton} = this.config;
            if (shouldSortItems && !this._isSelectOneElement) {
                items.sort(sorter);
            }
            if (this._isTextElement) {
                this.passedElement.value = items;
            } else {
                this.passedElement.options = items;
            }
            const addItemToFragment = item => {
                const listItem = this._getTemplate('item', item, removeItemButton);
                fragment.appendChild(listItem);
            };
            items.forEach(addItemToFragment);
            return fragment;
        }
        _triggerChange(value) {
            if (value === undefined || value === null) {
                return;
            }
            this.passedElement.triggerEvent(constants.EVENTS.change, { value });
        }
        _selectPlaceholderChoice() {
            const {placeholderChoice} = this._store;
            if (placeholderChoice) {
                this._addItem({
                    value: placeholderChoice.value,
                    label: placeholderChoice.label,
                    choiceId: placeholderChoice.id,
                    groupId: placeholderChoice.groupId,
                    placeholder: placeholderChoice.placeholder
                });
                this._triggerChange(placeholderChoice.value);
            }
        }
        _handleButtonAction(activeItems, element) {
            if (!activeItems || !element || !this.config.removeItems || !this.config.removeItemButton) {
                return;
            }
            const itemId = element.parentNode.getAttribute('data-id');
            const itemToRemove = activeItems.find(item => item.id === parseInt(itemId, 10));
            this._removeItem(itemToRemove);
            this._triggerChange(itemToRemove.value);
            if (this._isSelectOneElement) {
                this._selectPlaceholderChoice();
            }
        }
        _handleItemAction(activeItems, element, hasShiftKey = false) {
            if (!activeItems || !element || !this.config.removeItems || this._isSelectOneElement) {
                return;
            }
            const passedId = element.getAttribute('data-id');
            activeItems.forEach(item => {
                if (item.id === parseInt(passedId, 10) && !item.highlighted) {
                    this.highlightItem(item);
                } else if (!hasShiftKey && item.highlighted) {
                    this.unhighlightItem(item);
                }
            });
            this.input.focus();
        }
        _handleChoiceAction(activeItems, element) {
            if (!activeItems || !element) {
                return;
            }
            const {id} = element.dataset;
            const choice = this._store.getChoiceById(id);
            if (!choice) {
                return;
            }
            const passedKeyCode = activeItems[0] && activeItems[0].keyCode ? activeItems[0].keyCode : null;
            const hasActiveDropdown = this.dropdown.isActive;
            choice.keyCode = passedKeyCode;
            this.passedElement.triggerEvent(constants.EVENTS.choice, { choice });
            if (!choice.selected && !choice.disabled) {
                const canAddItem = this._canAddItem(activeItems, choice.value);
                if (canAddItem.response) {
                    this._addItem({
                        value: choice.value,
                        label: choice.label,
                        choiceId: choice.id,
                        groupId: choice.groupId,
                        customProperties: choice.customProperties,
                        placeholder: choice.placeholder,
                        keyCode: choice.keyCode
                    });
                    this._triggerChange(choice.value);
                }
            }
            this.clearInput();
            if (hasActiveDropdown && this._isSelectOneElement) {
                this.hideDropdown(true);
                this.containerOuter.focus();
            }
        }
        _handleBackspace(activeItems) {
            if (!this.config.removeItems || !activeItems) {
                return;
            }
            const lastItem = activeItems[activeItems.length - 1];
            const hasHighlightedItems = activeItems.some(item => item.highlighted);
            if (this.config.editItems && !hasHighlightedItems && lastItem) {
                this.input.value = lastItem.value;
                this.input.setWidth();
                this._removeItem(lastItem);
                this._triggerChange(lastItem.value);
            } else {
                if (!hasHighlightedItems) {
                    this.highlightItem(lastItem, false);
                }
                this.removeHighlightedItems(true);
            }
        }
        _startLoading() {
            this._store.dispatch(misc.setIsLoading(true));
        }
        _stopLoading() {
            this._store.dispatch(misc.setIsLoading(false));
        }
        _handleLoadingState(setLoading = true) {
            let placeholderItem = this.itemList.getChild(`.${ this.config.classNames.placeholder }`);
            if (setLoading) {
                this.disable();
                this.containerOuter.addLoadingState();
                if (this._isSelectOneElement) {
                    if (!placeholderItem) {
                        placeholderItem = this._getTemplate('placeholder', this.config.loadingText);
                        this.itemList.append(placeholderItem);
                    } else {
                        placeholderItem.innerHTML = this.config.loadingText;
                    }
                } else {
                    this.input.placeholder = this.config.loadingText;
                }
            } else {
                this.enable();
                this.containerOuter.removeLoadingState();
                if (this._isSelectOneElement) {
                    placeholderItem.innerHTML = this._placeholderValue || '';
                } else {
                    this.input.placeholder = this._placeholderValue || '';
                }
            }
        }
        _handleSearch(value) {
            if (!value || !this.input.isFocussed) {
                return;
            }
            const {choices} = this._store;
            const {searchFloor, searchChoices} = this.config;
            const hasUnactiveChoices = choices.some(option => !option.active);
            if (value && value.length >= searchFloor) {
                const resultCount = searchChoices ? this._searchChoices(value) : 0;
                this.passedElement.triggerEvent(constants.EVENTS.search, {
                    value,
                    resultCount
                });
            } else if (hasUnactiveChoices) {
                this._isSearching = false;
                this._store.dispatch(d.activateChoices(true));
            }
        }
        _canAddItem(activeItems, value) {
            let canAddItem = true;
            let notice = typeof this.config.addItemText === 'function' ? this.config.addItemText(value) : this.config.addItemText;
            if (!this._isSelectOneElement) {
                const isDuplicateValue = h.existsInArray(activeItems, value);
                if (this.config.maxItemCount > 0 && this.config.maxItemCount <= activeItems.length) {
                    canAddItem = false;
                    notice = typeof this.config.maxItemText === 'function' ? this.config.maxItemText(this.config.maxItemCount) : this.config.maxItemText;
                }
                if (!this.config.duplicateItemsAllowed && isDuplicateValue && canAddItem) {
                    canAddItem = false;
                    notice = typeof this.config.uniqueItemText === 'function' ? this.config.uniqueItemText(value) : this.config.uniqueItemText;
                }
                if (this._isTextElement && this.config.addItems && canAddItem && typeof this.config.addItemFilter === 'function' && !this.config.addItemFilter(value)) {
                    canAddItem = false;
                    notice = typeof this.config.customAddItemText === 'function' ? this.config.customAddItemText(value) : this.config.customAddItemText;
                }
            }
            return {
                response: canAddItem,
                notice
            };
        }
        _searchChoices(value) {
            const newValue = typeof value === 'string' ? value.trim() : value;
            const currentValue = typeof this._currentValue === 'string' ? this._currentValue.trim() : this._currentValue;
            if (newValue.length < 1 && newValue === `${ currentValue } `) {
                return 0;
            }
            const haystack = this._store.searchableChoices;
            const needle = newValue;
            const keys = [...this.config.searchFields];
            const options = Object.assign(this.config.fuseOptions, { keys });
            const fuse = new Fuse(haystack, options);
            const results = fuse.search(needle);
            this._currentValue = newValue;
            this._highlightPosition = 0;
            this._isSearching = true;
            this._store.dispatch(actionsChoices.filterChoices(results));
            return results.length;
        }
        _addEventListeners() {
            const {documentElement} = document;
            documentElement.addEventListener('touchend', this._onTouchEnd, true);
            this.containerOuter.element.addEventListener('keydown', this._onKeyDown, true);
            this.containerOuter.element.addEventListener('mousedown', this._onMouseDown, true);
            documentElement.addEventListener('click', this._onClick, { passive: true });
            documentElement.addEventListener('touchmove', this._onTouchMove, { passive: true });
            this.dropdown.element.addEventListener('mouseover', this._onMouseOver, { passive: true });
            if (this._isSelectOneElement) {
                this.containerOuter.element.addEventListener('focus', this._onFocus, { passive: true });
                this.containerOuter.element.addEventListener('blur', this._onBlur, { passive: true });
            }
            this.input.element.addEventListener('keyup', this._onKeyUp, { passive: true });
            this.input.element.addEventListener('focus', this._onFocus, { passive: true });
            this.input.element.addEventListener('blur', this._onBlur, { passive: true });
            if (this.input.element.form) {
                this.input.element.form.addEventListener('reset', this._onFormReset, { passive: true });
            }
            this.input.addEventListeners();
        }
        _removeEventListeners() {
            const {documentElement} = document;
            documentElement.removeEventListener('touchend', this._onTouchEnd, true);
            this.containerOuter.element.removeEventListener('keydown', this._onKeyDown, true);
            this.containerOuter.element.removeEventListener('mousedown', this._onMouseDown, true);
            documentElement.removeEventListener('click', this._onClick);
            documentElement.removeEventListener('touchmove', this._onTouchMove);
            this.dropdown.element.removeEventListener('mouseover', this._onMouseOver);
            if (this._isSelectOneElement) {
                this.containerOuter.element.removeEventListener('focus', this._onFocus);
                this.containerOuter.element.removeEventListener('blur', this._onBlur);
            }
            this.input.element.removeEventListener('keyup', this._onKeyUp);
            this.input.element.removeEventListener('focus', this._onFocus);
            this.input.element.removeEventListener('blur', this._onBlur);
            if (this.input.element.form) {
                this.input.element.form.removeEventListener('reset', this._onFormReset);
            }
            this.input.removeEventListeners();
        }
        _onKeyDown(event) {
            const {target, keyCode, ctrlKey, metaKey} = event;
            const {activeItems} = this._store;
            const hasFocusedInput = this.input.isFocussed;
            const hasActiveDropdown = this.dropdown.isActive;
            const hasItems = this.itemList.hasChildren();
            const keyString = String.fromCharCode(keyCode);
            const {BACK_KEY, DELETE_KEY, ENTER_KEY, A_KEY, ESC_KEY, UP_KEY, DOWN_KEY, PAGE_UP_KEY, PAGE_DOWN_KEY} = constants.KEY_CODES;
            const hasCtrlDownKeyPressed = ctrlKey || metaKey;
            if (!this._isTextElement && /[a-zA-Z0-9-_ ]/.test(keyString)) {
                this.showDropdown();
            }
            const keyDownActions = {
                [A_KEY]: this._onAKey,
                [ENTER_KEY]: this._onEnterKey,
                [ESC_KEY]: this._onEscapeKey,
                [UP_KEY]: this._onDirectionKey,
                [PAGE_UP_KEY]: this._onDirectionKey,
                [DOWN_KEY]: this._onDirectionKey,
                [PAGE_DOWN_KEY]: this._onDirectionKey,
                [DELETE_KEY]: this._onDeleteKey,
                [BACK_KEY]: this._onDeleteKey
            };
            if (keyDownActions[keyCode]) {
                keyDownActions[keyCode]({
                    event,
                    target,
                    keyCode,
                    metaKey,
                    activeItems,
                    hasFocusedInput,
                    hasActiveDropdown,
                    hasItems,
                    hasCtrlDownKeyPressed
                });
            }
        }
        _onKeyUp({target, keyCode}) {
            const {value} = this.input;
            const {activeItems} = this._store;
            const canAddItem = this._canAddItem(activeItems, value);
            const {
                BACK_KEY: backKey,
                DELETE_KEY: deleteKey
            } = constants.KEY_CODES;
            if (this._isTextElement) {
                const canShowDropdownNotice = canAddItem.notice && value;
                if (canShowDropdownNotice) {
                    const dropdownItem = this._getTemplate('notice', canAddItem.notice);
                    this.dropdown.element.innerHTML = dropdownItem.outerHTML;
                    this.showDropdown(true);
                } else {
                    this.hideDropdown(true);
                }
            } else {
                const userHasRemovedValue = (keyCode === backKey || keyCode === deleteKey) && !target.value;
                const canReactivateChoices = !this._isTextElement && this._isSearching;
                const canSearch = this._canSearch && canAddItem.response;
                if (userHasRemovedValue && canReactivateChoices) {
                    this._isSearching = false;
                    this._store.dispatch(actionsChoices.activateChoices(true));
                } else if (canSearch) {
                    this._handleSearch(this.input.value);
                }
            }
            this._canSearch = this.config.searchEnabled;
        }
        _onAKey({hasItems, hasCtrlDownKeyPressed}) {
            if (hasCtrlDownKeyPressed && hasItems) {
                this._canSearch = false;
                const shouldHightlightAll = this.config.removeItems && !this.input.value && this.input.element === document.activeElement;
                if (shouldHightlightAll) {
                    this.highlightAll();
                }
            }
        }
        _onEnterKey({event, target, activeItems, hasActiveDropdown}) {
            const {ENTER_KEY: enterKey} = constants.KEY_CODES;
            const targetWasButton = target.hasAttribute('data-button');
            if (this._isTextElement && target.value) {
                const {value} = this.input;
                const canAddItem = this._canAddItem(activeItems, value);
                if (canAddItem.response) {
                    this.hideDropdown(true);
                    this._addItem({ value });
                    this._triggerChange(value);
                    this.clearInput();
                }
            }
            if (targetWasButton) {
                this._handleButtonAction(activeItems, target);
                event.preventDefault();
            }
            if (hasActiveDropdown) {
                const highlightedChoice = this.dropdown.getChild(`.${ this.config.classNames.highlightedState }`);
                if (highlightedChoice) {
                    if (activeItems[0]) {
                        activeItems[0].keyCode = enterKey;
                    }
                    this._handleChoiceAction(activeItems, highlightedChoice);
                }
                event.preventDefault();
            } else if (this._isSelectOneElement) {
                this.showDropdown();
                event.preventDefault();
            }
        }
        _onEscapeKey({hasActiveDropdown}) {
            if (hasActiveDropdown) {
                this.hideDropdown(true);
                this.containerOuter.focus();
            }
        }
        _onDirectionKey({event, hasActiveDropdown, keyCode, metaKey}) {
            const {
                DOWN_KEY: downKey,
                PAGE_UP_KEY: pageUpKey,
                PAGE_DOWN_KEY: pageDownKey
            } = constants.KEY_CODES;
            if (hasActiveDropdown || this._isSelectOneElement) {
                this.showDropdown();
                this._canSearch = false;
                const directionInt = keyCode === downKey || keyCode === pageDownKey ? 1 : -1;
                const skipKey = metaKey || keyCode === pageDownKey || keyCode === pageUpKey;
                const selectableChoiceIdentifier = '[data-choice-selectable]';
                let nextEl;
                if (skipKey) {
                    if (directionInt > 0) {
                        nextEl = this.dropdown.element.querySelector(`${ selectableChoiceIdentifier }:last-of-type`);
                    } else {
                        nextEl = this.dropdown.element.querySelector(selectableChoiceIdentifier);
                    }
                } else {
                    const currentEl = this.dropdown.element.querySelector(`.${ this.config.classNames.highlightedState }`);
                    if (currentEl) {
                        nextEl = h.getAdjacentEl(currentEl, selectableChoiceIdentifier, directionInt);
                    } else {
                        nextEl = this.dropdown.element.querySelector(selectableChoiceIdentifier);
                    }
                }
                if (nextEl) {
                    if (!h.isScrolledIntoView(nextEl, this.choiceList.element, directionInt)) {
                        this.choiceList.scrollToChildElement(nextEl, directionInt);
                    }
                    this._highlightChoice(nextEl);
                }
                event.preventDefault();
            }
        }
        _onDeleteKey({event, target, hasFocusedInput, activeItems}) {
            if (hasFocusedInput && !target.value && !this._isSelectOneElement) {
                this._handleBackspace(activeItems);
                event.preventDefault();
            }
        }
        _onTouchMove() {
            if (this._wasTap) {
                this._wasTap = false;
            }
        }
        _onTouchEnd(event) {
            const {target} = event || event.touches[0];
            const touchWasWithinContainer = this._wasTap && this.containerOuter.element.contains(target);
            if (touchWasWithinContainer) {
                const containerWasExactTarget = target === this.containerOuter.element || target === this.containerInner.element;
                if (containerWasExactTarget) {
                    if (this._isTextElement) {
                        this.input.focus();
                    } else if (this._isSelectMultipleElement) {
                        this.showDropdown();
                    }
                }
                event.stopPropagation();
            }
            this._wasTap = true;
        }
        _onMouseDown(event) {
            const {target} = event;
            if (!(target instanceof HTMLElement)) {
                return;
            }
            if (IS_IE11 && this.choiceList.element.contains(target)) {
                const firstChoice = this.choiceList.element.firstElementChild;
                const isOnScrollbar = this._direction === 'ltr' ? event.offsetX >= firstChoice.offsetWidth : event.offsetX < firstChoice.offsetLeft;
                this._isScrollingOnIe = isOnScrollbar;
            }
            if (target === this.input.element) {
                return;
            }
            const item = target.closest('[data-button],[data-item],[data-choice]');
            if (item instanceof HTMLElement) {
                const hasShiftKey = event.shiftKey;
                const {activeItems} = this._store;
                const {dataset} = item;
                if ('button' in dataset) {
                    this._handleButtonAction(activeItems, item);
                } else if ('item' in dataset) {
                    this._handleItemAction(activeItems, item, hasShiftKey);
                } else if ('choice' in dataset) {
                    this._handleChoiceAction(activeItems, item);
                }
            }
            event.preventDefault();
        }
        _onMouseOver({target}) {
            if (target instanceof HTMLElement && 'choice' in target.dataset) {
                this._highlightChoice(target);
            }
        }
        _onClick({target}) {
            const clickWasWithinContainer = this.containerOuter.element.contains(target);
            if (clickWasWithinContainer) {
                if (!this.dropdown.isActive && !this.containerOuter.isDisabled) {
                    if (this._isTextElement) {
                        if (document.activeElement !== this.input.element) {
                            this.input.focus();
                        }
                    } else {
                        this.showDropdown();
                        this.containerOuter.focus();
                    }
                } else if (this._isSelectOneElement && target !== this.input.element && !this.dropdown.element.contains(target)) {
                    this.hideDropdown();
                }
            } else {
                const hasHighlightedItems = this._store.highlightedActiveItems.length > 0;
                if (hasHighlightedItems) {
                    this.unhighlightAll();
                }
                this.containerOuter.removeFocusState();
                this.hideDropdown(true);
            }
        }
        _onFocus({target}) {
            const focusWasWithinContainer = this.containerOuter.element.contains(target);
            if (!focusWasWithinContainer) {
                return;
            }
            const focusActions = {
                [constants.TEXT_TYPE]: () => {
                    if (target === this.input.element) {
                        this.containerOuter.addFocusState();
                    }
                },
                [constants.SELECT_ONE_TYPE]: () => {
                    this.containerOuter.addFocusState();
                    if (target === this.input.element) {
                        this.showDropdown(true);
                    }
                },
                [constants.SELECT_MULTIPLE_TYPE]: () => {
                    if (target === this.input.element) {
                        this.showDropdown(true);
                        this.containerOuter.addFocusState();
                    }
                }
            };
            focusActions[this.passedElement.element.type]();
        }
        _onBlur({target}) {
            const blurWasWithinContainer = this.containerOuter.element.contains(target);
            if (blurWasWithinContainer && !this._isScrollingOnIe) {
                const {activeItems} = this._store;
                const hasHighlightedItems = activeItems.some(item => item.highlighted);
                const blurActions = {
                    [constants.TEXT_TYPE]: () => {
                        if (target === this.input.element) {
                            this.containerOuter.removeFocusState();
                            if (hasHighlightedItems) {
                                this.unhighlightAll();
                            }
                            this.hideDropdown(true);
                        }
                    },
                    [constants.SELECT_ONE_TYPE]: () => {
                        this.containerOuter.removeFocusState();
                        if (target === this.input.element || target === this.containerOuter.element && !this._canSearch) {
                            this.hideDropdown(true);
                        }
                    },
                    [constants.SELECT_MULTIPLE_TYPE]: () => {
                        if (target === this.input.element) {
                            this.containerOuter.removeFocusState();
                            this.hideDropdown(true);
                            if (hasHighlightedItems) {
                                this.unhighlightAll();
                            }
                        }
                    }
                };
                blurActions[this.passedElement.element.type]();
            } else {
                this._isScrollingOnIe = false;
                this.input.element.focus();
            }
        }
        _onFormReset() {
            this._store.dispatch(misc.resetTo(this._initialState));
        }
        _highlightChoice(el = null) {
            const choices = Array.from(this.dropdown.element.querySelectorAll('[data-choice-selectable]'));
            if (!choices.length) {
                return;
            }
            let passedEl = el;
            const highlightedChoices = Array.from(this.dropdown.element.querySelectorAll(`.${ this.config.classNames.highlightedState }`));
            highlightedChoices.forEach(choice => {
                choice.classList.remove(this.config.classNames.highlightedState);
                choice.setAttribute('aria-selected', 'false');
            });
            if (passedEl) {
                this._highlightPosition = choices.indexOf(passedEl);
            } else {
                if (choices.length > this._highlightPosition) {
                    passedEl = choices[this._highlightPosition];
                } else {
                    passedEl = choices[choices.length - 1];
                }
                if (!passedEl) {
                    passedEl = choices[0];
                }
            }
            passedEl.classList.add(this.config.classNames.highlightedState);
            passedEl.setAttribute('aria-selected', 'true');
            this.passedElement.triggerEvent(constants.EVENTS.highlightChoice, { el: passedEl });
            if (this.dropdown.isActive) {
                this.input.setActiveDescendant(passedEl.id);
                this.containerOuter.setActiveDescendant(passedEl.id);
            }
        }
        _addItem({value, label = null, choiceId = -1, groupId = -1, customProperties = null, placeholder = false, keyCode = null}) {
            let passedValue = typeof value === 'string' ? value.trim() : value;
            const passedKeyCode = keyCode;
            const passedCustomProperties = customProperties;
            const {items} = this._store;
            const passedLabel = label || passedValue;
            const passedOptionId = choiceId || -1;
            const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
            const id = items ? items.length + 1 : 1;
            if (this.config.prependValue) {
                passedValue = this.config.prependValue + passedValue.toString();
            }
            if (this.config.appendValue) {
                passedValue += this.config.appendValue.toString();
            }
            this._store.dispatch(items.addItem({
                value: passedValue,
                label: passedLabel,
                id,
                choiceId: passedOptionId,
                groupId,
                customProperties,
                placeholder,
                keyCode: passedKeyCode
            }));
            if (this._isSelectOneElement) {
                this.removeActiveItems(id);
            }
            this.passedElement.triggerEvent(constants.EVENTS.addItem, {
                id,
                value: passedValue,
                label: passedLabel,
                customProperties: passedCustomProperties,
                groupValue: group && group.value ? group.value : undefined,
                keyCode: passedKeyCode
            });
            return this;
        }
        _removeItem(item) {
            if (!item || !h.isType('Object', item)) {
                return this;
            }
            const {id, value, label, choiceId, groupId} = item;
            const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
            this._store.dispatch(items.removeItem(id, choiceId));
            if (group && group.value) {
                this.passedElement.triggerEvent(constants.EVENTS.removeItem, {
                    id,
                    value,
                    label,
                    groupValue: group.value
                });
            } else {
                this.passedElement.triggerEvent(constants.EVENTS.removeItem, {
                    id,
                    value,
                    label
                });
            }
            return this;
        }
        _addChoice({value, label = null, isSelected = false, isDisabled = false, groupId = -1, customProperties = null, placeholder = false, keyCode = null}) {
            if (typeof value === 'undefined' || value === null) {
                return;
            }
            const {choices} = this._store;
            const choiceLabel = label || value;
            const choiceId = choices ? choices.length + 1 : 1;
            const choiceElementId = `${ this._baseId }-${ this._idNames.itemChoice }-${ choiceId }`;
            this._store.dispatch(actionsChoices.addChoice({
                id: choiceId,
                groupId,
                elementId: choiceElementId,
                value,
                label: choiceLabel,
                disabled: isDisabled,
                customProperties,
                placeholder,
                keyCode
            }));
            if (isSelected) {
                this._addItem({
                    value,
                    label: choiceLabel,
                    choiceId,
                    customProperties,
                    placeholder,
                    keyCode
                });
            }
        }
        _addGroup({group, id, valueKey = 'value', labelKey = 'label'}) {
            const groupChoices = h.isType('Object', group) ? group.choices : Array.from(group.getElementsByTagName('OPTION'));
            const groupId = id || Math.floor(new Date().valueOf() * Math.random());
            const isDisabled = group.disabled ? group.disabled : false;
            if (groupChoices) {
                this._store.dispatch(groups.addGroup({
                    value: group.label,
                    id: groupId,
                    active: true,
                    disabled: isDisabled
                }));
                const addGroupChoices = choice => {
                    const isOptDisabled = choice.disabled || choice.parentNode && choice.parentNode.disabled;
                    this._addChoice({
                        value: choice[valueKey],
                        label: h.isType('Object', choice) ? choice[labelKey] : choice.innerHTML,
                        isSelected: choice.selected,
                        isDisabled: isOptDisabled,
                        groupId,
                        customProperties: choice.customProperties,
                        placeholder: choice.placeholder
                    });
                };
                groupChoices.forEach(addGroupChoices);
            } else {
                this._store.dispatch(groups.addGroup({
                    value: group.label,
                    id: group.id,
                    active: false,
                    disabled: group.disabled
                }));
            }
        }
        _getTemplate(template, ...args) {
            if (!template) {
                return null;
            }
            const {classNames} = this.config;
            return this._templates[template].call(this, classNames, ...args);
        }
        _createTemplates() {
            const {callbackOnCreateTemplates} = this.config;
            let userTemplates = {};
            if (callbackOnCreateTemplates && typeof callbackOnCreateTemplates === 'function') {
                userTemplates = callbackOnCreateTemplates.call(this, h.strToEl);
            }
            this._templates = merge(TEMPLATES, userTemplates);
        }
        _createElements() {
            this.containerOuter = new components.Container({
                element: this._getTemplate('containerOuter', this._direction, this._isSelectElement, this._isSelectOneElement, this.config.searchEnabled, this.passedElement.element.type),
                classNames: this.config.classNames,
                type: this.passedElement.element.type,
                position: this.config.position
            });
            this.containerInner = new components.Container({
                element: this._getTemplate('containerInner'),
                classNames: this.config.classNames,
                type: this.passedElement.element.type,
                position: this.config.position
            });
            this.input = new components.Input({
                element: this._getTemplate('input', this._placeholderValue),
                classNames: this.config.classNames,
                type: this.passedElement.element.type,
                preventPaste: !this.config.paste
            });
            this.choiceList = new components.List({ element: this._getTemplate('choiceList', this._isSelectOneElement) });
            this.itemList = new components.List({ element: this._getTemplate('itemList', this._isSelectOneElement) });
            this.dropdown = new components.Dropdown({
                element: this._getTemplate('dropdown'),
                classNames: this.config.classNames,
                type: this.passedElement.element.type
            });
        }
        _createStructure() {
            this.passedElement.conceal();
            this.containerInner.wrap(this.passedElement.element);
            this.containerOuter.wrap(this.containerInner.element);
            if (this._isSelectOneElement) {
                this.input.placeholder = this.config.searchPlaceholderValue || '';
            } else if (this._placeholderValue) {
                this.input.placeholder = this._placeholderValue;
                this.input.setWidth();
            }
            this.containerOuter.element.appendChild(this.containerInner.element);
            this.containerOuter.element.appendChild(this.dropdown.element);
            this.containerInner.element.appendChild(this.itemList.element);
            if (!this._isTextElement) {
                this.dropdown.element.appendChild(this.choiceList.element);
            }
            if (!this._isSelectOneElement) {
                this.containerInner.element.appendChild(this.input.element);
            } else if (this.config.searchEnabled) {
                this.dropdown.element.insertBefore(this.input.element, this.dropdown.element.firstChild);
            }
            if (this._isSelectElement) {
                this._highlightPosition = 0;
                this._isSearching = false;
                this._startLoading();
                if (this._presetGroups.length) {
                    this._addPredefinedGroups(this._presetGroups);
                } else {
                    this._addPredefinedChoices(this._presetChoices);
                }
                this._stopLoading();
            }
            if (this._isTextElement) {
                this._addPredefinedItems(this._presetItems);
            }
        }
        _addPredefinedGroups(groups) {
            const placeholderChoice = this.passedElement.placeholderOption;
            if (placeholderChoice && placeholderChoice.parentNode.tagName === 'SELECT') {
                this._addChoice({
                    value: placeholderChoice.value,
                    label: placeholderChoice.innerHTML,
                    isSelected: placeholderChoice.selected,
                    isDisabled: placeholderChoice.disabled,
                    placeholder: true
                });
            }
            groups.forEach(group => this._addGroup({
                group,
                id: group.id || null
            }));
        }
        _addPredefinedChoices(choices) {
            if (this.config.shouldSort) {
                choices.sort(this.config.sorter);
            }
            const hasSelectedChoice = choices.some(choice => choice.selected);
            const firstEnabledChoiceIndex = choices.findIndex(choice => choice.disabled === undefined || !choice.disabled);
            choices.forEach((choice, index) => {
                const {value, label, customProperties, placeholder} = choice;
                if (this._isSelectElement) {
                    if (choice.choices) {
                        this._addGroup({
                            group: choice,
                            id: choice.id || null
                        });
                    } else {
                        const shouldPreselect = this._isSelectOneElement && !hasSelectedChoice && index === firstEnabledChoiceIndex;
                        const isSelected = shouldPreselect ? true : choice.selected;
                        const isDisabled = choice.disabled;
                        this._addChoice({
                            value,
                            label,
                            isSelected,
                            isDisabled,
                            customProperties,
                            placeholder
                        });
                    }
                } else {
                    this._addChoice({
                        value,
                        label,
                        isSelected: choice.selected,
                        isDisabled: choice.disabled,
                        customProperties,
                        placeholder
                    });
                }
            });
        }
        _addPredefinedItems(items) {
            items.forEach(item => {
                if (typeof item === 'object' && item.value) {
                    this._addItem({
                        value: item.value,
                        label: item.label,
                        choiceId: item.id,
                        customProperties: item.customProperties,
                        placeholder: item.placeholder
                    });
                }
                if (typeof item === 'string') {
                    this._addItem({ value: item });
                }
            });
        }
        _setChoiceOrItem(item) {
            const itemType = h.getType(item).toLowerCase();
            const handleType = {
                object: () => {
                    if (!item.value) {
                        return;
                    }
                    if (!this._isTextElement) {
                        this._addChoice({
                            value: item.value,
                            label: item.label,
                            isSelected: true,
                            isDisabled: false,
                            customProperties: item.customProperties,
                            placeholder: item.placeholder
                        });
                    } else {
                        this._addItem({
                            value: item.value,
                            label: item.label,
                            choiceId: item.id,
                            customProperties: item.customProperties,
                            placeholder: item.placeholder
                        });
                    }
                },
                string: () => {
                    if (!this._isTextElement) {
                        this._addChoice({
                            value: item,
                            label: item,
                            isSelected: true,
                            isDisabled: false
                        });
                    } else {
                        this._addItem({ value: item });
                    }
                }
            };
            handleType[itemType]();
        }
        _findAndSelectChoiceByValue(val) {
            const {choices} = this._store;
            const foundChoice = choices.find(choice => this.config.valueComparer(choice.value, val));
            if (foundChoice && !foundChoice.selected) {
                this._addItem({
                    value: foundChoice.value,
                    label: foundChoice.label,
                    choiceId: foundChoice.id,
                    groupId: foundChoice.groupId,
                    customProperties: foundChoice.customProperties,
                    placeholder: foundChoice.placeholder,
                    keyCode: foundChoice.keyCode
                });
            }
        }
        _generatePlaceholderValue() {
            if (this._isSelectElement) {
                const {placeholderOption} = this.passedElement;
                return placeholderOption ? placeholderOption.text : false;
            }
            const {placeholder, placeholderValue} = this.config;
            const {
                element: {dataset}
            } = this.passedElement;
            if (placeholder) {
                if (placeholderValue) {
                    return placeholderValue;
                }
                if (dataset.placeholder) {
                    return dataset.placeholder;
                }
            }
            return false;
        }
    }
    return Choices;
});
define('skylark-choices/main',[
	"./choices"
],function(Choices){
	return Choices;
});
define('skylark-choices', ['skylark-choices/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-choices.js.map
