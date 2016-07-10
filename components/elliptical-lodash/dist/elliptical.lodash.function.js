/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash category="function"`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.10.1';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256;

  /** Used to detect when a function becomes hot. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      stringTag = '[object String]';

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /** Used to fix the JScript `[[DontEnum]]` bug. */
  var shadowProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */
  function baseIsFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  var isHostObject = (function() {
    try {
      Object({ 'toString': 0 } + '');
    } catch(e) {
      return function() { return false; };
    }
    return function(value) {
      // IE < 9 presents many host objects as `Object` objects that can coerce
      // to strings despite having improperly defined `toString` methods.
      return typeof value.toString != 'function' && typeof (value + '') == 'string';
    };
  }());

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index] = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /** Used for native method references. */
  var arrayProto = Array.prototype,
      errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;

  /** Used to resolve the decompiled source of functions. */
  var fnToString = Function.prototype.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Native method references. */
  var propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice,
      WeakMap = getNative(root, 'WeakMap');

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeIsArray = getNative(Array, 'isArray'),
      nativeIsFinite = root.isFinite,
      nativeMax = Math.max,
      nativeMin = Math.min,
      nativeNow = getNative(Date, 'now');

  /** Used as references for `-Infinity` and `Infinity`. */
  var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

  /**
   * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
   * of an array-like value.
   */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to store function metadata. */
  var metaMap = WeakMap && new WeakMap;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to avoid iterating over non-enumerable properties in IE < 9. */
  var nonEnumProps = {};
  nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolTag] = nonEnumProps[stringTag] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectTag] = { 'constructor': true };

  arrayEach(shadowProps, function(key) {
    for (var tag in nonEnumProps) {
      if (hasOwnProperty.call(nonEnumProps, tag)) {
        var props = nonEnumProps[tag];
        props[key] = hasOwnProperty.call(props, key);
      }
    }
  });

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit chaining.
   * Methods that operate on and return arrays, collections, and functions can
   * be chained together. Methods that retrieve a single value or may return a
   * primitive value will automatically end the chain returning the unwrapped
   * value. Explicit chaining may be enabled using `_.chain`. The execution of
   * chained methods is lazy, that is, execution is deferred until `_#value`
   * is implicitly or explicitly called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
   * fusion is an optimization strategy which merge iteratee calls; this can help
   * to avoid the creation of intermediate data structures and greatly reduce the
   * number of iteratee executions.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers have `Array` and `String` methods.
   *
   * The wrapper `Array` methods are:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
   * `splice`, and `unshift`
   *
   * The wrapper `String` methods are:
   * `replace` and `split`
   *
   * The wrapper methods that support shortcut fusion are:
   * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
   * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
   * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
   * and `where`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
   * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
   * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
   * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
   * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
   * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
   * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
   * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
   * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
   * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
   * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
   * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
   * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
   * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
   * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
   * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
   * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
   * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
   * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
   * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
   * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
   * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
   * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
   * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
   * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
   * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
   * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
   * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
   * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
   * `unescape`, `uniqueId`, `value`, and `words`
   *
   * The wrapper method `sample` will return a wrapped value when `n` is provided,
   * otherwise an unwrapped value is returned.
   *
   * @name _
   * @constructor
   * @category Chain
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(total, n) {
   *   return total + n;
   * });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(n) {
   *   return n * n;
   * });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // No operation performed.
  }

  /**
   * The function whose prototype all chaining wrappers inherit from.
   *
   * @private
   */
  function baseLodash() {
    // No operation performed.
  }

  /**
   * The base constructor for creating `lodash` wrapper objects.
   *
   * @private
   * @param {*} value The value to wrap.
   * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
   * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
   */
  function LodashWrapper(value, chainAll, actions) {
    this.__wrapped__ = value;
    this.__actions__ = actions || [];
    this.__chain__ = !!chainAll;
  }

  /**
   * An object environment feature flags.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = lodash.support = {};

  (function(x) {
    var Ctor = function() { this.x = x; },
        object = { '0': x, 'length': x },
        props = [];

    Ctor.prototype = { 'valueOf': x, 'y': x };
    for (var key in new Ctor) { props.push(key); }

    /**
     * Detect if `name` or `message` properties of `Error.prototype` are
     * enumerable by default (IE < 9, Safari < 5.1).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') ||
      propertyIsEnumerable.call(errorProto, 'name');

    /**
     * Detect if `prototype` properties are enumerable by default.
     *
     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
     * (if the prototype or a property on the prototype has been set)
     * incorrectly set the `[[Enumerable]]` value of a function's `prototype`
     * property to `true`.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumPrototypes = propertyIsEnumerable.call(Ctor, 'prototype');

    /**
     * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
     *
     * In IE < 9 an object's own properties, shadowing non-enumerable ones,
     * are made non-enumerable as well (a.k.a the JScript `[[DontEnum]]` bug).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumShadows = !/valueOf/.test(props);

    /**
     * Detect if `Array#shift` and `Array#splice` augment array-like objects
     * correctly.
     *
     * Firefox < 10, compatibility modes of IE 8, and IE < 9 have buggy Array
     * `shift()` and `splice()` functions that fail to remove the last element,
     * `value[0]`, of array-like objects even though the "length" property is
     * set to `0`. The `shift()` method is buggy in compatibility modes of IE 8,
     * while `splice()` is buggy regardless of mode in IE < 9.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.spliceObjects = (splice.call(object, 0, 1), !object[0]);

    /**
     * Detect lack of support for accessing string characters by index.
     *
     * IE < 8 can't access characters by index. IE 8 can only access characters
     * by index on string literals, not string objects.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';
  }(1, 0));

  /*------------------------------------------------------------------------*/

  /**
   * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
   *
   * @private
   * @param {*} value The value to wrap.
   */
  function LazyWrapper(value) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__dir__ = 1;
    this.__filtered__ = false;
    this.__iteratees__ = [];
    this.__takeCount__ = POSITIVE_INFINITY;
    this.__views__ = [];
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a cache object to store key/value pairs.
   *
   * @private
   * @static
   * @name Cache
   * @memberOf _.memoize
   */
  function MapCache() {
    this.__data__ = {};
  }

  /**
   * Removes `key` and its value from the cache.
   *
   * @private
   * @name delete
   * @memberOf _.memoize.Cache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
   */
  function mapDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }

  /**
   * Gets the cached value for `key`.
   *
   * @private
   * @name get
   * @memberOf _.memoize.Cache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the cached value.
   */
  function mapGet(key) {
    return key == '__proto__' ? undefined : this.__data__[key];
  }

  /**
   * Checks if a cached value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf _.memoize.Cache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapHas(key) {
    return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
  }

  /**
   * Sets `value` to `key` of the cache.
   *
   * @private
   * @name set
   * @memberOf _.memoize.Cache
   * @param {string} key The key of the value to cache.
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache object.
   */
  function mapSet(key, value) {
    if (key != '__proto__') {
      this.__data__[key] = value;
    }
    return this;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function arrayCopy(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        object.prototype = prototype;
        var result = new object;
        object.prototype = undefined;
      }
      return result || {};
    };
  }());

  /**
   * The base implementation of `_.delay` and `_.defer` which accepts an index
   * of where to slice the arguments to provide to `func`.
   *
   * @private
   * @param {Function} func The function to delay.
   * @param {number} wait The number of milliseconds to delay invocation.
   * @param {Object} args The arguments provide to `func`.
   * @returns {number} Returns the timer id.
   */
  function baseDelay(func, wait, args) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return setTimeout(function() { func.apply(undefined, args); }, wait);
  }

  /**
   * The base implementation of `_.flatten` with added support for restricting
   * flattening and specifying the start index.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {boolean} [isDeep] Specify a deep flatten.
   * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, isDeep, isStrict, result) {
    result || (result = []);

    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index];
      if (isObjectLike(value) && isArrayLike(value) &&
          (isStrict || isArray(value) || isArguments(value))) {
        if (isDeep) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, isDeep, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.functions` which creates an array of
   * `object` function property names filtered from those provided.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} props The property names to filter.
   * @returns {Array} Returns the new array of filtered property names.
   */
  function baseFunctions(object, props) {
    var index = -1,
        length = props.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var key = props[index];
      if (isFunction(object[key])) {
        result[++resIndex] = key;
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : toObject(object)[key];
    };
  }

  /**
   * The base implementation of `setData` without support for hot loop detection.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var baseSetData = !metaMap ? identity : function(func, data) {
    metaMap.set(func, data);
    return func;
  };

  /**
   * Creates an array that is the composition of partially applied arguments,
   * placeholders, and provided arguments into a single array of arguments.
   *
   * @private
   * @param {Array|Object} args The provided arguments.
   * @param {Array} partials The arguments to prepend to those provided.
   * @param {Array} holders The `partials` placeholder indexes.
   * @returns {Array} Returns the new array of composed arguments.
   */
  function composeArgs(args, partials, holders) {
    var holdersLength = holders.length,
        argsIndex = -1,
        argsLength = nativeMax(args.length - holdersLength, 0),
        leftIndex = -1,
        leftLength = partials.length,
        result = Array(leftLength + argsLength);

    while (++leftIndex < leftLength) {
      result[leftIndex] = partials[leftIndex];
    }
    while (++argsIndex < holdersLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
    while (argsLength--) {
      result[leftIndex++] = args[argsIndex++];
    }
    return result;
  }

  /**
   * This function is like `composeArgs` except that the arguments composition
   * is tailored for `_.partialRight`.
   *
   * @private
   * @param {Array|Object} args The provided arguments.
   * @param {Array} partials The arguments to append to those provided.
   * @param {Array} holders The `partials` placeholder indexes.
   * @returns {Array} Returns the new array of composed arguments.
   */
  function composeArgsRight(args, partials, holders) {
    var holdersIndex = -1,
        holdersLength = holders.length,
        argsIndex = -1,
        argsLength = nativeMax(args.length - holdersLength, 0),
        rightIndex = -1,
        rightLength = partials.length,
        result = Array(argsLength + rightLength);

    while (++argsIndex < argsLength) {
      result[argsIndex] = args[argsIndex];
    }
    var offset = argsIndex;
    while (++rightIndex < rightLength) {
      result[offset + rightIndex] = partials[rightIndex];
    }
    while (++holdersIndex < holdersLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
    return result;
  }

  /**
   * Creates a function that wraps `func` and invokes it with the `this`
   * binding of `thisArg`.
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @returns {Function} Returns the new bound function.
   */
  function createBindWrapper(func, thisArg) {
    var Ctor = createCtorWrapper(func);

    function wrapper() {
      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
      return fn.apply(thisArg, arguments);
    }
    return wrapper;
  }

  /**
   * Creates a function that produces an instance of `Ctor` regardless of
   * whether it was invoked as part of a `new` expression or by `call` or `apply`.
   *
   * @private
   * @param {Function} Ctor The constructor to wrap.
   * @returns {Function} Returns the new wrapped function.
   */
  function createCtorWrapper(Ctor) {
    return function() {
      // Use a `switch` statement to work with class constructors.
      // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
      // for more details.
      var args = arguments;
      switch (args.length) {
        case 0: return new Ctor;
        case 1: return new Ctor(args[0]);
        case 2: return new Ctor(args[0], args[1]);
        case 3: return new Ctor(args[0], args[1], args[2]);
        case 4: return new Ctor(args[0], args[1], args[2], args[3]);
        case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
        case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      }
      var thisBinding = baseCreate(Ctor.prototype),
          result = Ctor.apply(thisBinding, args);

      // Mimic the constructor's `return` behavior.
      // See https://es5.github.io/#x13.2.2 for more details.
      return isObject(result) ? result : thisBinding;
    };
  }

  /**
   * Creates a `_.curry` or `_.curryRight` function.
   *
   * @private
   * @param {boolean} flag The curry bit flag.
   * @returns {Function} Returns the new curry function.
   */
  function createCurry(flag) {
    function curryFunc(func, arity, guard) {
      if (guard && isIterateeCall(func, arity, guard)) {
        arity = undefined;
      }
      var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryFunc.placeholder;
      return result;
    }
    return curryFunc;
  }

  /**
   * Creates a `_.flow` or `_.flowRight` function.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new flow function.
   */
  function createFlow(fromRight) {
    return function() {
      var wrapper,
          length = arguments.length,
          index = fromRight ? length : -1,
          leftIndex = 0,
          funcs = Array(length);

      while ((fromRight ? index-- : ++index < length)) {
        var func = funcs[leftIndex++] = arguments[index];
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == 'wrapper') {
          wrapper = new LodashWrapper([], true);
        }
      }
      index = wrapper ? -1 : length;
      while (++index < length) {
        func = funcs[index];

        var funcName = getFuncName(func),
            data = funcName == 'wrapper' ? getData(func) : undefined;

        if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
          wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
        } else {
          wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
        }
      }
      return function() {
        var args = arguments,
            value = args[0];

        if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
          return wrapper.plant(value).value();
        }
        var index = 0,
            result = length ? funcs[index].apply(this, args) : value;

        while (++index < length) {
          result = funcs[index].call(this, result);
        }
        return result;
      };
    };
  }

  /**
   * Creates a `_.partial` or `_.partialRight` function.
   *
   * @private
   * @param {boolean} flag The partial bit flag.
   * @returns {Function} Returns the new partial function.
   */
  function createPartial(flag) {
    var partialFunc = restParam(function(func, partials) {
      var holders = replaceHolders(partials, partialFunc.placeholder);
      return createWrapper(func, flag, undefined, partials, holders);
    });
    return partialFunc;
  }

  /**
   * Creates a function that wraps `func` and invokes it with optional `this`
   * binding of, partial application, and currying.
   *
   * @private
   * @param {Function|string} func The function or method name to reference.
   * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to prepend to those provided to the new function.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
   * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
    var isAry = bitmask & ARY_FLAG,
        isBind = bitmask & BIND_FLAG,
        isBindKey = bitmask & BIND_KEY_FLAG,
        isCurry = bitmask & CURRY_FLAG,
        isCurryBound = bitmask & CURRY_BOUND_FLAG,
        isCurryRight = bitmask & CURRY_RIGHT_FLAG,
        Ctor = isBindKey ? undefined : createCtorWrapper(func);

    function wrapper() {
      // Avoid `arguments` object use disqualifying optimizations by
      // converting it to an array before providing it to other functions.
      var length = arguments.length,
          index = length,
          args = Array(length);

      while (index--) {
        args[index] = arguments[index];
      }
      if (partials) {
        args = composeArgs(args, partials, holders);
      }
      if (partialsRight) {
        args = composeArgsRight(args, partialsRight, holdersRight);
      }
      if (isCurry || isCurryRight) {
        var placeholder = wrapper.placeholder,
            argsHolders = replaceHolders(args, placeholder);

        length -= argsHolders.length;
        if (length < arity) {
          var newArgPos = argPos ? arrayCopy(argPos) : undefined,
              newArity = nativeMax(arity - length, 0),
              newsHolders = isCurry ? argsHolders : undefined,
              newHoldersRight = isCurry ? undefined : argsHolders,
              newPartials = isCurry ? args : undefined,
              newPartialsRight = isCurry ? undefined : args;

          bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
          bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

          if (!isCurryBound) {
            bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
          }
          var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
              result = createHybridWrapper.apply(undefined, newData);

          if (isLaziable(func)) {
            setData(result, newData);
          }
          result.placeholder = placeholder;
          return result;
        }
      }
      var thisBinding = isBind ? thisArg : this,
          fn = isBindKey ? thisBinding[func] : func;

      if (argPos) {
        args = reorder(args, argPos);
      }
      if (isAry && ary < args.length) {
        args.length = ary;
      }
      if (this && this !== root && this instanceof wrapper) {
        fn = Ctor || createCtorWrapper(func);
      }
      return fn.apply(thisBinding, args);
    }
    return wrapper;
  }

  /**
   * Creates a function that wraps `func` and invokes it with the optional `this`
   * binding of `thisArg` and the `partials` prepended to those provided to
   * the wrapper.
   *
   * @private
   * @param {Function} func The function to partially apply arguments to.
   * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} partials The arguments to prepend to those provided to the new function.
   * @returns {Function} Returns the new bound function.
   */
  function createPartialWrapper(func, bitmask, thisArg, partials) {
    var isBind = bitmask & BIND_FLAG,
        Ctor = createCtorWrapper(func);

    function wrapper() {
      // Avoid `arguments` object use disqualifying optimizations by
      // converting it to an array before providing it `func`.
      var argsIndex = -1,
          argsLength = arguments.length,
          leftIndex = -1,
          leftLength = partials.length,
          args = Array(leftLength + argsLength);

      while (++leftIndex < leftLength) {
        args[leftIndex] = partials[leftIndex];
      }
      while (argsLength--) {
        args[leftIndex++] = arguments[++argsIndex];
      }
      var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
      return fn.apply(isBind ? thisArg : this, args);
    }
    return wrapper;
  }

  /**
   * Creates a function that either curries or invokes `func` with optional
   * `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to reference.
   * @param {number} bitmask The bitmask of flags.
   *  The bitmask may be composed of the following flags:
   *     1 - `_.bind`
   *     2 - `_.bindKey`
   *     4 - `_.curry` or `_.curryRight` of a bound function
   *     8 - `_.curry`
   *    16 - `_.curryRight`
   *    32 - `_.partial`
   *    64 - `_.partialRight`
   *   128 - `_.rearg`
   *   256 - `_.ary`
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to be partially applied.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
    var isBindKey = bitmask & BIND_KEY_FLAG;
    if (!isBindKey && typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var length = partials ? partials.length : 0;
    if (!length) {
      bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
      partials = holders = undefined;
    }
    length -= (holders ? holders.length : 0);
    if (bitmask & PARTIAL_RIGHT_FLAG) {
      var partialsRight = partials,
          holdersRight = holders;

      partials = holders = undefined;
    }
    var data = isBindKey ? undefined : getData(func),
        newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

    if (data) {
      mergeData(newData, data);
      bitmask = newData[1];
      arity = newData[9];
    }
    newData[9] = arity == null
      ? (isBindKey ? 0 : func.length)
      : (nativeMax(arity - length, 0) || 0);

    if (bitmask == BIND_FLAG) {
      var result = createBindWrapper(newData[0], newData[2]);
    } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
      result = createPartialWrapper.apply(undefined, newData);
    } else {
      result = createHybridWrapper.apply(undefined, newData);
    }
    var setter = data ? baseSetData : setData;
    return setter(result, newData);
  }

  /**
   * Gets metadata for `func`.
   *
   * @private
   * @param {Function} func The function to query.
   * @returns {*} Returns the metadata for `func`.
   */
  var getData = !metaMap ? noop : function(func) {
    return metaMap.get(func);
  };

  /**
   * Gets the name of `func`.
   *
   * @private
   * @param {Function} func The function to query.
   * @returns {string} Returns the function name.
   */
  function getFuncName(func) {
    var result = (func.name + ''),
        array = realNames[result],
        length = array ? array.length : 0;

    while (length--) {
      var data = array[length],
          otherFunc = data.func;
      if (otherFunc == null || otherFunc == func) {
        return data.name;
      }
    }
    return result;
  }

  /**
   * Gets the "length" property value of `object`.
   *
   * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
   * that affects Safari on at least iOS 8.1-8.3 ARM64.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {*} Returns the "length" value.
   */
  var getLength = baseProperty('length');

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = object == null ? undefined : object[key];
    return isNative(value) ? value : undefined;
  }

  /**
   * Checks if `value` is array-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   */
  function isArrayLike(value) {
    return value != null && isLength(getLength(value));
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * Checks if the provided arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)) {
      var other = object[index];
      return value === value ? (value === other) : (other !== other);
    }
    return false;
  }

  /**
   * Checks if `func` has a lazy counterpart.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
   */
  function isLaziable(func) {
    var funcName = getFuncName(func),
        other = lodash[funcName];

    if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
      return false;
    }
    if (func === other) {
      return true;
    }
    var data = getData(other);
    return !!data && func === data[0];
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   */
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Merges the function metadata of `source` into `data`.
   *
   * Merging metadata reduces the number of wrappers required to invoke a function.
   * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
   * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
   * augment function arguments, making the order in which they are executed important,
   * preventing the merging of metadata. However, we make an exception for a safe
   * common case where curried functions have `_.ary` and or `_.rearg` applied.
   *
   * @private
   * @param {Array} data The destination metadata.
   * @param {Array} source The source metadata.
   * @returns {Array} Returns `data`.
   */
  function mergeData(data, source) {
    var bitmask = data[1],
        srcBitmask = source[1],
        newBitmask = bitmask | srcBitmask,
        isCommon = newBitmask < ARY_FLAG;

    var isCombo =
      (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
      (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
      (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);

    // Exit early if metadata can't be merged.
    if (!(isCommon || isCombo)) {
      return data;
    }
    // Use source `thisArg` if available.
    if (srcBitmask & BIND_FLAG) {
      data[2] = source[2];
      // Set when currying a bound function.
      newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
    }
    // Compose partial arguments.
    var value = source[3];
    if (value) {
      var partials = data[3];
      data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
      data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
    }
    // Compose partial right arguments.
    value = source[5];
    if (value) {
      partials = data[5];
      data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
      data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
    }
    // Use source `argPos` if available.
    value = source[7];
    if (value) {
      data[7] = arrayCopy(value);
    }
    // Use source `ary` if it's smaller.
    if (srcBitmask & ARY_FLAG) {
      data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
    }
    // Use source `arity` if one is not provided.
    if (data[9] == null) {
      data[9] = source[9];
    }
    // Use source `func` and merge bitmasks.
    data[0] = source[0];
    data[1] = newBitmask;

    return data;
  }

  /**
   * Reorder `array` according to the specified indexes where the element at
   * the first index is assigned as the first element, the element at
   * the second index is assigned as the second element, and so on.
   *
   * @private
   * @param {Array} array The array to reorder.
   * @param {Array} indexes The arranged array indexes.
   * @returns {Array} Returns `array`.
   */
  function reorder(array, indexes) {
    var arrLength = array.length,
        length = nativeMin(indexes.length, arrLength),
        oldArray = arrayCopy(array);

    while (length--) {
      var index = indexes[length];
      array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
    }
    return array;
  }

  /**
   * Sets metadata for `func`.
   *
   * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
   * period of time, it will trip its breaker and transition to an identity function
   * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
   * for more details.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var setData = (function() {
    var count = 0,
        lastCalled = 0;

    return function(key, value) {
      var stamp = now(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return key;
        }
      } else {
        count = 0;
      }
      return baseSetData(key, value);
    };
  }());

  /**
   * Converts `value` to an object if it's not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Object} Returns the object.
   */
  function toObject(value) {
    if (lodash.support.unindexedChars && isString(value)) {
      var index = -1,
          length = value.length,
          result = Object(value);

      while (++index < length) {
        result[index] = value.charAt(index);
      }
      return result;
    }
    return isObject(value) ? value : Object(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Gets the number of milliseconds that have elapsed since the Unix epoch
   * (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @category Date
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => logs the number of milliseconds it took for the deferred function to be invoked
   */
  var now = nativeNow || function() {
    return new Date().getTime();
  };

  /*------------------------------------------------------------------------*/

  /**
   * The opposite of `_.before`; this method creates a function that invokes
   * `func` once it's called `n` or more times.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {number} n The number of calls before `func` is invoked.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var saves = ['profile', 'settings'];
   *
   * var done = _.after(saves.length, function() {
   *   console.log('done saving!');
   * });
   *
   * _.forEach(saves, function(type) {
   *   asyncSave({ 'type': type, 'complete': done });
   * });
   * // => logs 'done saving!' after the two async saves have completed
   */
  function after(n, func) {
    if (typeof func != 'function') {
      if (typeof n == 'function') {
        var temp = n;
        n = func;
        func = temp;
      } else {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
    }
    n = nativeIsFinite(n = +n) ? n : 0;
    return function() {
      if (--n < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  /**
   * Creates a function that accepts up to `n` arguments ignoring any
   * additional arguments.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to cap arguments for.
   * @param {number} [n=func.length] The arity cap.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Function} Returns the new function.
   * @example
   *
   * _.map(['6', '8', '10'], _.ary(parseInt, 1));
   * // => [6, 8, 10]
   */
  function ary(func, n, guard) {
    if (guard && isIterateeCall(func, n, guard)) {
      n = undefined;
    }
    n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
    return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
  }

  /**
   * Creates a function that invokes `func`, with the `this` binding and arguments
   * of the created function, while it's called less than `n` times. Subsequent
   * calls to the created function return the result of the last `func` invocation.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {number} n The number of calls at which `func` is no longer invoked.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * jQuery('#add').on('click', _.before(5, addContactToList));
   * // => allows adding up to 4 contacts to the list
   */
  function before(n, func) {
    var result;
    if (typeof func != 'function') {
      if (typeof n == 'function') {
        var temp = n;
        n = func;
        func = temp;
      } else {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
    }
    return function() {
      if (--n > 0) {
        result = func.apply(this, arguments);
      }
      if (n <= 1) {
        func = undefined;
      }
      return result;
    };
  }

  /**
   * Creates a function that invokes `func` with the `this` binding of `thisArg`
   * and prepends any additional `_.bind` arguments to those provided to the
   * bound function.
   *
   * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
   * may be used as a placeholder for partially applied arguments.
   *
   * **Note:** Unlike native `Function#bind` this method does not set the "length"
   * property of bound functions.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var greet = function(greeting, punctuation) {
   *   return greeting + ' ' + this.user + punctuation;
   * };
   *
   * var object = { 'user': 'fred' };
   *
   * var bound = _.bind(greet, object, 'hi');
   * bound('!');
   * // => 'hi fred!'
   *
   * // using placeholders
   * var bound = _.bind(greet, object, _, '!');
   * bound('hi');
   * // => 'hi fred!'
   */
  var bind = restParam(function(func, thisArg, partials) {
    var bitmask = BIND_FLAG;
    if (partials.length) {
      var holders = replaceHolders(partials, bind.placeholder);
      bitmask |= PARTIAL_FLAG;
    }
    return createWrapper(func, bitmask, thisArg, partials, holders);
  });

  /**
   * Binds methods of an object to the object itself, overwriting the existing
   * method. Method names may be specified as individual arguments or as arrays
   * of method names. If no method names are provided all enumerable function
   * properties, own and inherited, of `object` are bound.
   *
   * **Note:** This method does not set the "length" property of bound functions.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Object} object The object to bind and assign the bound methods to.
   * @param {...(string|string[])} [methodNames] The object method names to bind,
   *  specified as individual method names or arrays of method names.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var view = {
   *   'label': 'docs',
   *   'onClick': function() {
   *     console.log('clicked ' + this.label);
   *   }
   * };
   *
   * _.bindAll(view);
   * jQuery('#docs').on('click', view.onClick);
   * // => logs 'clicked docs' when the element is clicked
   */
  var bindAll = restParam(function(object, methodNames) {
    methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

    var index = -1,
        length = methodNames.length;

    while (++index < length) {
      var key = methodNames[index];
      object[key] = createWrapper(object[key], BIND_FLAG, object);
    }
    return object;
  });

  /**
   * Creates a function that invokes the method at `object[key]` and prepends
   * any additional `_.bindKey` arguments to those provided to the bound function.
   *
   * This method differs from `_.bind` by allowing bound functions to reference
   * methods that may be redefined or don't yet exist.
   * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
   * for more details.
   *
   * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
   * builds, may be used as a placeholder for partially applied arguments.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Object} object The object the method belongs to.
   * @param {string} key The key of the method.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var object = {
   *   'user': 'fred',
   *   'greet': function(greeting, punctuation) {
   *     return greeting + ' ' + this.user + punctuation;
   *   }
   * };
   *
   * var bound = _.bindKey(object, 'greet', 'hi');
   * bound('!');
   * // => 'hi fred!'
   *
   * object.greet = function(greeting, punctuation) {
   *   return greeting + 'ya ' + this.user + punctuation;
   * };
   *
   * bound('!');
   * // => 'hiya fred!'
   *
   * // using placeholders
   * var bound = _.bindKey(object, 'greet', _, '!');
   * bound('hi');
   * // => 'hiya fred!'
   */
  var bindKey = restParam(function(object, key, partials) {
    var bitmask = BIND_FLAG | BIND_KEY_FLAG;
    if (partials.length) {
      var holders = replaceHolders(partials, bindKey.placeholder);
      bitmask |= PARTIAL_FLAG;
    }
    return createWrapper(key, bitmask, object, partials, holders);
  });

  /**
   * Creates a function that accepts one or more arguments of `func` that when
   * called either invokes `func` returning its result, if all `func` arguments
   * have been provided, or returns a function that accepts one or more of the
   * remaining `func` arguments, and so on. The arity of `func` may be specified
   * if `func.length` is not sufficient.
   *
   * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
   * may be used as a placeholder for provided arguments.
   *
   * **Note:** This method does not set the "length" property of curried functions.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to curry.
   * @param {number} [arity=func.length] The arity of `func`.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Function} Returns the new curried function.
   * @example
   *
   * var abc = function(a, b, c) {
   *   return [a, b, c];
   * };
   *
   * var curried = _.curry(abc);
   *
   * curried(1)(2)(3);
   * // => [1, 2, 3]
   *
   * curried(1, 2)(3);
   * // => [1, 2, 3]
   *
   * curried(1, 2, 3);
   * // => [1, 2, 3]
   *
   * // using placeholders
   * curried(1)(_, 3)(2);
   * // => [1, 2, 3]
   */
  var curry = createCurry(CURRY_FLAG);

  /**
   * This method is like `_.curry` except that arguments are applied to `func`
   * in the manner of `_.partialRight` instead of `_.partial`.
   *
   * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
   * builds, may be used as a placeholder for provided arguments.
   *
   * **Note:** This method does not set the "length" property of curried functions.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to curry.
   * @param {number} [arity=func.length] The arity of `func`.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Function} Returns the new curried function.
   * @example
   *
   * var abc = function(a, b, c) {
   *   return [a, b, c];
   * };
   *
   * var curried = _.curryRight(abc);
   *
   * curried(3)(2)(1);
   * // => [1, 2, 3]
   *
   * curried(2, 3)(1);
   * // => [1, 2, 3]
   *
   * curried(1, 2, 3);
   * // => [1, 2, 3]
   *
   * // using placeholders
   * curried(3)(1, _)(2);
   * // => [1, 2, 3]
   */
  var curryRight = createCurry(CURRY_RIGHT_FLAG);

  /**
   * Creates a debounced function that delays invoking `func` until after `wait`
   * milliseconds have elapsed since the last time the debounced function was
   * invoked. The debounced function comes with a `cancel` method to cancel
   * delayed invocations. Provide an options object to indicate that `func`
   * should be invoked on the leading and/or trailing edge of the `wait` timeout.
   * Subsequent calls to the debounced function return the result of the last
   * `func` invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
   * on the trailing edge of the timeout only if the the debounced function is
   * invoked more than once during the `wait` timeout.
   *
   * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} [wait=0] The number of milliseconds to delay.
   * @param {Object} [options] The options object.
   * @param {boolean} [options.leading=false] Specify invoking on the leading
   *  edge of the timeout.
   * @param {number} [options.maxWait] The maximum time `func` is allowed to be
   *  delayed before it's invoked.
   * @param {boolean} [options.trailing=true] Specify invoking on the trailing
   *  edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // avoid costly calculations while the window size is in flux
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
   * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // ensure `batchLog` is invoked once after 1 second of debounced calls
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', _.debounce(batchLog, 250, {
   *   'maxWait': 1000
   * }));
   *
   * // cancel a debounced call
   * var todoChanges = _.debounce(batchLog, 1000);
   * Object.observe(models.todo, todoChanges);
   *
   * Object.observe(models, function(changes) {
   *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
   *     todoChanges.cancel();
   *   }
   * }, ['delete']);
   *
   * // ...at some point `models.todo` is changed
   * models.todo.completed = true;
   *
   * // ...before 1 second has passed `models.todo` is deleted
   * // which cancels the debounced `todoChanges` call
   * delete models.todo;
   */
  function debounce(func, wait, options) {
    var args,
        maxTimeoutId,
        result,
        stamp,
        thisArg,
        timeoutId,
        trailingCall,
        lastCalled = 0,
        maxWait = false,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = wait < 0 ? 0 : (+wait || 0);
    if (options === true) {
      var leading = true;
      trailing = false;
    } else if (isObject(options)) {
      leading = !!options.leading;
      maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function cancel() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
      }
      lastCalled = 0;
      maxTimeoutId = timeoutId = trailingCall = undefined;
    }

    function complete(isCalled, id) {
      if (id) {
        clearTimeout(id);
      }
      maxTimeoutId = timeoutId = trailingCall = undefined;
      if (isCalled) {
        lastCalled = now();
        result = func.apply(thisArg, args);
        if (!timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
      }
    }

    function delayed() {
      var remaining = wait - (now() - stamp);
      if (remaining <= 0 || remaining > wait) {
        complete(trailingCall, maxTimeoutId);
      } else {
        timeoutId = setTimeout(delayed, remaining);
      }
    }

    function maxDelayed() {
      complete(trailing, timeoutId);
    }

    function debounced() {
      args = arguments;
      stamp = now();
      thisArg = this;
      trailingCall = trailing && (timeoutId || !leading);

      if (maxWait === false) {
        var leadingCall = leading && !timeoutId;
      } else {
        if (!maxTimeoutId && !leading) {
          lastCalled = stamp;
        }
        var remaining = maxWait - (stamp - lastCalled),
            isCalled = remaining <= 0 || remaining > maxWait;

        if (isCalled) {
          if (maxTimeoutId) {
            maxTimeoutId = clearTimeout(maxTimeoutId);
          }
          lastCalled = stamp;
          result = func.apply(thisArg, args);
        }
        else if (!maxTimeoutId) {
          maxTimeoutId = setTimeout(maxDelayed, remaining);
        }
      }
      if (isCalled && timeoutId) {
        timeoutId = clearTimeout(timeoutId);
      }
      else if (!timeoutId && wait !== maxWait) {
        timeoutId = setTimeout(delayed, wait);
      }
      if (leadingCall) {
        isCalled = true;
        result = func.apply(thisArg, args);
      }
      if (isCalled && !timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
      return result;
    }
    debounced.cancel = cancel;
    return debounced;
  }

  /**
   * Defers invoking the `func` until the current call stack has cleared. Any
   * additional arguments are provided to `func` when it's invoked.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to defer.
   * @param {...*} [args] The arguments to invoke the function with.
   * @returns {number} Returns the timer id.
   * @example
   *
   * _.defer(function(text) {
   *   console.log(text);
   * }, 'deferred');
   * // logs 'deferred' after one or more milliseconds
   */
  var defer = restParam(function(func, args) {
    return baseDelay(func, 1, args);
  });

  /**
   * Invokes `func` after `wait` milliseconds. Any additional arguments are
   * provided to `func` when it's invoked.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to delay.
   * @param {number} wait The number of milliseconds to delay invocation.
   * @param {...*} [args] The arguments to invoke the function with.
   * @returns {number} Returns the timer id.
   * @example
   *
   * _.delay(function(text) {
   *   console.log(text);
   * }, 1000, 'later');
   * // => logs 'later' after one second
   */
  var delay = restParam(function(func, wait, args) {
    return baseDelay(func, wait, args);
  });

  /**
   * Creates a function that returns the result of invoking the provided
   * functions with the `this` binding of the created function, where each
   * successive invocation is supplied the return value of the previous.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {...Function} [funcs] Functions to invoke.
   * @returns {Function} Returns the new function.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * var addSquare = _.flow(_.add, square);
   * addSquare(1, 2);
   * // => 9
   */
  var flow = createFlow();

  /**
   * This method is like `_.flow` except that it creates a function that
   * invokes the provided functions from right to left.
   *
   * @static
   * @memberOf _
   * @alias backflow, compose
   * @category Function
   * @param {...Function} [funcs] Functions to invoke.
   * @returns {Function} Returns the new function.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * var addSquare = _.flowRight(square, _.add);
   * addSquare(1, 2);
   * // => 9
   */
  var flowRight = createFlow(true);

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is coerced to a string and used as the
   * cache key. The `func` is invoked with the `this` binding of the memoized
   * function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoizing function.
   * @example
   *
   * var upperCase = _.memoize(function(string) {
   *   return string.toUpperCase();
   * });
   *
   * upperCase('fred');
   * // => 'FRED'
   *
   * // modifying the result cache
   * upperCase.cache.set('fred', 'BARNEY');
   * upperCase('fred');
   * // => 'BARNEY'
   *
   * // replacing `_.memoize.Cache`
   * var object = { 'user': 'fred' };
   * var other = { 'user': 'barney' };
   * var identity = _.memoize(_.identity);
   *
   * identity(object);
   * // => { 'user': 'fred' }
   * identity(other);
   * // => { 'user': 'fred' }
   *
   * _.memoize.Cache = WeakMap;
   * var identity = _.memoize(_.identity);
   *
   * identity(object);
   * // => { 'user': 'fred' }
   * identity(other);
   * // => { 'user': 'barney' }
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new memoize.Cache;
    return memoized;
  }

  /**
   * Creates a function that runs each argument through a corresponding
   * transform function.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to wrap.
   * @param {...(Function|Function[])} [transforms] The functions to transform
   * arguments, specified as individual functions or arrays of functions.
   * @returns {Function} Returns the new function.
   * @example
   *
   * function doubled(n) {
   *   return n * 2;
   * }
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * var modded = _.modArgs(function(x, y) {
   *   return [x, y];
   * }, square, doubled);
   *
   * modded(1, 2);
   * // => [1, 4]
   *
   * modded(5, 10);
   * // => [25, 20]
   */
  var modArgs = restParam(function(func, transforms) {
    transforms = baseFlatten(transforms);
    if (typeof func != 'function' || !arrayEvery(transforms, baseIsFunction)) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var length = transforms.length;
    return restParam(function(args) {
      var index = nativeMin(args.length, length);
      while (index--) {
        args[index] = transforms[index](args[index]);
      }
      return func.apply(this, args);
    });
  });

  /**
   * Creates a function that negates the result of the predicate `func`. The
   * `func` predicate is invoked with the `this` binding and arguments of the
   * created function.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} predicate The predicate to negate.
   * @returns {Function} Returns the new function.
   * @example
   *
   * function isEven(n) {
   *   return n % 2 == 0;
   * }
   *
   * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
   * // => [1, 3, 5]
   */
  function negate(predicate) {
    if (typeof predicate != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  /**
   * Creates a function that is restricted to invoking `func` once. Repeat calls
   * to the function return the value of the first call. The `func` is invoked
   * with the `this` binding and arguments of the created function.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // `initialize` invokes `createApplication` once
   */
  function once(func) {
    return before(2, func);
  }

  /**
   * Creates a function that invokes `func` with `partial` arguments prepended
   * to those provided to the new function. This method is like `_.bind` except
   * it does **not** alter the `this` binding.
   *
   * The `_.partial.placeholder` value, which defaults to `_` in monolithic
   * builds, may be used as a placeholder for partially applied arguments.
   *
   * **Note:** This method does not set the "length" property of partially
   * applied functions.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to partially apply arguments to.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * var greet = function(greeting, name) {
   *   return greeting + ' ' + name;
   * };
   *
   * var sayHelloTo = _.partial(greet, 'hello');
   * sayHelloTo('fred');
   * // => 'hello fred'
   *
   * // using placeholders
   * var greetFred = _.partial(greet, _, 'fred');
   * greetFred('hi');
   * // => 'hi fred'
   */
  var partial = createPartial(PARTIAL_FLAG);

  /**
   * This method is like `_.partial` except that partially applied arguments
   * are appended to those provided to the new function.
   *
   * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
   * builds, may be used as a placeholder for partially applied arguments.
   *
   * **Note:** This method does not set the "length" property of partially
   * applied functions.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to partially apply arguments to.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * var greet = function(greeting, name) {
   *   return greeting + ' ' + name;
   * };
   *
   * var greetFred = _.partialRight(greet, 'fred');
   * greetFred('hi');
   * // => 'hi fred'
   *
   * // using placeholders
   * var sayHelloTo = _.partialRight(greet, 'hello', _);
   * sayHelloTo('fred');
   * // => 'hello fred'
   */
  var partialRight = createPartial(PARTIAL_RIGHT_FLAG);

  /**
   * Creates a function that invokes `func` with arguments arranged according
   * to the specified indexes where the argument value at the first index is
   * provided as the first argument, the argument value at the second index is
   * provided as the second argument, and so on.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to rearrange arguments for.
   * @param {...(number|number[])} indexes The arranged argument indexes,
   *  specified as individual indexes or arrays of indexes.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var rearged = _.rearg(function(a, b, c) {
   *   return [a, b, c];
   * }, 2, 0, 1);
   *
   * rearged('b', 'c', 'a')
   * // => ['a', 'b', 'c']
   *
   * var map = _.rearg(_.map, [1, 0]);
   * map(function(n) {
   *   return n * 3;
   * }, [1, 2, 3]);
   * // => [3, 6, 9]
   */
  var rearg = restParam(function(func, indexes) {
    return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
  });

  /**
   * Creates a function that invokes `func` with the `this` binding of the
   * created function and arguments from `start` and beyond provided as an array.
   *
   * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var say = _.restParam(function(what, names) {
   *   return what + ' ' + _.initial(names).join(', ') +
   *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
   * });
   *
   * say('hello', 'fred', 'barney', 'pebbles');
   * // => 'hello fred, barney, & pebbles'
   */
  function restParam(func, start) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          rest = Array(length);

      while (++index < length) {
        rest[index] = args[start + index];
      }
      switch (start) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, args[0], rest);
        case 2: return func.call(this, args[0], args[1], rest);
      }
      var otherArgs = Array(start + 1);
      index = -1;
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = rest;
      return func.apply(this, otherArgs);
    };
  }

  /**
   * Creates a function that invokes `func` with the `this` binding of the created
   * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
   *
   * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/Web/JavaScript/Reference/Operators/Spread_operator).
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to spread arguments over.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var say = _.spread(function(who, what) {
   *   return who + ' says ' + what;
   * });
   *
   * say(['fred', 'hello']);
   * // => 'fred says hello'
   *
   * // with a Promise
   * var numbers = Promise.all([
   *   Promise.resolve(40),
   *   Promise.resolve(36)
   * ]);
   *
   * numbers.then(_.spread(function(x, y) {
   *   return x + y;
   * }));
   * // => a Promise of 76
   */
  function spread(func) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    return function(array) {
      return func.apply(this, array);
    };
  }

  /**
   * Creates a throttled function that only invokes `func` at most once per
   * every `wait` milliseconds. The throttled function comes with a `cancel`
   * method to cancel delayed invocations. Provide an options object to indicate
   * that `func` should be invoked on the leading and/or trailing edge of the
   * `wait` timeout. Subsequent calls to the throttled function return the
   * result of the last `func` call.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
   * on the trailing edge of the timeout only if the the throttled function is
   * invoked more than once during the `wait` timeout.
   *
   * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
   * for details over the differences between `_.throttle` and `_.debounce`.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to throttle.
   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
   * @param {Object} [options] The options object.
   * @param {boolean} [options.leading=true] Specify invoking on the leading
   *  edge of the timeout.
   * @param {boolean} [options.trailing=true] Specify invoking on the trailing
   *  edge of the timeout.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * // avoid excessively updating the position while scrolling
   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
   *
   * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
   * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
   *   'trailing': false
   * }));
   *
   * // cancel a trailing throttled call
   * jQuery(window).on('popstate', throttled.cancel);
   */
  function throttle(func, wait, options) {
    var leading = true,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (options === false) {
      leading = false;
    } else if (isObject(options)) {
      leading = 'leading' in options ? !!options.leading : leading;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
  }

  /**
   * Creates a function that provides `value` to the wrapper function as its
   * first argument. Any additional arguments provided to the function are
   * appended to those provided to the wrapper function. The wrapper is invoked
   * with the `this` binding of the created function.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {*} value The value to wrap.
   * @param {Function} wrapper The wrapper function.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var p = _.wrap(_.escape, function(func, text) {
   *   return '<p>' + func(text) + '</p>';
   * });
   *
   * p('fred, barney, & pebbles');
   * // => '<p>fred, barney, &amp; pebbles</p>'
   */
  function wrap(value, wrapper) {
    wrapper = wrapper == null ? identity : wrapper;
    return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], []);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `value` is classified as an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return isObjectLike(value) && isArrayLike(value) &&
      hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(function() { return arguments; }());
   * // => false
   */
  var isArray = nativeIsArray || function(value) {
    return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
  };

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in older versions of Chrome and Safari which return 'function' for regexes
    // and Safari 8 which returns 'object' for typed array constructors.
    return isObject(value) && objToString.call(value) == funcTag;
  }

  /**
   * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is a native function.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
   * @example
   *
   * _.isNative(Array.prototype.push);
   * // => true
   *
   * _.isNative(_);
   * // => false
   */
  function isNative(value) {
    if (value == null) {
      return false;
    }
    if (isFunction(value)) {
      return reIsNative.test(fnToString.call(value));
    }
    return isObjectLike(value) && (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
  }

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array of function property names from all enumerable properties,
   * own and inherited, of `object`.
   *
   * @static
   * @memberOf _
   * @alias methods
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the new array of property names.
   * @example
   *
   * _.functions(_);
   * // => ['after', 'ary', 'assign', ...]
   */
  function functions(object) {
    return baseFunctions(object, keysIn(object));
  }

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    if (object == null) {
      return [];
    }
    if (!isObject(object)) {
      object = Object(object);
    }
    var length = object.length,
        support = lodash.support;

    length = (length && isLength(length) &&
      (isArray(object) || isArguments(object) || isString(object)) && length) || 0;

    var Ctor = object.constructor,
        index = -1,
        proto = (isFunction(Ctor) && Ctor.prototype) || objectProto,
        isProto = proto === object,
        result = Array(length),
        skipIndexes = length > 0,
        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error),
        skipProto = support.enumPrototypes && isFunction(object);

    while (++index < length) {
      result[index] = (index + '');
    }
    // lodash skips the `constructor` property when it infers it's iterating
    // over a `prototype` object because IE < 9 can't set the `[[Enumerable]]`
    // attribute of an existing property and the `constructor` property of a
    // prototype defaults to non-enumerable.
    for (var key in object) {
      if (!(skipProto && key == 'prototype') &&
          !(skipErrorProps && (key == 'message' || key == 'name')) &&
          !(skipIndexes && isIndex(key, length)) &&
          !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    if (support.nonEnumShadows && object !== objectProto) {
      var tag = object === stringProto ? stringTag : (object === errorProto ? errorTag : objToString.call(object)),
          nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];

      if (tag == objectTag) {
        proto = objectProto;
      }
      length = shadowProps.length;
      while (length--) {
        key = shadowProps[length];
        var nonEnum = nonEnums[key];
        if (!(isProto && nonEnum) &&
            (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
          result.push(key);
        }
      }
    }
    return result;
  }

  /*------------------------------------------------------------------------*/

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * A no-operation function that returns `undefined` regardless of the
   * arguments it receives.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * _.noop(object) === undefined;
   * // => true
   */
  function noop() {
    // No operation performed.
  }

  /*------------------------------------------------------------------------*/

  LodashWrapper.prototype = baseCreate(baseLodash.prototype);
  LodashWrapper.prototype.constructor = LodashWrapper;

  LazyWrapper.prototype = baseCreate(baseLodash.prototype);
  LazyWrapper.prototype.constructor = LazyWrapper;

  // Add functions to the `Map` cache.
  MapCache.prototype['delete'] = mapDelete;
  MapCache.prototype.get = mapGet;
  MapCache.prototype.has = mapHas;
  MapCache.prototype.set = mapSet;

  // Assign cache to `_.memoize`.
  memoize.Cache = MapCache;

  // Add functions that return wrapped values when chaining.
  lodash.after = after;
  lodash.ary = ary;
  lodash.before = before;
  lodash.bind = bind;
  lodash.bindAll = bindAll;
  lodash.bindKey = bindKey;
  lodash.curry = curry;
  lodash.curryRight = curryRight;
  lodash.debounce = debounce;
  lodash.defer = defer;
  lodash.delay = delay;
  lodash.flow = flow;
  lodash.flowRight = flowRight;
  lodash.functions = functions;
  lodash.keysIn = keysIn;
  lodash.memoize = memoize;
  lodash.modArgs = modArgs;
  lodash.negate = negate;
  lodash.once = once;
  lodash.partial = partial;
  lodash.partialRight = partialRight;
  lodash.rearg = rearg;
  lodash.restParam = restParam;
  lodash.spread = spread;
  lodash.throttle = throttle;
  lodash.wrap = wrap;

  // Add aliases.
  lodash.backflow = flowRight;
  lodash.compose = flowRight;
  lodash.methods = functions;

  /*------------------------------------------------------------------------*/

  // Add functions that return unwrapped values when chaining.
  lodash.identity = identity;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isFunction = isFunction;
  lodash.isNative = isNative;
  lodash.isObject = isObject;
  lodash.isString = isString;
  lodash.noop = noop;
  lodash.now = now;

  /*------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
  lodash.VERSION = VERSION;

  // Assign default placeholders.
  arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
    lodash[methodName].placeholder = lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = lodash;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return lodash;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = lodash)._ = lodash;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports._ = lodash;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._=root._ || {};
    root._.func = lodash;
  }
}.call(this));
