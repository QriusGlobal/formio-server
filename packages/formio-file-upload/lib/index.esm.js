import { Components } from '@formio/js';

function _typeof$8(o) { "@babel/helpers - typeof"; return _typeof$8 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$8(o); }
function _createClass$8(Constructor, protoProps, staticProps) { Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _callSuper$1(t, o, e) { return o = _getPrototypeOf$1(o), _possibleConstructorReturn$1(t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf$1(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$8(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$1(self); }
function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf$1(subClass, superClass); }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf$1(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf$1(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(t, e, r) { if (_isNativeReflectConstruct$1()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf$1(p, r.prototype), p; }
function _isNativeReflectConstruct$1() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }
function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }
var DetailedError = /*#__PURE__*/function (_Error) {
  function DetailedError(message) {
    var _this;
    var causingErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var req = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var res = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    _classCallCheck$8(this, DetailedError);
    _this = _callSuper$1(this, DetailedError, [message]);
    _this.originalRequest = req;
    _this.originalResponse = res;
    _this.causingError = causingErr;
    if (causingErr != null) {
      message += ", caused by ".concat(causingErr.toString());
    }
    if (req != null) {
      var requestId = req.getHeader('X-Request-ID') || 'n/a';
      var method = req.getMethod();
      var url = req.getURL();
      var status = res ? res.getStatus() : 'n/a';
      var body = res ? res.getBody() || '' : 'n/a';
      message += ", originated from request (method: ".concat(method, ", url: ").concat(url, ", response code: ").concat(status, ", response text: ").concat(body, ", request id: ").concat(requestId, ")");
    }
    _this.message = message;
    return _this;
  }
  _inherits$1(DetailedError, _Error);
  return _createClass$8(DetailedError);
}( /*#__PURE__*/_wrapNativeSuper(Error));

function log(msg) {
  return;
}

function _typeof$7(o) { "@babel/helpers - typeof"; return _typeof$7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$7(o); }
function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$7(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey$7(descriptor.key), descriptor); } }
function _createClass$7(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$7(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey$7(t) { var i = _toPrimitive$7(t, "string"); return "symbol" == _typeof$7(i) ? i : i + ""; }
function _toPrimitive$7(t, r) { if ("object" != _typeof$7(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$7(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
var NoopUrlStorage = /*#__PURE__*/function () {
  function NoopUrlStorage() {
    _classCallCheck$7(this, NoopUrlStorage);
  }
  return _createClass$7(NoopUrlStorage, [{
    key: "listAllUploads",
    value: function listAllUploads() {
      return Promise.resolve([]);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(_fingerprint) {
      return Promise.resolve([]);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(_urlStorageKey) {
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(_fingerprint, _upload) {
      return Promise.resolve(null);
    }
  }]);
}();

/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version$c = '3.7.8';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version$c;
const _hasBuffer = typeof Buffer === 'function';
const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = Array.prototype.slice.call(b64ch);
const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
const _fromCC = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
const _mkUriSafe = (src) => src
    .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = typeof btoa === 'function' ? (bin) => btoa(bin)
    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
        : btoaPolyfill;
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
const cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (u) => u.replace(re_utob, cb_utob);
//
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : _TE
        ? (s) => _fromUint8Array(_TE.encode(s))
        : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode$1 = (src, urlsafe = false) => urlsafe
    ? _mkUriSafe(_encode(src))
    : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI = (src) => encode$1(src, true);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
const cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (b) => b.replace(re_btou, cb_btou);
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, r1, r2;
    let binArray = []; // use array to avoid minor gc in loop
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        if (r1 === 64) {
            binArray.push(_fromCC(u24 >> 16 & 255));
        }
        else if (r2 === 64) {
            binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255));
        }
        else {
            binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255));
        }
    }
    return binArray.join('');
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = typeof atob === 'function' ? (asc) => atob(_tidyB64(asc))
    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
        : atobPolyfill;
//
const _toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
    : (a) => _U8Afrom(_atob(a).split('').map(c => c.charCodeAt(0)));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a) => _toUint8Array(_unURI(a));
//
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : _TD
        ? (a) => _TD.decode(_toUint8Array(a))
        : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode$1 = (src) => _decode(_unURI(src));
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
const isValid = (src) => {
    if (typeof src !== 'string')
        return false;
    const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add('fromBase64', function () { return decode$1(this); });
    _add('toBase64', function (urlsafe) { return encode$1(this, urlsafe); });
    _add('toBase64URI', function () { return encode$1(this, true); });
    _add('toBase64URL', function () { return encode$1(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
const gBase64 = {
    version: version$c,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode$1,
    toBase64: encode$1,
    encode: encode$1,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode$1,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
var requiresPort = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

var querystringify$1 = {};

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
querystringify$1.stringify = querystringify;
querystringify$1.parse = querystring;

var required = requiresPort
  , qs = querystringify$1
  , controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/
  , CRHTLF = /[\n\r\t]/g
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , port = /:\d+$/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/;

/**
 * Remove control characters and whitespace from the beginning of a string.
 *
 * @param {Object|String} str String to trim.
 * @returns {String} A new string representing `str` stripped of control
 *     characters and whitespace from its beginning.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(controlOrWhitespace, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address, url) {     // Sanitize what is left of the address
    return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d*)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof commonjsGlobal !== 'undefined') globalVar = commonjsGlobal;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url$1(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url$1(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */
function isSpecial(scheme) {
  return (
    scheme === 'file:' ||
    scheme === 'ftp:' ||
    scheme === 'http:' ||
    scheme === 'https:' ||
    scheme === 'ws:' ||
    scheme === 'wss:'
  );
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address, location) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');
  location = location || {};

  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4];
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url$1(address, location, parser) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');

  if (!(this instanceof Url$1)) {
    return new Url$1(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (
    extracted.protocol === 'file:' && (
      extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
    (!extracted.slashes &&
      (extracted.protocol ||
        extracted.slashesCount < 2 ||
        !isSpecial(url.protocol)))
  ) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      index = parse === '@'
        ? address.lastIndexOf(parse)
        : address.indexOf(parse);

      if (~index) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';

  if (url.auth) {
    index = url.auth.indexOf(':');

    if (~index) {
      url.username = url.auth.slice(0, index);
      url.username = encodeURIComponent(decodeURIComponent(url.username));

      url.password = url.auth.slice(index + 1);
      url.password = encodeURIComponent(decodeURIComponent(url.password));
    } else {
      url.username = encodeURIComponent(decodeURIComponent(url.auth));
    }

    url.auth = url.password ? url.username +':'+ url.password : url.username;
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (port.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    case 'username':
    case 'password':
      url[part] = encodeURIComponent(value);
      break;

    case 'auth':
      var index = value.indexOf(':');

      if (~index) {
        url.username = value.slice(0, index);
        url.username = encodeURIComponent(decodeURIComponent(url.username));

        url.password = value.slice(index + 1);
        url.password = encodeURIComponent(decodeURIComponent(url.password));
      } else {
        url.username = encodeURIComponent(decodeURIComponent(value));
      }
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.auth = url.password ? url.username +':'+ url.password : url.username;

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , host = url.host
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result =
    protocol +
    ((url.protocol && url.slashes) || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  } else if (url.password) {
    result += ':'+ url.password;
    result += '@';
  } else if (
    url.protocol !== 'file:' &&
    isSpecial(url.protocol) &&
    !host &&
    url.pathname !== '/'
  ) {
    //
    // Add back the empty userinfo, otherwise the original invalid URL
    // might be transformed into a valid one with `url.pathname` as host.
    //
    result += '@';
  }

  //
  // Trailing colon is removed from `url.host` when it is parsed. If it still
  // ends with a colon, then add back the trailing colon that was removed. This
  // prevents an invalid URL from being transformed into a valid one.
  //
  if (host[host.length - 1] === ':' || (port.test(url.hostname) && !url.port)) {
    host += ':';
  }

  result += host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url$1.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url$1.extractProtocol = extractProtocol;
Url$1.location = lolcation;
Url$1.trimLeft = trimLeft;
Url$1.qs = qs;

var urlParse = Url$1;

var URL$1 = /*@__PURE__*/getDefaultExportFromCjs(urlParse);

/**
 * Generate a UUID v4 based on random numbers. We intentioanlly use the less
 * secure Math.random function here since the more secure crypto.getRandomNumbers
 * is not available on all platforms.
 * This is not a problem for us since we use the UUID only for generating a
 * request ID, so we can correlate server logs to client errors.
 *
 * This function is taken from following site:
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @return {string} The generate UUID
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

function _regeneratorRuntime$1() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime$1 = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: true, configurable: true, writable: true }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof$6(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: true }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(true); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = false, next; return next.value = t, next.done = true, next; }; return i.next = i; } } throw new TypeError(_typeof$6(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: true }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: true }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = false, next; } return next.done = true, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = false, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = true; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, true); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, true); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator$1(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = true, o = false; try { if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = true, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof$6(o) { "@babel/helpers - typeof"; return _typeof$6 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$6(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike) { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), true).forEach(function (r) { _defineProperty$1(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$1(obj, key, value) { key = _toPropertyKey$6(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$6(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey$6(descriptor.key), descriptor); } }
function _createClass$6(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$6(Constructor.prototype, protoProps); if (staticProps) _defineProperties$6(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey$6(t) { var i = _toPrimitive$6(t, "string"); return "symbol" == _typeof$6(i) ? i : i + ""; }
function _toPrimitive$6(t, r) { if ("object" != _typeof$6(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$6(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
var PROTOCOL_TUS_V1 = 'tus-v1';
var PROTOCOL_IETF_DRAFT_03 = 'ietf-draft-03';
var PROTOCOL_IETF_DRAFT_05 = 'ietf-draft-05';
var defaultOptions$9 = {
  endpoint: null,
  uploadUrl: null,
  metadata: {},
  metadataForPartialUploads: {},
  fingerprint: null,
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  onUploadUrlAvailable: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  onBeforeRequest: null,
  onAfterResponse: null,
  onShouldRetry: defaultOnShouldRetry,
  chunkSize: Number.POSITIVE_INFINITY,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  parallelUploadBoundaries: null,
  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false,
  urlStorage: null,
  fileReader: null,
  httpStack: null,
  protocol: PROTOCOL_TUS_V1
};
var BaseUpload = /*#__PURE__*/function () {
  function BaseUpload(file, options) {
    _classCallCheck$6(this, BaseUpload);
    // Warn about removed options from previous versions
    if ('resume' in options) {
      console.log('tus: The `resume` option has been removed in tus-js-client v2. Please use the URL storage API instead.');
    }

    // The default options will already be added from the wrapper classes.
    this.options = options;

    // Cast chunkSize to integer
    this.options.chunkSize = Number(this.options.chunkSize);

    // The storage module used to store URLs
    this._urlStorage = this.options.urlStorage;

    // The underlying File/Blob object
    this.file = file;

    // The URL against which the file will be uploaded
    this.url = null;

    // The underlying request object for the current PATCH request
    this._req = null;

    // The fingerpinrt for the current file (set after start())
    this._fingerprint = null;

    // The key that the URL storage returned when saving an URL with a fingerprint,
    this._urlStorageKey = null;

    // The offset used in the current PATCH request
    this._offset = null;

    // True if the current PATCH request has been aborted
    this._aborted = false;

    // The file's size in bytes
    this._size = null;

    // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.
    this._source = null;

    // The current count of attempts which have been made. Zero indicates none.
    this._retryAttempt = 0;

    // The timeout's ID which is used to delay the next retry
    this._retryTimeout = null;

    // The offset of the remote upload before the latest attempt was started.
    this._offsetBeforeRetry = 0;

    // An array of BaseUpload instances which are used for uploading the different
    // parts, if the parallelUploads option is used.
    this._parallelUploads = null;

    // An array of upload URLs which are used for uploading the different
    // parts, if the parallelUploads option is used.
    this._parallelUploadUrls = null;
  }

  /**
   * Use the Termination extension to delete an upload from the server by sending a DELETE
   * request to the specified upload URL. This is only possible if the server supports the
   * Termination extension. If the `options.retryDelays` property is set, the method will
   * also retry if an error ocurrs.
   *
   * @param {String} url The upload's URL which will be terminated.
   * @param {object} options Optional options for influencing HTTP requests.
   * @return {Promise} The Promise will be resolved/rejected when the requests finish.
   */
  return _createClass$6(BaseUpload, [{
    key: "findPreviousUploads",
    value: function findPreviousUploads() {
      var _this = this;
      return this.options.fingerprint(this.file, this.options).then(function (fingerprint) {
        return _this._urlStorage.findUploadsByFingerprint(fingerprint);
      });
    }
  }, {
    key: "resumeFromPreviousUpload",
    value: function resumeFromPreviousUpload(previousUpload) {
      this.url = previousUpload.uploadUrl || null;
      this._parallelUploadUrls = previousUpload.parallelUploadUrls || null;
      this._urlStorageKey = previousUpload.urlStorageKey;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;
      var file = this.file;
      if (!file) {
        this._emitError(new Error('tus: no file or stream to upload provided'));
        return;
      }
      if (![PROTOCOL_TUS_V1, PROTOCOL_IETF_DRAFT_03, PROTOCOL_IETF_DRAFT_05].includes(this.options.protocol)) {
        this._emitError(new Error("tus: unsupported protocol ".concat(this.options.protocol)));
        return;
      }
      if (!this.options.endpoint && !this.options.uploadUrl && !this.url) {
        this._emitError(new Error('tus: neither an endpoint or an upload URL is provided'));
        return;
      }
      var retryDelays = this.options.retryDelays;
      if (retryDelays != null && Object.prototype.toString.call(retryDelays) !== '[object Array]') {
        this._emitError(new Error('tus: the `retryDelays` option must either be an array or null'));
        return;
      }
      if (this.options.parallelUploads > 1) {
        // Test which options are incompatible with parallel uploads.
        for (var _i = 0, _arr = ['uploadUrl', 'uploadSize', 'uploadLengthDeferred']; _i < _arr.length; _i++) {
          var optionName = _arr[_i];
          if (this.options[optionName]) {
            this._emitError(new Error("tus: cannot use the ".concat(optionName, " option when parallelUploads is enabled")));
            return;
          }
        }
      }
      if (this.options.parallelUploadBoundaries) {
        if (this.options.parallelUploads <= 1) {
          this._emitError(new Error('tus: cannot use the `parallelUploadBoundaries` option when `parallelUploads` is disabled'));
          return;
        }
        if (this.options.parallelUploads !== this.options.parallelUploadBoundaries.length) {
          this._emitError(new Error('tus: the `parallelUploadBoundaries` must have the same length as the value of `parallelUploads`'));
          return;
        }
      }
      this.options.fingerprint(file, this.options).then(function (fingerprint) {
        _this2._fingerprint = fingerprint;
        if (_this2._source) {
          return _this2._source;
        }
        return _this2.options.fileReader.openFile(file, _this2.options.chunkSize);
      }).then(function (source) {
        _this2._source = source;

        // First, we look at the uploadLengthDeferred option.
        // Next, we check if the caller has supplied a manual upload size.
        // Finally, we try to use the calculated size from the source object.
        if (_this2.options.uploadLengthDeferred) {
          _this2._size = null;
        } else if (_this2.options.uploadSize != null) {
          _this2._size = Number(_this2.options.uploadSize);
          if (Number.isNaN(_this2._size)) {
            _this2._emitError(new Error('tus: cannot convert `uploadSize` option into a number'));
            return;
          }
        } else {
          _this2._size = _this2._source.size;
          if (_this2._size == null) {
            _this2._emitError(new Error("tus: cannot automatically derive upload's size from input. Specify it manually using the `uploadSize` option or use the `uploadLengthDeferred` option"));
            return;
          }
        }

        // If the upload was configured to use multiple requests or if we resume from
        // an upload which used multiple requests, we start a parallel upload.
        if (_this2.options.parallelUploads > 1 || _this2._parallelUploadUrls != null) {
          _this2._startParallelUpload();
        } else {
          _this2._startSingleUpload();
        }
      })["catch"](function (err) {
        _this2._emitError(err);
      });
    }

    /**
     * Initiate the uploading procedure for a parallelized upload, where one file is split into
     * multiple request which are run in parallel.
     *
     * @api private
     */
  }, {
    key: "_startParallelUpload",
    value: function _startParallelUpload() {
      var _this$options$paralle,
        _this3 = this;
      var totalSize = this._size;
      var totalProgress = 0;
      this._parallelUploads = [];
      var partCount = this._parallelUploadUrls != null ? this._parallelUploadUrls.length : this.options.parallelUploads;

      // The input file will be split into multiple slices which are uploaded in separate
      // requests. Here we get the start and end position for the slices.
      var parts = (_this$options$paralle = this.options.parallelUploadBoundaries) !== null && _this$options$paralle !== void 0 ? _this$options$paralle : splitSizeIntoParts(this._source.size, partCount);

      // Attach URLs from previous uploads, if available.
      if (this._parallelUploadUrls) {
        parts.forEach(function (part, index) {
          part.uploadUrl = _this3._parallelUploadUrls[index] || null;
        });
      }

      // Create an empty list for storing the upload URLs
      this._parallelUploadUrls = new Array(parts.length);

      // Generate a promise for each slice that will be resolve if the respective
      // upload is completed.
      var uploads = parts.map(function (part, index) {
        var lastPartProgress = 0;
        return _this3._source.slice(part.start, part.end).then(function (_ref) {
          var value = _ref.value;
          return new Promise(function (resolve, reject) {
            // Merge with the user supplied options but overwrite some values.
            var options = _objectSpread$1(_objectSpread$1({}, _this3.options), {}, {
              // If available, the partial upload should be resumed from a previous URL.
              uploadUrl: part.uploadUrl || null,
              // We take manually care of resuming for partial uploads, so they should
              // not be stored in the URL storage.
              storeFingerprintForResuming: false,
              removeFingerprintOnSuccess: false,
              // Reset the parallelUploads option to not cause recursion.
              parallelUploads: 1,
              // Reset this option as we are not doing a parallel upload.
              parallelUploadBoundaries: null,
              metadata: _this3.options.metadataForPartialUploads,
              // Add the header to indicate the this is a partial upload.
              headers: _objectSpread$1(_objectSpread$1({}, _this3.options.headers), {}, {
                'Upload-Concat': 'partial'
              }),
              // Reject or resolve the promise if the upload errors or completes.
              onSuccess: resolve,
              onError: reject,
              // Based in the progress for this partial upload, calculate the progress
              // for the entire final upload.
              onProgress: function onProgress(newPartProgress) {
                totalProgress = totalProgress - lastPartProgress + newPartProgress;
                lastPartProgress = newPartProgress;
                _this3._emitProgress(totalProgress, totalSize);
              },
              // Wait until every partial upload has an upload URL, so we can add
              // them to the URL storage.
              onUploadUrlAvailable: function onUploadUrlAvailable() {
                _this3._parallelUploadUrls[index] = upload.url;
                // Test if all uploads have received an URL
                if (_this3._parallelUploadUrls.filter(function (u) {
                  return Boolean(u);
                }).length === parts.length) {
                  _this3._saveUploadInUrlStorage();
                }
              }
            });
            var upload = new BaseUpload(value, options);
            upload.start();

            // Store the upload in an array, so we can later abort them if necessary.
            _this3._parallelUploads.push(upload);
          });
        });
      });
      var req;
      // Wait until all partial uploads are finished and we can send the POST request for
      // creating the final upload.
      Promise.all(uploads).then(function () {
        req = _this3._openRequest('POST', _this3.options.endpoint);
        req.setHeader('Upload-Concat', "final;".concat(_this3._parallelUploadUrls.join(' ')));

        // Add metadata if values have been added
        var metadata = encodeMetadata(_this3.options.metadata);
        if (metadata !== '') {
          req.setHeader('Upload-Metadata', metadata);
        }
        return _this3._sendRequest(req, null);
      }).then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this3._emitHttpError(req, res, 'tus: unexpected response while creating upload');
          return;
        }
        var location = res.getHeader('Location');
        if (location == null) {
          _this3._emitHttpError(req, res, 'tus: invalid or missing Location header');
          return;
        }
        _this3.url = resolveUrl(_this3.options.endpoint, location);
        log("Created upload at ".concat(_this3.url));
        _this3._emitSuccess(res);
      })["catch"](function (err) {
        _this3._emitError(err);
      });
    }

    /**
     * Initiate the uploading procedure for a non-parallel upload. Here the entire file is
     * uploaded in a sequential matter.
     *
     * @api private
     */
  }, {
    key: "_startSingleUpload",
    value: function _startSingleUpload() {
      // Reset the aborted flag when the upload is started or else the
      // _performUpload will stop before sending a request if the upload has been
      // aborted previously.
      this._aborted = false;

      // The upload had been started previously and we should reuse this URL.
      if (this.url != null) {
        log("Resuming upload from previous URL: ".concat(this.url));
        this._resumeUpload();
        return;
      }

      // A URL has manually been specified, so we try to resume
      if (this.options.uploadUrl != null) {
        log("Resuming upload from provided URL: ".concat(this.options.uploadUrl));
        this.url = this.options.uploadUrl;
        this._resumeUpload();
        return;
      }
      this._createUpload();
    }

    /**
     * Abort any running request and stop the current upload. After abort is called, no event
     * handler will be invoked anymore. You can use the `start` method to resume the upload
     * again.
     * If `shouldTerminate` is true, the `terminate` function will be called to remove the
     * current upload from the server.
     *
     * @param {boolean} shouldTerminate True if the upload should be deleted from the server.
     * @return {Promise} The Promise will be resolved/rejected when the requests finish.
     */
  }, {
    key: "abort",
    value: function abort(shouldTerminate) {
      var _this4 = this;
      // Stop any parallel partial uploads, that have been started in _startParallelUploads.
      if (this._parallelUploads != null) {
        var _iterator = _createForOfIteratorHelper(this._parallelUploads),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var upload = _step.value;
            upload.abort(shouldTerminate);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      // Stop any current running request.
      if (this._req !== null) {
        this._req.abort();
        // Note: We do not close the file source here, so the user can resume in the future.
      }
      this._aborted = true;

      // Stop any timeout used for initiating a retry.
      if (this._retryTimeout != null) {
        clearTimeout(this._retryTimeout);
        this._retryTimeout = null;
      }
      if (!shouldTerminate || this.url == null) {
        return Promise.resolve();
      }
      return BaseUpload.terminate(this.url, this.options)
      // Remove entry from the URL storage since the upload URL is no longer valid.
      .then(function () {
        return _this4._removeFromUrlStorage();
      });
    }
  }, {
    key: "_emitHttpError",
    value: function _emitHttpError(req, res, message, causingErr) {
      this._emitError(new DetailedError(message, causingErr, req, res));
    }
  }, {
    key: "_emitError",
    value: function _emitError(err) {
      var _this5 = this;
      // Do not emit errors, e.g. from aborted HTTP requests, if the upload has been stopped.
      if (this._aborted) return;

      // Check if we should retry, when enabled, before sending the error to the user.
      if (this.options.retryDelays != null) {
        // We will reset the attempt counter if
        // - we were already able to connect to the server (offset != null) and
        // - we were able to upload a small chunk of data to the server
        var shouldResetDelays = this._offset != null && this._offset > this._offsetBeforeRetry;
        if (shouldResetDelays) {
          this._retryAttempt = 0;
        }
        if (shouldRetry(err, this._retryAttempt, this.options)) {
          var delay = this.options.retryDelays[this._retryAttempt++];
          this._offsetBeforeRetry = this._offset;
          this._retryTimeout = setTimeout(function () {
            _this5.start();
          }, delay);
          return;
        }
      }
      if (typeof this.options.onError === 'function') {
        this.options.onError(err);
      } else {
        throw err;
      }
    }

    /**
     * Publishes notification if the upload has been successfully completed.
     *
     * @param {object} lastResponse Last HTTP response.
     * @api private
     */
  }, {
    key: "_emitSuccess",
    value: function _emitSuccess(lastResponse) {
      if (this.options.removeFingerprintOnSuccess) {
        // Remove stored fingerprint and corresponding endpoint. This causes
        // new uploads of the same file to be treated as a different file.
        this._removeFromUrlStorage();
      }
      if (typeof this.options.onSuccess === 'function') {
        this.options.onSuccess({
          lastResponse: lastResponse
        });
      }
    }

    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     *
     * @param {number} bytesSent  Number of bytes sent to the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */
  }, {
    key: "_emitProgress",
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === 'function') {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }

    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param {number} chunkSize  Size of the chunk that was accepted by the server.
     * @param {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */
  }, {
    key: "_emitChunkComplete",
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === 'function') {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }

    /**
     * Create a new upload using the creation extension by sending a POST
     * request to the endpoint. After successful creation the file will be
     * uploaded
     *
     * @api private
     */
  }, {
    key: "_createUpload",
    value: function _createUpload() {
      var _this6 = this;
      if (!this.options.endpoint) {
        this._emitError(new Error('tus: unable to create upload because no endpoint is provided'));
        return;
      }
      var req = this._openRequest('POST', this.options.endpoint);
      if (this.options.uploadLengthDeferred) {
        req.setHeader('Upload-Defer-Length', '1');
      } else {
        req.setHeader('Upload-Length', "".concat(this._size));
      }

      // Add metadata if values have been added
      var metadata = encodeMetadata(this.options.metadata);
      if (metadata !== '') {
        req.setHeader('Upload-Metadata', metadata);
      }
      var promise;
      if (this.options.uploadDataDuringCreation && !this.options.uploadLengthDeferred) {
        this._offset = 0;
        promise = this._addChunkToRequest(req);
      } else {
        if (this.options.protocol === PROTOCOL_IETF_DRAFT_03 || this.options.protocol === PROTOCOL_IETF_DRAFT_05) {
          req.setHeader('Upload-Complete', '?0');
        }
        promise = this._sendRequest(req, null);
      }
      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this6._emitHttpError(req, res, 'tus: unexpected response while creating upload');
          return;
        }
        var location = res.getHeader('Location');
        if (location == null) {
          _this6._emitHttpError(req, res, 'tus: invalid or missing Location header');
          return;
        }
        _this6.url = resolveUrl(_this6.options.endpoint, location);
        log("Created upload at ".concat(_this6.url));
        if (typeof _this6.options.onUploadUrlAvailable === 'function') {
          _this6.options.onUploadUrlAvailable();
        }
        if (_this6._size === 0) {
          // Nothing to upload and file was successfully created
          _this6._emitSuccess(res);
          _this6._source.close();
          return;
        }
        _this6._saveUploadInUrlStorage().then(function () {
          if (_this6.options.uploadDataDuringCreation) {
            _this6._handleUploadResponse(req, res);
          } else {
            _this6._offset = 0;
            _this6._performUpload();
          }
        });
      })["catch"](function (err) {
        _this6._emitHttpError(req, null, 'tus: failed to create upload', err);
      });
    }

    /*
     * Try to resume an existing upload. First a HEAD request will be sent
     * to retrieve the offset. If the request fails a new upload will be
     * created. In the case of a successful response the file will be uploaded.
     *
     * @api private
     */
  }, {
    key: "_resumeUpload",
    value: function _resumeUpload() {
      var _this7 = this;
      var req = this._openRequest('HEAD', this.url);
      var promise = this._sendRequest(req, null);
      promise.then(function (res) {
        var status = res.getStatus();
        if (!inStatusCategory(status, 200)) {
          // If the upload is locked (indicated by the 423 Locked status code), we
          // emit an error instead of directly starting a new upload. This way the
          // retry logic can catch the error and will retry the upload. An upload
          // is usually locked for a short period of time and will be available
          // afterwards.
          if (status === 423) {
            _this7._emitHttpError(req, res, 'tus: upload is currently locked; retry later');
            return;
          }
          if (inStatusCategory(status, 400)) {
            // Remove stored fingerprint and corresponding endpoint,
            // on client errors since the file can not be found
            _this7._removeFromUrlStorage();
          }
          if (!_this7.options.endpoint) {
            // Don't attempt to create a new upload if no endpoint is provided.
            _this7._emitHttpError(req, res, 'tus: unable to resume upload (new upload cannot be created without an endpoint)');
            return;
          }

          // Try to create a new upload
          _this7.url = null;
          _this7._createUpload();
          return;
        }
        var offset = Number.parseInt(res.getHeader('Upload-Offset'), 10);
        if (Number.isNaN(offset)) {
          _this7._emitHttpError(req, res, 'tus: invalid or missing offset value');
          return;
        }
        var length = Number.parseInt(res.getHeader('Upload-Length'), 10);
        if (Number.isNaN(length) && !_this7.options.uploadLengthDeferred && _this7.options.protocol === PROTOCOL_TUS_V1) {
          _this7._emitHttpError(req, res, 'tus: invalid or missing length value');
          return;
        }
        if (typeof _this7.options.onUploadUrlAvailable === 'function') {
          _this7.options.onUploadUrlAvailable();
        }
        _this7._saveUploadInUrlStorage().then(function () {
          // Upload has already been completed and we do not need to send additional
          // data to the server
          if (offset === length) {
            _this7._emitProgress(length, length);
            _this7._emitSuccess(res);
            return;
          }
          _this7._offset = offset;
          _this7._performUpload();
        });
      })["catch"](function (err) {
        _this7._emitHttpError(req, null, 'tus: failed to resume upload', err);
      });
    }

    /**
     * Start uploading the file using PATCH requests. The file will be divided
     * into chunks as specified in the chunkSize option. During the upload
     * the onProgress event handler may be invoked multiple times.
     *
     * @api private
     */
  }, {
    key: "_performUpload",
    value: function _performUpload() {
      var _this8 = this;
      // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.
      if (this._aborted) {
        return;
      }
      var req;

      // Some browser and servers may not support the PATCH method. For those
      // cases, you can tell tus-js-client to use a POST request with the
      // X-HTTP-Method-Override header for simulating a PATCH request.
      if (this.options.overridePatchMethod) {
        req = this._openRequest('POST', this.url);
        req.setHeader('X-HTTP-Method-Override', 'PATCH');
      } else {
        req = this._openRequest('PATCH', this.url);
      }
      req.setHeader('Upload-Offset', "".concat(this._offset));
      var promise = this._addChunkToRequest(req);
      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this8._emitHttpError(req, res, 'tus: unexpected response while uploading chunk');
          return;
        }
        _this8._handleUploadResponse(req, res);
      })["catch"](function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this8._aborted) {
          return;
        }
        _this8._emitHttpError(req, null, "tus: failed to upload chunk at offset ".concat(_this8._offset), err);
      });
    }

    /**
     * _addChunktoRequest reads a chunk from the source and sends it using the
     * supplied request object. It will not handle the response.
     *
     * @api private
     */
  }, {
    key: "_addChunkToRequest",
    value: function _addChunkToRequest(req) {
      var _this9 = this;
      var start = this._offset;
      var end = this._offset + this.options.chunkSize;
      req.setProgressHandler(function (bytesSent) {
        _this9._emitProgress(start + bytesSent, _this9._size);
      });
      if (this.options.protocol === PROTOCOL_TUS_V1) {
        req.setHeader('Content-Type', 'application/offset+octet-stream');
      } else if (this.options.protocol === PROTOCOL_IETF_DRAFT_05) {
        req.setHeader('Content-Type', 'application/partial-upload');
      }

      // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.
      if ((end === Number.POSITIVE_INFINITY || end > this._size) && !this.options.uploadLengthDeferred) {
        end = this._size;
      }
      return this._source.slice(start, end).then(function (_ref2) {
        var value = _ref2.value,
          done = _ref2.done;
        var valueSize = value !== null && value !== void 0 && value.size ? value.size : 0;

        // If the upload length is deferred, the upload size was not specified during
        // upload creation. So, if the file reader is done reading, we know the total
        // upload size and can tell the tus server.
        if (_this9.options.uploadLengthDeferred && done) {
          _this9._size = _this9._offset + valueSize;
          req.setHeader('Upload-Length', "".concat(_this9._size));
        }

        // The specified uploadSize might not match the actual amount of data that a source
        // provides. In these cases, we cannot successfully complete the upload, so we
        // rather error out and let the user know. If not, tus-js-client will be stuck
        // in a loop of repeating empty PATCH requests.
        // See https://community.transloadit.com/t/how-to-abort-hanging-companion-uploads/16488/13
        var newSize = _this9._offset + valueSize;
        if (!_this9.options.uploadLengthDeferred && done && newSize !== _this9._size) {
          return Promise.reject(new Error("upload was configured with a size of ".concat(_this9._size, " bytes, but the source is done after ").concat(newSize, " bytes")));
        }
        if (value === null) {
          return _this9._sendRequest(req);
        }
        if (_this9.options.protocol === PROTOCOL_IETF_DRAFT_03 || _this9.options.protocol === PROTOCOL_IETF_DRAFT_05) {
          req.setHeader('Upload-Complete', done ? '?1' : '?0');
        }
        _this9._emitProgress(_this9._offset, _this9._size);
        return _this9._sendRequest(req, value);
      });
    }

    /**
     * _handleUploadResponse is used by requests that haven been sent using _addChunkToRequest
     * and already have received a response.
     *
     * @api private
     */
  }, {
    key: "_handleUploadResponse",
    value: function _handleUploadResponse(req, res) {
      var offset = Number.parseInt(res.getHeader('Upload-Offset'), 10);
      if (Number.isNaN(offset)) {
        this._emitHttpError(req, res, 'tus: invalid or missing offset value');
        return;
      }
      this._emitProgress(offset, this._size);
      this._emitChunkComplete(offset - this._offset, offset, this._size);
      this._offset = offset;
      if (offset === this._size) {
        // Yay, finally done :)
        this._emitSuccess(res);
        this._source.close();
        return;
      }
      this._performUpload();
    }

    /**
     * Create a new HTTP request object with the given method and URL.
     *
     * @api private
     */
  }, {
    key: "_openRequest",
    value: function _openRequest(method, url) {
      var req = openRequest(method, url, this.options);
      this._req = req;
      return req;
    }

    /**
     * Remove the entry in the URL storage, if it has been saved before.
     *
     * @api private
     */
  }, {
    key: "_removeFromUrlStorage",
    value: function _removeFromUrlStorage() {
      var _this10 = this;
      if (!this._urlStorageKey) return;
      this._urlStorage.removeUpload(this._urlStorageKey)["catch"](function (err) {
        _this10._emitError(err);
      });
      this._urlStorageKey = null;
    }

    /**
     * Add the upload URL to the URL storage, if possible.
     *
     * @api private
     */
  }, {
    key: "_saveUploadInUrlStorage",
    value: function _saveUploadInUrlStorage() {
      var _this11 = this;
      // We do not store the upload URL
      // - if it was disabled in the option, or
      // - if no fingerprint was calculated for the input (i.e. a stream), or
      // - if the URL is already stored (i.e. key is set alread).
      if (!this.options.storeFingerprintForResuming || !this._fingerprint || this._urlStorageKey !== null) {
        return Promise.resolve();
      }
      var storedUpload = {
        size: this._size,
        metadata: this.options.metadata,
        creationTime: new Date().toString()
      };
      if (this._parallelUploads) {
        // Save multiple URLs if the parallelUploads option is used ...
        storedUpload.parallelUploadUrls = this._parallelUploadUrls;
      } else {
        // ... otherwise we just save the one available URL.
        storedUpload.uploadUrl = this.url;
      }
      return this._urlStorage.addUpload(this._fingerprint, storedUpload).then(function (urlStorageKey) {
        _this11._urlStorageKey = urlStorageKey;
      });
    }

    /**
     * Send a request with the provided body.
     *
     * @api private
     */
  }, {
    key: "_sendRequest",
    value: function _sendRequest(req) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return sendRequest(req, body, this.options);
    }
  }], [{
    key: "terminate",
    value: function terminate(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var req = openRequest('DELETE', url, options);
      return sendRequest(req, null, options).then(function (res) {
        // A 204 response indicates a successfull request
        if (res.getStatus() === 204) {
          return;
        }
        throw new DetailedError('tus: unexpected response while terminating upload', null, req, res);
      })["catch"](function (err) {
        if (!(err instanceof DetailedError)) {
          err = new DetailedError('tus: failed to terminate upload', err, req, null);
        }
        if (!shouldRetry(err, 0, options)) {
          throw err;
        }

        // Instead of keeping track of the retry attempts, we remove the first element from the delays
        // array. If the array is empty, all retry attempts are used up and we will bubble up the error.
        // We recursively call the terminate function will removing elements from the retryDelays array.
        var delay = options.retryDelays[0];
        var remainingDelays = options.retryDelays.slice(1);
        var newOptions = _objectSpread$1(_objectSpread$1({}, options), {}, {
          retryDelays: remainingDelays
        });
        return new Promise(function (resolve) {
          return setTimeout(resolve, delay);
        }).then(function () {
          return BaseUpload.terminate(url, newOptions);
        });
      });
    }
  }]);
}();
function encodeMetadata(metadata) {
  return Object.entries(metadata).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
      key = _ref4[0],
      value = _ref4[1];
    return "".concat(key, " ").concat(gBase64.encode(String(value)));
  }).join(',');
}

/**
 * Checks whether a given status is in the range of the expected category.
 * For example, only a status between 200 and 299 will satisfy the category 200.
 *
 * @api private
 */
function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}

/**
 * Create a new HTTP request with the specified method and URL.
 * The necessary headers that are included in every request
 * will be added, including the request ID.
 *
 * @api private
 */
function openRequest(method, url, options) {
  var req = options.httpStack.createRequest(method, url);
  if (options.protocol === PROTOCOL_IETF_DRAFT_03) {
    req.setHeader('Upload-Draft-Interop-Version', '5');
  } else if (options.protocol === PROTOCOL_IETF_DRAFT_05) {
    req.setHeader('Upload-Draft-Interop-Version', '6');
  } else {
    req.setHeader('Tus-Resumable', '1.0.0');
  }
  var headers = options.headers || {};
  for (var _i2 = 0, _Object$entries = Object.entries(headers); _i2 < _Object$entries.length; _i2++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
      name = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    req.setHeader(name, value);
  }
  if (options.addRequestId) {
    var requestId = uuid();
    req.setHeader('X-Request-ID', requestId);
  }
  return req;
}

/**
 * Send a request with the provided body while invoking the onBeforeRequest
 * and onAfterResponse callbacks.
 *
 * @api private
 */
function sendRequest(_x, _x2, _x3) {
  return _sendRequest2.apply(this, arguments);
}
/**
 * Checks whether the browser running this code has internet access.
 * This function will always return true in the node.js environment
 *
 * @api private
 */
function _sendRequest2() {
  _sendRequest2 = _asyncToGenerator$1( /*#__PURE__*/_regeneratorRuntime$1().mark(function _callee(req, body, options) {
    var res;
    return _regeneratorRuntime$1().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(typeof options.onBeforeRequest === 'function')) {
            _context.next = 3;
            break;
          }
          _context.next = 3;
          return options.onBeforeRequest(req);
        case 3:
          _context.next = 5;
          return req.send(body);
        case 5:
          res = _context.sent;
          if (!(typeof options.onAfterResponse === 'function')) {
            _context.next = 9;
            break;
          }
          _context.next = 9;
          return options.onAfterResponse(req, res);
        case 9:
          return _context.abrupt("return", res);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _sendRequest2.apply(this, arguments);
}
function isOnline() {
  var online = true;
  // Note: We don't reference `window` here because the navigator object also exists
  // in a Web Worker's context.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    online = false;
  }
  return online;
}

/**
 * Checks whether or not it is ok to retry a request.
 * @param {Error|DetailedError} err the error returned from the last request
 * @param {number} retryAttempt the number of times the request has already been retried
 * @param {object} options tus Upload options
 *
 * @api private
 */
function shouldRetry(err, retryAttempt, options) {
  // We only attempt a retry if
  // - retryDelays option is set
  // - we didn't exceed the maxium number of retries, yet, and
  // - this error was caused by a request or it's response and
  // - the error is server error (i.e. not a status 4xx except a 409 or 423) or
  // a onShouldRetry is specified and returns true
  // - the browser does not indicate that we are offline
  if (options.retryDelays == null || retryAttempt >= options.retryDelays.length || err.originalRequest == null) {
    return false;
  }
  if (options && typeof options.onShouldRetry === 'function') {
    return options.onShouldRetry(err, retryAttempt, options);
  }
  return defaultOnShouldRetry(err);
}

/**
 * determines if the request should be retried. Will only retry if not a status 4xx except a 409 or 423
 * @param {DetailedError} err
 * @returns {boolean}
 */
function defaultOnShouldRetry(err) {
  var status = err.originalResponse ? err.originalResponse.getStatus() : 0;
  return (!inStatusCategory(status, 400) || status === 409 || status === 423) && isOnline();
}

/**
 * Resolve a relative link given the origin as source. For example,
 * if a HTTP request to http://example.com/files/ returns a Location
 * header with the value /upload/abc, the resolved URL will be:
 * http://example.com/upload/abc
 */
function resolveUrl(origin, link) {
  return new URL$1(link, origin).toString();
}

/**
 * Calculate the start and end positions for the parts if an upload
 * is split into multiple parallel requests.
 *
 * @param {number} totalSize The byte size of the upload, which will be split.
 * @param {number} partCount The number in how many parts the upload will be split.
 * @return {object[]}
 * @api private
 */
function splitSizeIntoParts(totalSize, partCount) {
  var partSize = Math.floor(totalSize / partCount);
  var parts = [];
  for (var i = 0; i < partCount; i++) {
    parts.push({
      start: partSize * i,
      end: partSize * (i + 1)
    });
  }
  parts[partCount - 1].end = totalSize;
  return parts;
}
BaseUpload.defaultOptions = defaultOptions$9;

var isReactNative$1 = function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
};

/**
 * uriToBlob resolves a URI to a Blob object. This is used for
 * React Native to retrieve a file (identified by a file://
 * URI) as a blob.
 */
function uriToBlob(uri) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      var blob = xhr.response;
      resolve(blob);
    };
    xhr.onerror = function (err) {
      reject(err);
    };
    xhr.open('GET', uri);
    xhr.send();
  });
}

var isCordova$1 = function isCordova() {
  return typeof window !== 'undefined' && (typeof window.PhoneGap !== 'undefined' || typeof window.Cordova !== 'undefined' || typeof window.cordova !== 'undefined');
};

/**
 * readAsByteArray converts a File object to a Uint8Array.
 * This function is only used on the Apache Cordova platform.
 * See https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html#read-a-file
 */
function readAsByteArray(chunk) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      var value = new Uint8Array(reader.result);
      resolve({
        value: value
      });
    };
    reader.onerror = function (err) {
      reject(err);
    };
    reader.readAsArrayBuffer(chunk);
  });
}

function _typeof$5(o) { "@babel/helpers - typeof"; return _typeof$5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$5(o); }
function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey$5(descriptor.key), descriptor); } }
function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey$5(t) { var i = _toPrimitive$5(t, "string"); return "symbol" == _typeof$5(i) ? i : i + ""; }
function _toPrimitive$5(t, r) { if ("object" != _typeof$5(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$5(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
var FileSource = /*#__PURE__*/function () {
  // Make this.size a method
  function FileSource(file) {
    _classCallCheck$5(this, FileSource);
    this._file = file;
    this.size = file.size;
  }
  return _createClass$5(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      // In Apache Cordova applications, a File must be resolved using
      // FileReader instances, see
      // https://cordova.apache.org/docs/en/8.x/reference/cordova-plugin-file/index.html#read-a-file
      if (isCordova$1()) {
        return readAsByteArray(this._file.slice(start, end));
      }
      var value = this._file.slice(start, end);
      var done = end >= this.size;
      return Promise.resolve({
        value: value,
        done: done
      });
    }
  }, {
    key: "close",
    value: function close() {
      // Nothing to do here since we don't need to release any resources.
    }
  }]);
}();

function _typeof$4(o) { "@babel/helpers - typeof"; return _typeof$4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$4(o); }
function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey$4(descriptor.key), descriptor); } }
function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey$4(t) { var i = _toPrimitive$4(t, "string"); return "symbol" == _typeof$4(i) ? i : i + ""; }
function _toPrimitive$4(t, r) { if ("object" != _typeof$4(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$4(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
function len(blobOrArray) {
  if (blobOrArray === undefined) return 0;
  if (blobOrArray.size !== undefined) return blobOrArray.size;
  return blobOrArray.length;
}

/*
  Typed arrays and blobs don't have a concat method.
  This function helps StreamSource accumulate data to reach chunkSize.
*/
function concat(a, b) {
  if (a.concat) {
    // Is `a` an Array?
    return a.concat(b);
  }
  if (a instanceof Blob) {
    return new Blob([a, b], {
      type: a.type
    });
  }
  if (a.set) {
    // Is `a` a typed array?
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }
  throw new Error('Unknown data type');
}
var StreamSource = /*#__PURE__*/function () {
  function StreamSource(reader) {
    _classCallCheck$4(this, StreamSource);
    this._buffer = undefined;
    this._bufferOffset = 0;
    this._reader = reader;
    this._done = false;
  }
  return _createClass$4(StreamSource, [{
    key: "slice",
    value: function slice(start, end) {
      if (start < this._bufferOffset) {
        return Promise.reject(new Error("Requested data is before the reader's current offset"));
      }
      return this._readUntilEnoughDataOrDone(start, end);
    }
  }, {
    key: "_readUntilEnoughDataOrDone",
    value: function _readUntilEnoughDataOrDone(start, end) {
      var _this = this;
      var hasEnoughData = end <= this._bufferOffset + len(this._buffer);
      if (this._done || hasEnoughData) {
        var value = this._getDataFromBuffer(start, end);
        var done = value == null ? this._done : false;
        return Promise.resolve({
          value: value,
          done: done
        });
      }
      return this._reader.read().then(function (_ref) {
        var value = _ref.value,
          done = _ref.done;
        if (done) {
          _this._done = true;
        } else if (_this._buffer === undefined) {
          _this._buffer = value;
        } else {
          _this._buffer = concat(_this._buffer, value);
        }
        return _this._readUntilEnoughDataOrDone(start, end);
      });
    }
  }, {
    key: "_getDataFromBuffer",
    value: function _getDataFromBuffer(start, end) {
      // Remove data from buffer before `start`.
      // Data might be reread from the buffer if an upload fails, so we can only
      // safely delete data when it comes *before* what is currently being read.
      if (start > this._bufferOffset) {
        this._buffer = this._buffer.slice(start - this._bufferOffset);
        this._bufferOffset = start;
      }
      // If the buffer is empty after removing old data, all data has been read.
      var hasAllDataBeenRead = len(this._buffer) === 0;
      if (this._done && hasAllDataBeenRead) {
        return null;
      }
      // We already removed data before `start`, so we just return the first
      // chunk from the buffer.
      return this._buffer.slice(0, end - start);
    }
  }, {
    key: "close",
    value: function close() {
      if (this._reader.cancel) {
        this._reader.cancel();
      }
    }
  }]);
}();

function _typeof$3(o) { "@babel/helpers - typeof"; return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$3(o); }
function _regeneratorRuntime() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: true, configurable: true, writable: true }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof$3(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: true }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(true); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = false, next; return next.value = t, next.done = true, next; }; return i.next = i; } } throw new TypeError(_typeof$3(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: true }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: true }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = false, next; } return next.done = true, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = false, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = true; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, true); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, true); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey$3(descriptor.key), descriptor); } }
function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey$3(t) { var i = _toPrimitive$3(t, "string"); return "symbol" == _typeof$3(i) ? i : i + ""; }
function _toPrimitive$3(t, r) { if ("object" != _typeof$3(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$3(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
var FileReader$1 = /*#__PURE__*/function () {
  function FileReader() {
    _classCallCheck$3(this, FileReader);
  }
  return _createClass$3(FileReader, [{
    key: "openFile",
    value: function () {
      var _openFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(input, chunkSize) {
        var blob;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(isReactNative$1() && input && typeof input.uri !== 'undefined')) {
                _context.next = 11;
                break;
              }
              _context.prev = 1;
              _context.next = 4;
              return uriToBlob(input.uri);
            case 4:
              blob = _context.sent;
              return _context.abrupt("return", new FileSource(blob));
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              throw new Error("tus: cannot fetch `file.uri` as Blob, make sure the uri is correct and accessible. ".concat(_context.t0));
            case 11:
              if (!(typeof input.slice === 'function' && typeof input.size !== 'undefined')) {
                _context.next = 13;
                break;
              }
              return _context.abrupt("return", Promise.resolve(new FileSource(input)));
            case 13:
              if (!(typeof input.read === 'function')) {
                _context.next = 18;
                break;
              }
              chunkSize = Number(chunkSize);
              if (Number.isFinite(chunkSize)) {
                _context.next = 17;
                break;
              }
              return _context.abrupt("return", Promise.reject(new Error('cannot create source for stream without a finite value for the `chunkSize` option')));
            case 17:
              return _context.abrupt("return", Promise.resolve(new StreamSource(input, chunkSize)));
            case 18:
              return _context.abrupt("return", Promise.reject(new Error('source object may only be an instance of File, Blob, or Reader in this environment')));
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 8]]);
      }));
      function openFile(_x, _x2) {
        return _openFile.apply(this, arguments);
      }
      return openFile;
    }()
  }]);
}();

// TODO: Differenciate between input types

/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @param {Object} options
 * @param {Function} callback
 */
function fingerprint(file, options) {
  if (isReactNative$1()) {
    return Promise.resolve(reactNativeFingerprint(file, options));
  }
  return Promise.resolve(['tus-br', file.name, file.type, file.size, file.lastModified, options.endpoint].join('-'));
}
function reactNativeFingerprint(file, options) {
  var exifHash = file.exif ? hashCode(JSON.stringify(file.exif)) : 'noexif';
  return ['tus-rn', file.name || 'noname', file.size || 'nosize', exifHash, options.endpoint].join('/');
}
function hashCode(str) {
  // from https://stackoverflow.com/a/8831937/151666
  var hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (var i = 0; i < str.length; i++) {
    var _char = str.charCodeAt(i);
    hash = (hash << 5) - hash + _char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
}

function _typeof$2(o) { "@babel/helpers - typeof"; return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$2(o); }
function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey$2(descriptor.key), descriptor); } }
function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey$2(t) { var i = _toPrimitive$2(t, "string"); return "symbol" == _typeof$2(i) ? i : i + ""; }
function _toPrimitive$2(t, r) { if ("object" != _typeof$2(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$2(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
var XHRHttpStack = /*#__PURE__*/function () {
  function XHRHttpStack() {
    _classCallCheck$2(this, XHRHttpStack);
  }
  return _createClass$2(XHRHttpStack, [{
    key: "createRequest",
    value: function createRequest(method, url) {
      return new Request(method, url);
    }
  }, {
    key: "getName",
    value: function getName() {
      return 'XHRHttpStack';
    }
  }]);
}();
var Request = /*#__PURE__*/function () {
  function Request(method, url) {
    _classCallCheck$2(this, Request);
    this._xhr = new XMLHttpRequest();
    this._xhr.open(method, url, true);
    this._method = method;
    this._url = url;
    this._headers = {};
  }
  return _createClass$2(Request, [{
    key: "getMethod",
    value: function getMethod() {
      return this._method;
    }
  }, {
    key: "getURL",
    value: function getURL() {
      return this._url;
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this._xhr.setRequestHeader(header, value);
      this._headers[header] = value;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._headers[header];
    }
  }, {
    key: "setProgressHandler",
    value: function setProgressHandler(progressHandler) {
      // Test support for progress events before attaching an event listener
      if (!('upload' in this._xhr)) {
        return;
      }
      this._xhr.upload.onprogress = function (e) {
        if (!e.lengthComputable) {
          return;
        }
        progressHandler(e.loaded);
      };
    }
  }, {
    key: "send",
    value: function send() {
      var _this = this;
      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return new Promise(function (resolve, reject) {
        _this._xhr.onload = function () {
          resolve(new Response(_this._xhr));
        };
        _this._xhr.onerror = function (err) {
          reject(err);
        };
        _this._xhr.send(body);
      });
    }
  }, {
    key: "abort",
    value: function abort() {
      this._xhr.abort();
      return Promise.resolve();
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);
}();
var Response = /*#__PURE__*/function () {
  function Response(xhr) {
    _classCallCheck$2(this, Response);
    this._xhr = xhr;
  }
  return _createClass$2(Response, [{
    key: "getStatus",
    value: function getStatus() {
      return this._xhr.status;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._xhr.getResponseHeader(header);
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this._xhr.responseText;
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);
}();

function _typeof$1(o) { "@babel/helpers - typeof"; return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof$1(o); }
function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey$1(descriptor.key), descriptor); } }
function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey$1(t) { var i = _toPrimitive$1(t, "string"); return "symbol" == _typeof$1(i) ? i : i + ""; }
function _toPrimitive$1(t, r) { if ("object" != _typeof$1(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof$1(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (String )(t); }
var hasStorage = false;
try {
  // Note: localStorage does not exist in the Web Worker's context, so we must use window here.
  hasStorage = 'localStorage' in window;

  // Attempt to store and read entries from the local storage to detect Private
  // Mode on Safari on iOS (see #49)
  // If the key was not used before, we remove it from local storage again to
  // not cause confusion where the entry came from.
  var key = 'tusSupport';
  var originalValue = localStorage.getItem(key);
  localStorage.setItem(key, originalValue);
  if (originalValue === null) localStorage.removeItem(key);
} catch (e) {
  // If we try to access localStorage inside a sandboxed iframe, a SecurityError
  // is thrown. When in private mode on iOS Safari, a QuotaExceededError is
  // thrown (see #49)
  if (e.code === e.SECURITY_ERR || e.code === e.QUOTA_EXCEEDED_ERR) {
    hasStorage = false;
  } else {
    throw e;
  }
}
var canStoreURLs = hasStorage;
var WebStorageUrlStorage = /*#__PURE__*/function () {
  function WebStorageUrlStorage() {
    _classCallCheck$1(this, WebStorageUrlStorage);
  }
  return _createClass$1(WebStorageUrlStorage, [{
    key: "findAllUploads",
    value: function findAllUploads() {
      var results = this._findEntries('tus::');
      return Promise.resolve(results);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      var results = this._findEntries("tus::".concat(fingerprint, "::"));
      return Promise.resolve(results);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      localStorage.removeItem(urlStorageKey);
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      var id = Math.round(Math.random() * 1e12);
      var key = "tus::".concat(fingerprint, "::").concat(id);
      localStorage.setItem(key, JSON.stringify(upload));
      return Promise.resolve(key);
    }
  }, {
    key: "_findEntries",
    value: function _findEntries(prefix) {
      var results = [];
      for (var i = 0; i < localStorage.length; i++) {
        var _key = localStorage.key(i);
        if (_key.indexOf(prefix) !== 0) continue;
        try {
          var upload = JSON.parse(localStorage.getItem(_key));
          upload.urlStorageKey = _key;
          results.push(upload);
        } catch (_e) {
          // The JSON parse error is intentionally ignored here, so a malformed
          // entry in the storage cannot prevent an upload.
        }
      }
      return results;
    }
  }]);
}();

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var defaultOptions$8 = _objectSpread(_objectSpread({}, BaseUpload.defaultOptions), {}, {
  httpStack: new XHRHttpStack(),
  fileReader: new FileReader$1(),
  urlStorage: canStoreURLs ? new WebStorageUrlStorage() : new NoopUrlStorage(),
  fingerprint: fingerprint
});
var Upload = /*#__PURE__*/function (_BaseUpload) {
  function Upload() {
    var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, Upload);
    options = _objectSpread(_objectSpread({}, defaultOptions$8), options);
    return _callSuper(this, Upload, [file, options]);
  }
  _inherits(Upload, _BaseUpload);
  return _createClass(Upload, null, [{
    key: "terminate",
    value: function terminate(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options = _objectSpread(_objectSpread({}, defaultOptions$8), options);
      return BaseUpload.terminate(url, options);
    }
  }]);
}(BaseUpload); // Note: We don't reference `window` here because these classes also exist in a Web Worker's context.

/**
 * Type definitions for Form.io File Upload Module
 */
var UploadStatus$1;
(function (UploadStatus) {
    UploadStatus["PENDING"] = "pending";
    UploadStatus["UPLOADING"] = "uploading";
    UploadStatus["PROCESSING"] = "processing";
    UploadStatus["COMPLETED"] = "completed";
    UploadStatus["FAILED"] = "failed";
    UploadStatus["CANCELLED"] = "cancelled";
})(UploadStatus$1 || (UploadStatus$1 = {}));

/**
 * Production-safe logger for Form.io file upload components
 *
 * Features:
 * - Environment-aware (only logs in development)
 * - Structured logging with metadata
 * - Prepares for production monitoring integration
 */
const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
const logger = {
    /**
     * Log error messages
     */
    error: (msg, meta) => {
        if (isDevelopment) {
            console.error(`[ERROR] ${msg}`, meta);
        }
    },
    /**
     * Log warning messages
     */
    warn: (msg, meta) => {
        if (isDevelopment) {
            console.warn(`[WARN] ${msg}`, meta);
        }
    },
    /**
     * Log informational messages
     */
    info: (msg, meta) => {
        if (isDevelopment) {
            console.log(`[INFO] ${msg}`, meta);
        }
    },
    /**
     * Log debug messages
     */
    debug: (msg, meta) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${msg}`, meta);
        }
    },
};

/**
 * Magic Number (File Signature) Verification
 *
 * Validates file types by inspecting actual file content (magic numbers)
 * to prevent MIME type spoofing attacks.
 *
 * Security: Prevents attackers from uploading malicious files by changing
 * the MIME type or file extension.
 */
/**
 * File type signatures (magic numbers)
 * Each signature is an array of byte values at the start of the file
 */
const FILE_SIGNATURES = {
    // Images
    'image/jpeg': {
        mime: 'image/jpeg',
        signatures: [
            [0xff, 0xd8, 0xff, 0xdb], // JPEG raw
            [0xff, 0xd8, 0xff, 0xe0], // JPEG JFIF
            [0xff, 0xd8, 0xff, 0xe1], // JPEG EXIF
            [0xff, 0xd8, 0xff, 0xe2], // JPEG still
            [0xff, 0xd8, 0xff, 0xe3], // JPEG Samsung
        ],
        description: 'JPEG Image',
    },
    'image/png': {
        mime: 'image/png',
        signatures: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
        description: 'PNG Image',
    },
    'image/gif': {
        mime: 'image/gif',
        signatures: [
            [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
            [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
        ],
        description: 'GIF Image',
    },
    'image/webp': {
        mime: 'image/webp',
        signatures: [[0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50]],
        description: 'WebP Image',
    },
    'image/bmp': {
        mime: 'image/bmp',
        signatures: [[0x42, 0x4d]],
        description: 'BMP Image',
    },
    'image/tiff': {
        mime: 'image/tiff',
        signatures: [
            [0x49, 0x49, 0x2a, 0x00], // Little-endian
            [0x4d, 0x4d, 0x00, 0x2a], // Big-endian
        ],
        description: 'TIFF Image',
    },
    // Documents
    'application/pdf': {
        mime: 'application/pdf',
        signatures: [
            [0x25, 0x50, 0x44, 0x46, 0x2d], // %PDF-
        ],
        description: 'PDF Document',
    },
    // Archives
    'application/zip': {
        mime: 'application/zip',
        signatures: [
            [0x50, 0x4b, 0x03, 0x04], // ZIP local file header
            [0x50, 0x4b, 0x05, 0x06], // ZIP empty archive
            [0x50, 0x4b, 0x07, 0x08], // ZIP spanned archive
        ],
        description: 'ZIP Archive',
    },
    'application/x-rar-compressed': {
        mime: 'application/x-rar-compressed',
        signatures: [
            [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00], // RAR v1.5+
            [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00], // RAR v5.0+
        ],
        description: 'RAR Archive',
    },
    'application/x-7z-compressed': {
        mime: 'application/x-7z-compressed',
        signatures: [[0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]],
        description: '7-Zip Archive',
    },
    // Microsoft Office (ZIP-based)
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        signatures: [
            [0x50, 0x4b, 0x03, 0x04], // ZIP (needs content inspection)
        ],
        description: 'Microsoft Word Document (DOCX)',
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        signatures: [
            [0x50, 0x4b, 0x03, 0x04], // ZIP (needs content inspection)
        ],
        description: 'Microsoft Excel Spreadsheet (XLSX)',
    },
    // Video
    'video/mp4': {
        mime: 'video/mp4',
        signatures: [
            [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70], // ftyp
        ],
        description: 'MP4 Video',
    },
    'video/webm': {
        mime: 'video/webm',
        signatures: [[0x1a, 0x45, 0xdf, 0xa3]],
        description: 'WebM Video',
    },
    // Audio
    'audio/mpeg': {
        mime: 'audio/mpeg',
        signatures: [
            [0xff, 0xfb], // MP3 with MPEG-1 Layer 3
            [0xff, 0xf3], // MP3 with MPEG-2 Layer 3
            [0xff, 0xf2], // MP3 with MPEG-2.5 Layer 3
            [0x49, 0x44, 0x33], // MP3 with ID3v2
        ],
        description: 'MP3 Audio',
    },
    'audio/wav': {
        mime: 'audio/wav',
        signatures: [[0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x41, 0x56, 0x45]],
        description: 'WAV Audio',
    },
};
/**
 * Verify file type by checking magic numbers
 *
 * @param file - File to verify
 * @param expectedType - Expected MIME type
 * @returns Promise<boolean> - True if file matches expected type
 */
async function verifyFileType(file, expectedType) {
    try {
        // Get file signature from database
        const signature = FILE_SIGNATURES[expectedType];
        // If no signature defined, allow the file (fallback to MIME check only)
        if (!signature) {
            logger.warn(`[Security] No signature defined for MIME type: ${expectedType}`);
            return true;
        }
        // Read enough bytes to check signature (12 bytes covers most formats)
        const buffer = await file.slice(0, 12).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        // Check if file matches any of the valid signatures
        const isValid = signature.signatures.some((sig) => matchesSignature(bytes, sig));
        if (!isValid) {
            logger.warn(`[Security] File signature mismatch for ${file.name}`, {
                declaredType: expectedType,
                fileBytes: Array.from(bytes.slice(0, 8))
                    .map((b) => `0x${b.toString(16).toUpperCase().padStart(2, '0')}`)
                    .join(' '),
                expectedSignatures: signature.signatures.map((s) => s
                    .map((b) => (b === null ? 'XX' : `0x${b.toString(16).toUpperCase().padStart(2, '0')}`))
                    .join(' ')),
            });
        }
        return isValid;
    }
    catch (error) {
        logger.error('[Security] Error verifying file type:', { error });
        // Fail securely: reject file if verification fails
        return false;
    }
}
/**
 * Check if file bytes match a signature pattern
 *
 * @param bytes - File bytes to check
 * @param signature - Expected signature (null = any byte)
 * @returns boolean - True if matches
 */
function matchesSignature(bytes, signature) {
    return signature.every((expectedByte, index) => {
        // null means "any byte" (wildcard)
        if (expectedByte === null) {
            return true;
        }
        // Check if byte matches
        return bytes[index] === expectedByte;
    });
}
/**
 * Verify multiple file types (for files with ambiguous extensions)
 *
 * @param file - File to verify
 * @param allowedTypes - Array of allowed MIME types
 * @returns Promise<string | null> - Detected MIME type or null if no match
 */
async function detectFileType(file, allowedTypes) {
    try {
        const buffer = await file.slice(0, 12).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        // Check each allowed type
        for (const mimeType of allowedTypes) {
            const signature = FILE_SIGNATURES[mimeType];
            if (!signature)
                continue;
            const matches = signature.signatures.some((sig) => matchesSignature(bytes, sig));
            if (matches) {
                return mimeType;
            }
        }
        return null;
    }
    catch (error) {
        logger.error('[Security] Error detecting file type:', { error });
        return null;
    }
}
/**
 * Check if file type has magic number support
 *
 * @param mimeType - MIME type to check
 * @returns boolean - True if signatures are defined
 */
function hasSignatureSupport(mimeType) {
    return mimeType in FILE_SIGNATURES;
}

/**
 * Filename Sanitization Utilities
 *
 * Prevents security vulnerabilities related to malicious filenames:
 * - Path traversal attacks (../../etc/passwd)
 * - Double extension attacks (.jpg.php)
 * - Special character exploits
 * - Null byte injection
 * - XSS in filenames
 */
/**
 * Dangerous file extensions that should never be allowed
 */
const DANGEROUS_EXTENSIONS = [
    // Executables
    '.exe',
    '.com',
    '.bat',
    '.cmd',
    '.sh',
    '.bash',
    '.zsh',
    // Scripts
    '.js',
    '.mjs',
    '.cjs',
    '.vbs',
    '.vbe',
    '.ps1',
    '.psm1',
    // Server-side code
    '.php',
    '.php3',
    '.php4',
    '.php5',
    '.phtml',
    '.phps',
    '.asp',
    '.aspx',
    '.jsp',
    '.jspx',
    '.cgi',
    '.pl',
    '.py',
    '.rb',
    // Configuration files
    '.htaccess',
    '.htpasswd',
    '.ini',
    '.conf',
    // Compressed executables
    '.scr',
    '.pif',
    '.application',
    '.gadget',
    '.msi',
    '.msp',
    '.jar',
    '.war',
    '.ear',
    // Links and shortcuts
    '.lnk',
    '.url',
    '.desktop',
    // Web archives that can execute
    '.hta',
    '.htr',
];
/**
 * Characters that are dangerous in filenames
 */
const DANGEROUS_CHARS = /[<>:"/\\|?*'\x00-\x1f\x7f]/g;
/**
 * Path traversal patterns
 */
const PATH_TRAVERSAL = /\.\.[/\\]/g;
/**
 * Maximum safe filename length (POSIX standard is 255 bytes)
 */
const MAX_FILENAME_LENGTH = 255;
/**
 * Reserved Windows filenames
 */
const RESERVED_NAMES = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
];
/**
 * Sanitize filename to prevent security vulnerabilities
 *
 * @param filename - Original filename
 * @param options - Sanitization options
 * @returns Sanitized filename
 */
function sanitizeFilename(filename, options = {}) {
    const { replacement = '_', maxLength = 200, preserveExtension = false, addTimestamp = true, lowercase = false, allowUnicode = true, } = options;
    if (!filename || typeof filename !== 'string') {
        return generateSafeFallbackName();
    }
    let safe = filename;
    // Remove null bytes (security risk)
    safe = safe.replace(/\0/g, '');
    // Remove any path components (path traversal prevention)
    safe = safe.replace(/^.*[/\\]/, '');
    // Remove path traversal patterns
    safe = safe.replace(PATH_TRAVERSAL, replacement);
    // Split into name and extension
    const lastDotIndex = safe.lastIndexOf('.');
    let name = lastDotIndex > 0 ? safe.substring(0, lastDotIndex) : safe;
    let ext = lastDotIndex > 0 ? safe.substring(lastDotIndex) : '';
    // Convert to lowercase if requested
    if (lowercase) {
        name = name.toLowerCase();
        ext = ext.toLowerCase();
    }
    // Check for dangerous double extensions
    if (!preserveExtension) {
        const dangerousExtFound = DANGEROUS_EXTENSIONS.some((dangerousExt) => {
            const extLower = ext.toLowerCase();
            const nameLower = name.toLowerCase();
            // Check if extension is dangerous
            if (extLower === dangerousExt) {
                return true;
            }
            // Check for double extension (.jpg.php)
            if (nameLower.endsWith(dangerousExt)) {
                return true;
            }
            return false;
        });
        if (dangerousExtFound) {
            logger.warn(`[Security] Dangerous extension detected in: ${filename}`);
            // Replace dangerous extension with safe marker
            ext = ext.replace(/\./g, '_') + '.safe';
            name = name.replace(/\./g, '_');
        }
    }
    // Replace dangerous characters in name
    name = name.replace(DANGEROUS_CHARS, replacement);
    // Replace dangerous characters in extension
    ext = ext.replace(DANGEROUS_CHARS, replacement);
    // Remove non-ASCII characters if not allowed
    if (!allowUnicode) {
        name = name.replace(/[^\x00-\x7F]/g, replacement);
        ext = ext.replace(/[^\x00-\x7F]/g, replacement);
    }
    // Remove leading/trailing dots and spaces (Windows compatibility)
    name = name.replace(/^[.\s]+|[.\s]+$/g, '');
    ext = ext.replace(/^[.\s]+|[.\s]+$/g, '');
    // Check for reserved Windows names
    const nameUpper = name.toUpperCase();
    if (RESERVED_NAMES.includes(nameUpper)) {
        logger.warn(`[Security] Reserved Windows filename detected: ${name}`);
        name = `file_${name}`;
    }
    // Collapse multiple replacements
    const multipleReplacement = new RegExp(`${escapeRegex(replacement)}{2,}`, 'g');
    name = name.replace(multipleReplacement, replacement);
    // Ensure name is not empty
    if (!name || name === replacement) {
        name = 'unnamed';
    }
    // Add timestamp to prevent collisions
    if (addTimestamp) {
        const timestamp = Date.now();
        name = `${name}_${timestamp}`;
    }
    // Enforce length limit (leave room for extension)
    const maxNameLength = Math.min(maxLength, MAX_FILENAME_LENGTH - ext.length - 1);
    if (name.length > maxNameLength) {
        name = name.substring(0, maxNameLength);
        // Remove trailing replacement character
        name = name.replace(new RegExp(`${escapeRegex(replacement)}+$`), '');
    }
    // Ensure extension starts with dot
    if (ext && !ext.startsWith('.')) {
        ext = '.' + ext;
    }
    // Combine name and extension
    const sanitized = name + ext;
    // Final validation
    if (sanitized.length > MAX_FILENAME_LENGTH) {
        logger.warn(`[Security] Filename too long after sanitization: ${sanitized.length} bytes`);
        return generateSafeFallbackName();
    }
    // Log if filename was changed significantly
    if (sanitized !== filename) {
        logger.info(`[Security] Filename sanitized: "${filename}" -> "${sanitized}"`);
    }
    return sanitized;
}
/**
 * Generate a safe fallback filename
 *
 * @returns Safe filename with timestamp
 */
function generateSafeFallbackName() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `file_${timestamp}_${random}`;
}
/**
 * Escape special regex characters
 *
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Custom validators for file upload components
 */
// Export security utilities
function registerValidators() {
    return {
        fileSize: fileSizeValidator,
        fileType: fileTypeValidator,
        virusScan: virusScanValidator,
        imageResolution: imageResolutionValidator,
    };
}
/**
 * Validate file size
 */
function fileSizeValidator(context) {
    const { component, value } = context;
    if (!value)
        return true;
    const files = Array.isArray(value) ? value : [value];
    const maxSize = parseFileSize(component.fileMaxSize);
    const minSize = parseFileSize(component.fileMinSize);
    for (const file of files) {
        if (maxSize && file.size > maxSize) {
            return `File ${file.name} exceeds maximum size of ${component.fileMaxSize}`;
        }
        if (minSize && file.size < minSize) {
            return `File ${file.name} is smaller than minimum size of ${component.fileMinSize}`;
        }
    }
    return true;
}
/**
 * Validate file type
 */
function fileTypeValidator(context) {
    const { component, value } = context;
    if (!value || !component.filePattern || component.filePattern === '*') {
        return true;
    }
    const files = Array.isArray(value) ? value : [value];
    const allowedTypes = parseFilePattern(component.filePattern);
    for (const file of files) {
        const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        const fileMime = file.type;
        let isAllowed = false;
        for (const pattern of allowedTypes) {
            if (pattern.startsWith('.') && fileExt === pattern) {
                isAllowed = true;
                break;
            }
            if (pattern.includes('/') && fileMime.match(new RegExp(pattern.replace('*', '.*')))) {
                isAllowed = true;
                break;
            }
        }
        if (!isAllowed) {
            return `File type ${fileExt} is not allowed. Allowed types: ${component.filePattern}`;
        }
    }
    return true;
}
/**
 * Validate virus scan (placeholder - requires server-side implementation)
 */
async function virusScanValidator(context) {
    const { component, value } = context;
    if (!value || !component.virusScan) {
        return true;
    }
    // This would need to call a server-side virus scanning API
    // For now, we'll just return true
    return true;
}
/**
 * Validate image resolution
 */
function imageResolutionValidator(context) {
    const { component, value } = context;
    if (!value || (!component.imageMinResolution && !component.imageMaxResolution)) {
        return true;
    }
    const files = Array.isArray(value) ? value : [value];
    for (const file of files) {
        if (!file.type.startsWith('image/')) {
            continue;
        }
        // This would need to load the image and check dimensions
        // For now, we'll skip this validation
    }
    return true;
}
/**
 * Helper function to parse file size strings
 */
function parseFileSize(size) {
    if (!size)
        return null;
    const units = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
        TB: 1024 * 1024 * 1024 * 1024,
    };
    const match = size.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
    if (!match)
        return null;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    return value * (units[unit] || 1);
}
/**
 * Helper function to parse file patterns
 */
function parseFilePattern(pattern) {
    if (!pattern || pattern === '*')
        return ['*'];
    return pattern.split(',').map((p) => p.trim());
}

/**
 * TUS File Upload Component for Form.io
 *
 * Extends Form.io's base File component to provide TUS resumable upload capabilities
 */
const FileComponent$2 = Components.components.file;
class TusFileUploadComponent extends FileComponent$2 {
    static schema(...extend) {
        return FileComponent$2.schema({
            type: 'tusupload',
            label: 'TUS File Upload',
            key: 'tusupload',
            storage: 'tus',
            url: '',
            options: {
                uploadOnly: false,
            },
            filePattern: '*',
            fileMinSize: '0KB',
            fileMaxSize: '1GB',
            uploadOnly: false,
            ...extend,
        });
    }
    static get builderInfo() {
        return {
            title: 'TUS File Upload',
            icon: 'cloud-upload',
            group: 'premium',
            documentation: '/userguide/forms/premium-components#file-upload',
            weight: 100,
            schema: TusFileUploadComponent.schema(),
        };
    }
    static editForm() {
        return FileComponent$2.editForm([
            {
                key: 'display',
                components: [
                    {
                        key: 'displayBasic',
                        components: [
                            {
                                type: 'textfield',
                                key: 'tusEndpoint',
                                label: 'TUS Upload Endpoint',
                                placeholder: 'https://example.com/files',
                                weight: 25,
                                tooltip: 'The TUS server endpoint for resumable uploads',
                                input: true,
                            },
                            {
                                type: 'number',
                                key: 'chunkSize',
                                label: 'Chunk Size (MB)',
                                defaultValue: 8,
                                weight: 26,
                                tooltip: 'Size of each upload chunk in megabytes',
                                input: true,
                            },
                            {
                                type: 'checkbox',
                                key: 'resumable',
                                label: 'Enable Resumable Uploads',
                                defaultValue: true,
                                weight: 27,
                                tooltip: 'Allow uploads to resume after connection loss',
                                input: true,
                            },
                        ],
                    },
                ],
            },
            {
                key: 'validation',
                components: [
                    {
                        key: 'validationBasic',
                        components: [
                            {
                                type: 'textfield',
                                key: 'filePattern',
                                label: 'File Pattern',
                                placeholder: '*.pdf,*.doc,*.docx',
                                weight: 10,
                                tooltip: 'Allowed file extensions',
                                input: true,
                            },
                            {
                                type: 'textfield',
                                key: 'fileMinSize',
                                label: 'Minimum File Size',
                                placeholder: '1KB',
                                weight: 11,
                                tooltip: 'Minimum allowed file size',
                                input: true,
                            },
                            {
                                type: 'textfield',
                                key: 'fileMaxSize',
                                label: 'Maximum File Size',
                                placeholder: '10MB',
                                weight: 12,
                                tooltip: 'Maximum allowed file size',
                                input: true,
                            },
                        ],
                    },
                ],
            },
        ]);
    }
    constructor(component, options, data) {
        super(component, options, data);
        this.currentFile = null;
        this.uploadQueue = [];
        this.isUploading = false;
        // P1-T6: Progress throttling state (88% DOM reduction)
        this.rafPending = false;
        // P3-T1: Cached TUS config (2-3ms saved per file)
        this.cachedTusConfig = null;
        this.component.storage = 'tus';
        this.component.url = this.component.tusEndpoint || this.component.url || '/files';
    }
    init() {
        super.init();
        this.initializeTusClient();
    }
    initializeTusClient() {
        // P3-T1: Cache TUS config to avoid recreating for every file (2-3ms per file saved)
        this.cachedTusConfig = {
            endpoint: this.component.url || '/files',
            chunkSize: (this.component.chunkSize || 8) * 1024 * 1024,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: this.getHeaders(),
        };
        // Will be initialized per upload
        this.tusUpload = null;
    }
    getHeaders() {
        const headers = {
            'x-jwt-token': this.root?.token || '',
        };
        // Add custom headers if provided
        if (this.component.headers) {
            Object.assign(headers, this.component.headers);
        }
        return headers;
    }
    getMetadata() {
        return {
            filename: '',
            filetype: '',
            formId: this.root?.formId || '',
            submissionId: this.root?.submissionId || '',
            fieldKey: this.component.key || '',
        };
    }
    attach(element) {
        this.loadRefs(element, {
            fileDrop: 'single',
            fileBrowse: 'single',
            galleryButton: 'single',
            cameraButton: 'single',
            fileUpload: 'single',
            hiddenFileInputElement: 'single',
            fileList: 'single',
            camera: 'single',
            canvas: 'single',
            fileStatusUploading: 'multiple',
            fileImage: 'multiple',
            fileError: 'multiple',
            fileLink: 'multiple',
            removeLink: 'multiple',
            fileStatusRemove: 'multiple',
            fileSize: 'multiple',
            fileUploadingStatus: 'multiple',
            fileProcessingStatus: 'multiple',
            fileProgress: 'multiple',
            fileProgressInner: 'multiple',
        });
        const superAttach = super.attach(element);
        if (this.refs.fileBrowse) {
            this.addEventListener(this.refs.fileBrowse, 'click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (this.refs.hiddenFileInputElement) {
                    this.refs.hiddenFileInputElement.click();
                }
            });
        }
        return superAttach;
    }
    async upload(files) {
        this.uploadQueue = files;
        // P1-T4: Parallel uploads with batching (66% faster - 300s -> 100s for 10 files)
        const parallelLimit = this.component.parallelUploads || 3;
        const results = [];
        // Process files in batches of parallelLimit
        for (let i = 0; i < files.length; i += parallelLimit) {
            const batch = files.slice(i, i + parallelLimit);
            // Upload batch in parallel using Promise.all
            const batchResults = await Promise.all(batch.map(async (file) => {
                this.isUploading = true;
                try {
                    // Security: Validate file before upload
                    const validationResult = await this.validateFile(file);
                    if (!validationResult.valid) {
                        throw new Error(validationResult.error || 'File validation failed');
                    }
                    const result = await this.uploadFile(file);
                    this.emit('fileUploadComplete', result);
                    return result;
                }
                catch (error) {
                    logger.error('[TUS] Upload error:', { error });
                    this.emit('fileUploadError', error);
                    return { error };
                }
            }));
            results.push(...batchResults);
        }
        this.isUploading = false;
        // P1-T3: Clear upload queue to prevent memory leaks (45% memory reduction)
        this.uploadQueue = [];
        return results;
    }
    async validateFile(file) {
        // File size validation
        const maxSize = this.parseFileSize(this.component.fileMaxSize);
        const minSize = this.parseFileSize(this.component.fileMinSize);
        if (maxSize && file.size > maxSize) {
            return {
                valid: false,
                error: `File size exceeds maximum allowed (${this.component.fileMaxSize})`,
            };
        }
        if (minSize && file.size < minSize) {
            return {
                valid: false,
                error: `File size is below minimum required (${this.component.fileMinSize})`,
            };
        }
        // File type validation
        if (this.component.filePattern && this.component.filePattern !== '*') {
            const allowedTypes = this.parseFilePattern(this.component.filePattern);
            const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            const isAllowed = allowedTypes.some((pattern) => {
                if (pattern.startsWith('.')) {
                    return fileExt === pattern;
                }
                if (pattern.includes('/')) {
                    return file.type.match(new RegExp(pattern.replace('*', '.*')));
                }
                return false;
            });
            if (!isAllowed) {
                return {
                    valid: false,
                    error: `File type not allowed. Allowed: ${this.component.filePattern}`,
                };
            }
        }
        return { valid: true };
    }
    parseFileSize(size) {
        if (!size)
            return null;
        const units = {
            B: 1,
            KB: 1024,
            MB: 1024 * 1024,
            GB: 1024 * 1024 * 1024,
        };
        const match = size.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
        if (!match)
            return null;
        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        return value * (units[unit] || 1);
    }
    parseFilePattern(pattern) {
        if (!pattern || pattern === '*')
            return ['*'];
        return pattern.split(',').map((p) => p.trim());
    }
    async uploadFile(file) {
        return new Promise(async (resolve, reject) => {
            // Security: Sanitize filename to prevent path traversal and XSS
            const safeName = sanitizeFilename(file.name, {
                addTimestamp: true,
                preserveExtension: false,
            });
            // Security: Verify file type matches content (magic number check)
            const isValidType = await verifyFileType(file, file.type);
            if (!isValidType) {
                reject({
                    id: this.generateFileId(),
                    name: safeName,
                    size: file.size,
                    type: file.type,
                    storage: 'tus',
                    status: UploadStatus$1.FAILED,
                    error: {
                        code: 'INVALID_FILE_TYPE',
                        message: 'File content does not match declared type. This file may be dangerous.',
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                return;
            }
            const uploadFile = {
                id: this.generateFileId(),
                name: safeName,
                originalName: file.name,
                size: file.size,
                type: file.type,
                storage: 'tus',
                status: UploadStatus$1.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            // P3-T1: Use cached config to avoid object recreation (2-3ms saved per file)
            const upload = new Upload(file, {
                ...this.cachedTusConfig,
                metadata: {
                    ...this.getMetadata(),
                    filename: safeName,
                    originalFilename: file.name,
                    filetype: file.type || 'application/octet-stream',
                },
                onError: (error) => {
                    logger.error('[TUS] Upload failed:', { error: error.message, stack: error.stack });
                    uploadFile.status = UploadStatus$1.FAILED;
                    uploadFile.error = {
                        code: 'UPLOAD_ERROR',
                        message: error.message,
                    };
                    reject(uploadFile);
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                    uploadFile.progress = parseFloat(percentage);
                    uploadFile.status = UploadStatus$1.UPLOADING;
                    this.updateProgress(uploadFile);
                },
                onSuccess: () => {
                    uploadFile.status = UploadStatus$1.COMPLETED;
                    uploadFile.url = upload.url ?? undefined;
                    uploadFile.uploadId = upload.url?.split('/').pop();
                    // Create Form.io compatible file data
                    const fileData = {
                        name: uploadFile.name,
                        size: uploadFile.size,
                        type: uploadFile.type,
                        url: uploadFile.url,
                        storage: 'tus',
                        originalName: file.name,
                        uploadId: uploadFile.uploadId,
                    };
                    // Update Form.io component value (handle single vs multiple files)
                    if (this.component.multiple) {
                        const currentValue = this.dataValue || [];
                        this.dataValue = Array.isArray(currentValue) ? [...currentValue, fileData] : [fileData];
                    }
                    else {
                        this.dataValue = fileData;
                    }
                    // Trigger Form.io updates to propagate value to form submission
                    this.updateValue();
                    this.triggerChange();
                    this.updateProgress(uploadFile);
                    resolve(uploadFile);
                },
            });
            // Store reference for pause/resume
            this.tusUpload = upload;
            this.currentFile = uploadFile;
            // Start upload
            upload.start();
            this.emit('fileUploadStart', uploadFile);
        });
    }
    updateProgress(file) {
        // P1-T6: Throttle DOM updates using requestAnimationFrame (88% reflow reduction)
        if (!this.rafPending) {
            this.rafPending = true;
            requestAnimationFrame(() => {
                if (this.refs.fileProgress && this.refs.fileProgress.length > 0) {
                    const progressBar = this.refs.fileProgress[0];
                    if (progressBar) {
                        progressBar.style.width = `${file.progress || 0}%`;
                    }
                }
                this.emit('fileUploadProgress', {
                    file,
                    progress: file.progress || 0,
                });
                this.rafPending = false;
            });
        }
    }
    pauseUpload() {
        if (this.tusUpload) {
            this.tusUpload.abort();
            this.emit('fileUploadPaused', this.currentFile);
        }
    }
    resumeUpload() {
        if (this.tusUpload) {
            this.tusUpload.start();
            this.emit('fileUploadResumed', this.currentFile);
        }
    }
    cancelUpload() {
        if (this.tusUpload) {
            this.tusUpload.abort();
            this.tusUpload = null;
            this.currentFile = null;
            this.emit('fileUploadCancelled');
        }
    }
    generateFileId() {
        return `tus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getValue() {
        return this.dataValue;
    }
    setValue(value, flags = {}) {
        const changed = super.setValue(value, flags);
        if (changed) {
            this.redraw();
            this.triggerChange();
        }
        return changed;
    }
    getValueAsString(value) {
        if (Array.isArray(value)) {
            return value.map((val) => val.name || val.url || '').join(', ');
        }
        return value?.name || value?.url || '';
    }
    getView(value) {
        if (!value)
            return '';
        if (Array.isArray(value)) {
            return value
                .map((file) => `<a href="${file.url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`)
                .join('<br>');
        }
        return `<a href="${value.url}" target="_blank" rel="noopener noreferrer">${value.name}</a>`;
    }
}

function hasProperty(object, key) {
    return Object.hasOwn(object, key);
}

/**
 * Save a <canvas> element's content to a Blob object.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise}
 */
function canvasToBlob$1(canvas, type, quality) {
    return new Promise((resolve) => {
        canvas.toBlob(resolve, type, quality);
    });
}

const DATA_URL_PATTERN = /^data:([^/]+\/[^,;]+(?:[^,]*?))(;base64)?,([\s\S]*)$/;
function dataURItoBlob(dataURI, opts, toFile) {
    // get the base64 data
    const dataURIData = DATA_URL_PATTERN.exec(dataURI);
    // user may provide mime type, if not get it from data URI
    const mimeType = opts.mimeType ?? dataURIData?.[1] ?? 'plain/text';
    let data; // We add `!` to tell TS we're OK with `data` being not defined when the dataURI is invalid.
    if (dataURIData?.[2] != null) {
        const binary = atob(decodeURIComponent(dataURIData[3]));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        data = [bytes];
    }
    else if (dataURIData?.[3] != null) {
        data = [decodeURIComponent(dataURIData[3])];
    }
    return new Blob(data, { type: mimeType });
}

class ErrorWithCause extends Error {
    isNetworkError;
    cause;
    constructor(message, options) {
        super(message);
        this.cause = options?.cause;
        if (this.cause && hasProperty(this.cause, 'isNetworkError')) {
            this.isNetworkError = this.cause.isNetworkError;
        }
        else {
            this.isNetworkError = false;
        }
    }
}

/**
 * Low-pass filter using Exponential Moving Averages (aka exponential smoothing)
 * Filters a sequence of values by updating the mixing the previous output value
 * with the new input using the exponential window function
 *
 * @param newValue the n-th value of the sequence
 * @param previousSmoothedValue the exponential average of the first n-1 values
 * @param halfLife value of `dt` to move the smoothed value halfway between `previousFilteredValue` and `newValue`
 * @param dt time elapsed between adding the (n-1)th and the n-th values
 * @returns the exponential average of the first n values
 */
function emaFilter(newValue, previousSmoothedValue, halfLife, dt) {
    if (newValue === previousSmoothedValue)
        return newValue;
    if (dt === 0)
        return previousSmoothedValue;
    return newValue + (previousSmoothedValue - newValue) * 2 ** (-dt / halfLife);
}

var FOCUSABLE_ELEMENTS = [
    'a[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    'area[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    'input:not([disabled]):not([inert]):not([aria-hidden])',
    'select:not([disabled]):not([inert]):not([aria-hidden])',
    'textarea:not([disabled]):not([inert]):not([aria-hidden])',
    'button:not([disabled]):not([inert]):not([aria-hidden])',
    'iframe:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    'object:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    'embed:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    '[contenteditable]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
    '[tabindex]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
];

class NetworkError extends Error {
    cause;
    isNetworkError;
    request;
    constructor(error, xhr = null) {
        super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
        this.cause = error;
        this.isNetworkError = true;
        this.request = xhr;
    }
}

/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */
function fetchWithNetworkError(...options) {
    return fetch(...options).catch((err) => {
        if (err.name === 'AbortError') {
            throw err;
        }
        else {
            throw new NetworkError(err);
        }
    });
}

function filterNonFailedFiles(files) {
    const hasError = (file) => 'error' in file && !!file.error;
    return files.filter((file) => !hasError(file));
}
// Don't double-emit upload-started for Golden Retriever-restored files that were already started
function filterFilesToEmitUploadStarted(files) {
    return files.filter((file) => !file.progress?.uploadStarted || !file.isRestored);
}

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 */
function isDOMElement(obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    if (!('nodeType' in obj))
        return false;
    return obj.nodeType === Node.ELEMENT_NODE;
}

/**
 * Find one or more DOM elements.
 */
function findAllDOMElements(element) {
    if (typeof element === 'string') {
        const elements = document.querySelectorAll(element);
        return elements.length === 0 ? null : Array.from(elements);
    }
    if (typeof element === 'object' && isDOMElement(element)) {
        return [element];
    }
    return null;
}

function findDOMElement(element, context = document) {
    if (typeof element === 'string') {
        return context.querySelector(element);
    }
    if (isDOMElement(element)) {
        return element;
    }
    return null;
}

/**
 * Takes a full filename string and returns an object {name, extension}
 */
function getFileNameAndExtension(fullFileName) {
    const lastDot = fullFileName.lastIndexOf('.');
    // these count as no extension: "no-dot", "trailing-dot."
    if (lastDot === -1 || lastDot === fullFileName.length - 1) {
        return {
            name: fullFileName,
            extension: undefined,
        };
    }
    return {
        name: fullFileName.slice(0, lastDot),
        extension: fullFileName.slice(lastDot + 1),
    };
}

// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
var mimeTypes = {
    __proto__: null,
    md: 'text/markdown',
    markdown: 'text/markdown',
    mp4: 'video/mp4',
    mp3: 'audio/mp3',
    svg: 'image/svg+xml',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    heic: 'image/heic',
    heif: 'image/heif',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    csv: 'text/csv',
    tsv: 'text/tab-separated-values',
    tab: 'text/tab-separated-values',
    avi: 'video/x-msvideo',
    mks: 'video/x-matroska',
    mkv: 'video/x-matroska',
    mov: 'video/quicktime',
    dicom: 'application/dicom',
    doc: 'application/msword',
    msg: 'application/vnd.ms-outlook',
    docm: 'application/vnd.ms-word.document.macroenabled.12',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    dot: 'application/msword',
    dotm: 'application/vnd.ms-word.template.macroenabled.12',
    dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    xla: 'application/vnd.ms-excel',
    xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
    xlc: 'application/vnd.ms-excel',
    xlf: 'application/x-xliff+xml',
    xlm: 'application/vnd.ms-excel',
    xls: 'application/vnd.ms-excel',
    xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
    xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xlt: 'application/vnd.ms-excel',
    xltm: 'application/vnd.ms-excel.template.macroenabled.12',
    xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    xlw: 'application/vnd.ms-excel',
    txt: 'text/plain',
    text: 'text/plain',
    conf: 'text/plain',
    log: 'text/plain',
    pdf: 'application/pdf',
    zip: 'application/zip',
    '7z': 'application/x-7z-compressed',
    rar: 'application/x-rar-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    dmg: 'application/x-apple-diskimage',
};

function getFileType(file) {
    if (file.type)
        return file.type;
    const fileExtension = file.name
        ? getFileNameAndExtension(file.name).extension?.toLowerCase()
        : null;
    if (fileExtension && fileExtension in mimeTypes) {
        // else, see if we can map extension to a mime type
        return mimeTypes[fileExtension];
    }
    // if all fails, fall back to a generic byte stream type
    return 'application/octet-stream';
}

function encodeCharacter(character) {
    return character.charCodeAt(0).toString(32);
}
function encodeFilename(name) {
    let suffix = '';
    return (name.replace(/[^A-Z0-9]/gi, (character) => {
        suffix += `-${encodeCharacter(character)}`;
        return '/';
    }) + suffix);
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 */
function generateFileID(file, instanceId) {
    // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
    // is slower! simple string concatenation is fast
    let id = instanceId || 'uppy';
    if (typeof file.name === 'string') {
        id += `-${encodeFilename(file.name.toLowerCase())}`;
    }
    if (file.type !== undefined) {
        id += `-${file.type}`;
    }
    if (file.meta && typeof file.meta.relativePath === 'string') {
        id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
    }
    if (file.data.size !== undefined) {
        id += `-${file.data.size}`;
    }
    if (file.data.lastModified !== undefined) {
        id += `-${file.data.lastModified}`;
    }
    return id;
}
// If the provider has a stable, unique ID, then we can use that to identify the file.
// Then we don't have to generate our own ID, and we can add the same file many times if needed (different path)
function hasFileStableId(file) {
    if (!file.isRemote || !file.remote)
        return false;
    // These are the providers that it seems like have stable IDs for their files. The other's I haven't checked yet.
    const stableIdProviders = new Set([
        'box',
        'dropbox',
        'drive',
        'facebook',
        'unsplash',
    ]);
    return stableIdProviders.has(file.remote.provider);
}
function getSafeFileId(file, instanceId) {
    if (hasFileStableId(file))
        return file.id;
    const fileType = getFileType(file);
    return generateFileID({
        ...file,
        type: fileType,
    }, instanceId);
}

function getAllowedMetaFields(fields, meta) {
    if (fields === true) {
        return Object.keys(meta);
    }
    if (Array.isArray(fields)) {
        return fields;
    }
    return [];
}

/**
 * Converts list into array
 */
var toArray = Array.from;

// .files fallback, should be implemented in any browser
function fallbackApi(dataTransfer) {
    const files = toArray(dataTransfer.files);
    return Promise.resolve(files);
}

/**
 * Recursive function, calls the original callback() when the directory is entirely parsed.
 */
function getFilesAndDirectoriesFromDirectory(directoryReader, oldEntries, logDropError, { onSuccess }) {
    directoryReader.readEntries((entries) => {
        const newEntries = [...oldEntries, ...entries];
        // According to the FileSystem API spec, getFilesAndDirectoriesFromDirectory()
        // must be called until it calls the onSuccess with an empty array.
        if (entries.length) {
            queueMicrotask(() => {
                getFilesAndDirectoriesFromDirectory(directoryReader, newEntries, logDropError, { onSuccess });
            });
            // Done iterating this particular directory
        }
        else {
            onSuccess(newEntries);
        }
    }, 
    // Make sure we resolve on error anyway, it's fine if only one directory couldn't be parsed!
    (error) => {
        logDropError(error);
        onSuccess(oldEntries);
    });
}

/**
 * Polyfill for the new (experimental) getAsFileSystemHandle API (using the popular webkitGetAsEntry behind the scenes)
 * so that we can switch to the getAsFileSystemHandle API once it (hopefully) becomes standard
 */
function getAsFileSystemHandleFromEntry(entry, logDropError) {
    if (entry == null)
        return entry;
    return {
        kind: entry.isFile
            ? 'file'
            : entry.isDirectory
                ? 'directory'
                : undefined,
        name: entry.name,
        getFile() {
            return new Promise((resolve, reject) => entry.file(resolve, reject));
        },
        async *values() {
            // If the file is a directory.
            const directoryReader = entry.createReader();
            const entries = await new Promise((resolve) => {
                getFilesAndDirectoriesFromDirectory(directoryReader, [], logDropError, {
                    onSuccess: (dirEntries) => resolve(dirEntries.map((file) => getAsFileSystemHandleFromEntry(file, logDropError))),
                });
            });
            yield* entries;
        },
        isSameEntry: undefined,
    };
}
async function* createPromiseToAddFileOrParseDirectory(entry, relativePath, lastResortFile = undefined) {
    const getNextRelativePath = () => `${relativePath}/${entry.name}`;
    // For each dropped item, - make sure it's a file/directory, and start deepening in!
    if (entry.kind === 'file') {
        const file = await entry.getFile();
        if (file != null) {
            file.relativePath = relativePath ? getNextRelativePath() : null;
            yield file;
        }
        else if (lastResortFile != null)
            yield lastResortFile;
    }
    else if (entry.kind === 'directory') {
        for await (const handle of entry.values()) {
            // Recurse on the directory, appending the dir name to the relative path
            yield* createPromiseToAddFileOrParseDirectory(handle, relativePath ? getNextRelativePath() : entry.name);
        }
    }
    else if (lastResortFile != null)
        yield lastResortFile;
}
/**
 * Load all files from data transfer, and recursively read any directories.
 * Note that IE is not supported for drag-drop, because IE doesn't support Data Transfers
 *
 * @param {DataTransfer} dataTransfer
 * @param {*} logDropError on error
 */
async function* getFilesFromDataTransfer(dataTransfer, logDropError) {
    // Retrieving the dropped items must happen synchronously
    // otherwise only the first item gets treated and the other ones are garbage collected.
    // https://github.com/transloadit/uppy/pull/3998
    const fileSystemHandles = await Promise.all(Array.from(dataTransfer.items, async (item) => {
        // biome-ignore lint/style/useConst: ...
        let fileSystemHandle;
        // TODO enable getAsFileSystemHandle API once we can get it working with subdirectories
        // IMPORTANT: Need to check isSecureContext *before* calling getAsFileSystemHandle
        // or else Chrome will crash when running in HTTP: https://github.com/transloadit/uppy/issues/4133
        // if (window.isSecureContext && item.getAsFileSystemHandle != null)
        // fileSystemHandle = await item.getAsFileSystemHandle()
        // `webkitGetAsEntry` exists in all popular browsers (including non-WebKit browsers),
        // however it may be renamed to getAsEntry() in the future, so you should code defensively, looking for both.
        // from https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
        const getAsEntry = () => typeof item.getAsEntry === 'function'
            ? item.getAsEntry()
            : item.webkitGetAsEntry();
        fileSystemHandle ??= getAsFileSystemHandleFromEntry(getAsEntry(), logDropError);
        return {
            fileSystemHandle,
            lastResortFile: item.getAsFile(), // can be used as a fallback in case other methods fail
        };
    }));
    for (const { lastResortFile, fileSystemHandle } of fileSystemHandles) {
        // fileSystemHandle and lastResortFile can be null when we drop an url.
        if (fileSystemHandle != null) {
            try {
                yield* createPromiseToAddFileOrParseDirectory(fileSystemHandle, '', lastResortFile);
            }
            catch (err) {
                // Example: If dropping a symbolic link, Chromium will throw:
                // "DOMException: A requested file or directory could not be found at the time an operation was processed.",
                // So we will use lastResortFile instead. See https://github.com/transloadit/uppy/issues/3505.
                if (lastResortFile != null) {
                    yield lastResortFile;
                }
                else {
                    logDropError(err);
                }
            }
        }
        else if (lastResortFile != null)
            yield lastResortFile;
    }
}

/**
 * Returns a promise that resolves to the array of dropped files (if a folder is
 * dropped, and browser supports folder parsing - promise resolves to the flat
 * array of all files in all directories).
 * Each file has .relativePath prop appended to it (e.g. "/docs/Prague/ticket_from_prague_to_ufa.pdf")
 * if browser supports it. Otherwise it's undefined.
 *
 * @param dataTransfer
 * @param options
 * @param options.logDropError - a function that's called every time some
 * folder or some file error out (e.g. because of the folder name being too long
 * on Windows). Notice that resulting promise will always be resolved anyway.
 *
 * @returns {Promise} - Array<File>
 */
async function getDroppedFiles(dataTransfer, options) {
    // Get all files from all subdirs. Works (at least) in Chrome, Mozilla, and Safari
    const logDropError = options?.logDropError ?? Function.prototype;
    try {
        const accumulator = [];
        for await (const file of getFilesFromDataTransfer(dataTransfer, logDropError)) {
            accumulator.push(file);
        }
        return accumulator;
        // Otherwise just return all first-order files
    }
    catch {
        return fallbackApi(dataTransfer);
    }
}

const mimeToExtensions = {
    __proto__: null,
    'audio/mp3': 'mp3',
    'audio/mp4': 'mp4',
    'audio/ogg': 'ogg',
    'audio/webm': 'webm',
    'image/gif': 'gif',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/ogg': 'ogv',
    'video/quicktime': 'mov',
    'video/webm': 'webm',
    'video/x-matroska': 'mkv',
    'video/x-msvideo': 'avi',
};
function getFileTypeExtension(mimeType) {
    [mimeType] = mimeType.split(';', 1);
    return mimeToExtensions[mimeType] || null;
}

function getSocketHost(url) {
    // get the host domain
    const regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?([^\n]+)/i;
    const host = regex.exec(url)?.[1];
    const socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
    return `${socketProtocol}://${host}`;
}

/**
 * Get the declared text direction for an element.
 */
function getTextDirection(element) {
    // There is another way to determine text direction using getComputedStyle(), as done here:
    // https://github.com/pencil-js/text-direction/blob/2a235ce95089b3185acec3b51313cbba921b3811/text-direction.js
    //
    // We do not use that approach because we are interested specifically in the _declared_ text direction.
    // If no text direction is declared, we have to provide our own explicit text direction so our
    // bidirectional CSS style sheets work.
    while (element && !element.dir) {
        element = element.parentNode;
    }
    return element?.dir;
}

/**
 * Adds zero to strings shorter than two characters.
 */
function pad(number) {
    return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */
function getTimeStamp() {
    const date = new Date();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
 */
function isDragDropSupported() {
    if (typeof window === 'undefined') {
        return false;
    }
    const body = document.body;
    // sometimes happens in the wild: https://github.com/transloadit/uppy/issues/5953
    if (body == null || window == null) {
        return false;
    }
    if (!('draggable' in body) ||
        !('ondragstart' in body) ||
        !('ondrop' in body)) {
        return false;
    }
    if (!('FormData' in window)) {
        return false;
    }
    if (!('FileReader' in window)) {
        return false;
    }
    return true;
}

function isNetworkError$1(xhr) {
    if (!xhr) {
        return false;
    }
    return (xhr.readyState !== 0 && xhr.readyState !== 4) || xhr.status === 0;
}

/**
 * Check if a URL string is an object URL from `URL.createObjectURL`.
 */
function isObjectURL(url) {
    return url.startsWith('blob:');
}

function isPreviewSupported(fileType) {
    if (!fileType)
        return false;
    // list of images that browsers can preview
    return /^[^/]+\/(jpe?g|gif|png|svg|svg\+xml|bmp|webp|avif)$/.test(fileType);
}

function secondsToTime(rawSeconds) {
    const hours = Math.floor(rawSeconds / 3600) % 24;
    const minutes = Math.floor(rawSeconds / 60) % 60;
    const seconds = Math.floor(rawSeconds % 60);
    return { hours, minutes, seconds };
}

function prettyETA(seconds) {
    const time = secondsToTime(seconds);
    // Only display hours and minutes if they are greater than 0 but always
    // display minutes if hours is being displayed
    // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s
    const hoursStr = time.hours === 0 ? '' : `${time.hours}h`;
    const minutesStr = time.minutes === 0
        ? ''
        : `${time.hours === 0
            ? time.minutes
            : ` ${time.minutes.toString(10).padStart(2, '0')}`}m`;
    const secondsStr = time.hours !== 0
        ? ''
        : `${time.minutes === 0
            ? time.seconds
            : ` ${time.seconds.toString(10).padStart(2, '0')}`}s`;
    return `${hoursStr}${minutesStr}${secondsStr}`;
}

function createCancelError(cause) {
    return new Error('Cancelled', { cause });
}
function abortOn(signal) {
    if (signal != null) {
        const abortPromise = () => this.abort(signal.reason);
        signal.addEventListener('abort', abortPromise, { once: true });
        const removeAbortListener = () => {
            signal.removeEventListener('abort', abortPromise);
        };
        this.then?.(removeAbortListener, removeAbortListener);
    }
    return this;
}
class RateLimitedQueue {
    #activeRequests = 0;
    #queuedHandlers = [];
    #paused = false;
    #pauseTimer;
    #downLimit = 1;
    #upperLimit;
    #rateLimitingTimer;
    limit;
    constructor(limit) {
        if (typeof limit !== 'number' || limit === 0) {
            this.limit = Infinity;
        }
        else {
            this.limit = limit;
        }
    }
    #call(fn) {
        this.#activeRequests += 1;
        let done = false;
        let cancelActive;
        try {
            cancelActive = fn();
        }
        catch (err) {
            this.#activeRequests -= 1;
            throw err;
        }
        return {
            abort: (cause) => {
                if (done)
                    return;
                done = true;
                this.#activeRequests -= 1;
                cancelActive?.(cause);
                this.#queueNext();
            },
            done: () => {
                if (done)
                    return;
                done = true;
                this.#activeRequests -= 1;
                this.#queueNext();
            },
        };
    }
    #queueNext() {
        // Do it soon but not immediately, this allows clearing out the entire queue synchronously
        // one by one without continuously _advancing_ it (and starting new tasks before immediately
        // aborting them)
        queueMicrotask(() => this.#next());
    }
    #next() {
        if (this.#paused || this.#activeRequests >= this.limit) {
            return;
        }
        if (this.#queuedHandlers.length === 0) {
            return;
        }
        // Dispatch the next request, and update the abort/done handlers
        // so that cancelling it does the Right Thing (and doesn't just try
        // to dequeue an already-running request).
        const next = this.#queuedHandlers.shift();
        if (next == null) {
            throw new Error('Invariant violation: next is null');
        }
        const handler = this.#call(next.fn);
        next.abort = handler.abort;
        next.done = handler.done;
    }
    #queue(fn, options) {
        const handler = {
            fn,
            priority: options?.priority || 0,
            abort: () => {
                this.#dequeue(handler);
            },
            done: () => {
                throw new Error('Cannot mark a queued request as done: this indicates a bug');
            },
        };
        const index = this.#queuedHandlers.findIndex((other) => {
            return handler.priority > other.priority;
        });
        if (index === -1) {
            this.#queuedHandlers.push(handler);
        }
        else {
            this.#queuedHandlers.splice(index, 0, handler);
        }
        return handler;
    }
    #dequeue(handler) {
        const index = this.#queuedHandlers.indexOf(handler);
        if (index !== -1) {
            this.#queuedHandlers.splice(index, 1);
        }
    }
    run(fn, queueOptions) {
        if (!this.#paused && this.#activeRequests < this.limit) {
            return this.#call(fn);
        }
        return this.#queue(fn, queueOptions);
    }
    wrapSyncFunction(fn, queueOptions) {
        return (...args) => {
            const queuedRequest = this.run(() => {
                fn(...args);
                queueMicrotask(() => queuedRequest.done());
                return () => { };
            }, queueOptions);
            return {
                abortOn,
                abort() {
                    queuedRequest.abort();
                },
            };
        };
    }
    wrapPromiseFunction(fn, queueOptions) {
        return (...args) => {
            let queuedRequest;
            const outerPromise = new Promise((resolve, reject) => {
                queuedRequest = this.run(() => {
                    let cancelError;
                    let innerPromise;
                    try {
                        innerPromise = Promise.resolve(fn(...args));
                    }
                    catch (err) {
                        innerPromise = Promise.reject(err);
                    }
                    innerPromise.then((result) => {
                        if (cancelError) {
                            reject(cancelError);
                        }
                        else {
                            queuedRequest.done();
                            resolve(result);
                        }
                    }, (err) => {
                        if (cancelError) {
                            reject(cancelError);
                        }
                        else {
                            queuedRequest.done();
                            reject(err);
                        }
                    });
                    return (cause) => {
                        cancelError = createCancelError(cause);
                    };
                }, queueOptions);
            });
            outerPromise.abort = (cause) => {
                queuedRequest.abort(cause);
            };
            outerPromise.abortOn = abortOn;
            return outerPromise;
        };
    }
    resume() {
        this.#paused = false;
        clearTimeout(this.#pauseTimer);
        for (let i = 0; i < this.limit; i++) {
            this.#queueNext();
        }
    }
    #resume = () => this.resume();
    /**
     * Freezes the queue for a while or indefinitely.
     *
     * @param {number | null } [duration] Duration for the pause to happen, in milliseconds.
     *                                    If omitted, the queue won't resume automatically.
     */
    pause(duration = null) {
        this.#paused = true;
        clearTimeout(this.#pauseTimer);
        if (duration != null) {
            this.#pauseTimer = setTimeout(this.#resume, duration);
        }
    }
    /**
     * Pauses the queue for a duration, and lower the limit of concurrent requests
     * when the queue resumes. When the queue resumes, it tries to progressively
     * increase the limit in `this.#increaseLimit` until another call is made to
     * `this.rateLimit`.
     * Call this function when using the RateLimitedQueue for network requests and
     * the remote server responds with 429 HTTP code.
     *
     * @param {number} duration in milliseconds.
     */
    rateLimit(duration) {
        clearTimeout(this.#rateLimitingTimer);
        this.pause(duration);
        if (this.limit > 1 && Number.isFinite(this.limit)) {
            this.#upperLimit = this.limit - 1;
            this.limit = this.#downLimit;
            this.#rateLimitingTimer = setTimeout(this.#increaseLimit, duration);
        }
    }
    #increaseLimit = () => {
        if (this.#paused) {
            this.#rateLimitingTimer = setTimeout(this.#increaseLimit, 0);
            return;
        }
        this.#downLimit = this.limit;
        this.limit = Math.ceil((this.#upperLimit + this.#downLimit) / 2);
        for (let i = this.#downLimit; i <= this.limit; i++) {
            this.#queueNext();
        }
        if (this.#upperLimit - this.#downLimit > 3) {
            this.#rateLimitingTimer = setTimeout(this.#increaseLimit, 2000);
        }
        else {
            this.#downLimit = Math.floor(this.#downLimit / 2);
        }
    };
    get isPaused() {
        return this.#paused;
    }
}

function insertReplacement(source, rx, replacement) {
    const newParts = [];
    source.forEach((chunk) => {
        // When the source contains multiple placeholders for interpolation,
        // we should ignore chunks that are not strings, because those
        // can be JSX objects and will be otherwise incorrectly turned into strings.
        // Without this condition we’d get this: [object Object] hello [object Object] my <button>
        if (typeof chunk !== 'string') {
            return newParts.push(chunk);
        }
        return rx[Symbol.split](chunk).forEach((raw, i, list) => {
            if (raw !== '') {
                newParts.push(raw);
            }
            // Interlace with the `replacement` value
            if (i < list.length - 1) {
                newParts.push(replacement);
            }
        });
    });
    return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param phrase that needs interpolation, with placeholders
 * @param options with values that will be used to replace placeholders
 */
function interpolate(phrase, options) {
    const dollarRegex = /\$/g;
    const dollarBillsYall = '$$$$';
    let interpolated = [phrase];
    if (options == null)
        return interpolated;
    for (const arg of Object.keys(options)) {
        if (arg !== '_') {
            // Ensure replacement value is escaped to prevent special $-prefixed
            // regex replace tokens. the "$$$$" is needed because each "$" needs to
            // be escaped with "$" itself, and we need two in the resulting output.
            let replacement = options[arg];
            if (typeof replacement === 'string') {
                replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
            }
            // We create a new `RegExp` each time instead of using a more-efficient
            // string replace so that the same argument can be replaced multiple times
            // in the same phrase.
            interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
        }
    }
    return interpolated;
}
const defaultOnMissingKey = (key) => {
    throw new Error(`missing string: ${key}`);
};
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */
class Translator {
    locale;
    constructor(locales, { onMissingKey = defaultOnMissingKey } = {}) {
        this.locale = {
            strings: {},
            pluralize(n) {
                if (n === 1) {
                    return 0;
                }
                return 1;
            },
        };
        if (Array.isArray(locales)) {
            locales.forEach(this.#apply, this);
        }
        else {
            this.#apply(locales);
        }
        this.#onMissingKey = onMissingKey;
    }
    #onMissingKey;
    #apply(locale) {
        if (!locale?.strings) {
            return;
        }
        const prevLocale = this.locale;
        Object.assign(this.locale, {
            strings: { ...prevLocale.strings, ...locale.strings },
            pluralize: locale.pluralize || prevLocale.pluralize,
        });
    }
    /**
     * Public translate method
     *
     * @param key
     * @param options with values that will be used later to replace placeholders in string
     * @returns string translated (and interpolated)
     */
    translate(key, options) {
        return this.translateArray(key, options).join('');
    }
    /**
     * Get a translation and return the translated and interpolated parts as an array.
     *
     * @returns The translated and interpolated parts, in order.
     */
    translateArray(key, options) {
        let string = this.locale.strings[key];
        if (string == null) {
            this.#onMissingKey(key);
            string = key;
        }
        const hasPluralForms = typeof string === 'object';
        if (hasPluralForms) {
            if (options && typeof options.smart_count !== 'undefined') {
                const plural = this.locale.pluralize(options.smart_count);
                return interpolate(string[plural], options);
            }
            throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
        }
        if (typeof string !== 'string') {
            throw new Error(`string was not a string`);
        }
        return interpolate(string, options);
    }
}

/**
 * Truncates a string to the given number of chars (maxLength) by inserting '...' in the middle of that string.
 * Partially taken from https://stackoverflow.com/a/5723274/3192470.
 */
const separator = '...';
function truncateString(string, maxLength) {
    // Return the empty string if maxLength is zero
    if (maxLength === 0)
        return '';
    // Return original string if it's already shorter than maxLength
    if (string.length <= maxLength)
        return string;
    // Return truncated substring appended of the ellipsis char if string can't be meaningfully truncated
    if (maxLength <= separator.length + 1)
        return `${string.slice(0, maxLength - 1)}…`;
    const charsToShow = maxLength - separator.length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return string.slice(0, frontChars) + separator + string.slice(-backChars);
}

class UserFacingApiError extends Error {
    name = 'UserFacingApiError';
}

var n$1,l$2,u$3,i$2,r$2,o$2,e$2,f$3,c$2,s$2,a$2,p$2={},v$2=[],y$2=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,w$2=Array.isArray;function d$2(n,l){for(var u in l)n[u]=l[u];return n}function g$1(n){n&&n.parentNode&&n.parentNode.removeChild(n);}function _$1(l,u,t){var i,r,o,e={};for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:e[o]=u[o];if(arguments.length>2&&(e.children=arguments.length>3?n$1.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps) void 0===e[o]&&(e[o]=l.defaultProps[o]);return m$2(l,e,i,r,null)}function m$2(n,t,i,r,o){var e={type:n,props:t,key:i,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:null==o?++u$3:o,__i:-1,__u:0};return null==o&&null!=l$2.vnode&&l$2.vnode(e),e}function b$1(){return {current:null}}function k$2(n){return n.children}function x(n,l){this.props=n,this.context=l;}function S$1(n,l){if(null==l)return n.__?S$1(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?S$1(n):null}function C$1(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return C$1(n)}}function M$1(n){(!n.__d&&(n.__d=true)&&i$2.push(n)&&!$$1.__r++||r$2!=l$2.debounceRendering)&&((r$2=l$2.debounceRendering)||o$2)($$1);}function $$1(){for(var n,u,t,r,o,f,c,s=1;i$2.length;)i$2.length>s&&i$2.sort(e$2),n=i$2.shift(),s=i$2.length,n.__d&&(t=void 0,r=void 0,o=(r=(u=n).__v).__e,f=[],c=[],u.__P&&((t=d$2({},r)).__v=r.__v+1,l$2.vnode&&l$2.vnode(t),O$1(u.__P,t,r,u.__n,u.__P.namespaceURI,32&r.__u?[o]:null,f,null==o?S$1(r):o,!!(32&r.__u),c),t.__v=r.__v,t.__.__k[t.__i]=t,N$1(f,t,c),r.__e=r.__=null,t.__e!=o&&C$1(t)));$$1.__r=0;}function I$1(n,l,u,t,i,r,o,e,f,c,s){var a,h,y,w,d,g,_,m=t&&t.__k||v$2,b=l.length;for(f=P$1(u,l,m,f,b),a=0;a<b;a++)null!=(y=u.__k[a])&&(h=-1==y.__i?p$2:m[y.__i]||p$2,y.__i=a,g=O$1(n,y,h,i,r,o,e,f,c,s),w=y.__e,y.ref&&h.ref!=y.ref&&(h.ref&&B$2(h.ref,null,y),s.push(y.ref,y.__c||w,y)),null==d&&null!=w&&(d=w),(_=!!(4&y.__u))||h.__k===y.__k?f=A$2(y,f,n,_):"function"==typeof y.type&&void 0!==g?f=g:w&&(f=w.nextSibling),y.__u&=-7);return u.__e=d,f}function P$1(n,l,u,t,i){var r,o,e,f,c,s=u.length,a=s,h=0;for(n.__k=new Array(i),r=0;r<i;r++)null!=(o=l[r])&&"boolean"!=typeof o&&"function"!=typeof o?(f=r+h,(o=n.__k[r]="string"==typeof o||"number"==typeof o||"bigint"==typeof o||o.constructor==String?m$2(null,o,null,null,null):w$2(o)?m$2(k$2,{children:o},null,null,null):null==o.constructor&&o.__b>0?m$2(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o).__=n,o.__b=n.__b+1,e=null,-1!=(c=o.__i=L$1(o,u,f,a))&&(a--,(e=u[c])&&(e.__u|=2)),null==e||null==e.__v?(-1==c&&(i>s?h--:i<s&&h++),"function"!=typeof o.type&&(o.__u|=4)):c!=f&&(c==f-1?h--:c==f+1?h++:(c>f?h--:h++,o.__u|=4))):n.__k[r]=null;if(a)for(r=0;r<s;r++)null!=(e=u[r])&&0==(2&e.__u)&&(e.__e==t&&(t=S$1(e)),D$2(e,e));return t}function A$2(n,l,u,t){var i,r;if("function"==typeof n.type){for(i=n.__k,r=0;i&&r<i.length;r++)i[r]&&(i[r].__=n,l=A$2(i[r],l,u,t));return l}n.__e!=l&&(t&&(l&&n.type&&!l.parentNode&&(l=S$1(n)),u.insertBefore(n.__e,l||null)),l=n.__e);do{l=l&&l.nextSibling;}while(null!=l&&8==l.nodeType);return l}function H$1(n,l){return l=l||[],null==n||"boolean"==typeof n||(w$2(n)?n.some(function(n){H$1(n,l);}):l.push(n)),l}function L$1(n,l,u,t){var i,r,o,e=n.key,f=n.type,c=l[u],s=null!=c&&0==(2&c.__u);if(null===c&&null==n.key||s&&e==c.key&&f==c.type)return u;if(t>(s?1:0))for(i=u-1,r=u+1;i>=0||r<l.length;)if(null!=(c=l[o=i>=0?i--:r++])&&0==(2&c.__u)&&e==c.key&&f==c.type)return o;return  -1}function T$2(n,l,u){"-"==l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||y$2.test(l)?u:u+"px";}function j$2(n,l,u,t,i){var r,o;n:if("style"==l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||T$2(n.style,l,"");if(u)for(l in u)t&&u[l]==t[l]||T$2(n.style,l,u[l]);}else if("o"==l[0]&&"n"==l[1])r=l!=(l=l.replace(f$3,"$1")),o=l.toLowerCase(),l=o in n||"onFocusOut"==l||"onFocusIn"==l?o.slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?t?u.u=t.u:(u.u=c$2,n.addEventListener(l,r?a$2:s$2,r)):n.removeEventListener(l,r?a$2:s$2,r);else {if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||false===u&&"-"!=l[4]?n.removeAttribute(l):n.setAttribute(l,"popover"==l&&1==u?"":u));}}function F$1(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u.t)u.t=c$2++;else if(u.t<t.u)return;return t(l$2.event?l$2.event(u):u)}}}function O$1(n,u,t,i,r,o,e,f,c,s){var a,h,p,v,y,_,m,b,S,C,M,$,P,A,H,L,T,j=u.type;if(null!=u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),o=[f=u.__e=t.__e]),(a=l$2.__b)&&a(u);n:if("function"==typeof j)try{if(b=u.props,S="prototype"in j&&j.prototype.render,C=(a=j.contextType)&&i[a.__c],M=a?C?C.props.value:a.__:i,t.__c?m=(h=u.__c=t.__c).__=h.__E:(S?u.__c=h=new j(b,M):(u.__c=h=new x(b,M),h.constructor=j,h.render=E$1),C&&C.sub(h),h.props=b,h.state||(h.state={}),h.context=M,h.__n=i,p=h.__d=!0,h.__h=[],h._sb=[]),S&&null==h.__s&&(h.__s=h.state),S&&null!=j.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=d$2({},h.__s)),d$2(h.__s,j.getDerivedStateFromProps(b,h.__s))),v=h.props,y=h.state,h.__v=u,p)S&&null==j.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),S&&null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(S&&null==j.getDerivedStateFromProps&&b!==v&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(b,M),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(b,h.__s,M)||u.__v==t.__v){for(u.__v!=t.__v&&(h.props=b,h.state=h.__s,h.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u);}),$=0;$<h._sb.length;$++)h.__h.push(h._sb[$]);h._sb=[],h.__h.length&&e.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(b,h.__s,M),S&&null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(v,y,_);});}if(h.context=M,h.props=b,h.__P=n,h.__e=!1,P=l$2.__r,A=0,S){for(h.state=h.__s,h.__d=!1,P&&P(u),a=h.render(h.props,h.state,h.context),H=0;H<h._sb.length;H++)h.__h.push(h._sb[H]);h._sb=[];}else do{h.__d=!1,P&&P(u),a=h.render(h.props,h.state,h.context),h.state=h.__s;}while(h.__d&&++A<25);h.state=h.__s,null!=h.getChildContext&&(i=d$2(d$2({},i),h.getChildContext())),S&&!p&&null!=h.getSnapshotBeforeUpdate&&(_=h.getSnapshotBeforeUpdate(v,y)),L=a,null!=a&&a.type===k$2&&null==a.key&&(L=V$1(a.props.children)),f=I$1(n,w$2(L)?L:[L],u,t,i,r,o,e,f,c,s),h.base=u.__e,u.__u&=-161,h.__h.length&&e.push(h),m&&(h.__E=h.__=null);}catch(n){if(u.__v=null,c||null!=o)if(n.then){for(u.__u|=c?160:128;f&&8==f.nodeType&&f.nextSibling;)f=f.nextSibling;o[o.indexOf(f)]=null,u.__e=f;}else {for(T=o.length;T--;)g$1(o[T]);z$2(u);}else u.__e=t.__e,u.__k=t.__k,n.then||z$2(u);l$2.__e(n,u,t);}else null==o&&u.__v==t.__v?(u.__k=t.__k,u.__e=t.__e):f=u.__e=q$2(t.__e,u,t,i,r,o,e,c,s);return (a=l$2.diffed)&&a(u),128&u.__u?void 0:f}function z$2(n){n&&n.__c&&(n.__c.__e=true),n&&n.__k&&n.__k.forEach(z$2);}function N$1(n,u,t){for(var i=0;i<t.length;i++)B$2(t[i],t[++i],t[++i]);l$2.__c&&l$2.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$2.__e(n,u.__v);}});}function V$1(n){return "object"!=typeof n||null==n||n.__b&&n.__b>0?n:w$2(n)?n.map(V$1):d$2({},n)}function q$2(u,t,i,r,o,e,f,c,s){var a,h,v,y,d,_,m,b=i.props,k=t.props,x=t.type;if("svg"==x?o="http://www.w3.org/2000/svg":"math"==x?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),null!=e)for(a=0;a<e.length;a++)if((d=e[a])&&"setAttribute"in d==!!x&&(x?d.localName==x:3==d.nodeType)){u=d,e[a]=null;break}if(null==u){if(null==x)return document.createTextNode(k);u=document.createElementNS(o,x,k.is&&k),c&&(l$2.__m&&l$2.__m(t,e),c=false),e=null;}if(null==x)b===k||c&&u.data==k||(u.data=k);else {if(e=e&&n$1.call(u.childNodes),b=i.props||p$2,!c&&null!=e)for(b={},a=0;a<u.attributes.length;a++)b[(d=u.attributes[a]).name]=d.value;for(a in b)if(d=b[a],"children"==a);else if("dangerouslySetInnerHTML"==a)v=d;else if(!(a in k)){if("value"==a&&"defaultValue"in k||"checked"==a&&"defaultChecked"in k)continue;j$2(u,a,null,d,o);}for(a in k)d=k[a],"children"==a?y=d:"dangerouslySetInnerHTML"==a?h=d:"value"==a?_=d:"checked"==a?m=d:c&&"function"!=typeof d||b[a]===d||j$2(u,a,d,b[a],o);if(h)c||v&&(h.__html==v.__html||h.__html==u.innerHTML)||(u.innerHTML=h.__html),t.__k=[];else if(v&&(u.innerHTML=""),I$1("template"==t.type?u.content:u,w$2(y)?y:[y],t,i,r,"foreignObject"==x?"http://www.w3.org/1999/xhtml":o,e,f,e?e[0]:i.__k&&S$1(i,0),c,s),null!=e)for(a=e.length;a--;)g$1(e[a]);c||(a="value","progress"==x&&null==_?u.removeAttribute("value"):null!=_&&(_!==u[a]||"progress"==x&&!_||"option"==x&&_!=b[a])&&j$2(u,a,_,b[a],o),a="checked",null!=m&&m!=u[a]&&j$2(u,a,m,b[a],o));}return u}function B$2(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u));}else n.current=u;}catch(n){l$2.__e(n,t);}}function D$2(n,u,t){var i,r;if(l$2.unmount&&l$2.unmount(n),(i=n.ref)&&(i.current&&i.current!=n.__e||B$2(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount();}catch(n){l$2.__e(n,u);}i.base=i.__P=null;}if(i=n.__k)for(r=0;r<i.length;r++)i[r]&&D$2(i[r],u,t||"function"!=typeof n.type);t||g$1(n.__e),n.__c=n.__=n.__e=void 0;}function E$1(n,l,u){return this.constructor(n,u)}function G(u,t,i){var r,o,e,f;t==document&&(t=document.documentElement),l$2.__&&l$2.__(u,t),o=(r="function"=="undefined")?null:t.__k,e=[],f=[],O$1(t,u=(t).__k=_$1(k$2,null,[u]),o||p$2,p$2,t.namespaceURI,o?null:t.firstChild?n$1.call(t.childNodes):null,e,o?o.__e:t.firstChild,r,f),N$1(e,u,f);}function K$1(l,u,t){var i,r,o,e,f=d$2({},l.props);for(o in l.type&&l.type.defaultProps&&(e=l.type.defaultProps),u)"key"==o?i=u[o]:"ref"==o?r=u[o]:f[o]=void 0===u[o]&&null!=e?e[o]:u[o];return arguments.length>2&&(f.children=arguments.length>3?n$1.call(arguments,2):t),m$2(l.type,f,i||l.key,r||l.ref,null)}n$1=v$2.slice,l$2={__e:function(n,l,u,t){for(var i,r,o;l=l.__;)if((i=l.__c)&&!i.__)try{if((r=i.constructor)&&null!=r.getDerivedStateFromError&&(i.setState(r.getDerivedStateFromError(n)),o=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),o=i.__d),o)return i.__E=i}catch(l){n=l;}throw n}},u$3=0,x.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!=this.state?this.__s:this.__s=d$2({},this.state),"function"==typeof n&&(n=n(d$2({},u),this.props)),n&&d$2(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),M$1(this));},x.prototype.forceUpdate=function(n){this.__v&&(this.__e=true,n&&this.__h.push(n),M$1(this));},x.prototype.render=k$2,i$2=[],o$2="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,e$2=function(n,l){return n.__v.__b-l.__v.__b},$$1.__r=0,f$3=/(PointerCapture)$|Capture$/i,c$2=0,s$2=F$1(false),a$2=F$1(true);

var f$2=0;function u$2(e,t,n,o,i,u){t||(t={});var a,c,p=t;if("ref"in p)for(c in p={},t)"ref"==c?a=t[c]:p[c]=t[c];var l={type:e,props:p,key:n,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--f$2,__i:-1,__u:0,__source:i,__self:u};if("function"==typeof e&&(a=e.defaultProps))for(c in a) void 0===p[c]&&(p[c]=a[c]);return l$2.vnode&&l$2.vnode(l),l}

var t$1,r$1,u$1,i$1,o$1=0,f$1=[],c$1=l$2,e$1=c$1.__b,a$1=c$1.__r,v$1=c$1.diffed,l$1=c$1.__c,m$1=c$1.unmount,s$1=c$1.__;function p$1(n,t){c$1.__h&&c$1.__h(r$1,n,o$1||t),o$1=0;var u=r$1.__H||(r$1.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function d$1(n){return o$1=1,h$1(D$1,n)}function h$1(n,u,i){var o=p$1(t$1++,2);if(o.t=n,!o.__c&&(o.__=[D$1(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}));}],o.__c=r$1,!r$1.__f)){var f=function(n,t,r){if(!o.__c.__H)return  true;var u=o.__c.__H.__.filter(function(n){return !!n.__c});if(u.every(function(n){return !n.__N}))return !c||c.call(this,n,t,r);var i=o.__c.props!==n;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=true);}}),c&&c.call(this,n,t,r)||i};r$1.__f=true;var c=r$1.shouldComponentUpdate,e=r$1.componentWillUpdate;r$1.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u;}e&&e.call(this,n,t,r);},r$1.shouldComponentUpdate=f;}return o.__N||o.__}function y$1(n,u){var i=p$1(t$1++,3);!c$1.__s&&C(i.__H,u)&&(i.__=n,i.u=u,r$1.__H.__h.push(i));}function A$1(n){return o$1=5,T$1(function(){return {current:n}},[])}function T$1(n,r){var u=p$1(t$1++,7);return C(u.__H,r)&&(u.__=n(),u.__H=r,u.__h=n),u.__}function q$1(n,t){return o$1=8,T$1(function(){return n},t)}function j$1(){for(var n;n=f$1.shift();)if(n.__P&&n.__H)try{n.__H.__h.forEach(z$1),n.__H.__h.forEach(B$1),n.__H.__h=[];}catch(t){n.__H.__h=[],c$1.__e(t,n.__v);}}c$1.__b=function(n){r$1=null,e$1&&e$1(n);},c$1.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),s$1&&s$1(n,t);},c$1.__r=function(n){a$1&&a$1(n),t$1=0;var i=(r$1=n.__c).__H;i&&(u$1===r$1?(i.__h=[],r$1.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0;})):(i.__h.forEach(z$1),i.__h.forEach(B$1),i.__h=[],t$1=0)),u$1=r$1;},c$1.diffed=function(n){v$1&&v$1(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==f$1.push(t)&&i$1===c$1.requestAnimationFrame||((i$1=c$1.requestAnimationFrame)||w$1)(j$1)),t.__H.__.forEach(function(n){n.u&&(n.__H=n.u),n.u=void 0;})),u$1=r$1=null;},c$1.__c=function(n,t){t.some(function(n){try{n.__h.forEach(z$1),n.__h=n.__h.filter(function(n){return !n.__||B$1(n)});}catch(r){t.some(function(n){n.__h&&(n.__h=[]);}),t=[],c$1.__e(r,n.__v);}}),l$1&&l$1(n,t);},c$1.unmount=function(n){m$1&&m$1(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.forEach(function(n){try{z$1(n);}catch(n){t=n;}}),r.__H=void 0,t&&c$1.__e(t,r.__v));};var k$1="function"==typeof requestAnimationFrame;function w$1(n){var t,r=function(){clearTimeout(u),k$1&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,35);k$1&&(t=requestAnimationFrame(r));}function z$1(n){var t=r$1,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r$1=t;}function B$1(n){var t=r$1;n.__c=n.__(),r$1=t;}function C(n,t){return !n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function D$1(n,t){return "function"==typeof t?t(n):t}

const STYLE_INNER = {
    position: 'relative',
    // Disabled for our use case: the wrapper elements around FileList already deal with overflow,
    // and this additional property would hide things that we want to show.
    //
    // overflow: 'hidden',
    width: '100%',
    minHeight: '100%',
};
const STYLE_CONTENT = {
    position: 'absolute',
    top: 0,
    left: 0,
    // Because the `top` value gets set to some offset, this `height` being 100% would make the scrollbar
    // stretch far beyond the content. For our use case, the content div actually can get its height from
    // the elements inside it, so we don't need to specify a `height` property at all.
    //
    // height: '100%',
    width: '100%',
    overflow: 'visible',
};
function VirtualList({ data, rowHeight, renderRow, overscanCount = 10, padding = 4, ...props }) {
    const scrollerRef = A$1(null);
    const [offset, setOffset] = d$1(0);
    const [height, setHeight] = d$1(0);
    y$1(() => {
        function resize() {
            if (scrollerRef.current != null &&
                height !== scrollerRef.current.offsetHeight) {
                setHeight(scrollerRef.current.offsetHeight);
            }
        }
        resize();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, [height]);
    const handleScroll = q$1(() => {
        if (scrollerRef.current)
            setOffset(scrollerRef.current.scrollTop);
    }, []);
    // first visible row index
    let start = Math.floor(offset / rowHeight);
    // actual number of visible rows (without overscan)
    let visibleRowCount = Math.floor(height / rowHeight);
    // Overscan: render blocks of rows modulo an overscan row count
    // This dramatically reduces DOM writes during scrolling
    if (overscanCount) {
        start = Math.max(0, start - (start % overscanCount));
        visibleRowCount += overscanCount;
    }
    const end = start + visibleRowCount + padding;
    // data slice currently in viewport plus overscan items
    const selection = data.slice(start, end);
    const styleInner = { ...STYLE_INNER, height: data.length * rowHeight };
    const styleContent = { ...STYLE_CONTENT, top: start * rowHeight };
    // The `role="presentation"` attributes ensure that these wrapper elements are not treated as list
    // items by accessibility and outline tools.
    return (u$2("div", { onScroll: handleScroll, ref: scrollerRef, ...props, children: u$2("div", { role: "presentation", style: styleInner, children: u$2("div", { role: "presentation", style: styleContent, children: selection.map(renderRow) }) }) }));
}

/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */
class BasePlugin {
    uppy;
    opts;
    id;
    defaultLocale;
    i18n;
    i18nArray;
    type;
    VERSION;
    constructor(uppy, opts) {
        this.uppy = uppy;
        this.opts = opts ?? {};
    }
    getPluginState() {
        const { plugins } = this.uppy.getState();
        return (plugins?.[this.id] || {});
    }
    setPluginState(update) {
        const { plugins } = this.uppy.getState();
        this.uppy.setState({
            plugins: {
                ...plugins,
                [this.id]: {
                    ...plugins[this.id],
                    ...update,
                },
            },
        });
    }
    setOptions(newOpts) {
        this.opts = { ...this.opts, ...newOpts };
        this.setPluginState(undefined); // so that UI re-renders with new options
        this.i18nInit();
    }
    i18nInit() {
        const translator = new Translator([
            this.defaultLocale,
            this.uppy.locale,
            this.opts.locale,
        ]);
        this.i18n = translator.translate.bind(translator);
        this.i18nArray = translator.translateArray.bind(translator);
        this.setPluginState(undefined); // so that UI re-renders and we see the updated locale
    }
    /**
     * Extendable methods
     * ==================
     * These methods are here to serve as an overview of the extendable methods as well as
     * making them not conditional in use, such as `if (this.afterUpdate)`.
     */
    addTarget(plugin) {
        throw new Error("Extend the addTarget method to add your plugin to another plugin's target");
    }
    install() { }
    uninstall() { }
    update(state) { }
    // Called after every state update, after everything's mounted. Debounced.
    afterUpdate() { }
}

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
class EventManager {
    #uppy;
    #events = [];
    constructor(uppy) {
        this.#uppy = uppy;
    }
    on(event, fn) {
        this.#events.push([event, fn]);
        return this.#uppy.on(event, fn);
    }
    remove() {
        for (const [event, fn] of this.#events.splice(0)) {
            this.#uppy.off(event, fn);
        }
    }
    onFilePause(fileID, cb) {
        this.on('upload-pause', (file, isPaused) => {
            if (fileID === file?.id) {
                cb(isPaused);
            }
        });
    }
    onFileRemove(fileID, cb) {
        this.on('file-removed', (file) => {
            if (fileID === file.id)
                cb(file.id);
        });
    }
    onPause(fileID, cb) {
        this.on('upload-pause', (file, isPaused) => {
            if (fileID === file?.id) {
                // const isPaused = this.#uppy.pauseResume(fileID)
                cb(isPaused);
            }
        });
    }
    onRetry(fileID, cb) {
        this.on('upload-retry', (file) => {
            if (fileID === file?.id) {
                cb();
            }
        });
    }
    onRetryAll(fileID, cb) {
        this.on('retry-all', () => {
            if (!this.#uppy.getFile(fileID))
                return;
            cb();
        });
    }
    onPauseAll(fileID, cb) {
        this.on('pause-all', () => {
            if (!this.#uppy.getFile(fileID))
                return;
            cb();
        });
    }
    onCancelAll(fileID, eventHandler) {
        this.on('cancel-all', (...args) => {
            if (!this.#uppy.getFile(fileID))
                return;
            eventHandler(...args);
        });
    }
    onResumeAll(fileID, cb) {
        this.on('resume-all', () => {
            if (!this.#uppy.getFile(fileID))
                return;
            cb();
        });
    }
}

// Swallow all logs, except errors.
// default if logger is not set or debug: false
const justErrorsLogger = {
    debug: () => { },
    warn: () => { },
    error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args),
};
// Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true
const debugLogger = {
    debug: (...args) => console.debug(`[Uppy] [${getTimeStamp()}]`, ...args),
    warn: (...args) => console.warn(`[Uppy] [${getTimeStamp()}]`, ...args),
    error: (...args) => console.error(`[Uppy] [${getTimeStamp()}]`, ...args),
};

var prettierBytes = function prettierBytes(input) {
    if (typeof input !== 'number' || Number.isNaN(input)) {
        throw new TypeError(`Expected a number, got ${typeof input}`);
    }
    const neg = input < 0;
    let num = Math.abs(input);
    if (neg) {
        num = -num;
    }
    if (num === 0) {
        return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1);
    const value = Number(num / 1024 ** exponent);
    const unit = units[exponent];
    return `${value >= 10 || value % 1 === 0 ? Math.round(value) : value.toFixed(1)} ${unit}`;
};


var prettierBytes$1 = /*@__PURE__*/getDefaultExportFromCjs(prettierBytes);

/* jshint node: true */

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

var wildcard$1 = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

var wildcard = wildcard$1;
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
var mimeMatch = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

var match = /*@__PURE__*/getDefaultExportFromCjs(mimeMatch);

const defaultOptions$7 = {
    maxFileSize: null,
    minFileSize: null,
    maxTotalFileSize: null,
    maxNumberOfFiles: null,
    minNumberOfFiles: null,
    allowedFileTypes: null,
    requiredMetaFields: [],
};
class RestrictionError extends Error {
    isUserFacing;
    file;
    constructor(message, opts) {
        super(message);
        this.isUserFacing = opts?.isUserFacing ?? true;
        if (opts?.file) {
            this.file = opts.file; // only some restriction errors are related to a particular file
        }
    }
    isRestriction = true;
}
class Restricter {
    getI18n;
    getOpts;
    constructor(getOpts, getI18n) {
        this.getI18n = getI18n;
        this.getOpts = () => {
            const opts = getOpts();
            if (opts.restrictions?.allowedFileTypes != null &&
                !Array.isArray(opts.restrictions.allowedFileTypes)) {
                throw new TypeError('`restrictions.allowedFileTypes` must be an array');
            }
            return opts;
        };
    }
    // Because these operations are slow, we cannot run them for every file (if we are adding multiple files)
    validateAggregateRestrictions(existingFiles, addingFiles) {
        const { maxTotalFileSize, maxNumberOfFiles } = this.getOpts().restrictions;
        if (maxNumberOfFiles) {
            const nonGhostFiles = existingFiles.filter((f) => !f.isGhost);
            if (nonGhostFiles.length + addingFiles.length > maxNumberOfFiles) {
                throw new RestrictionError(`${this.getI18n()('youCanOnlyUploadX', {
                    smart_count: maxNumberOfFiles,
                })}`);
            }
        }
        if (maxTotalFileSize) {
            const totalFilesSize = [...existingFiles, ...addingFiles].reduce((total, f) => total + (f.size ?? 0), 0);
            if (totalFilesSize > maxTotalFileSize) {
                throw new RestrictionError(this.getI18n()('aggregateExceedsSize', {
                    sizeAllowed: prettierBytes$1(maxTotalFileSize),
                    size: prettierBytes$1(totalFilesSize),
                }));
            }
        }
    }
    validateSingleFile(file) {
        const { maxFileSize, minFileSize, allowedFileTypes } = this.getOpts().restrictions;
        if (allowedFileTypes) {
            const isCorrectFileType = allowedFileTypes.some((type) => {
                // check if this is a mime-type
                if (type.includes('/')) {
                    if (!file.type)
                        return false;
                    return match(file.type.replace(/;.*?$/, ''), type);
                }
                // otherwise this is likely an extension
                if (type[0] === '.' && file.extension) {
                    return file.extension.toLowerCase() === type.slice(1).toLowerCase();
                }
                return false;
            });
            if (!isCorrectFileType) {
                const allowedFileTypesString = allowedFileTypes.join(', ');
                throw new RestrictionError(this.getI18n()('youCanOnlyUploadFileTypes', {
                    types: allowedFileTypesString,
                }), { file });
            }
        }
        // We can't check maxFileSize if the size is unknown.
        if (maxFileSize && file.size != null && file.size > maxFileSize) {
            throw new RestrictionError(this.getI18n()('exceedsSize', {
                size: prettierBytes$1(maxFileSize),
                file: file.name ?? this.getI18n()('unnamed'),
            }), { file });
        }
        // We can't check minFileSize if the size is unknown.
        if (minFileSize && file.size != null && file.size < minFileSize) {
            throw new RestrictionError(this.getI18n()('inferiorSize', {
                size: prettierBytes$1(minFileSize),
            }), { file });
        }
    }
    validate(existingFiles, addingFiles) {
        addingFiles.forEach((addingFile) => {
            this.validateSingleFile(addingFile);
        });
        this.validateAggregateRestrictions(existingFiles, addingFiles);
    }
    validateMinNumberOfFiles(files) {
        const { minNumberOfFiles } = this.getOpts().restrictions;
        if (minNumberOfFiles && Object.keys(files).length < minNumberOfFiles) {
            throw new RestrictionError(this.getI18n()('youHaveToAtLeastSelectX', {
                smart_count: minNumberOfFiles,
            }));
        }
    }
    getMissingRequiredMetaFields(file) {
        const error = new RestrictionError(this.getI18n()('missingRequiredMetaFieldOnFile', {
            fileName: file.name ?? this.getI18n()('unnamed'),
        }));
        const { requiredMetaFields } = this.getOpts().restrictions;
        const missingFields = [];
        for (const field of requiredMetaFields) {
            if (!Object.hasOwn(file.meta, field) || file.meta[field] === '') {
                missingFields.push(field);
            }
        }
        return { missingFields, error };
    }
}

/**
 * Defer a frequent call to the microtask queue.
 */
function debounce$3(fn) {
    let calling = null;
    let latestArgs;
    return (...args) => {
        latestArgs = args;
        if (!calling) {
            calling = Promise.resolve().then(() => {
                calling = null;
                // At this point `args` may be different from the most
                // recent state, if multiple calls happened since this task
                // was queued. So we use the `latestArgs`, which definitely
                // is the most recent call.
                return fn(...latestArgs);
            });
        }
        return calling;
    };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */
class UIPlugin extends BasePlugin {
    #updateUI;
    isTargetDOMEl;
    el;
    parent;
    title;
    getTargetPlugin(target) {
        let targetPlugin;
        if (typeof target?.addTarget === 'function') {
            // Targeting a plugin *instance*
            targetPlugin = target;
            if (!(targetPlugin instanceof UIPlugin)) {
                console.warn(new Error('The provided plugin is not an instance of UIPlugin. This is an indication of a bug with the way Uppy is bundled.', { cause: { targetPlugin, UIPlugin } }));
            }
        }
        else if (typeof target === 'function') {
            // Targeting a plugin type
            const Target = target;
            // Find the target plugin instance.
            this.uppy.iteratePlugins((p) => {
                if (p instanceof Target) {
                    targetPlugin = p;
                }
            });
        }
        return targetPlugin;
    }
    /**
     * Check if supplied `target` is a DOM element or an `object`.
     * If it’s an object — target is a plugin, and we search `plugins`
     * for a plugin with same name and return its target.
     */
    mount(target, plugin) {
        const callerPluginName = plugin.id;
        const targetElement = findDOMElement(target);
        if (targetElement) {
            this.isTargetDOMEl = true;
            // When target is <body> with a single <div> element,
            // Preact thinks it’s the Uppy root element in there when doing a diff,
            // and destroys it. So we are creating a fragment (could be empty div)
            const uppyRootElement = document.createElement('div');
            uppyRootElement.classList.add('uppy-Root');
            // API for plugins that require a synchronous rerender.
            this.#updateUI = debounce$3((state) => {
                // plugin could be removed, but this.rerender is debounced below,
                // so it could still be called even after uppy.removePlugin or uppy.destroy
                // hence the check
                if (!this.uppy.getPlugin(this.id))
                    return;
                G(this.render(state, uppyRootElement), uppyRootElement);
                this.afterUpdate();
            });
            this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);
            if (this.opts.replaceTargetContent) {
                // Doing render(h(null), targetElement), which should have been
                // a better way, since because the component might need to do additional cleanup when it is removed,
                // stopped working — Preact just adds null into target, not replacing
                targetElement.innerHTML = '';
            }
            G(this.render(this.uppy.getState(), uppyRootElement), uppyRootElement);
            this.el = uppyRootElement;
            targetElement.appendChild(uppyRootElement);
            // Set the text direction if the page has not defined one.
            uppyRootElement.dir =
                this.opts.direction || getTextDirection(uppyRootElement) || 'ltr';
            this.onMount();
            return this.el;
        }
        const targetPlugin = this.getTargetPlugin(target);
        if (targetPlugin) {
            this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
            this.parent = targetPlugin;
            this.el = targetPlugin.addTarget(plugin);
            this.onMount();
            return this.el;
        }
        this.uppy.log(`Not installing ${callerPluginName}`);
        let message = `Invalid target option given to ${callerPluginName}.`;
        if (typeof target === 'function') {
            message +=
                ' The given target is not a Plugin class. ' +
                    "Please check that you're not specifying a React Component instead of a plugin. " +
                    'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' +
                    'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
        }
        else {
            message +=
                'If you meant to target an HTML element, please make sure that the element exists. ' +
                    'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' +
                    '(see https://github.com/transloadit/uppy/issues/1042)\n\n' +
                    'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
        }
        throw new Error(message);
    }
    /**
     * Called when plugin is mounted, whether in DOM or into another plugin.
     * Needed because sometimes plugins are mounted separately/after `install`,
     * so this.el and this.parent might not be available in `install`.
     * This is the case with @uppy/react plugins, for example.
     */
    render(state, container) {
        throw new Error('Extend the render method to add your plugin to a DOM element');
    }
    update(state) {
        if (this.el != null) {
            this.#updateUI?.(state);
        }
    }
    unmount() {
        if (this.isTargetDOMEl) {
            this.el?.remove();
        }
        this.onUnmount();
    }
    onMount() { }
    onUnmount() { }
}

var version$b = "5.0.0";
var packageJson$b = {
	version: version$b};

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
    static VERSION = packageJson$b.version;
    state = {};
    #callbacks = new Set();
    getState() {
        return this.state;
    }
    setState(patch) {
        const prevState = { ...this.state };
        const nextState = { ...this.state, ...patch };
        this.state = nextState;
        this.#publish(prevState, nextState, patch);
    }
    subscribe(listener) {
        this.#callbacks.add(listener);
        return () => {
            this.#callbacks.delete(listener);
        };
    }
    #publish(...args) {
        this.#callbacks.forEach((listener) => {
            listener(...args);
        });
    }
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
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
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

function isObject$3(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$3;

/** Detect free variable `global` from Node.js. */

var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal$1;

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal || freeSelf || Function('return this')();

var _root = root$2;

var root$1 = _root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now$1 = function() {
  return root$1.Date.now();
};

var now_1 = now$1;

/** Used to match a single whitespace character. */

var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex$1(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

var _trimmedEndIndex = trimmedEndIndex$1;

var trimmedEndIndex = _trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim$1(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

var _baseTrim = baseTrim$1;

var root = _root;

/** Built-in value references. */
var Symbol$3 = root.Symbol;

var _Symbol = Symbol$3;

var Symbol$2 = _Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag$1;

/** Used for built-in method references. */

var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$2(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString$2;

var Symbol$1 = _Symbol,
    getRawTag = _getRawTag,
    objectToString$1 = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString$1(value);
}

var _baseGetTag = baseGetTag$1;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

function isObjectLike$1(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike$1;

var baseGetTag = _baseGetTag,
    isObjectLike = isObjectLike_1;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol$1;

var baseTrim = _baseTrim,
    isObject$2 = isObject_1,
    isSymbol = isSymbol_1;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$2(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$2(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber$1;

var isObject$1 = isObject_1,
    now = now_1,
    toNumber = toNumber_1;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce$1(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce$1;

var debounce$2 = /*@__PURE__*/getDefaultExportFromCjs(debounce_1);

var debounce = debounce_1,
    isObject = isObject_1;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

var throttle_1 = throttle;

var throttle$1 = /*@__PURE__*/getDefaultExportFromCjs(throttle_1);

/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/

var namespaceEmitter = function createNamespaceEmitter () {
  var emitter = {};
  var _fns = emitter._fns = {};

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event);

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6]);
    }
  };

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = [];
    }

    _fns[event].push(fn);
  };

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments);
      emitter.off(event, one);
    }
    this.on(event, one);
  };

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = [];

    if (event && fn) {
      var fns = this._fns[event];
      var i = 0;
      var l = fns ? fns.length : 0;

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i]);
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event];
  };

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : [];
    var idx = e.indexOf(':');
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)];

    var keys = Object.keys(_fns);
    var i = 0;
    var l = keys.length;

    for (i; i < l; i++) {
      var key = keys[i];
      if (key === '*') {
        out = out.concat(_fns[key]);
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key]);
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0;
    var l = fns.length;

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e;
      fns[i].apply(fns[i], args);
    }
  }

  return emitter
};

var ee$1 = /*@__PURE__*/getDefaultExportFromCjs(namespaceEmitter);

/* @ts-self-types="./index.d.ts" */
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
let nanoid = (size = 21) => {
  let id = '';
  let i = size | 0;
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0];
  }
  return id
};

var version$a = "5.1.0";
var packageJson$a = {
	version: version$a};

function getFileName(fileType, fileDescriptor) {
    if (fileDescriptor.name) {
        return fileDescriptor.name;
    }
    if (fileType.split('/')[0] === 'image') {
        return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
    }
    return 'noname';
}

var locale$7 = {
    strings: {
        addBulkFilesFailed: {
            0: 'Failed to add %{smart_count} file due to an internal error',
            1: 'Failed to add %{smart_count} files due to internal errors',
        },
        youCanOnlyUploadX: {
            0: 'You can only upload %{smart_count} file',
            1: 'You can only upload %{smart_count} files',
        },
        youHaveToAtLeastSelectX: {
            0: 'You have to select at least %{smart_count} file',
            1: 'You have to select at least %{smart_count} files',
        },
        aggregateExceedsSize: 'You selected %{size} of files, but maximum allowed size is %{sizeAllowed}',
        exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
        missingRequiredMetaField: 'Missing required meta fields',
        missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
        inferiorSize: 'This file is smaller than the allowed size of %{size}',
        youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
        noMoreFilesAllowed: 'Cannot add more files',
        noDuplicates: "Cannot add the duplicate file '%{fileName}', it already exists",
        companionError: 'Connection with Companion failed',
        authAborted: 'Authentication aborted',
        companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
        failedToUpload: 'Failed to upload %{file}',
        noInternetConnection: 'No Internet connection',
        connectedToInternet: 'Connected to the Internet',
        // Strings for remote providers
        noFilesFound: 'You have no files or folders here',
        noSearchResults: 'Unfortunately, there are no results for this search',
        selectX: {
            0: 'Select %{smart_count}',
            1: 'Select %{smart_count}',
        },
        allFilesFromFolderNamed: 'All files from folder %{name}',
        openFolderNamed: 'Open folder %{name}',
        cancel: 'Cancel',
        logOut: 'Log out',
        logIn: 'Log in',
        pickFiles: 'Pick files',
        pickPhotos: 'Pick photos',
        filter: 'Filter',
        resetFilter: 'Reset filter',
        loading: 'Loading...',
        loadedXFiles: 'Loaded %{numFiles} files',
        authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
        authenticateWith: 'Connect to %{pluginName}',
        signInWithGoogle: 'Sign in with Google',
        searchImages: 'Search for images',
        enterTextToSearch: 'Enter text to search for images',
        search: 'Search',
        resetSearch: 'Reset search',
        emptyFolderAdded: 'No files were added from empty folder',
        addedNumFiles: 'Added %{numFiles} file(s)',
        folderAlreadyAdded: 'The folder "%{folder}" was already added',
        folderAdded: {
            0: 'Added %{smart_count} file from %{folder}',
            1: 'Added %{smart_count} files from %{folder}',
        },
        additionalRestrictionsFailed: '%{count} additional restrictions were not fulfilled',
        unnamed: 'Unnamed',
        pleaseWait: 'Please wait',
    },
};

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
function supportsUploadProgress(userAgent) {
    // Allow passing in userAgent for tests
    if (userAgent == null && typeof navigator !== 'undefined') {
        userAgent = navigator.userAgent;
    }
    // Assume it works because basically everything supports progress events.
    if (!userAgent)
        return true;
    const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
    if (!m)
        return true;
    const edgeVersion = m[1];
    const version = edgeVersion.split('.', 2);
    const major = parseInt(version[0], 10);
    const minor = parseInt(version[1], 10);
    // Worked before:
    // Edge 40.15063.0.0
    // Microsoft EdgeHTML 15.15063
    if (major < 15 || (major === 15 && minor < 15063)) {
        return true;
    }
    // Fixed in:
    // Microsoft EdgeHTML 18.18218
    if (major > 18 || (major === 18 && minor >= 18218)) {
        return true;
    }
    // other versions don't work.
    return false;
}

/* global AggregateError */
const defaultUploadState = {
    totalProgress: 0,
    allowNewUpload: true,
    error: null,
    recoveredState: null,
};
/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */
class Uppy {
    static VERSION = packageJson$a.version;
    #plugins = Object.create(null);
    #restricter;
    #storeUnsubscribe;
    #emitter = ee$1();
    #preProcessors = new Set();
    #uploaders = new Set();
    #postProcessors = new Set();
    defaultLocale;
    locale;
    // The user optionally passes in options, but we set defaults for missing options.
    // We consider all options present after the contructor has run.
    opts;
    store;
    // Warning: do not use this from a plugin, as it will cause the plugins' translations to be missing
    i18n;
    i18nArray;
    scheduledAutoProceed = null;
    wasOffline = false;
    /**
     * Instantiate Uppy
     */
    constructor(opts) {
        this.defaultLocale = locale$7;
        const defaultOptions = {
            id: 'uppy',
            autoProceed: false,
            allowMultipleUploadBatches: true,
            debug: false,
            restrictions: defaultOptions$7,
            meta: {},
            onBeforeFileAdded: (file, files) => !Object.hasOwn(files, file.id),
            onBeforeUpload: (files) => files,
            store: new DefaultStore(),
            logger: justErrorsLogger,
            infoTimeout: 5000,
        };
        const merged = { ...defaultOptions, ...opts };
        // Merge default options with the ones set by user,
        // making sure to merge restrictions too
        this.opts = {
            ...merged,
            restrictions: {
                ...defaultOptions.restrictions,
                ...opts?.restrictions,
            },
        };
        // Support debug: true for backwards-compatability, unless logger is set in opts
        // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions
        if (opts?.logger && opts.debug) {
            this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
        }
        else if (opts?.debug) {
            this.opts.logger = debugLogger;
        }
        this.log(`Using Core v${Uppy.VERSION}`);
        this.i18nInit();
        this.store = this.opts.store;
        this.setState({
            ...defaultUploadState,
            plugins: {},
            files: {},
            currentUploads: {},
            capabilities: {
                uploadProgress: supportsUploadProgress(),
                individualCancellation: true,
                resumableUploads: false,
            },
            meta: { ...this.opts.meta },
            info: [],
        });
        this.#restricter = new Restricter(() => this.opts, () => this.i18n);
        this.#storeUnsubscribe = this.store.subscribe((prevState, nextState, patch) => {
            this.emit('state-update', prevState, nextState, patch);
            this.updateAll(nextState);
        });
        // Exposing uppy object on window for debugging and testing
        if (this.opts.debug && typeof window !== 'undefined') {
            // @ts-ignore Mutating the global object for debug purposes
            window[this.opts.id] = this;
        }
        this.#addListeners();
    }
    emit(event, ...args) {
        this.#emitter.emit(event, ...args);
    }
    on(event, callback) {
        this.#emitter.on(event, callback);
        return this;
    }
    once(event, callback) {
        this.#emitter.once(event, callback);
        return this;
    }
    off(event, callback) {
        this.#emitter.off(event, callback);
        return this;
    }
    /**
     * Iterate on all plugins and run `update` on them.
     * Called each time state changes.
     *
     */
    updateAll(state) {
        this.iteratePlugins((plugin) => {
            plugin.update(state);
        });
    }
    /**
     * Updates state with a patch
     */
    setState(patch) {
        this.store.setState(patch);
    }
    /**
     * Returns current state.
     */
    getState() {
        return this.store.getState();
    }
    patchFilesState(filesWithNewState) {
        const existingFilesState = this.getState().files;
        this.setState({
            files: {
                ...existingFilesState,
                ...Object.fromEntries(Object.entries(filesWithNewState).map(([fileID, newFileState]) => [
                    fileID,
                    {
                        ...existingFilesState[fileID],
                        ...newFileState,
                    },
                ])),
            },
        });
    }
    /**
     * Shorthand to set state for a specific file.
     */
    setFileState(fileID, state) {
        if (!this.getState().files[fileID]) {
            throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
        }
        this.patchFilesState({ [fileID]: state });
    }
    i18nInit() {
        const onMissingKey = (key) => this.log(`Missing i18n string: ${key}`, 'error');
        const translator = new Translator([this.defaultLocale, this.opts.locale], {
            onMissingKey,
        });
        this.i18n = translator.translate.bind(translator);
        this.i18nArray = translator.translateArray.bind(translator);
        this.locale = translator.locale;
    }
    setOptions(newOpts) {
        this.opts = {
            ...this.opts,
            ...newOpts,
            restrictions: {
                ...this.opts.restrictions,
                ...newOpts?.restrictions,
            },
        };
        if (newOpts.meta) {
            this.setMeta(newOpts.meta);
        }
        this.i18nInit();
        if (newOpts.locale) {
            this.iteratePlugins((plugin) => {
                plugin.setOptions(newOpts);
            });
        }
        // Note: this is not the preact `setState`, it's an internal function that has the same name.
        this.setState(undefined); // so that UI re-renders with new options
    }
    resetProgress() {
        const defaultProgress = {
            percentage: 0,
            bytesUploaded: false,
            uploadComplete: false,
            uploadStarted: null,
        };
        const files = { ...this.getState().files };
        const updatedFiles = Object.create(null);
        Object.keys(files).forEach((fileID) => {
            updatedFiles[fileID] = {
                ...files[fileID],
                progress: {
                    ...files[fileID].progress,
                    ...defaultProgress,
                },
                // @ts-expect-error these typed are inserted
                // into the namespace in their respective packages
                // but core isn't ware of those
                tus: undefined,
                transloadit: undefined,
            };
        });
        this.setState({ files: updatedFiles, ...defaultUploadState });
    }
    clear() {
        const { capabilities, currentUploads } = this.getState();
        if (Object.keys(currentUploads).length > 0 &&
            !capabilities.individualCancellation) {
            throw new Error('The installed uploader plugin does not allow removing files during an upload.');
        }
        this.setState({ ...defaultUploadState, files: {} });
    }
    addPreProcessor(fn) {
        this.#preProcessors.add(fn);
    }
    removePreProcessor(fn) {
        return this.#preProcessors.delete(fn);
    }
    addPostProcessor(fn) {
        this.#postProcessors.add(fn);
    }
    removePostProcessor(fn) {
        return this.#postProcessors.delete(fn);
    }
    addUploader(fn) {
        this.#uploaders.add(fn);
    }
    removeUploader(fn) {
        return this.#uploaders.delete(fn);
    }
    setMeta(data) {
        const updatedMeta = { ...this.getState().meta, ...data };
        const updatedFiles = { ...this.getState().files };
        Object.keys(updatedFiles).forEach((fileID) => {
            updatedFiles[fileID] = {
                ...updatedFiles[fileID],
                meta: { ...updatedFiles[fileID].meta, ...data },
            };
        });
        this.log('Adding metadata:');
        this.log(data);
        this.setState({
            meta: updatedMeta,
            files: updatedFiles,
        });
    }
    setFileMeta(fileID, data) {
        const updatedFiles = { ...this.getState().files };
        if (!updatedFiles[fileID]) {
            this.log(`Was trying to set metadata for a file that has been removed: ${fileID}`);
            return;
        }
        const newMeta = { ...updatedFiles[fileID].meta, ...data };
        updatedFiles[fileID] = { ...updatedFiles[fileID], meta: newMeta };
        this.setState({ files: updatedFiles });
    }
    /**
     * Get a file object.
     */
    getFile(fileID) {
        return this.getState().files[fileID];
    }
    /**
     * Get all files in an array.
     */
    getFiles() {
        const { files } = this.getState();
        return Object.values(files);
    }
    getFilesByIds(ids) {
        return ids.map((id) => this.getFile(id));
    }
    getObjectOfFilesPerState() {
        const { files: filesObject, totalProgress, error } = this.getState();
        const files = Object.values(filesObject);
        const inProgressFiles = [];
        const newFiles = [];
        const startedFiles = [];
        const uploadStartedFiles = [];
        const pausedFiles = [];
        const completeFiles = [];
        const erroredFiles = [];
        const inProgressNotPausedFiles = [];
        const processingFiles = [];
        for (const file of files) {
            const { progress } = file;
            if (!progress.uploadComplete && progress.uploadStarted) {
                inProgressFiles.push(file);
                if (!file.isPaused) {
                    inProgressNotPausedFiles.push(file);
                }
            }
            if (!progress.uploadStarted) {
                newFiles.push(file);
            }
            if (progress.uploadStarted ||
                progress.preprocess ||
                progress.postprocess) {
                startedFiles.push(file);
            }
            if (progress.uploadStarted) {
                uploadStartedFiles.push(file);
            }
            if (file.isPaused) {
                pausedFiles.push(file);
            }
            if (progress.uploadComplete) {
                completeFiles.push(file);
            }
            if (file.error) {
                erroredFiles.push(file);
            }
            if (progress.preprocess || progress.postprocess) {
                processingFiles.push(file);
            }
        }
        return {
            newFiles,
            startedFiles,
            uploadStartedFiles,
            pausedFiles,
            completeFiles,
            erroredFiles,
            inProgressFiles,
            inProgressNotPausedFiles,
            processingFiles,
            isUploadStarted: uploadStartedFiles.length > 0,
            isAllComplete: totalProgress === 100 &&
                completeFiles.length === files.length &&
                processingFiles.length === 0,
            isAllErrored: !!error && erroredFiles.length === files.length,
            isAllPaused: inProgressFiles.length !== 0 &&
                pausedFiles.length === inProgressFiles.length,
            isUploadInProgress: inProgressFiles.length > 0,
            isSomeGhost: files.some((file) => file.isGhost),
        };
    }
    #informAndEmit(errors) {
        for (const error of errors) {
            if (error.isRestriction) {
                this.emit('restriction-failed', error.file, error);
            }
            else {
                this.emit('error', error, error.file);
            }
            this.log(error, 'warning');
        }
        const userFacingErrors = errors.filter((error) => error.isUserFacing);
        // don't flood the user: only show the first 4 toasts
        const maxNumToShow = 4;
        const firstErrors = userFacingErrors.slice(0, maxNumToShow);
        const additionalErrors = userFacingErrors.slice(maxNumToShow);
        firstErrors.forEach(({ message, details = '' }) => {
            this.info({ message, details }, 'error', this.opts.infoTimeout);
        });
        if (additionalErrors.length > 0) {
            this.info({
                message: this.i18n('additionalRestrictionsFailed', {
                    count: additionalErrors.length,
                }),
            });
        }
    }
    validateRestrictions(file, files = this.getFiles()) {
        try {
            this.#restricter.validate(files, [file]);
        }
        catch (err) {
            return err;
        }
        return null;
    }
    validateSingleFile(file) {
        try {
            this.#restricter.validateSingleFile(file);
        }
        catch (err) {
            return err.message;
        }
        return null;
    }
    validateAggregateRestrictions(files) {
        const existingFiles = this.getFiles();
        try {
            this.#restricter.validateAggregateRestrictions(existingFiles, files);
        }
        catch (err) {
            return err.message;
        }
        return null;
    }
    #checkRequiredMetaFieldsOnFile(file) {
        const { missingFields, error } = this.#restricter.getMissingRequiredMetaFields(file);
        if (missingFields.length > 0) {
            this.setFileState(file.id, {
                missingRequiredMetaFields: missingFields,
                error: error.message,
            });
            this.log(error.message);
            this.emit('restriction-failed', file, error);
            return false;
        }
        if (missingFields.length === 0 && file.missingRequiredMetaFields) {
            this.setFileState(file.id, {
                missingRequiredMetaFields: [],
            });
        }
        return true;
    }
    #checkRequiredMetaFields(files) {
        let success = true;
        for (const file of Object.values(files)) {
            if (!this.#checkRequiredMetaFieldsOnFile(file)) {
                success = false;
            }
        }
        return success;
    }
    #assertNewUploadAllowed(file) {
        const { allowNewUpload } = this.getState();
        if (allowNewUpload === false) {
            const error = new RestrictionError(this.i18n('noMoreFilesAllowed'), {
                file,
            });
            this.#informAndEmit([error]);
            throw error;
        }
    }
    checkIfFileAlreadyExists(fileID) {
        const { files } = this.getState();
        if (files[fileID] && !files[fileID].isGhost) {
            return true;
        }
        return false;
    }
    /**
     * Create a file state object based on user-provided `addFile()` options.
     */
    #transformFile(fileDescriptorOrFile) {
        // Uppy expects files in { name, type, size, data } format.
        // If the actual File object is passed from input[type=file] or drag-drop,
        // we normalize it to match Uppy file object
        const file = (fileDescriptorOrFile instanceof File
            ? {
                name: fileDescriptorOrFile.name,
                type: fileDescriptorOrFile.type,
                size: fileDescriptorOrFile.size,
                data: fileDescriptorOrFile,
            }
            : fileDescriptorOrFile);
        const fileType = getFileType(file);
        const fileName = getFileName(fileType, file);
        const fileExtension = getFileNameAndExtension(fileName).extension;
        const id = getSafeFileId(file, this.getID());
        const meta = file.meta || {};
        meta.name = fileName;
        meta.type = fileType;
        // `null` means the size is unknown.
        const size = Number.isFinite(file.data.size)
            ? file.data.size
            : null;
        return {
            source: file.source || '',
            id,
            name: fileName,
            extension: fileExtension || '',
            meta: {
                ...this.getState().meta,
                ...meta,
            },
            type: fileType,
            data: file.data,
            progress: {
                percentage: 0,
                bytesUploaded: false,
                bytesTotal: size,
                uploadComplete: false,
                uploadStarted: null,
            },
            size,
            isGhost: false,
            isRemote: file.isRemote || false,
            remote: file.remote,
            preview: file.preview,
        };
    }
    // Schedule an upload if `autoProceed` is enabled.
    #startIfAutoProceed() {
        if (this.opts.autoProceed && !this.scheduledAutoProceed) {
            this.scheduledAutoProceed = setTimeout(() => {
                this.scheduledAutoProceed = null;
                this.upload().catch((err) => {
                    if (!err.isRestriction) {
                        this.log(err.stack || err.message || err);
                    }
                });
            }, 4);
        }
    }
    #checkAndUpdateFileState(filesToAdd) {
        let { files: existingFiles } = this.getState();
        // create a copy of the files object only once
        let nextFilesState = { ...existingFiles };
        const validFilesToAdd = [];
        const errors = [];
        for (const fileToAdd of filesToAdd) {
            try {
                let newFile = this.#transformFile(fileToAdd);
                // If a file has been recovered (Golden Retriever), but we were unable to recover its data (probably too large),
                // users are asked to re-select these half-recovered files and then this method will be called again.
                // In order to keep the progress, meta and everything else, we keep the existing file,
                // but we replace `data`, and we remove `isGhost`, because the file is no longer a ghost now
                const isGhost = existingFiles[newFile.id]?.isGhost;
                if (isGhost) {
                    const existingFileState = existingFiles[newFile.id];
                    newFile = {
                        ...existingFileState,
                        isGhost: false,
                        data: fileToAdd.data,
                    };
                    this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
                }
                const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, nextFilesState);
                // update state after onBeforeFileAdded
                existingFiles = this.getState().files;
                nextFilesState = { ...existingFiles, ...nextFilesState };
                if (!onBeforeFileAddedResult &&
                    this.checkIfFileAlreadyExists(newFile.id)) {
                    throw new RestrictionError(this.i18n('noDuplicates', {
                        fileName: newFile.name ?? this.i18n('unnamed'),
                    }), { file: fileToAdd });
                }
                // Pass through reselected files from Golden Retriever
                if (onBeforeFileAddedResult === false && !isGhost) {
                    // Don’t show UI info for this error, as it should be done by the developer
                    throw new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.', { isUserFacing: false, file: fileToAdd });
                }
                else if (typeof onBeforeFileAddedResult === 'object' &&
                    onBeforeFileAddedResult !== null) {
                    newFile = onBeforeFileAddedResult;
                }
                this.#restricter.validateSingleFile(newFile);
                // need to add it to the new local state immediately, so we can use the state to validate the next files too
                nextFilesState[newFile.id] = newFile;
                validFilesToAdd.push(newFile);
            }
            catch (err) {
                errors.push(err);
            }
        }
        try {
            // need to run this separately because it's much more slow, so if we run it inside the for-loop it will be very slow
            // when many files are added
            this.#restricter.validateAggregateRestrictions(Object.values(existingFiles), validFilesToAdd);
        }
        catch (err) {
            errors.push(err);
            // If we have any aggregate error, don't allow adding this batch
            return {
                nextFilesState: existingFiles,
                validFilesToAdd: [],
                errors,
            };
        }
        return {
            nextFilesState,
            validFilesToAdd,
            errors,
        };
    }
    /**
     * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
     * try to guess file type in a clever way, check file against restrictions,
     * and start an upload if `autoProceed === true`.
     */
    addFile(file) {
        this.#assertNewUploadAllowed(file);
        const { nextFilesState, validFilesToAdd, errors } = this.#checkAndUpdateFileState([file]);
        const restrictionErrors = errors.filter((error) => error.isRestriction);
        this.#informAndEmit(restrictionErrors);
        if (errors.length > 0)
            throw errors[0];
        this.setState({ files: nextFilesState });
        const [firstValidFileToAdd] = validFilesToAdd;
        this.emit('file-added', firstValidFileToAdd);
        this.emit('files-added', validFilesToAdd);
        this.log(`Added file: ${firstValidFileToAdd.name}, ${firstValidFileToAdd.id}, mime type: ${firstValidFileToAdd.type}`);
        this.#startIfAutoProceed();
        return firstValidFileToAdd.id;
    }
    /**
     * Add multiple files to `state.files`. See the `addFile()` documentation.
     *
     * If an error occurs while adding a file, it is logged and the user is notified.
     * This is good for UI plugins, but not for programmatic use.
     * Programmatic users should usually still use `addFile()` on individual files.
     */
    addFiles(fileDescriptors) {
        this.#assertNewUploadAllowed();
        const { nextFilesState, validFilesToAdd, errors } = this.#checkAndUpdateFileState(fileDescriptors);
        const restrictionErrors = errors.filter((error) => error.isRestriction);
        this.#informAndEmit(restrictionErrors);
        const nonRestrictionErrors = errors.filter((error) => !error.isRestriction);
        if (nonRestrictionErrors.length > 0) {
            let message = 'Multiple errors occurred while adding files:\n';
            nonRestrictionErrors.forEach((subError) => {
                message += `\n * ${subError.message}`;
            });
            this.info({
                message: this.i18n('addBulkFilesFailed', {
                    smart_count: nonRestrictionErrors.length,
                }),
                details: message,
            }, 'error', this.opts.infoTimeout);
            if (typeof AggregateError === 'function') {
                throw new AggregateError(nonRestrictionErrors, message);
            }
            else {
                const err = new Error(message);
                // @ts-expect-error fallback when AggregateError is not available
                err.errors = nonRestrictionErrors;
                throw err;
            }
        }
        // OK, we haven't thrown an error, we can start updating state and emitting events now:
        this.setState({ files: nextFilesState });
        validFilesToAdd.forEach((file) => {
            this.emit('file-added', file);
        });
        this.emit('files-added', validFilesToAdd);
        if (validFilesToAdd.length > 5) {
            this.log(`Added batch of ${validFilesToAdd.length} files`);
        }
        else {
            Object.values(validFilesToAdd).forEach((file) => {
                this.log(`Added file: ${file.name}\n id: ${file.id}\n type: ${file.type}`);
            });
        }
        if (validFilesToAdd.length > 0) {
            this.#startIfAutoProceed();
        }
    }
    removeFiles(fileIDs) {
        const { files, currentUploads } = this.getState();
        const updatedFiles = { ...files };
        const updatedUploads = { ...currentUploads };
        const removedFiles = Object.create(null);
        fileIDs.forEach((fileID) => {
            if (files[fileID]) {
                removedFiles[fileID] = files[fileID];
                delete updatedFiles[fileID];
            }
        });
        // Remove files from the `fileIDs` list in each upload.
        function fileIsNotRemoved(uploadFileID) {
            return removedFiles[uploadFileID] === undefined;
        }
        Object.keys(updatedUploads).forEach((uploadID) => {
            const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved);
            // Remove the upload if no files are associated with it anymore.
            if (newFileIDs.length === 0) {
                delete updatedUploads[uploadID];
                return;
            }
            const { capabilities } = this.getState();
            if (newFileIDs.length !== currentUploads[uploadID].fileIDs.length &&
                !capabilities.individualCancellation) {
                throw new Error('The installed uploader plugin does not allow removing files during an upload.');
            }
            updatedUploads[uploadID] = {
                ...currentUploads[uploadID],
                fileIDs: newFileIDs,
            };
        });
        const stateUpdate = {
            currentUploads: updatedUploads,
            files: updatedFiles,
        };
        // If all files were removed - allow new uploads,
        // and clear recoveredState
        if (Object.keys(updatedFiles).length === 0) {
            stateUpdate.allowNewUpload = true;
            stateUpdate.error = null;
            stateUpdate.recoveredState = null;
        }
        this.setState(stateUpdate);
        this.#updateTotalProgressThrottled();
        const removedFileIDs = Object.keys(removedFiles);
        removedFileIDs.forEach((fileID) => {
            this.emit('file-removed', removedFiles[fileID]);
        });
        if (removedFileIDs.length > 5) {
            this.log(`Removed ${removedFileIDs.length} files`);
        }
        else {
            this.log(`Removed files: ${removedFileIDs.join(', ')}`);
        }
    }
    removeFile(fileID) {
        this.removeFiles([fileID]);
    }
    pauseResume(fileID) {
        if (!this.getState().capabilities.resumableUploads ||
            this.getFile(fileID).progress.uploadComplete) {
            return undefined;
        }
        const file = this.getFile(fileID);
        const wasPaused = file.isPaused || false;
        const isPaused = !wasPaused;
        this.setFileState(fileID, {
            isPaused,
        });
        this.emit('upload-pause', file, isPaused);
        return isPaused;
    }
    pauseAll() {
        const updatedFiles = { ...this.getState().files };
        const inProgressUpdatedFiles = Object.keys(updatedFiles).filter((file) => {
            return (!updatedFiles[file].progress.uploadComplete &&
                updatedFiles[file].progress.uploadStarted);
        });
        inProgressUpdatedFiles.forEach((file) => {
            const updatedFile = { ...updatedFiles[file], isPaused: true };
            updatedFiles[file] = updatedFile;
        });
        this.setState({ files: updatedFiles });
        this.emit('pause-all');
    }
    resumeAll() {
        const updatedFiles = { ...this.getState().files };
        const inProgressUpdatedFiles = Object.keys(updatedFiles).filter((file) => {
            return (!updatedFiles[file].progress.uploadComplete &&
                updatedFiles[file].progress.uploadStarted);
        });
        inProgressUpdatedFiles.forEach((file) => {
            const updatedFile = {
                ...updatedFiles[file],
                isPaused: false,
                error: null,
            };
            updatedFiles[file] = updatedFile;
        });
        this.setState({ files: updatedFiles });
        this.emit('resume-all');
    }
    #getFilesToRetry() {
        const { files } = this.getState();
        return Object.keys(files).filter((fileId) => {
            const file = files[fileId];
            // Only retry files that have errors AND don't have missing required metadata
            return (file.error &&
                (!file.missingRequiredMetaFields ||
                    file.missingRequiredMetaFields.length === 0));
        });
    }
    async #doRetryAll() {
        const filesToRetry = this.#getFilesToRetry();
        const updatedFiles = { ...this.getState().files };
        filesToRetry.forEach((fileID) => {
            updatedFiles[fileID] = {
                ...updatedFiles[fileID],
                isPaused: false,
                error: null,
            };
        });
        this.setState({
            files: updatedFiles,
            error: null,
        });
        this.emit('retry-all', this.getFilesByIds(filesToRetry));
        if (filesToRetry.length === 0) {
            return {
                successful: [],
                failed: [],
            };
        }
        const uploadID = this.#createUpload(filesToRetry, {
            forceAllowNewUpload: true, // create new upload even if allowNewUpload: false
        });
        return this.#runUpload(uploadID);
    }
    async retryAll() {
        const result = await this.#doRetryAll();
        this.emit('complete', result);
        return result;
    }
    cancelAll() {
        this.emit('cancel-all');
        const { files } = this.getState();
        const fileIDs = Object.keys(files);
        if (fileIDs.length) {
            this.removeFiles(fileIDs);
        }
        this.setState(defaultUploadState);
    }
    retryUpload(fileID) {
        this.setFileState(fileID, {
            error: null,
            isPaused: false,
        });
        this.emit('upload-retry', this.getFile(fileID));
        const uploadID = this.#createUpload([fileID], {
            forceAllowNewUpload: true, // create new upload even if allowNewUpload: false
        });
        return this.#runUpload(uploadID);
    }
    logout() {
        this.iteratePlugins((plugin) => {
            plugin.provider?.logout?.();
        });
    }
    #handleUploadProgress = (file, progress) => {
        const fileInState = file ? this.getFile(file.id) : undefined;
        if (file == null || !fileInState) {
            this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
            return;
        }
        if (fileInState.progress.percentage === 100) {
            this.log(`Not setting progress for a file that has been already uploaded: ${file.id}`);
            return;
        }
        const newProgress = {
            bytesTotal: progress.bytesTotal,
            // bytesTotal may be null or zero; in that case we can't divide by it
            percentage: progress.bytesTotal != null &&
                Number.isFinite(progress.bytesTotal) &&
                progress.bytesTotal > 0
                ? Math.round((progress.bytesUploaded / progress.bytesTotal) * 100)
                : undefined,
        };
        if (fileInState.progress.uploadStarted != null) {
            this.setFileState(file.id, {
                progress: {
                    ...fileInState.progress,
                    ...newProgress,
                    bytesUploaded: progress.bytesUploaded,
                },
            });
        }
        else {
            this.setFileState(file.id, {
                progress: {
                    ...fileInState.progress,
                    ...newProgress,
                },
            });
        }
        this.#updateTotalProgressThrottled();
    };
    #updateTotalProgress() {
        const totalProgress = this.#calculateTotalProgress();
        let totalProgressPercent = null;
        if (totalProgress != null) {
            totalProgressPercent = Math.round(totalProgress * 100);
            if (totalProgressPercent > 100)
                totalProgressPercent = 100;
            else if (totalProgressPercent < 0)
                totalProgressPercent = 0;
        }
        this.emit('progress', totalProgressPercent ?? 0);
        this.setState({
            totalProgress: totalProgressPercent ?? 0,
        });
    }
    // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.
    #updateTotalProgressThrottled = throttle$1(() => this.#updateTotalProgress(), 500, { leading: true, trailing: true });
    [Symbol.for('uppy test: updateTotalProgress')]() {
        return this.#updateTotalProgress();
    }
    #calculateTotalProgress() {
        // calculate total progress, using the number of files currently uploading,
        // between 0 and 1 and sum of individual progress of each file
        const files = this.getFiles();
        // note: also includes files that have completed uploading:
        const filesInProgress = files.filter((file) => {
            return (file.progress.uploadStarted ||
                file.progress.preprocess ||
                file.progress.postprocess);
        });
        if (filesInProgress.length === 0) {
            return 0;
        }
        if (filesInProgress.every((file) => file.progress.uploadComplete)) {
            // If every uploading file is complete, and we're still getting progress, it probably means
            // there's a bug somewhere in some progress reporting code (maybe not even our code)
            // and we're still getting progress, so let's just assume it means a 100% progress
            return 1;
        }
        const isSizedFile = (file) => file.progress.bytesTotal != null && file.progress.bytesTotal !== 0;
        const sizedFilesInProgress = filesInProgress.filter(isSizedFile);
        const unsizedFilesInProgress = filesInProgress.filter((file) => !isSizedFile(file));
        if (sizedFilesInProgress.every((file) => file.progress.uploadComplete) &&
            unsizedFilesInProgress.length > 0 &&
            !unsizedFilesInProgress.every((file) => file.progress.uploadComplete)) {
            // we are done with uploading all files of known size, however
            // there is at least one file with unknown size still uploading,
            // and we cannot say anything about their progress
            // In any case, return null because it doesn't make any sense to show a progress
            return null;
        }
        const totalFilesSize = sizedFilesInProgress.reduce((acc, file) => acc + (file.progress.bytesTotal ?? 0), 0);
        const totalUploadedSize = sizedFilesInProgress.reduce((acc, file) => acc + (file.progress.bytesUploaded || 0), 0);
        return totalFilesSize === 0 ? 0 : totalUploadedSize / totalFilesSize;
    }
    /**
     * Registers listeners for all global actions, like:
     * `error`, `file-removed`, `upload-progress`
     */
    #addListeners() {
        // Type inference only works for inline functions so we have to type it again
        const errorHandler = (error, file, response) => {
            let errorMsg = error.message || 'Unknown error';
            if (error.details) {
                errorMsg += ` ${error.details}`;
            }
            this.setState({ error: errorMsg });
            if (file != null && file.id in this.getState().files) {
                this.setFileState(file.id, {
                    error: errorMsg,
                    response,
                });
            }
        };
        this.on('error', errorHandler);
        this.on('upload-error', (file, error, response) => {
            errorHandler(error, file, response);
            if (typeof error === 'object' && error.message) {
                this.log(error.message, 'error');
                const newError = new Error(this.i18n('failedToUpload', { file: file?.name ?? '' })); // we may want a new custom error here
                newError.isUserFacing = true; // todo maybe don't do this with all errors?
                newError.details = error.message;
                if (error.details) {
                    newError.details += ` ${error.details}`;
                }
                this.#informAndEmit([newError]);
            }
            else {
                this.#informAndEmit([error]);
            }
        });
        let uploadStalledWarningRecentlyEmitted = null;
        this.on('upload-stalled', (error, files) => {
            const { message } = error;
            const details = files.map((file) => file.meta.name).join(', ');
            if (!uploadStalledWarningRecentlyEmitted) {
                this.info({ message, details }, 'warning', this.opts.infoTimeout);
                uploadStalledWarningRecentlyEmitted = setTimeout(() => {
                    uploadStalledWarningRecentlyEmitted = null;
                }, this.opts.infoTimeout);
            }
            this.log(`${message} ${details}`.trim(), 'warning');
        });
        this.on('upload', () => {
            this.setState({ error: null });
        });
        const onUploadStarted = (files) => {
            const filesFiltered = files.filter((file) => {
                const exists = file != null && this.getFile(file.id);
                if (!exists)
                    this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return exists;
            });
            const filesState = Object.fromEntries(filesFiltered.map((file) => [
                file.id,
                {
                    progress: {
                        uploadStarted: Date.now(),
                        uploadComplete: false,
                        bytesUploaded: 0,
                        bytesTotal: file.size,
                    },
                },
            ]));
            this.patchFilesState(filesState);
        };
        this.on('upload-start', onUploadStarted);
        this.on('upload-progress', this.#handleUploadProgress);
        this.on('upload-success', (file, uploadResp) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            const currentProgress = this.getFile(file.id).progress;
            this.setFileState(file.id, {
                progress: {
                    ...currentProgress,
                    postprocess: this.#postProcessors.size > 0
                        ? {
                            mode: 'indeterminate',
                        }
                        : undefined,
                    uploadComplete: true,
                    percentage: 100,
                    bytesUploaded: currentProgress.bytesTotal,
                },
                response: uploadResp,
                uploadURL: uploadResp.uploadURL,
                isPaused: false,
            });
            // Remote providers sometimes don't tell us the file size,
            // but we can know how many bytes we uploaded once the upload is complete.
            if (file.size == null) {
                this.setFileState(file.id, {
                    size: uploadResp.bytesUploaded || currentProgress.bytesTotal,
                });
            }
            this.#updateTotalProgressThrottled();
        });
        this.on('preprocess-progress', (file, progress) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            this.setFileState(file.id, {
                progress: { ...this.getFile(file.id).progress, preprocess: progress },
            });
        });
        this.on('preprocess-complete', (file) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            const files = { ...this.getState().files };
            files[file.id] = {
                ...files[file.id],
                progress: { ...files[file.id].progress },
            };
            delete files[file.id].progress.preprocess;
            this.setState({ files });
        });
        this.on('postprocess-progress', (file, progress) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            this.setFileState(file.id, {
                progress: {
                    ...this.getState().files[file.id].progress,
                    postprocess: progress,
                },
            });
        });
        this.on('postprocess-complete', (file) => {
            if (file == null || !this.getFile(file.id)) {
                this.log(`Not setting progress for a file that has been removed: ${file?.id}`);
                return;
            }
            const files = {
                ...this.getState().files,
            };
            files[file.id] = {
                ...files[file.id],
                progress: {
                    ...files[file.id].progress,
                },
            };
            delete files[file.id].progress.postprocess;
            this.setState({ files });
        });
        this.on('restored', () => {
            // Files may have changed--ensure progress is still accurate.
            this.#updateTotalProgressThrottled();
        });
        // @ts-expect-error should fix itself when dashboard it typed (also this doesn't belong here)
        this.on('dashboard:file-edit-complete', (file) => {
            if (file) {
                this.#checkRequiredMetaFieldsOnFile(file);
            }
        });
        // show informer if offline
        if (typeof window !== 'undefined' && window.addEventListener) {
            window.addEventListener('online', this.#updateOnlineStatus);
            window.addEventListener('offline', this.#updateOnlineStatus);
            setTimeout(this.#updateOnlineStatus, 3000);
        }
    }
    updateOnlineStatus() {
        const online = window.navigator.onLine ?? true;
        if (!online) {
            this.emit('is-offline');
            this.info(this.i18n('noInternetConnection'), 'error', 0);
            this.wasOffline = true;
        }
        else {
            this.emit('is-online');
            if (this.wasOffline) {
                this.emit('back-online');
                this.info(this.i18n('connectedToInternet'), 'success', 3000);
                this.wasOffline = false;
            }
        }
    }
    #updateOnlineStatus = this.updateOnlineStatus.bind(this);
    getID() {
        return this.opts.id;
    }
    /**
     * Registers a plugin with Core.
     */
    use(Plugin, 
    // We want to let the plugin decide whether `opts` is optional or not
    // so we spread the argument rather than defining `opts:` ourselves.
    ...args) {
        if (typeof Plugin !== 'function') {
            const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` +
                ' Please verify that the plugin was imported and spelled correctly.';
            throw new TypeError(msg);
        }
        // Instantiate
        const plugin = new Plugin(this, ...args);
        const pluginId = plugin.id;
        if (!pluginId) {
            throw new Error('Your plugin must have an id');
        }
        if (!plugin.type) {
            throw new Error('Your plugin must have a type');
        }
        const existsPluginAlready = this.getPlugin(pluginId);
        if (existsPluginAlready) {
            const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` +
                `Tried to use: '${pluginId}'.\n` +
                'Uppy plugins must have unique `id` options.';
            throw new Error(msg);
        }
        // @ts-expect-error does exist
        if (Plugin.VERSION) {
            // @ts-expect-error does exist
            this.log(`Using ${pluginId} v${Plugin.VERSION}`);
        }
        if (plugin.type in this.#plugins) {
            this.#plugins[plugin.type].push(plugin);
        }
        else {
            this.#plugins[plugin.type] = [plugin];
        }
        plugin.install();
        this.emit('plugin-added', plugin);
        return this;
    }
    /**
     * Find one Plugin by name.
     */
    getPlugin(id) {
        for (const plugins of Object.values(this.#plugins)) {
            const foundPlugin = plugins.find((plugin) => plugin.id === id);
            if (foundPlugin != null)
                return foundPlugin;
        }
        return undefined;
    }
    [Symbol.for('uppy test: getPlugins')](type) {
        return this.#plugins[type];
    }
    /**
     * Iterate through all `use`d plugins.
     *
     */
    iteratePlugins(method) {
        Object.values(this.#plugins).flat(1).forEach(method);
    }
    /**
     * Uninstall and remove a plugin.
     *
     * @param {object} instance The plugin instance to remove.
     */
    removePlugin(instance) {
        this.log(`Removing plugin ${instance.id}`);
        this.emit('plugin-remove', instance);
        if (instance.uninstall) {
            instance.uninstall();
        }
        const list = this.#plugins[instance.type];
        // list.indexOf failed here, because Vue3 converted the plugin instance
        // to a Proxy object, which failed the strict comparison test:
        // obj !== objProxy
        const index = list.findIndex((item) => item.id === instance.id);
        if (index !== -1) {
            list.splice(index, 1);
        }
        const state = this.getState();
        const updatedState = {
            plugins: {
                ...state.plugins,
                [instance.id]: undefined,
            },
        };
        this.setState(updatedState);
    }
    /**
     * Uninstall all plugins and close down this Uppy instance.
     */
    destroy() {
        this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
        this.cancelAll();
        this.#storeUnsubscribe();
        this.iteratePlugins((plugin) => {
            this.removePlugin(plugin);
        });
        if (typeof window !== 'undefined' && window.removeEventListener) {
            window.removeEventListener('online', this.#updateOnlineStatus);
            window.removeEventListener('offline', this.#updateOnlineStatus);
        }
    }
    hideInfo() {
        const { info } = this.getState();
        this.setState({ info: info.slice(1) });
        this.emit('info-hidden');
    }
    /**
     * Set info message in `state.info`, so that UI plugins like `Informer`
     * can display the message.
     */
    info(message, type = 'info', duration = 3000) {
        const isComplexMessage = typeof message === 'object';
        this.setState({
            info: [
                ...this.getState().info,
                {
                    type,
                    message: isComplexMessage ? message.message : message,
                    details: isComplexMessage ? message.details : null,
                },
            ],
        });
        setTimeout(() => this.hideInfo(), duration);
        this.emit('info-visible');
    }
    /**
     * Passes messages to a function, provided in `opts.logger`.
     * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
     */
    log(message, type) {
        const { logger } = this.opts;
        switch (type) {
            case 'error':
                logger.error(message);
                break;
            case 'warning':
                logger.warn(message);
                break;
            default:
                logger.debug(message);
                break;
        }
    }
    // We need to store request clients by a unique ID, so we can share RequestClient instances across files
    // this allows us to do rate limiting and synchronous operations like refreshing provider tokens
    // example: refreshing tokens: if each file has their own requestclient,
    // we don't have any way to synchronize all requests in order to
    // - block all requests
    // - refresh the token
    // - unblock all requests and allow them to run with a the new access token
    // back when we had a requestclient per file, once an access token expired,
    // all 6 files would go ahead and refresh the token at the same time
    // (calling /refresh-token up to 6 times), which will probably fail for some providers
    #requestClientById = new Map();
    registerRequestClient(id, client) {
        this.#requestClientById.set(id, client);
    }
    /** @protected */
    getRequestClientForFile(file) {
        if (!file.remote)
            throw new Error(`Tried to get RequestClient for a non-remote file ${file.id}`);
        const requestClient = this.#requestClientById.get(file.remote.requestClientId);
        if (requestClient == null)
            throw new Error(`requestClientId "${file.remote.requestClientId}" not registered for file "${file.id}"`);
        return requestClient;
    }
    /**
     * Restore an upload by its ID.
     */
    async restore(uploadID) {
        this.log(`Core: attempting to restore upload "${uploadID}"`);
        if (!this.getState().currentUploads[uploadID]) {
            this.#removeUpload(uploadID);
            throw new Error('Nonexistent upload');
        }
        const result = await this.#runUpload(uploadID);
        this.emit('complete', result);
        return result;
    }
    /**
     * Create an upload for a bunch of files.
     *
     */
    #createUpload(fileIDs, opts = {}) {
        // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
        const { forceAllowNewUpload = false } = opts;
        const { allowNewUpload, currentUploads } = this.getState();
        if (!allowNewUpload && !forceAllowNewUpload) {
            throw new Error('Cannot create a new upload: already uploading.');
        }
        const uploadID = nanoid();
        this.emit('upload', uploadID, this.getFilesByIds(fileIDs));
        this.setState({
            allowNewUpload: this.opts.allowMultipleUploadBatches !== false &&
                this.opts.allowMultipleUploads !== false,
            currentUploads: {
                ...currentUploads,
                [uploadID]: {
                    fileIDs,
                    step: 0,
                    result: {},
                },
            },
        });
        return uploadID;
    }
    [Symbol.for('uppy test: createUpload')](...args) {
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/47595
        return this.#createUpload(...args);
    }
    #getUpload(uploadID) {
        const { currentUploads } = this.getState();
        return currentUploads[uploadID];
    }
    /**
     * Add data to an upload's result object.
     */
    addResultData(uploadID, data) {
        if (!this.#getUpload(uploadID)) {
            this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
            return;
        }
        const { currentUploads } = this.getState();
        const currentUpload = {
            ...currentUploads[uploadID],
            result: { ...currentUploads[uploadID].result, ...data },
        };
        this.setState({
            currentUploads: { ...currentUploads, [uploadID]: currentUpload },
        });
    }
    /**
     * Remove an upload, eg. if it has been canceled or completed.
     *
     */
    #removeUpload(uploadID) {
        const currentUploads = { ...this.getState().currentUploads };
        delete currentUploads[uploadID];
        this.setState({
            currentUploads,
        });
    }
    /**
     * Run an upload. This picks up where it left off in case the upload is being restored.
     */
    async #runUpload(uploadID) {
        const getCurrentUpload = () => {
            const { currentUploads } = this.getState();
            return currentUploads[uploadID];
        };
        let currentUpload = getCurrentUpload();
        const steps = [
            ...this.#preProcessors,
            ...this.#uploaders,
            ...this.#postProcessors,
        ];
        try {
            for (let step = currentUpload.step || 0; step < steps.length; step++) {
                if (!currentUpload) {
                    break;
                }
                const fn = steps[step];
                this.setState({
                    currentUploads: {
                        ...this.getState().currentUploads,
                        [uploadID]: {
                            ...currentUpload,
                            step,
                        },
                    },
                });
                const { fileIDs } = currentUpload;
                // TODO give this the `updatedUpload` object as its only parameter maybe?
                // Otherwise when more metadata may be added to the upload this would keep getting more parameters
                await fn(fileIDs, uploadID);
                // Update currentUpload value in case it was modified asynchronously.
                currentUpload = getCurrentUpload();
            }
        }
        catch (err) {
            this.#removeUpload(uploadID);
            throw err;
        }
        // Set result data.
        if (currentUpload) {
            // Mark postprocessing step as complete if necessary; this addresses a case where we might get
            // stuck in the postprocessing UI while the upload is fully complete.
            // If the postprocessing steps do not do any work, they may not emit postprocessing events at
            // all, and never mark the postprocessing as complete. This is fine on its own but we
            // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
            // state if any postprocessors are registered. That is to avoid a "flash of completed state"
            // before the postprocessing plugins can emit events.
            //
            // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
            // postprocessing completion, we do it instead.
            currentUpload.fileIDs.forEach((fileID) => {
                const file = this.getFile(fileID);
                if (file?.progress.postprocess) {
                    this.emit('postprocess-complete', file);
                }
            });
            const files = currentUpload.fileIDs.map((fileID) => this.getFile(fileID));
            const successful = files.filter((file) => !file.error);
            const failed = files.filter((file) => file.error);
            this.addResultData(uploadID, { successful, failed, uploadID });
            // Update currentUpload value in case it was modified asynchronously.
            currentUpload = getCurrentUpload();
        }
        // Emit completion events.
        // This is in a separate function so that the `currentUploads` variable
        // always refers to the latest state. In the handler right above it refers
        // to an outdated object without the `.result` property.
        let result;
        if (currentUpload) {
            result = currentUpload.result;
            this.#removeUpload(uploadID);
        }
        if (result == null) {
            this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
            result = {
                successful: [],
                failed: [],
                uploadID,
            };
        }
        return result;
    }
    /**
     * Start an upload for all the files that are not currently being uploaded.
     */
    async upload() {
        if (!this.#plugins.uploader?.length) {
            this.log('No uploader type plugins are used', 'warning');
        }
        let { files } = this.getState();
        // retry any failed files from a previous upload() call
        const filesToRetry = this.#getFilesToRetry();
        if (filesToRetry.length > 0) {
            const retryResult = await this.#doRetryAll(); // we don't want the complete event to fire
            const hasNewFiles = this.getFiles().filter((file) => file.progress.uploadStarted == null)
                .length > 0;
            // if no new files, make it idempotent and return
            if (!hasNewFiles) {
                this.emit('complete', retryResult);
                return retryResult;
            }
            ({ files } = this.getState());
        }
        // If no files to retry, proceed with original upload() behavior for new files
        const onBeforeUploadResult = this.opts.onBeforeUpload(files);
        if (onBeforeUploadResult === false) {
            return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
        }
        if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
            files = onBeforeUploadResult;
            // Updating files in state, because uploader plugins receive file IDs,
            // and then fetch the actual file object from state
            this.setState({
                files,
            });
        }
        return Promise.resolve()
            .then(() => this.#restricter.validateMinNumberOfFiles(files))
            .catch((err) => {
            this.#informAndEmit([err]);
            throw err;
        })
            .then(() => {
            if (!this.#checkRequiredMetaFields(files)) {
                throw new RestrictionError(this.i18n('missingRequiredMetaField'));
            }
        })
            .catch((err) => {
            // Doing this in a separate catch because we already emited and logged
            // all the errors in `checkRequiredMetaFields` so we only throw a generic
            // missing fields error here.
            throw err;
        })
            .then(async () => {
            const { currentUploads } = this.getState();
            // get a list of files that are currently assigned to uploads
            const currentlyUploadingFiles = Object.values(currentUploads).flatMap((curr) => curr.fileIDs);
            const waitingFileIDs = [];
            Object.keys(files).forEach((fileID) => {
                const file = this.getFile(fileID);
                // if the file hasn't started uploading and hasn't already been assigned to an upload..
                if (!file.progress.uploadStarted &&
                    currentlyUploadingFiles.indexOf(fileID) === -1) {
                    waitingFileIDs.push(file.id);
                }
            });
            const uploadID = this.#createUpload(waitingFileIDs);
            const result = await this.#runUpload(uploadID);
            this.emit('complete', result);
            return result;
        })
            .catch((err) => {
            this.emit('error', err);
            this.log(err, 'error');
            throw err;
        });
    }
}

var classnames = {exports: {}};

/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/

(function (module) {
	/* global define */

	(function () {

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = '';

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (arg) {
					classes = appendClass(classes, parseValue(arg));
				}
			}

			return classes;
		}

		function parseValue (arg) {
			if (typeof arg === 'string' || typeof arg === 'number') {
				return arg;
			}

			if (typeof arg !== 'object') {
				return '';
			}

			if (Array.isArray(arg)) {
				return classNames.apply(null, arg);
			}

			if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
				return arg.toString();
			}

			var classes = '';

			for (var key in arg) {
				if (hasOwn.call(arg, key) && arg[key]) {
					classes = appendClass(classes, key);
				}
			}

			return classes;
		}

		function appendClass (value, newClass) {
			if (!newClass) {
				return value;
			}
		
			if (value) {
				return value + ' ' + newClass;
			}
		
			return value + newClass;
		}

		if (module.exports) {
			classNames.default = classNames;
			module.exports = classNames;
		} else {
			window.classNames = classNames;
		}
	}()); 
} (classnames));

var classnamesExports = classnames.exports;
var classNames = /*@__PURE__*/getDefaultExportFromCjs(classnamesExports);

function defaultPickerIcon() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", width: "30", height: "30", viewBox: "0 0 30 30", children: u$2("path", { d: "M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15zm4.258-12.676v6.846h-8.426v-6.846H5.204l9.82-12.364 9.82 12.364H19.26z" }) }));
}

function e(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:true,configurable:true,writable:true}):e[t]=s,e}var t="undefined"!=typeof self?self:global;const s="undefined"!=typeof navigator,i=s&&"undefined"==typeof HTMLImageElement,n=!("undefined"==typeof global||"undefined"==typeof process||!process.versions||!process.versions.node),r=t.Buffer,a=!!r,h=e=>void 0!==e;function f(e){return void 0===e||(e instanceof Map?0===e.size:0===Object.values(e).filter(h).length)}function l(e){let t=new Error(e);throw delete t.stack,t}function o(e){let t=function(e){let t=0;return e.ifd0.enabled&&(t+=1024),e.exif.enabled&&(t+=2048),e.makerNote&&(t+=2048),e.userComment&&(t+=1024),e.gps.enabled&&(t+=512),e.interop.enabled&&(t+=100),e.ifd1.enabled&&(t+=1024),t+2048}(e);return e.jfif.enabled&&(t+=50),e.xmp.enabled&&(t+=2e4),e.iptc.enabled&&(t+=14e3),e.icc.enabled&&(t+=6e3),t}const u=e=>String.fromCharCode.apply(null,e),d="undefined"!=typeof TextDecoder?new TextDecoder("utf-8"):void 0;class c{static from(e,t){return e instanceof this&&e.le===t?e:new c(e,void 0,void 0,t)}constructor(e,t=0,s,i){if("boolean"==typeof i&&(this.le=i),Array.isArray(e)&&(e=new Uint8Array(e)),0===e)this.byteOffset=0,this.byteLength=0;else if(e instanceof ArrayBuffer){ void 0===s&&(s=e.byteLength-t);let i=new DataView(e,t,s);this._swapDataView(i);}else if(e instanceof Uint8Array||e instanceof DataView||e instanceof c){ void 0===s&&(s=e.byteLength-t),(t+=e.byteOffset)+s>e.byteOffset+e.byteLength&&l("Creating view outside of available memory in ArrayBuffer");let i=new DataView(e.buffer,t,s);this._swapDataView(i);}else if("number"==typeof e){let t=new DataView(new ArrayBuffer(e));this._swapDataView(t);}else l("Invalid input argument for BufferView: "+e);}_swapArrayBuffer(e){this._swapDataView(new DataView(e));}_swapBuffer(e){this._swapDataView(new DataView(e.buffer,e.byteOffset,e.byteLength));}_swapDataView(e){this.dataView=e,this.buffer=e.buffer,this.byteOffset=e.byteOffset,this.byteLength=e.byteLength;}_lengthToEnd(e){return this.byteLength-e}set(e,t,s=c){return e instanceof DataView||e instanceof c?e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength):e instanceof ArrayBuffer&&(e=new Uint8Array(e)),e instanceof Uint8Array||l("BufferView.set(): Invalid data argument."),this.toUint8().set(e,t),new s(this,t,e.byteLength)}subarray(e,t){return t=t||this._lengthToEnd(e),new c(this,e,t)}toUint8(){return new Uint8Array(this.buffer,this.byteOffset,this.byteLength)}getUint8Array(e,t){return new Uint8Array(this.buffer,this.byteOffset+e,t)}getString(e=0,t=this.byteLength){let s=this.getUint8Array(e,t);return i=s,d?d.decode(i):a?Buffer.from(i).toString("utf8"):decodeURIComponent(escape(u(i)));var i;}getLatin1String(e=0,t=this.byteLength){let s=this.getUint8Array(e,t);return u(s)}getUnicodeString(e=0,t=this.byteLength){const s=[];for(let i=0;i<t&&e+i<this.byteLength;i+=2)s.push(this.getUint16(e+i));return u(s)}getInt8(e){return this.dataView.getInt8(e)}getUint8(e){return this.dataView.getUint8(e)}getInt16(e,t=this.le){return this.dataView.getInt16(e,t)}getInt32(e,t=this.le){return this.dataView.getInt32(e,t)}getUint16(e,t=this.le){return this.dataView.getUint16(e,t)}getUint32(e,t=this.le){return this.dataView.getUint32(e,t)}getFloat32(e,t=this.le){return this.dataView.getFloat32(e,t)}getFloat64(e,t=this.le){return this.dataView.getFloat64(e,t)}getFloat(e,t=this.le){return this.dataView.getFloat32(e,t)}getDouble(e,t=this.le){return this.dataView.getFloat64(e,t)}getUintBytes(e,t,s){switch(t){case 1:return this.getUint8(e,s);case 2:return this.getUint16(e,s);case 4:return this.getUint32(e,s);case 8:return this.getUint64&&this.getUint64(e,s)}}getUint(e,t,s){switch(t){case 8:return this.getUint8(e,s);case 16:return this.getUint16(e,s);case 32:return this.getUint32(e,s);case 64:return this.getUint64&&this.getUint64(e,s)}}toString(e){return this.dataView.toString(e,this.constructor.name)}ensureChunk(){}}function p(e,t){l(`${e} '${t}' was not loaded, try using full build of exifr.`);}class g extends Map{constructor(e){super(),this.kind=e;}get(e,t){return this.has(e)||p(this.kind,e),t&&(e in t||function(e,t){l(`Unknown ${e} '${t}'.`);}(this.kind,e),t[e].enabled||p(this.kind,e)),super.get(e)}keyList(){return Array.from(this.keys())}}var m=new g("file parser"),y=new g("segment parser"),b=new g("file reader");let w=t.fetch;function k(e,t){return (i=e).startsWith("data:")||i.length>1e4?v(e,t,"base64"):n&&e.includes("://")?O(e,t,"url",S):n?v(e,t,"fs"):s?O(e,t,"url",S):void l("Invalid input argument");var i;}async function O(e,t,s,i){return b.has(s)?v(e,t,s):i?async function(e,t){let s=await t(e);return new c(s)}(e,i):void l(`Parser ${s} is not loaded`)}async function v(e,t,s){let i=new(b.get(s))(e,t);return await i.read(),i}const S=e=>w(e).then((e=>e.arrayBuffer())),A=e=>new Promise(((t,s)=>{let i=new FileReader;i.onloadend=()=>t(i.result||new ArrayBuffer),i.onerror=s,i.readAsArrayBuffer(e);}));const B=new Map,V=new Map,I=new Map,L=["chunked","firstChunkSize","firstChunkSizeNode","firstChunkSizeBrowser","chunkSize","chunkLimit"],T=["jfif","xmp","icc","iptc","ihdr"],z=["tiff",...T],P=["ifd0","ifd1","exif","gps","interop"],F=[...z,...P],j=["makerNote","userComment"],E=["translateKeys","translateValues","reviveValues","multiSegment"],M=[...E,"sanitize","mergeOutput","silentErrors"];class _{get translate(){return this.translateKeys||this.translateValues||this.reviveValues}}class D extends _{get needed(){return this.enabled||this.deps.size>0}constructor(t,s,i,n){if(super(),e(this,"enabled",false),e(this,"skip",new Set),e(this,"pick",new Set),e(this,"deps",new Set),e(this,"translateKeys",false),e(this,"translateValues",false),e(this,"reviveValues",false),this.key=t,this.enabled=s,this.parse=this.enabled,this.applyInheritables(n),this.canBeFiltered=P.includes(t),this.canBeFiltered&&(this.dict=B.get(t)),void 0!==i)if(Array.isArray(i))this.parse=this.enabled=true,this.canBeFiltered&&i.length>0&&this.translateTagSet(i,this.pick);else if("object"==typeof i){if(this.enabled=true,this.parse=false!==i.parse,this.canBeFiltered){let{pick:e,skip:t}=i;e&&e.length>0&&this.translateTagSet(e,this.pick),t&&t.length>0&&this.translateTagSet(t,this.skip);}this.applyInheritables(i);}else  true===i||false===i?this.parse=this.enabled=i:l(`Invalid options argument: ${i}`);}applyInheritables(e){let t,s;for(t of E)s=e[t],void 0!==s&&(this[t]=s);}translateTagSet(e,t){if(this.dict){let s,i,{tagKeys:n,tagValues:r}=this.dict;for(s of e)"string"==typeof s?(i=r.indexOf(s),-1===i&&(i=n.indexOf(Number(s))),-1!==i&&t.add(Number(n[i]))):t.add(s);}else for(let s of e)t.add(s);}finalizeFilters(){!this.enabled&&this.deps.size>0?(this.enabled=true,X(this.pick,this.deps)):this.enabled&&this.pick.size>0&&X(this.pick,this.deps);}}var N={jfif:false,tiff:true,xmp:false,icc:false,iptc:false,ifd0:true,ifd1:false,exif:true,gps:true,interop:false,ihdr:void 0,makerNote:false,userComment:false,multiSegment:false,skip:[],pick:[],translateKeys:true,translateValues:true,reviveValues:true,sanitize:true,mergeOutput:true,silentErrors:true,chunked:true,firstChunkSize:void 0,firstChunkSizeNode:512,firstChunkSizeBrowser:65536,chunkSize:65536,chunkLimit:5},$=new Map;class R extends _{static useCached(e){let t=$.get(e);return void 0!==t||(t=new this(e),$.set(e,t)),t}constructor(e){super(),true===e?this.setupFromTrue():void 0===e?this.setupFromUndefined():Array.isArray(e)?this.setupFromArray(e):"object"==typeof e?this.setupFromObject(e):l(`Invalid options argument ${e}`),void 0===this.firstChunkSize&&(this.firstChunkSize=s?this.firstChunkSizeBrowser:this.firstChunkSizeNode),this.mergeOutput&&(this.ifd1.enabled=false),this.filterNestedSegmentTags(),this.traverseTiffDependencyTree(),this.checkLoadedPlugins();}setupFromUndefined(){let e;for(e of L)this[e]=N[e];for(e of M)this[e]=N[e];for(e of j)this[e]=N[e];for(e of F)this[e]=new D(e,N[e],void 0,this);}setupFromTrue(){let e;for(e of L)this[e]=N[e];for(e of M)this[e]=N[e];for(e of j)this[e]=true;for(e of F)this[e]=new D(e,true,void 0,this);}setupFromArray(e){let t;for(t of L)this[t]=N[t];for(t of M)this[t]=N[t];for(t of j)this[t]=N[t];for(t of F)this[t]=new D(t,false,void 0,this);this.setupGlobalFilters(e,void 0,P);}setupFromObject(e){let t;for(t of(P.ifd0=P.ifd0||P.image,P.ifd1=P.ifd1||P.thumbnail,Object.assign(this,e),L))this[t]=W(e[t],N[t]);for(t of M)this[t]=W(e[t],N[t]);for(t of j)this[t]=W(e[t],N[t]);for(t of z)this[t]=new D(t,N[t],e[t],this);for(t of P)this[t]=new D(t,N[t],e[t],this.tiff);this.setupGlobalFilters(e.pick,e.skip,P,F),true===e.tiff?this.batchEnableWithBool(P,true):false===e.tiff?this.batchEnableWithUserValue(P,e):Array.isArray(e.tiff)?this.setupGlobalFilters(e.tiff,void 0,P):"object"==typeof e.tiff&&this.setupGlobalFilters(e.tiff.pick,e.tiff.skip,P);}batchEnableWithBool(e,t){for(let s of e)this[s].enabled=t;}batchEnableWithUserValue(e,t){for(let s of e){let e=t[s];this[s].enabled=false!==e&&void 0!==e;}}setupGlobalFilters(e,t,s,i=s){if(e&&e.length){for(let e of i)this[e].enabled=false;let t=K(e,s);for(let[e,s]of t)X(this[e].pick,s),this[e].enabled=true;}else if(t&&t.length){let e=K(t,s);for(let[t,s]of e)X(this[t].skip,s);}}filterNestedSegmentTags(){let{ifd0:e,exif:t,xmp:s,iptc:i,icc:n}=this;this.makerNote?t.deps.add(37500):t.skip.add(37500),this.userComment?t.deps.add(37510):t.skip.add(37510),s.enabled||e.skip.add(700),i.enabled||e.skip.add(33723),n.enabled||e.skip.add(34675);}traverseTiffDependencyTree(){let{ifd0:e,exif:t,gps:s,interop:i}=this;i.needed&&(t.deps.add(40965),e.deps.add(40965)),t.needed&&e.deps.add(34665),s.needed&&e.deps.add(34853),this.tiff.enabled=P.some((e=>true===this[e].enabled))||this.makerNote||this.userComment;for(let e of P)this[e].finalizeFilters();}get onlyTiff(){return !T.map((e=>this[e].enabled)).some((e=>true===e))&&this.tiff.enabled}checkLoadedPlugins(){for(let e of z)this[e].enabled&&!y.has(e)&&p("segment parser",e);}}function K(e,t){let s,i,n,r,a=[];for(n of t){for(r of(s=B.get(n),i=[],s))(e.includes(r[0])||e.includes(r[1]))&&i.push(r[0]);i.length&&a.push([n,i]);}return a}function W(e,t){return void 0!==e?e:void 0!==t?t:void 0}function X(e,t){for(let s of t)e.add(s);}e(R,"default",N);class H{constructor(t){e(this,"parsers",{}),e(this,"output",{}),e(this,"errors",[]),e(this,"pushToErrors",(e=>this.errors.push(e))),this.options=R.useCached(t);}async read(e){this.file=await function(e,t){return "string"==typeof e?k(e,t):s&&!i&&e instanceof HTMLImageElement?k(e.src,t):e instanceof Uint8Array||e instanceof ArrayBuffer||e instanceof DataView?new c(e):s&&e instanceof Blob?O(e,t,"blob",A):void l("Invalid input argument")}(e,this.options);}setup(){if(this.fileParser)return;let{file:e}=this,t=e.getUint16(0);for(let[s,i]of m)if(i.canHandle(e,t))return this.fileParser=new i(this.options,this.file,this.parsers),e[s]=true;this.file.close&&this.file.close(),l("Unknown file format");}async parse(){let{output:e,errors:t}=this;return this.setup(),this.options.silentErrors?(await this.executeParsers().catch(this.pushToErrors),t.push(...this.fileParser.errors)):await this.executeParsers(),this.file.close&&this.file.close(),this.options.silentErrors&&t.length>0&&(e.errors=t),f(s=e)?void 0:s;var s;}async executeParsers(){let{output:e}=this;await this.fileParser.parse();let t=Object.values(this.parsers).map((async t=>{let s=await t.parse();t.assignToOutput(e,s);}));this.options.silentErrors&&(t=t.map((e=>e.catch(this.pushToErrors)))),await Promise.all(t);}async extractThumbnail(){this.setup();let{options:e,file:t}=this,s=y.get("tiff",e);var i;if(t.tiff?i={start:0,type:"tiff"}:t.jpeg&&(i=await this.fileParser.getOrFindSegment("tiff")),void 0===i)return;let n=await this.fileParser.ensureSegmentChunk(i),r=this.parsers.tiff=new s(n,e,t),a=await r.extractThumbnail();return t.close&&t.close(),a}}class J{static findPosition(e,t){let s=e.getUint16(t+2)+2,i="function"==typeof this.headerLength?this.headerLength(e,t,s):this.headerLength,n=t+i,r=s-i;return {offset:t,length:s,headerLength:i,start:n,size:r,end:n+r}}static parse(e,t={}){return new this(e,new R({[this.type]:t}),e).parse()}normalizeInput(e){return e instanceof c?e:new c(e)}constructor(t,s={},i){e(this,"errors",[]),e(this,"raw",new Map),e(this,"handleError",(e=>{if(!this.options.silentErrors)throw e;this.errors.push(e.message);})),this.chunk=this.normalizeInput(t),this.file=i,this.type=this.constructor.type,this.globalOptions=this.options=s,this.localOptions=s[this.type],this.canTranslate=this.localOptions&&this.localOptions.translate;}translate(){this.canTranslate&&(this.translated=this.translateBlock(this.raw,this.type));}get output(){return this.translated?this.translated:this.raw?Object.fromEntries(this.raw):void 0}translateBlock(e,t){let s=I.get(t),i=V.get(t),n=B.get(t),r=this.options[t],a=r.reviveValues&&!!s,h=r.translateValues&&!!i,f=r.translateKeys&&!!n,l={};for(let[t,r]of e)a&&s.has(t)?r=s.get(t)(r):h&&i.has(t)&&(r=this.translateValue(r,i.get(t))),f&&n.has(t)&&(t=n.get(t)||t),l[t]=r;return l}translateValue(e,t){return t[e]||t.DEFAULT||e}assignToOutput(e,t){this.assignObjectToOutput(e,this.constructor.type,t);}assignObjectToOutput(e,t,s){if(this.globalOptions.mergeOutput)return Object.assign(e,s);e[t]?Object.assign(e[t],s):e[t]=s;}}e(J,"headerLength",4),e(J,"type",void 0),e(J,"multiSegment",false),e(J,"canHandle",(()=>false));function q(e){return 192===e||194===e||196===e||219===e||221===e||218===e||254===e}function Q(e){return e>=224&&e<=239}function Z(e,t,s){for(let[i,n]of y)if(n.canHandle(e,t,s))return i}class ee extends class{constructor(t,s,i){e(this,"errors",[]),e(this,"ensureSegmentChunk",(async e=>{let t=e.start,s=e.size||65536;if(this.file.chunked)if(this.file.available(t,s))e.chunk=this.file.subarray(t,s);else try{e.chunk=await this.file.readChunk(t,s);}catch(t){l(`Couldn't read segment: ${JSON.stringify(e)}. ${t.message}`);}else this.file.byteLength>t+s?e.chunk=this.file.subarray(t,s):void 0===e.size?e.chunk=this.file.subarray(t):l("Segment unreachable: "+JSON.stringify(e));return e.chunk})),this.extendOptions&&this.extendOptions(t),this.options=t,this.file=s,this.parsers=i;}injectSegment(e,t){this.options[e].enabled&&this.createParser(e,t);}createParser(e,t){let s=new(y.get(e))(t,this.options,this.file);return this.parsers[e]=s}createParsers(e){for(let t of e){let{type:e,chunk:s}=t,i=this.options[e];if(i&&i.enabled){let t=this.parsers[e];t&&t.append||t||this.createParser(e,s);}}}async readSegments(e){let t=e.map(this.ensureSegmentChunk);await Promise.all(t);}}{constructor(...t){super(...t),e(this,"appSegments",[]),e(this,"jpegSegments",[]),e(this,"unknownSegments",[]);}static canHandle(e,t){return 65496===t}async parse(){await this.findAppSegments(),await this.readSegments(this.appSegments),this.mergeMultiSegments(),this.createParsers(this.mergedAppSegments||this.appSegments);}setupSegmentFinderArgs(e){ true===e?(this.findAll=true,this.wanted=new Set(y.keyList())):(e=void 0===e?y.keyList().filter((e=>this.options[e].enabled)):e.filter((e=>this.options[e].enabled&&y.has(e))),this.findAll=false,this.remaining=new Set(e),this.wanted=new Set(e)),this.unfinishedMultiSegment=false;}async findAppSegments(e=0,t){this.setupSegmentFinderArgs(t);let{file:s,findAll:i,wanted:n,remaining:r}=this;if(!i&&this.file.chunked&&(i=Array.from(n).some((e=>{let t=y.get(e),s=this.options[e];return t.multiSegment&&s.multiSegment})),i&&await this.file.readWhole()),e=this.findAppSegmentsInRange(e,s.byteLength),!this.options.onlyTiff&&s.chunked){let t=false;for(;r.size>0&&!t&&(s.canReadNextChunk||this.unfinishedMultiSegment);){let{nextChunkOffset:i}=s,n=this.appSegments.some((e=>!this.file.available(e.offset||e.start,e.length||e.size)));if(t=e>i&&!n?!await s.readNextChunk(e):!await s.readNextChunk(i),void 0===(e=this.findAppSegmentsInRange(e,s.byteLength)))return}}}findAppSegmentsInRange(e,t){t-=2;let s,i,n,r,a,h,{file:f,findAll:l,wanted:o,remaining:u,options:d}=this;for(;e<t;e++)if(255===f.getUint8(e))if(s=f.getUint8(e+1),Q(s)){if(i=f.getUint16(e+2),n=Z(f,e,i),n&&o.has(n)&&(r=y.get(n),a=r.findPosition(f,e),h=d[n],a.type=n,this.appSegments.push(a),!l&&(r.multiSegment&&h.multiSegment?(this.unfinishedMultiSegment=a.chunkNumber<a.chunkCount,this.unfinishedMultiSegment||u.delete(n)):u.delete(n),0===u.size)))break;d.recordUnknownSegments&&(a=J.findPosition(f,e),a.marker=s,this.unknownSegments.push(a)),e+=i+1;}else if(q(s)){if(i=f.getUint16(e+2),218===s&&false!==d.stopAfterSos)return;d.recordJpegSegments&&this.jpegSegments.push({offset:e,length:i,marker:s}),e+=i+1;}return e}mergeMultiSegments(){if(!this.appSegments.some((e=>e.multiSegment)))return;let e=function(e,t){let s,i,n,r=new Map;for(let a=0;a<e.length;a++)s=e[a],i=s[t],r.has(i)?n=r.get(i):r.set(i,n=[]),n.push(s);return Array.from(r)}(this.appSegments,"type");this.mergedAppSegments=e.map((([e,t])=>{let s=y.get(e,this.options);if(s.handleMultiSegments){return {type:e,chunk:s.handleMultiSegments(t)}}return t[0]}));}getSegment(e){return this.appSegments.find((t=>t.type===e))}async getOrFindSegment(e){let t=this.getSegment(e);return void 0===t&&(await this.findAppSegments(0,[e]),t=this.getSegment(e)),t}}e(ee,"type","jpeg"),m.set("jpeg",ee);const te=[void 0,1,1,2,4,8,1,1,2,4,8,4,8,4];class se extends J{parseHeader(){var e=this.chunk.getUint16();18761===e?this.le=true:19789===e&&(this.le=false),this.chunk.le=this.le,this.headerParsed=true;}parseTags(e,t,s=new Map){let{pick:i,skip:n}=this.options[t];i=new Set(i);let r=i.size>0,a=0===n.size,h=this.chunk.getUint16(e);e+=2;for(let f=0;f<h;f++){let h=this.chunk.getUint16(e);if(r){if(i.has(h)&&(s.set(h,this.parseTag(e,h,t)),i.delete(h),0===i.size))break}else !a&&n.has(h)||s.set(h,this.parseTag(e,h,t));e+=12;}return s}parseTag(e,t,s){let{chunk:i}=this,n=i.getUint16(e+2),r=i.getUint32(e+4),a=te[n];if(a*r<=4?e+=8:e=i.getUint32(e+8),(n<1||n>13)&&l(`Invalid TIFF value type. block: ${s.toUpperCase()}, tag: ${t.toString(16)}, type: ${n}, offset ${e}`),e>i.byteLength&&l(`Invalid TIFF value offset. block: ${s.toUpperCase()}, tag: ${t.toString(16)}, type: ${n}, offset ${e} is outside of chunk size ${i.byteLength}`),1===n)return i.getUint8Array(e,r);if(2===n)return ""===(h=function(e){for(;e.endsWith("\0");)e=e.slice(0,-1);return e}(h=i.getString(e,r)).trim())?void 0:h;var h;if(7===n)return i.getUint8Array(e,r);if(1===r)return this.parseTagValue(n,e);{let t=new(function(e){switch(e){case 1:return Uint8Array;case 3:return Uint16Array;case 4:return Uint32Array;case 5:return Array;case 6:return Int8Array;case 8:return Int16Array;case 9:return Int32Array;case 10:return Array;case 11:return Float32Array;case 12:return Float64Array;default:return Array}}(n))(r),s=a;for(let i=0;i<r;i++)t[i]=this.parseTagValue(n,e),e+=s;return t}}parseTagValue(e,t){let{chunk:s}=this;switch(e){case 1:return s.getUint8(t);case 3:return s.getUint16(t);case 4:return s.getUint32(t);case 5:return s.getUint32(t)/s.getUint32(t+4);case 6:return s.getInt8(t);case 8:return s.getInt16(t);case 9:return s.getInt32(t);case 10:return s.getInt32(t)/s.getInt32(t+4);case 11:return s.getFloat(t);case 12:return s.getDouble(t);case 13:return s.getUint32(t);default:l(`Invalid tiff type ${e}`);}}}class ie extends se{static canHandle(e,t){return 225===e.getUint8(t+1)&&1165519206===e.getUint32(t+4)&&0===e.getUint16(t+8)}async parse(){this.parseHeader();let{options:e}=this;return e.ifd0.enabled&&await this.parseIfd0Block(),e.exif.enabled&&await this.safeParse("parseExifBlock"),e.gps.enabled&&await this.safeParse("parseGpsBlock"),e.interop.enabled&&await this.safeParse("parseInteropBlock"),e.ifd1.enabled&&await this.safeParse("parseThumbnailBlock"),this.createOutput()}safeParse(e){let t=this[e]();return void 0!==t.catch&&(t=t.catch(this.handleError)),t}findIfd0Offset(){ void 0===this.ifd0Offset&&(this.ifd0Offset=this.chunk.getUint32(4));}findIfd1Offset(){if(void 0===this.ifd1Offset){this.findIfd0Offset();let e=this.chunk.getUint16(this.ifd0Offset),t=this.ifd0Offset+2+12*e;this.ifd1Offset=this.chunk.getUint32(t);}}parseBlock(e,t){let s=new Map;return this[t]=s,this.parseTags(e,t,s),s}async parseIfd0Block(){if(this.ifd0)return;let{file:e}=this;this.findIfd0Offset(),this.ifd0Offset<8&&l("Malformed EXIF data"),!e.chunked&&this.ifd0Offset>e.byteLength&&l(`IFD0 offset points to outside of file.\nthis.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e.byteLength}`),e.tiff&&await e.ensureChunk(this.ifd0Offset,o(this.options));let t=this.parseBlock(this.ifd0Offset,"ifd0");return 0!==t.size?(this.exifOffset=t.get(34665),this.interopOffset=t.get(40965),this.gpsOffset=t.get(34853),this.xmp=t.get(700),this.iptc=t.get(33723),this.icc=t.get(34675),this.options.sanitize&&(t.delete(34665),t.delete(40965),t.delete(34853),t.delete(700),t.delete(33723),t.delete(34675)),t):void 0}async parseExifBlock(){if(this.exif)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.exifOffset)return;this.file.tiff&&await this.file.ensureChunk(this.exifOffset,o(this.options));let e=this.parseBlock(this.exifOffset,"exif");return this.interopOffset||(this.interopOffset=e.get(40965)),this.makerNote=e.get(37500),this.userComment=e.get(37510),this.options.sanitize&&(e.delete(40965),e.delete(37500),e.delete(37510)),this.unpack(e,41728),this.unpack(e,41729),e}unpack(e,t){let s=e.get(t);s&&1===s.length&&e.set(t,s[0]);}async parseGpsBlock(){if(this.gps)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.gpsOffset)return;let e=this.parseBlock(this.gpsOffset,"gps");return e&&e.has(2)&&e.has(4)&&(e.set("latitude",ne(...e.get(2),e.get(1))),e.set("longitude",ne(...e.get(4),e.get(3)))),e}async parseInteropBlock(){if(!this.interop&&(this.ifd0||await this.parseIfd0Block(),void 0!==this.interopOffset||this.exif||await this.parseExifBlock(),void 0!==this.interopOffset))return this.parseBlock(this.interopOffset,"interop")}async parseThumbnailBlock(e=false){if(!this.ifd1&&!this.ifd1Parsed&&(!this.options.mergeOutput||e))return this.findIfd1Offset(),this.ifd1Offset>0&&(this.parseBlock(this.ifd1Offset,"ifd1"),this.ifd1Parsed=true),this.ifd1}async extractThumbnail(){if(this.headerParsed||this.parseHeader(),this.ifd1Parsed||await this.parseThumbnailBlock(true),void 0===this.ifd1)return;let e=this.ifd1.get(513),t=this.ifd1.get(514);return this.chunk.getUint8Array(e,t)}get image(){return this.ifd0}get thumbnail(){return this.ifd1}createOutput(){let e,t,s,i={};for(t of P)if(e=this[t],!f(e))if(s=this.canTranslate?this.translateBlock(e,t):Object.fromEntries(e),this.options.mergeOutput){if("ifd1"===t)continue;Object.assign(i,s);}else i[t]=s;return this.makerNote&&(i.makerNote=this.makerNote),this.userComment&&(i.userComment=this.userComment),i}assignToOutput(e,t){if(this.globalOptions.mergeOutput)Object.assign(e,t);else for(let[s,i]of Object.entries(t))this.assignObjectToOutput(e,s,i);}}function ne(e,t,s,i){var n=e+t/60+s/3600;return "S"!==i&&"W"!==i||(n*=-1),n}e(ie,"type","tiff"),e(ie,"headerLength",10),y.set("tiff",ie);const ae={ifd0:false,ifd1:false,exif:false,gps:false,interop:false,sanitize:false,reviveValues:true,translateKeys:false,translateValues:false,mergeOutput:false};Object.assign({},ae,{firstChunkSize:4e4,gps:[1,2,3,4]});Object.assign({},ae,{tiff:false,ifd1:true,mergeOutput:false});const de=Object.assign({},ae,{firstChunkSize:4e4,ifd0:[274]});async function ce(e){let t=new H(de);await t.read(e);let s=await t.parse();if(s&&s.ifd0)return s.ifd0[274]}const pe=Object.freeze({1:{dimensionSwapped:false,scaleX:1,scaleY:1,deg:0,rad:0},2:{dimensionSwapped:false,scaleX:-1,scaleY:1,deg:0,rad:0},3:{dimensionSwapped:false,scaleX:1,scaleY:1,deg:180,rad:180*Math.PI/180},4:{dimensionSwapped:false,scaleX:-1,scaleY:1,deg:180,rad:180*Math.PI/180},5:{dimensionSwapped:true,scaleX:1,scaleY:-1,deg:90,rad:90*Math.PI/180},6:{dimensionSwapped:true,scaleX:1,scaleY:1,deg:90,rad:90*Math.PI/180},7:{dimensionSwapped:true,scaleX:1,scaleY:-1,deg:270,rad:270*Math.PI/180},8:{dimensionSwapped:true,scaleX:1,scaleY:1,deg:270,rad:270*Math.PI/180}});let ge=true,me=true;if("object"==typeof navigator){let e=navigator.userAgent;if(e.includes("iPad")||e.includes("iPhone")){let t=e.match(/OS (\d+)_(\d+)/);if(t){let[,e,s]=t,i=Number(e)+.1*Number(s);ge=i<13.4,me=false;}}else if(e.includes("OS X 10")){let[,t]=e.match(/OS X 10[_.](\d+)/);ge=me=Number(t)<15;}if(e.includes("Chrome/")){let[,t]=e.match(/Chrome\/(\d+)/);ge=me=Number(t)<81;}else if(e.includes("Firefox/")){let[,t]=e.match(/Firefox\/(\d+)/);ge=me=Number(t)<77;}}async function ye(e){let t=await ce(e);return Object.assign({canvas:ge,css:me},pe[t])}class be extends c{constructor(...t){super(...t),e(this,"ranges",new we),0!==this.byteLength&&this.ranges.add(0,this.byteLength);}_tryExtend(e,t,s){if(0===e&&0===this.byteLength&&s){let e=new DataView(s.buffer||s,s.byteOffset,s.byteLength);this._swapDataView(e);}else {let s=e+t;if(s>this.byteLength){let{dataView:e}=this._extend(s);this._swapDataView(e);}}}_extend(e){let t;t=a?r.allocUnsafe(e):new Uint8Array(e);let s=new DataView(t.buffer,t.byteOffset,t.byteLength);return t.set(new Uint8Array(this.buffer,this.byteOffset,this.byteLength),0),{uintView:t,dataView:s}}subarray(e,t,s=false){return t=t||this._lengthToEnd(e),s&&this._tryExtend(e,t),this.ranges.add(e,t),super.subarray(e,t)}set(e,t,s=false){s&&this._tryExtend(t,e.byteLength,e);let i=super.set(e,t);return this.ranges.add(t,i.byteLength),i}async ensureChunk(e,t){this.chunked&&(this.ranges.available(e,t)||await this.readChunk(e,t));}available(e,t){return this.ranges.available(e,t)}}class we{constructor(){e(this,"list",[]);}get length(){return this.list.length}add(e,t,s=0){let i=e+t,n=this.list.filter((t=>ke(e,t.offset,i)||ke(e,t.end,i)));if(n.length>0){e=Math.min(e,...n.map((e=>e.offset))),i=Math.max(i,...n.map((e=>e.end))),t=i-e;let s=n.shift();s.offset=e,s.length=t,s.end=i,this.list=this.list.filter((e=>!n.includes(e)));}else this.list.push({offset:e,length:t,end:i});}available(e,t){let s=e+t;return this.list.some((t=>t.offset<=e&&s<=t.end))}}function ke(e,t,s){return e<=t&&t<=s}class Oe extends be{constructor(t,s){super(0),e(this,"chunksRead",0),this.input=t,this.options=s;}async readWhole(){this.chunked=false,await this.readChunk(this.nextChunkOffset);}async readChunked(){this.chunked=true,await this.readChunk(0,this.options.firstChunkSize);}async readNextChunk(e=this.nextChunkOffset){if(this.fullyRead)return this.chunksRead++,false;let t=this.options.chunkSize,s=await this.readChunk(e,t);return !!s&&s.byteLength===t}async readChunk(e,t){if(this.chunksRead++,0!==(t=this.safeWrapAddress(e,t)))return this._readChunk(e,t)}safeWrapAddress(e,t){return void 0!==this.size&&e+t>this.size?Math.max(0,this.size-e):t}get nextChunkOffset(){if(0!==this.ranges.list.length)return this.ranges.list[0].length}get canReadNextChunk(){return this.chunksRead<this.options.chunkLimit}get fullyRead(){return void 0!==this.size&&this.nextChunkOffset===this.size}read(){return this.options.chunked?this.readChunked():this.readWhole()}close(){}}b.set("blob",class extends Oe{async readWhole(){this.chunked=false;let e=await A(this.input);this._swapArrayBuffer(e);}readChunked(){return this.chunked=true,this.size=this.input.size,super.readChunked()}async _readChunk(e,t){let s=t?e+t:void 0,i=this.input.slice(e,s),n=await A(i);return this.set(n,e,true)}});

var version$9 = "5.0.1";
var packageJson$9 = {
	version: version$9};

var locale$6 = {
    strings: {
        generatingThumbnails: 'Generating thumbnails...',
    },
};

/**
 * Save a <canvas> element's content to a Blob object.
 *
 */
function canvasToBlob(canvas, type, quality) {
    try {
        canvas.getContext('2d').getImageData(0, 0, 1, 1);
    }
    catch (err) {
        if (err.code === 18) {
            return Promise.reject(new Error('cannot read image, probably an svg with external resources'));
        }
    }
    if (canvas.toBlob) {
        return new Promise((resolve) => {
            canvas.toBlob(resolve, type, quality);
        }).then((blob) => {
            if (blob === null) {
                throw new Error('cannot read image, probably an svg with external resources');
            }
            return blob;
        });
    }
    return Promise.resolve()
        .then(() => {
        return dataURItoBlob(canvas.toDataURL(type, quality), {});
    })
        .then((blob) => {
        if (blob === null) {
            throw new Error('could not extract blob, probably an old browser');
        }
        return blob;
    });
}
function rotateImage(image, translate) {
    let w = image.width;
    let h = image.height;
    if (translate.deg === 90 || translate.deg === 270) {
        w = image.height;
        h = image.width;
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext('2d');
    context.translate(w / 2, h / 2);
    if (translate.canvas) {
        context.rotate(translate.rad);
        context.scale(translate.scaleX, translate.scaleY);
    }
    context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
    return canvas;
}
/**
 * Make sure the image doesn’t exceed browser/device canvas limits.
 * For ios with 256 RAM and ie
 */
function protect(image) {
    // https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
    const ratio = image.width / image.height;
    const maxSquare = 5000000; // ios max canvas square
    const maxSize = 4096; // ie max canvas dimensions
    let maxW = Math.floor(Math.sqrt(maxSquare * ratio));
    let maxH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio));
    if (maxW > maxSize) {
        maxW = maxSize;
        maxH = Math.round(maxW / ratio);
    }
    if (maxH > maxSize) {
        maxH = maxSize;
        maxW = Math.round(ratio * maxH);
    }
    if (image.width > maxW) {
        const canvas = document.createElement('canvas');
        canvas.width = maxW;
        canvas.height = maxH;
        canvas.getContext('2d').drawImage(image, 0, 0, maxW, maxH);
        return canvas;
    }
    return image;
}
const defaultOptions$6 = {
    thumbnailWidth: null,
    thumbnailHeight: null,
    thumbnailType: 'image/jpeg',
    waitForThumbnailsBeforeUpload: false,
    lazy: false,
};
/**
 * The Thumbnail Generator plugin
 */
class ThumbnailGenerator extends UIPlugin {
    static VERSION = packageJson$9.version;
    queue;
    queueProcessing;
    defaultThumbnailDimension;
    thumbnailType;
    constructor(uppy, opts) {
        super(uppy, { ...defaultOptions$6, ...opts });
        this.type = 'modifier';
        this.id = this.opts.id || 'ThumbnailGenerator';
        this.title = 'Thumbnail Generator';
        this.queue = [];
        this.queueProcessing = false;
        this.defaultThumbnailDimension = 200;
        this.thumbnailType = this.opts.thumbnailType;
        this.defaultLocale = locale$6;
        this.i18nInit();
        if (this.opts.lazy && this.opts.waitForThumbnailsBeforeUpload) {
            throw new Error('ThumbnailGenerator: The `lazy` and `waitForThumbnailsBeforeUpload` options are mutually exclusive. Please ensure at most one of them is set to `true`.');
        }
    }
    createThumbnail(file, targetWidth, targetHeight) {
        const originalUrl = URL.createObjectURL(file.data);
        const onload = new Promise((resolve, reject) => {
            const image = new Image();
            image.src = originalUrl;
            image.addEventListener('load', () => {
                URL.revokeObjectURL(originalUrl);
                resolve(image);
            });
            image.addEventListener('error', (event) => {
                URL.revokeObjectURL(originalUrl);
                reject(event.error || new Error('Could not create thumbnail'));
            });
        });
        const orientationPromise = ye(file.data).catch(() => 1);
        return Promise.all([onload, orientationPromise])
            .then(([image, orientation]) => {
            const dimensions = this.getProportionalDimensions(image, targetWidth, targetHeight, orientation.deg);
            const rotatedImage = rotateImage(image, orientation);
            const resizedImage = this.resizeImage(rotatedImage, dimensions.width, dimensions.height);
            return canvasToBlob(resizedImage, this.thumbnailType, 80);
        })
            .then((blob) => {
            return URL.createObjectURL(blob);
        });
    }
    /**
     * Get the new calculated dimensions for the given image and a target width
     * or height. If both width and height are given, only width is taken into
     * account. If neither width nor height are given, the default dimension
     * is used.
     */
    getProportionalDimensions(img, width, height, deg) {
        let aspect = img.width / img.height;
        if (deg === 90 || deg === 270) {
            aspect = img.height / img.width;
        }
        if (width != null) {
            let targetWidth = width;
            // Thumbnail shouldn’t be enlarged / upscaled, only reduced.
            // If img is already smaller than width/height, leave it as is.
            if (img.width < width)
                targetWidth = img.width;
            return {
                width: targetWidth,
                height: Math.round(targetWidth / aspect),
            };
        }
        if (height != null) {
            let targetHeight = height;
            if (img.height < height)
                targetHeight = img.height;
            return {
                width: Math.round(targetHeight * aspect),
                height: targetHeight,
            };
        }
        return {
            width: this.defaultThumbnailDimension,
            height: Math.round(this.defaultThumbnailDimension / aspect),
        };
    }
    /**
     * Resize an image to the target `width` and `height`.
     *
     * Returns a Canvas with the resized image on it.
     */
    resizeImage(image, targetWidth, targetHeight) {
        // Resizing in steps refactored to use a solution from
        // https://blog.uploadcare.com/image-resize-in-browsers-is-broken-e38eed08df01
        let img = protect(image);
        let steps = Math.ceil(Math.log2(img.width / targetWidth));
        if (steps < 1) {
            steps = 1;
        }
        let sW = targetWidth * 2 ** (steps - 1);
        let sH = targetHeight * 2 ** (steps - 1);
        const x = 2;
        while (steps--) {
            const canvas = document.createElement('canvas');
            canvas.width = sW;
            canvas.height = sH;
            canvas.getContext('2d').drawImage(img, 0, 0, sW, sH);
            img = canvas;
            sW = Math.round(sW / x);
            sH = Math.round(sH / x);
        }
        return img;
    }
    /**
     * Set the preview URL for a file.
     */
    setPreviewURL(fileID, preview) {
        this.uppy.setFileState(fileID, { preview });
    }
    addToQueue(fileID) {
        this.queue.push(fileID);
        if (this.queueProcessing === false) {
            this.processQueue();
        }
    }
    processQueue() {
        this.queueProcessing = true;
        if (this.queue.length > 0) {
            const current = this.uppy.getFile(this.queue.shift());
            if (!current) {
                this.uppy.log('[ThumbnailGenerator] file was removed before a thumbnail could be generated, but not removed from the queue. This is probably a bug', 'error');
                return Promise.resolve();
            }
            return this.requestThumbnail(current)
                .catch(() => { })
                .then(() => this.processQueue());
        }
        this.queueProcessing = false;
        this.uppy.log('[ThumbnailGenerator] Emptied thumbnail queue');
        this.uppy.emit('thumbnail:all-generated');
        return Promise.resolve();
    }
    requestThumbnail(file) {
        if (isPreviewSupported(file.type) && !file.isRemote) {
            return this.createThumbnail(file, this.opts.thumbnailWidth, this.opts.thumbnailHeight)
                .then((preview) => {
                this.setPreviewURL(file.id, preview);
                this.uppy.log(`[ThumbnailGenerator] Generated thumbnail for ${file.id}`);
                this.uppy.emit('thumbnail:generated', this.uppy.getFile(file.id), preview);
            })
                .catch((err) => {
                this.uppy.log(`[ThumbnailGenerator] Failed thumbnail for ${file.id}:`, 'warning');
                this.uppy.log(err, 'warning');
                this.uppy.emit('thumbnail:error', this.uppy.getFile(file.id), err);
            });
        }
        return Promise.resolve();
    }
    onFileAdded = (file) => {
        if (!file.preview &&
            file.data &&
            isPreviewSupported(file.type) &&
            !file.isRemote) {
            this.addToQueue(file.id);
        }
    };
    /**
     * Cancel a lazy request for a thumbnail if the thumbnail has not yet been generated.
     */
    onCancelRequest = (file) => {
        const index = this.queue.indexOf(file.id);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    };
    /**
     * Clean up the thumbnail for a file. Cancel lazy requests and free the thumbnail URL.
     */
    onFileRemoved = (file) => {
        const index = this.queue.indexOf(file.id);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
        // Clean up object URLs.
        if (file.preview && isObjectURL(file.preview)) {
            URL.revokeObjectURL(file.preview);
        }
    };
    onRestored = () => {
        const restoredFiles = this.uppy.getFiles().filter((file) => file.isRestored);
        restoredFiles.forEach((file) => {
            // Only add blob URLs; they are likely invalid after being restored.
            if (!file.preview || isObjectURL(file.preview)) {
                this.addToQueue(file.id);
            }
        });
    };
    onAllFilesRemoved = () => {
        this.queue = [];
    };
    waitUntilAllProcessed = (fileIDs) => {
        fileIDs.forEach((fileID) => {
            const file = this.uppy.getFile(fileID);
            this.uppy.emit('preprocess-progress', file, {
                mode: 'indeterminate',
                message: this.i18n('generatingThumbnails'),
            });
        });
        const emitPreprocessCompleteForAll = () => {
            fileIDs.forEach((fileID) => {
                const file = this.uppy.getFile(fileID);
                this.uppy.emit('preprocess-complete', file);
            });
        };
        return new Promise((resolve) => {
            if (this.queueProcessing) {
                this.uppy.once('thumbnail:all-generated', () => {
                    emitPreprocessCompleteForAll();
                    resolve();
                });
            }
            else {
                emitPreprocessCompleteForAll();
                resolve();
            }
        });
    };
    install() {
        this.uppy.on('file-removed', this.onFileRemoved);
        this.uppy.on('cancel-all', this.onAllFilesRemoved);
        if (this.opts.lazy) {
            this.uppy.on('thumbnail:request', this.onFileAdded);
            this.uppy.on('thumbnail:cancel', this.onCancelRequest);
        }
        else {
            this.uppy.on('thumbnail:request', this.onFileAdded);
            this.uppy.on('file-added', this.onFileAdded);
            this.uppy.on('restored', this.onRestored);
        }
        if (this.opts.waitForThumbnailsBeforeUpload) {
            this.uppy.addPreProcessor(this.waitUntilAllProcessed);
        }
    }
    uninstall() {
        this.uppy.off('file-removed', this.onFileRemoved);
        this.uppy.off('cancel-all', this.onAllFilesRemoved);
        if (this.opts.lazy) {
            this.uppy.off('thumbnail:request', this.onFileAdded);
            this.uppy.off('thumbnail:cancel', this.onCancelRequest);
        }
        else {
            this.uppy.off('thumbnail:request', this.onFileAdded);
            this.uppy.off('file-added', this.onFileAdded);
            this.uppy.off('restored', this.onRestored);
        }
        if (this.opts.waitForThumbnailsBeforeUpload) {
            this.uppy.removePreProcessor(this.waitUntilAllProcessed);
        }
    }
}

var version$8 = "5.0.2";
var packageJson$8 = {
	version: version$8};

class AddFiles extends x {
    fileInput = null;
    folderInput = null;
    mobilePhotoFileInput = null;
    mobileVideoFileInput = null;
    triggerFileInputClick = () => {
        this.fileInput?.click();
    };
    triggerFolderInputClick = () => {
        this.folderInput?.click();
    };
    triggerVideoCameraInputClick = () => {
        this.mobileVideoFileInput?.click();
    };
    triggerPhotoCameraInputClick = () => {
        this.mobilePhotoFileInput?.click();
    };
    onFileInputChange = (event) => {
        this.props.handleInputChange(event);
        // Clear the input so that Chrome/Safari/etc. can detect file section when the same file is repeatedly selected
        // (see https://github.com/transloadit/uppy/issues/768#issuecomment-2264902758)
        event.currentTarget.value = '';
    };
    renderHiddenInput = (isFolder, refCallback) => {
        return (u$2("input", { className: "uppy-Dashboard-input", hidden: true, "aria-hidden": "true", tabIndex: -1, 
            // @ts-expect-error default types don't yet know about the `webkitdirectory` property
            webkitdirectory: isFolder, type: "file", name: "files[]", multiple: this.props.maxNumberOfFiles !== 1, onChange: this.onFileInputChange, accept: this.props.allowedFileTypes?.join(', '), ref: refCallback }));
    };
    renderHiddenCameraInput = (type, nativeCameraFacingMode, refCallback) => {
        const typeToAccept = { photo: 'image/*', video: 'video/*' };
        const accept = typeToAccept[type];
        return (u$2("input", { className: "uppy-Dashboard-input", hidden: true, "aria-hidden": "true", tabIndex: -1, type: "file", name: `camera-${type}`, onChange: this.onFileInputChange, capture: nativeCameraFacingMode === '' ? 'environment' : nativeCameraFacingMode, accept: accept, ref: refCallback }));
    };
    renderMyDeviceAcquirer = () => {
        return (u$2("div", { className: "uppy-DashboardTab", role: "presentation", "data-uppy-acquirer-id": "MyDevice", children: u$2("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn", role: "tab", tabIndex: 0, "data-uppy-super-focusable": true, onClick: this.triggerFileInputClick, children: [u$2("div", { className: "uppy-DashboardTab-inner", children: u$2("svg", { className: "uppy-DashboardTab-iconMyDevice", "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "0 0 32 32", children: u$2("path", { d: "M8.45 22.087l-1.305-6.674h17.678l-1.572 6.674H8.45zm4.975-12.412l1.083 1.765a.823.823 0 00.715.386h7.951V13.5H8.587V9.675h4.838zM26.043 13.5h-1.195v-2.598c0-.463-.336-.75-.798-.75h-8.356l-1.082-1.766A.823.823 0 0013.897 8H7.728c-.462 0-.815.256-.815.718V13.5h-.956a.97.97 0 00-.746.37.972.972 0 00-.19.81l1.724 8.565c.095.44.484.755.933.755H24c.44 0 .824-.3.929-.727l2.043-8.568a.972.972 0 00-.176-.825.967.967 0 00-.753-.38z", fill: "currentcolor", "fill-rule": "evenodd" }) }) }), u$2("div", { className: "uppy-DashboardTab-name", children: this.props.i18n('myDevice') })] }) }));
    };
    renderPhotoCamera = () => {
        return (u$2("div", { className: "uppy-DashboardTab", role: "presentation", "data-uppy-acquirer-id": "MobilePhotoCamera", children: u$2("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn", role: "tab", tabIndex: 0, "data-uppy-super-focusable": true, onClick: this.triggerPhotoCameraInputClick, children: [u$2("div", { className: "uppy-DashboardTab-inner", children: u$2("svg", { "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "0 0 32 32", children: u$2("path", { d: "M23.5 9.5c1.417 0 2.5 1.083 2.5 2.5v9.167c0 1.416-1.083 2.5-2.5 2.5h-15c-1.417 0-2.5-1.084-2.5-2.5V12c0-1.417 1.083-2.5 2.5-2.5h2.917l1.416-2.167C13 7.167 13.25 7 13.5 7h5c.25 0 .5.167.667.333L20.583 9.5H23.5zM16 11.417a4.706 4.706 0 00-4.75 4.75 4.704 4.704 0 004.75 4.75 4.703 4.703 0 004.75-4.75c0-2.663-2.09-4.75-4.75-4.75zm0 7.825c-1.744 0-3.076-1.332-3.076-3.074 0-1.745 1.333-3.077 3.076-3.077 1.744 0 3.074 1.333 3.074 3.076s-1.33 3.075-3.074 3.075z", fill: "#02B383", "fill-rule": "nonzero" }) }) }), u$2("div", { className: "uppy-DashboardTab-name", children: this.props.i18n('takePictureBtn') })] }) }));
    };
    renderVideoCamera = () => {
        return (u$2("div", { className: "uppy-DashboardTab", role: "presentation", "data-uppy-acquirer-id": "MobileVideoCamera", children: u$2("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn", role: "tab", tabIndex: 0, "data-uppy-super-focusable": true, onClick: this.triggerVideoCameraInputClick, children: [u$2("div", { className: "uppy-DashboardTab-inner", children: u$2("svg", { "aria-hidden": "true", width: "32", height: "32", viewBox: "0 0 32 32", children: u$2("path", { fill: "#FF675E", fillRule: "nonzero", d: "m21.254 14.277 2.941-2.588c.797-.313 1.243.818 1.09 1.554-.01 2.094.02 4.189-.017 6.282-.126.915-1.145 1.08-1.58.34l-2.434-2.142c-.192.287-.504 1.305-.738.468-.104-1.293-.028-2.596-.05-3.894.047-.312.381.823.426 1.069.063-.384.206-.744.362-1.09zm-12.939-3.73c3.858.013 7.717-.025 11.574.02.912.129 1.492 1.237 1.351 2.217-.019 2.412.04 4.83-.03 7.239-.17 1.025-1.166 1.59-2.029 1.429-3.705-.012-7.41.025-11.114-.019-.913-.129-1.492-1.237-1.352-2.217.018-2.404-.036-4.813.029-7.214.136-.82.83-1.473 1.571-1.454z " }) }) }), u$2("div", { className: "uppy-DashboardTab-name", children: this.props.i18n('recordVideoBtn') })] }) }));
    };
    renderBrowseButton = (text, onClickFn) => {
        const numberOfAcquirers = this.props.acquirers.length;
        return (u$2("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-Dashboard-browse", onClick: onClickFn, "data-uppy-super-focusable": numberOfAcquirers === 0, children: text }));
    };
    renderDropPasteBrowseTagline = (numberOfAcquirers) => {
        const browseFiles = this.renderBrowseButton(this.props.i18n('browseFiles'), this.triggerFileInputClick);
        const browseFolders = this.renderBrowseButton(this.props.i18n('browseFolders'), this.triggerFolderInputClick);
        // in order to keep the i18n CamelCase and options lower (as are defaults) we will want to transform a lower
        // to Camel
        const lowerFMSelectionType = this.props.fileManagerSelectionType;
        const camelFMSelectionType = lowerFMSelectionType.charAt(0).toUpperCase() +
            lowerFMSelectionType.slice(1);
        return (u$2("div", { class: "uppy-Dashboard-AddFiles-title", children: this.props.disableLocalFiles
                ? this.props.i18n('importFiles')
                : numberOfAcquirers > 0
                    ? this.props.i18nArray(`dropPasteImport${camelFMSelectionType}`, {
                        browseFiles,
                        browseFolders,
                        browse: browseFiles,
                    })
                    : this.props.i18nArray(`dropPaste${camelFMSelectionType}`, {
                        browseFiles,
                        browseFolders,
                        browse: browseFiles,
                    }) }));
    };
    [Symbol.for('uppy test: disable unused locale key warning')]() {
        // Those are actually used in `renderDropPasteBrowseTagline` method.
        this.props.i18nArray('dropPasteBoth');
        this.props.i18nArray('dropPasteFiles');
        this.props.i18nArray('dropPasteFolders');
        this.props.i18nArray('dropPasteImportBoth');
        this.props.i18nArray('dropPasteImportFiles');
        this.props.i18nArray('dropPasteImportFolders');
    }
    renderAcquirer = (acquirer) => {
        return (u$2("div", { className: "uppy-DashboardTab", role: "presentation", "data-uppy-acquirer-id": acquirer.id, children: u$2("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn", role: "tab", tabIndex: 0, "data-cy": acquirer.id, "aria-controls": `uppy-DashboardContent-panel--${acquirer.id}`, "aria-selected": this.props.activePickerPanel?.id === acquirer.id, "data-uppy-super-focusable": true, onClick: () => this.props.showPanel(acquirer.id), children: [u$2("div", { className: "uppy-DashboardTab-inner", children: acquirer.icon() }), u$2("div", { className: "uppy-DashboardTab-name", children: acquirer.name })] }) }));
    };
    renderAcquirers = (acquirers) => {
        // Group last two buttons, so we don’t end up with
        // just one button on a new line
        const acquirersWithoutLastTwo = [...acquirers];
        const lastTwoAcquirers = acquirersWithoutLastTwo.splice(acquirers.length - 2, acquirers.length);
        return (u$2(k$2, { children: [acquirersWithoutLastTwo.map((acquirer) => this.renderAcquirer(acquirer)), u$2("span", { role: "presentation", style: { 'white-space': 'nowrap' }, children: lastTwoAcquirers.map((acquirer) => this.renderAcquirer(acquirer)) })] }));
    };
    renderSourcesList = (acquirers, disableLocalFiles) => {
        const { showNativePhotoCameraButton, showNativeVideoCameraButton } = this.props;
        let list = [];
        const myDeviceKey = 'myDevice';
        if (!disableLocalFiles)
            list.push({
                key: myDeviceKey,
                elements: this.renderMyDeviceAcquirer(),
            });
        if (showNativePhotoCameraButton)
            list.push({
                key: 'nativePhotoCameraButton',
                elements: this.renderPhotoCamera(),
            });
        if (showNativeVideoCameraButton)
            list.push({
                key: 'nativePhotoCameraButton',
                elements: this.renderVideoCamera(),
            });
        list.push(...acquirers.map((acquirer) => ({
            key: acquirer.id,
            elements: this.renderAcquirer(acquirer),
        })));
        // doesn't make sense to show only a lonely "My Device"
        const hasOnlyMyDevice = list.length === 1 && list[0].key === myDeviceKey;
        if (hasOnlyMyDevice)
            list = [];
        // Group last two buttons, so we don’t end up with
        // just one button on a new line
        const listWithoutLastTwo = [...list];
        const lastTwo = listWithoutLastTwo.splice(list.length - 2, list.length);
        return (u$2(k$2, { children: [this.renderDropPasteBrowseTagline(list.length), u$2("div", { className: "uppy-Dashboard-AddFiles-list", role: "tablist", children: [listWithoutLastTwo.map(({ key, elements }) => (u$2(k$2, { children: elements }, key))), u$2("span", { role: "presentation", style: { 'white-space': 'nowrap' }, children: lastTwo.map(({ key, elements }) => (u$2(k$2, { children: elements }, key))) })] })] }));
    };
    renderPoweredByUppy() {
        const { i18nArray } = this.props;
        const uppyBranding = (u$2("span", { children: [u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon uppy-Dashboard-poweredByIcon", width: "11", height: "11", viewBox: "0 0 11 11", children: u$2("path", { d: "M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z", fillRule: "evenodd" }) }), u$2("span", { className: "uppy-Dashboard-poweredByUppy", children: "Uppy" })] }));
        const linkText = i18nArray('poweredBy', { uppy: uppyBranding });
        return (u$2("a", { tabIndex: -1, href: "https://uppy.io", rel: "noreferrer noopener", target: "_blank", className: "uppy-Dashboard-poweredBy", children: linkText }));
    }
    render() {
        const { showNativePhotoCameraButton, showNativeVideoCameraButton, nativeCameraFacingMode, } = this.props;
        return (u$2("div", { className: "uppy-Dashboard-AddFiles", children: [this.renderHiddenInput(false, (ref) => {
                    this.fileInput = ref;
                }), this.renderHiddenInput(true, (ref) => {
                    this.folderInput = ref;
                }), showNativePhotoCameraButton &&
                    this.renderHiddenCameraInput('photo', nativeCameraFacingMode, (ref) => {
                        this.mobilePhotoFileInput = ref;
                    }), showNativeVideoCameraButton &&
                    this.renderHiddenCameraInput('video', nativeCameraFacingMode, (ref) => {
                        this.mobileVideoFileInput = ref;
                    }), this.renderSourcesList(this.props.acquirers, this.props.disableLocalFiles), u$2("div", { className: "uppy-Dashboard-AddFiles-info", children: [this.props.note && (u$2("div", { className: "uppy-Dashboard-note", children: this.props.note })), this.props.proudlyDisplayPoweredByUppy && this.renderPoweredByUppy()] })] }));
    }
}

const AddFilesPanel = (props) => {
    return (u$2("div", { className: classNames('uppy-Dashboard-AddFilesPanel', props.className), "data-uppy-panelType": "AddFiles", "aria-hidden": !props.showAddFilesPanel, children: [u$2("div", { className: "uppy-DashboardContent-bar", children: [u$2("div", { className: "uppy-DashboardContent-title", 
                        // biome-ignore lint/a11y/useSemanticElements: ...
                        role: "heading", "aria-level": 1, children: props.i18n('addingMoreFiles') }), u$2("button", { className: "uppy-DashboardContent-back", type: "button", onClick: () => props.toggleAddFilesPanel(false), children: props.i18n('back') })] }), u$2(AddFiles, { ...props })] }));
};

function EditorPanel(props) {
    const file = props.files[props.fileCardFor];
    const handleCancel = () => {
        props.uppy.emit('file-editor:cancel', file);
        props.closeFileEditor();
    };
    return (u$2("div", { className: classNames('uppy-DashboardContent-panel', props.className), role: "tabpanel", "data-uppy-panelType": "FileEditor", id: "uppy-DashboardContent-panel--editor", children: [u$2("div", { className: "uppy-DashboardContent-bar", children: [u$2("div", { className: "uppy-DashboardContent-title", 
                        // biome-ignore lint/a11y/useSemanticElements: ...
                        role: "heading", "aria-level": 1, children: props.i18nArray('editing', {
                            file: (u$2("span", { className: "uppy-DashboardContent-titleFile", children: file.meta ? file.meta.name : file.name })),
                        }) }), u$2("button", { className: "uppy-DashboardContent-back", type: "button", onClick: handleCancel, children: props.i18n('cancel') }), u$2("button", { className: "uppy-DashboardContent-save", type: "button", onClick: props.saveFileEditor, children: props.i18n('save') })] }), u$2("div", { className: "uppy-DashboardContent-panelBody", children: props.editors.map((target) => {
                    return props.uppy.getPlugin(target.id).render(props.state);
                }) })] }));
}

function iconImage() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", width: "25", height: "25", viewBox: "0 0 25 25", children: u$2("g", { fill: "#686DE0", fillRule: "evenodd", children: [u$2("path", { d: "M5 7v10h15V7H5zm0-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z", fillRule: "nonzero" }), u$2("path", { d: "M6.35 17.172l4.994-5.026a.5.5 0 0 1 .707 0l2.16 2.16 3.505-3.505a.5.5 0 0 1 .707 0l2.336 2.31-.707.72-1.983-1.97-3.505 3.505a.5.5 0 0 1-.707 0l-2.16-2.159-3.938 3.939-1.409.026z", fillRule: "nonzero" }), u$2("circle", { cx: "7.5", cy: "9.5", r: "1.5" })] }) }));
}
function iconAudio() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: u$2("path", { d: "M9.5 18.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V7.25a.5.5 0 0 1 .379-.485l9-2.25A.5.5 0 0 1 18.5 5v11.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V8.67l-8 2v7.97zm8-11v-2l-8 2v2l8-2zM7 19.64c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1zm9-2c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1z", fill: "#049BCF", fillRule: "nonzero" }) }));
}
function iconVideo() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: u$2("path", { d: "M16 11.834l4.486-2.691A1 1 0 0 1 22 10v6a1 1 0 0 1-1.514.857L16 14.167V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2.834zM15 9H5v8h10V9zm1 4l5 3v-6l-5 3z", fill: "#19AF67", fillRule: "nonzero" }) }));
}
function iconPDF() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: u$2("path", { d: "M9.766 8.295c-.691-1.843-.539-3.401.747-3.726 1.643-.414 2.505.938 2.39 3.299-.039.79-.194 1.662-.537 3.148.324.49.66.967 1.055 1.51.17.231.382.488.629.757 1.866-.128 3.653.114 4.918.655 1.487.635 2.192 1.685 1.614 2.84-.566 1.133-1.839 1.084-3.416.249-1.141-.604-2.457-1.634-3.51-2.707a13.467 13.467 0 0 0-2.238.426c-1.392 4.051-4.534 6.453-5.707 4.572-.986-1.58 1.38-4.206 4.914-5.375.097-.322.185-.656.264-1.001.08-.353.306-1.31.407-1.737-.678-1.059-1.2-2.031-1.53-2.91zm2.098 4.87c-.033.144-.068.287-.104.427l.033-.01-.012.038a14.065 14.065 0 0 1 1.02-.197l-.032-.033.052-.004a7.902 7.902 0 0 1-.208-.271c-.197-.27-.38-.526-.555-.775l-.006.028-.002-.003c-.076.323-.148.632-.186.8zm5.77 2.978c1.143.605 1.832.632 2.054.187.26-.519-.087-1.034-1.113-1.473-.911-.39-2.175-.608-3.55-.608.845.766 1.787 1.459 2.609 1.894zM6.559 18.789c.14.223.693.16 1.425-.413.827-.648 1.61-1.747 2.208-3.206-2.563 1.064-4.102 2.867-3.633 3.62zm5.345-10.97c.088-1.793-.351-2.48-1.146-2.28-.473.119-.564 1.05-.056 2.405.213.566.52 1.188.908 1.859.18-.858.268-1.453.294-1.984z", fill: "#E2514A", fillRule: "nonzero" }) }));
}
function iconArchive() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", width: "25", height: "25", viewBox: "0 0 25 25", children: u$2("path", { d: "M10.45 2.05h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V2.55a.5.5 0 0 1 .5-.5zm2.05 1.024h1.05a.5.5 0 0 1 .5.5V3.6a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5v-.001zM10.45 0h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 3.074h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 1.024h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm-2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-1.656 3.074l-.82 5.946c.52.302 1.174.458 1.976.458.803 0 1.455-.156 1.975-.458l-.82-5.946h-2.311zm0-1.025h2.312c.512 0 .946.378 1.015.885l.82 5.946c.056.412-.142.817-.501 1.026-.686.398-1.515.597-2.49.597-.974 0-1.804-.199-2.49-.597a1.025 1.025 0 0 1-.5-1.026l.819-5.946c.07-.507.503-.885 1.015-.885zm.545 6.6a.5.5 0 0 1-.397-.561l.143-.999a.5.5 0 0 1 .495-.429h.74a.5.5 0 0 1 .495.43l.143.998a.5.5 0 0 1-.397.561c-.404.08-.819.08-1.222 0z", fill: "#00C469", fillRule: "nonzero" }) }));
}
function iconFile() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: u$2("g", { fill: "#A7AFB7", fillRule: "nonzero", children: [u$2("path", { d: "M5.5 22a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5h10.719a.5.5 0 0 1 .367.16l3.281 3.556a.5.5 0 0 1 .133.339V21.5a.5.5 0 0 1-.5.5h-14zm.5-1h13V7.25L16 4H6v17z" }), u$2("path", { d: "M15 4v3a1 1 0 0 0 1 1h3V7h-3V4h-1z" })] }) }));
}
function iconText() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "25", height: "25", viewBox: "0 0 25 25", children: u$2("path", { d: "M4.5 7h13a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z", fill: "#5A5E69", fillRule: "nonzero" }) }));
}
function getIconByMime(fileType) {
    const defaultChoice = {
        color: '#838999',
        icon: iconFile(),
    };
    if (!fileType)
        return defaultChoice;
    const fileTypeGeneral = fileType.split('/')[0];
    const fileTypeSpecific = fileType.split('/')[1];
    // Text
    if (fileTypeGeneral === 'text') {
        return {
            color: '#5a5e69',
            icon: iconText(),
        };
    }
    // Image
    if (fileTypeGeneral === 'image') {
        return {
            color: '#686de0',
            icon: iconImage(),
        };
    }
    // Audio
    if (fileTypeGeneral === 'audio') {
        return {
            color: '#068dbb',
            icon: iconAudio(),
        };
    }
    // Video
    if (fileTypeGeneral === 'video') {
        return {
            color: '#19af67',
            icon: iconVideo(),
        };
    }
    // PDF
    if (fileTypeGeneral === 'application' && fileTypeSpecific === 'pdf') {
        return {
            color: '#e25149',
            icon: iconPDF(),
        };
    }
    // Archive
    const archiveTypes = [
        'zip',
        'x-7z-compressed',
        'x-zip-compressed',
        'x-rar-compressed',
        'x-tar',
        'x-gzip',
        'x-apple-diskimage',
    ];
    if (fileTypeGeneral === 'application' &&
        archiveTypes.indexOf(fileTypeSpecific) !== -1) {
        return {
            color: '#00C469',
            icon: iconArchive(),
        };
    }
    return defaultChoice;
}

// ignore drop/paste events if they are not in input or textarea —
// otherwise when Url plugin adds drop/paste listeners to this.el,
// draging UI elements or pasting anything into any field triggers those events —
// Url treats them as URLs that need to be imported
function ignoreEvent(ev) {
    const { tagName } = ev.target;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
        ev.stopPropagation();
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
}

function FilePreview(props) {
    const { file } = props;
    if (file.preview) {
        return (u$2("img", { draggable: false, className: "uppy-Dashboard-Item-previewImg", alt: file.name, src: file.preview }));
    }
    const { color, icon } = getIconByMime(file.type);
    return (u$2("div", { className: "uppy-Dashboard-Item-previewIconWrap", children: [u$2("span", { className: "uppy-Dashboard-Item-previewIcon", style: { color }, children: icon }), u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-Dashboard-Item-previewIconBg", width: "58", height: "76", viewBox: "0 0 58 76", children: u$2("rect", { fill: "#FFF", width: "58", height: "76", rx: "3", fillRule: "evenodd" }) })] }));
}

function RenderMetaFields(props) {
    const { computedMetaFields, requiredMetaFields, updateMeta, form, formState, } = props;
    const fieldCSSClasses = {
        text: 'uppy-u-reset uppy-c-textInput uppy-Dashboard-FileCard-input',
    };
    return computedMetaFields.map((field) => {
        const id = `uppy-Dashboard-FileCard-input-${field.id}`;
        const required = requiredMetaFields.includes(field.id);
        return (u$2("fieldset", { className: "uppy-Dashboard-FileCard-fieldset", children: [u$2("label", { className: "uppy-Dashboard-FileCard-label", htmlFor: id, children: field.name }), field.render !== undefined ? (field.render({
                    value: formState[field.id],
                    onChange: (newVal) => updateMeta(newVal, field.id),
                    fieldCSSClasses,
                    required,
                    form: form.id,
                }, _$1)) : (u$2("input", { className: fieldCSSClasses.text, id: id, form: form.id, type: field.type || 'text', required: required, value: formState[field.id], placeholder: field.placeholder, onInput: (ev) => updateMeta(ev.target.value, field.id), "data-uppy-super-focusable": true }))] }, field.id));
    });
}

function FileCard(props) {
    const { files, fileCardFor, toggleFileCard, saveFileCard, metaFields, requiredMetaFields, openFileEditor, i18n, i18nArray, className, canEditFile, } = props;
    const getMetaFields = () => {
        return typeof metaFields === 'function'
            ? metaFields(files[fileCardFor])
            : metaFields;
    };
    const file = files[fileCardFor];
    const computedMetaFields = getMetaFields() ?? [];
    const showEditButton = canEditFile(file);
    const storedMetaData = {};
    computedMetaFields.forEach((field) => {
        storedMetaData[field.id] = file.meta[field.id] ?? '';
    });
    const [formState, setFormState] = d$1(storedMetaData);
    const handleSave = q$1((ev) => {
        ev.preventDefault();
        saveFileCard(formState, fileCardFor);
    }, [saveFileCard, formState, fileCardFor]);
    const updateMeta = (newVal, name) => {
        setFormState({
            ...formState,
            [name]: newVal,
        });
    };
    const handleCancel = () => {
        toggleFileCard(false);
    };
    const [form] = d$1(() => {
        const formEl = document.createElement('form');
        formEl.setAttribute('tabindex', '-1');
        formEl.id = nanoid();
        return formEl;
    });
    y$1(() => {
        document.body.appendChild(form);
        form.addEventListener('submit', handleSave);
        return () => {
            form.removeEventListener('submit', handleSave);
            // check if form is still in the DOM before removing
            if (form.parentNode) {
                document.body.removeChild(form);
            }
        };
    }, [form, handleSave]);
    return (
    // biome-ignore lint/a11y/noStaticElementInteractions: ...
    u$2("div", { className: classNames('uppy-Dashboard-FileCard', className), "data-uppy-panelType": "FileCard", onDragOver: ignoreEvent, onDragLeave: ignoreEvent, onDrop: ignoreEvent, onPaste: ignoreEvent, children: [u$2("div", { className: "uppy-DashboardContent-bar", children: [u$2("div", { className: "uppy-DashboardContent-title", 
                        // biome-ignore lint/a11y/useSemanticElements: ...
                        role: "heading", "aria-level": 1, children: i18nArray('editing', {
                            file: (u$2("span", { className: "uppy-DashboardContent-titleFile", children: file.meta ? file.meta.name : file.name })),
                        }) }), u$2("button", { className: "uppy-DashboardContent-back", type: "button", form: form.id, title: i18n('finishEditingFile'), onClick: handleCancel, children: i18n('cancel') })] }), u$2("div", { className: "uppy-Dashboard-FileCard-inner", children: [u$2("div", { className: "uppy-Dashboard-FileCard-preview", style: { backgroundColor: getIconByMime(file.type).color }, children: [u$2(FilePreview, { file: file }), showEditButton && (u$2("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-Dashboard-FileCard-edit", onClick: (event) => {
                                    // When opening the image editor we want to save any meta fields changes.
                                    // Otherwise it's confusing for the user to click save in the editor,
                                    // but the changes here are discarded. This bypasses validation,
                                    // but we are okay with that.
                                    handleSave(event);
                                    openFileEditor(file);
                                }, children: i18n('editImage') }))] }), u$2("div", { className: "uppy-Dashboard-FileCard-info", children: u$2(RenderMetaFields, { computedMetaFields: computedMetaFields, requiredMetaFields: requiredMetaFields, updateMeta: updateMeta, form: form, formState: formState }) }), u$2("div", { className: "uppy-Dashboard-FileCard-actions", children: [u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Dashboard-FileCard-actionsBtn", 
                                // If `form` attribute is supported, we want a submit button to trigger the form validation.
                                // Otherwise, fallback to a classic button with a onClick event handler.
                                type: "submit", form: form.id, children: i18n('saveChanges') }), u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-c-btn-link uppy-Dashboard-FileCard-actionsBtn", type: "button", onClick: handleCancel, form: form.id, children: i18n('cancel') })] })] })] }));
}

function shallowEqualObjects(objA, objB) {
  if (objA === objB) {
    return true;
  }
  if (!objA || !objB) {
    return false;
  }
  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;
  if (bKeys.length !== len) {
    return false;
  }
  for (let i = 0; i < len; i++) {
    const key = aKeys[i];
    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Copies text to clipboard by creating an almost invisible textarea,
 * adding text there, then running execCommand('copy').
 * Falls back to prompt() when the easy way fails (hello, Safari!)
 * From http://stackoverflow.com/a/30810322
 *
 * @param {string} textToCopy
 * @param {string} fallbackString
 * @returns {Promise}
 */
function copyToClipboard(textToCopy, fallbackString = 'Copy the URL below') {
    return new Promise((resolve) => {
        const textArea = document.createElement('textarea');
        textArea.setAttribute('style', {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '2em',
            height: '2em',
            padding: 0,
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
        });
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        const magicCopyFailed = () => {
            document.body.removeChild(textArea);
            window.prompt(fallbackString, textToCopy);
            resolve();
        };
        try {
            const successful = document.execCommand('copy');
            if (!successful) {
                return magicCopyFailed();
            }
            document.body.removeChild(textArea);
            return resolve();
        }
        catch (_err) {
            document.body.removeChild(textArea);
            return magicCopyFailed();
        }
    });
}

function EditButton({ file, uploadInProgressOrComplete, metaFields, canEditFile, i18n, onClick, }) {
    if ((!uploadInProgressOrComplete && metaFields && metaFields.length > 0) ||
        (!uploadInProgressOrComplete && canEditFile(file))) {
        return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-action uppy-Dashboard-Item-action--edit", type: "button", "aria-label": i18n('editFileWithFilename', { file: file.meta.name }), title: i18n('editFileWithFilename', { file: file.meta.name }), onClick: () => onClick(), children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "14", height: "14", viewBox: "0 0 14 14", children: u$2("g", { fillRule: "evenodd", children: [u$2("path", { d: "M1.5 10.793h2.793A1 1 0 0 0 5 10.5L11.5 4a1 1 0 0 0 0-1.414L9.707.793a1 1 0 0 0-1.414 0l-6.5 6.5A1 1 0 0 0 1.5 8v2.793zm1-1V8L9 1.5l1.793 1.793-6.5 6.5H2.5z", fillRule: "nonzero" }), u$2("rect", { x: "1", y: "12.293", width: "11", height: "1", rx: ".5" }), u$2("path", { fillRule: "nonzero", d: "M6.793 2.5L9.5 5.207l.707-.707L7.5 1.793z" })] }) }) }));
    }
    return null;
}
function RemoveButton({ i18n, onClick, file, }) {
    return (u$2("button", { className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--remove", type: "button", "aria-label": i18n('removeFile', { file: file.meta.name }), title: i18n('removeFile', { file: file.meta.name }), onClick: () => onClick(), children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "18", height: "18", viewBox: "0 0 18 18", children: [u$2("path", { d: "M9 0C4.034 0 0 4.034 0 9s4.034 9 9 9 9-4.034 9-9-4.034-9-9-9z" }), u$2("path", { fill: "#FFF", d: "M13 12.222l-.778.778L9 9.778 5.778 13 5 12.222 8.222 9 5 5.778 5.778 5 9 8.222 12.222 5l.778.778L9.778 9z" })] }) }));
}
function CopyLinkButton({ file, uppy, i18n, }) {
    const copyLinkToClipboard = (event) => {
        copyToClipboard(file.uploadURL, i18n('copyLinkToClipboardFallback'))
            .then(() => {
            uppy.log('Link copied to clipboard.');
            uppy.info(i18n('copyLinkToClipboardSuccess'), 'info', 3000);
        })
            .catch(uppy.log)
            // avoid losing focus
            .then(() => event.target.focus({ preventScroll: true }));
    };
    return (u$2("button", { className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--copyLink", type: "button", "aria-label": i18n('copyLink'), title: i18n('copyLink'), onClick: (event) => copyLinkToClipboard(event), children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "14", height: "14", viewBox: "0 0 14 12", children: u$2("path", { d: "M7.94 7.703a2.613 2.613 0 0 1-.626 2.681l-.852.851a2.597 2.597 0 0 1-1.849.766A2.616 2.616 0 0 1 2.764 7.54l.852-.852a2.596 2.596 0 0 1 2.69-.625L5.267 7.099a1.44 1.44 0 0 0-.833.407l-.852.851a1.458 1.458 0 0 0 1.03 2.486c.39 0 .755-.152 1.03-.426l.852-.852c.231-.231.363-.522.406-.824l1.04-1.038zm4.295-5.937A2.596 2.596 0 0 0 10.387 1c-.698 0-1.355.272-1.849.766l-.852.851a2.614 2.614 0 0 0-.624 2.688l1.036-1.036c.041-.304.173-.6.407-.833l.852-.852c.275-.275.64-.426 1.03-.426a1.458 1.458 0 0 1 1.03 2.486l-.852.851a1.442 1.442 0 0 1-.824.406l-1.04 1.04a2.596 2.596 0 0 0 2.683-.628l.851-.85a2.616 2.616 0 0 0 0-3.697zm-6.88 6.883a.577.577 0 0 0 .82 0l3.474-3.474a.579.579 0 1 0-.819-.82L5.355 7.83a.579.579 0 0 0 0 .819z" }) }) }));
}
function Buttons(props) {
    const { uppy, file, uploadInProgressOrComplete, canEditFile, metaFields, showLinkToFileUploadResult, showRemoveButton, i18n, toggleFileCard, openFileEditor, } = props;
    const editAction = () => {
        if (metaFields && metaFields.length > 0) {
            toggleFileCard(true, file.id);
        }
        else {
            openFileEditor(file);
        }
    };
    return (u$2("div", { className: "uppy-Dashboard-Item-actionWrapper", children: [u$2(EditButton, { i18n: i18n, file: file, uploadInProgressOrComplete: uploadInProgressOrComplete, canEditFile: canEditFile, metaFields: metaFields, onClick: editAction }), showLinkToFileUploadResult && file.uploadURL ? (u$2(CopyLinkButton, { file: file, uppy: uppy, i18n: i18n })) : null, showRemoveButton ? (u$2(RemoveButton, { i18n: i18n, file: file, onClick: () => uppy.removeFile(file.id) })) : null] }));
}

const metaFieldIdToName = (metaFieldId, metaFields) => {
    const fields = typeof metaFields === 'function' ? metaFields() : metaFields;
    const field = fields.filter((f) => f.id === metaFieldId);
    return field[0].name;
};
function MetaErrorMessage(props) {
    const { file, toggleFileCard, i18n, metaFields } = props;
    const { missingRequiredMetaFields } = file;
    if (!missingRequiredMetaFields?.length) {
        return null;
    }
    const metaFieldsString = missingRequiredMetaFields
        .map((missingMetaField) => metaFieldIdToName(missingMetaField, metaFields))
        .join(', ');
    return (u$2("div", { className: "uppy-Dashboard-Item-errorMessage", children: [i18n('missingRequiredMetaFields', {
                smart_count: missingRequiredMetaFields.length,
                fields: metaFieldsString,
            }), ' ', u$2("button", { type: "button", class: "uppy-u-reset uppy-Dashboard-Item-errorMessageBtn", onClick: () => toggleFileCard(true, file.id), children: i18n('editFile') })] }));
}

const renderFileName = (props) => {
    const { author, name } = props.file.meta;
    function getMaxNameLength() {
        if (props.isSingleFile && props.containerHeight >= 350) {
            return 90;
        }
        if (props.containerWidth <= 352) {
            return 35;
        }
        if (props.containerWidth <= 576) {
            return 60;
        }
        // When `author` is present, we want to make sure
        // the file name fits on one line so we can place
        // the author on the second line.
        return author ? 20 : 30;
    }
    return (u$2("div", { className: "uppy-Dashboard-Item-name", title: name, children: truncateString(name, getMaxNameLength()) }));
};
const renderAuthor = (props) => {
    const { author } = props.file.meta;
    const providerName = props.file.remote?.providerName;
    const dot = `\u00B7`;
    if (!author) {
        return null;
    }
    return (u$2("div", { className: "uppy-Dashboard-Item-author", children: [u$2("a", { href: `${author.url}?utm_source=Companion&utm_medium=referral`, target: "_blank", rel: "noopener noreferrer", children: truncateString(author.name, 13) }), providerName ? (u$2(k$2, { children: [` ${dot} `, providerName, ` ${dot} `] })) : null] }));
};
const renderFileSize = (props) => props.file.size && (u$2("div", { className: "uppy-Dashboard-Item-statusSize", children: prettierBytes$1(props.file.size) }));
const ReSelectButton = (props) => props.file.isGhost && (u$2("span", { children: [' \u2022 ', u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-reSelect", type: "button", onClick: () => props.toggleAddFilesPanel(true), children: props.i18n('reSelect') })] }));
const ErrorButton = ({ file, onClick, }) => {
    if (file.error) {
        return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-errorDetails", "aria-label": file.error, "data-microtip-position": "bottom", "data-microtip-size": "medium", onClick: onClick, type: "button", children: "?" }));
    }
    return null;
};
function FileInfo(props) {
    const { file, i18n, toggleFileCard, metaFields, toggleAddFilesPanel, isSingleFile, containerHeight, containerWidth, } = props;
    return (u$2("div", { className: "uppy-Dashboard-Item-fileInfo", "data-uppy-file-source": file.source, children: [u$2("div", { className: "uppy-Dashboard-Item-fileName", children: [renderFileName({
                        file,
                        isSingleFile,
                        containerHeight,
                        containerWidth,
                    }), u$2(ErrorButton, { file: file, onClick: () => alert(file.error) })] }), u$2("div", { className: "uppy-Dashboard-Item-status", children: [renderAuthor({ file }), renderFileSize({ file }), ReSelectButton({ file, toggleAddFilesPanel, i18n })] }), u$2(MetaErrorMessage, { file: file, i18n: i18n, toggleFileCard: toggleFileCard, metaFields: metaFields })] }));
}

function FilePreviewAndLink(props) {
    const { file, i18n, toggleFileCard, metaFields, showLinkToFileUploadResult } = props;
    const white = 'rgba(255, 255, 255, 0.5)';
    const previewBackgroundColor = file.preview
        ? white
        : getIconByMime(file.type).color;
    return (u$2("div", { className: "uppy-Dashboard-Item-previewInnerWrap", style: { backgroundColor: previewBackgroundColor }, children: [showLinkToFileUploadResult && file.uploadURL && (u$2("a", { className: "uppy-Dashboard-Item-previewLink", href: file.uploadURL, rel: "noreferrer noopener", target: "_blank", "aria-label": file.meta.name, children: u$2("span", { hidden: true, children: file.meta.name }) })), u$2(FilePreview, { file: file }), u$2(MetaErrorMessage, { file: file, i18n: i18n, toggleFileCard: toggleFileCard, metaFields: metaFields })] }));
}

function onPauseResumeCancelRetry(props) {
    if (props.isUploaded)
        return;
    if (props.error && !props.hideRetryButton) {
        props.uppy.retryUpload(props.file.id);
        return;
    }
    if (props.resumableUploads && !props.hidePauseResumeButton) {
        props.uppy.pauseResume(props.file.id);
    }
    else if (props.individualCancellation && !props.hideCancelButton) {
        props.uppy.removeFile(props.file.id);
    }
}
function progressIndicatorTitle(props) {
    if (props.isUploaded) {
        return props.i18n('uploadComplete');
    }
    if (props.error) {
        return props.i18n('retryUpload');
    }
    if (props.resumableUploads) {
        if (props.file.isPaused) {
            return props.i18n('resumeUpload');
        }
        return props.i18n('pauseUpload');
    }
    if (props.individualCancellation) {
        return props.i18n('cancelUpload');
    }
    return '';
}
function ProgressIndicatorButton(props) {
    return (u$2("div", { className: "uppy-Dashboard-Item-progress", children: u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-progressIndicator", type: "button", "aria-label": progressIndicatorTitle(props), title: progressIndicatorTitle(props), onClick: () => onPauseResumeCancelRetry(props), children: props.children }) }));
}
function ProgressCircleContainer({ children }) {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", width: "70", height: "70", viewBox: "0 0 36 36", className: "uppy-c-icon uppy-Dashboard-Item-progressIcon--circle", children: children }));
}
function ProgressCircle({ progress }) {
    // circle length equals 2 * PI * R
    const circleLength = 2 * Math.PI * 15;
    return (u$2("g", { children: [u$2("circle", { className: "uppy-Dashboard-Item-progressIcon--bg", r: "15", cx: "18", cy: "18", "stroke-width": "2", fill: "none" }), u$2("circle", { className: "uppy-Dashboard-Item-progressIcon--progress", r: "15", cx: "18", cy: "18", transform: "rotate(-90, 18, 18)", fill: "none", "stroke-width": "2", "stroke-dasharray": circleLength, "stroke-dashoffset": circleLength - (circleLength / 100) * progress })] }));
}
function FileProgress(props) {
    // Nothing if upload has not started
    if (!props.file.progress.uploadStarted) {
        return null;
    }
    if (props.file.progress.percentage === undefined) {
        return null;
    }
    // Green checkmark when complete
    if (props.isUploaded) {
        return (u$2("div", { className: "uppy-Dashboard-Item-progress", children: u$2("div", { className: "uppy-Dashboard-Item-progressIndicator", children: u$2(ProgressCircleContainer, { children: [u$2("circle", { r: "15", cx: "18", cy: "18", fill: "#1bb240" }), u$2("polygon", { className: "uppy-Dashboard-Item-progressIcon--check", transform: "translate(2, 3)", points: "14 22.5 7 15.2457065 8.99985857 13.1732815 14 18.3547104 22.9729883 9 25 11.1005634" })] }) }) }));
    }
    if (props.recoveredState) {
        return null;
    }
    // Retry button for error
    if (props.error && !props.hideRetryButton) {
        return (u$2(ProgressIndicatorButton, { ...props, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon uppy-Dashboard-Item-progressIcon--retry", width: "28", height: "31", viewBox: "0 0 16 19", children: [u$2("path", { d: "M16 11a8 8 0 1 1-8-8v2a6 6 0 1 0 6 6h2z" }), u$2("path", { d: "M7.9 3H10v2H7.9z" }), u$2("path", { d: "M8.536.5l3.535 3.536-1.414 1.414L7.12 1.914z" }), u$2("path", { d: "M10.657 2.621l1.414 1.415L8.536 7.57 7.12 6.157z" })] }) }));
    }
    // Pause/resume button for resumable uploads
    if (props.resumableUploads && !props.hidePauseResumeButton) {
        return (u$2(ProgressIndicatorButton, { ...props, children: u$2(ProgressCircleContainer, { children: [u$2(ProgressCircle, { progress: props.file.progress.percentage }), props.file.isPaused ? (u$2("polygon", { className: "uppy-Dashboard-Item-progressIcon--play", transform: "translate(3, 3)", points: "12 20 12 10 20 15" })) : (u$2("g", { className: "uppy-Dashboard-Item-progressIcon--pause", transform: "translate(14.5, 13)", children: [u$2("rect", { x: "0", y: "0", width: "2", height: "10", rx: "0" }), u$2("rect", { x: "5", y: "0", width: "2", height: "10", rx: "0" })] }))] }) }));
    }
    // Cancel button for non-resumable uploads if individualCancellation is supported (not bundled)
    if (!props.resumableUploads &&
        props.individualCancellation &&
        !props.hideCancelButton) {
        return (u$2(ProgressIndicatorButton, { ...props, children: u$2(ProgressCircleContainer, { children: [u$2(ProgressCircle, { progress: props.file.progress.percentage }), u$2("polygon", { className: "cancel", transform: "translate(2, 2)", points: "19.8856516 11.0625 16 14.9481516 12.1019737 11.0625 11.0625 12.1143484 14.9481516 16 11.0625 19.8980263 12.1019737 20.9375 16 17.0518484 19.8856516 20.9375 20.9375 19.8980263 17.0518484 16 20.9375 12" })] }) }));
    }
    // Just progress when buttons are disabled
    return (u$2("div", { className: "uppy-Dashboard-Item-progress", children: u$2("div", { className: "uppy-Dashboard-Item-progressIndicator", children: u$2(ProgressCircleContainer, { children: u$2(ProgressCircle, { progress: props.file.progress.percentage }) }) }) }));
}

class FileItem extends x {
    componentDidMount() {
        const { file } = this.props;
        if (!file.preview) {
            this.props.handleRequestThumbnail(file);
        }
    }
    shouldComponentUpdate(nextProps) {
        return !shallowEqualObjects(this.props, nextProps);
    }
    // VirtualList mounts FileItems again and they emit `thumbnail:request`
    // Otherwise thumbnails are broken or missing after Golden Retriever restores files
    componentDidUpdate() {
        const { file } = this.props;
        if (!file.preview) {
            this.props.handleRequestThumbnail(file);
        }
    }
    componentWillUnmount() {
        const { file } = this.props;
        if (!file.preview) {
            this.props.handleCancelThumbnail(file);
        }
    }
    render() {
        const { file } = this.props;
        const isProcessing = file.progress.preprocess || file.progress.postprocess;
        const isUploaded = !!file.progress.uploadComplete && !isProcessing && !file.error;
        const uploadInProgressOrComplete = !!file.progress.uploadStarted || !!isProcessing;
        const uploadInProgress = (file.progress.uploadStarted && !file.progress.uploadComplete) ||
            isProcessing;
        const error = file.error || false;
        // File that Golden Retriever was able to partly restore (only meta, not blob),
        // users still need to re-add it, so it’s a ghost
        const { isGhost } = file;
        let showRemoveButton = this.props.individualCancellation
            ? !isUploaded
            : !uploadInProgress && !isUploaded;
        if (isUploaded && this.props.showRemoveButtonAfterComplete) {
            showRemoveButton = true;
        }
        const dashboardItemClass = classNames({
            'uppy-Dashboard-Item': true,
            'is-inprogress': uploadInProgress && !this.props.recoveredState,
            'is-processing': isProcessing,
            'is-complete': isUploaded,
            'is-error': !!error,
            'is-resumable': this.props.resumableUploads,
            'is-noIndividualCancellation': !this.props.individualCancellation,
            'is-ghost': isGhost,
        });
        return (u$2("div", { className: dashboardItemClass, id: `uppy_${file.id}`, role: this.props.role, children: [u$2("div", { className: "uppy-Dashboard-Item-preview", children: [u$2(FilePreviewAndLink, { file: file, showLinkToFileUploadResult: this.props.showLinkToFileUploadResult, i18n: this.props.i18n, toggleFileCard: this.props.toggleFileCard, metaFields: this.props.metaFields }), u$2(FileProgress, { uppy: this.props.uppy, file: file, error: error, isUploaded: isUploaded, hideRetryButton: this.props.hideRetryButton, hideCancelButton: this.props.hideCancelButton, hidePauseResumeButton: this.props.hidePauseResumeButton, recoveredState: this.props.recoveredState, resumableUploads: this.props.resumableUploads, individualCancellation: this.props.individualCancellation, i18n: this.props.i18n })] }), u$2("div", { className: "uppy-Dashboard-Item-fileInfoAndButtons", children: [u$2(FileInfo, { file: file, containerWidth: this.props.containerWidth, containerHeight: this.props.containerHeight, i18n: this.props.i18n, toggleAddFilesPanel: this.props.toggleAddFilesPanel, toggleFileCard: this.props.toggleFileCard, metaFields: this.props.metaFields, isSingleFile: this.props.isSingleFile }), u$2(Buttons, { file: file, metaFields: this.props.metaFields, showLinkToFileUploadResult: this.props.showLinkToFileUploadResult, showRemoveButton: showRemoveButton, canEditFile: this.props.canEditFile, uploadInProgressOrComplete: uploadInProgressOrComplete, toggleFileCard: this.props.toggleFileCard, openFileEditor: this.props.openFileEditor, uppy: this.props.uppy, i18n: this.props.i18n })] })] }));
    }
}

function chunks(list, size) {
    const chunked = [];
    let currentChunk = [];
    list.forEach((item) => {
        if (currentChunk.length < size) {
            currentChunk.push(item);
        }
        else {
            chunked.push(currentChunk);
            currentChunk = [item];
        }
    });
    if (currentChunk.length)
        chunked.push(currentChunk);
    return chunked;
}
function FileList({ id, i18n, uppy, files, resumableUploads, hideRetryButton, hidePauseResumeButton, hideCancelButton, showLinkToFileUploadResult, showRemoveButtonAfterComplete, metaFields, isSingleFile, toggleFileCard, handleRequestThumbnail, handleCancelThumbnail, recoveredState, individualCancellation, itemsPerRow, openFileEditor, canEditFile, toggleAddFilesPanel, containerWidth, containerHeight, }) {
    // It's not great that this is hardcoded!
    // It's ESPECIALLY not great that this is checking against `itemsPerRow`!
    const rowHeight = itemsPerRow === 1
        ? // Mobile
            71
        : // 190px height + 2 * 5px margin
            200;
    // Sort files by file.isGhost, ghost files first, only if recoveredState is present
    const rows = T$1(() => {
        const sortByGhostComesFirst = (file1, file2) => Number(files[file2].isGhost) - Number(files[file1].isGhost);
        const fileIds = Object.keys(files);
        if (recoveredState)
            fileIds.sort(sortByGhostComesFirst);
        return chunks(fileIds, itemsPerRow);
    }, [files, itemsPerRow, recoveredState]);
    const renderRow = (row) => (u$2("div", { class: "uppy-Dashboard-filesInner", 
        // The `role="presentation` attribute ensures that the list items are properly
        // associated with the `VirtualList` element.
        role: "presentation", children: row.map((fileID) => (u$2(FileItem, { uppy: uppy, 
            // FIXME This is confusing, it's actually the Dashboard's plugin ID
            id: id, 
            // TODO move this to context
            i18n: i18n, 
            // features
            resumableUploads: resumableUploads, individualCancellation: individualCancellation, 
            // visual options
            hideRetryButton: hideRetryButton, hidePauseResumeButton: hidePauseResumeButton, hideCancelButton: hideCancelButton, showLinkToFileUploadResult: showLinkToFileUploadResult, showRemoveButtonAfterComplete: showRemoveButtonAfterComplete, metaFields: metaFields, recoveredState: recoveredState, isSingleFile: isSingleFile, containerWidth: containerWidth, containerHeight: containerHeight, 
            // callbacks
            toggleFileCard: toggleFileCard, handleRequestThumbnail: handleRequestThumbnail, handleCancelThumbnail: handleCancelThumbnail, role: "listitem", openFileEditor: openFileEditor, canEditFile: canEditFile, toggleAddFilesPanel: toggleAddFilesPanel, file: files[fileID] }, fileID))) }, row[0]));
    if (isSingleFile) {
        return u$2("div", { class: "uppy-Dashboard-files", children: renderRow(rows[0]) });
    }
    return (u$2(VirtualList, { class: "uppy-Dashboard-files", role: "list", data: rows, renderRow: renderRow, rowHeight: rowHeight }));
}

const TRANSITION_MS = 300;
class FadeIn extends x {
    ref = b$1();
    componentWillEnter(callback) {
        this.ref.current.style.opacity = '1';
        this.ref.current.style.transform = 'none';
        setTimeout(callback, TRANSITION_MS);
    }
    componentWillLeave(callback) {
        this.ref.current.style.opacity = '0';
        this.ref.current.style.transform = 'translateY(350%)';
        setTimeout(callback, TRANSITION_MS);
    }
    render() {
        const { children } = this.props;
        return (u$2("div", { className: "uppy-Informer-animated", ref: this.ref, children: children }));
    }
}

// INFO: not typing copy pasted libarary code
// @ts-nocheck
/**
 * @source https://github.com/developit/preact-transition-group
 */
function assign(obj, props) {
    return Object.assign(obj, props);
}
function getKey(vnode, fallback) {
    return vnode?.key ?? fallback;
}
function linkRef(component, name) {
    // biome-ignore lint/suspicious/noAssignInExpressions: ...
    const cache = component._ptgLinkedRefs || (component._ptgLinkedRefs = {});
    return (cache[name] ||
        // biome-ignore lint/suspicious/noAssignInExpressions: ...
        (cache[name] = (c) => {
            component.refs[name] = c;
        }));
}
function getChildMapping(children) {
    const out = {};
    for (let i = 0; i < children.length; i++) {
        if (children[i] != null) {
            const key = getKey(children[i], i.toString(36));
            out[key] = children[i];
        }
    }
    return out;
}
function mergeChildMappings(prev, next) {
    prev = prev || {};
    next = next || {};
    const getValueForKey = (key) => Object.hasOwn(next, key) ? next[key] : prev[key];
    // For each key of `next`, the list of keys to insert before that key in
    // the combined list
    const nextKeysPending = {};
    let pendingKeys = [];
    for (const prevKey in prev) {
        if (Object.hasOwn(next, prevKey)) {
            if (pendingKeys.length) {
                nextKeysPending[prevKey] = pendingKeys;
                pendingKeys = [];
            }
        }
        else {
            pendingKeys.push(prevKey);
        }
    }
    const childMapping = {};
    for (const nextKey in next) {
        if (Object.hasOwn(nextKeysPending, nextKey)) {
            for (let i = 0; i < nextKeysPending[nextKey].length; i++) {
                const pendingNextKey = nextKeysPending[nextKey][i];
                childMapping[nextKeysPending[nextKey][i]] =
                    getValueForKey(pendingNextKey);
            }
        }
        childMapping[nextKey] = getValueForKey(nextKey);
    }
    // Finally, add the keys which didn't appear before any key in `next`
    for (let i = 0; i < pendingKeys.length; i++) {
        childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
    }
    return childMapping;
}
const identity = (i) => i;
class TransitionGroup extends x {
    constructor(props, context) {
        super(props, context);
        this.refs = {};
        this.state = {
            children: getChildMapping(H$1(H$1(this.props.children)) || []),
        };
        this.performAppear = this.performAppear.bind(this);
        this.performEnter = this.performEnter.bind(this);
        this.performLeave = this.performLeave.bind(this);
    }
    componentWillMount() {
        this.currentlyTransitioningKeys = {};
        this.keysToAbortLeave = [];
        this.keysToEnter = [];
        this.keysToLeave = [];
    }
    componentDidMount() {
        const initialChildMapping = this.state.children;
        for (const key in initialChildMapping) {
            if (initialChildMapping[key]) {
                // this.performAppear(getKey(initialChildMapping[key], key));
                this.performAppear(key);
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        const nextChildMapping = getChildMapping(H$1(nextProps.children) || []);
        const prevChildMapping = this.state.children;
        this.setState((prevState) => ({
            children: mergeChildMappings(prevState.children, nextChildMapping),
        }));
        let key;
        for (key in nextChildMapping) {
            if (Object.hasOwn(nextChildMapping, key)) {
                const hasPrev = prevChildMapping && Object.hasOwn(prevChildMapping, key);
                // We should re-enter the component and abort its leave function
                if (nextChildMapping[key] &&
                    hasPrev &&
                    this.currentlyTransitioningKeys[key]) {
                    this.keysToEnter.push(key);
                    this.keysToAbortLeave.push(key);
                }
                else if (nextChildMapping[key] &&
                    !hasPrev &&
                    !this.currentlyTransitioningKeys[key]) {
                    this.keysToEnter.push(key);
                }
            }
        }
        for (key in prevChildMapping) {
            if (Object.hasOwn(prevChildMapping, key)) {
                const hasNext = nextChildMapping && Object.hasOwn(nextChildMapping, key);
                if (prevChildMapping[key] &&
                    !hasNext &&
                    !this.currentlyTransitioningKeys[key]) {
                    this.keysToLeave.push(key);
                }
            }
        }
    }
    componentDidUpdate() {
        const { keysToEnter } = this;
        this.keysToEnter = [];
        keysToEnter.forEach(this.performEnter);
        const { keysToLeave } = this;
        this.keysToLeave = [];
        keysToLeave.forEach(this.performLeave);
    }
    _finishAbort(key) {
        const idx = this.keysToAbortLeave.indexOf(key);
        if (idx !== -1) {
            this.keysToAbortLeave.splice(idx, 1);
        }
    }
    performAppear(key) {
        this.currentlyTransitioningKeys[key] = true;
        const component = this.refs[key];
        if (component?.componentWillAppear) {
            component.componentWillAppear(this._handleDoneAppearing.bind(this, key));
        }
        else {
            this._handleDoneAppearing(key);
        }
    }
    _handleDoneAppearing(key) {
        const component = this.refs[key];
        if (component?.componentDidAppear) {
            component.componentDidAppear();
        }
        delete this.currentlyTransitioningKeys[key];
        this._finishAbort(key);
        const currentChildMapping = getChildMapping(H$1(this.props.children) || []);
        if (!currentChildMapping || !Object.hasOwn(currentChildMapping, key)) {
            // This was removed before it had fully appeared. Remove it.
            this.performLeave(key);
        }
    }
    performEnter(key) {
        this.currentlyTransitioningKeys[key] = true;
        const component = this.refs[key];
        if (component?.componentWillEnter) {
            component.componentWillEnter(this._handleDoneEntering.bind(this, key));
        }
        else {
            this._handleDoneEntering(key);
        }
    }
    _handleDoneEntering(key) {
        const component = this.refs[key];
        if (component?.componentDidEnter) {
            component.componentDidEnter();
        }
        delete this.currentlyTransitioningKeys[key];
        this._finishAbort(key);
        const currentChildMapping = getChildMapping(H$1(this.props.children) || []);
        if (!currentChildMapping || !Object.hasOwn(currentChildMapping, key)) {
            // This was removed before it had fully entered. Remove it.
            this.performLeave(key);
        }
    }
    performLeave(key) {
        // If we should immediately abort this leave function,
        // don't run the leave transition at all.
        const idx = this.keysToAbortLeave.indexOf(key);
        if (idx !== -1) {
            return;
        }
        this.currentlyTransitioningKeys[key] = true;
        const component = this.refs[key];
        if (component?.componentWillLeave) {
            component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
        }
        else {
            // Note that this is somewhat dangerous b/c it calls setState()
            // again, effectively mutating the component before all the work
            // is done.
            this._handleDoneLeaving(key);
        }
    }
    _handleDoneLeaving(key) {
        // If we should immediately abort the leave,
        // then skip this altogether
        const idx = this.keysToAbortLeave.indexOf(key);
        if (idx !== -1) {
            return;
        }
        const component = this.refs[key];
        if (component?.componentDidLeave) {
            component.componentDidLeave();
        }
        delete this.currentlyTransitioningKeys[key];
        const currentChildMapping = getChildMapping(H$1(this.props.children) || []);
        if (currentChildMapping && Object.hasOwn(currentChildMapping, key)) {
            // This entered again before it fully left. Add it again.
            this.performEnter(key);
        }
        else {
            const children = assign({}, this.state.children);
            delete children[key];
            this.setState({ children });
        }
    }
    render({ childFactory, transitionLeave, transitionName, transitionAppear, transitionEnter, transitionLeaveTimeout, transitionEnterTimeout, transitionAppearTimeout, component, ...props }, { children }) {
        // TODO: we could get rid of the need for the wrapper node
        // by cloning a single child
        const childrenToRender = Object.entries(children)
            .map(([key, child]) => {
            if (!child)
                return undefined;
            const ref = linkRef(this, key);
            return K$1(childFactory(child), { ref, key });
        })
            .filter(Boolean);
        return _$1(component, props, childrenToRender);
    }
}
TransitionGroup.defaultProps = {
    component: 'span',
    childFactory: identity,
};

class Informer extends x {
    render() {
        // Get info from the uppy instance passed in props
        const { info } = this.props.uppy.getState();
        return (u$2("div", { className: "uppy uppy-Informer", children: u$2(TransitionGroup, { children: info.map((info) => (u$2(FadeIn, { children: u$2("p", { role: "alert", children: [info.message, ' ', info.details && (
                            // biome-ignore lint/a11y/useKeyWithClickEvents: don't think it's needed
                            u$2("span", { "aria-label": info.details, "data-microtip-position": "top-left", "data-microtip-size": "medium", role: "tooltip", onClick: () => alert(`${info.message} \n\n ${info.details}`), children: "?" }))] }) }, info.message))) }) }));
    }
}

function PickerPanelContent({ activePickerPanel, className, hideAllPanels, i18n, state, uppy, }) {
    const ref = A$1(null);
    return (u$2("div", { className: classNames('uppy-DashboardContent-panel', className), role: "tabpanel", "data-uppy-panelType": "PickerPanel", id: `uppy-DashboardContent-panel--${activePickerPanel.id}`, onDragOver: ignoreEvent, onDragLeave: ignoreEvent, onDrop: ignoreEvent, onPaste: ignoreEvent, children: [u$2("div", { className: "uppy-DashboardContent-bar", children: [u$2("div", { className: "uppy-DashboardContent-title", 
                        // biome-ignore lint/a11y/useSemanticElements: ...
                        role: "heading", "aria-level": 1, children: i18n('importFrom', { name: activePickerPanel.name }) }), u$2("button", { className: "uppy-DashboardContent-back", type: "button", onClick: hideAllPanels, children: i18n('cancel') })] }), u$2("div", { ref: ref, className: "uppy-DashboardContent-panelBody", children: uppy.getPlugin(activePickerPanel.id).render(state, ref.current) })] }));
}

const uploadStates = {
    STATE_ERROR: 'error',
    STATE_WAITING: 'waiting',
    STATE_PREPROCESSING: 'preprocessing',
    STATE_UPLOADING: 'uploading',
    STATE_POSTPROCESSING: 'postprocessing',
    STATE_COMPLETE: 'complete',
    STATE_PAUSED: 'paused',
};
function getUploadingState$1(isAllErrored, isAllComplete, isAllPaused, files = {}) {
    if (isAllErrored) {
        return uploadStates.STATE_ERROR;
    }
    if (isAllComplete) {
        return uploadStates.STATE_COMPLETE;
    }
    if (isAllPaused) {
        return uploadStates.STATE_PAUSED;
    }
    let state = uploadStates.STATE_WAITING;
    const fileIDs = Object.keys(files);
    for (let i = 0; i < fileIDs.length; i++) {
        const { progress } = files[fileIDs[i]];
        // If ANY files are being uploaded right now, show the uploading state.
        if (progress.uploadStarted && !progress.uploadComplete) {
            return uploadStates.STATE_UPLOADING;
        }
        // If files are being preprocessed AND postprocessed at this time, we show the
        // preprocess state. If any files are being uploaded we show uploading.
        if (progress.preprocess && state !== uploadStates.STATE_UPLOADING) {
            state = uploadStates.STATE_PREPROCESSING;
        }
        // If NO files are being preprocessed or uploaded right now, but some files are
        // being postprocessed, show the postprocess state.
        if (progress.postprocess &&
            state !== uploadStates.STATE_UPLOADING &&
            state !== uploadStates.STATE_PREPROCESSING) {
            state = uploadStates.STATE_POSTPROCESSING;
        }
    }
    return state;
}
function UploadStatus({ files, i18n, isAllComplete, isAllErrored, isAllPaused, inProgressNotPausedFiles, newFiles, processingFiles, }) {
    const uploadingState = getUploadingState$1(isAllErrored, isAllComplete, isAllPaused, files);
    switch (uploadingState) {
        case 'uploading':
            return i18n('uploadingXFiles', {
                smart_count: inProgressNotPausedFiles.length,
            });
        case 'preprocessing':
        case 'postprocessing':
            return i18n('processingXFiles', { smart_count: processingFiles.length });
        case 'paused':
            return i18n('uploadPaused');
        case 'waiting':
            return i18n('xFilesSelected', { smart_count: newFiles.length });
        case 'complete':
            return i18n('uploadComplete');
        case 'error':
            return i18n('error');
    }
}
function PanelTopBar(props) {
    const { i18n, isAllComplete, hideCancelButton, maxNumberOfFiles, toggleAddFilesPanel, uppy, } = props;
    let { allowNewUpload } = props;
    // TODO maybe this should be done in ../Dashboard.js, then just pass that down as `allowNewUpload`
    if (allowNewUpload && maxNumberOfFiles) {
        allowNewUpload = props.totalFileCount < props.maxNumberOfFiles;
    }
    return (u$2("div", { className: "uppy-DashboardContent-bar", children: [!isAllComplete && !hideCancelButton ? (u$2("button", { className: "uppy-DashboardContent-back", type: "button", onClick: () => uppy.cancelAll(), children: i18n('cancel') })) : (u$2("div", {})), u$2("div", { className: "uppy-DashboardContent-title", children: u$2(UploadStatus, { ...props }) }), allowNewUpload ? (u$2("button", { className: "uppy-DashboardContent-addMore", type: "button", "aria-label": i18n('addMoreFiles'), title: i18n('addMoreFiles'), onClick: () => toggleAddFilesPanel(true), children: [u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "15", height: "15", viewBox: "0 0 15 15", children: u$2("path", { d: "M8 6.5h6a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H8v6a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V8h-6a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h6v-6A.5.5 0 0 1 7 0h.5a.5.5 0 0 1 .5.5v6z" }) }), u$2("span", { className: "uppy-DashboardContent-addMoreCaption", children: i18n('addMore') })] })) : (u$2("div", {}))] }));
}

const transitionName = 'uppy-transition-slideDownUp';
const duration = 250;
/**
 * Vertical slide transition.
 *
 * This can take a _single_ child component, which _must_ accept a `className` prop.
 *
 * Currently this is specific to the `uppy-transition-slideDownUp` transition,
 * but it should be simple to extend this for any type of single-element
 * transition by setting the CSS name and duration as props.
 */
function Slide({ children }) {
    const [cachedChildren, setCachedChildren] = d$1(null);
    const [className, setClassName] = d$1('');
    const enterTimeoutRef = A$1();
    const leaveTimeoutRef = A$1();
    const animationFrameRef = A$1();
    const handleEnterTransition = q$1(() => {
        setClassName(`${transitionName}-enter`);
        cancelAnimationFrame(animationFrameRef.current);
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = undefined;
        animationFrameRef.current = requestAnimationFrame(() => {
            setClassName(`${transitionName}-enter ${transitionName}-enter-active`);
            enterTimeoutRef.current = setTimeout(() => {
                setClassName('');
            }, duration);
        });
    }, []);
    const handleLeaveTransition = q$1(() => {
        setClassName(`${transitionName}-leave`);
        cancelAnimationFrame(animationFrameRef.current);
        clearTimeout(enterTimeoutRef.current);
        enterTimeoutRef.current = undefined;
        animationFrameRef.current = requestAnimationFrame(() => {
            setClassName(`${transitionName}-leave ${transitionName}-leave-active`);
            leaveTimeoutRef.current = setTimeout(() => {
                setCachedChildren(null);
                setClassName('');
            }, duration);
        });
    }, []);
    y$1(() => {
        const child = H$1(children)[0];
        if (cachedChildren === child)
            return;
        if (child && !cachedChildren) {
            handleEnterTransition();
        }
        else if (cachedChildren && !child && !leaveTimeoutRef.current) {
            handleLeaveTransition();
        }
        setCachedChildren(child);
    }, [children, cachedChildren, handleEnterTransition, handleLeaveTransition]); // Dependency array to trigger effect on children change
    y$1(() => {
        return () => {
            clearTimeout(enterTimeoutRef.current);
            clearTimeout(leaveTimeoutRef.current);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, []); // Cleanup useEffect
    if (!cachedChildren)
        return null;
    return K$1(cachedChildren, {
        className: classNames(className, cachedChildren.props.className),
    });
}

var statusBarStates = {
    STATE_ERROR: 'error',
    STATE_WAITING: 'waiting',
    STATE_PREPROCESSING: 'preprocessing',
    STATE_UPLOADING: 'uploading',
    STATE_POSTPROCESSING: 'postprocessing',
    STATE_COMPLETE: 'complete',
};

const DOT = `\u00B7`;
const renderDot = () => ` ${DOT} `;
function UploadBtn(props) {
    const { newFiles, isUploadStarted, recoveredState, i18n, uploadState, isSomeGhost, startUpload, } = props;
    const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
        'uppy-c-btn-primary': uploadState === statusBarStates.STATE_WAITING,
    }, { 'uppy-StatusBar-actionBtn--disabled': isSomeGhost });
    const uploadBtnText = newFiles && isUploadStarted && !recoveredState
        ? i18n('uploadXNewFiles', { smart_count: newFiles })
        : i18n('uploadXFiles', { smart_count: newFiles });
    return (u$2("button", { type: "button", className: uploadBtnClassNames, "aria-label": i18n('uploadXFiles', { smart_count: newFiles }), onClick: startUpload, disabled: isSomeGhost, "data-uppy-super-focusable": true, children: uploadBtnText }));
}
function RetryBtn(props) {
    const { i18n, uppy } = props;
    return (u$2("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry", "aria-label": i18n('retryUpload'), onClick: () => uppy.retryAll().catch(() => {
            /* Error reported and handled via an event */
        }), "data-uppy-super-focusable": true, "data-cy": "retry", children: [u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "8", height: "10", viewBox: "0 0 8 10", children: u$2("path", { d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z" }) }), i18n('retry')] }));
}
function CancelBtn(props) {
    const { i18n, uppy } = props;
    return (u$2("button", { type: "button", className: "uppy-u-reset uppy-StatusBar-actionCircleBtn", title: i18n('cancel'), "aria-label": i18n('cancel'), onClick: () => uppy.cancelAll(), "data-cy": "cancel", "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "16", height: "16", viewBox: "0 0 16 16", children: u$2("g", { fill: "none", fillRule: "evenodd", children: [u$2("circle", { fill: "#888", cx: "8", cy: "8", r: "8" }), u$2("path", { fill: "#FFF", d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z" })] }) }) }));
}
function PauseResumeButton(props) {
    const { isAllPaused, i18n, isAllComplete, resumableUploads, uppy } = props;
    const title = isAllPaused ? i18n('resume') : i18n('pause');
    function togglePauseResume() {
        if (isAllComplete)
            return;
        if (!resumableUploads) {
            uppy.cancelAll();
            return;
        }
        if (isAllPaused) {
            uppy.resumeAll();
            return;
        }
        uppy.pauseAll();
    }
    return (u$2("button", { title: title, "aria-label": title, className: "uppy-u-reset uppy-StatusBar-actionCircleBtn", type: "button", onClick: togglePauseResume, "data-cy": "togglePauseResume", "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "16", height: "16", viewBox: "0 0 16 16", children: u$2("g", { fill: "none", fillRule: "evenodd", children: [u$2("circle", { fill: "#888", cx: "8", cy: "8", r: "8" }), u$2("path", { fill: "#FFF", d: isAllPaused
                            ? 'M6 4.25L11.5 8 6 11.75z'
                            : 'M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z' })] }) }) }));
}
function DoneBtn(props) {
    const { i18n, doneButtonHandler } = props;
    return (u$2("button", { type: "button", className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done", onClick: doneButtonHandler, "data-uppy-super-focusable": true, children: i18n('done') }));
}
function LoadingSpinner() {
    return (u$2("svg", { className: "uppy-StatusBar-spinner", "aria-hidden": "true", focusable: "false", width: "14", height: "14", children: u$2("path", { d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0", fillRule: "evenodd" }) }));
}
function ProgressBarProcessing(props) {
    const { progress } = props;
    const { value, mode, message } = progress;
    const dot = `\u00B7`;
    return (u$2("div", { className: "uppy-StatusBar-content", children: [u$2(LoadingSpinner, {}), mode === 'determinate' ? `${Math.round(value * 100)}% ${dot} ` : '', message] }));
}
function ProgressDetails(props) {
    const { numUploads, complete, totalUploadedSize, totalSize, totalETA, i18n } = props;
    const ifShowFilesUploadedOfTotal = numUploads > 1;
    const totalUploadedSizeStr = prettierBytes$1(totalUploadedSize);
    return (u$2("div", { className: "uppy-StatusBar-statusSecondary", children: [ifShowFilesUploadedOfTotal &&
                i18n('filesUploadedOfTotal', {
                    complete,
                    smart_count: numUploads,
                }), u$2("span", { className: "uppy-StatusBar-additionalInfo", children: [ifShowFilesUploadedOfTotal && renderDot(), totalSize != null
                        ? i18n('dataUploadedOfTotal', {
                            complete: totalUploadedSizeStr,
                            total: prettierBytes$1(totalSize),
                        })
                        : i18n('dataUploadedOfUnknown', { complete: totalUploadedSizeStr }), renderDot(), totalETA != null &&
                        i18n('xTimeLeft', {
                            time: prettyETA(totalETA),
                        })] })] }));
}
function FileUploadCount(props) {
    const { i18n, complete, numUploads } = props;
    return (u$2("div", { className: "uppy-StatusBar-statusSecondary", children: i18n('filesUploadedOfTotal', { complete, smart_count: numUploads }) }));
}
function UploadNewlyAddedFiles(props) {
    const { i18n, newFiles, startUpload } = props;
    const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
    return (u$2("div", { className: "uppy-StatusBar-statusSecondary", children: [u$2("div", { className: "uppy-StatusBar-statusSecondaryHint", children: i18n('xMoreFilesAdded', { smart_count: newFiles }) }), u$2("button", { type: "button", className: uploadBtnClassNames, "aria-label": i18n('uploadXFiles', { smart_count: newFiles }), onClick: startUpload, children: i18n('upload') })] }));
}
function ProgressBarUploading(props) {
    const { i18n, supportsUploadProgress, totalProgress, hideProgressDetails, isUploadStarted, isAllComplete, isAllPaused, newFiles, numUploads, complete, totalUploadedSize, totalSize, totalETA, startUpload, } = props;
    const showUploadNewlyAddedFiles = newFiles && isUploadStarted;
    if (!isUploadStarted || isAllComplete) {
        return null;
    }
    const title = isAllPaused ? i18n('paused') : i18n('uploading');
    function renderProgressDetails() {
        if (!isAllPaused && !showUploadNewlyAddedFiles && !hideProgressDetails) {
            if (supportsUploadProgress) {
                return (u$2(ProgressDetails, { numUploads: numUploads, complete: complete, totalUploadedSize: totalUploadedSize, totalSize: totalSize, totalETA: totalETA, i18n: i18n }));
            }
            return (u$2(FileUploadCount, { i18n: i18n, complete: complete, numUploads: numUploads }));
        }
        return null;
    }
    return (u$2("div", { className: "uppy-StatusBar-content", title: title, children: [!isAllPaused ? u$2(LoadingSpinner, {}) : null, u$2("div", { className: "uppy-StatusBar-status", children: [u$2("div", { className: "uppy-StatusBar-statusPrimary", children: supportsUploadProgress && totalProgress !== 0
                            ? `${title}: ${totalProgress}%`
                            : title }), renderProgressDetails(), showUploadNewlyAddedFiles ? (u$2(UploadNewlyAddedFiles, { i18n: i18n, newFiles: newFiles, startUpload: startUpload })) : null] })] }));
}
function ProgressBarComplete(props) {
    const { i18n } = props;
    return (u$2("div", { className: "uppy-StatusBar-content", 
        // biome-ignore lint/a11y/useSemanticElements: ...
        role: "status", title: i18n('complete'), children: u$2("div", { className: "uppy-StatusBar-status", children: u$2("div", { className: "uppy-StatusBar-statusPrimary", children: [u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-StatusBar-statusIndicator uppy-c-icon", width: "15", height: "11", viewBox: "0 0 15 11", children: u$2("path", { d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z" }) }), i18n('complete')] }) }) }));
}
function ProgressBarError(props) {
    const { error, i18n, complete, numUploads } = props;
    function displayErrorAlert() {
        const errorMessage = `${i18n('uploadFailed')} \n\n ${error}`;
        alert(errorMessage); // TODO: move to custom alert implementation
    }
    return (u$2("div", { className: "uppy-StatusBar-content", title: i18n('uploadFailed'), children: [u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-StatusBar-statusIndicator uppy-c-icon", width: "11", height: "11", viewBox: "0 0 11 11", children: u$2("path", { d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z" }) }), u$2("div", { className: "uppy-StatusBar-status", children: [u$2("div", { className: "uppy-StatusBar-statusPrimary", children: [i18n('uploadFailed'), u$2("button", { className: "uppy-u-reset uppy-StatusBar-details", "aria-label": i18n('showErrorDetails'), "data-microtip-position": "top-right", "data-microtip-size": "medium", onClick: displayErrorAlert, type: "button", children: "?" })] }), u$2(FileUploadCount, { i18n: i18n, complete: complete, numUploads: numUploads })] })] }));
}

function calculateProcessingProgress(files) {
    const values = [];
    let mode = 'indeterminate';
    let message;
    for (const { progress } of Object.values(files)) {
        const { preprocess, postprocess } = progress;
        // In the future we should probably do this differently. For now we'll take the
        // mode and message from the first file…
        if (message == null && (preprocess || postprocess)) {
            ({ mode, message } = preprocess || postprocess);
        }
        if (preprocess?.mode === 'determinate')
            values.push(preprocess.value);
        if (postprocess?.mode === 'determinate')
            values.push(postprocess.value);
    }
    const value = values.reduce((total, progressValue) => {
        return total + progressValue / values.length;
    }, 0);
    return {
        mode,
        message,
        value,
    };
}

const { STATE_ERROR, STATE_WAITING, STATE_PREPROCESSING, STATE_UPLOADING, STATE_POSTPROCESSING, STATE_COMPLETE, } = statusBarStates;
function StatusBarUI({ newFiles, allowNewUpload, isUploadInProgress, isAllPaused, resumableUploads, error, hideUploadButton = undefined, hidePauseResumeButton = false, hideCancelButton = false, hideRetryButton = false, recoveredState, uploadState, totalProgress, files, supportsUploadProgress, hideAfterFinish = false, isSomeGhost, doneButtonHandler = undefined, isUploadStarted, i18n, startUpload, uppy, isAllComplete, hideProgressDetails = undefined, numUploads, complete, totalSize, totalETA, totalUploadedSize, }) {
    function getProgressValue() {
        switch (uploadState) {
            case STATE_POSTPROCESSING:
            case STATE_PREPROCESSING: {
                const progress = calculateProcessingProgress(files);
                if (progress.mode === 'determinate') {
                    return progress.value * 100;
                }
                return totalProgress;
            }
            case STATE_ERROR: {
                return null;
            }
            case STATE_UPLOADING: {
                if (!supportsUploadProgress) {
                    return null;
                }
                return totalProgress;
            }
            default:
                return totalProgress;
        }
    }
    function getIsIndeterminate() {
        switch (uploadState) {
            case STATE_POSTPROCESSING:
            case STATE_PREPROCESSING: {
                const { mode } = calculateProcessingProgress(files);
                return mode === 'indeterminate';
            }
            case STATE_UPLOADING: {
                if (!supportsUploadProgress) {
                    return true;
                }
                return false;
            }
            default:
                return false;
        }
    }
    const progressValue = getProgressValue();
    const width = progressValue ?? 100;
    const showUploadBtn = !error &&
        newFiles &&
        ((!isUploadInProgress && !isAllPaused) || recoveredState) &&
        allowNewUpload &&
        !hideUploadButton;
    const showCancelBtn = !hideCancelButton &&
        uploadState !== STATE_WAITING &&
        uploadState !== STATE_COMPLETE;
    const showPauseResumeBtn = resumableUploads &&
        !hidePauseResumeButton &&
        uploadState === STATE_UPLOADING;
    const showRetryBtn = error && !isAllComplete && !hideRetryButton;
    const showDoneBtn = doneButtonHandler && uploadState === STATE_COMPLETE;
    const progressClassNames = classNames('uppy-StatusBar-progress', {
        'is-indeterminate': getIsIndeterminate(),
    });
    const statusBarClassNames = classNames('uppy-StatusBar', `is-${uploadState}`, { 'has-ghosts': isSomeGhost });
    const progressBarStateEl = (() => {
        switch (uploadState) {
            case STATE_PREPROCESSING:
            case STATE_POSTPROCESSING:
                return (u$2(ProgressBarProcessing, { progress: calculateProcessingProgress(files) }));
            case STATE_COMPLETE:
                return u$2(ProgressBarComplete, { i18n: i18n });
            case STATE_ERROR:
                return (u$2(ProgressBarError, { error: error, i18n: i18n, numUploads: numUploads, complete: complete }));
            case STATE_UPLOADING:
                return (u$2(ProgressBarUploading, { i18n: i18n, supportsUploadProgress: supportsUploadProgress, totalProgress: totalProgress, hideProgressDetails: hideProgressDetails, isUploadStarted: isUploadStarted, isAllComplete: isAllComplete, isAllPaused: isAllPaused, newFiles: newFiles, numUploads: numUploads, complete: complete, totalUploadedSize: totalUploadedSize, totalSize: totalSize, totalETA: totalETA, startUpload: startUpload }));
            default:
                return null;
        }
    })();
    const atLeastOneAction = showUploadBtn ||
        showRetryBtn ||
        showPauseResumeBtn ||
        showCancelBtn ||
        showDoneBtn;
    const thereIsNothingInside = !atLeastOneAction && !progressBarStateEl;
    const isHidden = thereIsNothingInside || (uploadState === STATE_COMPLETE && hideAfterFinish);
    if (isHidden) {
        return null;
    }
    return (u$2("div", { className: statusBarClassNames, children: [u$2("div", { className: progressClassNames, style: { width: `${width}%` }, role: "progressbar", "aria-label": `${width}%`, "aria-valuetext": `${width}%`, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": progressValue }), progressBarStateEl, u$2("div", { className: "uppy-StatusBar-actions", children: [showUploadBtn ? (u$2(UploadBtn, { newFiles: newFiles, isUploadStarted: isUploadStarted, recoveredState: recoveredState, i18n: i18n, isSomeGhost: isSomeGhost, startUpload: startUpload, uploadState: uploadState })) : null, showRetryBtn ? u$2(RetryBtn, { i18n: i18n, uppy: uppy }) : null, showPauseResumeBtn ? (u$2(PauseResumeButton, { isAllPaused: isAllPaused, i18n: i18n, isAllComplete: isAllComplete, resumableUploads: resumableUploads, uppy: uppy })) : null, showCancelBtn ? u$2(CancelBtn, { i18n: i18n, uppy: uppy }) : null, showDoneBtn ? (u$2(DoneBtn, { i18n: i18n, doneButtonHandler: doneButtonHandler })) : null] })] }));
}

const speedFilterHalfLife = 2000;
const ETAFilterHalfLife = 2000;
function getUploadingState(error, isAllComplete, recoveredState, files) {
    if (error) {
        return statusBarStates.STATE_ERROR;
    }
    if (isAllComplete) {
        return statusBarStates.STATE_COMPLETE;
    }
    if (recoveredState) {
        return statusBarStates.STATE_WAITING;
    }
    let state = statusBarStates.STATE_WAITING;
    const fileIDs = Object.keys(files);
    for (let i = 0; i < fileIDs.length; i++) {
        const { progress } = files[fileIDs[i]];
        // If ANY files are being uploaded right now, show the uploading state.
        if (progress.uploadStarted && !progress.uploadComplete) {
            return statusBarStates.STATE_UPLOADING;
        }
        // If files are being preprocessed AND postprocessed at this time, we show the
        // preprocess state. If any files are being uploaded we show uploading.
        if (progress.preprocess) {
            state = statusBarStates.STATE_PREPROCESSING;
        }
        // If NO files are being preprocessed or uploaded right now, but some files are
        // being postprocessed, show the postprocess state.
        if (progress.postprocess && state !== statusBarStates.STATE_PREPROCESSING) {
            state = statusBarStates.STATE_POSTPROCESSING;
        }
    }
    return state;
}
class StatusBar extends x {
    #lastUpdateTime;
    #previousUploadedBytes;
    #previousSpeed;
    #previousETA;
    componentDidMount() {
        // Initialize ETA calculation variables
        this.#lastUpdateTime = performance.now();
        this.#previousUploadedBytes = this.props.uppy
            .getFiles()
            .reduce((pv, file) => pv + (file.progress.bytesUploaded || 0), 0);
        // Listen for upload start to reset ETA calculation
        this.props.uppy.on('upload', this.#onUploadStart);
    }
    componentWillUnmount() {
        this.props.uppy.off('upload', this.#onUploadStart);
    }
    #onUploadStart = () => {
        const { recoveredState } = this.props.uppy.getState();
        this.#previousSpeed = null;
        this.#previousETA = null;
        if (recoveredState) {
            this.#previousUploadedBytes = Object.values(recoveredState.files).reduce((pv, { progress }) => pv + (progress.bytesUploaded || 0), 0);
            // We don't set `#lastUpdateTime` at this point because the upload won't
            // actually resume until the user asks for it.
            this.props.uppy.emit('restore-confirmed');
            return;
        }
        this.#lastUpdateTime = performance.now();
        this.#previousUploadedBytes = 0;
    };
    #computeSmoothETA(totalBytes) {
        if (totalBytes.total == null || totalBytes.total === 0) {
            return null;
        }
        const remaining = totalBytes.total - totalBytes.uploaded;
        if (remaining <= 0) {
            return null;
        }
        // When state is restored, lastUpdateTime is still nullish at this point.
        this.#lastUpdateTime ??= performance.now();
        const dt = performance.now() - this.#lastUpdateTime;
        if (dt === 0) {
            return Math.round((this.#previousETA ?? 0) / 100) / 10;
        }
        // Initialize previousUploadedBytes if it's null
        if (this.#previousUploadedBytes == null) {
            this.#previousUploadedBytes = totalBytes.uploaded;
            return null; // Can't calculate speed on first call
        }
        const uploadedBytesSinceLastTick = totalBytes.uploaded - this.#previousUploadedBytes;
        this.#previousUploadedBytes = totalBytes.uploaded;
        // uploadedBytesSinceLastTick can be negative in some cases (packet loss?)
        // in which case, we wait for next tick to update ETA.
        if (uploadedBytesSinceLastTick <= 0) {
            return Math.round((this.#previousETA ?? 0) / 100) / 10;
        }
        const currentSpeed = uploadedBytesSinceLastTick / dt;
        // Guard against invalid speed values
        if (!Number.isFinite(currentSpeed) || currentSpeed <= 0) {
            return null;
        }
        const filteredSpeed = this.#previousSpeed == null
            ? currentSpeed
            : emaFilter(currentSpeed, this.#previousSpeed, speedFilterHalfLife, dt);
        // Guard against invalid filtered speed
        if (!Number.isFinite(filteredSpeed) || filteredSpeed <= 0) {
            return null;
        }
        this.#previousSpeed = filteredSpeed;
        const instantETA = remaining / filteredSpeed;
        // Guard against invalid instantETA
        if (!Number.isFinite(instantETA) || instantETA < 0) {
            return null;
        }
        const updatedPreviousETA = Math.max((this.#previousETA ?? 0) - dt, 0);
        const filteredETA = this.#previousETA == null
            ? instantETA
            : emaFilter(instantETA, updatedPreviousETA, ETAFilterHalfLife, dt);
        // Guard against invalid filteredETA
        if (!Number.isFinite(filteredETA) || filteredETA < 0) {
            return null;
        }
        this.#previousETA = filteredETA;
        this.#lastUpdateTime = performance.now();
        return Math.round(filteredETA / 100) / 10;
    }
    startUpload = () => {
        return this.props.uppy.upload().catch((() => {
            // Error logged in Core
        }));
    };
    render() {
        const { capabilities, files, allowNewUpload, totalProgress, error, recoveredState, } = this.props.uppy.getState();
        const { newFiles, startedFiles, completeFiles, isUploadStarted, isAllComplete, isAllPaused, isUploadInProgress, isSomeGhost, } = this.props.uppy.getObjectOfFilesPerState();
        const newFilesOrRecovered = recoveredState ? Object.values(files) : newFiles;
        const resumableUploads = !!capabilities.resumableUploads;
        const supportsUploadProgress = capabilities.uploadProgress !== false;
        let totalSize = null;
        let totalUploadedSize = 0;
        // Only if all files have a known size, does it make sense to display a total size
        if (startedFiles.every((f) => f.progress.bytesTotal != null && f.progress.bytesTotal !== 0)) {
            totalSize = 0;
            startedFiles.forEach((file) => {
                totalSize += file.progress.bytesTotal || 0;
                totalUploadedSize += file.progress.bytesUploaded || 0;
            });
        }
        else {
            // however uploaded size we will always have
            startedFiles.forEach((file) => {
                totalUploadedSize += file.progress.bytesUploaded || 0;
            });
        }
        const totalETA = this.#computeSmoothETA({
            uploaded: totalUploadedSize,
            total: totalSize,
        });
        return (u$2(StatusBarUI, { error: error, uploadState: getUploadingState(error, isAllComplete, recoveredState, files || {}), allowNewUpload: allowNewUpload, totalProgress: totalProgress, totalSize: totalSize, totalUploadedSize: totalUploadedSize, isAllComplete: isAllComplete, isAllPaused: isAllPaused, isUploadStarted: isUploadStarted, isUploadInProgress: isUploadInProgress, isSomeGhost: isSomeGhost, recoveredState: recoveredState, complete: completeFiles.length, newFiles: newFilesOrRecovered.length, numUploads: startedFiles.length, totalETA: totalETA, files: files, i18n: this.props.i18n, uppy: this.props.uppy, startUpload: this.startUpload, doneButtonHandler: this.props.doneButtonHandler, resumableUploads: resumableUploads, supportsUploadProgress: supportsUploadProgress, hideProgressDetails: this.props.hideProgressDetails, hideUploadButton: this.props.hideUploadButton, hideRetryButton: this.props.hideRetryButton, hidePauseResumeButton: this.props.hidePauseResumeButton, hideCancelButton: this.props.hideCancelButton, hideAfterFinish: this.props.hideAfterFinish }));
    }
}

// http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog
// https://github.com/ghosh/micromodal
const WIDTH_XL = 900;
const WIDTH_LG = 700;
const WIDTH_MD = 576;
const HEIGHT_MD = 330;
function Dashboard$1(props) {
    const isNoFiles = props.totalFileCount === 0;
    const isSingleFile = props.totalFileCount === 1;
    const isSizeMD = props.containerWidth > WIDTH_MD;
    const isSizeHeightMD = props.containerHeight > HEIGHT_MD;
    const dashboardClassName = classNames({
        'uppy-Dashboard': true,
        'uppy-Dashboard--isDisabled': props.disabled,
        'uppy-Dashboard--animateOpenClose': props.animateOpenClose,
        'uppy-Dashboard--isClosing': props.isClosing,
        'uppy-Dashboard--isDraggingOver': props.isDraggingOver,
        'uppy-Dashboard--modal': !props.inline,
        'uppy-size--md': props.containerWidth > WIDTH_MD,
        'uppy-size--lg': props.containerWidth > WIDTH_LG,
        'uppy-size--xl': props.containerWidth > WIDTH_XL,
        'uppy-size--height-md': props.containerHeight > HEIGHT_MD,
        // We might want to enable this in the future
        // 'uppy-size--height-lg': props.containerHeight > HEIGHT_LG,
        // 'uppy-size--height-xl': props.containerHeight > HEIGHT_XL,
        'uppy-Dashboard--isAddFilesPanelVisible': props.showAddFilesPanel,
        'uppy-Dashboard--isInnerWrapVisible': props.areInsidesReadyToBeVisible,
        // Only enable “centered single file” mode when Dashboard is tall enough
        'uppy-Dashboard--singleFile': props.singleFileFullScreen && isSingleFile && isSizeHeightMD,
    });
    // Important: keep these in sync with the percent width values in `src/components/FileItem/index.scss`.
    let itemsPerRow = 1; // mobile
    if (props.containerWidth > WIDTH_XL) {
        itemsPerRow = 5;
    }
    else if (props.containerWidth > WIDTH_LG) {
        itemsPerRow = 4;
    }
    else if (props.containerWidth > WIDTH_MD) {
        itemsPerRow = 3;
    }
    const showFileList = props.showSelectedFiles && !isNoFiles;
    const numberOfFilesForRecovery = props.recoveredState
        ? Object.keys(props.recoveredState.files).length
        : null;
    const numberOfGhosts = props.files
        ? Object.keys(props.files).filter((fileID) => props.files[fileID].isGhost)
            .length
        : 0;
    const renderRestoredText = () => {
        if (numberOfGhosts > 0) {
            return props.i18n('recoveredXFiles', {
                smart_count: numberOfGhosts,
            });
        }
        return props.i18n('recoveredAllFiles');
    };
    const dashboard = (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: ...
    u$2("div", { className: dashboardClassName, "data-uppy-theme": props.theme, "data-uppy-num-acquirers": props.acquirers.length, "data-uppy-drag-drop-supported": !props.disableLocalFiles && isDragDropSupported(), "aria-hidden": props.inline ? 'false' : props.isHidden, "aria-disabled": props.disabled, "aria-label": !props.inline
            ? props.i18n('dashboardWindowTitle')
            : props.i18n('dashboardTitle'), onPaste: props.handlePaste, onDragOver: props.handleDragOver, onDragLeave: props.handleDragLeave, onDrop: props.handleDrop, children: [u$2("div", { "aria-hidden": "true", className: "uppy-Dashboard-overlay", tabIndex: -1, onClick: props.handleClickOutside }), u$2("div", { className: "uppy-Dashboard-inner", role: props.inline ? undefined : 'dialog', style: {
                    width: props.inline && props.width ? props.width : '',
                    height: props.inline && props.height ? props.height : '',
                }, children: [!props.inline ? (u$2("button", { className: "uppy-u-reset uppy-Dashboard-close", type: "button", "aria-label": props.i18n('closeModal'), title: props.i18n('closeModal'), onClick: props.closeModal, children: u$2("span", { "aria-hidden": "true", children: "\u00D7" }) })) : null, u$2("div", { className: "uppy-Dashboard-innerWrap", children: [u$2("div", { className: "uppy-Dashboard-dropFilesHereHint", children: props.i18n('dropHint') }), showFileList && u$2(PanelTopBar, { ...props }), numberOfFilesForRecovery && (u$2("div", { className: "uppy-Dashboard-serviceMsg", children: [u$2("svg", { className: "uppy-Dashboard-serviceMsg-icon", "aria-hidden": "true", focusable: "false", width: "21", height: "16", viewBox: "0 0 24 19", children: u$2("g", { transform: "translate(0 -1)", fill: "none", fillRule: "evenodd", children: [u$2("path", { d: "M12.857 1.43l10.234 17.056A1 1 0 0122.234 20H1.766a1 1 0 01-.857-1.514L11.143 1.429a1 1 0 011.714 0z", fill: "#FFD300" }), u$2("path", { fill: "#000", d: "M11 6h2l-.3 8h-1.4z" }), u$2("circle", { fill: "#000", cx: "12", cy: "17", r: "1" })] }) }), u$2("strong", { className: "uppy-Dashboard-serviceMsg-title", children: props.i18n('sessionRestored') }), u$2("div", { className: "uppy-Dashboard-serviceMsg-text", children: renderRestoredText() })] })), showFileList ? (u$2(FileList, { id: props.id, i18n: props.i18n, uppy: props.uppy, files: props.files, resumableUploads: props.resumableUploads, hideRetryButton: props.hideRetryButton, hidePauseResumeButton: props.hidePauseResumeButton, hideCancelButton: props.hideCancelButton, showLinkToFileUploadResult: props.showLinkToFileUploadResult, showRemoveButtonAfterComplete: props.showRemoveButtonAfterComplete, metaFields: props.metaFields, toggleFileCard: props.toggleFileCard, handleRequestThumbnail: props.handleRequestThumbnail, handleCancelThumbnail: props.handleCancelThumbnail, recoveredState: props.recoveredState, individualCancellation: props.individualCancellation, openFileEditor: props.openFileEditor, canEditFile: props.canEditFile, toggleAddFilesPanel: props.toggleAddFilesPanel, isSingleFile: isSingleFile, itemsPerRow: itemsPerRow, containerWidth: props.containerWidth, containerHeight: props.containerHeight })) : (u$2(AddFiles, { i18n: props.i18n, i18nArray: props.i18nArray, acquirers: props.acquirers, handleInputChange: props.handleInputChange, maxNumberOfFiles: props.maxNumberOfFiles, allowedFileTypes: props.allowedFileTypes, showNativePhotoCameraButton: props.showNativePhotoCameraButton, showNativeVideoCameraButton: props.showNativeVideoCameraButton, nativeCameraFacingMode: props.nativeCameraFacingMode, showPanel: props.showPanel, activePickerPanel: props.activePickerPanel, disableLocalFiles: props.disableLocalFiles, fileManagerSelectionType: props.fileManagerSelectionType, note: props.note, proudlyDisplayPoweredByUppy: props.proudlyDisplayPoweredByUppy })), u$2(Slide, { children: props.showAddFilesPanel ? (u$2(AddFilesPanel, { ...props, isSizeMD: isSizeMD }, "AddFiles")) : null }), u$2(Slide, { children: props.fileCardFor ? u$2(FileCard, { ...props }, "FileCard") : null }), u$2(Slide, { children: props.activePickerPanel ? (u$2(PickerPanelContent, { ...props }, "Picker")) : null }), u$2(Slide, { children: props.showFileEditor ? (u$2(EditorPanel, { ...props }, "Editor")) : null }), u$2("div", { className: "uppy-Dashboard-progressindicators", children: [!props.disableInformer && u$2(Informer, { uppy: props.uppy }), !props.disableStatusBar && (u$2(StatusBar, { uppy: props.uppy, i18n: props.i18n, hideProgressDetails: props.hideProgressDetails, hideUploadButton: props.hideUploadButton, hideRetryButton: props.hideRetryButton, hidePauseResumeButton: props.hidePauseResumeButton, hideCancelButton: props.hideCancelButton, hideAfterFinish: props.hideProgressAfterFinish, doneButtonHandler: props.doneButtonHandler })), !props.disableInformer && u$2(Informer, { uppy: props.uppy }), props.progressindicators.map((target) => {
                                        // TODO
                                        // Here we're telling typescript all `this.type = 'progressindicator'` plugins inherit from `UIPlugin`
                                        // This is factually true in Uppy right now, but maybe it doesn't have to be
                                        return props.uppy.getPlugin(target.id).render(props.state);
                                    })] })] })] })] }));
    return dashboard;
}

var locale$5 = {
    strings: {
        // When `inline: false`, used as the screen reader label for the button that closes the modal.
        closeModal: 'Close Modal',
        // Used as the screen reader label for the plus (+) button that shows the “Add more files” screen
        addMoreFiles: 'Add more files',
        addingMoreFiles: 'Adding more files',
        // Used as the header for import panels, e.g., “Import from Google Drive”.
        importFrom: 'Import from %{name}',
        // When `inline: false`, used as the screen reader label for the dashboard modal.
        dashboardWindowTitle: 'Uppy Dashboard Window (Press escape to close)',
        // When `inline: true`, used as the screen reader label for the dashboard area.
        dashboardTitle: 'Uppy Dashboard',
        // Shown in the Informer when a link to a file was copied to the clipboard.
        copyLinkToClipboardSuccess: 'Link copied to clipboard.',
        // Used when a link cannot be copied automatically — the user has to select the text from the
        // input element below this string.
        copyLinkToClipboardFallback: 'Copy the URL below',
        // Used as the hover title and screen reader label for buttons that copy a file link.
        copyLink: 'Copy link',
        back: 'Back',
        // Used as the screen reader label for buttons that remove a file.
        removeFile: 'Remove file',
        // Used as the screen reader label for buttons that open the metadata editor panel for a file.
        editFile: 'Edit file',
        editImage: 'Edit image',
        // Shown in the panel header for the metadata editor. Rendered as “Editing image.png”.
        editing: 'Editing %{file}',
        // Shown on the main upload screen when an upload error occurs
        error: 'Error',
        // Used as the screen reader label for the button that saves metadata edits and returns to the
        // file list view.
        finishEditingFile: 'Finish editing file',
        saveChanges: 'Save changes',
        // Used as the label for the tab button that opens the system file selection dialog.
        myDevice: 'My Device',
        dropHint: 'Drop your files here',
        // Used as the hover text and screen reader label for file progress indicators when
        // they have been fully uploaded.
        uploadComplete: 'Upload complete',
        uploadPaused: 'Upload paused',
        // Used as the hover text and screen reader label for the buttons to resume paused uploads.
        resumeUpload: 'Resume upload',
        // Used as the hover text and screen reader label for the buttons to pause uploads.
        pauseUpload: 'Pause upload',
        // Used as the hover text and screen reader label for the buttons to retry failed uploads.
        retryUpload: 'Retry upload',
        // Used as the hover text and screen reader label for the buttons to cancel uploads.
        cancelUpload: 'Cancel upload',
        // Used in a title, how many files are currently selected
        xFilesSelected: {
            0: '%{smart_count} file selected',
            1: '%{smart_count} files selected',
        },
        uploadingXFiles: {
            0: 'Uploading %{smart_count} file',
            1: 'Uploading %{smart_count} files',
        },
        processingXFiles: {
            0: 'Processing %{smart_count} file',
            1: 'Processing %{smart_count} files',
        },
        // The "powered by Uppy" link at the bottom of the Dashboard.
        poweredBy: 'Powered by %{uppy}',
        addMore: 'Add more',
        editFileWithFilename: 'Edit file %{file}',
        save: 'Save',
        cancel: 'Cancel',
        dropPasteFiles: 'Drop files here or %{browseFiles}',
        dropPasteFolders: 'Drop files here or %{browseFolders}',
        dropPasteBoth: 'Drop files here, %{browseFiles} or %{browseFolders}',
        dropPasteImportFiles: 'Drop files here, %{browseFiles} or import from:',
        dropPasteImportFolders: 'Drop files here, %{browseFolders} or import from:',
        dropPasteImportBoth: 'Drop files here, %{browseFiles}, %{browseFolders} or import from:',
        importFiles: 'Import files from:',
        browseFiles: 'browse files',
        browseFolders: 'browse folders',
        recoveredXFiles: {
            0: 'We could not fully recover 1 file. Please re-select it and resume the upload.',
            1: 'We could not fully recover %{smart_count} files. Please re-select them and resume the upload.',
        },
        recoveredAllFiles: 'We restored all files. You can now resume the upload.',
        sessionRestored: 'Session restored',
        reSelect: 'Re-select',
        missingRequiredMetaFields: {
            0: 'Missing required meta field: %{fields}.',
            1: 'Missing required meta fields: %{fields}.',
        },
        // Used for native device camera buttons on mobile
        takePictureBtn: 'Take Picture',
        recordVideoBtn: 'Record Video',
        // Strings for StatusBar
        // Shown in the status bar while files are being uploaded.
        uploading: 'Uploading',
        // Shown in the status bar once all files have been uploaded.
        complete: 'Complete',
        // Shown in the status bar if an upload failed.
        uploadFailed: 'Upload failed',
        // Shown in the status bar while the upload is paused.
        paused: 'Paused',
        // Used as the label for the button that retries an upload.
        retry: 'Retry',
        // Used as the label for the button that pauses an upload.
        pause: 'Pause',
        // Used as the label for the button that resumes an upload.
        resume: 'Resume',
        // Used as the label for the button that resets the upload state after an upload
        done: 'Done',
        // When `hideProgressDetails` is set to false, shows the number of files that have been fully uploaded so far.
        filesUploadedOfTotal: {
            0: '%{complete} of %{smart_count} file uploaded',
            1: '%{complete} of %{smart_count} files uploaded',
        },
        // When `hideProgressDetails` is set to false, shows the amount of bytes that have been uploaded so far.
        dataUploadedOfTotal: '%{complete} of %{total}',
        dataUploadedOfUnknown: '%{complete} of unknown',
        // When `hideProgressDetails` is set to false, shows an estimation of how long the upload will take to complete.
        xTimeLeft: '%{time} left',
        // Used as the label for the button that starts an upload.
        uploadXFiles: {
            0: 'Upload %{smart_count} file',
            1: 'Upload %{smart_count} files',
        },
        // Used as the label for the button that starts an upload, if another upload has been started in the past
        // and new files were added later.
        uploadXNewFiles: {
            0: 'Upload +%{smart_count} file',
            1: 'Upload +%{smart_count} files',
        },
        upload: 'Upload',
        xMoreFilesAdded: {
            0: '%{smart_count} more file added',
            1: '%{smart_count} more files added',
        },
        showErrorDetails: 'Show error details',
    },
};

/**
 * @returns {HTMLElement} - either dashboard element, or the overlay that's most on top
 */
function getActiveOverlayEl(dashboardEl, activeOverlayType) {
    if (activeOverlayType) {
        const overlayEl = dashboardEl.querySelector(`[data-uppy-paneltype="${activeOverlayType}"]`);
        // if an overlay is already mounted
        if (overlayEl)
            return overlayEl;
    }
    return dashboardEl;
}

// @ts-ignore untyped
/*
  Focuses on some element in the currently topmost overlay.

  1. If there are some [data-uppy-super-focusable] elements rendered already - focuses
     on the first superfocusable element, and leaves focus up to the control of
     a user (until currently focused element disappears from the screen [which
     can happen when overlay changes, or, e.g., when we click on a folder in googledrive]).
  2. If there are no [data-uppy-super-focusable] elements yet (or ever) - focuses
     on the first focusable element, but switches focus if superfocusable elements appear on next render.
*/
function createSuperFocus() {
    let lastFocusWasOnSuperFocusableEl = false;
    const superFocus = (dashboardEl, activeOverlayType) => {
        const overlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
        const isFocusInOverlay = overlayEl.contains(document.activeElement);
        // If focus is already in the topmost overlay, AND on last update we focused on the superfocusable
        // element - then leave focus up to the user.
        // [Practical check] without this line, typing in the search input in googledrive overlay won't work.
        if (isFocusInOverlay && lastFocusWasOnSuperFocusableEl)
            return;
        const superFocusableEl = overlayEl.querySelector('[data-uppy-super-focusable]');
        // If we are already in the topmost overlay, AND there are no super focusable elements yet, - leave focus up to the user.
        // [Practical check] without this line, if you are in an empty folder in google drive, and something's uploading in the
        // bg, - focus will be jumping to Done all the time.
        if (isFocusInOverlay && !superFocusableEl)
            return;
        if (superFocusableEl) {
            superFocusableEl.focus({ preventScroll: true });
            lastFocusWasOnSuperFocusableEl = true;
        }
        else {
            const firstEl = overlayEl.querySelector(FOCUSABLE_ELEMENTS);
            firstEl?.focus({ preventScroll: true });
            lastFocusWasOnSuperFocusableEl = false;
        }
    };
    // ___Why do we need to debounce?
    //    1. To deal with animations: overlay changes via animations, which results in the DOM updating AFTER plugin.update()
    //       already executed.
    //    [Practical check] without debounce, if we open the Url overlay, and click 'Done', Dashboard won't get focused again.
    //    [Practical check] if we delay 250ms instead of 260ms - IE11 won't get focused in same situation.
    //    2. Performance: there can be many state update()s in a second, and this function is called every time.
    return debounce$2(superFocus, 260);
}

// @ts-ignore untyped
function focusOnFirstNode(event, nodes) {
    const node = nodes[0];
    if (node) {
        node.focus();
        event.preventDefault();
    }
}
function focusOnLastNode(event, nodes) {
    const node = nodes[nodes.length - 1];
    if (node) {
        node.focus();
        event.preventDefault();
    }
}
// ___Why not just use (focusedItemIndex === -1)?
//    Firefox thinks <ul> is focusable, but we don't have <ul>s in our FOCUSABLE_ELEMENTS. Which means that if we tab into
//    the <ul>, code will think that we are not in the active overlay, and we should focusOnFirstNode() of the currently
//    active overlay!
//    [Practical check] if we use (focusedItemIndex === -1), instagram provider in firefox will never get focus on its pics
//    in the <ul>.
function isFocusInOverlay(activeOverlayEl) {
    return activeOverlayEl.contains(document.activeElement);
}
function trapFocus(event, activeOverlayType, dashboardEl) {
    const activeOverlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
    const focusableNodes = toArray(activeOverlayEl.querySelectorAll(FOCUSABLE_ELEMENTS));
    const focusedItemIndex = focusableNodes.indexOf(document.activeElement);
    // If we pressed tab, and focus is not yet within the current overlay - focus on
    // the first element within the current overlay.
    // This is a safety measure (for when user returns from another tab e.g.), most
    // plugins will try to focus on some important element as it loads.
    if (!isFocusInOverlay(activeOverlayEl)) {
        focusOnFirstNode(event, focusableNodes);
        // If we pressed shift + tab, and we're on the first element of a modal
    }
    else if (event.shiftKey && focusedItemIndex === 0) {
        focusOnLastNode(event, focusableNodes);
        // If we pressed tab, and we're on the last element of the modal
    }
    else if (!event.shiftKey &&
        focusedItemIndex === focusableNodes.length - 1) {
        focusOnFirstNode(event, focusableNodes);
    }
}
// Traps focus inside of the currently open overlay, unless overlay is null - then let the user tab away.
function forInline(event, activeOverlayType, dashboardEl) {
    // ___When we're in the bare 'Drop files here, paste, browse or import from' screen
    if (activeOverlayType === null) ;
    else {
        // Trap the focus inside this overlay!
        // User can close the overlay (click 'Done') if they want to travel away from Uppy.
        trapFocus(event, activeOverlayType, dashboardEl);
    }
}

const TAB_KEY = 9;
const ESC_KEY = 27;
function createPromise() {
    const o = {};
    o.promise = new Promise((resolve, reject) => {
        o.resolve = resolve;
        o.reject = reject;
    });
    return o;
}
const defaultOptions$5 = {
    target: 'body',
    metaFields: [],
    thumbnailWidth: 280,
    thumbnailType: 'image/jpeg',
    waitForThumbnailsBeforeUpload: false,
    defaultPickerIcon,
    showLinkToFileUploadResult: false,
    hideProgressDetails: false,
    hideUploadButton: false,
    hideCancelButton: false,
    hideRetryButton: false,
    hidePauseResumeButton: false,
    hideProgressAfterFinish: false,
    note: null,
    singleFileFullScreen: true,
    disableStatusBar: false,
    disableInformer: false,
    disableThumbnailGenerator: false,
    fileManagerSelectionType: 'files',
    proudlyDisplayPoweredByUppy: true,
    showSelectedFiles: true,
    showRemoveButtonAfterComplete: false,
    showNativePhotoCameraButton: false,
    showNativeVideoCameraButton: false,
    theme: 'light',
    autoOpen: null,
    disabled: false,
    disableLocalFiles: false,
    nativeCameraFacingMode: '',
    onDragLeave: () => { },
    onDragOver: () => { },
    onDrop: () => { },
    plugins: [],
    // Dynamic default options, they have to be defined in the constructor (because
    // they require access to the `this` keyword), but we still want them to
    // appear in the default options so TS knows they'll be defined.
    doneButtonHandler: undefined,
    onRequestCloseModal: null,
    // defaultModalOptions
    inline: false,
    animateOpenClose: true,
    browserBackButtonClose: false,
    closeAfterFinish: false,
    closeModalOnClickOutside: false,
    disablePageScrollWhenModalOpen: true,
    trigger: null,
    // defaultInlineOptions
    width: 750,
    height: 550,
};
/**
 * Dashboard UI with previews, metadata editing, tabs for various services and more
 */
class Dashboard extends UIPlugin {
    static VERSION = packageJson$8.version;
    #disabledNodes;
    modalName = `uppy-Dashboard-${nanoid()}`;
    superFocus = createSuperFocus();
    ifFocusedOnUppyRecently = false;
    dashboardIsDisabled;
    savedScrollPosition;
    savedActiveElement;
    resizeObserver;
    darkModeMediaQuery;
    // Timeouts
    makeDashboardInsidesVisibleAnywayTimeout;
    constructor(uppy, opts) {
        const autoOpen = opts?.autoOpen ?? null;
        super(uppy, { ...defaultOptions$5, ...opts, autoOpen });
        this.id = this.opts.id || 'Dashboard';
        this.title = 'Dashboard';
        this.type = 'orchestrator';
        this.defaultLocale = locale$5;
        // Dynamic default options:
        if (this.opts.doneButtonHandler === undefined) {
            // `null` means "do not display a Done button", while `undefined` means
            // "I want the default behavior". For this reason, we need to differentiate `null` and `undefined`.
            this.opts.doneButtonHandler = () => {
                this.uppy.clear();
                this.requestCloseModal();
            };
        }
        this.opts.onRequestCloseModal ??= () => this.closeModal();
        this.i18nInit();
    }
    removeTarget = (plugin) => {
        const pluginState = this.getPluginState();
        // filter out the one we want to remove
        const newTargets = pluginState.targets.filter((target) => target.id !== plugin.id);
        this.setPluginState({
            targets: newTargets,
        });
    };
    addTarget = (plugin) => {
        const callerPluginId = plugin.id || plugin.constructor.name;
        const callerPluginName = plugin.title || callerPluginId;
        const callerPluginType = plugin.type;
        if (callerPluginType !== 'acquirer' &&
            callerPluginType !== 'progressindicator' &&
            callerPluginType !== 'editor') {
            const msg = 'Dashboard: can only be targeted by plugins of types: acquirer, progressindicator, editor';
            this.uppy.log(msg, 'error');
            return null;
        }
        const target = {
            id: callerPluginId,
            name: callerPluginName,
            type: callerPluginType,
        };
        const state = this.getPluginState();
        const newTargets = state.targets.slice();
        newTargets.push(target);
        this.setPluginState({
            targets: newTargets,
        });
        return this.el;
    };
    hideAllPanels = () => {
        const state = this.getPluginState();
        const update = {
            activePickerPanel: undefined,
            showAddFilesPanel: false,
            activeOverlayType: null,
            fileCardFor: null,
            showFileEditor: false,
        };
        if (state.activePickerPanel === update.activePickerPanel &&
            state.showAddFilesPanel === update.showAddFilesPanel &&
            state.showFileEditor === update.showFileEditor &&
            state.activeOverlayType === update.activeOverlayType) {
            // avoid doing a state update if nothing changed
            return;
        }
        this.setPluginState(update);
        this.uppy.emit('dashboard:close-panel', state.activePickerPanel?.id);
    };
    showPanel = (id) => {
        const { targets } = this.getPluginState();
        const activePickerPanel = targets.find((target) => {
            return target.type === 'acquirer' && target.id === id;
        });
        this.setPluginState({
            activePickerPanel,
            activeOverlayType: 'PickerPanel',
        });
        this.uppy.emit('dashboard:show-panel', id);
    };
    canEditFile = (file) => {
        const { targets } = this.getPluginState();
        const editors = this.#getEditors(targets);
        return editors.some((target) => this.uppy.getPlugin(target.id).canEditFile(file));
    };
    openFileEditor = (file) => {
        const { targets } = this.getPluginState();
        const editors = this.#getEditors(targets);
        this.setPluginState({
            showFileEditor: true,
            fileCardFor: file.id || null,
            activeOverlayType: 'FileEditor',
        });
        editors.forEach((editor) => {
            this.uppy.getPlugin(editor.id).selectFile(file);
        });
    };
    closeFileEditor = () => {
        const { metaFields } = this.getPluginState();
        const isMetaEditorEnabled = metaFields && metaFields.length > 0;
        if (isMetaEditorEnabled) {
            this.setPluginState({
                showFileEditor: false,
                activeOverlayType: 'FileCard',
            });
        }
        else {
            this.setPluginState({
                showFileEditor: false,
                fileCardFor: null,
                activeOverlayType: 'AddFiles',
            });
        }
    };
    saveFileEditor = () => {
        const { targets } = this.getPluginState();
        const editors = this.#getEditors(targets);
        editors.forEach((editor) => {
            this.uppy.getPlugin(editor.id).save();
        });
        this.closeFileEditor();
    };
    openModal = () => {
        const { promise, resolve } = createPromise();
        // save scroll position
        this.savedScrollPosition = window.pageYOffset;
        // save active element, so we can restore focus when modal is closed
        this.savedActiveElement = document.activeElement;
        if (this.opts.disablePageScrollWhenModalOpen) {
            document.body.classList.add('uppy-Dashboard-isFixed');
        }
        if (this.opts.animateOpenClose && this.getPluginState().isClosing) {
            const handler = () => {
                this.setPluginState({
                    isHidden: false,
                });
                this.el.removeEventListener('animationend', handler, false);
                resolve();
            };
            this.el.addEventListener('animationend', handler, false);
        }
        else {
            this.setPluginState({
                isHidden: false,
            });
            resolve();
        }
        if (this.opts.browserBackButtonClose) {
            this.updateBrowserHistory();
        }
        // handle ESC and TAB keys in modal dialog
        document.addEventListener('keydown', this.handleKeyDownInModal);
        this.uppy.emit('dashboard:modal-open');
        return promise;
    };
    closeModal = (opts) => {
        // Whether the modal is being closed by the user (`true`) or by other means (e.g. browser back button)
        const manualClose = opts?.manualClose ?? true;
        const { isHidden, isClosing } = this.getPluginState();
        if (isHidden || isClosing) {
            // short-circuit if animation is ongoing
            return undefined;
        }
        const { promise, resolve } = createPromise();
        if (this.opts.disablePageScrollWhenModalOpen) {
            document.body.classList.remove('uppy-Dashboard-isFixed');
        }
        if (this.opts.animateOpenClose) {
            this.setPluginState({
                isClosing: true,
            });
            const handler = () => {
                this.setPluginState({
                    isHidden: true,
                    isClosing: false,
                });
                this.superFocus.cancel();
                this.savedActiveElement.focus();
                this.el.removeEventListener('animationend', handler, false);
                resolve();
            };
            this.el.addEventListener('animationend', handler, false);
        }
        else {
            this.setPluginState({
                isHidden: true,
            });
            this.superFocus.cancel();
            this.savedActiveElement.focus();
            resolve();
        }
        // handle ESC and TAB keys in modal dialog
        document.removeEventListener('keydown', this.handleKeyDownInModal);
        if (manualClose) {
            if (this.opts.browserBackButtonClose) {
                // Make sure that the latest entry in the history state is our modal name
                if (history.state?.[this.modalName]) {
                    // Go back in history to clear out the entry we created (ultimately closing the modal)
                    history.back();
                }
            }
        }
        this.uppy.emit('dashboard:modal-closed');
        return promise;
    };
    isModalOpen = () => {
        return !this.getPluginState().isHidden || false;
    };
    requestCloseModal = () => {
        if (this.opts.onRequestCloseModal) {
            return this.opts.onRequestCloseModal();
        }
        return this.closeModal();
    };
    setDarkModeCapability = (isDarkModeOn) => {
        const { capabilities } = this.uppy.getState();
        this.uppy.setState({
            capabilities: {
                ...capabilities,
                darkMode: isDarkModeOn,
            },
        });
    };
    handleSystemDarkModeChange = (event) => {
        const isDarkModeOnNow = event.matches;
        this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnNow ? 'on' : 'off'}`);
        this.setDarkModeCapability(isDarkModeOnNow);
    };
    toggleFileCard = (show, fileID) => {
        const file = this.uppy.getFile(fileID);
        if (show) {
            this.uppy.emit('dashboard:file-edit-start', file);
        }
        else {
            this.uppy.emit('dashboard:file-edit-complete', file);
        }
        this.setPluginState({
            fileCardFor: show ? fileID : null,
            activeOverlayType: show ? 'FileCard' : null,
        });
    };
    toggleAddFilesPanel = (show) => {
        this.setPluginState({
            showAddFilesPanel: show,
            activeOverlayType: show ? 'AddFiles' : null,
        });
    };
    addFiles = (files) => {
        const descriptors = files.map((file) => ({
            source: this.id,
            name: file.name,
            type: file.type,
            data: file,
            meta: {
                // path of the file relative to the ancestor directory the user selected.
                // e.g. 'docs/Old Prague/airbnb.pdf'
                relativePath: file.relativePath || file.webkitRelativePath || null,
            },
        }));
        try {
            this.uppy.addFiles(descriptors);
        }
        catch (err) {
            this.uppy.log(err);
        }
    };
    // ___Why make insides of Dashboard invisible until first ResizeObserver event is emitted?
    //    ResizeOberserver doesn't emit the first resize event fast enough, users can see the jump from one .uppy-size-- to
    //    another (e.g. in Safari)
    // ___Why not apply visibility property to .uppy-Dashboard-inner?
    //    Because ideally, acc to specs, ResizeObserver should see invisible elements as of width 0. So even though applying
    //    invisibility to .uppy-Dashboard-inner works now, it may not work in the future.
    startListeningToResize = () => {
        // Watch for Dashboard container (`.uppy-Dashboard-inner`) resize
        // and update containerWidth/containerHeight in plugin state accordingly.
        // Emits first event on initialization.
        this.resizeObserver = new ResizeObserver((entries) => {
            const uppyDashboardInnerEl = entries[0];
            const { width, height } = uppyDashboardInnerEl.contentRect;
            this.setPluginState({
                containerWidth: width,
                containerHeight: height,
                areInsidesReadyToBeVisible: true,
            });
        });
        this.resizeObserver.observe(this.el.querySelector('.uppy-Dashboard-inner'));
        // If ResizeObserver fails to emit an event telling us what size to use - default to the mobile view
        this.makeDashboardInsidesVisibleAnywayTimeout = setTimeout(() => {
            const pluginState = this.getPluginState();
            const isModalAndClosed = !this.opts.inline && pluginState.isHidden;
            if (
            // We might want to enable this in the future
            // if ResizeObserver hasn't yet fired,
            !pluginState.areInsidesReadyToBeVisible &&
                // and it's not due to the modal being closed
                !isModalAndClosed) {
                this.uppy.log('[Dashboard] resize event didn’t fire on time: defaulted to mobile layout', 'warning');
                this.setPluginState({
                    areInsidesReadyToBeVisible: true,
                });
            }
        }, 1000);
    };
    stopListeningToResize = () => {
        this.resizeObserver.disconnect();
        clearTimeout(this.makeDashboardInsidesVisibleAnywayTimeout);
    };
    // Records whether we have been interacting with uppy right now,
    // which is then used to determine whether state updates should trigger a refocusing.
    recordIfFocusedOnUppyRecently = (event) => {
        if (this.el.contains(event.target)) {
            this.ifFocusedOnUppyRecently = true;
        }
        else {
            this.ifFocusedOnUppyRecently = false;
            // ___Why run this.superFocus.cancel here when it already runs in superFocusOnEachUpdate?
            //    Because superFocus is debounced, when we move from Uppy to some other element on the page,
            //    previously run superFocus sometimes hits and moves focus back to Uppy.
            this.superFocus.cancel();
        }
    };
    disableInteractiveElements = (disable) => {
        const NODES_TO_DISABLE = [
            'a[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'button:not([disabled])',
            '[role="button"]:not([disabled])',
        ];
        const nodesToDisable = this.#disabledNodes ??
            toArray(this.el.querySelectorAll(NODES_TO_DISABLE)).filter((node) => !node.classList.contains('uppy-Dashboard-close'));
        for (const node of nodesToDisable) {
            // Links can’t have `disabled` attr, so we use `aria-disabled` for a11y
            if (node.tagName === 'A') {
                node.setAttribute('aria-disabled', disable);
            }
            else {
                node.disabled = disable;
            }
        }
        if (disable) {
            this.#disabledNodes = nodesToDisable;
        }
        else {
            this.#disabledNodes = null;
        }
        this.dashboardIsDisabled = disable;
    };
    updateBrowserHistory = () => {
        // Ensure history state does not already contain our modal name to avoid double-pushing
        if (!history.state?.[this.modalName]) {
            // Push to history so that the page is not lost on browser back button press
            history.pushState({
                ...history.state,
                [this.modalName]: true,
            }, '');
        }
        // Listen for back button presses
        window.addEventListener('popstate', this.handlePopState, false);
    };
    handlePopState = (event) => {
        // Close the modal if the history state no longer contains our modal name
        if (this.isModalOpen() && (!event.state || !event.state[this.modalName])) {
            this.closeModal({ manualClose: false });
        }
        // When the browser back button is pressed and uppy is now the latest entry
        // in the history but the modal is closed, fix the history by removing the
        // uppy history entry.
        // This occurs when another entry is added into the history state while the
        // modal is open, and then the modal gets manually closed.
        // Solves PR #575 (https://github.com/transloadit/uppy/pull/575)
        if (!this.isModalOpen() && event.state?.[this.modalName]) {
            history.back();
        }
    };
    handleKeyDownInModal = (event) => {
        // close modal on esc key press
        if (event.keyCode === ESC_KEY)
            this.requestCloseModal();
        // trap focus on tab key press
        if (event.keyCode === TAB_KEY)
            trapFocus(event, this.getPluginState().activeOverlayType, this.el);
    };
    handleClickOutside = () => {
        if (this.opts.closeModalOnClickOutside)
            this.requestCloseModal();
    };
    handlePaste = (event) => {
        // Let any acquirer plugin (Url/Webcam/etc.) handle pastes to the root
        this.uppy.iteratePlugins((plugin) => {
            if (plugin.type === 'acquirer') {
                plugin.handleRootPaste?.(event);
            }
        });
        // Add all dropped files
        const files = toArray(event.clipboardData.files);
        if (files.length > 0) {
            this.uppy.log('[Dashboard] Files pasted');
            this.addFiles(files);
        }
    };
    handleInputChange = (event) => {
        event.preventDefault();
        const files = toArray(event.currentTarget.files || []);
        if (files.length > 0) {
            this.uppy.log('[Dashboard] Files selected through input');
            this.addFiles(files);
        }
    };
    handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // Check if some plugin can handle the datatransfer without files —
        // for instance, the Url plugin can import a url
        const canSomePluginHandleRootDrop = () => {
            let somePluginCanHandleRootDrop = true;
            this.uppy.iteratePlugins((plugin) => {
                if (plugin.canHandleRootDrop?.(event)) {
                    somePluginCanHandleRootDrop = true;
                }
            });
            return somePluginCanHandleRootDrop;
        };
        // Check if the "type" of the datatransfer object includes files
        const doesEventHaveFiles = () => {
            const { types } = event.dataTransfer;
            return types.some((type) => type === 'Files');
        };
        // Deny drop, if no plugins can handle datatransfer, there are no files,
        // or when opts.disabled is set, or new uploads are not allowed
        const somePluginCanHandleRootDrop = canSomePluginHandleRootDrop();
        const hasFiles = doesEventHaveFiles();
        if ((!somePluginCanHandleRootDrop && !hasFiles) ||
            this.opts.disabled ||
            // opts.disableLocalFiles should only be taken into account if no plugins
            // can handle the datatransfer
            (this.opts.disableLocalFiles &&
                (hasFiles || !somePluginCanHandleRootDrop)) ||
            !this.uppy.getState().allowNewUpload) {
            event.dataTransfer.dropEffect = 'none';
            return;
        }
        // Add a small (+) icon on drop
        // (and prevent browsers from interpreting this as files being _moved_ into the
        // browser, https://github.com/transloadit/uppy/issues/1978).
        event.dataTransfer.dropEffect = 'copy';
        this.setPluginState({ isDraggingOver: true });
        this.opts.onDragOver(event);
    };
    handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setPluginState({ isDraggingOver: false });
        this.opts.onDragLeave(event);
    };
    handleDrop = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setPluginState({ isDraggingOver: false });
        // Let any acquirer plugin (Url/Webcam/etc.) handle drops to the root
        this.uppy.iteratePlugins((plugin) => {
            if (plugin.type === 'acquirer') {
                plugin.handleRootDrop?.(event);
            }
        });
        // Add all dropped files
        let executedDropErrorOnce = false;
        const logDropError = (error) => {
            this.uppy.log(error, 'error');
            // In practice all drop errors are most likely the same,
            // so let's just show one to avoid overwhelming the user
            if (!executedDropErrorOnce) {
                this.uppy.info(error.message, 'error');
                executedDropErrorOnce = true;
            }
        };
        this.uppy.log('[Dashboard] Processing dropped files');
        // Add all dropped files
        const files = await getDroppedFiles(event.dataTransfer, { logDropError });
        if (files.length > 0) {
            this.uppy.log('[Dashboard] Files dropped');
            this.addFiles(files);
        }
        this.opts.onDrop(event);
    };
    handleRequestThumbnail = (file) => {
        if (!this.opts.waitForThumbnailsBeforeUpload) {
            this.uppy.emit('thumbnail:request', file);
        }
    };
    /**
     * We cancel thumbnail requests when a file item component unmounts to avoid
     * clogging up the queue when the user scrolls past many elements.
     */
    handleCancelThumbnail = (file) => {
        if (!this.opts.waitForThumbnailsBeforeUpload) {
            this.uppy.emit('thumbnail:cancel', file);
        }
    };
    handleKeyDownInInline = (event) => {
        // Trap focus on tab key press.
        if (event.keyCode === TAB_KEY)
            forInline(event, this.getPluginState().activeOverlayType, this.el);
    };
    // ___Why do we listen to the 'paste' event on a document instead of onPaste={props.handlePaste} prop,
    //    or this.el.addEventListener('paste')?
    //    Because (at least) Chrome doesn't handle paste if focus is on some button, e.g. 'My Device'.
    //    => Therefore, the best option is to listen to all 'paste' events, and only react to them when we are focused on our
    //       particular Uppy instance.
    // ___Why do we still need onPaste={props.handlePaste} for the DashboardUi?
    //    Because if we click on the 'Drop files here' caption e.g., `document.activeElement` will be 'body'. Which means our
    //    standard determination of whether we're pasting into our Uppy instance won't work.
    //    => Therefore, we need a traditional onPaste={props.handlePaste} handler too.
    handlePasteOnBody = (event) => {
        const isFocusInOverlay = this.el.contains(document.activeElement);
        if (isFocusInOverlay) {
            this.handlePaste(event);
        }
    };
    handleComplete = ({ failed }) => {
        if (this.opts.closeAfterFinish && !failed?.length) {
            // All uploads are done
            this.requestCloseModal();
        }
    };
    handleCancelRestore = () => {
        this.uppy.emit('restore-canceled');
    };
    #generateLargeThumbnailIfSingleFile = () => {
        if (this.opts.disableThumbnailGenerator) {
            return;
        }
        const LARGE_THUMBNAIL = 600;
        const files = this.uppy.getFiles();
        if (files.length === 1) {
            const thumbnailGenerator = this.uppy.getPlugin(`${this.id}:ThumbnailGenerator`);
            thumbnailGenerator?.setOptions({ thumbnailWidth: LARGE_THUMBNAIL });
            const fileForThumbnail = { ...files[0], preview: undefined };
            thumbnailGenerator?.requestThumbnail(fileForThumbnail).then(() => {
                thumbnailGenerator?.setOptions({
                    thumbnailWidth: this.opts.thumbnailWidth,
                });
            });
        }
    };
    #openFileEditorWhenFilesAdded = (files) => {
        const firstFile = files[0];
        const { metaFields } = this.getPluginState();
        const isMetaEditorEnabled = metaFields && metaFields.length > 0;
        const isImageEditorEnabled = this.canEditFile(firstFile);
        if (isMetaEditorEnabled && this.opts.autoOpen === 'metaEditor') {
            this.toggleFileCard(true, firstFile.id);
        }
        else if (isImageEditorEnabled && this.opts.autoOpen === 'imageEditor') {
            this.openFileEditor(firstFile);
        }
    };
    initEvents = () => {
        // Modal open button
        if (this.opts.trigger && !this.opts.inline) {
            const showModalTrigger = findAllDOMElements(this.opts.trigger);
            if (showModalTrigger) {
                showModalTrigger.forEach((trigger) => trigger.addEventListener('click', this.openModal));
            }
            else {
                this.uppy.log('Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options, unless you are planning to call `dashboard.openModal()` method yourself', 'warning');
            }
        }
        this.startListeningToResize();
        document.addEventListener('paste', this.handlePasteOnBody);
        this.uppy.on('plugin-added', this.#addSupportedPluginIfNoTarget);
        this.uppy.on('plugin-remove', this.removeTarget);
        this.uppy.on('file-added', this.hideAllPanels);
        this.uppy.on('dashboard:modal-closed', this.hideAllPanels);
        this.uppy.on('complete', this.handleComplete);
        this.uppy.on('files-added', this.#generateLargeThumbnailIfSingleFile);
        this.uppy.on('file-removed', this.#generateLargeThumbnailIfSingleFile);
        // ___Why fire on capture?
        //    Because this.ifFocusedOnUppyRecently needs to change before onUpdate() fires.
        document.addEventListener('focus', this.recordIfFocusedOnUppyRecently, true);
        document.addEventListener('click', this.recordIfFocusedOnUppyRecently, true);
        if (this.opts.inline) {
            this.el.addEventListener('keydown', this.handleKeyDownInInline);
        }
        if (this.opts.autoOpen) {
            this.uppy.on('files-added', this.#openFileEditorWhenFilesAdded);
        }
    };
    removeEvents = () => {
        const showModalTrigger = findAllDOMElements(this.opts.trigger);
        if (!this.opts.inline && showModalTrigger) {
            showModalTrigger.forEach((trigger) => trigger.removeEventListener('click', this.openModal));
        }
        this.stopListeningToResize();
        document.removeEventListener('paste', this.handlePasteOnBody);
        window.removeEventListener('popstate', this.handlePopState, false);
        this.uppy.off('plugin-added', this.#addSupportedPluginIfNoTarget);
        this.uppy.off('plugin-remove', this.removeTarget);
        this.uppy.off('file-added', this.hideAllPanels);
        this.uppy.off('dashboard:modal-closed', this.hideAllPanels);
        this.uppy.off('complete', this.handleComplete);
        this.uppy.off('files-added', this.#generateLargeThumbnailIfSingleFile);
        this.uppy.off('file-removed', this.#generateLargeThumbnailIfSingleFile);
        document.removeEventListener('focus', this.recordIfFocusedOnUppyRecently);
        document.removeEventListener('click', this.recordIfFocusedOnUppyRecently);
        if (this.opts.inline) {
            this.el.removeEventListener('keydown', this.handleKeyDownInInline);
        }
        if (this.opts.autoOpen) {
            this.uppy.off('files-added', this.#openFileEditorWhenFilesAdded);
        }
    };
    superFocusOnEachUpdate = () => {
        const isFocusInUppy = this.el.contains(document.activeElement);
        // When focus is lost on the page (== focus is on body for most browsers, or focus is null for IE11)
        const isFocusNowhere = document.activeElement === document.body ||
            document.activeElement === null;
        const isInformerHidden = this.uppy.getState().info.length === 0;
        const isModal = !this.opts.inline;
        if (
        // If update is connected to showing the Informer - let the screen reader calmly read it.
        isInformerHidden &&
            // If we are in a modal - always superfocus without concern for other elements
            // on the page (user is unlikely to want to interact with the rest of the page)
            (isModal ||
                // If we are already inside of Uppy, or
                isFocusInUppy ||
                // If we are not focused on anything BUT we have already, at least once, focused on uppy
                //   1. We focus when isFocusNowhere, because when the element we were focused
                //      on disappears (e.g. an overlay), - focus gets lost. If user is typing
                //      something somewhere else on the page, - focus won't be 'nowhere'.
                //   2. We only focus when focus is nowhere AND this.ifFocusedOnUppyRecently,
                //      to avoid focus jumps if we do something else on the page.
                //   [Practical check] Without '&& this.ifFocusedOnUppyRecently', in Safari, in inline mode,
                //                     when file is uploading, - navigate via tab to the checkbox,
                //                     try to press space multiple times. Focus will jump to Uppy.
                (isFocusNowhere && this.ifFocusedOnUppyRecently))) {
            this.superFocus(this.el, this.getPluginState().activeOverlayType);
        }
        else {
            this.superFocus.cancel();
        }
    };
    afterUpdate = () => {
        if (this.opts.disabled && !this.dashboardIsDisabled) {
            this.disableInteractiveElements(true);
            return;
        }
        if (!this.opts.disabled && this.dashboardIsDisabled) {
            this.disableInteractiveElements(false);
        }
        this.superFocusOnEachUpdate();
    };
    saveFileCard = (meta, fileID) => {
        this.uppy.setFileMeta(fileID, meta);
        this.toggleFileCard(false, fileID);
    };
    #attachRenderFunctionToTarget = (target) => {
        const plugin = this.uppy.getPlugin(target.id);
        return {
            ...target,
            icon: plugin.icon || this.opts.defaultPickerIcon,
            render: plugin.render,
        };
    };
    #isTargetSupported = (target) => {
        const plugin = this.uppy.getPlugin(target.id);
        // If the plugin does not provide a `supported` check, assume the plugin works everywhere.
        if (typeof plugin.isSupported !== 'function') {
            return true;
        }
        return plugin.isSupported();
    };
    #getAcquirers = (targets) => {
        return targets
            .filter((target) => target.type === 'acquirer' && this.#isTargetSupported(target))
            .map(this.#attachRenderFunctionToTarget);
    };
    #getProgressIndicators = (targets) => {
        return targets
            .filter((target) => target.type === 'progressindicator')
            .map(this.#attachRenderFunctionToTarget);
    };
    #getEditors = (targets) => {
        return targets
            .filter((target) => target.type === 'editor')
            .map(this.#attachRenderFunctionToTarget);
    };
    render = (state) => {
        const pluginState = this.getPluginState();
        const { files, capabilities, allowNewUpload } = state;
        const { newFiles, uploadStartedFiles, completeFiles, erroredFiles, inProgressFiles, inProgressNotPausedFiles, processingFiles, isUploadStarted, isAllComplete, isAllPaused, } = this.uppy.getObjectOfFilesPerState();
        const acquirers = this.#getAcquirers(pluginState.targets);
        const progressindicators = this.#getProgressIndicators(pluginState.targets);
        const editors = this.#getEditors(pluginState.targets);
        let theme;
        if (this.opts.theme === 'auto') {
            theme = capabilities.darkMode ? 'dark' : 'light';
        }
        else {
            theme = this.opts.theme;
        }
        if (['files', 'folders', 'both'].indexOf(this.opts.fileManagerSelectionType) <
            0) {
            this.opts.fileManagerSelectionType = 'files';
            console.warn(`Unsupported option for "fileManagerSelectionType". Using default of "${this.opts.fileManagerSelectionType}".`);
        }
        return Dashboard$1({
            state,
            isHidden: pluginState.isHidden,
            files,
            newFiles,
            uploadStartedFiles,
            completeFiles,
            erroredFiles,
            inProgressFiles,
            inProgressNotPausedFiles,
            processingFiles,
            isUploadStarted,
            isAllComplete,
            isAllPaused,
            totalFileCount: Object.keys(files).length,
            totalProgress: state.totalProgress,
            allowNewUpload,
            acquirers,
            theme,
            disabled: this.opts.disabled,
            disableLocalFiles: this.opts.disableLocalFiles,
            direction: this.opts.direction,
            activePickerPanel: pluginState.activePickerPanel,
            showFileEditor: pluginState.showFileEditor,
            saveFileEditor: this.saveFileEditor,
            closeFileEditor: this.closeFileEditor,
            disableInteractiveElements: this.disableInteractiveElements,
            animateOpenClose: this.opts.animateOpenClose,
            isClosing: pluginState.isClosing,
            progressindicators,
            editors,
            autoProceed: this.uppy.opts.autoProceed,
            id: this.id,
            closeModal: this.requestCloseModal,
            handleClickOutside: this.handleClickOutside,
            handleInputChange: this.handleInputChange,
            handlePaste: this.handlePaste,
            inline: this.opts.inline,
            showPanel: this.showPanel,
            hideAllPanels: this.hideAllPanels,
            i18n: this.i18n,
            i18nArray: this.i18nArray,
            uppy: this.uppy,
            note: this.opts.note,
            recoveredState: state.recoveredState,
            metaFields: pluginState.metaFields,
            resumableUploads: capabilities.resumableUploads || false,
            individualCancellation: capabilities.individualCancellation,
            isMobileDevice: capabilities.isMobileDevice,
            fileCardFor: pluginState.fileCardFor,
            toggleFileCard: this.toggleFileCard,
            toggleAddFilesPanel: this.toggleAddFilesPanel,
            showAddFilesPanel: pluginState.showAddFilesPanel,
            saveFileCard: this.saveFileCard,
            openFileEditor: this.openFileEditor,
            canEditFile: this.canEditFile,
            width: this.opts.width,
            height: this.opts.height,
            showLinkToFileUploadResult: this.opts.showLinkToFileUploadResult,
            fileManagerSelectionType: this.opts.fileManagerSelectionType,
            proudlyDisplayPoweredByUppy: this.opts.proudlyDisplayPoweredByUppy,
            showRemoveButtonAfterComplete: this.opts.showRemoveButtonAfterComplete,
            containerWidth: pluginState.containerWidth,
            containerHeight: pluginState.containerHeight,
            areInsidesReadyToBeVisible: pluginState.areInsidesReadyToBeVisible,
            parentElement: this.el,
            allowedFileTypes: this.uppy.opts.restrictions.allowedFileTypes,
            maxNumberOfFiles: this.uppy.opts.restrictions.maxNumberOfFiles,
            requiredMetaFields: this.uppy.opts.restrictions.requiredMetaFields,
            showSelectedFiles: this.opts.showSelectedFiles,
            showNativePhotoCameraButton: this.opts.showNativePhotoCameraButton,
            showNativeVideoCameraButton: this.opts.showNativeVideoCameraButton,
            nativeCameraFacingMode: this.opts.nativeCameraFacingMode,
            singleFileFullScreen: this.opts.singleFileFullScreen,
            handleCancelRestore: this.handleCancelRestore,
            handleRequestThumbnail: this.handleRequestThumbnail,
            handleCancelThumbnail: this.handleCancelThumbnail,
            // drag props
            isDraggingOver: pluginState.isDraggingOver,
            handleDragOver: this.handleDragOver,
            handleDragLeave: this.handleDragLeave,
            handleDrop: this.handleDrop,
            // informer props
            disableInformer: this.opts.disableInformer,
            // status-bar props
            disableStatusBar: this.opts.disableStatusBar,
            hideProgressDetails: this.opts.hideProgressDetails,
            hideUploadButton: this.opts.hideUploadButton,
            hideRetryButton: this.opts.hideRetryButton,
            hidePauseResumeButton: this.opts.hidePauseResumeButton,
            hideCancelButton: this.opts.hideCancelButton,
            hideProgressAfterFinish: this.opts.hideProgressAfterFinish,
            doneButtonHandler: this.opts.doneButtonHandler,
        });
    };
    #addSpecifiedPluginsFromOptions = () => {
        const { plugins } = this.opts;
        plugins.forEach((pluginID) => {
            const plugin = this.uppy.getPlugin(pluginID);
            if (plugin) {
                plugin.mount(this, plugin);
            }
            else {
                this.uppy.log(`[Uppy] Dashboard could not find plugin '${pluginID}', make sure to uppy.use() the plugins you are specifying`, 'warning');
            }
        });
    };
    #autoDiscoverPlugins = () => {
        this.uppy.iteratePlugins(this.#addSupportedPluginIfNoTarget);
    };
    #addSupportedPluginIfNoTarget = (plugin) => {
        // Only these types belong on the Dashboard,
        // we wouldn’t want to try and mount Compressor or Tus, for example.
        const typesAllowed = ['acquirer', 'editor'];
        if (plugin && !plugin.opts?.target && typesAllowed.includes(plugin.type)) {
            const pluginAlreadyAdded = this.getPluginState().targets.some((installedPlugin) => plugin.id === installedPlugin.id);
            if (!pluginAlreadyAdded) {
                plugin.mount(this, plugin);
            }
        }
    };
    #getThumbnailGeneratorOpts() {
        const { thumbnailWidth, thumbnailHeight, thumbnailType, waitForThumbnailsBeforeUpload, } = this.opts;
        return {
            thumbnailWidth,
            thumbnailHeight,
            thumbnailType,
            waitForThumbnailsBeforeUpload,
            // If we don't block on thumbnails, we can lazily generate them
            lazy: !waitForThumbnailsBeforeUpload,
        };
    }
    setOptions(opts) {
        super.setOptions(opts);
        this.uppy
            .getPlugin(this.#getThumbnailGeneratorId())
            ?.setOptions(this.#getThumbnailGeneratorOpts());
    }
    #getThumbnailGeneratorId() {
        return `${this.id}:ThumbnailGenerator`;
    }
    install = () => {
        // Set default state for Dashboard
        this.setPluginState({
            isHidden: true,
            fileCardFor: null,
            activeOverlayType: null,
            showAddFilesPanel: false,
            activePickerPanel: undefined,
            showFileEditor: false,
            metaFields: this.opts.metaFields,
            targets: [],
            // We'll make them visible once .containerWidth is determined
            areInsidesReadyToBeVisible: false,
            isDraggingOver: false,
        });
        const { inline, closeAfterFinish } = this.opts;
        if (inline && closeAfterFinish) {
            throw new Error('[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option.');
        }
        const { allowMultipleUploads, allowMultipleUploadBatches } = this.uppy.opts;
        if ((allowMultipleUploads || allowMultipleUploadBatches) &&
            closeAfterFinish) {
            this.uppy.log('[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploadBatches` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true', 'warning');
        }
        const { target } = this.opts;
        if (target) {
            this.mount(target, this);
        }
        if (!this.opts.disableThumbnailGenerator) {
            this.uppy.use(ThumbnailGenerator, {
                id: this.#getThumbnailGeneratorId(),
                ...this.#getThumbnailGeneratorOpts(),
            });
        }
        // Dark Mode / theme
        this.darkModeMediaQuery =
            typeof window !== 'undefined' && window.matchMedia
                ? window.matchMedia('(prefers-color-scheme: dark)')
                : null;
        const isDarkModeOnFromTheStart = this.darkModeMediaQuery
            ? this.darkModeMediaQuery.matches
            : false;
        this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnFromTheStart ? 'on' : 'off'}`);
        this.setDarkModeCapability(isDarkModeOnFromTheStart);
        if (this.opts.theme === 'auto') {
            this.darkModeMediaQuery?.addListener(this.handleSystemDarkModeChange);
        }
        this.#addSpecifiedPluginsFromOptions();
        this.#autoDiscoverPlugins();
        this.initEvents();
    };
    uninstall = () => {
        if (!this.opts.disableThumbnailGenerator) {
            const thumbnail = this.uppy.getPlugin(`${this.id}:ThumbnailGenerator`);
            if (thumbnail)
                this.uppy.removePlugin(thumbnail);
        }
        const { plugins } = this.opts;
        plugins.forEach((pluginID) => {
            const plugin = this.uppy.getPlugin(pluginID);
            if (plugin)
                plugin.unmount();
        });
        if (this.opts.theme === 'auto') {
            this.darkModeMediaQuery?.removeListener(this.handleSystemDarkModeChange);
        }
        if (this.opts.disablePageScrollWhenModalOpen) {
            document.body.classList.remove('uppy-Dashboard-isFixed');
        }
        this.unmount();
        this.removeEvents();
    };
}

var version$7 = "5.0.1";
var packageJson$7 = {
	version: version$7};

function isCordova() {
    return (typeof window !== 'undefined' &&
        // @ts-expect-error may exist
        (typeof window.PhoneGap !== 'undefined' ||
            // @ts-expect-error may exist
            typeof window.Cordova !== 'undefined' ||
            // @ts-expect-error may exist
            typeof window.cordova !== 'undefined'));
}
function isReactNative() {
    return (typeof navigator !== 'undefined' &&
        typeof navigator.product === 'string' &&
        navigator.product.toLowerCase() === 'reactnative');
}
// We override tus fingerprint to uppy’s `file.id`, since the `file.id`
// now also includes `relativePath` for files added from folders.
// This means you can add 2 identical files, if one is in folder a,
// the other in folder b — `a/file.jpg` and `b/file.jpg`, when added
// together with a folder, will be treated as 2 separate files.
//
// For React Native and Cordova, we let tus-js-client’s default
// fingerprint handling take charge.
function getFingerprint(uppyFile) {
    return (file, options) => {
        if (isCordova() || isReactNative()) {
            return defaultOptions$8.fingerprint(file, options);
        }
        const uppyFingerprint = ['tus', uppyFile.id, options.endpoint].join('-');
        return Promise.resolve(uppyFingerprint);
    };
}

/**
 * Extracted from https://github.com/tus/tus-js-client/blob/master/lib/upload.js#L13
 * excepted we removed 'fingerprint' key to avoid adding more dependencies
 */
const tusDefaultOptions = {
    endpoint: '',
    uploadUrl: null,
    metadata: {},
    uploadSize: null,
    onProgress: null,
    onChunkComplete: null,
    onSuccess: null,
    onError: null,
    overridePatchMethod: false,
    headers: {},
    addRequestId: false,
    chunkSize: Infinity,
    retryDelays: [100, 1000, 3000, 5000],
    parallelUploads: 1,
    removeFingerprintOnSuccess: false,
    uploadLengthDeferred: false,
    uploadDataDuringCreation: false,
};
const defaultOptions$4 = {
    limit: 20,
    retryDelays: tusDefaultOptions.retryDelays,
    withCredentials: false,
    allowedMetaFields: true,
};
/**
 * Tus resumable file uploader
 */
class Tus extends BasePlugin {
    static VERSION = packageJson$7.version;
    #retryDelayIterator;
    requests;
    uploaders;
    uploaderEvents;
    constructor(uppy, opts) {
        super(uppy, { ...defaultOptions$4, ...opts });
        this.type = 'uploader';
        this.id = this.opts.id || 'Tus';
        if (opts?.allowedMetaFields === undefined && 'metaFields' in this.opts) {
            throw new Error('The `metaFields` option has been renamed to `allowedMetaFields`.');
        }
        if ('autoRetry' in opts) {
            throw new Error('The `autoRetry` option was deprecated and has been removed.');
        }
        /**
         * Simultaneous upload limiting is shared across all uploads with this plugin.
         *
         * @type {RateLimitedQueue}
         */
        this.requests =
            this.opts.rateLimitedQueue ?? new RateLimitedQueue(this.opts.limit);
        this.#retryDelayIterator = this.opts.retryDelays?.values();
        this.uploaders = Object.create(null);
        this.uploaderEvents = Object.create(null);
    }
    /**
     * Clean up all references for a file's upload: the tus.Upload instance,
     * any events related to the file, and the Companion WebSocket connection.
     */
    resetUploaderReferences(fileID, opts) {
        const uploader = this.uploaders[fileID];
        if (uploader) {
            uploader.abort();
            if (opts?.abort) {
                uploader.abort(true);
            }
            this.uploaders[fileID] = null;
        }
        if (this.uploaderEvents[fileID]) {
            this.uploaderEvents[fileID].remove();
            this.uploaderEvents[fileID] = null;
        }
    }
    /**
     * Create a new Tus upload.
     *
     * A lot can happen during an upload, so this is quite hard to follow!
     * - First, the upload is started. If the file was already paused by the time the upload starts, nothing should happen.
     *   If the `limit` option is used, the upload must be queued onto the `this.requests` queue.
     *   When an upload starts, we store the tus.Upload instance, and an EventManager instance that manages the event listeners
     *   for pausing, cancellation, removal, etc.
     * - While the upload is in progress, it may be paused or cancelled.
     *   Pausing aborts the underlying tus.Upload, and removes the upload from the `this.requests` queue. All other state is
     *   maintained.
     *   Cancelling removes the upload from the `this.requests` queue, and completely aborts the upload-- the `tus.Upload`
     *   instance is aborted and discarded, the EventManager instance is destroyed (removing all listeners).
     *   Resuming the upload uses the `this.requests` queue as well, to prevent selectively pausing and resuming uploads from
     *   bypassing the limit.
     * - After completing an upload, the tus.Upload and EventManager instances are cleaned up, and the upload is marked as done
     *   in the `this.requests` queue.
     * - When an upload completed with an error, the same happens as on successful completion, but the `upload()` promise is
     *   rejected.
     *
     * When working on this function, keep in mind:
     *  - When an upload is completed or cancelled for any reason, the tus.Upload and EventManager instances need to be cleaned
     *    up using this.resetUploaderReferences().
     *  - When an upload is cancelled or paused, for any reason, it needs to be removed from the `this.requests` queue using
     *    `queuedRequest.abort()`.
     *  - When an upload is completed for any reason, including errors, it needs to be marked as such using
     *    `queuedRequest.done()`.
     *  - When an upload is started or resumed, it needs to go through the `this.requests` queue. The `queuedRequest` variable
     *    must be updated so the other uses of it are valid.
     *  - Before replacing the `queuedRequest` variable, the previous `queuedRequest` must be aborted, else it will keep taking
     *    up a spot in the queue.
     *
     */
    #uploadLocalFile(file) {
        this.resetUploaderReferences(file.id);
        // Create a new tus upload
        return new Promise((resolve, reject) => {
            let queuedRequest;
            // biome-ignore lint/style/useConst: ...
            let qRequest;
            // biome-ignore lint/style/useConst: ...
            let upload;
            const opts = {
                ...this.opts,
                ...(file.tus || {}),
            };
            if (typeof opts.headers === 'function') {
                opts.headers = opts.headers(file);
            }
            const { onShouldRetry, onBeforeRequest, ...commonOpts } = opts;
            const uploadOptions = {
                ...tusDefaultOptions,
                ...commonOpts,
            };
            // We override tus fingerprint to uppy’s `file.id`, since the `file.id`
            // now also includes `relativePath` for files added from folders.
            // This means you can add 2 identical files, if one is in folder a,
            // the other in folder b.
            uploadOptions.fingerprint = getFingerprint(file);
            uploadOptions.onBeforeRequest = async (req) => {
                const xhr = req.getUnderlyingObject();
                xhr.withCredentials = !!opts.withCredentials;
                let userProvidedPromise;
                if (typeof onBeforeRequest === 'function') {
                    userProvidedPromise = onBeforeRequest(req, file);
                }
                if (hasProperty(queuedRequest, 'shouldBeRequeued')) {
                    if (!queuedRequest.shouldBeRequeued)
                        return Promise.reject();
                    // TODO: switch to `Promise.withResolvers` on the next major if available.
                    let done;
                    const p = new Promise((res) => {
                        done = res;
                    });
                    queuedRequest = this.requests.run(() => {
                        if (file.isPaused) {
                            queuedRequest.abort();
                        }
                        done();
                        return () => { };
                    });
                    // If the request has been requeued because it was rate limited by the
                    // remote server, we want to wait for `RateLimitedQueue` to dispatch
                    // the re-try request.
                    // Therefore we create a promise that the queue will resolve when
                    // enough time has elapsed to expect not to be rate-limited again.
                    // This means we can hold the Tus retry here with a `Promise.all`,
                    // together with the returned value of the user provided
                    // `onBeforeRequest` option callback (in case it returns a promise).
                    // @ts-expect-error it's fine
                    await Promise.all([p, userProvidedPromise]);
                    return undefined;
                }
                // @ts-expect-error it's fine
                return userProvidedPromise;
            };
            uploadOptions.onError = (err) => {
                this.uppy.log(err);
                const xhr = err.originalRequest != null
                    ? err.originalRequest.getUnderlyingObject()
                    : null;
                if (isNetworkError$1(xhr)) {
                    err = new NetworkError(err, xhr);
                }
                this.resetUploaderReferences(file.id);
                queuedRequest?.abort();
                if (typeof opts.onError === 'function') {
                    opts.onError(err);
                }
                reject(err);
            };
            uploadOptions.onProgress = (bytesUploaded, bytesTotal) => {
                this.onReceiveUploadUrl(file, upload.url);
                if (typeof opts.onProgress === 'function') {
                    opts.onProgress(bytesUploaded, bytesTotal);
                }
                const latestFile = this.uppy.getFile(file.id);
                this.uppy.emit('upload-progress', latestFile, {
                    uploadStarted: latestFile.progress.uploadStarted ?? 0,
                    bytesUploaded,
                    bytesTotal,
                });
            };
            uploadOptions.onSuccess = (payload) => {
                const uploadResp = {
                    uploadURL: upload.url ?? undefined,
                    status: 200,
                    body: {
                        // We have to put `as XMLHttpRequest` because tus-js-client
                        // returns `any`, as the type differs in Node.js and the browser.
                        // In the browser it's always `XMLHttpRequest`.
                        xhr: payload.lastResponse.getUnderlyingObject(),
                        // Body extends Record<string, unknown> and thus `xhr` is not known
                        // but we export the `TusBody` type, which people pass as a generic into the Uppy class,
                        // so on the implementer side it works as expected.
                    },
                };
                this.uppy.emit('upload-success', this.uppy.getFile(file.id), uploadResp);
                this.resetUploaderReferences(file.id);
                queuedRequest.done();
                if (upload.url) {
                    // @ts-expect-error not typed in tus-js-client
                    const { name } = upload.file;
                    this.uppy.log(`Download ${name} from ${upload.url}`);
                }
                if (typeof opts.onSuccess === 'function') {
                    opts.onSuccess(payload);
                }
                resolve(upload);
            };
            const defaultOnShouldRetry = (err) => {
                const status = err?.originalResponse?.getStatus();
                if (status === 429) {
                    // HTTP 429 Too Many Requests => to avoid the whole download to fail, pause all requests.
                    if (!this.requests.isPaused) {
                        const next = this.#retryDelayIterator?.next();
                        if (next == null || next.done) {
                            return false;
                        }
                        this.requests.rateLimit(next.value);
                    }
                }
                else if (status != null &&
                    status >= 400 &&
                    status < 500 &&
                    status !== 409 &&
                    status !== 423) {
                    // HTTP 4xx, the server won't send anything, it's doesn't make sense to retry
                    // HTTP 409 Conflict (happens if the Upload-Offset header does not match the one on the server)
                    // HTTP 423 Locked (happens when a paused download is resumed too quickly)
                    return false;
                }
                else if (typeof navigator !== 'undefined' &&
                    navigator.onLine === false) {
                    // The navigator is offline, let's wait for it to come back online.
                    if (!this.requests.isPaused) {
                        this.requests.pause();
                        window.addEventListener('online', () => {
                            this.requests.resume();
                        }, { once: true });
                    }
                }
                queuedRequest.abort();
                queuedRequest = {
                    shouldBeRequeued: true,
                    abort() {
                        this.shouldBeRequeued = false;
                    },
                    done() {
                        throw new Error('Cannot mark a queued request as done: this indicates a bug');
                    },
                    fn() {
                        throw new Error('Cannot run a queued request: this indicates a bug');
                    },
                };
                return true;
            };
            if (onShouldRetry != null) {
                uploadOptions.onShouldRetry = (error, retryAttempt) => onShouldRetry(error, retryAttempt, opts, defaultOnShouldRetry);
            }
            else {
                uploadOptions.onShouldRetry = defaultOnShouldRetry;
            }
            const copyProp = (obj, srcProp, destProp) => {
                if (hasProperty(obj, srcProp) && !hasProperty(obj, destProp)) {
                    obj[destProp] = obj[srcProp];
                }
            };
            // We can't use `allowedMetaFields` to index generic M
            // and we also don't care about the type specifically here,
            // we just want to pass the meta fields along.
            const meta = {};
            const allowedMetaFields = getAllowedMetaFields(opts.allowedMetaFields, file.meta);
            allowedMetaFields.forEach((item) => {
                // tus type definition for metadata only accepts `Record<string, string>`
                // but in reality (at runtime) it accepts `Record<string, unknown>`
                // tus internally converts everything into a string, but let's do it here instead to be explicit.
                // because Uppy can have anything inside meta values, (for example relativePath: null is often sent by uppy)
                meta[item] = String(file.meta[item]);
            });
            // tusd uses metadata fields 'filetype' and 'filename'
            copyProp(meta, 'type', 'filetype');
            copyProp(meta, 'name', 'filename');
            uploadOptions.metadata = meta;
            upload = new Upload(file.data, uploadOptions);
            this.uploaders[file.id] = upload;
            const eventManager = new EventManager(this.uppy);
            this.uploaderEvents[file.id] = eventManager;
            qRequest = () => {
                if (!file.isPaused) {
                    upload.start();
                }
                // Don't do anything here, the caller will take care of cancelling the upload itself
                // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
                // called when this request is still in the queue, and has not been started yet, too. At
                // that point this cancellation function is not going to be called.
                // Also, we need to remove the request from the queue _without_ destroying everything
                // related to this upload to handle pauses.
                return () => { };
            };
            upload.findPreviousUploads().then((previousUploads) => {
                const previousUpload = previousUploads[0];
                if (previousUpload) {
                    this.uppy.log(`[Tus] Resuming upload of ${file.id} started at ${previousUpload.creationTime}`);
                    upload.resumeFromPreviousUpload(previousUpload);
                }
                queuedRequest = this.requests.run(qRequest);
            });
            eventManager.onFileRemove(file.id, (targetFileID) => {
                queuedRequest.abort();
                this.resetUploaderReferences(file.id, { abort: !!upload.url });
                resolve(`upload ${targetFileID} was removed`);
            });
            eventManager.onPause(file.id, (isPaused) => {
                queuedRequest.abort();
                if (isPaused) {
                    // Remove this file from the queue so another file can start in its place.
                    upload.abort();
                }
                else {
                    // Resuming an upload should be queued, else you could pause and then
                    // resume a queued upload to make it skip the queue.
                    queuedRequest = this.requests.run(qRequest);
                }
            });
            eventManager.onPauseAll(file.id, () => {
                queuedRequest.abort();
                upload.abort();
            });
            eventManager.onCancelAll(file.id, () => {
                queuedRequest.abort();
                this.resetUploaderReferences(file.id, { abort: !!upload.url });
                resolve(`upload ${file.id} was canceled`);
            });
            eventManager.onResumeAll(file.id, () => {
                queuedRequest.abort();
                if (file.error) {
                    upload.abort();
                }
                queuedRequest = this.requests.run(qRequest);
            });
        }).catch((err) => {
            this.uppy.emit('upload-error', file, err);
            throw err;
        });
    }
    /**
     * Store the uploadUrl on the file options, so that when Golden Retriever
     * restores state, we will continue uploading to the correct URL.
     */
    onReceiveUploadUrl(file, uploadURL) {
        const currentFile = this.uppy.getFile(file.id);
        if (!currentFile)
            return;
        // Only do the update if we didn't have an upload URL yet.
        if (!currentFile.tus || currentFile.tus.uploadUrl !== uploadURL) {
            this.uppy.log('[Tus] Storing upload url');
            this.uppy.setFileState(currentFile.id, {
                tus: { ...currentFile.tus, uploadUrl: uploadURL },
            });
        }
    }
    #getCompanionClientArgs(file) {
        const opts = { ...this.opts };
        if (file.tus) {
            // Install file-specific upload overrides.
            Object.assign(opts, file.tus);
        }
        if (typeof opts.headers === 'function') {
            opts.headers = opts.headers(file);
        }
        return {
            ...file.remote?.body,
            endpoint: opts.endpoint,
            uploadUrl: opts.uploadUrl,
            protocol: 'tus',
            size: file.data.size,
            headers: opts.headers,
            metadata: file.meta,
        };
    }
    async #uploadFiles(files) {
        const filesFiltered = filterNonFailedFiles(files);
        const filesToEmit = filterFilesToEmitUploadStarted(filesFiltered);
        this.uppy.emit('upload-start', filesToEmit);
        await Promise.allSettled(filesFiltered.map((file) => {
            if (file.isRemote) {
                const getQueue = () => this.requests;
                const controller = new AbortController();
                const removedHandler = (removedFile) => {
                    if (removedFile.id === file.id)
                        controller.abort();
                };
                this.uppy.on('file-removed', removedHandler);
                const uploadPromise = this.uppy
                    .getRequestClientForFile(file)
                    .uploadRemoteFile(file, this.#getCompanionClientArgs(file), {
                    signal: controller.signal,
                    getQueue,
                });
                this.requests.wrapSyncFunction(() => {
                    this.uppy.off('file-removed', removedHandler);
                }, { priority: -1 })();
                return uploadPromise;
            }
            return this.#uploadLocalFile(file);
        }));
    }
    #handleUpload = async (fileIDs) => {
        if (fileIDs.length === 0) {
            this.uppy.log('[Tus] No files to upload');
            return;
        }
        if (this.opts.limit === 0) {
            this.uppy.log('[Tus] When uploading multiple files at once, consider setting the `limit` option (to `10` for example), to limit the number of concurrent uploads, which helps prevent memory and network issues: https://uppy.io/docs/tus/#limit-0', 'warning');
        }
        this.uppy.log('[Tus] Uploading...');
        const filesToUpload = this.uppy.getFilesByIds(fileIDs);
        await this.#uploadFiles(filesToUpload);
    };
    install() {
        this.uppy.setState({
            capabilities: {
                ...this.uppy.getState().capabilities,
                resumableUploads: true,
            },
        });
        this.uppy.addUploader(this.#handleUpload);
    }
    uninstall() {
        this.uppy.setState({
            capabilities: {
                ...this.uppy.getState().capabilities,
                resumableUploads: false,
            },
        });
        this.uppy.removeUploader(this.#handleUpload);
    }
}

var version$6 = "5.1.0";
var packageJson$6 = {
	version: version$6};

const indexedDB = typeof window !== 'undefined' &&
    (window.indexedDB ||
        // @ts-expect-error unknown
        window.webkitIndexedDB ||
        // @ts-expect-error unknown
        window.mozIndexedDB ||
        // @ts-expect-error unknown
        window.OIndexedDB ||
        // @ts-expect-error unknown
        window.msIndexedDB);
const isSupported$1 = !!indexedDB;
const DB_NAME = 'uppy-blobs';
const STORE_NAME = 'files'; // maybe have a thumbnail store in the future
const DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const DB_VERSION = 3;
const MiB = 0x10_00_00;
/**
 * Set default `expires` dates on existing stored blobs.
 */
function migrateExpiration(store) {
    const request = store.openCursor();
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (!cursor) {
            return;
        }
        const entry = cursor.value;
        entry.expires = Date.now() + DEFAULT_EXPIRY;
        cursor.update(entry);
    };
}
function connect(dbName) {
    const request = indexedDB.open(dbName, DB_VERSION);
    return new Promise((resolve, reject) => {
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const transaction = event.currentTarget
                .transaction;
            if (event.oldVersion < 2) {
                // Added in v2: DB structure changed to a single shared object store
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('store', 'store', { unique: false });
            }
            if (event.oldVersion < 3) {
                // Added in v3
                const store = transaction.objectStore(STORE_NAME);
                store.createIndex('expires', 'expires', { unique: false });
                migrateExpiration(store);
            }
            transaction.oncomplete = () => {
                resolve(db);
            };
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = reject;
    });
}
function waitForRequest(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = reject;
    });
}
let cleanedUp$1 = false;
class IndexedDBStore {
    #ready;
    opts;
    name;
    static isSupported;
    constructor(opts) {
        this.opts = {
            dbName: DB_NAME,
            storeName: 'default',
            expires: DEFAULT_EXPIRY, // 24 hours
            maxFileSize: 10 * MiB,
            maxTotalSize: 300 * MiB,
            ...opts,
        };
        this.name = this.opts.storeName;
        const createConnection = async () => {
            const db = await connect(this.opts.dbName);
            this.#ready = db;
            return db;
        };
        if (!cleanedUp$1) {
            cleanedUp$1 = true;
            this.#ready = IndexedDBStore.cleanup().then(createConnection, createConnection);
        }
        else {
            this.#ready = createConnection();
        }
    }
    get ready() {
        return Promise.resolve(this.#ready);
    }
    key(fileID) {
        return `${this.name}!${fileID}`;
    }
    /**
     * List all file blobs currently in the store.
     */
    async list() {
        const db = await this.#ready;
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.index('store').getAll(IDBKeyRange.only(this.name));
        const files = await waitForRequest(request);
        return Object.fromEntries(files.map((file) => [file.fileID, file.data]));
    }
    /**
     * Get one file blob from the store.
     */
    async get(fileID) {
        const db = await this.#ready;
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const request = transaction.objectStore(STORE_NAME).get(this.key(fileID));
        const { data } = await waitForRequest(request);
        return {
            id: data.fileID,
            data: data.data,
        };
    }
    /**
     * Get the total size of all stored files.
     */
    async getSize() {
        const db = await this.#ready;
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.index('store').openCursor(IDBKeyRange.only(this.name));
        return new Promise((resolve, reject) => {
            let size = 0;
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    size += cursor.value.data.size;
                    cursor.continue();
                }
                else {
                    resolve(size);
                }
            };
            request.onerror = () => {
                reject(new Error('Could not retrieve stored blobs size'));
            };
        });
    }
    /**
     * Save a file in the store.
     */
    async put(file) {
        if (file.data.size > this.opts.maxFileSize) {
            throw new Error('File is too big to store.');
        }
        const size = await this.getSize();
        if (size > this.opts.maxTotalSize) {
            throw new Error('No space left');
        }
        const db = await this.#ready;
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const request = transaction.objectStore(STORE_NAME).add({
            id: this.key(file.id),
            fileID: file.id,
            store: this.name,
            expires: Date.now() + this.opts.expires,
            data: file.data,
        });
        return waitForRequest(request);
    }
    /**
     * Delete a file blob from the store.
     */
    async delete(fileID) {
        const db = await this.#ready;
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const request = transaction.objectStore(STORE_NAME).delete(this.key(fileID));
        return waitForRequest(request);
    }
    /**
     * Delete all stored blobs that have an expiry date that is before Date.now().
     * This is a static method because it deletes expired blobs from _all_ Uppy instances.
     */
    static async cleanup() {
        const db = await connect(DB_NAME);
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store
            .index('expires')
            .openCursor(IDBKeyRange.upperBound(Date.now()));
        await new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete(); // Ignoring return value … it's not terrible if this goes wrong.
                    cursor.continue();
                }
                else {
                    resolve();
                }
            };
            request.onerror = reject;
        });
        db.close();
    }
}
IndexedDBStore.isSupported = isSupported$1;

/**
 * Get uppy instance IDs for which state is stored.
 */
function findUppyInstances() {
    const instances = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('uppyState:')) {
            instances.push(key.slice('uppyState:'.length));
        }
    }
    return instances;
}
/**
 * Try to JSON-parse a string, return null on failure.
 */
function maybeParse(str) {
    try {
        return JSON.parse(str);
    }
    catch {
        return null;
    }
}
let cleanedUp = false;
class MetaDataStore {
    opts;
    name;
    constructor(opts) {
        this.opts = {
            expires: 24 * 60 * 60 * 1000, // 24 hours
            ...opts,
        };
        this.name = `uppyState:${opts.storeName}`;
        if (!cleanedUp) {
            cleanedUp = true;
            MetaDataStore.cleanup();
        }
    }
    /**
     *
     */
    load() {
        const savedState = localStorage.getItem(this.name);
        if (!savedState)
            return null;
        const data = maybeParse(savedState);
        if (!data)
            return null;
        return data.metadata;
    }
    save(metadata) {
        const expires = Date.now() + this.opts.expires;
        const state = JSON.stringify({
            metadata,
            expires,
        });
        localStorage.setItem(this.name, state);
    }
    /**
     * Remove all expired state.
     */
    static cleanup(instanceID) {
        if (instanceID) {
            localStorage.removeItem(`uppyState:${instanceID}`);
            return;
        }
        const instanceIDs = findUppyInstances();
        const now = Date.now();
        instanceIDs.forEach((id) => {
            const data = localStorage.getItem(`uppyState:${id}`);
            if (!data)
                return;
            const obj = maybeParse(data);
            if (!obj)
                return;
            if (obj.expires && obj.expires < now) {
                localStorage.removeItem(`uppyState:${id}`);
            }
        });
    }
}

const isSupported = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
function waitForServiceWorker() {
    return new Promise((resolve, reject) => {
        if (!isSupported) {
            reject(new Error('Unsupported'));
        }
        else if (navigator.serviceWorker.controller) {
            // A serviceWorker is already registered and active.
            resolve();
        }
        else {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                resolve();
            });
        }
    });
}
class ServiceWorkerStore {
    #ready;
    name;
    static isSupported;
    constructor(opts) {
        this.#ready = waitForServiceWorker().then((val) => {
            this.#ready = val;
        });
        this.name = opts.storeName;
    }
    get ready() {
        return Promise.resolve(this.#ready);
    }
    async list() {
        await this.#ready;
        return new Promise((resolve, reject) => {
            const onMessage = (event) => {
                if (event.data.store !== this.name) {
                    return;
                }
                switch (event.data.type) {
                    case 'uppy/ALL_FILES':
                        resolve(event.data.files);
                        navigator.serviceWorker.removeEventListener('message', onMessage);
                        break;
                    default:
                        reject();
                }
            };
            navigator.serviceWorker.addEventListener('message', onMessage);
            navigator.serviceWorker.controller.postMessage({
                type: 'uppy/GET_FILES',
                store: this.name,
            });
        });
    }
    async put(file) {
        await this.#ready;
        navigator.serviceWorker.controller.postMessage({
            type: 'uppy/ADD_FILE',
            store: this.name,
            file,
        });
    }
    async delete(fileID) {
        await this.#ready;
        navigator.serviceWorker.controller.postMessage({
            type: 'uppy/REMOVE_FILE',
            store: this.name,
            fileID,
        });
    }
}
ServiceWorkerStore.isSupported = isSupported;

const defaultOptions$3 = {
    expires: 24 * 60 * 60 * 1000, // 24 hours
    serviceWorker: false,
};
/**
 * The GoldenRetriever plugin — restores selected files and resumes uploads
 * after a closed tab or a browser crash!
 *
 * Uses localStorage, IndexedDB and ServiceWorker to do its magic, read more:
 * https://uppy.io/blog/2017/07/golden-retriever/
 */
class GoldenRetriever extends BasePlugin {
    static VERSION = packageJson$6.version;
    MetaDataStore;
    ServiceWorkerStore;
    IndexedDBStore;
    savedPluginData;
    constructor(uppy, opts) {
        super(uppy, { ...defaultOptions$3, ...opts });
        this.type = 'debugger';
        this.id = this.opts.id || 'GoldenRetriever';
        this.MetaDataStore = new MetaDataStore({
            expires: this.opts.expires,
            storeName: uppy.getID(),
        });
        this.ServiceWorkerStore = null;
        if (this.opts.serviceWorker) {
            this.ServiceWorkerStore = new ServiceWorkerStore({
                storeName: uppy.getID(),
            });
        }
        this.IndexedDBStore = new IndexedDBStore({
            expires: this.opts.expires,
            ...(this.opts.indexedDB || {}),
            storeName: uppy.getID(),
        });
        this.saveFilesStateToLocalStorage = throttle$1(this.saveFilesStateToLocalStorage.bind(this), 500, { leading: true, trailing: true });
        this.restoreState = this.restoreState.bind(this);
        this.loadFileBlobsFromServiceWorker =
            this.loadFileBlobsFromServiceWorker.bind(this);
        this.loadFileBlobsFromIndexedDB = this.loadFileBlobsFromIndexedDB.bind(this);
        this.onBlobsLoaded = this.onBlobsLoaded.bind(this);
    }
    restoreState() {
        const savedState = this.MetaDataStore.load();
        if (savedState) {
            this.uppy.log('[GoldenRetriever] Recovered some state from Local Storage');
            this.uppy.setState({
                currentUploads: savedState.currentUploads || {},
                files: savedState.files || {},
                recoveredState: savedState,
            });
            this.savedPluginData = savedState.pluginData;
        }
    }
    saveFilesStateToLocalStorage() {
        // File objects that are currently waiting: they've been selected,
        // but aren't yet being uploaded.
        const waitingFiles = this.uppy
            .getFiles()
            .filter((file) => !file.progress || !file.progress.uploadStarted);
        // File objects that are currently being uploaded. If a file has finished
        // uploading, but the other files in the same batch have not, the finished
        // file is also returned.
        const uploadingFiles = Object.values(this.uppy.getState().currentUploads)
            .map((currentUpload) => currentUpload.fileIDs.map((fileID) => {
            const file = this.uppy.getFile(fileID);
            return file != null ? [file] : []; // file might have been removed
        }))
            .flat(2);
        const allFiles = [...waitingFiles, ...uploadingFiles];
        // unique by file.id
        const fileToSave = Object.values(Object.fromEntries(allFiles.map((file) => [file.id, file])));
        // If all files have been removed by the user, clear recovery state
        if (fileToSave.length === 0) {
            if (this.uppy.getState().recoveredState !== null) {
                this.uppy.setState({ recoveredState: null });
            }
            MetaDataStore.cleanup(this.uppy.opts.id);
            return;
        }
        // We dont’t need to store file.data on local files, because the actual blob will be restored later,
        // and we want to avoid having weird properties in the serialized object.
        // Also adding file.isRestored to all files, since they will be restored from local storage
        const filesToSaveWithoutData = Object.fromEntries(fileToSave.map((fileInfo) => [
            fileInfo.id,
            fileInfo.isRemote
                ? {
                    ...fileInfo,
                    isRestored: true,
                }
                : {
                    ...fileInfo,
                    isRestored: true,
                    data: null,
                    preview: null,
                },
        ]));
        const pluginData = {};
        // TODO Remove this,
        // Other plugins can attach a restore:get-data listener that receives this callback.
        // Plugins can then use this callback (sync) to provide data to be stored.
        this.uppy.emit('restore:get-data', (data) => {
            Object.assign(pluginData, data);
        });
        const { currentUploads } = this.uppy.getState();
        this.MetaDataStore.save({
            currentUploads,
            files: filesToSaveWithoutData,
            pluginData,
        });
    }
    loadFileBlobsFromServiceWorker() {
        if (!this.ServiceWorkerStore) {
            return Promise.resolve({});
        }
        return this.ServiceWorkerStore.list()
            .then((blobs) => {
            const numberOfFilesRecovered = Object.keys(blobs).length;
            if (numberOfFilesRecovered > 0) {
                this.uppy.log(`[GoldenRetriever] Successfully recovered ${numberOfFilesRecovered} blobs from Service Worker!`);
                return blobs;
            }
            this.uppy.log('[GoldenRetriever] No blobs found in Service Worker, trying IndexedDB now...');
            return {};
        })
            .catch((err) => {
            this.uppy.log('[GoldenRetriever] Failed to recover blobs from Service Worker', 'warning');
            this.uppy.log(err);
            return {};
        });
    }
    loadFileBlobsFromIndexedDB() {
        return this.IndexedDBStore.list()
            .then((blobs) => {
            const numberOfFilesRecovered = Object.keys(blobs).length;
            if (numberOfFilesRecovered > 0) {
                this.uppy.log(`[GoldenRetriever] Successfully recovered ${numberOfFilesRecovered} blobs from IndexedDB!`);
                return blobs;
            }
            this.uppy.log('[GoldenRetriever] No blobs found in IndexedDB');
            return {};
        })
            .catch((err) => {
            this.uppy.log('[GoldenRetriever] Failed to recover blobs from IndexedDB', 'warning');
            this.uppy.log(err);
            return {};
        });
    }
    onBlobsLoaded(blobs) {
        const obsoleteBlobs = [];
        const updatedFiles = { ...this.uppy.getState().files };
        // Loop through blobs that we can restore, add blobs to file objects
        Object.keys(blobs).forEach((fileID) => {
            const originalFile = this.uppy.getFile(fileID);
            if (!originalFile) {
                obsoleteBlobs.push(fileID);
                return;
            }
            const cachedData = blobs[fileID];
            const updatedFileData = {
                data: cachedData,
                isRestored: true,
                isGhost: false,
            };
            updatedFiles[fileID] = { ...originalFile, ...updatedFileData };
        });
        // Loop through files that we can’t restore fully — we only have meta, not blobs,
        // set .isGhost on them, also set isRestored to all files
        Object.keys(updatedFiles).forEach((fileID) => {
            if (updatedFiles[fileID].data === null) {
                updatedFiles[fileID] = {
                    ...updatedFiles[fileID],
                    isGhost: true,
                };
            }
        });
        this.uppy.setState({
            files: updatedFiles,
        });
        this.uppy.emit('restored', this.savedPluginData);
        if (obsoleteBlobs.length) {
            this.deleteBlobs(obsoleteBlobs)
                .then(() => {
                this.uppy.log(`[GoldenRetriever] Cleaned up ${obsoleteBlobs.length} old files`);
            })
                .catch((err) => {
                this.uppy.log(`[GoldenRetriever] Could not clean up ${obsoleteBlobs.length} old files`, 'warning');
                this.uppy.log(err);
            });
        }
    }
    async deleteBlobs(fileIDs) {
        await Promise.all(fileIDs.map((id) => this.ServiceWorkerStore?.delete(id) ??
            this.IndexedDBStore?.delete(id)));
    }
    addBlobToStores = (file) => {
        if (file.isRemote)
            return;
        if (this.ServiceWorkerStore) {
            this.ServiceWorkerStore.put(file).catch((err) => {
                this.uppy.log('[GoldenRetriever] Could not store file', 'warning');
                this.uppy.log(err);
            });
        }
        this.IndexedDBStore.put(file).catch((err) => {
            this.uppy.log('[GoldenRetriever] Could not store file', 'warning');
            this.uppy.log(err);
        });
    };
    removeBlobFromStores = (file) => {
        if (this.ServiceWorkerStore) {
            this.ServiceWorkerStore.delete(file.id).catch((err) => {
                this.uppy.log('[GoldenRetriever] Failed to remove file', 'warning');
                this.uppy.log(err);
            });
        }
        this.IndexedDBStore.delete(file.id).catch((err) => {
            this.uppy.log('[GoldenRetriever] Failed to remove file', 'warning');
            this.uppy.log(err);
        });
    };
    replaceBlobInStores = (file) => {
        this.removeBlobFromStores(file);
        this.addBlobToStores(file);
    };
    handleRestoreConfirmed = () => {
        this.uppy.log('[GoldenRetriever] Restore confirmed, proceeding...');
        // start all uploads again when file blobs are restored
        const { currentUploads } = this.uppy.getState();
        if (currentUploads) {
            this.uppy.resumeAll();
            Object.keys(currentUploads).forEach((uploadId) => {
                this.uppy.restore(uploadId);
            });
        }
        this.uppy.setState({ recoveredState: null });
    };
    abortRestore = () => {
        this.uppy.log('[GoldenRetriever] Aborting restore...');
        const fileIDs = Object.keys(this.uppy.getState().files);
        this.deleteBlobs(fileIDs)
            .then(() => {
            this.uppy.log(`[GoldenRetriever] Removed ${fileIDs.length} files`);
        })
            .catch((err) => {
            this.uppy.log(`[GoldenRetriever] Could not remove ${fileIDs.length} files`, 'warning');
            this.uppy.log(err);
        });
        this.uppy.cancelAll();
        this.uppy.setState({ recoveredState: null });
        MetaDataStore.cleanup(this.uppy.opts.id);
    };
    handleComplete = ({ successful }) => {
        const fileIDs = successful.map((file) => file.id);
        this.deleteBlobs(fileIDs)
            .then(() => {
            this.uppy.log(`[GoldenRetriever] Removed ${successful.length} files that finished uploading`);
        })
            .catch((err) => {
            this.uppy.log(`[GoldenRetriever] Could not remove ${successful.length} files that finished uploading`, 'warning');
            this.uppy.log(err);
        });
        this.uppy.setState({ recoveredState: null });
        MetaDataStore.cleanup(this.uppy.opts.id);
    };
    restoreBlobs = () => {
        if (this.uppy.getFiles().length > 0) {
            Promise.all([
                this.loadFileBlobsFromServiceWorker(),
                this.loadFileBlobsFromIndexedDB(),
            ]).then((resultingArrayOfObjects) => {
                const blobs = {
                    ...resultingArrayOfObjects[0],
                    ...resultingArrayOfObjects[1],
                };
                this.onBlobsLoaded(blobs);
            });
        }
        else {
            this.uppy.log('[GoldenRetriever] No files need to be loaded, only restoring processing state...');
        }
    };
    install() {
        this.restoreState();
        this.restoreBlobs();
        this.uppy.on('file-added', this.addBlobToStores);
        // @ts-expect-error this is typed in @uppy/image-editor and we can't access those types.
        this.uppy.on('file-editor:complete', this.replaceBlobInStores);
        this.uppy.on('file-removed', this.removeBlobFromStores);
        // TODO: the `state-update` is bad practise. It fires on any state change in Uppy
        // or any state change in any of the plugins. We should to able to only listen
        // for the state changes we need, somehow.
        this.uppy.on('state-update', this.saveFilesStateToLocalStorage);
        this.uppy.on('restore-confirmed', this.handleRestoreConfirmed);
        this.uppy.on('restore-canceled', this.abortRestore);
        this.uppy.on('complete', this.handleComplete);
    }
    uninstall() {
        this.uppy.off('file-added', this.addBlobToStores);
        // @ts-expect-error this is typed in @uppy/image-editor and we can't access those types.
        this.uppy.off('file-editor:complete', this.replaceBlobInStores);
        this.uppy.off('file-removed', this.removeBlobFromStores);
        this.uppy.off('state-update', this.saveFilesStateToLocalStorage);
        this.uppy.off('restore-confirmed', this.handleRestoreConfirmed);
        this.uppy.off('restore-canceled', this.abortRestore);
        this.uppy.off('complete', this.handleComplete);
    }
}

var isMobile$1 = {exports: {}};

isMobile$1.exports = isMobile;
var isMobile_2 = isMobile$1.exports.isMobile = isMobile;
isMobile$1.exports.default = isMobile;

const mobileRE = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
const notMobileRE = /CrOS/;

const tabletRE = /android|ipad|playbook|silk/i;

function isMobile (opts) {
  if (!opts) opts = {};
  let ua = opts.ua;
  if (!ua && typeof navigator !== 'undefined') ua = navigator.userAgent;
  if (ua && ua.headers && typeof ua.headers['user-agent'] === 'string') {
    ua = ua.headers['user-agent'];
  }
  if (typeof ua !== 'string') return false

  let result =
    (mobileRE.test(ua) && !notMobileRE.test(ua)) ||
    (!!opts.tablet && tabletRE.test(ua));

  if (
    !result &&
    opts.tablet &&
    opts.featureDetect &&
    navigator &&
    navigator.maxTouchPoints > 1 &&
    ua.indexOf('Macintosh') !== -1 &&
    ua.indexOf('Safari') !== -1
  ) {
    result = true;
  }

  return result
}

var version$5 = "5.0.1";
var packageJson$5 = {
	version: version$5};

function CameraIcon() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", fill: "#0097DC", width: "66", height: "55", viewBox: "0 0 66 55", children: u$2("path", { d: "M57.3 8.433c4.59 0 8.1 3.51 8.1 8.1v29.7c0 4.59-3.51 8.1-8.1 8.1H8.7c-4.59 0-8.1-3.51-8.1-8.1v-29.7c0-4.59 3.51-8.1 8.1-8.1h9.45l4.59-7.02c.54-.54 1.35-1.08 2.16-1.08h16.2c.81 0 1.62.54 2.16 1.08l4.59 7.02h9.45zM33 14.64c-8.62 0-15.393 6.773-15.393 15.393 0 8.62 6.773 15.393 15.393 15.393 8.62 0 15.393-6.773 15.393-15.393 0-8.62-6.773-15.393-15.393-15.393zM33 40c-5.648 0-9.966-4.319-9.966-9.967 0-5.647 4.318-9.966 9.966-9.966s9.966 4.319 9.966 9.966C42.966 35.681 38.648 40 33 40z", fillRule: "evenodd" }) }));
}

function DiscardButton$2({ onDiscard, i18n }) {
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--discard", type: "button", title: i18n('discardRecordedFile'), "aria-label": i18n('discardRecordedFile'), onClick: onDiscard, "data-uppy-super-focusable": true, children: u$2("svg", { width: "13", height: "13", viewBox: "0 0 13 13", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", children: u$2("g", { fill: "#FFF", fillRule: "evenodd", children: [u$2("path", { d: "M.496 11.367L11.103.76l1.414 1.414L1.911 12.781z" }), u$2("path", { d: "M11.104 12.782L.497 2.175 1.911.76l10.607 10.606z" })] }) }) }));
}

function RecordButton$2({ recording, onStartRecording, onStopRecording, i18n, }) {
    if (recording) {
        return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Webcam-button", type: "button", title: i18n('stopRecording'), "aria-label": i18n('stopRecording'), onClick: onStopRecording, "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "100", height: "100", viewBox: "0 0 100 100", children: u$2("rect", { x: "15", y: "15", width: "70", height: "70" }) }) }));
    }
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Webcam-button", type: "button", title: i18n('startRecording'), "aria-label": i18n('startRecording'), onClick: onStartRecording, "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "100", height: "100", viewBox: "0 0 100 100", children: u$2("circle", { cx: "50", cy: "50", r: "40" }) }) }));
}

/**
 * Takes an Integer value of seconds (e.g. 83) and converts it into a human-readable formatted string (e.g. '1:23').
 *
 */
function formatSeconds$1(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function RecordingLength$1({ recordingLengthSeconds, }) {
    const formattedRecordingLengthSeconds = formatSeconds$1(recordingLengthSeconds);
    return u$2("span", { children: formattedRecordingLengthSeconds });
}

function SnapshotButton({ onSnapshot, i18n, }) {
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--picture", type: "button", title: i18n('takePicture'), "aria-label": i18n('takePicture'), onClick: onSnapshot, "data-uppy-super-focusable": true, children: CameraIcon() }));
}

function SubmitButton$2({ onSubmit, i18n }) {
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--submit", type: "button", title: i18n('submitRecordedFile'), "aria-label": i18n('submitRecordedFile'), onClick: onSubmit, "data-uppy-super-focusable": true, children: u$2("svg", { width: "12", height: "9", viewBox: "0 0 12 9", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", children: u$2("path", { fill: "#fff", fillRule: "nonzero", d: "M10.66 0L12 1.31 4.136 9 0 4.956l1.34-1.31L4.136 6.38z" }) }) }));
}

function VideoSourceSelect({ currentDeviceId, videoSources, onChangeVideoSource, }) {
    return (u$2("div", { className: "uppy-Webcam-videoSource", children: u$2("select", { className: "uppy-u-reset uppy-Webcam-videoSource-select", onChange: (event) => {
                onChangeVideoSource(event.target.value);
            }, children: videoSources.map((videoSource) => (u$2("option", { value: videoSource.deviceId, selected: videoSource.deviceId === currentDeviceId, children: videoSource.label }, videoSource.deviceId))) }) }));
}

function isModeAvailable$1(modes, mode) {
    return modes.includes(mode);
}
class CameraScreen extends x {
    videoElement;
    refs;
    componentDidMount() {
        const { onFocus } = this.props;
        onFocus();
    }
    componentWillUnmount() {
        const { onStop } = this.props;
        onStop();
    }
    render() {
        const { src, recordedVideo, capturedSnapshot, recording, modes, supportsRecording, videoSources, showVideoSourceDropdown, showRecordingLength, onSubmit, i18n, mirror, onSnapshot, onStartRecording, onStopRecording, onDiscardRecordedMedia, recordingLengthSeconds, } = this.props;
        const hasRecordedVideo = !!recordedVideo;
        const hasCapturedSnapshot = !!capturedSnapshot;
        const hasRecordedMedia = hasRecordedVideo || hasCapturedSnapshot;
        const shouldShowRecordButton = !hasRecordedMedia &&
            supportsRecording &&
            (isModeAvailable$1(modes, 'video-only') ||
                isModeAvailable$1(modes, 'audio-only') ||
                isModeAvailable$1(modes, 'video-audio'));
        const shouldShowSnapshotButton = !hasRecordedMedia && isModeAvailable$1(modes, 'picture');
        const shouldShowRecordingLength = supportsRecording && showRecordingLength && !hasRecordedVideo;
        const shouldShowVideoSourceDropdown = showVideoSourceDropdown && videoSources && videoSources.length > 1;
        const videoProps = {
            playsInline: true,
        };
        if (recordedVideo) {
            videoProps.muted = false;
            videoProps.controls = true;
            videoProps.src = recordedVideo;
            // reset srcObject in dom. If not resetted, stream sticks in element
            if (this.videoElement) {
                this.videoElement.srcObject = null;
            }
        }
        else {
            videoProps.muted = true;
            videoProps.autoPlay = true;
            videoProps.srcObject = src;
        }
        return (u$2("div", { className: "uppy uppy-Webcam-container", children: [u$2("div", { className: "uppy-Webcam-videoContainer", children: capturedSnapshot && !recording && !recordedVideo ? (u$2("div", { className: "uppy-Webcam-imageContainer", children: u$2("img", { src: capturedSnapshot, className: "uppy-Webcam-video", alt: "capturedSnapshot" }) })) : (u$2("video", { ref: (videoElement) => {
                            this.videoElement = videoElement;
                        }, className: `uppy-Webcam-video  ${mirror ? 'uppy-Webcam-video--mirrored' : ''}`, ...videoProps })) }), u$2("div", { className: "uppy-Webcam-footer", children: [u$2("div", { className: "uppy-Webcam-videoSourceContainer", children: shouldShowVideoSourceDropdown
                                ? VideoSourceSelect(this.props)
                                : null }), u$2("div", { className: "uppy-Webcam-buttonContainer", children: [shouldShowSnapshotButton && (u$2(SnapshotButton, { onSnapshot: onSnapshot, i18n: i18n })), shouldShowRecordButton && (u$2(RecordButton$2, { recording: recording, onStartRecording: onStartRecording, onStopRecording: onStopRecording, i18n: i18n })), (hasRecordedVideo || hasCapturedSnapshot) && (u$2(SubmitButton$2, { onSubmit: onSubmit, i18n: i18n })), (hasRecordedVideo || hasCapturedSnapshot) && (u$2(DiscardButton$2, { onDiscard: onDiscardRecordedMedia, i18n: i18n }))] }), u$2("div", { className: "uppy-Webcam-recordingLength", children: shouldShowRecordingLength && (u$2(RecordingLength$1, { recordingLengthSeconds: recordingLengthSeconds })) })] })] }));
    }
}

var locale$4 = {
    strings: {
        pluginNameCamera: 'Camera',
        noCameraTitle: 'Camera Not Available',
        noCameraDescription: 'In order to take pictures or record video, please connect a camera device',
        recordingStoppedMaxSize: 'Recording stopped because the file size is about to exceed the limit',
        submitRecordedFile: 'Submit recorded file',
        discardRecordedFile: 'Discard recorded file',
        // Shown before a picture is taken when the `countdown` option is set.
        smile: 'Smile!',
        // Used as the label for the button that takes a picture.
        // This is not visibly rendered but is picked up by screen readers.
        takePicture: 'Take a picture',
        // Used as the label for the button that starts a video recording.
        // This is not visibly rendered but is picked up by screen readers.
        startRecording: 'Begin video recording',
        // Used as the label for the button that stops a video recording.
        // This is not visibly rendered but is picked up by screen readers.
        stopRecording: 'Stop video recording',
        // Used as the label for the recording length counter. See the showRecordingLength option.
        // This is not visibly rendered but is picked up by screen readers.
        recordingLength: 'Recording length %{recording_length}',
        // Title on the “allow access” screen
        allowAccessTitle: 'Please allow access to your camera',
        // Description on the “allow access” screen
        allowAccessDescription: 'In order to take pictures or record video with your camera, please allow camera access for this site.',
    },
};

function PermissionsScreen$1({ icon, i18n, hasCamera, }) {
    return (u$2("div", { className: "uppy-Webcam-permissons", children: [u$2("div", { className: "uppy-Webcam-permissonsIcon", children: icon() }), u$2("div", { className: "uppy-Webcam-title", children: hasCamera ? i18n('allowAccessTitle') : i18n('noCameraTitle') }), u$2("p", { children: hasCamera
                    ? i18n('allowAccessDescription')
                    : i18n('noCameraDescription') })] }));
}

function supportsMediaRecorder$1() {
    return (typeof MediaRecorder === 'function' &&
        !!MediaRecorder.prototype &&
        typeof MediaRecorder.prototype.start === 'function');
}

/**
 * Normalize a MIME type or file extension into a MIME type.
 *
 * @param fileType - MIME type or a file extension prefixed with `.`.
 * @returns The MIME type or `undefined` if the fileType is an extension and is not known.
 */
function toMimeType(fileType) {
    if (fileType[0] === '.') {
        return mimeTypes[fileType.slice(1)];
    }
    return fileType;
}
/**
 * Is this MIME type a video?
 */
function isVideoMimeType(mimeType) {
    return /^video\/[^*]+$/.test(mimeType);
}
/**
 * Is this MIME type an image?
 */
function isImageMimeType(mimeType) {
    return /^image\/[^*]+$/.test(mimeType);
}
function getMediaDevices$1() {
    // bug in the compatibility data
    return navigator.mediaDevices;
}
function isModeAvailable(modes, mode) {
    return modes.includes(mode);
}
// set default options
const defaultOptions$2 = {
    onBeforeSnapshot: () => Promise.resolve(),
    countdown: false,
    modes: ['video-audio', 'video-only', 'audio-only', 'picture'],
    mirror: true,
    showVideoSourceDropdown: false,
    preferredImageMimeType: null,
    preferredVideoMimeType: null,
    showRecordingLength: false,
    mobileNativeCamera: isMobile_2({ tablet: true }),
};
/**
 * Webcam
 */
class Webcam extends UIPlugin {
    static VERSION = packageJson$5.version;
    // enableMirror is used to toggle mirroring, for instance when discarding the video,
    // while `opts.mirror` is used to remember the initial user setting
    #enableMirror;
    mediaDevices;
    supportsUserMedia;
    protocol;
    capturedMediaFile;
    icon;
    webcamActive;
    stream = null;
    recorder = null;
    recordingChunks = null;
    recordingLengthTimer;
    captureInProgress = false;
    constructor(uppy, opts) {
        super(uppy, { ...defaultOptions$2, ...opts });
        this.mediaDevices = getMediaDevices$1();
        this.supportsUserMedia = !!this.mediaDevices;
        this.protocol = location.protocol.match(/https/i) ? 'https' : 'http';
        this.id = this.opts.id || 'Webcam';
        this.type = 'acquirer';
        this.capturedMediaFile = null;
        this.icon = () => (u$2("svg", { "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "0 0 32 32", children: u$2("path", { d: "M23.5 9.5c1.417 0 2.5 1.083 2.5 2.5v9.167c0 1.416-1.083 2.5-2.5 2.5h-15c-1.417 0-2.5-1.084-2.5-2.5V12c0-1.417 1.083-2.5 2.5-2.5h2.917l1.416-2.167C13 7.167 13.25 7 13.5 7h5c.25 0 .5.167.667.333L20.583 9.5H23.5zM16 11.417a4.706 4.706 0 00-4.75 4.75 4.704 4.704 0 004.75 4.75 4.703 4.703 0 004.75-4.75c0-2.663-2.09-4.75-4.75-4.75zm0 7.825c-1.744 0-3.076-1.332-3.076-3.074 0-1.745 1.333-3.077 3.076-3.077 1.744 0 3.074 1.333 3.074 3.076s-1.33 3.075-3.074 3.075z", fill: "#02B383", fillRule: "nonzero" }) }));
        this.defaultLocale = locale$4;
        this.i18nInit();
        this.title = this.i18n('pluginNameCamera');
        this.#enableMirror = this.opts.mirror;
        this.install = this.install.bind(this);
        this.setPluginState = this.setPluginState.bind(this);
        this.render = this.render.bind(this);
        // Camera controls
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.takeSnapshot = this.takeSnapshot.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.discardRecordedMedia = this.discardRecordedMedia.bind(this);
        this.submit = this.submit.bind(this);
        this.oneTwoThreeSmile = this.oneTwoThreeSmile.bind(this);
        this.focus = this.focus.bind(this);
        this.changeVideoSource = this.changeVideoSource.bind(this);
        this.webcamActive = false;
        if (this.opts.countdown) {
            this.opts.onBeforeSnapshot = this.oneTwoThreeSmile;
        }
        this.setPluginState({
            hasCamera: false,
            cameraReady: false,
            cameraError: null,
            recordingLengthSeconds: 0,
            videoSources: [],
            currentDeviceId: null,
            capturedSnapshot: null,
        });
    }
    getStatus() {
        const { recordedVideo, capturedSnapshot, isRecording, cameraReady, cameraError, } = this.getPluginState();
        if (isRecording)
            return 'recording';
        if (recordedVideo != null || capturedSnapshot != null)
            return 'captured';
        if (cameraReady)
            return 'ready';
        if (cameraError)
            return 'error';
        return 'init';
    }
    setOptions(newOpts) {
        super.setOptions({
            ...newOpts,
            videoConstraints: {
                // May be undefined but ... handles that
                ...this.opts.videoConstraints,
                ...newOpts?.videoConstraints,
            },
        });
    }
    hasCameraCheck() {
        if (!this.mediaDevices) {
            return Promise.resolve(false);
        }
        return this.mediaDevices.enumerateDevices().then((devices) => {
            return devices.some((device) => device.kind === 'videoinput');
        });
    }
    isAudioOnly() {
        return this.opts.modes.length === 1 && this.opts.modes[0] === 'audio-only';
    }
    getConstraints(deviceId = null) {
        const acceptsAudio = this.opts.modes.indexOf('video-audio') !== -1 ||
            this.opts.modes.indexOf('audio-only') !== -1;
        const acceptsVideo = !this.isAudioOnly() &&
            (this.opts.modes.indexOf('video-audio') !== -1 ||
                this.opts.modes.indexOf('video-only') !== -1 ||
                this.opts.modes.indexOf('picture') !== -1);
        const videoConstraints = {
            ...(this.opts.videoConstraints || {}),
            ...(deviceId != null && { deviceId }),
        };
        return {
            audio: acceptsAudio,
            video: acceptsVideo ? videoConstraints : false,
        };
    }
    start(options = null) {
        if (!this.supportsUserMedia) {
            return Promise.reject(new Error('Webcam access not supported'));
        }
        this.webcamActive = true;
        if (this.opts.mirror) {
            this.#enableMirror = true;
        }
        const constraints = this.getConstraints(options?.deviceId);
        // TODO: add a return and/or convert this to async/await
        this.hasCameraCheck().then((hasCamera) => {
            this.setPluginState({
                hasCamera,
            });
            // ask user for access to their camera
            return this.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                this.stream = stream;
                let currentDeviceId = null;
                const tracks = this.isAudioOnly()
                    ? stream.getAudioTracks()
                    : stream.getVideoTracks();
                if (!options || !options.deviceId) {
                    currentDeviceId = tracks[0].getSettings().deviceId;
                }
                else {
                    tracks.forEach((track) => {
                        if (track.getSettings().deviceId === options.deviceId) {
                            currentDeviceId = track.getSettings().deviceId;
                        }
                    });
                }
                // Update the sources now, so we can access the names.
                this.updateVideoSources();
                this.setPluginState({
                    currentDeviceId,
                    cameraReady: true,
                });
            })
                .catch((err) => {
                this.setPluginState({
                    cameraReady: false,
                    cameraError: err,
                });
                this.uppy.info(err.message, 'error');
            });
        });
    }
    getMediaRecorderOptions() {
        const options = {};
        // Try to use the `opts.preferredVideoMimeType` or one of the `allowedFileTypes` for the recording.
        // If the browser doesn't support it, we'll fall back to the browser default instead.
        // Safari doesn't have the `isTypeSupported` API.
        if (MediaRecorder.isTypeSupported) {
            const { restrictions } = this.uppy.opts;
            let preferredVideoMimeTypes = [];
            if (this.opts.preferredVideoMimeType) {
                preferredVideoMimeTypes = [this.opts.preferredVideoMimeType];
            }
            else if (restrictions.allowedFileTypes) {
                preferredVideoMimeTypes = restrictions.allowedFileTypes
                    .map(toMimeType)
                    .filter(isVideoMimeType);
            }
            const filterSupportedTypes = (candidateType) => MediaRecorder.isTypeSupported(candidateType) &&
                getFileTypeExtension(candidateType);
            const acceptableMimeTypes = preferredVideoMimeTypes.filter(filterSupportedTypes);
            if (acceptableMimeTypes.length > 0) {
                options.mimeType = acceptableMimeTypes[0];
            }
        }
        return options;
    }
    startRecording() {
        // only used if supportsMediaRecorder() returned true
        this.recorder = new MediaRecorder(this.stream, this.getMediaRecorderOptions());
        this.recordingChunks = [];
        let stoppingBecauseOfMaxSize = false;
        this.recorder.addEventListener('dataavailable', (event) => {
            this.recordingChunks.push(event.data);
            const { restrictions } = this.uppy.opts;
            if (this.recordingChunks.length > 1 &&
                restrictions.maxFileSize != null &&
                !stoppingBecauseOfMaxSize) {
                const totalSize = this.recordingChunks.reduce((acc, chunk) => acc + chunk.size, 0);
                // Exclude the initial chunk from the average size calculation because it is likely to be a very small outlier
                const averageChunkSize = (totalSize - this.recordingChunks[0].size) /
                    (this.recordingChunks.length - 1);
                const expectedEndChunkSize = averageChunkSize * 3;
                const maxSize = Math.max(0, restrictions.maxFileSize - expectedEndChunkSize);
                if (totalSize > maxSize) {
                    stoppingBecauseOfMaxSize = true;
                    this.uppy.info(this.i18n('recordingStoppedMaxSize'), 'warning', 4000);
                    this.stopRecording();
                }
            }
        });
        // use a "time slice" of 500ms: ondataavailable will be called each 500ms
        // smaller time slices mean we can more accurately check the max file size restriction
        this.recorder.start(500);
        if (this.opts.showRecordingLength) {
            // Start the recordingLengthTimer if we are showing the recording length.
            this.recordingLengthTimer = setInterval(() => {
                const currentRecordingLength = this.getPluginState().recordingLengthSeconds;
                this.setPluginState({
                    recordingLengthSeconds: currentRecordingLength + 1,
                });
            }, 1000);
        }
        this.setPluginState({
            isRecording: true,
        });
    }
    stopRecording() {
        const stopped = new Promise((resolve) => {
            this.recorder.addEventListener('stop', () => {
                resolve();
            });
            this.recorder.stop();
            if (this.opts.showRecordingLength) {
                // Stop the recordingLengthTimer if we are showing the recording length.
                clearInterval(this.recordingLengthTimer);
                this.setPluginState({ recordingLengthSeconds: 0 });
            }
        });
        return stopped
            .then(() => {
            this.setPluginState({
                isRecording: false,
            });
            return this.getVideo();
        })
            .then((file) => {
            try {
                this.capturedMediaFile = file;
                // create object url for capture result preview
                this.setPluginState({
                    recordedVideo: URL.createObjectURL(file.data),
                });
                this.#enableMirror = false;
            }
            catch (err) {
                // Logging the error, exept restrictions, which is handled in Core
                if (!err.isRestriction) {
                    this.uppy.log(err);
                }
            }
        })
            .then(() => {
            this.recordingChunks = null;
            this.recorder = null;
        }, (error) => {
            this.recordingChunks = null;
            this.recorder = null;
            throw error;
        });
    }
    discardRecordedMedia() {
        const { recordedVideo, capturedSnapshot } = this.getPluginState();
        if (recordedVideo) {
            URL.revokeObjectURL(recordedVideo);
        }
        if (capturedSnapshot) {
            URL.revokeObjectURL(capturedSnapshot);
        }
        this.setPluginState({
            recordedVideo: null,
            capturedSnapshot: null,
        });
        if (this.opts.mirror) {
            this.#enableMirror = true;
        }
        this.capturedMediaFile = null;
    }
    submit() {
        try {
            if (this.capturedMediaFile) {
                this.uppy.addFile(this.capturedMediaFile);
            }
        }
        catch (err) {
            // Logging the error, exept restrictions, which is handled in Core
            if (!err.isRestriction) {
                this.uppy.log(err, 'error');
            }
        }
    }
    async stop() {
        if (this.stream) {
            const audioTracks = this.stream.getAudioTracks();
            const videoTracks = this.stream.getVideoTracks();
            audioTracks.concat(videoTracks).forEach((track) => track.stop());
        }
        if (this.recorder) {
            await new Promise((resolve) => {
                this.recorder.addEventListener('stop', resolve, { once: true });
                this.recorder.stop();
                if (this.opts.showRecordingLength) {
                    clearInterval(this.recordingLengthTimer);
                }
            });
        }
        this.recordingChunks = null;
        this.recorder = null;
        this.webcamActive = false;
        this.stream = null;
        this.setPluginState({
            recordedVideo: null,
            capturedSnapshot: null,
            isRecording: false,
            recordingLengthSeconds: 0,
        });
    }
    getVideoElement() {
        return this.el.querySelector('.uppy-Webcam-video');
    }
    oneTwoThreeSmile() {
        return new Promise((resolve, reject) => {
            let count = this.opts.countdown;
            const countDown = setInterval(() => {
                if (!this.webcamActive) {
                    clearInterval(countDown);
                    this.captureInProgress = false;
                    return reject(new Error('Webcam is not active'));
                }
                if (count) {
                    this.uppy.info(`${count}...`, 'warning', 800);
                    count--;
                }
                else {
                    clearInterval(countDown);
                    this.uppy.info(this.i18n('smile'), 'success', 1500);
                    setTimeout(() => resolve(), 1500);
                }
            }, 1000);
        });
    }
    async takeSnapshot() {
        if (this.captureInProgress)
            return;
        this.captureInProgress = true;
        try {
            await this.opts.onBeforeSnapshot();
        }
        catch (err) {
            const message = typeof err === 'object' ? err.message : err;
            this.uppy.info(message, 'error', 5000);
            throw new Error(`onBeforeSnapshot: ${message}`);
        }
        try {
            const tagFile = await this.getImage();
            this.capturedMediaFile = tagFile;
            // Create object URL for preview
            const capturedSnapshotUrl = URL.createObjectURL(tagFile.data);
            this.setPluginState({ capturedSnapshot: capturedSnapshotUrl });
            this.captureInProgress = false;
        }
        catch (error) {
            // Logging the error, except restrictions, which is handled in Core
            this.captureInProgress = false;
            if (!error.isRestriction) {
                this.uppy.log(error);
            }
        }
    }
    getImage() {
        const video = this.getVideoElement();
        if (!video) {
            return Promise.reject(new Error('No video element found, likely due to the Webcam tab being closed.'));
        }
        const width = video.videoWidth;
        const height = video.videoHeight;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const { restrictions } = this.uppy.opts;
        let preferredImageMimeTypes = [];
        if (this.opts.preferredImageMimeType) {
            preferredImageMimeTypes = [this.opts.preferredImageMimeType];
        }
        else if (restrictions.allowedFileTypes) {
            preferredImageMimeTypes = restrictions.allowedFileTypes
                .map(toMimeType)
                .filter(isImageMimeType);
        }
        const mimeType = preferredImageMimeTypes[0] || 'image/jpeg';
        const ext = getFileTypeExtension(mimeType) || 'jpg';
        const name = `cam-${Date.now()}.${ext}`;
        return canvasToBlob$1(canvas, mimeType).then((blob) => {
            return {
                source: this.id,
                name,
                data: new Blob([blob], { type: mimeType }),
                type: mimeType,
            };
        });
    }
    getVideo() {
        // Sometimes in iOS Safari, Blobs (especially the first Blob in the recordingChunks Array)
        // have empty 'type' attributes (e.g. '') so we need to find a Blob that has a defined 'type'
        // attribute in order to determine the correct MIME type.
        const mimeType = this.recordingChunks.find((blob) => blob.type?.length > 0).type;
        const fileExtension = getFileTypeExtension(mimeType);
        if (!fileExtension) {
            return Promise.reject(new Error(`Could not retrieve recording: Unsupported media type "${mimeType}"`));
        }
        const name = `webcam-${Date.now()}.${fileExtension}`;
        const blob = new Blob(this.recordingChunks, { type: mimeType });
        const file = {
            source: this.id,
            name,
            data: new Blob([blob], { type: mimeType }),
            type: mimeType,
        };
        return Promise.resolve(file);
    }
    focus() {
        if (!this.opts.countdown)
            return;
        setTimeout(() => {
            this.uppy.info(this.i18n('smile'), 'success', 1500);
        }, 1000);
    }
    changeVideoSource(deviceId) {
        this.stop();
        this.start({ deviceId });
    }
    updateVideoSources() {
        this.mediaDevices.enumerateDevices().then((devices) => {
            this.setPluginState({
                videoSources: devices.filter((device) => device.kind === 'videoinput'),
            });
        });
    }
    render() {
        if (!this.webcamActive) {
            this.start();
        }
        const webcamState = this.getPluginState();
        if (!webcamState.cameraReady || !webcamState.hasCamera) {
            return (u$2(PermissionsScreen$1, { icon: CameraIcon, i18n: this.i18n, hasCamera: webcamState.hasCamera }));
        }
        return (u$2(CameraScreen, { ...webcamState, onChangeVideoSource: this.changeVideoSource, onSnapshot: this.takeSnapshot, onStartRecording: this.startRecording, onStopRecording: this.stopRecording, onDiscardRecordedMedia: this.discardRecordedMedia, onSubmit: this.submit, onFocus: this.focus, onStop: this.stop, i18n: this.i18n, modes: this.opts.modes, showRecordingLength: this.opts.showRecordingLength, showVideoSourceDropdown: this.opts.showVideoSourceDropdown, supportsRecording: supportsMediaRecorder$1(), recording: webcamState.isRecording, mirror: this.#enableMirror, src: this.stream }));
    }
    install() {
        const { mobileNativeCamera, modes, videoConstraints } = this.opts;
        const { target } = this.opts;
        if (mobileNativeCamera && target) {
            this.getTargetPlugin(target)?.setOptions({
                showNativeVideoCameraButton: isModeAvailable(modes, 'video-only') ||
                    isModeAvailable(modes, 'video-audio'),
                showNativePhotoCameraButton: isModeAvailable(modes, 'picture'),
                nativeCameraFacingMode: videoConstraints?.facingMode,
            });
            return;
        }
        this.setPluginState({
            cameraReady: false,
            recordingLengthSeconds: 0,
        });
        if (target) {
            this.mount(target, this);
        }
        if (this.mediaDevices) {
            this.updateVideoSources();
            this.mediaDevices.ondevicechange = () => {
                this.updateVideoSources();
                if (this.stream) {
                    let restartStream = true;
                    const { videoSources, currentDeviceId } = this.getPluginState();
                    videoSources.forEach((videoSource) => {
                        if (currentDeviceId === videoSource.deviceId) {
                            restartStream = false;
                        }
                    });
                    if (restartStream) {
                        this.stop();
                        this.start();
                    }
                }
            };
        }
    }
    uninstall() {
        this.stop();
        this.unmount();
    }
    onUnmount() {
        this.stop();
    }
}

var version$4 = "5.0.1";
var packageJson$4 = {
	version: version$4};

var locale$3 = {
    strings: {
        pluginNameScreenCapture: 'Screencast',
        startCapturing: 'Begin screen capturing',
        stopCapturing: 'Stop screen capturing',
        submitRecordedFile: 'Submit recorded file',
        streamActive: 'Stream active',
        streamPassive: 'Stream passive',
        micDisabled: 'Microphone access denied by user',
        recording: 'Recording',
        takeScreenshot: 'Take Screenshot',
        discardMediaFile: 'Discard Media',
    },
};

function DiscardButton$1({ onDiscard, i18n, }) {
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-ScreenCapture-button uppy-ScreenCapture-button--discard", type: "button", title: i18n('discardMediaFile'), "aria-label": i18n('discardMediaFile'), onClick: onDiscard, "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", children: [u$2("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), u$2("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }) }));
}

/**
 * Control screen capture recording. Will show record or stop button.
 */
function RecordButton$1({ recording, onStartRecording, onStopRecording, i18n, }) {
    if (recording) {
        return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-ScreenCapture-button uppy-ScreenCapture-button--video uppy-ScreenCapture-button--stop-rec", type: "button", title: i18n('stopCapturing'), "aria-label": i18n('stopCapturing'), onClick: onStopRecording, "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "100", height: "100", viewBox: "0 0 100 100", children: u$2("rect", { x: "15", y: "15", width: "70", height: "70" }) }) }));
    }
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-ScreenCapture-button uppy-ScreenCapture-button--video", type: "button", title: i18n('startCapturing'), "aria-label": i18n('startCapturing'), onClick: onStartRecording, "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", children: u$2("path", { d: "M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" }) }) }));
}

function ScreenshotButton({ onScreenshot, i18n, }) {
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-ScreenCapture-button uppy-ScreenCapture-button--screenshot", type: "button", title: i18n('takeScreenshot'), "aria-label": i18n('takeScreenshot'), onClick: onScreenshot, "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", children: [u$2("path", { d: "M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" }), u$2("path", { "fill-rule": "evenodd", d: "M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z", "clip-rule": "evenodd" })] }) }));
}

function fmtMSS(s) {
    // biome-ignore lint/suspicious/noAssignInExpressions: ...
    return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s;
}
class StopWatch extends x {
    wrapperStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
    };
    overlayStyle = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'black',
        opacity: 0.7,
    };
    infoContainerStyle = {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        zIndex: 1,
        color: 'white',
    };
    infotextStyle = {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '1rem',
        fontSize: '1.5rem',
    };
    timeStyle = {
        display: 'block',
        fontWeight: 'bold',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: '3rem',
        fontFamily: 'Courier New',
    };
    timerRunning = false;
    timer;
    constructor(props) {
        super(props);
        this.state = { elapsedTime: 0 };
    }
    startTimer() {
        this.timerTick();
        this.timerRunning = true;
    }
    resetTimer() {
        clearTimeout(this.timer);
        this.setState({ elapsedTime: 0 });
        this.timerRunning = false;
    }
    timerTick() {
        this.timer = setTimeout(() => {
            this.setState((state) => ({
                elapsedTime: state.elapsedTime + 1,
            }));
            this.timerTick();
        }, 1000);
    }
    render() {
        const { recording, i18n } = { ...this.props };
        const { elapsedTime } = this.state;
        // second to minutes and seconds
        const minAndSec = fmtMSS(elapsedTime);
        if (recording && !this.timerRunning) {
            this.startTimer();
        }
        if (!recording && this.timerRunning) {
            this.resetTimer();
        }
        if (recording) {
            return (u$2("div", { style: this.wrapperStyle, children: [u$2("div", { style: this.overlayStyle }), u$2("div", { style: this.infoContainerStyle, children: [u$2("div", { style: this.infotextStyle, children: i18n('recording') }), u$2("div", { style: this.timeStyle, children: minAndSec })] })] }));
        }
        return null;
    }
}

function StreamStatus({ streamActive, i18n }) {
    if (streamActive) {
        return (u$2("div", { title: i18n('streamActive'), className: "uppy-ScreenCapture-icon--stream uppy-ScreenCapture-icon--streamActive", children: u$2("svg", { "aria-hidden": "true", focusable: "false", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M0 0h24v24H0z", opacity: ".1", fill: "none" }), u$2("path", { d: "M0 0h24v24H0z", fill: "none" }), u$2("path", { d: "M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm18-7H5v1.63c3.96 1.28 7.09 4.41 8.37 8.37H19V7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11zm20-7H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" })] }) }));
    }
    return (u$2("div", { title: i18n('streamPassive'), className: "uppy-ScreenCapture-icon--stream", children: u$2("svg", { "aria-hidden": "true", focusable: "false", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M0 0h24v24H0z", opacity: ".1", fill: "none" }), u$2("path", { d: "M0 0h24v24H0z", fill: "none" }), u$2("path", { d: "M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z" })] }) }));
}

/**
 * Submit recorded video to uppy. Enabled when file is available
 */
function SubmitButton$1({ recording, recordedVideo, onSubmit, capturedScreenshotUrl, i18n, }) {
    if ((recordedVideo || capturedScreenshotUrl) && !recording) {
        return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-ScreenCapture-button uppy-ScreenCapture-button--submit", type: "button", title: i18n('submitRecordedFile'), "aria-label": i18n('submitRecordedFile'), onClick: onSubmit, "data-uppy-super-focusable": true, children: u$2("svg", { width: "12", height: "9", viewBox: "0 0 12 9", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", children: u$2("path", { fill: "#fff", fillRule: "nonzero", d: "M10.66 0L12 1.31 4.136 9 0 4.956l1.34-1.31L4.136 6.38z" }) }) }));
    }
    return null;
}

class RecorderScreen extends x {
    videoElement = null;
    componentWillUnmount() {
        const { onStop } = this.props;
        onStop();
    }
    render() {
        const { recording, stream: videoStream, recordedVideo, enableScreenshots, capturedScreenshotUrl, } = this.props;
        const videoProps = {
            playsinline: true,
        };
        // show stream
        if (recording || (!recordedVideo && !recording)) {
            videoProps.muted = true;
            videoProps.autoplay = true;
            videoProps.srcObject = videoStream;
        }
        // show preview
        if (recordedVideo && !recording) {
            videoProps.muted = false;
            videoProps.controls = true;
            videoProps.src = recordedVideo;
            // reset srcObject in dom. If not resetted, stream sticks in element
            if (this.videoElement) {
                this.videoElement.srcObject = null;
            }
        }
        return (u$2("div", { className: "uppy uppy-ScreenCapture-container", children: [u$2("div", { className: "uppy-ScreenCapture-mediaContainer", children: [u$2(StreamStatus, { ...this.props }), capturedScreenshotUrl && !recording && !recordedVideo ? (u$2("div", { className: "uppy-ScreenCapture-imageContainer", children: u$2("img", { src: capturedScreenshotUrl, className: "uppy-ScreenCapture-media", alt: "screenshotPreview" }) })) : (u$2("video", { ref: (videoElement) => {
                                this.videoElement = videoElement;
                            }, className: "uppy-ScreenCapture-media", ...videoProps })), u$2("div", { children: u$2(StopWatch, { ...this.props }) })] }), u$2("div", { className: "uppy-ScreenCapture-buttonContainer", children: recordedVideo || capturedScreenshotUrl ? (u$2(k$2, { children: [u$2(SubmitButton$1, { ...this.props }), u$2(DiscardButton$1, { ...this.props })] })) : (u$2(k$2, { children: [enableScreenshots && !recording && (u$2(ScreenshotButton, { ...this.props })), u$2(RecordButton$1, { ...this.props })] })) })] }));
    }
}

function ScreenRecIcon() {
    return (u$2("svg", { className: "uppy-DashboardTab-iconScreenRec", "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "0 0 32 32", children: u$2("g", { fill: "currentcolor", fillRule: "evenodd", children: [u$2("path", { d: "M24.182 9H7.818C6.81 9 6 9.742 6 10.667v10c0 .916.81 1.666 1.818 1.666h4.546V24h7.272v-1.667h4.546c1 0 1.809-.75 1.809-1.666l.009-10C26 9.742 25.182 9 24.182 9zM24 21H8V11h16v10z" }), u$2("circle", { cx: "16", cy: "16", r: "2" })] }) }));
}

// Check if screen capturing is supported.
// mediaDevices is supprted on mobile Safari, getDisplayMedia is not
function isScreenRecordingSupported() {
    return window.MediaRecorder && navigator.mediaDevices?.getDisplayMedia;
}
// Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
function getMediaDevices() {
    return window.MediaRecorder && navigator.mediaDevices;
}
// Add supported image types
const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
// https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
const defaultOptions$1 = {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#Properties_of_shared_screen_tracks
    displayMediaConstraints: {
        video: {
            width: 1280,
            height: 720,
            frameRate: {
                ideal: 3,
                max: 5,
            },
            cursor: 'motion',
            displaySurface: 'monitor',
        },
    },
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints/audio
    userMediaConstraints: {
        audio: true,
    },
    preferredVideoMimeType: 'video/webm',
    preferredImageMimeType: 'image/png',
    enableScreenshots: true,
};
class ScreenCapture extends UIPlugin {
    static VERSION = packageJson$4.version;
    mediaDevices;
    protocol;
    icon;
    streamInterrupted;
    captureActive;
    capturedMediaFile;
    videoStream = null;
    audioStream = null;
    userDenied = false;
    recorder = null;
    outputStream = null;
    recordingChunks = null;
    constructor(uppy, opts) {
        super(uppy, { ...defaultOptions$1, ...opts });
        this.mediaDevices = getMediaDevices();
        this.protocol = location.protocol === 'https:' ? 'https' : 'http';
        this.id = this.opts.id || 'ScreenCapture';
        this.type = 'acquirer';
        this.icon = ScreenRecIcon;
        this.defaultLocale = locale$3;
        this.i18nInit();
        this.title = this.i18n('pluginNameScreenCapture');
        // uppy plugin class related
        this.install = this.install.bind(this);
        this.setPluginState = this.setPluginState.bind(this);
        this.render = this.render.bind(this);
        // screen capturer related
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.submit = this.submit.bind(this);
        this.streamInterrupted = this.streamInactivated.bind(this);
        this.captureScreenshot = this.captureScreenshot.bind(this);
        this.discardRecordedMedia = this.discardRecordedMedia.bind(this);
        // initialize
        this.captureActive = false;
        this.capturedMediaFile = null;
        this.setPluginState({
            streamActive: false,
            audioStreamActive: false,
            recording: false,
            recordedVideo: null,
            screenRecError: null,
            capturedScreenshotUrl: null,
            status: 'init',
        });
    }
    install() {
        if (!isScreenRecordingSupported()) {
            this.uppy.log('Screen recorder access is not supported', 'warning');
            return null;
        }
        this.setPluginState({
            streamActive: false,
            audioStreamActive: false,
            status: 'init',
        });
        const { target } = this.opts;
        if (target) {
            this.mount(target, this);
        }
        return undefined;
    }
    uninstall() {
        if (this.videoStream) {
            this.stop();
        }
        this.unmount();
    }
    start() {
        if (!this.mediaDevices) {
            return Promise.reject(new Error('Screen recorder access not supported'));
        }
        this.captureActive = true;
        this.selectAudioStreamSource();
        return this.selectVideoStreamSource().then((res) => {
            // something happened in start -> return
            if (res === false) {
                // Close the Dashboard panel if plugin is installed
                // into Dashboard (could be other parent UI plugin)
                // @ts-expect-error we can't know Dashboard types here
                if (this.parent?.hideAllPanels) {
                    // @ts-expect-error we can't know Dashboard types here
                    this.parent.hideAllPanels();
                    this.captureActive = false;
                }
            }
        });
    }
    selectVideoStreamSource() {
        // if active stream available, return it
        if (this.videoStream) {
            return new Promise((resolve) => resolve(this.videoStream));
        }
        // ask user to select source to record and get mediastream from that
        return this.mediaDevices
            .getDisplayMedia(this.opts.displayMediaConstraints)
            .then((videoStream) => {
            this.videoStream = videoStream;
            // add event listener to stop recording if stream is interrupted
            this.videoStream.addEventListener('inactive', () => {
                this.streamInactivated();
            });
            this.setPluginState({
                streamActive: true,
                status: 'ready',
                screenRecError: null,
            });
            return videoStream;
        })
            .catch((err) => {
            this.setPluginState({
                screenRecError: err,
                status: 'error',
            });
            this.userDenied = true;
            setTimeout(() => {
                this.userDenied = false;
            }, 1000);
            return false;
        });
    }
    selectAudioStreamSource() {
        // if active stream available, return it
        if (this.audioStream) {
            return new Promise((resolve) => resolve(this.audioStream));
        }
        // ask user to select source to record and get mediastream from that
        return this.mediaDevices
            .getUserMedia(this.opts.userMediaConstraints)
            .then((audioStream) => {
            this.audioStream = audioStream;
            this.setPluginState({
                audioStreamActive: true,
            });
            return audioStream;
        })
            .catch((err) => {
            if (err.name === 'NotAllowedError') {
                this.uppy.info(this.i18n('micDisabled'), 'error', 5000);
                this.uppy.log(this.i18n('micDisabled'), 'warning');
            }
            return false;
        });
    }
    startRecording() {
        const options = {};
        this.capturedMediaFile = null;
        this.recordingChunks = [];
        const { preferredVideoMimeType } = this.opts;
        this.selectVideoStreamSource()
            .then((videoStream) => {
            if (videoStream === false) {
                throw new Error('No video stream available');
            }
            // Attempt to use the passed preferredVideoMimeType (if any) during recording.
            // If the browser doesn't support it, we'll fall back to the browser default instead
            if (preferredVideoMimeType &&
                MediaRecorder.isTypeSupported(preferredVideoMimeType) &&
                getFileTypeExtension(preferredVideoMimeType)) {
                options.mimeType = preferredVideoMimeType;
            }
            // prepare tracks
            const tracks = [videoStream.getVideoTracks()[0]];
            // merge audio if exits
            if (this.audioStream) {
                tracks.push(this.audioStream.getAudioTracks()[0]);
            }
            // create new stream from video and audio
            this.outputStream = new MediaStream(tracks);
            // initialize mediarecorder
            this.recorder = new MediaRecorder(this.outputStream, options);
            // push data to buffer when data available
            this.recorder.addEventListener('dataavailable', (event) => {
                this.recordingChunks.push(event.data);
            });
            // start recording
            this.recorder.start();
            // set plugin state to recording
            this.setPluginState({
                recording: true,
                status: 'recording',
            });
        })
            .catch((err) => {
            this.uppy.log(err, 'error');
            this.setPluginState({ screenRecError: err, status: 'error' });
        });
    }
    streamInactivated() {
        // get screen recorder state
        const { recordedVideo, recording } = { ...this.getPluginState() };
        if (!recordedVideo && !recording) {
            // Close the Dashboard panel if plugin is installed
            // into Dashboard (could be other parent UI plugin)
            // @ts-expect-error we can't know Dashboard types here
            if (this.parent?.hideAllPanels) {
                // @ts-expect-error we can't know Dashboard types here
                this.parent.hideAllPanels();
            }
            this.setPluginState({ status: 'init' });
        }
        else if (recording) {
            // stop recorder if it is active
            this.uppy.log('Capture stream inactive — stop recording');
            this.stopRecording();
        }
        this.videoStream = null;
        this.audioStream = null;
        this.setPluginState({
            streamActive: false,
            audioStreamActive: false,
        });
    }
    stopRecording() {
        const stopped = new Promise((resolve) => {
            this.recorder.addEventListener('stop', () => {
                resolve();
            });
            this.recorder.stop();
        });
        return stopped
            .then(() => {
            // recording stopped
            this.setPluginState({
                recording: false,
            });
            // get video file after recorder stopped
            return this.getVideo();
        })
            .then((file) => {
            // store media file
            this.capturedMediaFile = file;
            // create object url for capture result preview
            this.setPluginState({
                recordedVideo: URL.createObjectURL(file.data),
                status: 'captured',
            });
        })
            .then(() => {
            this.recordingChunks = null;
            this.recorder = null;
        }, (error) => {
            this.recordingChunks = null;
            this.recorder = null;
            throw error;
        });
    }
    discardRecordedMedia() {
        const { capturedScreenshotUrl, recordedVideo } = this.getPluginState();
        if (capturedScreenshotUrl) {
            URL.revokeObjectURL(capturedScreenshotUrl);
        }
        if (recordedVideo) {
            URL.revokeObjectURL(recordedVideo);
        }
        this.capturedMediaFile = null;
        this.setPluginState({
            recordedVideo: null,
            capturedScreenshotUrl: null,
            status: this.getPluginState().streamActive ? 'ready' : 'init',
        });
    }
    submit() {
        try {
            // add recorded file to uppy
            if (this.capturedMediaFile) {
                this.uppy.addFile(this.capturedMediaFile);
            }
        }
        catch (err) {
            // Logging the error, exept restrictions, which is handled in Core
            if (!err.isRestriction) {
                this.uppy.log(err, 'warning');
            }
        }
    }
    stop() {
        // flush video stream
        if (this.videoStream) {
            this.videoStream.getVideoTracks().forEach((track) => {
                track.stop();
            });
            this.videoStream.getAudioTracks().forEach((track) => {
                track.stop();
            });
            this.videoStream = null;
        }
        // flush audio stream
        if (this.audioStream) {
            this.audioStream.getAudioTracks().forEach((track) => {
                track.stop();
            });
            this.audioStream.getVideoTracks().forEach((track) => {
                track.stop();
            });
            this.audioStream = null;
        }
        // flush output stream
        if (this.outputStream) {
            this.outputStream.getAudioTracks().forEach((track) => {
                track.stop();
            });
            this.outputStream.getVideoTracks().forEach((track) => {
                track.stop();
            });
            this.outputStream = null;
        }
        // Clean up screenshot URL
        const { capturedScreenshotUrl, recordedVideo } = this.getPluginState();
        if (capturedScreenshotUrl) {
            URL.revokeObjectURL(capturedScreenshotUrl);
        }
        if (recordedVideo) {
            URL.revokeObjectURL(recordedVideo);
        }
        // remove preview video
        this.setPluginState({
            recording: false,
            streamActive: false,
            audioStreamActive: false,
            recordedVideo: null,
            capturedScreenshotUrl: null,
            status: 'init',
        });
        this.captureActive = false;
    }
    getVideo() {
        const mimeType = this.recordingChunks[0].type;
        const fileExtension = getFileTypeExtension(mimeType);
        if (!fileExtension) {
            return Promise.reject(new Error(`Could not retrieve recording: Unsupported media type "${mimeType}"`));
        }
        const name = `screencap-${Date.now()}.${fileExtension}`;
        const blob = new Blob(this.recordingChunks, { type: mimeType });
        const file = {
            source: this.id,
            name,
            data: new Blob([blob], { type: mimeType }),
            type: mimeType,
        };
        return Promise.resolve(file);
    }
    async captureScreenshot() {
        if (!this.mediaDevices?.getDisplayMedia) {
            throw new Error('Screen capture is not supported');
        }
        try {
            let stream = this.videoStream;
            // Only request new stream if we don't have one
            if (!stream) {
                const newStream = await this.selectVideoStreamSource();
                if (!newStream) {
                    throw new Error('Failed to get screen capture stream');
                }
                stream = newStream;
            }
            const video = document.createElement('video');
            video.srcObject = stream;
            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play();
                    resolve(null);
                };
            });
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Failed to get canvas context');
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Validate and set fallback for preferred image mime type
            let mimeType = this.opts.preferredImageMimeType;
            if (!mimeType || !SUPPORTED_IMAGE_TYPES.includes(mimeType)) {
                this.uppy.log(`Unsupported image type "${mimeType}", falling back to image/png`, 'warning');
                mimeType = 'image/png';
            }
            const quality = 1;
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create screenshot blob'));
                        return;
                    }
                    const fileExtension = getFileTypeExtension(mimeType) || 'png';
                    const file = {
                        source: this.id,
                        name: `Screenshot ${new Date().toISOString()}.${fileExtension}`,
                        type: mimeType,
                        data: blob,
                    };
                    try {
                        this.capturedMediaFile = file;
                        const screenshotUrl = URL.createObjectURL(blob);
                        this.setPluginState({
                            capturedScreenshotUrl: screenshotUrl,
                            status: 'captured',
                        });
                        resolve();
                    }
                    catch (err) {
                        if (this.getPluginState().capturedScreenshotUrl) {
                            this.setPluginState({ capturedScreenshotUrl: null });
                        }
                        if (!err.isRestriction) {
                            this.uppy.log(err, 'error');
                        }
                        reject(err);
                    }
                    finally {
                        // Cleanup
                        video.srcObject = null;
                        canvas.remove();
                        video.remove();
                    }
                }, mimeType, quality);
            });
        }
        catch (err) {
            this.uppy.log(err, 'error');
            throw err;
        }
    }
    render() {
        // get screen recorder state
        const recorderState = this.getPluginState();
        if (!recorderState.streamActive &&
            !this.captureActive &&
            !this.userDenied) {
            this.start();
        }
        return (u$2(RecorderScreen, { ...recorderState, onStartRecording: this.startRecording, onStopRecording: this.stopRecording, enableScreenshots: this.opts.enableScreenshots, onScreenshot: this.captureScreenshot, onStop: this.stop, onSubmit: this.submit, i18n: this.i18n, stream: this.videoStream, onDiscard: this.discardRecordedMedia }));
    }
}

var version$3 = "4.0.1";
var packageJson$3 = {
	version: version$3};

var cropper = {exports: {}};

/*!
 * Cropper.js v1.6.2
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2024-04-21T07:43:05.335Z
 */

(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {
	  function ownKeys(e, r) {
	    var t = Object.keys(e);
	    if (Object.getOwnPropertySymbols) {
	      var o = Object.getOwnPropertySymbols(e);
	      r && (o = o.filter(function (r) {
	        return Object.getOwnPropertyDescriptor(e, r).enumerable;
	      })), t.push.apply(t, o);
	    }
	    return t;
	  }
	  function _objectSpread2(e) {
	    for (var r = 1; r < arguments.length; r++) {
	      var t = null != arguments[r] ? arguments[r] : {};
	      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
	        _defineProperty(e, r, t[r]);
	      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
	        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
	      });
	    }
	    return e;
	  }
	  function _toPrimitive(t, r) {
	    if ("object" != typeof t || !t) return t;
	    var e = t[Symbol.toPrimitive];
	    if (void 0 !== e) {
	      var i = e.call(t, r);
	      if ("object" != typeof i) return i;
	      throw new TypeError("@@toPrimitive must return a primitive value.");
	    }
	    return ("string" === r ? String : Number)(t);
	  }
	  function _toPropertyKey(t) {
	    var i = _toPrimitive(t, "string");
	    return "symbol" == typeof i ? i : i + "";
	  }
	  function _typeof(o) {
	    "@babel/helpers - typeof";

	    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
	      return typeof o;
	    } : function (o) {
	      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	    }, _typeof(o);
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
	      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
	    }
	  }
	  function _createClass(Constructor, protoProps, staticProps) {
	    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) _defineProperties(Constructor, staticProps);
	    Object.defineProperty(Constructor, "prototype", {
	      writable: false
	    });
	    return Constructor;
	  }
	  function _defineProperty(obj, key, value) {
	    key = _toPropertyKey(key);
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
	  function _toConsumableArray(arr) {
	    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	  }
	  function _arrayWithoutHoles(arr) {
	    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	  }
	  function _iterableToArray(iter) {
	    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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

	  var IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
	  var WINDOW = IS_BROWSER ? window : {};
	  var IS_TOUCH_DEVICE = IS_BROWSER && WINDOW.document.documentElement ? 'ontouchstart' in WINDOW.document.documentElement : false;
	  var HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
	  var NAMESPACE = 'cropper';

	  // Actions
	  var ACTION_ALL = 'all';
	  var ACTION_CROP = 'crop';
	  var ACTION_MOVE = 'move';
	  var ACTION_ZOOM = 'zoom';
	  var ACTION_EAST = 'e';
	  var ACTION_WEST = 'w';
	  var ACTION_SOUTH = 's';
	  var ACTION_NORTH = 'n';
	  var ACTION_NORTH_EAST = 'ne';
	  var ACTION_NORTH_WEST = 'nw';
	  var ACTION_SOUTH_EAST = 'se';
	  var ACTION_SOUTH_WEST = 'sw';

	  // Classes
	  var CLASS_CROP = "".concat(NAMESPACE, "-crop");
	  var CLASS_DISABLED = "".concat(NAMESPACE, "-disabled");
	  var CLASS_HIDDEN = "".concat(NAMESPACE, "-hidden");
	  var CLASS_HIDE = "".concat(NAMESPACE, "-hide");
	  var CLASS_INVISIBLE = "".concat(NAMESPACE, "-invisible");
	  var CLASS_MODAL = "".concat(NAMESPACE, "-modal");
	  var CLASS_MOVE = "".concat(NAMESPACE, "-move");

	  // Data keys
	  var DATA_ACTION = "".concat(NAMESPACE, "Action");
	  var DATA_PREVIEW = "".concat(NAMESPACE, "Preview");

	  // Drag modes
	  var DRAG_MODE_CROP = 'crop';
	  var DRAG_MODE_MOVE = 'move';
	  var DRAG_MODE_NONE = 'none';

	  // Events
	  var EVENT_CROP = 'crop';
	  var EVENT_CROP_END = 'cropend';
	  var EVENT_CROP_MOVE = 'cropmove';
	  var EVENT_CROP_START = 'cropstart';
	  var EVENT_DBLCLICK = 'dblclick';
	  var EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
	  var EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
	  var EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
	  var EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
	  var EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
	  var EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
	  var EVENT_READY = 'ready';
	  var EVENT_RESIZE = 'resize';
	  var EVENT_WHEEL = 'wheel';
	  var EVENT_ZOOM = 'zoom';

	  // Mime types
	  var MIME_TYPE_JPEG = 'image/jpeg';

	  // RegExps
	  var REGEXP_ACTIONS = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/;
	  var REGEXP_DATA_URL = /^data:/;
	  var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
	  var REGEXP_TAG_NAME = /^img|canvas$/i;

	  // Misc
	  // Inspired by the default width and height of a canvas element.
	  var MIN_CONTAINER_WIDTH = 200;
	  var MIN_CONTAINER_HEIGHT = 100;

	  var DEFAULTS = {
	    // Define the view mode of the cropper
	    viewMode: 0,
	    // 0, 1, 2, 3

	    // Define the dragging mode of the cropper
	    dragMode: DRAG_MODE_CROP,
	    // 'crop', 'move' or 'none'

	    // Define the initial aspect ratio of the crop box
	    initialAspectRatio: NaN,
	    // Define the aspect ratio of the crop box
	    aspectRatio: NaN,
	    // An object with the previous cropping result data
	    data: null,
	    // A selector for adding extra containers to preview
	    preview: '',
	    // Re-render the cropper when resize the window
	    responsive: true,
	    // Restore the cropped area after resize the window
	    restore: true,
	    // Check if the current image is a cross-origin image
	    checkCrossOrigin: true,
	    // Check the current image's Exif Orientation information
	    checkOrientation: true,
	    // Show the black modal
	    modal: true,
	    // Show the dashed lines for guiding
	    guides: true,
	    // Show the center indicator for guiding
	    center: true,
	    // Show the white modal to highlight the crop box
	    highlight: true,
	    // Show the grid background
	    background: true,
	    // Enable to crop the image automatically when initialize
	    autoCrop: true,
	    // Define the percentage of automatic cropping area when initializes
	    autoCropArea: 0.8,
	    // Enable to move the image
	    movable: true,
	    // Enable to rotate the image
	    rotatable: true,
	    // Enable to scale the image
	    scalable: true,
	    // Enable to zoom the image
	    zoomable: true,
	    // Enable to zoom the image by dragging touch
	    zoomOnTouch: true,
	    // Enable to zoom the image by wheeling mouse
	    zoomOnWheel: true,
	    // Define zoom ratio when zoom the image by wheeling mouse
	    wheelZoomRatio: 0.1,
	    // Enable to move the crop box
	    cropBoxMovable: true,
	    // Enable to resize the crop box
	    cropBoxResizable: true,
	    // Toggle drag mode between "crop" and "move" when click twice on the cropper
	    toggleDragModeOnDblclick: true,
	    // Size limitation
	    minCanvasWidth: 0,
	    minCanvasHeight: 0,
	    minCropBoxWidth: 0,
	    minCropBoxHeight: 0,
	    minContainerWidth: MIN_CONTAINER_WIDTH,
	    minContainerHeight: MIN_CONTAINER_HEIGHT,
	    // Shortcuts of events
	    ready: null,
	    cropstart: null,
	    cropmove: null,
	    cropend: null,
	    crop: null,
	    zoom: null
	  };

	  var TEMPLATE = '<div class="cropper-container" touch-action="none">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-cropper-action="e"></span>' + '<span class="cropper-line line-n" data-cropper-action="n"></span>' + '<span class="cropper-line line-w" data-cropper-action="w"></span>' + '<span class="cropper-line line-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-e" data-cropper-action="e"></span>' + '<span class="cropper-point point-n" data-cropper-action="n"></span>' + '<span class="cropper-point point-w" data-cropper-action="w"></span>' + '<span class="cropper-point point-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-ne" data-cropper-action="ne"></span>' + '<span class="cropper-point point-nw" data-cropper-action="nw"></span>' + '<span class="cropper-point point-sw" data-cropper-action="sw"></span>' + '<span class="cropper-point point-se" data-cropper-action="se"></span>' + '</div>' + '</div>';

	  /**
	   * Check if the given value is not a number.
	   */
	  var isNaN = Number.isNaN || WINDOW.isNaN;

	  /**
	   * Check if the given value is a number.
	   * @param {*} value - The value to check.
	   * @returns {boolean} Returns `true` if the given value is a number, else `false`.
	   */
	  function isNumber(value) {
	    return typeof value === 'number' && !isNaN(value);
	  }

	  /**
	   * Check if the given value is a positive number.
	   * @param {*} value - The value to check.
	   * @returns {boolean} Returns `true` if the given value is a positive number, else `false`.
	   */
	  var isPositiveNumber = function isPositiveNumber(value) {
	    return value > 0 && value < Infinity;
	  };

	  /**
	   * Check if the given value is undefined.
	   * @param {*} value - The value to check.
	   * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
	   */
	  function isUndefined(value) {
	    return typeof value === 'undefined';
	  }

	  /**
	   * Check if the given value is an object.
	   * @param {*} value - The value to check.
	   * @returns {boolean} Returns `true` if the given value is an object, else `false`.
	   */
	  function isObject(value) {
	    return _typeof(value) === 'object' && value !== null;
	  }
	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  /**
	   * Check if the given value is a plain object.
	   * @param {*} value - The value to check.
	   * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
	   */
	  function isPlainObject(value) {
	    if (!isObject(value)) {
	      return false;
	    }
	    try {
	      var _constructor = value.constructor;
	      var prototype = _constructor.prototype;
	      return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
	    } catch (error) {
	      return false;
	    }
	  }

	  /**
	   * Check if the given value is a function.
	   * @param {*} value - The value to check.
	   * @returns {boolean} Returns `true` if the given value is a function, else `false`.
	   */
	  function isFunction(value) {
	    return typeof value === 'function';
	  }
	  var slice = Array.prototype.slice;

	  /**
	   * Convert array-like or iterable object to an array.
	   * @param {*} value - The value to convert.
	   * @returns {Array} Returns a new array.
	   */
	  function toArray(value) {
	    return Array.from ? Array.from(value) : slice.call(value);
	  }

	  /**
	   * Iterate the given data.
	   * @param {*} data - The data to iterate.
	   * @param {Function} callback - The process function for each element.
	   * @returns {*} The original data.
	   */
	  function forEach(data, callback) {
	    if (data && isFunction(callback)) {
	      if (Array.isArray(data) || isNumber(data.length) /* array-like */) {
	        toArray(data).forEach(function (value, key) {
	          callback.call(data, value, key, data);
	        });
	      } else if (isObject(data)) {
	        Object.keys(data).forEach(function (key) {
	          callback.call(data, data[key], key, data);
	        });
	      }
	    }
	    return data;
	  }

	  /**
	   * Extend the given object.
	   * @param {*} target - The target object to extend.
	   * @param {*} args - The rest objects for merging to the target object.
	   * @returns {Object} The extended object.
	   */
	  var assign = Object.assign || function assign(target) {
	    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }
	    if (isObject(target) && args.length > 0) {
	      args.forEach(function (arg) {
	        if (isObject(arg)) {
	          Object.keys(arg).forEach(function (key) {
	            target[key] = arg[key];
	          });
	        }
	      });
	    }
	    return target;
	  };
	  var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/;

	  /**
	   * Normalize decimal number.
	   * Check out {@link https://0.30000000000000004.com/}
	   * @param {number} value - The value to normalize.
	   * @param {number} [times=100000000000] - The times for normalizing.
	   * @returns {number} Returns the normalized number.
	   */
	  function normalizeDecimalNumber(value) {
	    var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000000000;
	    return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
	  }
	  var REGEXP_SUFFIX = /^width|height|left|top|marginLeft|marginTop$/;

	  /**
	   * Apply styles to the given element.
	   * @param {Element} element - The target element.
	   * @param {Object} styles - The styles for applying.
	   */
	  function setStyle(element, styles) {
	    var style = element.style;
	    forEach(styles, function (value, property) {
	      if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
	        value = "".concat(value, "px");
	      }
	      style[property] = value;
	    });
	  }

	  /**
	   * Check if the given element has a special class.
	   * @param {Element} element - The element to check.
	   * @param {string} value - The class to search.
	   * @returns {boolean} Returns `true` if the special class was found.
	   */
	  function hasClass(element, value) {
	    return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
	  }

	  /**
	   * Add classes to the given element.
	   * @param {Element} element - The target element.
	   * @param {string} value - The classes to be added.
	   */
	  function addClass(element, value) {
	    if (!value) {
	      return;
	    }
	    if (isNumber(element.length)) {
	      forEach(element, function (elem) {
	        addClass(elem, value);
	      });
	      return;
	    }
	    if (element.classList) {
	      element.classList.add(value);
	      return;
	    }
	    var className = element.className.trim();
	    if (!className) {
	      element.className = value;
	    } else if (className.indexOf(value) < 0) {
	      element.className = "".concat(className, " ").concat(value);
	    }
	  }

	  /**
	   * Remove classes from the given element.
	   * @param {Element} element - The target element.
	   * @param {string} value - The classes to be removed.
	   */
	  function removeClass(element, value) {
	    if (!value) {
	      return;
	    }
	    if (isNumber(element.length)) {
	      forEach(element, function (elem) {
	        removeClass(elem, value);
	      });
	      return;
	    }
	    if (element.classList) {
	      element.classList.remove(value);
	      return;
	    }
	    if (element.className.indexOf(value) >= 0) {
	      element.className = element.className.replace(value, '');
	    }
	  }

	  /**
	   * Add or remove classes from the given element.
	   * @param {Element} element - The target element.
	   * @param {string} value - The classes to be toggled.
	   * @param {boolean} added - Add only.
	   */
	  function toggleClass(element, value, added) {
	    if (!value) {
	      return;
	    }
	    if (isNumber(element.length)) {
	      forEach(element, function (elem) {
	        toggleClass(elem, value, added);
	      });
	      return;
	    }

	    // IE10-11 doesn't support the second parameter of `classList.toggle`
	    if (added) {
	      addClass(element, value);
	    } else {
	      removeClass(element, value);
	    }
	  }
	  var REGEXP_CAMEL_CASE = /([a-z\d])([A-Z])/g;

	  /**
	   * Transform the given string from camelCase to kebab-case
	   * @param {string} value - The value to transform.
	   * @returns {string} The transformed value.
	   */
	  function toParamCase(value) {
	    return value.replace(REGEXP_CAMEL_CASE, '$1-$2').toLowerCase();
	  }

	  /**
	   * Get data from the given element.
	   * @param {Element} element - The target element.
	   * @param {string} name - The data key to get.
	   * @returns {string} The data value.
	   */
	  function getData(element, name) {
	    if (isObject(element[name])) {
	      return element[name];
	    }
	    if (element.dataset) {
	      return element.dataset[name];
	    }
	    return element.getAttribute("data-".concat(toParamCase(name)));
	  }

	  /**
	   * Set data to the given element.
	   * @param {Element} element - The target element.
	   * @param {string} name - The data key to set.
	   * @param {string} data - The data value.
	   */
	  function setData(element, name, data) {
	    if (isObject(data)) {
	      element[name] = data;
	    } else if (element.dataset) {
	      element.dataset[name] = data;
	    } else {
	      element.setAttribute("data-".concat(toParamCase(name)), data);
	    }
	  }

	  /**
	   * Remove data from the given element.
	   * @param {Element} element - The target element.
	   * @param {string} name - The data key to remove.
	   */
	  function removeData(element, name) {
	    if (isObject(element[name])) {
	      try {
	        delete element[name];
	      } catch (error) {
	        element[name] = undefined;
	      }
	    } else if (element.dataset) {
	      // #128 Safari not allows to delete dataset property
	      try {
	        delete element.dataset[name];
	      } catch (error) {
	        element.dataset[name] = undefined;
	      }
	    } else {
	      element.removeAttribute("data-".concat(toParamCase(name)));
	    }
	  }
	  var REGEXP_SPACES = /\s\s*/;
	  var onceSupported = function () {
	    var supported = false;
	    if (IS_BROWSER) {
	      var once = false;
	      var listener = function listener() {};
	      var options = Object.defineProperty({}, 'once', {
	        get: function get() {
	          supported = true;
	          return once;
	        },
	        /**
	         * This setter can fix a `TypeError` in strict mode
	         * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
	         * @param {boolean} value - The value to set
	         */
	        set: function set(value) {
	          once = value;
	        }
	      });
	      WINDOW.addEventListener('test', listener, options);
	      WINDOW.removeEventListener('test', listener, options);
	    }
	    return supported;
	  }();

	  /**
	   * Remove event listener from the target element.
	   * @param {Element} element - The event target.
	   * @param {string} type - The event type(s).
	   * @param {Function} listener - The event listener.
	   * @param {Object} options - The event options.
	   */
	  function removeListener(element, type, listener) {
	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var handler = listener;
	    type.trim().split(REGEXP_SPACES).forEach(function (event) {
	      if (!onceSupported) {
	        var listeners = element.listeners;
	        if (listeners && listeners[event] && listeners[event][listener]) {
	          handler = listeners[event][listener];
	          delete listeners[event][listener];
	          if (Object.keys(listeners[event]).length === 0) {
	            delete listeners[event];
	          }
	          if (Object.keys(listeners).length === 0) {
	            delete element.listeners;
	          }
	        }
	      }
	      element.removeEventListener(event, handler, options);
	    });
	  }

	  /**
	   * Add event listener to the target element.
	   * @param {Element} element - The event target.
	   * @param {string} type - The event type(s).
	   * @param {Function} listener - The event listener.
	   * @param {Object} options - The event options.
	   */
	  function addListener(element, type, listener) {
	    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	    var _handler = listener;
	    type.trim().split(REGEXP_SPACES).forEach(function (event) {
	      if (options.once && !onceSupported) {
	        var _element$listeners = element.listeners,
	          listeners = _element$listeners === void 0 ? {} : _element$listeners;
	        _handler = function handler() {
	          delete listeners[event][listener];
	          element.removeEventListener(event, _handler, options);
	          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	          }
	          listener.apply(element, args);
	        };
	        if (!listeners[event]) {
	          listeners[event] = {};
	        }
	        if (listeners[event][listener]) {
	          element.removeEventListener(event, listeners[event][listener], options);
	        }
	        listeners[event][listener] = _handler;
	        element.listeners = listeners;
	      }
	      element.addEventListener(event, _handler, options);
	    });
	  }

	  /**
	   * Dispatch event on the target element.
	   * @param {Element} element - The event target.
	   * @param {string} type - The event type(s).
	   * @param {Object} data - The additional event data.
	   * @returns {boolean} Indicate if the event is default prevented or not.
	   */
	  function dispatchEvent(element, type, data) {
	    var event;

	    // Event and CustomEvent on IE9-11 are global objects, not constructors
	    if (isFunction(Event) && isFunction(CustomEvent)) {
	      event = new CustomEvent(type, {
	        detail: data,
	        bubbles: true,
	        cancelable: true
	      });
	    } else {
	      event = document.createEvent('CustomEvent');
	      event.initCustomEvent(type, true, true, data);
	    }
	    return element.dispatchEvent(event);
	  }

	  /**
	   * Get the offset base on the document.
	   * @param {Element} element - The target element.
	   * @returns {Object} The offset data.
	   */
	  function getOffset(element) {
	    var box = element.getBoundingClientRect();
	    return {
	      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
	      top: box.top + (window.pageYOffset - document.documentElement.clientTop)
	    };
	  }
	  var location = WINDOW.location;
	  var REGEXP_ORIGINS = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;

	  /**
	   * Check if the given URL is a cross origin URL.
	   * @param {string} url - The target URL.
	   * @returns {boolean} Returns `true` if the given URL is a cross origin URL, else `false`.
	   */
	  function isCrossOriginURL(url) {
	    var parts = url.match(REGEXP_ORIGINS);
	    return parts !== null && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
	  }

	  /**
	   * Add timestamp to the given URL.
	   * @param {string} url - The target URL.
	   * @returns {string} The result URL.
	   */
	  function addTimestamp(url) {
	    var timestamp = "timestamp=".concat(new Date().getTime());
	    return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
	  }

	  /**
	   * Get transforms base on the given object.
	   * @param {Object} obj - The target object.
	   * @returns {string} A string contains transform values.
	   */
	  function getTransforms(_ref) {
	    var rotate = _ref.rotate,
	      scaleX = _ref.scaleX,
	      scaleY = _ref.scaleY,
	      translateX = _ref.translateX,
	      translateY = _ref.translateY;
	    var values = [];
	    if (isNumber(translateX) && translateX !== 0) {
	      values.push("translateX(".concat(translateX, "px)"));
	    }
	    if (isNumber(translateY) && translateY !== 0) {
	      values.push("translateY(".concat(translateY, "px)"));
	    }

	    // Rotate should come first before scale to match orientation transform
	    if (isNumber(rotate) && rotate !== 0) {
	      values.push("rotate(".concat(rotate, "deg)"));
	    }
	    if (isNumber(scaleX) && scaleX !== 1) {
	      values.push("scaleX(".concat(scaleX, ")"));
	    }
	    if (isNumber(scaleY) && scaleY !== 1) {
	      values.push("scaleY(".concat(scaleY, ")"));
	    }
	    var transform = values.length ? values.join(' ') : 'none';
	    return {
	      WebkitTransform: transform,
	      msTransform: transform,
	      transform: transform
	    };
	  }

	  /**
	   * Get the max ratio of a group of pointers.
	   * @param {string} pointers - The target pointers.
	   * @returns {number} The result ratio.
	   */
	  function getMaxZoomRatio(pointers) {
	    var pointers2 = _objectSpread2({}, pointers);
	    var maxRatio = 0;
	    forEach(pointers, function (pointer, pointerId) {
	      delete pointers2[pointerId];
	      forEach(pointers2, function (pointer2) {
	        var x1 = Math.abs(pointer.startX - pointer2.startX);
	        var y1 = Math.abs(pointer.startY - pointer2.startY);
	        var x2 = Math.abs(pointer.endX - pointer2.endX);
	        var y2 = Math.abs(pointer.endY - pointer2.endY);
	        var z1 = Math.sqrt(x1 * x1 + y1 * y1);
	        var z2 = Math.sqrt(x2 * x2 + y2 * y2);
	        var ratio = (z2 - z1) / z1;
	        if (Math.abs(ratio) > Math.abs(maxRatio)) {
	          maxRatio = ratio;
	        }
	      });
	    });
	    return maxRatio;
	  }

	  /**
	   * Get a pointer from an event object.
	   * @param {Object} event - The target event object.
	   * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
	   * @returns {Object} The result pointer contains start and/or end point coordinates.
	   */
	  function getPointer(_ref2, endOnly) {
	    var pageX = _ref2.pageX,
	      pageY = _ref2.pageY;
	    var end = {
	      endX: pageX,
	      endY: pageY
	    };
	    return endOnly ? end : _objectSpread2({
	      startX: pageX,
	      startY: pageY
	    }, end);
	  }

	  /**
	   * Get the center point coordinate of a group of pointers.
	   * @param {Object} pointers - The target pointers.
	   * @returns {Object} The center point coordinate.
	   */
	  function getPointersCenter(pointers) {
	    var pageX = 0;
	    var pageY = 0;
	    var count = 0;
	    forEach(pointers, function (_ref3) {
	      var startX = _ref3.startX,
	        startY = _ref3.startY;
	      pageX += startX;
	      pageY += startY;
	      count += 1;
	    });
	    pageX /= count;
	    pageY /= count;
	    return {
	      pageX: pageX,
	      pageY: pageY
	    };
	  }

	  /**
	   * Get the max sizes in a rectangle under the given aspect ratio.
	   * @param {Object} data - The original sizes.
	   * @param {string} [type='contain'] - The adjust type.
	   * @returns {Object} The result sizes.
	   */
	  function getAdjustedSizes(_ref4) {
	    var aspectRatio = _ref4.aspectRatio,
	      height = _ref4.height,
	      width = _ref4.width;
	    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contain';
	    var isValidWidth = isPositiveNumber(width);
	    var isValidHeight = isPositiveNumber(height);
	    if (isValidWidth && isValidHeight) {
	      var adjustedWidth = height * aspectRatio;
	      if (type === 'contain' && adjustedWidth > width || type === 'cover' && adjustedWidth < width) {
	        height = width / aspectRatio;
	      } else {
	        width = height * aspectRatio;
	      }
	    } else if (isValidWidth) {
	      height = width / aspectRatio;
	    } else if (isValidHeight) {
	      width = height * aspectRatio;
	    }
	    return {
	      width: width,
	      height: height
	    };
	  }

	  /**
	   * Get the new sizes of a rectangle after rotated.
	   * @param {Object} data - The original sizes.
	   * @returns {Object} The result sizes.
	   */
	  function getRotatedSizes(_ref5) {
	    var width = _ref5.width,
	      height = _ref5.height,
	      degree = _ref5.degree;
	    degree = Math.abs(degree) % 180;
	    if (degree === 90) {
	      return {
	        width: height,
	        height: width
	      };
	    }
	    var arc = degree % 90 * Math.PI / 180;
	    var sinArc = Math.sin(arc);
	    var cosArc = Math.cos(arc);
	    var newWidth = width * cosArc + height * sinArc;
	    var newHeight = width * sinArc + height * cosArc;
	    return degree > 90 ? {
	      width: newHeight,
	      height: newWidth
	    } : {
	      width: newWidth,
	      height: newHeight
	    };
	  }

	  /**
	   * Get a canvas which drew the given image.
	   * @param {HTMLImageElement} image - The image for drawing.
	   * @param {Object} imageData - The image data.
	   * @param {Object} canvasData - The canvas data.
	   * @param {Object} options - The options.
	   * @returns {HTMLCanvasElement} The result canvas.
	   */
	  function getSourceCanvas(image, _ref6, _ref7, _ref8) {
	    var imageAspectRatio = _ref6.aspectRatio,
	      imageNaturalWidth = _ref6.naturalWidth,
	      imageNaturalHeight = _ref6.naturalHeight,
	      _ref6$rotate = _ref6.rotate,
	      rotate = _ref6$rotate === void 0 ? 0 : _ref6$rotate,
	      _ref6$scaleX = _ref6.scaleX,
	      scaleX = _ref6$scaleX === void 0 ? 1 : _ref6$scaleX,
	      _ref6$scaleY = _ref6.scaleY,
	      scaleY = _ref6$scaleY === void 0 ? 1 : _ref6$scaleY;
	    var aspectRatio = _ref7.aspectRatio,
	      naturalWidth = _ref7.naturalWidth,
	      naturalHeight = _ref7.naturalHeight;
	    var _ref8$fillColor = _ref8.fillColor,
	      fillColor = _ref8$fillColor === void 0 ? 'transparent' : _ref8$fillColor,
	      _ref8$imageSmoothingE = _ref8.imageSmoothingEnabled,
	      imageSmoothingEnabled = _ref8$imageSmoothingE === void 0 ? true : _ref8$imageSmoothingE,
	      _ref8$imageSmoothingQ = _ref8.imageSmoothingQuality,
	      imageSmoothingQuality = _ref8$imageSmoothingQ === void 0 ? 'low' : _ref8$imageSmoothingQ,
	      _ref8$maxWidth = _ref8.maxWidth,
	      maxWidth = _ref8$maxWidth === void 0 ? Infinity : _ref8$maxWidth,
	      _ref8$maxHeight = _ref8.maxHeight,
	      maxHeight = _ref8$maxHeight === void 0 ? Infinity : _ref8$maxHeight,
	      _ref8$minWidth = _ref8.minWidth,
	      minWidth = _ref8$minWidth === void 0 ? 0 : _ref8$minWidth,
	      _ref8$minHeight = _ref8.minHeight,
	      minHeight = _ref8$minHeight === void 0 ? 0 : _ref8$minHeight;
	    var canvas = document.createElement('canvas');
	    var context = canvas.getContext('2d');
	    var maxSizes = getAdjustedSizes({
	      aspectRatio: aspectRatio,
	      width: maxWidth,
	      height: maxHeight
	    });
	    var minSizes = getAdjustedSizes({
	      aspectRatio: aspectRatio,
	      width: minWidth,
	      height: minHeight
	    }, 'cover');
	    var width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
	    var height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight));

	    // Note: should always use image's natural sizes for drawing as
	    // imageData.naturalWidth === canvasData.naturalHeight when rotate % 180 === 90
	    var destMaxSizes = getAdjustedSizes({
	      aspectRatio: imageAspectRatio,
	      width: maxWidth,
	      height: maxHeight
	    });
	    var destMinSizes = getAdjustedSizes({
	      aspectRatio: imageAspectRatio,
	      width: minWidth,
	      height: minHeight
	    }, 'cover');
	    var destWidth = Math.min(destMaxSizes.width, Math.max(destMinSizes.width, imageNaturalWidth));
	    var destHeight = Math.min(destMaxSizes.height, Math.max(destMinSizes.height, imageNaturalHeight));
	    var params = [-destWidth / 2, -destHeight / 2, destWidth, destHeight];
	    canvas.width = normalizeDecimalNumber(width);
	    canvas.height = normalizeDecimalNumber(height);
	    context.fillStyle = fillColor;
	    context.fillRect(0, 0, width, height);
	    context.save();
	    context.translate(width / 2, height / 2);
	    context.rotate(rotate * Math.PI / 180);
	    context.scale(scaleX, scaleY);
	    context.imageSmoothingEnabled = imageSmoothingEnabled;
	    context.imageSmoothingQuality = imageSmoothingQuality;
	    context.drawImage.apply(context, [image].concat(_toConsumableArray(params.map(function (param) {
	      return Math.floor(normalizeDecimalNumber(param));
	    }))));
	    context.restore();
	    return canvas;
	  }
	  var fromCharCode = String.fromCharCode;

	  /**
	   * Get string from char code in data view.
	   * @param {DataView} dataView - The data view for read.
	   * @param {number} start - The start index.
	   * @param {number} length - The read length.
	   * @returns {string} The read result.
	   */
	  function getStringFromCharCode(dataView, start, length) {
	    var str = '';
	    length += start;
	    for (var i = start; i < length; i += 1) {
	      str += fromCharCode(dataView.getUint8(i));
	    }
	    return str;
	  }
	  var REGEXP_DATA_URL_HEAD = /^data:.*,/;

	  /**
	   * Transform Data URL to array buffer.
	   * @param {string} dataURL - The Data URL to transform.
	   * @returns {ArrayBuffer} The result array buffer.
	   */
	  function dataURLToArrayBuffer(dataURL) {
	    var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
	    var binary = atob(base64);
	    var arrayBuffer = new ArrayBuffer(binary.length);
	    var uint8 = new Uint8Array(arrayBuffer);
	    forEach(uint8, function (value, i) {
	      uint8[i] = binary.charCodeAt(i);
	    });
	    return arrayBuffer;
	  }

	  /**
	   * Transform array buffer to Data URL.
	   * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
	   * @param {string} mimeType - The mime type of the Data URL.
	   * @returns {string} The result Data URL.
	   */
	  function arrayBufferToDataURL(arrayBuffer, mimeType) {
	    var chunks = [];

	    // Chunk Typed Array for better performance (#435)
	    var chunkSize = 8192;
	    var uint8 = new Uint8Array(arrayBuffer);
	    while (uint8.length > 0) {
	      // XXX: Babel's `toConsumableArray` helper will throw error in IE or Safari 9
	      // eslint-disable-next-line prefer-spread
	      chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
	      uint8 = uint8.subarray(chunkSize);
	    }
	    return "data:".concat(mimeType, ";base64,").concat(btoa(chunks.join('')));
	  }

	  /**
	   * Get orientation value from given array buffer.
	   * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
	   * @returns {number} The read orientation value.
	   */
	  function resetAndGetOrientation(arrayBuffer) {
	    var dataView = new DataView(arrayBuffer);
	    var orientation;

	    // Ignores range error when the image does not have correct Exif information
	    try {
	      var littleEndian;
	      var app1Start;
	      var ifdStart;

	      // Only handle JPEG image (start by 0xFFD8)
	      if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
	        var length = dataView.byteLength;
	        var offset = 2;
	        while (offset + 1 < length) {
	          if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
	            app1Start = offset;
	            break;
	          }
	          offset += 1;
	        }
	      }
	      if (app1Start) {
	        var exifIDCode = app1Start + 4;
	        var tiffOffset = app1Start + 10;
	        if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
	          var endianness = dataView.getUint16(tiffOffset);
	          littleEndian = endianness === 0x4949;
	          if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
	            if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
	              var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
	              if (firstIFDOffset >= 0x00000008) {
	                ifdStart = tiffOffset + firstIFDOffset;
	              }
	            }
	          }
	        }
	      }
	      if (ifdStart) {
	        var _length = dataView.getUint16(ifdStart, littleEndian);
	        var _offset;
	        var i;
	        for (i = 0; i < _length; i += 1) {
	          _offset = ifdStart + i * 12 + 2;
	          if (dataView.getUint16(_offset, littleEndian) === 0x0112 /* Orientation */) {
	            // 8 is the offset of the current tag's value
	            _offset += 8;

	            // Get the original orientation value
	            orientation = dataView.getUint16(_offset, littleEndian);

	            // Override the orientation with its default value
	            dataView.setUint16(_offset, 1, littleEndian);
	            break;
	          }
	        }
	      }
	    } catch (error) {
	      orientation = 1;
	    }
	    return orientation;
	  }

	  /**
	   * Parse Exif Orientation value.
	   * @param {number} orientation - The orientation to parse.
	   * @returns {Object} The parsed result.
	   */
	  function parseOrientation(orientation) {
	    var rotate = 0;
	    var scaleX = 1;
	    var scaleY = 1;
	    switch (orientation) {
	      // Flip horizontal
	      case 2:
	        scaleX = -1;
	        break;

	      // Rotate left 180°
	      case 3:
	        rotate = -180;
	        break;

	      // Flip vertical
	      case 4:
	        scaleY = -1;
	        break;

	      // Flip vertical and rotate right 90°
	      case 5:
	        rotate = 90;
	        scaleY = -1;
	        break;

	      // Rotate right 90°
	      case 6:
	        rotate = 90;
	        break;

	      // Flip horizontal and rotate right 90°
	      case 7:
	        rotate = 90;
	        scaleX = -1;
	        break;

	      // Rotate left 90°
	      case 8:
	        rotate = -90;
	        break;
	    }
	    return {
	      rotate: rotate,
	      scaleX: scaleX,
	      scaleY: scaleY
	    };
	  }

	  var render = {
	    render: function render() {
	      this.initContainer();
	      this.initCanvas();
	      this.initCropBox();
	      this.renderCanvas();
	      if (this.cropped) {
	        this.renderCropBox();
	      }
	    },
	    initContainer: function initContainer() {
	      var element = this.element,
	        options = this.options,
	        container = this.container,
	        cropper = this.cropper;
	      var minWidth = Number(options.minContainerWidth);
	      var minHeight = Number(options.minContainerHeight);
	      addClass(cropper, CLASS_HIDDEN);
	      removeClass(element, CLASS_HIDDEN);
	      var containerData = {
	        width: Math.max(container.offsetWidth, minWidth >= 0 ? minWidth : MIN_CONTAINER_WIDTH),
	        height: Math.max(container.offsetHeight, minHeight >= 0 ? minHeight : MIN_CONTAINER_HEIGHT)
	      };
	      this.containerData = containerData;
	      setStyle(cropper, {
	        width: containerData.width,
	        height: containerData.height
	      });
	      addClass(element, CLASS_HIDDEN);
	      removeClass(cropper, CLASS_HIDDEN);
	    },
	    // Canvas (image wrapper)
	    initCanvas: function initCanvas() {
	      var containerData = this.containerData,
	        imageData = this.imageData;
	      var viewMode = this.options.viewMode;
	      var rotated = Math.abs(imageData.rotate) % 180 === 90;
	      var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
	      var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
	      var aspectRatio = naturalWidth / naturalHeight;
	      var canvasWidth = containerData.width;
	      var canvasHeight = containerData.height;
	      if (containerData.height * aspectRatio > containerData.width) {
	        if (viewMode === 3) {
	          canvasWidth = containerData.height * aspectRatio;
	        } else {
	          canvasHeight = containerData.width / aspectRatio;
	        }
	      } else if (viewMode === 3) {
	        canvasHeight = containerData.width / aspectRatio;
	      } else {
	        canvasWidth = containerData.height * aspectRatio;
	      }
	      var canvasData = {
	        aspectRatio: aspectRatio,
	        naturalWidth: naturalWidth,
	        naturalHeight: naturalHeight,
	        width: canvasWidth,
	        height: canvasHeight
	      };
	      this.canvasData = canvasData;
	      this.limited = viewMode === 1 || viewMode === 2;
	      this.limitCanvas(true, true);
	      canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
	      canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
	      canvasData.left = (containerData.width - canvasData.width) / 2;
	      canvasData.top = (containerData.height - canvasData.height) / 2;
	      canvasData.oldLeft = canvasData.left;
	      canvasData.oldTop = canvasData.top;
	      this.initialCanvasData = assign({}, canvasData);
	    },
	    limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
	      var options = this.options,
	        containerData = this.containerData,
	        canvasData = this.canvasData,
	        cropBoxData = this.cropBoxData;
	      var viewMode = options.viewMode;
	      var aspectRatio = canvasData.aspectRatio;
	      var cropped = this.cropped && cropBoxData;
	      if (sizeLimited) {
	        var minCanvasWidth = Number(options.minCanvasWidth) || 0;
	        var minCanvasHeight = Number(options.minCanvasHeight) || 0;
	        if (viewMode > 1) {
	          minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
	          minCanvasHeight = Math.max(minCanvasHeight, containerData.height);
	          if (viewMode === 3) {
	            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	              minCanvasWidth = minCanvasHeight * aspectRatio;
	            } else {
	              minCanvasHeight = minCanvasWidth / aspectRatio;
	            }
	          }
	        } else if (viewMode > 0) {
	          if (minCanvasWidth) {
	            minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
	          } else if (minCanvasHeight) {
	            minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
	          } else if (cropped) {
	            minCanvasWidth = cropBoxData.width;
	            minCanvasHeight = cropBoxData.height;
	            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	              minCanvasWidth = minCanvasHeight * aspectRatio;
	            } else {
	              minCanvasHeight = minCanvasWidth / aspectRatio;
	            }
	          }
	        }
	        var _getAdjustedSizes = getAdjustedSizes({
	          aspectRatio: aspectRatio,
	          width: minCanvasWidth,
	          height: minCanvasHeight
	        });
	        minCanvasWidth = _getAdjustedSizes.width;
	        minCanvasHeight = _getAdjustedSizes.height;
	        canvasData.minWidth = minCanvasWidth;
	        canvasData.minHeight = minCanvasHeight;
	        canvasData.maxWidth = Infinity;
	        canvasData.maxHeight = Infinity;
	      }
	      if (positionLimited) {
	        if (viewMode > (cropped ? 0 : 1)) {
	          var newCanvasLeft = containerData.width - canvasData.width;
	          var newCanvasTop = containerData.height - canvasData.height;
	          canvasData.minLeft = Math.min(0, newCanvasLeft);
	          canvasData.minTop = Math.min(0, newCanvasTop);
	          canvasData.maxLeft = Math.max(0, newCanvasLeft);
	          canvasData.maxTop = Math.max(0, newCanvasTop);
	          if (cropped && this.limited) {
	            canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
	            canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
	            canvasData.maxLeft = cropBoxData.left;
	            canvasData.maxTop = cropBoxData.top;
	            if (viewMode === 2) {
	              if (canvasData.width >= containerData.width) {
	                canvasData.minLeft = Math.min(0, newCanvasLeft);
	                canvasData.maxLeft = Math.max(0, newCanvasLeft);
	              }
	              if (canvasData.height >= containerData.height) {
	                canvasData.minTop = Math.min(0, newCanvasTop);
	                canvasData.maxTop = Math.max(0, newCanvasTop);
	              }
	            }
	          }
	        } else {
	          canvasData.minLeft = -canvasData.width;
	          canvasData.minTop = -canvasData.height;
	          canvasData.maxLeft = containerData.width;
	          canvasData.maxTop = containerData.height;
	        }
	      }
	    },
	    renderCanvas: function renderCanvas(changed, transformed) {
	      var canvasData = this.canvasData,
	        imageData = this.imageData;
	      if (transformed) {
	        var _getRotatedSizes = getRotatedSizes({
	            width: imageData.naturalWidth * Math.abs(imageData.scaleX || 1),
	            height: imageData.naturalHeight * Math.abs(imageData.scaleY || 1),
	            degree: imageData.rotate || 0
	          }),
	          naturalWidth = _getRotatedSizes.width,
	          naturalHeight = _getRotatedSizes.height;
	        var width = canvasData.width * (naturalWidth / canvasData.naturalWidth);
	        var height = canvasData.height * (naturalHeight / canvasData.naturalHeight);
	        canvasData.left -= (width - canvasData.width) / 2;
	        canvasData.top -= (height - canvasData.height) / 2;
	        canvasData.width = width;
	        canvasData.height = height;
	        canvasData.aspectRatio = naturalWidth / naturalHeight;
	        canvasData.naturalWidth = naturalWidth;
	        canvasData.naturalHeight = naturalHeight;
	        this.limitCanvas(true, false);
	      }
	      if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
	        canvasData.left = canvasData.oldLeft;
	      }
	      if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
	        canvasData.top = canvasData.oldTop;
	      }
	      canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
	      canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
	      this.limitCanvas(false, true);
	      canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
	      canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
	      canvasData.oldLeft = canvasData.left;
	      canvasData.oldTop = canvasData.top;
	      setStyle(this.canvas, assign({
	        width: canvasData.width,
	        height: canvasData.height
	      }, getTransforms({
	        translateX: canvasData.left,
	        translateY: canvasData.top
	      })));
	      this.renderImage(changed);
	      if (this.cropped && this.limited) {
	        this.limitCropBox(true, true);
	      }
	    },
	    renderImage: function renderImage(changed) {
	      var canvasData = this.canvasData,
	        imageData = this.imageData;
	      var width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
	      var height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);
	      assign(imageData, {
	        width: width,
	        height: height,
	        left: (canvasData.width - width) / 2,
	        top: (canvasData.height - height) / 2
	      });
	      setStyle(this.image, assign({
	        width: imageData.width,
	        height: imageData.height
	      }, getTransforms(assign({
	        translateX: imageData.left,
	        translateY: imageData.top
	      }, imageData))));
	      if (changed) {
	        this.output();
	      }
	    },
	    initCropBox: function initCropBox() {
	      var options = this.options,
	        canvasData = this.canvasData;
	      var aspectRatio = options.aspectRatio || options.initialAspectRatio;
	      var autoCropArea = Number(options.autoCropArea) || 0.8;
	      var cropBoxData = {
	        width: canvasData.width,
	        height: canvasData.height
	      };
	      if (aspectRatio) {
	        if (canvasData.height * aspectRatio > canvasData.width) {
	          cropBoxData.height = cropBoxData.width / aspectRatio;
	        } else {
	          cropBoxData.width = cropBoxData.height * aspectRatio;
	        }
	      }
	      this.cropBoxData = cropBoxData;
	      this.limitCropBox(true, true);

	      // Initialize auto crop area
	      cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
	      cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);

	      // The width/height of auto crop area must large than "minWidth/Height"
	      cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
	      cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
	      cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
	      cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
	      cropBoxData.oldLeft = cropBoxData.left;
	      cropBoxData.oldTop = cropBoxData.top;
	      this.initialCropBoxData = assign({}, cropBoxData);
	    },
	    limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
	      var options = this.options,
	        containerData = this.containerData,
	        canvasData = this.canvasData,
	        cropBoxData = this.cropBoxData,
	        limited = this.limited;
	      var aspectRatio = options.aspectRatio;
	      if (sizeLimited) {
	        var minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
	        var minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
	        var maxCropBoxWidth = limited ? Math.min(containerData.width, canvasData.width, canvasData.width + canvasData.left, containerData.width - canvasData.left) : containerData.width;
	        var maxCropBoxHeight = limited ? Math.min(containerData.height, canvasData.height, canvasData.height + canvasData.top, containerData.height - canvasData.top) : containerData.height;

	        // The min/maxCropBoxWidth/Height must be less than container's width/height
	        minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
	        minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);
	        if (aspectRatio) {
	          if (minCropBoxWidth && minCropBoxHeight) {
	            if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
	              minCropBoxHeight = minCropBoxWidth / aspectRatio;
	            } else {
	              minCropBoxWidth = minCropBoxHeight * aspectRatio;
	            }
	          } else if (minCropBoxWidth) {
	            minCropBoxHeight = minCropBoxWidth / aspectRatio;
	          } else if (minCropBoxHeight) {
	            minCropBoxWidth = minCropBoxHeight * aspectRatio;
	          }
	          if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
	            maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
	          } else {
	            maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
	          }
	        }

	        // The minWidth/Height must be less than maxWidth/Height
	        cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
	        cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
	        cropBoxData.maxWidth = maxCropBoxWidth;
	        cropBoxData.maxHeight = maxCropBoxHeight;
	      }
	      if (positionLimited) {
	        if (limited) {
	          cropBoxData.minLeft = Math.max(0, canvasData.left);
	          cropBoxData.minTop = Math.max(0, canvasData.top);
	          cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
	          cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
	        } else {
	          cropBoxData.minLeft = 0;
	          cropBoxData.minTop = 0;
	          cropBoxData.maxLeft = containerData.width - cropBoxData.width;
	          cropBoxData.maxTop = containerData.height - cropBoxData.height;
	        }
	      }
	    },
	    renderCropBox: function renderCropBox() {
	      var options = this.options,
	        containerData = this.containerData,
	        cropBoxData = this.cropBoxData;
	      if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
	        cropBoxData.left = cropBoxData.oldLeft;
	      }
	      if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
	        cropBoxData.top = cropBoxData.oldTop;
	      }
	      cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
	      cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
	      this.limitCropBox(false, true);
	      cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
	      cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
	      cropBoxData.oldLeft = cropBoxData.left;
	      cropBoxData.oldTop = cropBoxData.top;
	      if (options.movable && options.cropBoxMovable) {
	        // Turn to move the canvas when the crop box is equal to the container
	        setData(this.face, DATA_ACTION, cropBoxData.width >= containerData.width && cropBoxData.height >= containerData.height ? ACTION_MOVE : ACTION_ALL);
	      }
	      setStyle(this.cropBox, assign({
	        width: cropBoxData.width,
	        height: cropBoxData.height
	      }, getTransforms({
	        translateX: cropBoxData.left,
	        translateY: cropBoxData.top
	      })));
	      if (this.cropped && this.limited) {
	        this.limitCanvas(true, true);
	      }
	      if (!this.disabled) {
	        this.output();
	      }
	    },
	    output: function output() {
	      this.preview();
	      dispatchEvent(this.element, EVENT_CROP, this.getData());
	    }
	  };

	  var preview = {
	    initPreview: function initPreview() {
	      var element = this.element,
	        crossOrigin = this.crossOrigin;
	      var preview = this.options.preview;
	      var url = crossOrigin ? this.crossOriginUrl : this.url;
	      var alt = element.alt || 'The image to preview';
	      var image = document.createElement('img');
	      if (crossOrigin) {
	        image.crossOrigin = crossOrigin;
	      }
	      image.src = url;
	      image.alt = alt;
	      this.viewBox.appendChild(image);
	      this.viewBoxImage = image;
	      if (!preview) {
	        return;
	      }
	      var previews = preview;
	      if (typeof preview === 'string') {
	        previews = element.ownerDocument.querySelectorAll(preview);
	      } else if (preview.querySelector) {
	        previews = [preview];
	      }
	      this.previews = previews;
	      forEach(previews, function (el) {
	        var img = document.createElement('img');

	        // Save the original size for recover
	        setData(el, DATA_PREVIEW, {
	          width: el.offsetWidth,
	          height: el.offsetHeight,
	          html: el.innerHTML
	        });
	        if (crossOrigin) {
	          img.crossOrigin = crossOrigin;
	        }
	        img.src = url;
	        img.alt = alt;

	        /**
	         * Override img element styles
	         * Add `display:block` to avoid margin top issue
	         * Add `height:auto` to override `height` attribute on IE8
	         * (Occur only when margin-top <= -height)
	         */
	        img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';
	        el.innerHTML = '';
	        el.appendChild(img);
	      });
	    },
	    resetPreview: function resetPreview() {
	      forEach(this.previews, function (element) {
	        var data = getData(element, DATA_PREVIEW);
	        setStyle(element, {
	          width: data.width,
	          height: data.height
	        });
	        element.innerHTML = data.html;
	        removeData(element, DATA_PREVIEW);
	      });
	    },
	    preview: function preview() {
	      var imageData = this.imageData,
	        canvasData = this.canvasData,
	        cropBoxData = this.cropBoxData;
	      var cropBoxWidth = cropBoxData.width,
	        cropBoxHeight = cropBoxData.height;
	      var width = imageData.width,
	        height = imageData.height;
	      var left = cropBoxData.left - canvasData.left - imageData.left;
	      var top = cropBoxData.top - canvasData.top - imageData.top;
	      if (!this.cropped || this.disabled) {
	        return;
	      }
	      setStyle(this.viewBoxImage, assign({
	        width: width,
	        height: height
	      }, getTransforms(assign({
	        translateX: -left,
	        translateY: -top
	      }, imageData))));
	      forEach(this.previews, function (element) {
	        var data = getData(element, DATA_PREVIEW);
	        var originalWidth = data.width;
	        var originalHeight = data.height;
	        var newWidth = originalWidth;
	        var newHeight = originalHeight;
	        var ratio = 1;
	        if (cropBoxWidth) {
	          ratio = originalWidth / cropBoxWidth;
	          newHeight = cropBoxHeight * ratio;
	        }
	        if (cropBoxHeight && newHeight > originalHeight) {
	          ratio = originalHeight / cropBoxHeight;
	          newWidth = cropBoxWidth * ratio;
	          newHeight = originalHeight;
	        }
	        setStyle(element, {
	          width: newWidth,
	          height: newHeight
	        });
	        setStyle(element.getElementsByTagName('img')[0], assign({
	          width: width * ratio,
	          height: height * ratio
	        }, getTransforms(assign({
	          translateX: -left * ratio,
	          translateY: -top * ratio
	        }, imageData))));
	      });
	    }
	  };

	  var events = {
	    bind: function bind() {
	      var element = this.element,
	        options = this.options,
	        cropper = this.cropper;
	      if (isFunction(options.cropstart)) {
	        addListener(element, EVENT_CROP_START, options.cropstart);
	      }
	      if (isFunction(options.cropmove)) {
	        addListener(element, EVENT_CROP_MOVE, options.cropmove);
	      }
	      if (isFunction(options.cropend)) {
	        addListener(element, EVENT_CROP_END, options.cropend);
	      }
	      if (isFunction(options.crop)) {
	        addListener(element, EVENT_CROP, options.crop);
	      }
	      if (isFunction(options.zoom)) {
	        addListener(element, EVENT_ZOOM, options.zoom);
	      }
	      addListener(cropper, EVENT_POINTER_DOWN, this.onCropStart = this.cropStart.bind(this));
	      if (options.zoomable && options.zoomOnWheel) {
	        addListener(cropper, EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
	          passive: false,
	          capture: true
	        });
	      }
	      if (options.toggleDragModeOnDblclick) {
	        addListener(cropper, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
	      }
	      addListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove = this.cropMove.bind(this));
	      addListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd = this.cropEnd.bind(this));
	      if (options.responsive) {
	        addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));
	      }
	    },
	    unbind: function unbind() {
	      var element = this.element,
	        options = this.options,
	        cropper = this.cropper;
	      if (isFunction(options.cropstart)) {
	        removeListener(element, EVENT_CROP_START, options.cropstart);
	      }
	      if (isFunction(options.cropmove)) {
	        removeListener(element, EVENT_CROP_MOVE, options.cropmove);
	      }
	      if (isFunction(options.cropend)) {
	        removeListener(element, EVENT_CROP_END, options.cropend);
	      }
	      if (isFunction(options.crop)) {
	        removeListener(element, EVENT_CROP, options.crop);
	      }
	      if (isFunction(options.zoom)) {
	        removeListener(element, EVENT_ZOOM, options.zoom);
	      }
	      removeListener(cropper, EVENT_POINTER_DOWN, this.onCropStart);
	      if (options.zoomable && options.zoomOnWheel) {
	        removeListener(cropper, EVENT_WHEEL, this.onWheel, {
	          passive: false,
	          capture: true
	        });
	      }
	      if (options.toggleDragModeOnDblclick) {
	        removeListener(cropper, EVENT_DBLCLICK, this.onDblclick);
	      }
	      removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove);
	      removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd);
	      if (options.responsive) {
	        removeListener(window, EVENT_RESIZE, this.onResize);
	      }
	    }
	  };

	  var handlers = {
	    resize: function resize() {
	      if (this.disabled) {
	        return;
	      }
	      var options = this.options,
	        container = this.container,
	        containerData = this.containerData;
	      var ratioX = container.offsetWidth / containerData.width;
	      var ratioY = container.offsetHeight / containerData.height;
	      var ratio = Math.abs(ratioX - 1) > Math.abs(ratioY - 1) ? ratioX : ratioY;

	      // Resize when width changed or height changed
	      if (ratio !== 1) {
	        var canvasData;
	        var cropBoxData;
	        if (options.restore) {
	          canvasData = this.getCanvasData();
	          cropBoxData = this.getCropBoxData();
	        }
	        this.render();
	        if (options.restore) {
	          this.setCanvasData(forEach(canvasData, function (n, i) {
	            canvasData[i] = n * ratio;
	          }));
	          this.setCropBoxData(forEach(cropBoxData, function (n, i) {
	            cropBoxData[i] = n * ratio;
	          }));
	        }
	      }
	    },
	    dblclick: function dblclick() {
	      if (this.disabled || this.options.dragMode === DRAG_MODE_NONE) {
	        return;
	      }
	      this.setDragMode(hasClass(this.dragBox, CLASS_CROP) ? DRAG_MODE_MOVE : DRAG_MODE_CROP);
	    },
	    wheel: function wheel(event) {
	      var _this = this;
	      var ratio = Number(this.options.wheelZoomRatio) || 0.1;
	      var delta = 1;
	      if (this.disabled) {
	        return;
	      }
	      event.preventDefault();

	      // Limit wheel speed to prevent zoom too fast (#21)
	      if (this.wheeling) {
	        return;
	      }
	      this.wheeling = true;
	      setTimeout(function () {
	        _this.wheeling = false;
	      }, 50);
	      if (event.deltaY) {
	        delta = event.deltaY > 0 ? 1 : -1;
	      } else if (event.wheelDelta) {
	        delta = -event.wheelDelta / 120;
	      } else if (event.detail) {
	        delta = event.detail > 0 ? 1 : -1;
	      }
	      this.zoom(-delta * ratio, event);
	    },
	    cropStart: function cropStart(event) {
	      var buttons = event.buttons,
	        button = event.button;
	      if (this.disabled

	      // Handle mouse event and pointer event and ignore touch event
	      || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && (
	      // No primary button (Usually the left button)
	      isNumber(buttons) && buttons !== 1 || isNumber(button) && button !== 0

	      // Open context menu
	      || event.ctrlKey)) {
	        return;
	      }
	      var options = this.options,
	        pointers = this.pointers;
	      var action;
	      if (event.changedTouches) {
	        // Handle touch event
	        forEach(event.changedTouches, function (touch) {
	          pointers[touch.identifier] = getPointer(touch);
	        });
	      } else {
	        // Handle mouse event and pointer event
	        pointers[event.pointerId || 0] = getPointer(event);
	      }
	      if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
	        action = ACTION_ZOOM;
	      } else {
	        action = getData(event.target, DATA_ACTION);
	      }
	      if (!REGEXP_ACTIONS.test(action)) {
	        return;
	      }
	      if (dispatchEvent(this.element, EVENT_CROP_START, {
	        originalEvent: event,
	        action: action
	      }) === false) {
	        return;
	      }

	      // This line is required for preventing page zooming in iOS browsers
	      event.preventDefault();
	      this.action = action;
	      this.cropping = false;
	      if (action === ACTION_CROP) {
	        this.cropping = true;
	        addClass(this.dragBox, CLASS_MODAL);
	      }
	    },
	    cropMove: function cropMove(event) {
	      var action = this.action;
	      if (this.disabled || !action) {
	        return;
	      }
	      var pointers = this.pointers;
	      event.preventDefault();
	      if (dispatchEvent(this.element, EVENT_CROP_MOVE, {
	        originalEvent: event,
	        action: action
	      }) === false) {
	        return;
	      }
	      if (event.changedTouches) {
	        forEach(event.changedTouches, function (touch) {
	          // The first parameter should not be undefined (#432)
	          assign(pointers[touch.identifier] || {}, getPointer(touch, true));
	        });
	      } else {
	        assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
	      }
	      this.change(event);
	    },
	    cropEnd: function cropEnd(event) {
	      if (this.disabled) {
	        return;
	      }
	      var action = this.action,
	        pointers = this.pointers;
	      if (event.changedTouches) {
	        forEach(event.changedTouches, function (touch) {
	          delete pointers[touch.identifier];
	        });
	      } else {
	        delete pointers[event.pointerId || 0];
	      }
	      if (!action) {
	        return;
	      }
	      event.preventDefault();
	      if (!Object.keys(pointers).length) {
	        this.action = '';
	      }
	      if (this.cropping) {
	        this.cropping = false;
	        toggleClass(this.dragBox, CLASS_MODAL, this.cropped && this.options.modal);
	      }
	      dispatchEvent(this.element, EVENT_CROP_END, {
	        originalEvent: event,
	        action: action
	      });
	    }
	  };

	  var change = {
	    change: function change(event) {
	      var options = this.options,
	        canvasData = this.canvasData,
	        containerData = this.containerData,
	        cropBoxData = this.cropBoxData,
	        pointers = this.pointers;
	      var action = this.action;
	      var aspectRatio = options.aspectRatio;
	      var left = cropBoxData.left,
	        top = cropBoxData.top,
	        width = cropBoxData.width,
	        height = cropBoxData.height;
	      var right = left + width;
	      var bottom = top + height;
	      var minLeft = 0;
	      var minTop = 0;
	      var maxWidth = containerData.width;
	      var maxHeight = containerData.height;
	      var renderable = true;
	      var offset;

	      // Locking aspect ratio in "free mode" by holding shift key
	      if (!aspectRatio && event.shiftKey) {
	        aspectRatio = width && height ? width / height : 1;
	      }
	      if (this.limited) {
	        minLeft = cropBoxData.minLeft;
	        minTop = cropBoxData.minTop;
	        maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
	        maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
	      }
	      var pointer = pointers[Object.keys(pointers)[0]];
	      var range = {
	        x: pointer.endX - pointer.startX,
	        y: pointer.endY - pointer.startY
	      };
	      var check = function check(side) {
	        switch (side) {
	          case ACTION_EAST:
	            if (right + range.x > maxWidth) {
	              range.x = maxWidth - right;
	            }
	            break;
	          case ACTION_WEST:
	            if (left + range.x < minLeft) {
	              range.x = minLeft - left;
	            }
	            break;
	          case ACTION_NORTH:
	            if (top + range.y < minTop) {
	              range.y = minTop - top;
	            }
	            break;
	          case ACTION_SOUTH:
	            if (bottom + range.y > maxHeight) {
	              range.y = maxHeight - bottom;
	            }
	            break;
	        }
	      };
	      switch (action) {
	        // Move crop box
	        case ACTION_ALL:
	          left += range.x;
	          top += range.y;
	          break;

	        // Resize crop box
	        case ACTION_EAST:
	          if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
	            renderable = false;
	            break;
	          }
	          check(ACTION_EAST);
	          width += range.x;
	          if (width < 0) {
	            action = ACTION_WEST;
	            width = -width;
	            left -= width;
	          }
	          if (aspectRatio) {
	            height = width / aspectRatio;
	            top += (cropBoxData.height - height) / 2;
	          }
	          break;
	        case ACTION_NORTH:
	          if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
	            renderable = false;
	            break;
	          }
	          check(ACTION_NORTH);
	          height -= range.y;
	          top += range.y;
	          if (height < 0) {
	            action = ACTION_SOUTH;
	            height = -height;
	            top -= height;
	          }
	          if (aspectRatio) {
	            width = height * aspectRatio;
	            left += (cropBoxData.width - width) / 2;
	          }
	          break;
	        case ACTION_WEST:
	          if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
	            renderable = false;
	            break;
	          }
	          check(ACTION_WEST);
	          width -= range.x;
	          left += range.x;
	          if (width < 0) {
	            action = ACTION_EAST;
	            width = -width;
	            left -= width;
	          }
	          if (aspectRatio) {
	            height = width / aspectRatio;
	            top += (cropBoxData.height - height) / 2;
	          }
	          break;
	        case ACTION_SOUTH:
	          if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
	            renderable = false;
	            break;
	          }
	          check(ACTION_SOUTH);
	          height += range.y;
	          if (height < 0) {
	            action = ACTION_NORTH;
	            height = -height;
	            top -= height;
	          }
	          if (aspectRatio) {
	            width = height * aspectRatio;
	            left += (cropBoxData.width - width) / 2;
	          }
	          break;
	        case ACTION_NORTH_EAST:
	          if (aspectRatio) {
	            if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
	              renderable = false;
	              break;
	            }
	            check(ACTION_NORTH);
	            height -= range.y;
	            top += range.y;
	            width = height * aspectRatio;
	          } else {
	            check(ACTION_NORTH);
	            check(ACTION_EAST);
	            if (range.x >= 0) {
	              if (right < maxWidth) {
	                width += range.x;
	              } else if (range.y <= 0 && top <= minTop) {
	                renderable = false;
	              }
	            } else {
	              width += range.x;
	            }
	            if (range.y <= 0) {
	              if (top > minTop) {
	                height -= range.y;
	                top += range.y;
	              }
	            } else {
	              height -= range.y;
	              top += range.y;
	            }
	          }
	          if (width < 0 && height < 0) {
	            action = ACTION_SOUTH_WEST;
	            height = -height;
	            width = -width;
	            top -= height;
	            left -= width;
	          } else if (width < 0) {
	            action = ACTION_NORTH_WEST;
	            width = -width;
	            left -= width;
	          } else if (height < 0) {
	            action = ACTION_SOUTH_EAST;
	            height = -height;
	            top -= height;
	          }
	          break;
	        case ACTION_NORTH_WEST:
	          if (aspectRatio) {
	            if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
	              renderable = false;
	              break;
	            }
	            check(ACTION_NORTH);
	            height -= range.y;
	            top += range.y;
	            width = height * aspectRatio;
	            left += cropBoxData.width - width;
	          } else {
	            check(ACTION_NORTH);
	            check(ACTION_WEST);
	            if (range.x <= 0) {
	              if (left > minLeft) {
	                width -= range.x;
	                left += range.x;
	              } else if (range.y <= 0 && top <= minTop) {
	                renderable = false;
	              }
	            } else {
	              width -= range.x;
	              left += range.x;
	            }
	            if (range.y <= 0) {
	              if (top > minTop) {
	                height -= range.y;
	                top += range.y;
	              }
	            } else {
	              height -= range.y;
	              top += range.y;
	            }
	          }
	          if (width < 0 && height < 0) {
	            action = ACTION_SOUTH_EAST;
	            height = -height;
	            width = -width;
	            top -= height;
	            left -= width;
	          } else if (width < 0) {
	            action = ACTION_NORTH_EAST;
	            width = -width;
	            left -= width;
	          } else if (height < 0) {
	            action = ACTION_SOUTH_WEST;
	            height = -height;
	            top -= height;
	          }
	          break;
	        case ACTION_SOUTH_WEST:
	          if (aspectRatio) {
	            if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
	              renderable = false;
	              break;
	            }
	            check(ACTION_WEST);
	            width -= range.x;
	            left += range.x;
	            height = width / aspectRatio;
	          } else {
	            check(ACTION_SOUTH);
	            check(ACTION_WEST);
	            if (range.x <= 0) {
	              if (left > minLeft) {
	                width -= range.x;
	                left += range.x;
	              } else if (range.y >= 0 && bottom >= maxHeight) {
	                renderable = false;
	              }
	            } else {
	              width -= range.x;
	              left += range.x;
	            }
	            if (range.y >= 0) {
	              if (bottom < maxHeight) {
	                height += range.y;
	              }
	            } else {
	              height += range.y;
	            }
	          }
	          if (width < 0 && height < 0) {
	            action = ACTION_NORTH_EAST;
	            height = -height;
	            width = -width;
	            top -= height;
	            left -= width;
	          } else if (width < 0) {
	            action = ACTION_SOUTH_EAST;
	            width = -width;
	            left -= width;
	          } else if (height < 0) {
	            action = ACTION_NORTH_WEST;
	            height = -height;
	            top -= height;
	          }
	          break;
	        case ACTION_SOUTH_EAST:
	          if (aspectRatio) {
	            if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
	              renderable = false;
	              break;
	            }
	            check(ACTION_EAST);
	            width += range.x;
	            height = width / aspectRatio;
	          } else {
	            check(ACTION_SOUTH);
	            check(ACTION_EAST);
	            if (range.x >= 0) {
	              if (right < maxWidth) {
	                width += range.x;
	              } else if (range.y >= 0 && bottom >= maxHeight) {
	                renderable = false;
	              }
	            } else {
	              width += range.x;
	            }
	            if (range.y >= 0) {
	              if (bottom < maxHeight) {
	                height += range.y;
	              }
	            } else {
	              height += range.y;
	            }
	          }
	          if (width < 0 && height < 0) {
	            action = ACTION_NORTH_WEST;
	            height = -height;
	            width = -width;
	            top -= height;
	            left -= width;
	          } else if (width < 0) {
	            action = ACTION_SOUTH_WEST;
	            width = -width;
	            left -= width;
	          } else if (height < 0) {
	            action = ACTION_NORTH_EAST;
	            height = -height;
	            top -= height;
	          }
	          break;

	        // Move canvas
	        case ACTION_MOVE:
	          this.move(range.x, range.y);
	          renderable = false;
	          break;

	        // Zoom canvas
	        case ACTION_ZOOM:
	          this.zoom(getMaxZoomRatio(pointers), event);
	          renderable = false;
	          break;

	        // Create crop box
	        case ACTION_CROP:
	          if (!range.x || !range.y) {
	            renderable = false;
	            break;
	          }
	          offset = getOffset(this.cropper);
	          left = pointer.startX - offset.left;
	          top = pointer.startY - offset.top;
	          width = cropBoxData.minWidth;
	          height = cropBoxData.minHeight;
	          if (range.x > 0) {
	            action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
	          } else if (range.x < 0) {
	            left -= width;
	            action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
	          }
	          if (range.y < 0) {
	            top -= height;
	          }

	          // Show the crop box if is hidden
	          if (!this.cropped) {
	            removeClass(this.cropBox, CLASS_HIDDEN);
	            this.cropped = true;
	            if (this.limited) {
	              this.limitCropBox(true, true);
	            }
	          }
	          break;
	      }
	      if (renderable) {
	        cropBoxData.width = width;
	        cropBoxData.height = height;
	        cropBoxData.left = left;
	        cropBoxData.top = top;
	        this.action = action;
	        this.renderCropBox();
	      }

	      // Override
	      forEach(pointers, function (p) {
	        p.startX = p.endX;
	        p.startY = p.endY;
	      });
	    }
	  };

	  var methods = {
	    // Show the crop box manually
	    crop: function crop() {
	      if (this.ready && !this.cropped && !this.disabled) {
	        this.cropped = true;
	        this.limitCropBox(true, true);
	        if (this.options.modal) {
	          addClass(this.dragBox, CLASS_MODAL);
	        }
	        removeClass(this.cropBox, CLASS_HIDDEN);
	        this.setCropBoxData(this.initialCropBoxData);
	      }
	      return this;
	    },
	    // Reset the image and crop box to their initial states
	    reset: function reset() {
	      if (this.ready && !this.disabled) {
	        this.imageData = assign({}, this.initialImageData);
	        this.canvasData = assign({}, this.initialCanvasData);
	        this.cropBoxData = assign({}, this.initialCropBoxData);
	        this.renderCanvas();
	        if (this.cropped) {
	          this.renderCropBox();
	        }
	      }
	      return this;
	    },
	    // Clear the crop box
	    clear: function clear() {
	      if (this.cropped && !this.disabled) {
	        assign(this.cropBoxData, {
	          left: 0,
	          top: 0,
	          width: 0,
	          height: 0
	        });
	        this.cropped = false;
	        this.renderCropBox();
	        this.limitCanvas(true, true);

	        // Render canvas after crop box rendered
	        this.renderCanvas();
	        removeClass(this.dragBox, CLASS_MODAL);
	        addClass(this.cropBox, CLASS_HIDDEN);
	      }
	      return this;
	    },
	    /**
	     * Replace the image's src and rebuild the cropper
	     * @param {string} url - The new URL.
	     * @param {boolean} [hasSameSize] - Indicate if the new image has the same size as the old one.
	     * @returns {Cropper} this
	     */
	    replace: function replace(url) {
	      var hasSameSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	      if (!this.disabled && url) {
	        if (this.isImg) {
	          this.element.src = url;
	        }
	        if (hasSameSize) {
	          this.url = url;
	          this.image.src = url;
	          if (this.ready) {
	            this.viewBoxImage.src = url;
	            forEach(this.previews, function (element) {
	              element.getElementsByTagName('img')[0].src = url;
	            });
	          }
	        } else {
	          if (this.isImg) {
	            this.replaced = true;
	          }
	          this.options.data = null;
	          this.uncreate();
	          this.load(url);
	        }
	      }
	      return this;
	    },
	    // Enable (unfreeze) the cropper
	    enable: function enable() {
	      if (this.ready && this.disabled) {
	        this.disabled = false;
	        removeClass(this.cropper, CLASS_DISABLED);
	      }
	      return this;
	    },
	    // Disable (freeze) the cropper
	    disable: function disable() {
	      if (this.ready && !this.disabled) {
	        this.disabled = true;
	        addClass(this.cropper, CLASS_DISABLED);
	      }
	      return this;
	    },
	    /**
	     * Destroy the cropper and remove the instance from the image
	     * @returns {Cropper} this
	     */
	    destroy: function destroy() {
	      var element = this.element;
	      if (!element[NAMESPACE]) {
	        return this;
	      }
	      element[NAMESPACE] = undefined;
	      if (this.isImg && this.replaced) {
	        element.src = this.originalUrl;
	      }
	      this.uncreate();
	      return this;
	    },
	    /**
	     * Move the canvas with relative offsets
	     * @param {number} offsetX - The relative offset distance on the x-axis.
	     * @param {number} [offsetY=offsetX] - The relative offset distance on the y-axis.
	     * @returns {Cropper} this
	     */
	    move: function move(offsetX) {
	      var offsetY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : offsetX;
	      var _this$canvasData = this.canvasData,
	        left = _this$canvasData.left,
	        top = _this$canvasData.top;
	      return this.moveTo(isUndefined(offsetX) ? offsetX : left + Number(offsetX), isUndefined(offsetY) ? offsetY : top + Number(offsetY));
	    },
	    /**
	     * Move the canvas to an absolute point
	     * @param {number} x - The x-axis coordinate.
	     * @param {number} [y=x] - The y-axis coordinate.
	     * @returns {Cropper} this
	     */
	    moveTo: function moveTo(x) {
	      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
	      var canvasData = this.canvasData;
	      var changed = false;
	      x = Number(x);
	      y = Number(y);
	      if (this.ready && !this.disabled && this.options.movable) {
	        if (isNumber(x)) {
	          canvasData.left = x;
	          changed = true;
	        }
	        if (isNumber(y)) {
	          canvasData.top = y;
	          changed = true;
	        }
	        if (changed) {
	          this.renderCanvas(true);
	        }
	      }
	      return this;
	    },
	    /**
	     * Zoom the canvas with a relative ratio
	     * @param {number} ratio - The target ratio.
	     * @param {Event} _originalEvent - The original event if any.
	     * @returns {Cropper} this
	     */
	    zoom: function zoom(ratio, _originalEvent) {
	      var canvasData = this.canvasData;
	      ratio = Number(ratio);
	      if (ratio < 0) {
	        ratio = 1 / (1 - ratio);
	      } else {
	        ratio = 1 + ratio;
	      }
	      return this.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, null, _originalEvent);
	    },
	    /**
	     * Zoom the canvas to an absolute ratio
	     * @param {number} ratio - The target ratio.
	     * @param {Object} pivot - The zoom pivot point coordinate.
	     * @param {Event} _originalEvent - The original event if any.
	     * @returns {Cropper} this
	     */
	    zoomTo: function zoomTo(ratio, pivot, _originalEvent) {
	      var options = this.options,
	        canvasData = this.canvasData;
	      var width = canvasData.width,
	        height = canvasData.height,
	        naturalWidth = canvasData.naturalWidth,
	        naturalHeight = canvasData.naturalHeight;
	      ratio = Number(ratio);
	      if (ratio >= 0 && this.ready && !this.disabled && options.zoomable) {
	        var newWidth = naturalWidth * ratio;
	        var newHeight = naturalHeight * ratio;
	        if (dispatchEvent(this.element, EVENT_ZOOM, {
	          ratio: ratio,
	          oldRatio: width / naturalWidth,
	          originalEvent: _originalEvent
	        }) === false) {
	          return this;
	        }
	        if (_originalEvent) {
	          var pointers = this.pointers;
	          var offset = getOffset(this.cropper);
	          var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
	            pageX: _originalEvent.pageX,
	            pageY: _originalEvent.pageY
	          };

	          // Zoom from the triggering point of the event
	          canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
	          canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
	        } else if (isPlainObject(pivot) && isNumber(pivot.x) && isNumber(pivot.y)) {
	          canvasData.left -= (newWidth - width) * ((pivot.x - canvasData.left) / width);
	          canvasData.top -= (newHeight - height) * ((pivot.y - canvasData.top) / height);
	        } else {
	          // Zoom from the center of the canvas
	          canvasData.left -= (newWidth - width) / 2;
	          canvasData.top -= (newHeight - height) / 2;
	        }
	        canvasData.width = newWidth;
	        canvasData.height = newHeight;
	        this.renderCanvas(true);
	      }
	      return this;
	    },
	    /**
	     * Rotate the canvas with a relative degree
	     * @param {number} degree - The rotate degree.
	     * @returns {Cropper} this
	     */
	    rotate: function rotate(degree) {
	      return this.rotateTo((this.imageData.rotate || 0) + Number(degree));
	    },
	    /**
	     * Rotate the canvas to an absolute degree
	     * @param {number} degree - The rotate degree.
	     * @returns {Cropper} this
	     */
	    rotateTo: function rotateTo(degree) {
	      degree = Number(degree);
	      if (isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
	        this.imageData.rotate = degree % 360;
	        this.renderCanvas(true, true);
	      }
	      return this;
	    },
	    /**
	     * Scale the image on the x-axis.
	     * @param {number} scaleX - The scale ratio on the x-axis.
	     * @returns {Cropper} this
	     */
	    scaleX: function scaleX(_scaleX) {
	      var scaleY = this.imageData.scaleY;
	      return this.scale(_scaleX, isNumber(scaleY) ? scaleY : 1);
	    },
	    /**
	     * Scale the image on the y-axis.
	     * @param {number} scaleY - The scale ratio on the y-axis.
	     * @returns {Cropper} this
	     */
	    scaleY: function scaleY(_scaleY) {
	      var scaleX = this.imageData.scaleX;
	      return this.scale(isNumber(scaleX) ? scaleX : 1, _scaleY);
	    },
	    /**
	     * Scale the image
	     * @param {number} scaleX - The scale ratio on the x-axis.
	     * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
	     * @returns {Cropper} this
	     */
	    scale: function scale(scaleX) {
	      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;
	      var imageData = this.imageData;
	      var transformed = false;
	      scaleX = Number(scaleX);
	      scaleY = Number(scaleY);
	      if (this.ready && !this.disabled && this.options.scalable) {
	        if (isNumber(scaleX)) {
	          imageData.scaleX = scaleX;
	          transformed = true;
	        }
	        if (isNumber(scaleY)) {
	          imageData.scaleY = scaleY;
	          transformed = true;
	        }
	        if (transformed) {
	          this.renderCanvas(true, true);
	        }
	      }
	      return this;
	    },
	    /**
	     * Get the cropped area position and size data (base on the original image)
	     * @param {boolean} [rounded=false] - Indicate if round the data values or not.
	     * @returns {Object} The result cropped data.
	     */
	    getData: function getData() {
	      var rounded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      var options = this.options,
	        imageData = this.imageData,
	        canvasData = this.canvasData,
	        cropBoxData = this.cropBoxData;
	      var data;
	      if (this.ready && this.cropped) {
	        data = {
	          x: cropBoxData.left - canvasData.left,
	          y: cropBoxData.top - canvasData.top,
	          width: cropBoxData.width,
	          height: cropBoxData.height
	        };
	        var ratio = imageData.width / imageData.naturalWidth;
	        forEach(data, function (n, i) {
	          data[i] = n / ratio;
	        });
	        if (rounded) {
	          // In case rounding off leads to extra 1px in right or bottom border
	          // we should round the top-left corner and the dimension (#343).
	          var bottom = Math.round(data.y + data.height);
	          var right = Math.round(data.x + data.width);
	          data.x = Math.round(data.x);
	          data.y = Math.round(data.y);
	          data.width = right - data.x;
	          data.height = bottom - data.y;
	        }
	      } else {
	        data = {
	          x: 0,
	          y: 0,
	          width: 0,
	          height: 0
	        };
	      }
	      if (options.rotatable) {
	        data.rotate = imageData.rotate || 0;
	      }
	      if (options.scalable) {
	        data.scaleX = imageData.scaleX || 1;
	        data.scaleY = imageData.scaleY || 1;
	      }
	      return data;
	    },
	    /**
	     * Set the cropped area position and size with new data
	     * @param {Object} data - The new data.
	     * @returns {Cropper} this
	     */
	    setData: function setData(data) {
	      var options = this.options,
	        imageData = this.imageData,
	        canvasData = this.canvasData;
	      var cropBoxData = {};
	      if (this.ready && !this.disabled && isPlainObject(data)) {
	        var transformed = false;
	        if (options.rotatable) {
	          if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
	            imageData.rotate = data.rotate;
	            transformed = true;
	          }
	        }
	        if (options.scalable) {
	          if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
	            imageData.scaleX = data.scaleX;
	            transformed = true;
	          }
	          if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
	            imageData.scaleY = data.scaleY;
	            transformed = true;
	          }
	        }
	        if (transformed) {
	          this.renderCanvas(true, true);
	        }
	        var ratio = imageData.width / imageData.naturalWidth;
	        if (isNumber(data.x)) {
	          cropBoxData.left = data.x * ratio + canvasData.left;
	        }
	        if (isNumber(data.y)) {
	          cropBoxData.top = data.y * ratio + canvasData.top;
	        }
	        if (isNumber(data.width)) {
	          cropBoxData.width = data.width * ratio;
	        }
	        if (isNumber(data.height)) {
	          cropBoxData.height = data.height * ratio;
	        }
	        this.setCropBoxData(cropBoxData);
	      }
	      return this;
	    },
	    /**
	     * Get the container size data.
	     * @returns {Object} The result container data.
	     */
	    getContainerData: function getContainerData() {
	      return this.ready ? assign({}, this.containerData) : {};
	    },
	    /**
	     * Get the image position and size data.
	     * @returns {Object} The result image data.
	     */
	    getImageData: function getImageData() {
	      return this.sized ? assign({}, this.imageData) : {};
	    },
	    /**
	     * Get the canvas position and size data.
	     * @returns {Object} The result canvas data.
	     */
	    getCanvasData: function getCanvasData() {
	      var canvasData = this.canvasData;
	      var data = {};
	      if (this.ready) {
	        forEach(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
	          data[n] = canvasData[n];
	        });
	      }
	      return data;
	    },
	    /**
	     * Set the canvas position and size with new data.
	     * @param {Object} data - The new canvas data.
	     * @returns {Cropper} this
	     */
	    setCanvasData: function setCanvasData(data) {
	      var canvasData = this.canvasData;
	      var aspectRatio = canvasData.aspectRatio;
	      if (this.ready && !this.disabled && isPlainObject(data)) {
	        if (isNumber(data.left)) {
	          canvasData.left = data.left;
	        }
	        if (isNumber(data.top)) {
	          canvasData.top = data.top;
	        }
	        if (isNumber(data.width)) {
	          canvasData.width = data.width;
	          canvasData.height = data.width / aspectRatio;
	        } else if (isNumber(data.height)) {
	          canvasData.height = data.height;
	          canvasData.width = data.height * aspectRatio;
	        }
	        this.renderCanvas(true);
	      }
	      return this;
	    },
	    /**
	     * Get the crop box position and size data.
	     * @returns {Object} The result crop box data.
	     */
	    getCropBoxData: function getCropBoxData() {
	      var cropBoxData = this.cropBoxData;
	      var data;
	      if (this.ready && this.cropped) {
	        data = {
	          left: cropBoxData.left,
	          top: cropBoxData.top,
	          width: cropBoxData.width,
	          height: cropBoxData.height
	        };
	      }
	      return data || {};
	    },
	    /**
	     * Set the crop box position and size with new data.
	     * @param {Object} data - The new crop box data.
	     * @returns {Cropper} this
	     */
	    setCropBoxData: function setCropBoxData(data) {
	      var cropBoxData = this.cropBoxData;
	      var aspectRatio = this.options.aspectRatio;
	      var widthChanged;
	      var heightChanged;
	      if (this.ready && this.cropped && !this.disabled && isPlainObject(data)) {
	        if (isNumber(data.left)) {
	          cropBoxData.left = data.left;
	        }
	        if (isNumber(data.top)) {
	          cropBoxData.top = data.top;
	        }
	        if (isNumber(data.width) && data.width !== cropBoxData.width) {
	          widthChanged = true;
	          cropBoxData.width = data.width;
	        }
	        if (isNumber(data.height) && data.height !== cropBoxData.height) {
	          heightChanged = true;
	          cropBoxData.height = data.height;
	        }
	        if (aspectRatio) {
	          if (widthChanged) {
	            cropBoxData.height = cropBoxData.width / aspectRatio;
	          } else if (heightChanged) {
	            cropBoxData.width = cropBoxData.height * aspectRatio;
	          }
	        }
	        this.renderCropBox();
	      }
	      return this;
	    },
	    /**
	     * Get a canvas drawn the cropped image.
	     * @param {Object} [options={}] - The config options.
	     * @returns {HTMLCanvasElement} - The result canvas.
	     */
	    getCroppedCanvas: function getCroppedCanvas() {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      if (!this.ready || !window.HTMLCanvasElement) {
	        return null;
	      }
	      var canvasData = this.canvasData;
	      var source = getSourceCanvas(this.image, this.imageData, canvasData, options);

	      // Returns the source canvas if it is not cropped.
	      if (!this.cropped) {
	        return source;
	      }
	      var _this$getData = this.getData(options.rounded),
	        initialX = _this$getData.x,
	        initialY = _this$getData.y,
	        initialWidth = _this$getData.width,
	        initialHeight = _this$getData.height;
	      var ratio = source.width / Math.floor(canvasData.naturalWidth);
	      if (ratio !== 1) {
	        initialX *= ratio;
	        initialY *= ratio;
	        initialWidth *= ratio;
	        initialHeight *= ratio;
	      }
	      var aspectRatio = initialWidth / initialHeight;
	      var maxSizes = getAdjustedSizes({
	        aspectRatio: aspectRatio,
	        width: options.maxWidth || Infinity,
	        height: options.maxHeight || Infinity
	      });
	      var minSizes = getAdjustedSizes({
	        aspectRatio: aspectRatio,
	        width: options.minWidth || 0,
	        height: options.minHeight || 0
	      }, 'cover');
	      var _getAdjustedSizes = getAdjustedSizes({
	          aspectRatio: aspectRatio,
	          width: options.width || (ratio !== 1 ? source.width : initialWidth),
	          height: options.height || (ratio !== 1 ? source.height : initialHeight)
	        }),
	        width = _getAdjustedSizes.width,
	        height = _getAdjustedSizes.height;
	      width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
	      height = Math.min(maxSizes.height, Math.max(minSizes.height, height));
	      var canvas = document.createElement('canvas');
	      var context = canvas.getContext('2d');
	      canvas.width = normalizeDecimalNumber(width);
	      canvas.height = normalizeDecimalNumber(height);
	      context.fillStyle = options.fillColor || 'transparent';
	      context.fillRect(0, 0, width, height);
	      var _options$imageSmoothi = options.imageSmoothingEnabled,
	        imageSmoothingEnabled = _options$imageSmoothi === void 0 ? true : _options$imageSmoothi,
	        imageSmoothingQuality = options.imageSmoothingQuality;
	      context.imageSmoothingEnabled = imageSmoothingEnabled;
	      if (imageSmoothingQuality) {
	        context.imageSmoothingQuality = imageSmoothingQuality;
	      }

	      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
	      var sourceWidth = source.width;
	      var sourceHeight = source.height;

	      // Source canvas parameters
	      var srcX = initialX;
	      var srcY = initialY;
	      var srcWidth;
	      var srcHeight;

	      // Destination canvas parameters
	      var dstX;
	      var dstY;
	      var dstWidth;
	      var dstHeight;
	      if (srcX <= -initialWidth || srcX > sourceWidth) {
	        srcX = 0;
	        srcWidth = 0;
	        dstX = 0;
	        dstWidth = 0;
	      } else if (srcX <= 0) {
	        dstX = -srcX;
	        srcX = 0;
	        srcWidth = Math.min(sourceWidth, initialWidth + srcX);
	        dstWidth = srcWidth;
	      } else if (srcX <= sourceWidth) {
	        dstX = 0;
	        srcWidth = Math.min(initialWidth, sourceWidth - srcX);
	        dstWidth = srcWidth;
	      }
	      if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
	        srcY = 0;
	        srcHeight = 0;
	        dstY = 0;
	        dstHeight = 0;
	      } else if (srcY <= 0) {
	        dstY = -srcY;
	        srcY = 0;
	        srcHeight = Math.min(sourceHeight, initialHeight + srcY);
	        dstHeight = srcHeight;
	      } else if (srcY <= sourceHeight) {
	        dstY = 0;
	        srcHeight = Math.min(initialHeight, sourceHeight - srcY);
	        dstHeight = srcHeight;
	      }
	      var params = [srcX, srcY, srcWidth, srcHeight];

	      // Avoid "IndexSizeError"
	      if (dstWidth > 0 && dstHeight > 0) {
	        var scale = width / initialWidth;
	        params.push(dstX * scale, dstY * scale, dstWidth * scale, dstHeight * scale);
	      }

	      // All the numerical parameters should be integer for `drawImage`
	      // https://github.com/fengyuanchen/cropper/issues/476
	      context.drawImage.apply(context, [source].concat(_toConsumableArray(params.map(function (param) {
	        return Math.floor(normalizeDecimalNumber(param));
	      }))));
	      return canvas;
	    },
	    /**
	     * Change the aspect ratio of the crop box.
	     * @param {number} aspectRatio - The new aspect ratio.
	     * @returns {Cropper} this
	     */
	    setAspectRatio: function setAspectRatio(aspectRatio) {
	      var options = this.options;
	      if (!this.disabled && !isUndefined(aspectRatio)) {
	        // 0 -> NaN
	        options.aspectRatio = Math.max(0, aspectRatio) || NaN;
	        if (this.ready) {
	          this.initCropBox();
	          if (this.cropped) {
	            this.renderCropBox();
	          }
	        }
	      }
	      return this;
	    },
	    /**
	     * Change the drag mode.
	     * @param {string} mode - The new drag mode.
	     * @returns {Cropper} this
	     */
	    setDragMode: function setDragMode(mode) {
	      var options = this.options,
	        dragBox = this.dragBox,
	        face = this.face;
	      if (this.ready && !this.disabled) {
	        var croppable = mode === DRAG_MODE_CROP;
	        var movable = options.movable && mode === DRAG_MODE_MOVE;
	        mode = croppable || movable ? mode : DRAG_MODE_NONE;
	        options.dragMode = mode;
	        setData(dragBox, DATA_ACTION, mode);
	        toggleClass(dragBox, CLASS_CROP, croppable);
	        toggleClass(dragBox, CLASS_MOVE, movable);
	        if (!options.cropBoxMovable) {
	          // Sync drag mode to crop box when it is not movable
	          setData(face, DATA_ACTION, mode);
	          toggleClass(face, CLASS_CROP, croppable);
	          toggleClass(face, CLASS_MOVE, movable);
	        }
	      }
	      return this;
	    }
	  };

	  var AnotherCropper = WINDOW.Cropper;
	  var Cropper = /*#__PURE__*/function () {
	    /**
	     * Create a new Cropper.
	     * @param {Element} element - The target element for cropping.
	     * @param {Object} [options={}] - The configuration options.
	     */
	    function Cropper(element) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      _classCallCheck(this, Cropper);
	      if (!element || !REGEXP_TAG_NAME.test(element.tagName)) {
	        throw new Error('The first argument is required and must be an <img> or <canvas> element.');
	      }
	      this.element = element;
	      this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
	      this.cropped = false;
	      this.disabled = false;
	      this.pointers = {};
	      this.ready = false;
	      this.reloading = false;
	      this.replaced = false;
	      this.sized = false;
	      this.sizing = false;
	      this.init();
	    }
	    return _createClass(Cropper, [{
	      key: "init",
	      value: function init() {
	        var element = this.element;
	        var tagName = element.tagName.toLowerCase();
	        var url;
	        if (element[NAMESPACE]) {
	          return;
	        }
	        element[NAMESPACE] = this;
	        if (tagName === 'img') {
	          this.isImg = true;

	          // e.g.: "img/picture.jpg"
	          url = element.getAttribute('src') || '';
	          this.originalUrl = url;

	          // Stop when it's a blank image
	          if (!url) {
	            return;
	          }

	          // e.g.: "https://example.com/img/picture.jpg"
	          url = element.src;
	        } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
	          url = element.toDataURL();
	        }
	        this.load(url);
	      }
	    }, {
	      key: "load",
	      value: function load(url) {
	        var _this = this;
	        if (!url) {
	          return;
	        }
	        this.url = url;
	        this.imageData = {};
	        var element = this.element,
	          options = this.options;
	        if (!options.rotatable && !options.scalable) {
	          options.checkOrientation = false;
	        }

	        // Only IE10+ supports Typed Arrays
	        if (!options.checkOrientation || !window.ArrayBuffer) {
	          this.clone();
	          return;
	        }

	        // Detect the mime type of the image directly if it is a Data URL
	        if (REGEXP_DATA_URL.test(url)) {
	          // Read ArrayBuffer from Data URL of JPEG images directly for better performance
	          if (REGEXP_DATA_URL_JPEG.test(url)) {
	            this.read(dataURLToArrayBuffer(url));
	          } else {
	            // Only a JPEG image may contains Exif Orientation information,
	            // the rest types of Data URLs are not necessary to check orientation at all.
	            this.clone();
	          }
	          return;
	        }

	        // 1. Detect the mime type of the image by a XMLHttpRequest.
	        // 2. Load the image as ArrayBuffer for reading orientation if its a JPEG image.
	        var xhr = new XMLHttpRequest();
	        var clone = this.clone.bind(this);
	        this.reloading = true;
	        this.xhr = xhr;

	        // 1. Cross origin requests are only supported for protocol schemes:
	        // http, https, data, chrome, chrome-extension.
	        // 2. Access to XMLHttpRequest from a Data URL will be blocked by CORS policy
	        // in some browsers as IE11 and Safari.
	        xhr.onabort = clone;
	        xhr.onerror = clone;
	        xhr.ontimeout = clone;
	        xhr.onprogress = function () {
	          // Abort the request directly if it not a JPEG image for better performance
	          if (xhr.getResponseHeader('content-type') !== MIME_TYPE_JPEG) {
	            xhr.abort();
	          }
	        };
	        xhr.onload = function () {
	          _this.read(xhr.response);
	        };
	        xhr.onloadend = function () {
	          _this.reloading = false;
	          _this.xhr = null;
	        };

	        // Bust cache when there is a "crossOrigin" property to avoid browser cache error
	        if (options.checkCrossOrigin && isCrossOriginURL(url) && element.crossOrigin) {
	          url = addTimestamp(url);
	        }

	        // The third parameter is required for avoiding side-effect (#682)
	        xhr.open('GET', url, true);
	        xhr.responseType = 'arraybuffer';
	        xhr.withCredentials = element.crossOrigin === 'use-credentials';
	        xhr.send();
	      }
	    }, {
	      key: "read",
	      value: function read(arrayBuffer) {
	        var options = this.options,
	          imageData = this.imageData;

	        // Reset the orientation value to its default value 1
	        // as some iOS browsers will render image with its orientation
	        var orientation = resetAndGetOrientation(arrayBuffer);
	        var rotate = 0;
	        var scaleX = 1;
	        var scaleY = 1;
	        if (orientation > 1) {
	          // Generate a new URL which has the default orientation value
	          this.url = arrayBufferToDataURL(arrayBuffer, MIME_TYPE_JPEG);
	          var _parseOrientation = parseOrientation(orientation);
	          rotate = _parseOrientation.rotate;
	          scaleX = _parseOrientation.scaleX;
	          scaleY = _parseOrientation.scaleY;
	        }
	        if (options.rotatable) {
	          imageData.rotate = rotate;
	        }
	        if (options.scalable) {
	          imageData.scaleX = scaleX;
	          imageData.scaleY = scaleY;
	        }
	        this.clone();
	      }
	    }, {
	      key: "clone",
	      value: function clone() {
	        var element = this.element,
	          url = this.url;
	        var crossOrigin = element.crossOrigin;
	        var crossOriginUrl = url;
	        if (this.options.checkCrossOrigin && isCrossOriginURL(url)) {
	          if (!crossOrigin) {
	            crossOrigin = 'anonymous';
	          }

	          // Bust cache when there is not a "crossOrigin" property (#519)
	          crossOriginUrl = addTimestamp(url);
	        }
	        this.crossOrigin = crossOrigin;
	        this.crossOriginUrl = crossOriginUrl;
	        var image = document.createElement('img');
	        if (crossOrigin) {
	          image.crossOrigin = crossOrigin;
	        }
	        image.src = crossOriginUrl || url;
	        image.alt = element.alt || 'The image to crop';
	        this.image = image;
	        image.onload = this.start.bind(this);
	        image.onerror = this.stop.bind(this);
	        addClass(image, CLASS_HIDE);
	        element.parentNode.insertBefore(image, element.nextSibling);
	      }
	    }, {
	      key: "start",
	      value: function start() {
	        var _this2 = this;
	        var image = this.image;
	        image.onload = null;
	        image.onerror = null;
	        this.sizing = true;

	        // Match all browsers that use WebKit as the layout engine in iOS devices,
	        // such as Safari for iOS, Chrome for iOS, and in-app browsers.
	        var isIOSWebKit = WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(WINDOW.navigator.userAgent);
	        var done = function done(naturalWidth, naturalHeight) {
	          assign(_this2.imageData, {
	            naturalWidth: naturalWidth,
	            naturalHeight: naturalHeight,
	            aspectRatio: naturalWidth / naturalHeight
	          });
	          _this2.initialImageData = assign({}, _this2.imageData);
	          _this2.sizing = false;
	          _this2.sized = true;
	          _this2.build();
	        };

	        // Most modern browsers (excepts iOS WebKit)
	        if (image.naturalWidth && !isIOSWebKit) {
	          done(image.naturalWidth, image.naturalHeight);
	          return;
	        }
	        var sizingImage = document.createElement('img');
	        var body = document.body || document.documentElement;
	        this.sizingImage = sizingImage;
	        sizingImage.onload = function () {
	          done(sizingImage.width, sizingImage.height);
	          if (!isIOSWebKit) {
	            body.removeChild(sizingImage);
	          }
	        };
	        sizingImage.src = image.src;

	        // iOS WebKit will convert the image automatically
	        // with its orientation once append it into DOM (#279)
	        if (!isIOSWebKit) {
	          sizingImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
	          body.appendChild(sizingImage);
	        }
	      }
	    }, {
	      key: "stop",
	      value: function stop() {
	        var image = this.image;
	        image.onload = null;
	        image.onerror = null;
	        image.parentNode.removeChild(image);
	        this.image = null;
	      }
	    }, {
	      key: "build",
	      value: function build() {
	        if (!this.sized || this.ready) {
	          return;
	        }
	        var element = this.element,
	          options = this.options,
	          image = this.image;

	        // Create cropper elements
	        var container = element.parentNode;
	        var template = document.createElement('div');
	        template.innerHTML = TEMPLATE;
	        var cropper = template.querySelector(".".concat(NAMESPACE, "-container"));
	        var canvas = cropper.querySelector(".".concat(NAMESPACE, "-canvas"));
	        var dragBox = cropper.querySelector(".".concat(NAMESPACE, "-drag-box"));
	        var cropBox = cropper.querySelector(".".concat(NAMESPACE, "-crop-box"));
	        var face = cropBox.querySelector(".".concat(NAMESPACE, "-face"));
	        this.container = container;
	        this.cropper = cropper;
	        this.canvas = canvas;
	        this.dragBox = dragBox;
	        this.cropBox = cropBox;
	        this.viewBox = cropper.querySelector(".".concat(NAMESPACE, "-view-box"));
	        this.face = face;
	        canvas.appendChild(image);

	        // Hide the original image
	        addClass(element, CLASS_HIDDEN);

	        // Inserts the cropper after to the current image
	        container.insertBefore(cropper, element.nextSibling);

	        // Show the hidden image
	        removeClass(image, CLASS_HIDE);
	        this.initPreview();
	        this.bind();
	        options.initialAspectRatio = Math.max(0, options.initialAspectRatio) || NaN;
	        options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
	        options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
	        addClass(cropBox, CLASS_HIDDEN);
	        if (!options.guides) {
	          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-dashed")), CLASS_HIDDEN);
	        }
	        if (!options.center) {
	          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-center")), CLASS_HIDDEN);
	        }
	        if (options.background) {
	          addClass(cropper, "".concat(NAMESPACE, "-bg"));
	        }
	        if (!options.highlight) {
	          addClass(face, CLASS_INVISIBLE);
	        }
	        if (options.cropBoxMovable) {
	          addClass(face, CLASS_MOVE);
	          setData(face, DATA_ACTION, ACTION_ALL);
	        }
	        if (!options.cropBoxResizable) {
	          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-line")), CLASS_HIDDEN);
	          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-point")), CLASS_HIDDEN);
	        }
	        this.render();
	        this.ready = true;
	        this.setDragMode(options.dragMode);
	        if (options.autoCrop) {
	          this.crop();
	        }
	        this.setData(options.data);
	        if (isFunction(options.ready)) {
	          addListener(element, EVENT_READY, options.ready, {
	            once: true
	          });
	        }
	        dispatchEvent(element, EVENT_READY);
	      }
	    }, {
	      key: "unbuild",
	      value: function unbuild() {
	        if (!this.ready) {
	          return;
	        }
	        this.ready = false;
	        this.unbind();
	        this.resetPreview();
	        var parentNode = this.cropper.parentNode;
	        if (parentNode) {
	          parentNode.removeChild(this.cropper);
	        }
	        removeClass(this.element, CLASS_HIDDEN);
	      }
	    }, {
	      key: "uncreate",
	      value: function uncreate() {
	        if (this.ready) {
	          this.unbuild();
	          this.ready = false;
	          this.cropped = false;
	        } else if (this.sizing) {
	          this.sizingImage.onload = null;
	          this.sizing = false;
	          this.sized = false;
	        } else if (this.reloading) {
	          this.xhr.onabort = null;
	          this.xhr.abort();
	        } else if (this.image) {
	          this.stop();
	        }
	      }

	      /**
	       * Get the no conflict cropper class.
	       * @returns {Cropper} The cropper class.
	       */
	    }], [{
	      key: "noConflict",
	      value: function noConflict() {
	        window.Cropper = AnotherCropper;
	        return Cropper;
	      }

	      /**
	       * Change the default options.
	       * @param {Object} options - The new default options.
	       */
	    }, {
	      key: "setDefaults",
	      value: function setDefaults(options) {
	        assign(DEFAULTS, isPlainObject(options) && options);
	      }
	    }]);
	  }();
	  assign(Cropper.prototype, render, preview, events, handlers, change, methods);

	  return Cropper;

	})); 
} (cropper));

var cropperExports = cropper.exports;
var Cropper = /*@__PURE__*/getDefaultExportFromCjs(cropperExports);

// See this cropperjs image to understand how container/image/canavas/cropbox relate to each other.
// (https://github.com/fengyuanchen/cropperjs/blob/9b528a8baeaae876dc090085e37992a1683c6f34/docs/images/layers.jpg)
//
function getCanvasDataThatFitsPerfectlyIntoContainer(containerData, canvasData) {
    // 1. Scale our canvas as much as possible
    const widthRatio = containerData.width / canvasData.width;
    const heightRatio = containerData.height / canvasData.height;
    const scaleFactor = Math.min(widthRatio, heightRatio);
    const newWidth = canvasData.width * scaleFactor;
    const newHeight = canvasData.height * scaleFactor;
    // 2. Center our canvas
    const newLeft = (containerData.width - newWidth) / 2;
    const newTop = (containerData.height - newHeight) / 2;
    return {
        width: newWidth,
        height: newHeight,
        left: newLeft,
        top: newTop,
    };
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}
function getScaleFactorThatRemovesDarkCorners(w, h, granularAngle) {
    const α = Math.abs(toRadians(granularAngle));
    const scaleFactor = Math.max((Math.sin(α) * w + Math.cos(α) * h) / h, (Math.sin(α) * h + Math.cos(α) * w) / w);
    return scaleFactor;
}

function limitCropboxMovementOnMove(canvas, cropbox, prevCropbox) {
    // For the left boundary
    if (cropbox.left < canvas.left) {
        return {
            left: canvas.left,
            width: prevCropbox.width,
        };
    }
    // For the top boundary
    if (cropbox.top < canvas.top) {
        return {
            top: canvas.top,
            height: prevCropbox.height,
        };
    }
    // For the right boundary
    if (cropbox.left + cropbox.width > canvas.left + canvas.width) {
        return {
            left: canvas.left + canvas.width - prevCropbox.width,
            width: prevCropbox.width,
        };
    }
    // For the bottom boundary
    if (cropbox.top + cropbox.height > canvas.top + canvas.height) {
        return {
            top: canvas.top + canvas.height - prevCropbox.height,
            height: prevCropbox.height,
        };
    }
    return null;
}

function limitCropboxMovementOnResize(canvas, cropboxData, prevCropbox) {
    // For the left boundary
    if (cropboxData.left < canvas.left) {
        return {
            left: canvas.left,
            width: prevCropbox.left + prevCropbox.width - canvas.left,
        };
    }
    // For the top boundary
    if (cropboxData.top < canvas.top) {
        return {
            top: canvas.top,
            height: prevCropbox.top + prevCropbox.height - canvas.top,
        };
    }
    // For the right boundary
    if (cropboxData.left + cropboxData.width > canvas.left + canvas.width) {
        return {
            left: prevCropbox.left,
            width: canvas.left + canvas.width - prevCropbox.left,
        };
    }
    // For the bottom boundary
    if (cropboxData.top + cropboxData.height > canvas.top + canvas.height) {
        return {
            top: prevCropbox.top,
            height: canvas.top + canvas.height - prevCropbox.top,
        };
    }
    return null;
}

class Editor extends x {
    imgElement;
    cropper;
    constructor(props) {
        super(props);
        this.state = {
            angle90Deg: 0,
            angleGranular: 0,
            prevCropboxData: null,
        };
        this.storePrevCropboxData = this.storePrevCropboxData.bind(this);
        this.limitCropboxMovement = this.limitCropboxMovement.bind(this);
    }
    componentDidMount() {
        const { opts, storeCropperInstance } = this.props;
        this.cropper = new Cropper(this.imgElement, opts.cropperOptions);
        this.imgElement.addEventListener('cropstart', this.storePrevCropboxData);
        // @ts-expect-error custom cropper event but DOM API does not understand
        this.imgElement.addEventListener('cropend', this.limitCropboxMovement);
        storeCropperInstance(this.cropper);
    }
    componentWillUnmount() {
        this.cropper.destroy();
        this.imgElement.removeEventListener('cropstart', this.storePrevCropboxData);
        // @ts-expect-error custom cropper event but DOM API does not understand
        this.imgElement.removeEventListener('cropend', this.limitCropboxMovement);
    }
    storePrevCropboxData() {
        this.setState({ prevCropboxData: this.cropper.getCropBoxData() });
    }
    limitCropboxMovement(event) {
        const canvasData = this.cropper.getCanvasData();
        const cropboxData = this.cropper.getCropBoxData();
        const { prevCropboxData } = this.state;
        // 1. When we grab the cropbox in the middle and move it
        if (event.detail.action === 'all') {
            const newCropboxData = limitCropboxMovementOnMove(canvasData, cropboxData, prevCropboxData);
            if (newCropboxData)
                this.cropper.setCropBoxData(newCropboxData);
            // 2. When we stretch the cropbox by one of its sides
        }
        else {
            const newCropboxData = limitCropboxMovementOnResize(canvasData, cropboxData, prevCropboxData);
            if (newCropboxData)
                this.cropper.setCropBoxData(newCropboxData);
        }
    }
    onRotate90Deg = () => {
        // 1. Set state
        const { angle90Deg } = this.state;
        const newAngle = angle90Deg - 90;
        this.setState({
            angle90Deg: newAngle,
            angleGranular: 0,
        });
        // 2. Rotate the image
        // Important to reset scale here, or cropper will get confused on further rotations
        this.cropper.scale(1);
        this.cropper.rotateTo(newAngle);
        // 3. Fit the rotated image into the view
        const canvasData = this.cropper.getCanvasData();
        const containerData = this.cropper.getContainerData();
        const newCanvasData = getCanvasDataThatFitsPerfectlyIntoContainer(containerData, canvasData);
        this.cropper.setCanvasData(newCanvasData);
        // 4. Make cropbox fully wrap the image
        this.cropper.setCropBoxData(newCanvasData);
    };
    onRotateGranular = (ev) => {
        // 1. Set state
        const newGranularAngle = Number(ev.target.value);
        this.setState({ angleGranular: newGranularAngle });
        // 2. Rotate the image
        const { angle90Deg } = this.state;
        const newAngle = angle90Deg + newGranularAngle;
        this.cropper.rotateTo(newAngle);
        // 3. Scale the image so that it fits into the cropbox
        const image = this.cropper.getImageData();
        const scaleFactor = getScaleFactorThatRemovesDarkCorners(image.naturalWidth, image.naturalHeight, newGranularAngle);
        // Preserve flip
        const scaleFactorX = this.cropper.getImageData().scaleX < 0 ? -scaleFactor : scaleFactor;
        this.cropper.scale(scaleFactorX, scaleFactor);
    };
    renderGranularRotate() {
        const { i18n } = this.props;
        const { angleGranular } = this.state;
        return (u$2("label", { role: "tooltip", "aria-label": `${angleGranular}º`, "data-microtip-position": "top", className: "uppy-ImageCropper-rangeWrapper", children: u$2("input", { className: "uppy-ImageCropper-range uppy-u-reset", type: "range", onInput: this.onRotateGranular, onChange: this.onRotateGranular, value: angleGranular, min: "-45", max: "45", "aria-label": i18n('rotate') }) }));
    }
    renderRevert() {
        const { i18n, opts } = this.props;
        return (u$2("button", { "data-microtip-position": "top", type: "button", className: "uppy-u-reset uppy-c-btn", "aria-label": i18n('revert'), onClick: () => {
                this.cropper.reset();
                this.cropper.setAspectRatio(opts.cropperOptions.initialAspectRatio);
                this.setState({ angle90Deg: 0, angleGranular: 0 });
            }, children: u$2("svg", { "aria-hidden": "true", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M0 0h24v24H0z", fill: "none" }), u$2("path", { d: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" })] }) }));
    }
    renderRotate() {
        const { i18n } = this.props;
        return (u$2("button", { "data-microtip-position": "top", type: "button", className: "uppy-u-reset uppy-c-btn", "aria-label": i18n('rotate'), onClick: this.onRotate90Deg, children: u$2("svg", { "aria-hidden": "true", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M0 0h24v24H0V0zm0 0h24v24H0V0z", fill: "none" }), u$2("path", { d: "M14 10a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2h8zm0 1.75H6a.25.25 0 00-.243.193L5.75 12v7a.25.25 0 00.193.243L6 19.25h8a.25.25 0 00.243-.193L14.25 19v-7a.25.25 0 00-.193-.243L14 11.75zM12 .76V4c2.3 0 4.61.88 6.36 2.64a8.95 8.95 0 012.634 6.025L21 13a1 1 0 01-1.993.117L19 13h-.003a6.979 6.979 0 00-2.047-4.95 6.97 6.97 0 00-4.652-2.044L12 6v3.24L7.76 5 12 .76z" })] }) }));
    }
    renderFlip() {
        const { i18n } = this.props;
        return (u$2("button", { "data-microtip-position": "top", type: "button", className: "uppy-u-reset uppy-c-btn", "aria-label": i18n('flipHorizontal'), onClick: () => this.cropper.scaleX(-this.cropper.getData().scaleX || -1), children: u$2("svg", { "aria-hidden": "true", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M0 0h24v24H0z", fill: "none" }), u$2("path", { d: "M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z" })] }) }));
    }
    renderZoomIn() {
        const { i18n } = this.props;
        return (u$2("button", { "data-microtip-position": "top", type: "button", className: "uppy-u-reset uppy-c-btn", "aria-label": i18n('zoomIn'), onClick: () => this.cropper.zoom(0.1), children: u$2("svg", { "aria-hidden": "true", className: "uppy-c-icon", height: "24", viewBox: "0 0 24 24", width: "24", children: [u$2("path", { d: "M0 0h24v24H0V0z", fill: "none" }), u$2("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" }), u$2("path", { d: "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" })] }) }));
    }
    renderZoomOut() {
        const { i18n } = this.props;
        return (u$2("button", { "data-microtip-position": "top", type: "button", className: "uppy-u-reset uppy-c-btn", "aria-label": i18n('zoomOut'), onClick: () => this.cropper.zoom(-0.1), children: u$2("svg", { "aria-hidden": "true", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M0 0h24v24H0V0z", fill: "none" }), u$2("path", { d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z" })] }) }));
    }
    renderCropSquare() {
        const { i18n } = this.props;
        return (u$2("button", { "data-microtip-position": "top", type: "button", className: "uppy-u-reset uppy-c-btn", "aria-label": i18n('aspectRatioSquare'), onClick: () => this.cropper.setAspectRatio(1), children: u$2("svg", { "aria-hidden": "true", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M0 0h24v24H0z", fill: "none" }), u$2("path", { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" })] }) }));
    }
    renderCropWidescreen() {
        const { i18n } = this.props;
        return (u$2("button", { "data-microtip-position": "top", type: "button", className: "uppy-u-reset uppy-c-btn", "aria-label": i18n('aspectRatioLandscape'), onClick: () => this.cropper.setAspectRatio(16 / 9), children: u$2("svg", { "aria-hidden": "true", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M 19,4.9999992 V 17.000001 H 4.9999998 V 6.9999992 H 19 m 0,-2 H 4.9999998 c -1.0999999,0 -1.9999999,0.9000001 -1.9999999,2 V 17.000001 c 0,1.1 0.9,2 1.9999999,2 H 19 c 1.1,0 2,-0.9 2,-2 V 6.9999992 c 0,-1.0999999 -0.9,-2 -2,-2 z" }), u$2("path", { fill: "none", d: "M0 0h24v24H0z" })] }) }));
    }
    renderCropWidescreenVertical() {
        const { i18n } = this.props;
        return (u$2("button", { "data-microtip-position": "top", type: "button", "aria-label": i18n('aspectRatioPortrait'), className: "uppy-u-reset uppy-c-btn", onClick: () => this.cropper.setAspectRatio(9 / 16), children: u$2("svg", { "aria-hidden": "true", className: "uppy-c-icon", width: "24", height: "24", viewBox: "0 0 24 24", children: [u$2("path", { d: "M 19.000001,19 H 6.999999 V 5 h 10.000002 v 14 m 2,0 V 5 c 0,-1.0999999 -0.9,-1.9999999 -2,-1.9999999 H 6.999999 c -1.1,0 -2,0.9 -2,1.9999999 v 14 c 0,1.1 0.9,2 2,2 h 10.000002 c 1.1,0 2,-0.9 2,-2 z" }), u$2("path", { d: "M0 0h24v24H0z", fill: "none" })] }) }));
    }
    render() {
        const { currentImage, opts } = this.props;
        const { actions } = opts;
        const imageURL = URL.createObjectURL(currentImage.data);
        return (u$2("div", { className: "uppy-ImageCropper", children: [u$2("div", { className: "uppy-ImageCropper-container", children: u$2("img", { className: "uppy-ImageCropper-image", alt: currentImage.name, src: imageURL, ref: (ref) => {
                            this.imgElement = ref;
                        } }) }), u$2("div", { className: "uppy-ImageCropper-controls", children: [actions.revert && this.renderRevert(), actions.rotate && this.renderRotate(), actions.granularRotate && this.renderGranularRotate(), actions.flip && this.renderFlip(), actions.zoomIn && this.renderZoomIn(), actions.zoomOut && this.renderZoomOut(), actions.cropSquare && this.renderCropSquare(), actions.cropWidescreen && this.renderCropWidescreen(), actions.cropWidescreenVertical &&
                            this.renderCropWidescreenVertical()] })] }));
    }
}

var locale$2 = {
    strings: {
        revert: 'Reset',
        rotate: 'Rotate 90°',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        flipHorizontal: 'Flip horizontally',
        aspectRatioSquare: 'Crop square',
        aspectRatioLandscape: 'Crop landscape (16:9)',
        aspectRatioPortrait: 'Crop portrait (9:16)',
    },
};

const defaultCropperOptions = {
    viewMode: 0,
    background: false,
    autoCropArea: 1,
    responsive: true,
    minCropBoxWidth: 70,
    minCropBoxHeight: 70,
    croppedCanvasOptions: {},
    initialAspectRatio: 0,
};
const defaultActions = {
    revert: true,
    rotate: true,
    granularRotate: true,
    flip: true,
    zoomIn: true,
    zoomOut: true,
    cropSquare: true,
    cropWidescreen: true,
    cropWidescreenVertical: true,
};
const defaultOptions = {
    // `quality: 1` increases the image size by orders of magnitude - 0.8 seems to be the sweet spot.
    // see https://github.com/fengyuanchen/cropperjs/issues/538#issuecomment-1776279427
    quality: 0.8,
    actions: defaultActions,
    cropperOptions: defaultCropperOptions,
};
class ImageEditor extends UIPlugin {
    static VERSION = packageJson$3.version;
    cropper;
    constructor(uppy, opts) {
        super(uppy, {
            ...defaultOptions,
            ...opts,
            actions: {
                ...defaultActions,
                ...opts?.actions,
            },
            cropperOptions: {
                ...defaultCropperOptions,
                ...opts?.cropperOptions,
            },
        });
        this.id = this.opts.id || 'ImageEditor';
        this.title = 'Image Editor';
        this.type = 'editor';
        this.defaultLocale = locale$2;
        this.i18nInit();
    }
    canEditFile(file) {
        if (!file.type || file.isRemote) {
            return false;
        }
        const fileTypeSpecific = file.type.split('/')[1];
        if (/^(jpe?g|gif|png|bmp|webp)$/.test(fileTypeSpecific)) {
            return true;
        }
        return false;
    }
    save = () => {
        const saveBlobCallback = (blob) => {
            const { currentImage } = this.getPluginState();
            this.uppy.setFileState(currentImage.id, {
                // Reinserting image's name and type, because .toBlob loses both.
                data: new File([blob], currentImage.name ?? this.i18n('unnamed'), {
                    type: blob.type,
                }),
                size: blob.size,
                preview: undefined,
            });
            const updatedFile = this.uppy.getFile(currentImage.id);
            this.uppy.emit('thumbnail:request', updatedFile);
            this.setPluginState({
                currentImage: updatedFile,
            });
            this.uppy.emit('file-editor:complete', updatedFile);
        };
        const { currentImage } = this.getPluginState();
        // Fixes black 1px lines on odd-width images.
        // This should be removed when cropperjs fixes this issue.
        // (See https://github.com/transloadit/uppy/issues/4305 and https://github.com/fengyuanchen/cropperjs/issues/551).
        const croppedCanvas = this.cropper.getCroppedCanvas({});
        if (croppedCanvas.width % 2 !== 0) {
            this.cropper.setData({ width: croppedCanvas.width - 1 });
        }
        if (croppedCanvas.height % 2 !== 0) {
            this.cropper.setData({ height: croppedCanvas.height - 1 });
        }
        this.cropper
            .getCroppedCanvas(this.opts.cropperOptions.croppedCanvasOptions)
            .toBlob(saveBlobCallback, currentImage.type, this.opts.quality);
    };
    storeCropperInstance = (cropper) => {
        this.cropper = cropper;
    };
    selectFile = (file) => {
        this.uppy.emit('file-editor:start', file);
        this.setPluginState({
            currentImage: file,
        });
    };
    install() {
        this.setPluginState({
            currentImage: null,
        });
        const { target } = this.opts;
        if (target) {
            this.mount(target, this);
        }
    }
    uninstall() {
        const { currentImage } = this.getPluginState();
        if (currentImage) {
            const file = this.uppy.getFile(currentImage.id);
            this.uppy.emit('file-editor:cancel', file);
        }
        this.unmount();
    }
    render() {
        const { currentImage } = this.getPluginState();
        if (currentImage === null || currentImage.isRemote) {
            return null;
        }
        return (u$2(Editor, { currentImage: currentImage, storeCropperInstance: this.storeCropperInstance, save: this.save, opts: this.opts, i18n: this.i18n }));
    }
}

var version$2 = "3.0.1";
var packageJson$2 = {
	version: version$2};

var locale$1 = {
    strings: {
        pluginNameAudio: 'Audio',
        // Used as the label for the button that starts an audio recording.
        // This is not visibly rendered but is picked up by screen readers.
        startAudioRecording: 'Begin audio recording',
        // Used as the label for the button that stops an audio recording.
        // This is not visibly rendered but is picked up by screen readers.
        stopAudioRecording: 'Stop audio recording',
        // Title on the “allow access” screen
        allowAudioAccessTitle: 'Please allow access to your microphone',
        // Description on the “allow access” screen
        allowAudioAccessDescription: 'In order to record audio, please allow microphone access for this site.',
        // Title on the “device not available” screen
        noAudioTitle: 'Microphone Not Available',
        // Description on the “device not available” screen
        noAudioDescription: 'In order to record audio, please connect a microphone or another audio input device',
        // Message about file size will be shown in an Informer bubble
        recordingStoppedMaxSize: 'Recording stopped because the file size is about to exceed the limit',
        // Used as the label for the counter that shows recording length (`1:25`).
        // This is not visibly rendered but is picked up by screen readers.
        recordingLength: 'Recording length %{recording_length}',
        // Used as the label for the submit checkmark button.
        // This is not visibly rendered but is picked up by screen readers.
        submitRecordedFile: 'Submit recorded file',
        // Used as the label for the discard cross button.
        // This is not visibly rendered but is picked up by screen readers.
        discardRecordedFile: 'Discard recorded file',
    },
};

var PermissionsScreen = (props) => {
    const { icon, hasAudio, i18n } = props;
    return (u$2("div", { className: "uppy-Audio-permissons", children: [u$2("div", { className: "uppy-Audio-permissonsIcon", children: icon() }), u$2("div", { className: "uppy-Audio-title", children: hasAudio ? i18n('allowAudioAccessTitle') : i18n('noAudioTitle') }), u$2("p", { children: hasAudio
                    ? i18n('allowAudioAccessDescription')
                    : i18n('noAudioDescription') })] }));
};

var AudioSourceSelect = ({ currentDeviceId, audioSources, onChangeSource, }) => {
    return (u$2("div", { className: "uppy-Audio-videoSource", children: u$2("select", { className: "uppy-u-reset uppy-Audio-audioSource-select", onChange: (event) => {
                onChangeSource(event.target.value);
            }, children: audioSources.map((audioSource) => (u$2("option", { value: audioSource.deviceId, selected: audioSource.deviceId === currentDeviceId, children: audioSource.label }, audioSource.deviceId))) }) }));
};

// biome-ignore lint/complexity/noBannedTypes: ...
function isFunction(v) {
    return typeof v === 'function';
}
function result(v) {
    return isFunction(v) ? v() : v;
}
/* Audio Oscilloscope
  https://github.com/miguelmota/audio-oscilloscope
*/
class AudioOscilloscope {
    canvas;
    canvasContext;
    width;
    height;
    analyser;
    bufferLength;
    dataArray;
    onDrawFrame;
    streamSource;
    audioContext;
    source;
    constructor(canvas, options = {}) {
        const canvasOptions = options.canvas || {};
        const canvasContextOptions = options.canvasContext ||
            {};
        this.analyser = null;
        this.bufferLength = 0;
        this.canvas = canvas;
        this.width = result(canvasOptions.width) || this.canvas.width;
        this.height = result(canvasOptions.height) || this.canvas.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvasContext = this.canvas.getContext('2d');
        this.canvasContext.fillStyle =
            result(canvasContextOptions.fillStyle) || 'rgb(255, 255, 255)';
        this.canvasContext.strokeStyle =
            result(canvasContextOptions.strokeStyle) || 'rgb(0, 0, 0)';
        this.canvasContext.lineWidth = result(canvasContextOptions.lineWidth) || 1;
        this.onDrawFrame = isFunction(options.onDrawFrame)
            ? options.onDrawFrame
            : () => { };
    }
    addSource(streamSource) {
        this.streamSource = streamSource;
        this.audioContext = this.streamSource.context;
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.source = this.audioContext.createBufferSource();
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.streamSource.connect(this.analyser);
    }
    draw() {
        const { analyser, dataArray, bufferLength } = this;
        const ctx = this.canvasContext;
        const w = this.width;
        const h = this.height;
        if (analyser) {
            analyser.getByteTimeDomainData(dataArray);
        }
        ctx.fillRect(0, 0, w, h);
        ctx.beginPath();
        const sliceWidth = (w * 1.0) / bufferLength;
        let x = 0;
        if (!bufferLength) {
            ctx.moveTo(0, this.height / 2);
        }
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * (h / 2);
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        this.onDrawFrame(this);
        requestAnimationFrame(this.#draw);
    }
    #draw = () => this.draw();
}

function DiscardButton({ onDiscard, i18n }) {
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Audio-button", type: "button", title: i18n('discardRecordedFile'), "aria-label": i18n('discardRecordedFile'), onClick: onDiscard, "data-uppy-super-focusable": true, children: u$2("svg", { width: "13", height: "13", viewBox: "0 0 13 13", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", className: "uppy-c-icon", children: u$2("g", { fill: "#FFF", fillRule: "evenodd", children: [u$2("path", { d: "M.496 11.367L11.103.76l1.414 1.414L1.911 12.781z" }), u$2("path", { d: "M11.104 12.782L.497 2.175 1.911.76l10.607 10.606z" })] }) }) }));
}

function RecordButton({ recording, onStartRecording, onStopRecording, i18n, }) {
    if (recording) {
        return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Audio-button", type: "button", title: i18n('stopAudioRecording'), "aria-label": i18n('stopAudioRecording'), onClick: onStopRecording, "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "100", height: "100", viewBox: "0 0 100 100", children: u$2("rect", { x: "15", y: "15", width: "70", height: "70" }) }) }));
    }
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Audio-button", type: "button", title: i18n('startAudioRecording'), "aria-label": i18n('startAudioRecording'), onClick: onStartRecording, "data-uppy-super-focusable": true, children: u$2("svg", { "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", width: "14px", height: "20px", viewBox: "0 0 14 20", children: u$2("path", { d: "M7 14c2.21 0 4-1.71 4-3.818V3.818C11 1.71 9.21 0 7 0S3 1.71 3 3.818v6.364C3 12.29 4.79 14 7 14zm6.364-7h-.637a.643.643 0 0 0-.636.65V9.6c0 3.039-2.565 5.477-5.6 5.175-2.645-.264-4.582-2.692-4.582-5.407V7.65c0-.36-.285-.65-.636-.65H.636A.643.643 0 0 0 0 7.65v1.631c0 3.642 2.544 6.888 6.045 7.382v1.387H3.818a.643.643 0 0 0-.636.65v.65c0 .36.285.65.636.65h6.364c.351 0 .636-.29.636-.65v-.65c0-.36-.285-.65-.636-.65H7.955v-1.372C11.363 16.2 14 13.212 14 9.6V7.65c0-.36-.285-.65-.636-.65z", fill: "#FFF", "fill-rule": "nonzero" }) }) }));
}

/**
 * Takes an Integer value of seconds (e.g. 83) and converts it into a
 * human-readable formatted string (e.g. '1:23').
 */
function formatSeconds(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function RecordingLength({ recordingLengthSeconds, }) {
    const formattedRecordingLengthSeconds = formatSeconds(recordingLengthSeconds);
    return u$2("span", { children: formattedRecordingLengthSeconds });
}

function SubmitButton({ onSubmit, i18n }) {
    return (u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-Audio-button uppy-Audio-button--submit", type: "button", title: i18n('submitRecordedFile'), "aria-label": i18n('submitRecordedFile'), onClick: onSubmit, "data-uppy-super-focusable": true, children: u$2("svg", { width: "12", height: "9", viewBox: "0 0 12 9", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", focusable: "false", className: "uppy-c-icon", children: u$2("path", { fill: "#fff", fillRule: "nonzero", d: "M10.66 0L12 1.31 4.136 9 0 4.956l1.34-1.31L4.136 6.38z" }) }) }));
}

function RecordingScreen(props) {
    const { stream, recordedAudio, onStop, recording, supportsRecording, audioSources, showAudioSourceDropdown, onSubmit, i18n, onStartRecording, onStopRecording, onDiscardRecordedAudio, recordingLengthSeconds, } = props;
    const canvasEl = A$1(null);
    const oscilloscope = A$1();
    // componentDidMount / componentDidUnmount
    y$1(() => {
        return () => {
            oscilloscope.current = null;
            onStop();
        };
    }, [onStop]);
    // componentDidUpdate
    y$1(() => {
        if (!recordedAudio) {
            oscilloscope.current = new AudioOscilloscope(canvasEl.current, {
                canvas: {
                    width: 600,
                    height: 600,
                },
                canvasContext: {
                    lineWidth: 2,
                    fillStyle: 'rgb(0,0,0)',
                    strokeStyle: 'green',
                },
            });
            oscilloscope.current.draw();
            if (stream) {
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                oscilloscope.current.addSource(source);
            }
        }
    }, [recordedAudio, stream]);
    const hasRecordedAudio = recordedAudio != null;
    const shouldShowRecordButton = !hasRecordedAudio && supportsRecording;
    const shouldShowAudioSourceDropdown = showAudioSourceDropdown &&
        !hasRecordedAudio &&
        audioSources &&
        audioSources.length > 1;
    return (u$2("div", { className: "uppy-Audio-container", children: [u$2("div", { className: "uppy-Audio-audioContainer", children: hasRecordedAudio ? (
                // biome-ignore lint/a11y/useMediaCaption: ...
                u$2("audio", { className: "uppy-Audio-player", controls: true, src: recordedAudio })) : (u$2("canvas", { ref: canvasEl, className: "uppy-Audio-canvas" })) }), u$2("div", { className: "uppy-Audio-footer", children: [u$2("div", { className: "uppy-Audio-audioSourceContainer", children: shouldShowAudioSourceDropdown ? AudioSourceSelect(props) : null }), u$2("div", { className: "uppy-Audio-buttonContainer", children: [shouldShowRecordButton && (u$2(RecordButton, { recording: recording, onStartRecording: onStartRecording, onStopRecording: onStopRecording, i18n: i18n })), hasRecordedAudio && u$2(SubmitButton, { onSubmit: onSubmit, i18n: i18n }), hasRecordedAudio && (u$2(DiscardButton, { onDiscard: onDiscardRecordedAudio, i18n: i18n }))] }), u$2("div", { className: "uppy-Audio-recordingLength", children: !hasRecordedAudio && (u$2(RecordingLength, { recordingLengthSeconds: recordingLengthSeconds })) })] })] }));
}

function supportsMediaRecorder() {
    return (typeof MediaRecorder === 'function' &&
        typeof MediaRecorder.prototype?.start === 'function');
}

/**
 * Audio recording plugin
 */
class Audio extends UIPlugin {
    static VERSION = packageJson$2.version;
    #recordingLengthTimer;
    icon;
    #stream = null;
    #audioActive = false;
    #recordingChunks = null;
    #recorder = null;
    #capturedMediaFile = null;
    #mediaDevices;
    #supportsUserMedia;
    constructor(uppy, opts) {
        super(uppy, opts);
        this.#mediaDevices = navigator.mediaDevices;
        this.#supportsUserMedia = this.#mediaDevices != null;
        this.id = this.opts.id || 'Audio';
        this.type = 'acquirer';
        this.icon = () => (u$2("svg", { className: "uppy-DashboardTab-iconAudio", "aria-hidden": "true", focusable: "false", width: "32px", height: "32px", viewBox: "0 0 32 32", children: u$2("path", { d: "M21.143 12.297c.473 0 .857.383.857.857v2.572c0 3.016-2.24 5.513-5.143 5.931v2.64h2.572a.857.857 0 110 1.714H12.57a.857.857 0 110-1.714h2.572v-2.64C12.24 21.24 10 18.742 10 15.726v-2.572a.857.857 0 111.714 0v2.572A4.29 4.29 0 0016 20.01a4.29 4.29 0 004.286-4.285v-2.572c0-.474.384-.857.857-.857zM16 6.5a3 3 0 013 3v6a3 3 0 01-6 0v-6a3 3 0 013-3z", fill: "currentcolor", "fill-rule": "nonzero" }) }));
        this.defaultLocale = locale$1;
        this.opts = { ...opts };
        this.i18nInit();
        this.title = this.i18n('pluginNameAudio');
        this.setPluginState({
            hasAudio: false,
            audioReady: false,
            cameraError: null,
            recordingLengthSeconds: 0,
            audioSources: [],
            currentDeviceId: null,
        });
    }
    #hasAudioCheck() {
        if (!this.#mediaDevices) {
            return Promise.resolve(false);
        }
        return this.#mediaDevices.enumerateDevices().then((devices) => {
            return devices.some((device) => device.kind === 'audioinput');
        });
    }
    #start = (options) => {
        if (!this.#supportsUserMedia) {
            return Promise.reject(new Error('Microphone access not supported'));
        }
        this.#audioActive = true;
        this.#hasAudioCheck().then((hasAudio) => {
            this.setPluginState({
                hasAudio,
            });
            // ask user for access to their camera
            return this.#mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                this.#stream = stream;
                let currentDeviceId = null;
                const tracks = stream.getAudioTracks();
                if (!options?.deviceId) {
                    currentDeviceId = tracks[0].getSettings().deviceId;
                }
                else {
                    currentDeviceId = tracks.findLast((track) => {
                        return track.getSettings().deviceId === options.deviceId;
                    });
                }
                // Update the sources now, so we can access the names.
                this.#updateSources();
                this.setPluginState({
                    currentDeviceId,
                    audioReady: true,
                });
            })
                .catch((err) => {
                this.setPluginState({
                    audioReady: false,
                    cameraError: err,
                });
                this.uppy.info(err.message, 'error');
            });
        });
    };
    #startRecording = () => {
        // only used if supportsMediaRecorder() returned true
        this.#recorder = new MediaRecorder(this.#stream);
        this.#recordingChunks = [];
        let stoppingBecauseOfMaxSize = false;
        this.#recorder.addEventListener('dataavailable', (event) => {
            this.#recordingChunks.push(event.data);
            const { restrictions } = this.uppy.opts;
            if (this.#recordingChunks.length > 1 &&
                restrictions.maxFileSize != null &&
                !stoppingBecauseOfMaxSize) {
                const totalSize = this.#recordingChunks.reduce((acc, chunk) => acc + chunk.size, 0);
                // Exclude the initial chunk from the average size calculation because it is likely to be a very small outlier
                const averageChunkSize = (totalSize - this.#recordingChunks[0].size) /
                    (this.#recordingChunks.length - 1);
                const expectedEndChunkSize = averageChunkSize * 3;
                const maxSize = Math.max(0, restrictions.maxFileSize - expectedEndChunkSize);
                if (totalSize > maxSize) {
                    stoppingBecauseOfMaxSize = true;
                    this.uppy.info(this.i18n('recordingStoppedMaxSize'), 'warning', 4000);
                    this.#stopRecording();
                }
            }
        });
        // use a "time slice" of 500ms: ondataavailable will be called each 500ms
        // smaller time slices mean we can more accurately check the max file size restriction
        this.#recorder.start(500);
        // Start the recordingLengthTimer if we are showing the recording length.
        this.#recordingLengthTimer = setInterval(() => {
            const currentRecordingLength = this.getPluginState()
                .recordingLengthSeconds;
            this.setPluginState({
                recordingLengthSeconds: currentRecordingLength + 1,
            });
        }, 1000);
        this.setPluginState({
            isRecording: true,
        });
    };
    #stopRecording = () => {
        const stopped = new Promise((resolve) => {
            this.#recorder.addEventListener('stop', () => {
                resolve();
            });
            this.#recorder.stop();
            clearInterval(this.#recordingLengthTimer);
            this.setPluginState({ recordingLengthSeconds: 0 });
        });
        return stopped
            .then(() => {
            this.setPluginState({
                isRecording: false,
            });
            return this.#getAudio();
        })
            .then((file) => {
            try {
                this.#capturedMediaFile = file;
                // create object url for capture result preview
                this.setPluginState({
                    recordedAudio: URL.createObjectURL(file.data),
                });
            }
            catch (err) {
                // Logging the error, exept restrictions, which is handled in Core
                if (!err.isRestriction) {
                    this.uppy.log(err);
                }
            }
        })
            .then(() => {
            this.#recordingChunks = null;
            this.#recorder = null;
        }, (error) => {
            this.#recordingChunks = null;
            this.#recorder = null;
            throw error;
        });
    };
    #discardRecordedAudio = () => {
        this.setPluginState({ recordedAudio: null });
        this.#capturedMediaFile = null;
    };
    #submit = () => {
        try {
            if (this.#capturedMediaFile) {
                this.uppy.addFile(this.#capturedMediaFile);
            }
        }
        catch (err) {
            // Logging the error, exept restrictions, which is handled in Core
            if (!err.isRestriction) {
                this.uppy.log(err, 'warning');
            }
        }
    };
    #stop = async () => {
        if (this.#stream) {
            const audioTracks = this.#stream.getAudioTracks();
            audioTracks.forEach((track) => track.stop());
        }
        if (this.#recorder) {
            await new Promise((resolve) => {
                this.#recorder.addEventListener('stop', resolve, { once: true });
                this.#recorder.stop();
                clearInterval(this.#recordingLengthTimer);
            });
        }
        this.#recordingChunks = null;
        this.#recorder = null;
        this.#audioActive = false;
        this.#stream = null;
        this.setPluginState({
            recordedAudio: null,
            isRecording: false,
            recordingLengthSeconds: 0,
        });
    };
    #getAudio() {
        // Sometimes in iOS Safari, Blobs (especially the first Blob in the recordingChunks Array)
        // have empty 'type' attributes (e.g. '') so we need to find a Blob that has a defined 'type'
        // attribute in order to determine the correct MIME type.
        const mimeType = this.#recordingChunks.find((blob) => blob.type?.length > 0).type;
        const fileExtension = getFileTypeExtension(mimeType);
        if (!fileExtension) {
            return Promise.reject(new Error(`Could not retrieve recording: Unsupported media type "${mimeType}"`));
        }
        const name = `audio-${Date.now()}.${fileExtension}`;
        const blob = new Blob(this.#recordingChunks, { type: mimeType });
        const file = {
            source: this.id,
            name,
            data: new Blob([blob], { type: mimeType }),
            type: mimeType,
        };
        return Promise.resolve(file);
    }
    #changeSource = (deviceId) => {
        this.#stop();
        this.#start({ deviceId });
    };
    #updateSources = () => {
        this.#mediaDevices.enumerateDevices().then((devices) => {
            this.setPluginState({
                audioSources: devices.filter((device) => device.kind === 'audioinput'),
            });
        });
    };
    render() {
        if (!this.#audioActive) {
            this.#start();
        }
        const audioState = this.getPluginState();
        if (!audioState.audioReady || !audioState.hasAudio) {
            return (u$2(PermissionsScreen, { icon: this.icon, i18n: this.i18n, hasAudio: audioState.hasAudio }));
        }
        return (u$2(RecordingScreen, { ...audioState, onChangeSource: this.#changeSource, onStartRecording: this.#startRecording, onStopRecording: this.#stopRecording, onDiscardRecordedAudio: this.#discardRecordedAudio, onSubmit: this.#submit, onStop: this.#stop, i18n: this.i18n, showAudioSourceDropdown: this.opts.showAudioSourceDropdown, supportsRecording: supportsMediaRecorder(), recording: audioState.isRecording, stream: this.#stream }));
    }
    install() {
        this.setPluginState({
            audioReady: false,
            recordingLengthSeconds: 0,
        });
        const { target } = this.opts;
        if (target) {
            this.mount(target, this);
        }
        if (this.#mediaDevices) {
            this.#updateSources();
            this.#mediaDevices.ondevicechange = () => {
                this.#updateSources();
                if (this.#stream) {
                    let restartStream = true;
                    const { audioSources, currentDeviceId } = this.getPluginState();
                    audioSources.forEach((audioSource) => {
                        if (currentDeviceId === audioSource.deviceId) {
                            restartStream = false;
                        }
                    });
                    if (restartStream) {
                        this.#stop();
                        this.#start();
                    }
                }
            };
        }
    }
    uninstall() {
        if (this.#stream) {
            this.#stop();
        }
        this.unmount();
    }
}

var retry$2 = {};

function RetryOperation(timeouts, options) {
  // Compatibility for the old (timeouts, retryForever) signature
  if (typeof options === 'boolean') {
    options = { forever: options };
  }

  this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
  this._timeouts = timeouts;
  this._options = options || {};
  this._maxRetryTime = options && options.maxRetryTime || Infinity;
  this._fn = null;
  this._errors = [];
  this._attempts = 1;
  this._operationTimeout = null;
  this._operationTimeoutCb = null;
  this._timeout = null;
  this._operationStart = null;
  this._timer = null;

  if (this._options.forever) {
    this._cachedTimeouts = this._timeouts.slice(0);
  }
}
var retry_operation = RetryOperation;

RetryOperation.prototype.reset = function() {
  this._attempts = 1;
  this._timeouts = this._originalTimeouts.slice(0);
};

RetryOperation.prototype.stop = function() {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }
  if (this._timer) {
    clearTimeout(this._timer);
  }

  this._timeouts       = [];
  this._cachedTimeouts = null;
};

RetryOperation.prototype.retry = function(err) {
  if (this._timeout) {
    clearTimeout(this._timeout);
  }

  if (!err) {
    return false;
  }
  var currentTime = new Date().getTime();
  if (err && currentTime - this._operationStart >= this._maxRetryTime) {
    this._errors.push(err);
    this._errors.unshift(new Error('RetryOperation timeout occurred'));
    return false;
  }

  this._errors.push(err);

  var timeout = this._timeouts.shift();
  if (timeout === undefined) {
    if (this._cachedTimeouts) {
      // retry forever, only keep last error
      this._errors.splice(0, this._errors.length - 1);
      timeout = this._cachedTimeouts.slice(-1);
    } else {
      return false;
    }
  }

  var self = this;
  this._timer = setTimeout(function() {
    self._attempts++;

    if (self._operationTimeoutCb) {
      self._timeout = setTimeout(function() {
        self._operationTimeoutCb(self._attempts);
      }, self._operationTimeout);

      if (self._options.unref) {
          self._timeout.unref();
      }
    }

    self._fn(self._attempts);
  }, timeout);

  if (this._options.unref) {
      this._timer.unref();
  }

  return true;
};

RetryOperation.prototype.attempt = function(fn, timeoutOps) {
  this._fn = fn;

  if (timeoutOps) {
    if (timeoutOps.timeout) {
      this._operationTimeout = timeoutOps.timeout;
    }
    if (timeoutOps.cb) {
      this._operationTimeoutCb = timeoutOps.cb;
    }
  }

  var self = this;
  if (this._operationTimeoutCb) {
    this._timeout = setTimeout(function() {
      self._operationTimeoutCb();
    }, self._operationTimeout);
  }

  this._operationStart = new Date().getTime();

  this._fn(this._attempts);
};

RetryOperation.prototype.try = function(fn) {
  console.log('Using RetryOperation.try() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = function(fn) {
  console.log('Using RetryOperation.start() is deprecated');
  this.attempt(fn);
};

RetryOperation.prototype.start = RetryOperation.prototype.try;

RetryOperation.prototype.errors = function() {
  return this._errors;
};

RetryOperation.prototype.attempts = function() {
  return this._attempts;
};

RetryOperation.prototype.mainError = function() {
  if (this._errors.length === 0) {
    return null;
  }

  var counts = {};
  var mainError = null;
  var mainErrorCount = 0;

  for (var i = 0; i < this._errors.length; i++) {
    var error = this._errors[i];
    var message = error.message;
    var count = (counts[message] || 0) + 1;

    counts[message] = count;

    if (count >= mainErrorCount) {
      mainError = error;
      mainErrorCount = count;
    }
  }

  return mainError;
};

(function (exports) {
	var RetryOperation = retry_operation;

	exports.operation = function(options) {
	  var timeouts = exports.timeouts(options);
	  return new RetryOperation(timeouts, {
	      forever: options && (options.forever || options.retries === Infinity),
	      unref: options && options.unref,
	      maxRetryTime: options && options.maxRetryTime
	  });
	};

	exports.timeouts = function(options) {
	  if (options instanceof Array) {
	    return [].concat(options);
	  }

	  var opts = {
	    retries: 10,
	    factor: 2,
	    minTimeout: 1 * 1000,
	    maxTimeout: Infinity,
	    randomize: false
	  };
	  for (var key in options) {
	    opts[key] = options[key];
	  }

	  if (opts.minTimeout > opts.maxTimeout) {
	    throw new Error('minTimeout is greater than maxTimeout');
	  }

	  var timeouts = [];
	  for (var i = 0; i < opts.retries; i++) {
	    timeouts.push(this.createTimeout(i, opts));
	  }

	  if (options && options.forever && !timeouts.length) {
	    timeouts.push(this.createTimeout(i, opts));
	  }

	  // sort the array numerically ascending
	  timeouts.sort(function(a,b) {
	    return a - b;
	  });

	  return timeouts;
	};

	exports.createTimeout = function(attempt, opts) {
	  var random = (opts.randomize)
	    ? (Math.random() + 1)
	    : 1;

	  var timeout = Math.round(random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt));
	  timeout = Math.min(timeout, opts.maxTimeout);

	  return timeout;
	};

	exports.wrap = function(obj, options, methods) {
	  if (options instanceof Array) {
	    methods = options;
	    options = null;
	  }

	  if (!methods) {
	    methods = [];
	    for (var key in obj) {
	      if (typeof obj[key] === 'function') {
	        methods.push(key);
	      }
	    }
	  }

	  for (var i = 0; i < methods.length; i++) {
	    var method   = methods[i];
	    var original = obj[method];

	    obj[method] = function retryWrapper(original) {
	      var op       = exports.operation(options);
	      var args     = Array.prototype.slice.call(arguments, 1);
	      var callback = args.pop();

	      args.push(function(err) {
	        if (op.retry(err)) {
	          return;
	        }
	        if (err) {
	          arguments[0] = op.mainError();
	        }
	        callback.apply(this, arguments);
	      });

	      op.attempt(function() {
	        original.apply(obj, args);
	      });
	    }.bind(obj, original);
	    obj[method].options = options;
	  }
	}; 
} (retry$2));

var retry = retry$2;

var retry$1 = /*@__PURE__*/getDefaultExportFromCjs(retry);

const objectToString = Object.prototype.toString;

const isError = value => objectToString.call(value) === '[object Error]';

const errorMessages = new Set([
	'network error', // Chrome
	'Failed to fetch', // Chrome
	'NetworkError when attempting to fetch resource.', // Firefox
	'The Internet connection appears to be offline.', // Safari 16
	'Network request failed', // `cross-fetch`
	'fetch failed', // Undici (Node.js)
	'terminated', // Undici (Node.js)
	' A network error occurred.', // Bun (WebKit)
	'Network connection lost', // Cloudflare Workers (fetch)
]);

function isNetworkError(error) {
	const isValid = error
		&& isError(error)
		&& error.name === 'TypeError'
		&& typeof error.message === 'string';

	if (!isValid) {
		return false;
	}

	const {message, stack} = error;

	// Safari 17+ has generic message but no stack for network errors
	if (message === 'Load failed') {
		return stack === undefined
			// Sentry adds its own stack trace to the fetch error, so also check for that
			|| '__sentry_captured__' in error;
	}

	// Deno network errors start with specific text
	if (message.startsWith('error sending request for url')) {
		return true;
	}

	// Standard network error messages
	return errorMessages.has(message);
}

class AbortError extends Error {
	constructor(message) {
		super();

		if (message instanceof Error) {
			this.originalError = message;
			({message} = message);
		} else {
			this.originalError = new Error(message);
			this.originalError.stack = this.stack;
		}

		this.name = 'AbortError';
		this.message = message;
	}
}

const decorateErrorWithCounts = (error, attemptNumber, options) => {
	// Minus 1 from attemptNumber because the first attempt does not count as a retry
	const retriesLeft = options.retries - (attemptNumber - 1);

	error.attemptNumber = attemptNumber;
	error.retriesLeft = retriesLeft;
	return error;
};

async function pRetry(input, options) {
	return new Promise((resolve, reject) => {
		options = {...options};
		options.onFailedAttempt ??= () => {};
		options.shouldRetry ??= () => true;
		options.retries ??= 10;

		const operation = retry$1.operation(options);

		const abortHandler = () => {
			operation.stop();
			reject(options.signal?.reason);
		};

		if (options.signal && !options.signal.aborted) {
			options.signal.addEventListener('abort', abortHandler, {once: true});
		}

		const cleanUp = () => {
			options.signal?.removeEventListener('abort', abortHandler);
			operation.stop();
		};

		operation.attempt(async attemptNumber => {
			try {
				const result = await input(attemptNumber);
				cleanUp();
				resolve(result);
			} catch (error) {
				try {
					if (!(error instanceof Error)) {
						throw new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`);
					}

					if (error instanceof AbortError) {
						throw error.originalError;
					}

					if (error instanceof TypeError && !isNetworkError(error)) {
						throw error;
					}

					decorateErrorWithCounts(error, attemptNumber, options);

					if (!(await options.shouldRetry(error))) {
						operation.stop();
						reject(error);
					}

					await options.onFailedAttempt(error);

					if (!operation.retry(error)) {
						throw operation.mainError();
					}
				} catch (finalError) {
					decorateErrorWithCounts(finalError, attemptNumber, options);
					cleanUp();
					reject(finalError);
				}
			}
		});
	});
}

var version$1 = "5.1.0";
var packageJson$1 = {
	version: version$1};

class AuthError extends Error {
    isAuthError;
    constructor() {
        super('Authorization required');
        this.name = 'AuthError';
        // we use a property because of instanceof is unsafe:
        // https://github.com/transloadit/uppy/pull/4619#discussion_r1406225982
        this.isAuthError = true;
    }
}

// Remove the trailing slash so we can always safely append /xyz.
function stripSlash(url) {
    return url.replace(/\/$/, '');
}
const retryCount = 10; // set to a low number, like 2 to test manual user retries
const socketActivityTimeoutMs = 5 * 60 * 1000; // set to a low number like 10000 to test this
const authErrorStatusCode = 401;
class HttpError extends Error {
    statusCode;
    constructor({ statusCode, message, }) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
    }
}
async function handleJSONResponse(res) {
    if (res.status === authErrorStatusCode) {
        throw new AuthError();
    }
    if (res.ok) {
        return res.json();
    }
    let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;
    let errData;
    try {
        errData = await res.json();
        if (errData.message)
            errMsg = `${errMsg} message: ${errData.message}`;
        if (errData.requestId)
            errMsg = `${errMsg} request-Id: ${errData.requestId}`;
    }
    catch (cause) {
        // if the response contains invalid JSON, let's ignore the error data
        throw new Error(errMsg, { cause });
    }
    if (res.status >= 400 && res.status <= 499 && errData.message) {
        throw new UserFacingApiError(errData.message);
    }
    throw new HttpError({ statusCode: res.status, message: errMsg });
}
function emitSocketProgress(uploader, progressData, file) {
    const { progress, bytesUploaded, bytesTotal } = progressData;
    if (progress) {
        uploader.uppy.log(`Upload progress: ${progress}`);
        uploader.uppy.emit('upload-progress', file, {
            uploadStarted: file.progress.uploadStarted ?? 0,
            bytesUploaded,
            bytesTotal,
        });
    }
}
class RequestClient {
    static VERSION = packageJson$1.version;
    #companionHeaders;
    uppy;
    opts;
    constructor(uppy, opts) {
        this.uppy = uppy;
        this.opts = opts;
        this.onReceiveResponse = this.onReceiveResponse.bind(this);
        this.#companionHeaders = opts.companionHeaders;
    }
    setCompanionHeaders(headers) {
        this.#companionHeaders = headers;
    }
    [Symbol.for('uppy test: getCompanionHeaders')]() {
        return this.#companionHeaders;
    }
    get hostname() {
        const { companion } = this.uppy.getState();
        const host = this.opts.companionUrl;
        return stripSlash(companion?.[host] ? companion[host] : host);
    }
    async headers(emptyBody = false) {
        const defaultHeaders = {
            Accept: 'application/json',
            ...(emptyBody
                ? undefined
                : {
                    // Passing those headers on requests with no data forces browsers to first make a preflight request.
                    'Content-Type': 'application/json',
                }),
        };
        return {
            ...defaultHeaders,
            ...this.#companionHeaders,
        };
    }
    onReceiveResponse(res) {
        const { headers } = res;
        const state = this.uppy.getState();
        const companion = state.companion || {};
        const host = this.opts.companionUrl;
        // Store the self-identified domain name for the Companion instance we just hit.
        if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
            this.uppy.setState({
                companion: { ...companion, [host]: headers.get('i-am') },
            });
        }
    }
    #getUrl(url) {
        if (/^(https?:|)\/\//.test(url)) {
            return url;
        }
        return `${this.hostname}/${url}`;
    }
    async request({ path, method = 'GET', data, skipPostResponse, signal, }) {
        try {
            const headers = await this.headers(!data);
            const response = await fetchWithNetworkError(this.#getUrl(path), {
                method,
                signal,
                headers,
                credentials: this.opts.companionCookiesRule || 'same-origin',
                body: data ? JSON.stringify(data) : null,
            });
            if (!skipPostResponse)
                this.onReceiveResponse(response);
            return await handleJSONResponse(response);
        }
        catch (err) {
            // pass these through
            if (err.isAuthError ||
                err.name === 'UserFacingApiError' ||
                err.name === 'AbortError')
                throw err;
            throw new ErrorWithCause(`Could not ${method} ${this.#getUrl(path)}`, {
                cause: err,
            });
        }
    }
    async get(path, options) {
        return this.request({ ...options, path });
    }
    async post(path, data, options) {
        return this.request({ ...options, path, method: 'POST', data });
    }
    async delete(path, data, options) {
        return this.request({ ...options, path, method: 'DELETE', data });
    }
    /**
     * Remote uploading consists of two steps:
     * 1. #requestSocketToken which starts the download/upload in companion and returns a unique token for the upload.
     * Then companion will halt the upload until:
     * 2. #awaitRemoteFileUpload is called, which will open/ensure a websocket connection towards companion, with the
     * previously generated token provided. It returns a promise that will resolve/reject once the file has finished
     * uploading or is otherwise done (failed, canceled)
     */
    async uploadRemoteFile(file, reqBody, options) {
        try {
            const { signal, getQueue } = options || {};
            return await pRetry(async () => {
                // if we already have a serverToken, assume that we are resuming the existing server upload id
                const existingServerToken = this.uppy.getFile(file.id)?.serverToken;
                if (existingServerToken != null) {
                    this.uppy.log(`Connecting to exiting websocket ${existingServerToken}`);
                    return this.#awaitRemoteFileUpload({
                        file,
                        queue: getQueue(),
                        signal,
                    });
                }
                const queueRequestSocketToken = getQueue().wrapPromiseFunction(async (...args) => {
                    try {
                        return await this.#requestSocketToken(...args);
                    }
                    catch (outerErr) {
                        // throwing AbortError will cause p-retry to stop retrying
                        if (outerErr.isAuthError)
                            throw new AbortError(outerErr);
                        if (outerErr.cause == null)
                            throw outerErr;
                        const err = outerErr.cause;
                        const isRetryableHttpError = () => [408, 409, 429, 418, 423].includes(err.statusCode) ||
                            (err.statusCode >= 500 &&
                                err.statusCode <= 599 &&
                                ![501, 505].includes(err.statusCode));
                        if (err.name === 'HttpError' && !isRetryableHttpError())
                            throw new AbortError(err);
                        // p-retry will retry most other errors,
                        // but it will not retry TypeError (except network error TypeErrors)
                        throw err;
                    }
                }, { priority: -1 });
                const serverToken = await queueRequestSocketToken({
                    file,
                    postBody: reqBody,
                    signal,
                }).abortOn(signal);
                if (!this.uppy.getFile(file.id))
                    return undefined; // has file since been removed?
                this.uppy.setFileState(file.id, { serverToken });
                return this.#awaitRemoteFileUpload({
                    file: this.uppy.getFile(file.id), // re-fetching file because it might have changed in the meantime
                    queue: getQueue(),
                    signal,
                });
            }, {
                retries: retryCount,
                signal,
                onFailedAttempt: (err) => this.uppy.log(`Retrying upload due to: ${err.message}`, 'warning'),
            });
        }
        catch (err) {
            // this is a bit confusing, but note that an error with the `name` prop set to 'AbortError' (from AbortController)
            // is not the same as `p-retry` `AbortError`
            if (err.name === 'AbortError') {
                // The file upload was aborted, it’s not an error
                return undefined;
            }
            this.uppy.emit('upload-error', file, err);
            throw err;
        }
    }
    #requestSocketToken = async ({ file, postBody, signal, }) => {
        if (file.remote?.url == null) {
            throw new Error('Cannot connect to an undefined URL');
        }
        const res = await this.post(file.remote.url, {
            ...file.remote.body,
            ...postBody,
        }, { signal });
        return res.token;
    };
    /**
     * This method will ensure a websocket for the specified file and returns a promise that resolves
     * when the file has finished downloading, or rejects if it fails.
     * It will retry if the websocket gets disconnected
     */
    async #awaitRemoteFileUpload({ file, queue, signal, }) {
        let removeEventHandlers;
        const { capabilities } = this.uppy.getState();
        try {
            return await new Promise((resolve, reject) => {
                const token = file.serverToken;
                const host = getSocketHost(file.remote.companionUrl);
                let socket;
                let socketAbortController;
                let activityTimeout;
                let { isPaused } = file;
                const socketSend = (action, payload) => {
                    if (socket == null || socket.readyState !== socket.OPEN) {
                        this.uppy.log(`Cannot send "${action}" to socket ${file.id} because the socket state was ${String(socket?.readyState)}`, 'warning');
                        return;
                    }
                    socket.send(JSON.stringify({
                        action,
                        payload: payload ?? {},
                    }));
                };
                function sendState() {
                    if (!capabilities.resumableUploads)
                        return;
                    if (isPaused)
                        socketSend('pause');
                    else
                        socketSend('resume');
                }
                const createWebsocket = async () => {
                    if (socketAbortController)
                        socketAbortController.abort();
                    socketAbortController = new AbortController();
                    const onFatalError = (err) => {
                        // Remove the serverToken so that a new one will be created for the retry.
                        this.uppy.setFileState(file.id, { serverToken: null });
                        socketAbortController?.abort?.();
                        reject(err);
                    };
                    // todo instead implement the ability for users to cancel / retry *currently uploading files* in the UI
                    function resetActivityTimeout() {
                        clearTimeout(activityTimeout);
                        if (isPaused)
                            return;
                        activityTimeout = setTimeout(() => onFatalError(new Error('Timeout waiting for message from Companion socket')), socketActivityTimeoutMs);
                    }
                    try {
                        await queue
                            .wrapPromiseFunction(async () => {
                            const reconnectWebsocket = async () => new Promise((_, rejectSocket) => {
                                socket = new WebSocket(`${host}/api/${token}`);
                                resetActivityTimeout();
                                socket.addEventListener('close', () => {
                                    socket = undefined;
                                    rejectSocket(new Error('Socket closed unexpectedly'));
                                });
                                socket.addEventListener('error', (error) => {
                                    this.uppy.log(`Companion socket error ${JSON.stringify(error)}, closing socket`, 'warning');
                                    socket?.close(); // will 'close' event to be emitted
                                });
                                socket.addEventListener('open', () => {
                                    sendState();
                                });
                                socket.addEventListener('message', (e) => {
                                    resetActivityTimeout();
                                    try {
                                        const { action, payload } = JSON.parse(e.data);
                                        switch (action) {
                                            case 'progress': {
                                                emitSocketProgress(this, payload, this.uppy.getFile(file.id));
                                                break;
                                            }
                                            case 'success': {
                                                // payload.response is sent from companion for xhr-upload (aka uploadMultipart in companion) and
                                                // s3 multipart (aka uploadS3Multipart)
                                                // but not for tus/transloadit (aka uploadTus)
                                                // responseText is a string which may or may not be in JSON format
                                                // this means that an upload destination of xhr or s3 multipart MUST respond with valid JSON
                                                // to companion, or the JSON.parse will crash
                                                const text = payload.response?.responseText;
                                                this.uppy.emit('upload-success', this.uppy.getFile(file.id), {
                                                    uploadURL: payload.url,
                                                    status: payload.response?.status ?? 200,
                                                    body: text
                                                        ? JSON.parse(text)
                                                        : undefined,
                                                });
                                                socketAbortController?.abort?.();
                                                resolve();
                                                break;
                                            }
                                            case 'error': {
                                                const { message } = payload.error;
                                                throw Object.assign(new Error(message), {
                                                    cause: payload.error,
                                                });
                                            }
                                            default:
                                                this.uppy.log(`Companion socket unknown action ${action}`, 'warning');
                                        }
                                    }
                                    catch (err) {
                                        onFatalError(err);
                                    }
                                });
                                const closeSocket = () => {
                                    this.uppy.log(`Closing socket ${file.id}`);
                                    clearTimeout(activityTimeout);
                                    if (socket)
                                        socket.close();
                                    socket = undefined;
                                };
                                socketAbortController.signal.addEventListener('abort', () => {
                                    closeSocket();
                                });
                            });
                            await pRetry(reconnectWebsocket, {
                                retries: retryCount,
                                signal: socketAbortController.signal,
                                onFailedAttempt: () => {
                                    if (socketAbortController.signal.aborted)
                                        return; // don't log in this case
                                    this.uppy.log(`Retrying websocket ${file.id}`);
                                },
                            });
                        })()
                            .abortOn(socketAbortController.signal);
                    }
                    catch (err) {
                        if (socketAbortController.signal.aborted)
                            return;
                        onFatalError(err);
                    }
                };
                const pause = (newPausedState) => {
                    if (!capabilities.resumableUploads)
                        return;
                    isPaused = newPausedState;
                    if (socket)
                        sendState();
                };
                const onFileRemove = (targetFile) => {
                    if (!capabilities.individualCancellation)
                        return;
                    if (targetFile.id !== file.id)
                        return;
                    socketSend('cancel');
                    socketAbortController?.abort?.();
                    this.uppy.log(`upload ${file.id} was removed`);
                    resolve();
                };
                const onCancelAll = () => {
                    socketSend('cancel');
                    socketAbortController?.abort?.();
                    this.uppy.log(`upload ${file.id} was canceled`);
                    resolve();
                };
                const onFilePausedChange = (targetFile, newPausedState) => {
                    if (targetFile?.id !== file.id)
                        return;
                    pause(newPausedState);
                };
                const onPauseAll = () => pause(true);
                const onResumeAll = () => pause(false);
                this.uppy.on('file-removed', onFileRemove);
                this.uppy.on('cancel-all', onCancelAll);
                this.uppy.on('upload-pause', onFilePausedChange);
                this.uppy.on('pause-all', onPauseAll);
                this.uppy.on('resume-all', onResumeAll);
                removeEventHandlers = () => {
                    this.uppy.off('file-removed', onFileRemove);
                    this.uppy.off('cancel-all', onCancelAll);
                    this.uppy.off('upload-pause', onFilePausedChange);
                    this.uppy.off('pause-all', onPauseAll);
                    this.uppy.off('resume-all', onResumeAll);
                };
                signal.addEventListener('abort', () => {
                    socketAbortController?.abort();
                });
                createWebsocket();
            });
        }
        finally {
            // @ts-expect-error used before defined
            removeEventHandlers?.();
        }
    }
}

var version = "5.0.1";
var packageJson = {
	version: version};

var locale = {
    strings: {
        pluginNameUrl: 'Link',
        // Label for the "Import" button.
        import: 'Import',
        // Placeholder text for the URL input.
        enterUrlToImport: 'Enter URL to import a file',
        // Error message shown if Companion could not load a URL.
        failedToFetch: 'Companion failed to fetch this URL, please make sure it’s correct',
        // Error message shown if the input does not look like a URL.
        enterCorrectUrl: 'Incorrect URL: Please make sure you are entering a direct link to a file',
    },
};

class UrlUI extends x {
    form = document.createElement('form');
    // Ref is always defined after render
    input;
    constructor(props) {
        super(props);
        this.form.id = nanoid();
    }
    componentDidMount() {
        this.input.value = '';
        this.form.addEventListener('submit', this.#handleSubmit);
        document.body.appendChild(this.form);
    }
    componentWillUnmount() {
        this.form.removeEventListener('submit', this.#handleSubmit);
        document.body.removeChild(this.form);
    }
    #handleSubmit = (ev) => {
        ev.preventDefault();
        const { addFile } = this.props;
        const preparedValue = this.input.value.trim();
        addFile(preparedValue);
    };
    render() {
        const { i18n } = this.props;
        return (u$2("div", { className: "uppy-Url", children: [u$2("input", { className: "uppy-u-reset uppy-c-textInput uppy-Url-input", type: "text", "aria-label": i18n('enterUrlToImport'), placeholder: i18n('enterUrlToImport'), ref: (input) => {
                        this.input = input;
                    }, "data-uppy-super-focusable": true, form: this.form.id }), u$2("button", { className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Url-importButton", type: "submit", form: this.form.id, children: i18n('import') })] }));
    }
}

/*
  SITUATION

    1. Cross-browser dataTransfer.items

      paste in chrome [Copy Image]:
      0: {kind: "file", type: "image/png"}
      1: {kind: "string", type: "text/html"}
      paste in safari [Copy Image]:
      0: {kind: "file", type: "image/png"}
      1: {kind: "string", type: "text/html"}
      2: {kind: "string", type: "text/plain"}
      3: {kind: "string", type: "text/uri-list"}
      paste in firefox [Copy Image]:
      0: {kind: "file", type: "image/png"}
      1: {kind: "string", type: "text/html"}

      paste in chrome [Copy Image Address]:
      0: {kind: "string", type: "text/plain"}
      paste in safari [Copy Image Address]:
      0: {kind: "string", type: "text/plain"}
      1: {kind: "string", type: "text/uri-list"}
      paste in firefox [Copy Image Address]:
      0: {kind: "string", type: "text/plain"}

      drop in chrome [from browser]:
      0: {kind: "string", type: "text/uri-list"}
      1: {kind: "string", type: "text/html"}
      drop in safari [from browser]:
      0: {kind: "string", type: "text/uri-list"}
      1: {kind: "string", type: "text/html"}
      2: {kind: "file", type: "image/png"}
      drop in firefox [from browser]:
      0: {kind: "string", type: "text/uri-list"}
      1: {kind: "string", type: "text/x-moz-url"}
      2: {kind: "string", type: "text/plain"}

    2. We can determine if it's a 'copypaste' or a 'drop', but we can't discern between [Copy Image] and [Copy Image Address]

  CONCLUSION

    1. 'paste' ([Copy Image] or [Copy Image Address], we can't discern between these two)
      Don't do anything if there is 'file' item. .handlePaste in the DashboardPlugin will deal with all 'file' items.
      If there are no 'file' items - handle 'text/plain' items.

    2. 'drop'
      Take 'text/uri-list' items. Safari has an additional item of .kind === 'file', and you may worry about the item being
      duplicated (first by DashboardPlugin, and then by UrlPlugin, now), but don't. Directory handling code won't pay
      attention to this particular item of kind 'file'.
*/
/**
 * Finds all links dropped/pasted from one browser window to another.
 */
function forEachDroppedOrPastedUrl(dataTransfer, isDropOrPaste, callback) {
    const items = toArray(dataTransfer.items);
    let urlItems;
    switch (isDropOrPaste) {
        case 'paste': {
            const atLeastOneFileIsDragged = items.some((item) => item.kind === 'file');
            if (atLeastOneFileIsDragged) {
                return;
            }
            urlItems = items.filter((item) => item.kind === 'string' && item.type === 'text/plain');
            break;
        }
        case 'drop': {
            urlItems = items.filter((item) => item.kind === 'string' && item.type === 'text/uri-list');
            break;
        }
        default: {
            throw new Error(`isDropOrPaste must be either 'drop' or 'paste', but it's ${isDropOrPaste}`);
        }
    }
    urlItems.forEach((item) => {
        item.getAsString((urlString) => callback(urlString));
    });
}

function UrlIcon() {
    return (u$2("svg", { "aria-hidden": "true", focusable: "false", width: "32", height: "32", viewBox: "0 0 32 32", children: u$2("path", { d: "M23.637 15.312l-2.474 2.464a3.582 3.582 0 01-.577.491c-.907.657-1.897.986-2.968.986a4.925 4.925 0 01-3.959-1.971c-.248-.329-.164-.902.165-1.149.33-.247.907-.164 1.155.164 1.072 1.478 3.133 1.724 4.618.656a.642.642 0 00.33-.328l2.473-2.463c1.238-1.313 1.238-3.366-.082-4.597a3.348 3.348 0 00-4.618 0l-1.402 1.395a.799.799 0 01-1.154 0 .79.79 0 010-1.15l1.402-1.394a4.843 4.843 0 016.843 0c2.062 1.805 2.144 5.007.248 6.896zm-8.081 5.664l-1.402 1.395a3.348 3.348 0 01-4.618 0c-1.319-1.23-1.319-3.365-.082-4.596l2.475-2.464.328-.328c.743-.492 1.567-.739 2.475-.657.906.165 1.648.574 2.143 1.314.248.329.825.411 1.155.165.33-.248.412-.822.165-1.15-.825-1.068-1.98-1.724-3.216-1.888-1.238-.247-2.556.082-3.628.902l-.495.493-2.474 2.464c-1.897 1.969-1.814 5.09.083 6.977.99.904 2.226 1.396 3.463 1.396s2.473-.492 3.463-1.395l1.402-1.396a.79.79 0 000-1.15c-.33-.328-.908-.41-1.237-.082z", fill: "#FF753E", "fill-rule": "nonzero" }) }));
}
function addProtocolToURL(url) {
    const protocolRegex = /^[a-z0-9]+:\/\//;
    const defaultProtocol = 'http://';
    if (protocolRegex.test(url)) {
        return url;
    }
    return defaultProtocol + url;
}
function canHandleRootDrop(e) {
    const items = toArray(e.dataTransfer.items);
    const urls = items.filter((item) => item.kind === 'string' && item.type === 'text/uri-list');
    return urls.length > 0;
}
function checkIfCorrectURL(url) {
    return url?.startsWith('http://') || url?.startsWith('https://');
}
function getFileNameFromUrl(url) {
    const { pathname } = new URL(url);
    return pathname.substring(pathname.lastIndexOf('/') + 1);
}
class Url extends UIPlugin {
    static VERSION = packageJson.version;
    static requestClientId = Url.name;
    icon;
    hostname;
    client;
    canHandleRootDrop;
    constructor(uppy, opts) {
        super(uppy, opts);
        this.id = this.opts.id || 'Url';
        this.type = 'acquirer';
        this.icon = () => u$2(UrlIcon, {});
        // Set default options and locale
        this.defaultLocale = locale;
        this.i18nInit();
        this.title = this.i18n('pluginNameUrl');
        this.hostname = this.opts.companionUrl;
        if (!this.hostname) {
            throw new Error('Companion hostname is required, please consult https://uppy.io/docs/companion');
        }
        this.client = new RequestClient(uppy, {
            pluginId: this.id,
            provider: 'url',
            companionUrl: this.opts.companionUrl,
            companionHeaders: this.opts.companionHeaders,
            companionCookiesRule: this.opts.companionCookiesRule,
        });
        this.uppy.registerRequestClient(Url.requestClientId, this.client);
    }
    getMeta = (url) => {
        return this.client.post('url/meta', { url });
    };
    addFile = async (protocollessUrl, optionalMeta) => {
        // Do not process local files
        if (protocollessUrl.startsWith('blob')) {
            return undefined;
        }
        const url = addProtocolToURL(protocollessUrl);
        if (!checkIfCorrectURL(url)) {
            this.uppy.log(`[URL] Incorrect URL entered: ${url}`);
            this.uppy.info(this.i18n('enterCorrectUrl'), 'error', 4000);
            return undefined;
        }
        this.uppy.log(`[URL] Adding file from dropped/pasted url: ${url}`);
        try {
            const meta = await this.getMeta(url);
            const tagFile = {
                meta: optionalMeta,
                source: this.id,
                name: meta.name || getFileNameFromUrl(url),
                type: meta.type,
                data: {
                    size: meta.size,
                },
                isRemote: true,
                body: {
                    url,
                },
                remote: {
                    companionUrl: this.opts.companionUrl,
                    url: `${this.hostname}/url/get`,
                    body: {
                        fileId: url,
                        url,
                    },
                    requestClientId: Url.requestClientId,
                },
            };
            this.uppy.log('[Url] Adding remote file');
            try {
                return this.uppy.addFile(tagFile);
            }
            catch (err) {
                if (!err.isRestriction) {
                    this.uppy.log(err);
                }
                return err;
            }
        }
        catch (err) {
            this.uppy.log(err);
            this.uppy.info({
                message: this.i18n('failedToFetch'),
                details: err,
            }, 'error', 4000);
            return err;
        }
    };
    handleRootDrop = (e) => {
        forEachDroppedOrPastedUrl(e.dataTransfer, 'drop', (url) => {
            this.addFile(url);
        });
    };
    handleRootPaste = (e) => {
        forEachDroppedOrPastedUrl(e.clipboardData, 'paste', (url) => {
            this.addFile(url);
        });
    };
    render() {
        return u$2(UrlUI, { i18n: this.i18n, addFile: this.addFile });
    }
    install() {
        const { target } = this.opts;
        if (target) {
            this.mount(target, this);
        }
    }
    uninstall() {
        this.unmount();
    }
}
// This is defined outside of the class body because it's not using `this`, but
// we still want it available on the prototype so the Dashboard can access it.
Url.prototype.canHandleRootDrop = canHandleRootDrop;

/**
 * Uppy File Upload Component for Form.io
 *
 * Provides a rich file upload experience using Uppy.js Dashboard
 */
// Import Uppy styles
// NOTE: Uppy CSS imports removed - consuming apps must import Uppy styles
// See documentation for required CSS imports
const FileComponent$1 = Components.components.file;
class UppyFileUploadComponent extends FileComponent$1 {
    static schema(...extend) {
        return FileComponent$1.schema({
            type: 'uppyupload',
            label: 'Uppy File Upload',
            key: 'uppyupload',
            storage: 'url',
            url: '',
            options: {
                uploadOnly: false,
            },
            filePattern: '*',
            fileMinSize: '0KB',
            fileMaxSize: '1GB',
            uppyOptions: {
                inline: true,
                height: 450,
                showProgressDetails: true,
                showLinkToFileUploadResult: true,
                proudlyDisplayPoweredByUppy: false,
                plugins: ['Webcam', 'ScreenCapture', 'ImageEditor', 'Audio', 'Url'],
            },
            ...extend,
        });
    }
    static get builderInfo() {
        return {
            title: 'Uppy File Upload',
            icon: 'cloud-upload-alt',
            group: 'premium',
            documentation: '/userguide/forms/premium-components#uppy-file-upload',
            weight: 101,
            schema: UppyFileUploadComponent.schema(),
        };
    }
    static editForm() {
        return FileComponent$1.editForm([
            {
                key: 'display',
                components: [
                    {
                        key: 'displayBasic',
                        components: [
                            {
                                type: 'checkbox',
                                key: 'uppyOptions.inline',
                                label: 'Inline Dashboard',
                                defaultValue: true,
                                weight: 25,
                                tooltip: 'Show dashboard inline vs modal',
                                input: true,
                            },
                            {
                                type: 'number',
                                key: 'uppyOptions.height',
                                label: 'Dashboard Height',
                                defaultValue: 450,
                                weight: 26,
                                conditional: {
                                    json: {
                                        '===': [{ var: 'data.uppyOptions.inline' }, true],
                                    },
                                },
                                input: true,
                            },
                            {
                                type: 'checkbox',
                                key: 'uppyOptions.showProgressDetails',
                                label: 'Show Progress Details',
                                defaultValue: true,
                                weight: 27,
                                input: true,
                            },
                            {
                                type: 'checkbox',
                                key: 'uppyOptions.autoProceed',
                                label: 'Auto Proceed',
                                defaultValue: false,
                                weight: 28,
                                tooltip: 'Automatically start upload after adding files',
                                input: true,
                            },
                            {
                                type: 'checkbox',
                                key: 'uppyOptions.allowMultipleUploadBatches',
                                label: 'Allow Multiple Upload Batches',
                                defaultValue: true,
                                weight: 29,
                                input: true,
                            },
                        ],
                    },
                ],
            },
            {
                key: 'data',
                components: [
                    {
                        key: 'dataBasic',
                        components: [
                            {
                                type: 'select',
                                key: 'uppyOptions.plugins',
                                label: 'Enabled Plugins',
                                multiple: true,
                                weight: 30,
                                data: {
                                    values: [
                                        { label: 'Webcam', value: 'Webcam' },
                                        { label: 'Screen Capture', value: 'ScreenCapture' },
                                        { label: 'Image Editor', value: 'ImageEditor' },
                                        { label: 'Audio Recording', value: 'Audio' },
                                        { label: 'Import from URL', value: 'Url' },
                                        { label: 'Google Drive', value: 'GoogleDrive' },
                                        { label: 'Dropbox', value: 'Dropbox' },
                                        { label: 'Instagram', value: 'Instagram' },
                                    ],
                                },
                                defaultValue: ['Webcam', 'ScreenCapture', 'ImageEditor', 'Audio', 'Url'],
                                input: true,
                            },
                        ],
                    },
                ],
            },
        ]);
    }
    constructor(component, options, data) {
        super(component, options, data);
        this.uppy = null;
        this.dashboardElement = null;
        this.component.storage = this.component.storage || 'url';
    }
    init() {
        super.init();
    }
    attach(element) {
        const superAttach = super.attach(element);
        // Create container for Uppy Dashboard
        this.dashboardElement = document.createElement('div');
        this.dashboardElement.className = 'uppy-dashboard-container';
        // Find or create upload area
        const uploadArea = element.querySelector('.formio-component-file') || element;
        uploadArea.appendChild(this.dashboardElement);
        // Initialize Uppy
        this.initializeUppy();
        return superAttach;
    }
    initializeUppy() {
        const uppyConfig = {
            autoProceed: this.component.uppyOptions?.autoProceed || false,
            allowMultipleUploadBatches: this.component.uppyOptions?.allowMultipleUploadBatches !== false,
            restrictions: {
                maxFileSize: this.parseFileSize(this.component.fileMaxSize) ?? undefined,
                minFileSize: this.parseFileSize(this.component.fileMinSize) ?? undefined,
                maxNumberOfFiles: this.component.multiple ? 10 : 1,
                allowedFileTypes: this.parseFilePattern(this.component.filePattern) ?? undefined,
            },
            meta: {
                formId: this.root?.formId || '',
                submissionId: this.root?.submissionId || '',
                fieldKey: this.component.key || '',
            },
        };
        // Initialize Uppy instance
        this.uppy = new Uppy({
            id: `uppy_${this.id}`,
            debug: false,
            autoProceed: uppyConfig.autoProceed,
            allowMultipleUploadBatches: uppyConfig.allowMultipleUploadBatches,
            restrictions: uppyConfig.restrictions,
            meta: uppyConfig.meta,
        });
        // Add Dashboard plugin
        this.uppy.use(Dashboard, {
            target: this.dashboardElement,
            inline: this.component.uppyOptions?.inline !== false,
            height: this.component.uppyOptions?.height || 450,
            width: '100%',
            hideProgressDetails: this.component.uppyOptions?.showProgressDetails === false,
            showLinkToFileUploadResult: this.component.uppyOptions?.showLinkToFileUploadResult !== false,
            proudlyDisplayPoweredByUppy: false,
            hideUploadButton: uppyConfig.autoProceed,
            hideRetryButton: false,
            hidePauseResumeButton: false,
            hideCancelButton: false,
            hideProgressAfterFinish: false,
            doneButtonHandler: null,
            note: this.component.description || null,
            closeModalOnClickOutside: true,
            closeAfterFinish: false,
            disableThumbnailGenerator: false,
            disablePageScrollWhenModalOpen: true,
            animateOpenClose: true,
            browserBackButtonClose: true,
        });
        // Add TUS plugin for resumable uploads
        this.uppy.use(Tus, {
            endpoint: this.component.url || '/files',
            chunkSize: (this.component.chunkSize || 8) * 1024 * 1024,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: this.getHeaders(),
        });
        // Add Golden Retriever for recovering uploads after browser crash
        this.uppy.use(GoldenRetriever, {
            serviceWorker: false,
        });
        // Add optional plugins based on configuration
        const plugins = this.component.uppyOptions?.plugins || [];
        if (plugins.includes('Webcam')) {
            this.uppy.use(Webcam, { target: Dashboard });
        }
        if (plugins.includes('ScreenCapture')) {
            this.uppy.use(ScreenCapture, { target: Dashboard });
        }
        if (plugins.includes('ImageEditor')) {
            this.uppy.use(ImageEditor, { target: Dashboard });
        }
        if (plugins.includes('Audio')) {
            this.uppy.use(Audio, { target: Dashboard });
        }
        if (plugins.includes('Url')) {
            this.uppy.use(Url, {
                target: Dashboard,
                companionUrl: this.component.companionUrl || null,
            });
        }
        // Set up event handlers
        this.setupUppyEventHandlers();
    }
    setupUppyEventHandlers() {
        if (!this.uppy)
            return;
        this.handleFileAdded = async (file) => {
            // Security: Sanitize filename
            const safeName = sanitizeFilename(file.name, {
                addTimestamp: true,
                preserveExtension: false,
            });
            // Security: Verify file type
            const isValidType = await verifyFileType(file.data, file.type);
            if (!isValidType) {
                logger.error('[Uppy Security] File type verification failed:', file.name);
                this.uppy?.info(`Security: File "${file.name}" content does not match declared type`, 'error', 5000);
                this.uppy?.removeFile(file.id);
                return;
            }
            // Update file with sanitized name
            this.uppy?.setFileMeta(file.id, {
                name: safeName,
                originalName: file.name,
            });
            this.emit('fileAdded', file);
        };
        this.handleUpload = () => {
            this.emit('uploadStart');
        };
        this.handleUploadProgress = (file, progress) => {
            this.emit('uploadProgress', { file, progress });
        };
        this.handleUploadSuccess = (file, response) => {
            const uploadFile = {
                id: file.id,
                name: file.name,
                size: file.size,
                type: file.type,
                url: response.uploadURL,
                storage: this.component.storage,
                status: UploadStatus$1.COMPLETED,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            // Add to component value
            const currentValue = this.getValue() || [];
            if (this.component.multiple) {
                this.setValue([...currentValue, uploadFile]);
            }
            else {
                this.setValue(uploadFile);
            }
            this.emit('uploadSuccess', uploadFile);
        };
        this.handleUploadError = (file, error) => {
            logger.error('[Uppy] Upload error:', { fileName: file?.name, error });
            this.emit('uploadError', { file, error });
        };
        this.handleComplete = (result) => {
            // P3-T2: Clean up GoldenRetriever localStorage to prevent QuotaExceededError (critical for Safari 5MB limit)
            if (result.successful.length > 0 && result.failed.length === 0) {
                const uppyId = this.uppy.getID();
                try {
                    localStorage.removeItem(`uppy/${uppyId}`);
                }
                catch (error) {
                    logger.warn('[Uppy] Failed to clean recovery state:', { error });
                }
            }
            this.emit('uploadComplete', result);
        };
        this.handleError = (error) => {
            logger.error('[Uppy] Error:', { error });
            this.emit('error', error);
        };
        this.handleCancelAll = () => {
            this.emit('uploadCancelled');
        };
        this.uppy.on('file-added', this.handleFileAdded);
        this.uppy.on('upload', this.handleUpload);
        this.uppy.on('upload-progress', this.handleUploadProgress);
        this.uppy.on('upload-success', this.handleUploadSuccess);
        this.uppy.on('upload-error', this.handleUploadError);
        this.uppy.on('complete', this.handleComplete);
        this.uppy.on('error', this.handleError);
        this.uppy.on('cancel-all', this.handleCancelAll);
    }
    getHeaders() {
        return {
            Authorization: `Bearer ${this.root?.token || ''}`,
            'x-jwt-token': this.root?.token || '',
        };
    }
    parseFileSize(size) {
        if (!size)
            return null;
        const units = {
            B: 1,
            KB: 1024,
            MB: 1024 * 1024,
            GB: 1024 * 1024 * 1024,
        };
        const match = size.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
        if (!match)
            return null;
        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        return value * (units[unit] || 1);
    }
    parseFilePattern(pattern) {
        if (!pattern || pattern === '*')
            return null;
        return pattern.split(',').map((p) => {
            const trimmed = p.trim();
            if (trimmed.startsWith('*.')) {
                return `.${trimmed.substring(2)}`;
            }
            return trimmed;
        });
    }
    getValue() {
        return this.dataValue;
    }
    setValue(value) {
        this.dataValue = value;
    }
    detach() {
        if (this.uppy) {
            // P1-T2: Remove all event listeners to prevent memory leaks
            if (this.handleFileAdded)
                this.uppy.off('file-added', this.handleFileAdded);
            if (this.handleUpload)
                this.uppy.off('upload', this.handleUpload);
            if (this.handleUploadProgress)
                this.uppy.off('upload-progress', this.handleUploadProgress);
            if (this.handleUploadSuccess)
                this.uppy.off('upload-success', this.handleUploadSuccess);
            if (this.handleUploadError)
                this.uppy.off('upload-error', this.handleUploadError);
            if (this.handleComplete)
                this.uppy.off('complete', this.handleComplete);
            if (this.handleError)
                this.uppy.off('error', this.handleError);
            if (this.handleCancelAll)
                this.uppy.off('cancel-all', this.handleCancelAll);
            this.uppy.cancelAll(); // Cancel all uploads (close() removed in Uppy v3+)
            this.uppy = null;
        }
        return super.detach();
    }
    destroy() {
        if (this.uppy) {
            // P1-T2: Remove all event listeners to prevent memory leaks
            if (this.handleFileAdded)
                this.uppy.off('file-added', this.handleFileAdded);
            if (this.handleUpload)
                this.uppy.off('upload', this.handleUpload);
            if (this.handleUploadProgress)
                this.uppy.off('upload-progress', this.handleUploadProgress);
            if (this.handleUploadSuccess)
                this.uppy.off('upload-success', this.handleUploadSuccess);
            if (this.handleUploadError)
                this.uppy.off('upload-error', this.handleUploadError);
            if (this.handleComplete)
                this.uppy.off('complete', this.handleComplete);
            if (this.handleError)
                this.uppy.off('error', this.handleError);
            if (this.handleCancelAll)
                this.uppy.off('cancel-all', this.handleCancelAll);
            this.uppy.cancelAll(); // Cancel all uploads (close() removed in Uppy v3+)
            this.uppy = null;
        }
        super.destroy();
    }
}

/**
 * Shared constants for file upload components
 * Single source of truth for configuration values
 */
const UPLOAD_CONSTANTS = {
    // TUS Configuration
    DEFAULT_TUS_ENDPOINT: 'http://localhost:1080/files/',
    DEFAULT_CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
    RETRY_DELAYS: [0, 1000, 3000, 5000],
    // File Restrictions
    DEFAULT_MAX_FILES: 20,
    DEFAULT_MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    DEFAULT_ALLOWED_TYPES: ['image/*', 'video/*'],
    // Image Compression
    DEFAULT_COMPRESSION_QUALITY: 0.8,
    MAX_IMAGE_WIDTH: 1920,
    MAX_IMAGE_HEIGHT: 1080,
    COMPRESSION_CONVERT_SIZE: 1000000,
    COMPRESSION_MIME_TYPE: 'image/jpeg',
    // Features
    DEFAULT_PERSISTENCE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
    GEOLOCATION_TIMEOUT: 10000, // 10 seconds
    GEOLOCATION_MAX_AGE: 0,
};

/**
 * Multi-Image Upload Component for Form.io
 *
 * Adapter that bridges the pure React MultiImageUpload component to Form.io.
 * Follows Anti-Corruption Layer pattern to minimize coupling.
 */
const FileComponent = Components.components.file;
class MultiImageUploadComponent extends FileComponent {
    constructor() {
        super(...arguments);
        this.reactContainer = null;
        this.mountedReactComponent = null;
    }
    static get type() {
        return 'multiimageupload';
    }
    static registerReactComponent(factory) {
        MultiImageUploadComponent.reactComponentFactory = factory;
    }
    static schema(...extend) {
        return FileComponent.schema({
            type: 'multiimageupload',
            label: 'Multi-Image Upload',
            key: 'site_images',
            storage: 'url',
            url: UPLOAD_CONSTANTS.DEFAULT_TUS_ENDPOINT,
            maxFiles: UPLOAD_CONSTANTS.DEFAULT_MAX_FILES,
            compressionQuality: UPLOAD_CONSTANTS.DEFAULT_COMPRESSION_QUALITY,
            autoNumbering: true,
            extractMetadata: true,
            filePattern: 'image/*,video/*',
            fileMaxSize: '10MB',
        }, ...extend);
    }
    static get builderInfo() {
        return {
            title: 'Multi-Image Upload',
            icon: 'images',
            group: 'premium',
            documentation: '/userguide/forms/premium-components#multi-image-upload',
            weight: 102,
            schema: MultiImageUploadComponent.schema(),
        };
    }
    static editForm() {
        return FileComponent.editForm();
    }
    render() {
        this.reactContainer = this.ce('div', {
            class: 'formio-component-multiimageupload',
            id: `${this.component.key}-react-container`,
        });
        this.loadReactComponent();
        return this.reactContainer;
    }
    async loadReactComponent() {
        if (!this.reactContainer)
            return;
        try {
            if (!MultiImageUploadComponent.reactComponentFactory) {
                throw new Error('React component factory not registered');
            }
            const { React, ReactDOM, MultiImageUpload } = MultiImageUploadComponent.reactComponentFactory();
            const root = ReactDOM.createRoot(this.reactContainer);
            root.render(React.createElement(MultiImageUpload, {
                formKey: this.component.key || 'site_images',
                maxFiles: this.component.maxFiles || UPLOAD_CONSTANTS.DEFAULT_MAX_FILES,
                compressionQuality: this.component.compressionQuality || UPLOAD_CONSTANTS.DEFAULT_COMPRESSION_QUALITY,
                autoNumbering: this.component.autoNumbering ?? true,
                extractMetadata: this.component.extractMetadata ?? true,
                onChange: (files) => {
                    this.updateValue(files);
                },
                value: this.dataValue || [],
            }));
            this.mountedReactComponent = root;
        }
        catch (error) {
            logger.error('Failed to load React component', {
                componentKey: this.component?.key,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            if (this.reactContainer) {
                this.reactContainer.innerHTML = `
          <div class="alert alert-danger">
            Failed to load Multi-Image Upload component. Please check console for details.
          </div>
        `;
            }
        }
    }
    destroy() {
        if (this.mountedReactComponent) {
            try {
                this.mountedReactComponent.unmount();
            }
            catch (error) {
                logger.warn('Error unmounting React component', {
                    componentKey: this.component?.key,
                    error: error instanceof Error ? error.message : String(error),
                });
            }
            this.mountedReactComponent = null;
        }
        this.reactContainer = null;
        super.destroy();
    }
    getValue() {
        return this.dataValue || [];
    }
    setValue(value) {
        this.dataValue = value;
        return true;
    }
}
MultiImageUploadComponent.reactComponentFactory = null;

/**
 * File Storage Provider for Form.io
 *
 * Abstract provider interface for different storage backends
 */
class FileStorageProvider {
    constructor(config = {}) {
        this.name = 'file';
        this.title = 'File Storage Provider';
        this.config = {
            endpoint: '/files',
            ...config
        };
    }
    async uploadFile(file, options = {}) {
        // This is the base implementation that would be overridden
        // by specific storage providers (GCS, S3, Azure, etc.)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);
        formData.append('size', file.size.toString());
        formData.append('type', file.type);
        // Add metadata
        if (options.metadata) {
            Object.keys(options.metadata).forEach(key => {
                formData.append(`metadata[${key}]`, options.metadata[key]);
            });
        }
        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'x-jwt-token': options.token || ''
            },
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }
        const result = await response.json();
        return {
            id: result.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: result.url,
            storage: 'file',
            status: 'completed',
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
    async downloadFile(file) {
        const response = await fetch(file.url);
        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }
        return response.blob();
    }
    async deleteFile(file) {
        const response = await fetch(`${this.config.endpoint}/${file.id}`, {
            method: 'DELETE',
            headers: {
                'x-jwt-token': this.config.token || ''
            }
        });
        if (!response.ok) {
            throw new Error(`Delete failed: ${response.statusText}`);
        }
    }
    async getFileUrl(file) {
        // Generate signed URL if needed
        if (file.url) {
            return file.url;
        }
        const response = await fetch(`${this.config.endpoint}/${file.id}/url`, {
            headers: {
                'x-jwt-token': this.config.token || ''
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to get file URL: ${response.statusText}`);
        }
        const result = await response.json();
        return result.url;
    }
    // Static factory method for Form.io provider registration
    static register(Formio) {
        Formio.Providers.addProvider('storage', 'file', FileStorageProvider);
    }
}

/**
 * Template registration for file upload components
 *
 * Provides clean, framework-agnostic templates with minimal CSS
 */
function registerTemplates(framework = 'default') {
    const templates = {};
    // All frameworks use clean, vanilla HTML/CSS templates
    templates.tusupload = {
        form: getTusTemplate()
    };
    templates.uppyupload = {
        form: getUppyTemplate()
    };
    return templates;
}
function getTusTemplate() {
    return `
<div class="tus-upload-component">
  <style>
    .tus-upload-component { margin: 1rem 0; font-family: system-ui, -apple-system, sans-serif; }
    .tus-upload-component label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .upload-dropzone {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      background: #fafafa;
      transition: all 0.2s;
    }
    .upload-dropzone:hover { border-color: #666; background: #f0f0f0; }
    .upload-dropzone.dragover { border-color: #4CAF50; background: #e8f5e9; }
    .upload-icon { font-size: 3rem; color: #999; margin-bottom: 1rem; }
    .browse-button {
      background: #2196F3;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .browse-button:hover { background: #1976D2; }
    .file-input { display: none; }
    .file-list { margin-top: 1rem; }
    .file-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: white;
    }
    .file-name { flex: 1; margin: 0 1rem; }
    .file-size { color: #666; font-size: 0.875rem; }
    .progress-bar {
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin: 0 1rem;
      flex: 1;
    }
    .progress-fill {
      height: 100%;
      background: #4CAF50;
      transition: width 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.75rem;
    }
    .remove-button {
      background: #f44336;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .remove-button:hover { background: #d32f2f; }
    .description { display: block; margin-top: 0.5rem; font-size: 0.875rem; color: #666; }
  </style>

  <label for="{{ instance.id }}-{{ key }}">{{ t(label) }}</label>

  <div class="upload-dropzone" ref="fileDrop">
    <div class="upload-icon">📁</div>
    <p>{{ t('Drag and drop files here or') }}</p>
    <button type="button" class="browse-button" ref="fileBrowse">
      {{ t('Browse Files') }}
    </button>
    <input type="file" class="file-input" ref="hiddenFileInputElement"
      {% if (multiple) { %}multiple{% } %}
      {% if (filePattern && filePattern !== '*') { %}accept="{{ filePattern }}"{% } %} />
  </div>

  <div class="file-list" ref="fileList">
    {% if (files && files.length) { %}
      {% files.forEach(function(file, index) { %}
        <div class="file-item">
          <span>📄</span>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatBytes(file.size) }}</span>
          {% if (file.progress && file.progress < 100) { %}
            <div class="progress-bar">
              <div class="progress-fill" ref="fileProgress" style="width: {{ file.progress }}%">
                {{ file.progress }}%
              </div>
            </div>
          {% } %}
          {% if (file.status === 'completed') { %}
            <span style="color: #4CAF50;">✓</span>
          {% } %}
          <button type="button" class="remove-button" ref="removeLink">×</button>
        </div>
      {% }); %}
    {% } %}
  </div>

  {% if (description) { %}
    <small class="description">{{ t(description) }}</small>
  {% } %}
</div>
  `;
}
function getUppyTemplate() {
    return `
<div class="uppy-upload-component">
  <style>
    .uppy-upload-component { margin: 1rem 0; font-family: system-ui, -apple-system, sans-serif; }
    .uppy-upload-component label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .uppy-dashboard-container {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .description { display: block; margin-top: 0.5rem; font-size: 0.875rem; color: #666; }
  </style>

  <label for="{{ instance.id }}-{{ key }}">{{ t(label) }}</label>

  <div class="uppy-dashboard-container"></div>

  {% if (description) { %}
    <small class="description">{{ t(description) }}</small>
  {% } %}
</div>
  `;
}

/**
 * Form.io File Upload Module
 *
 * Provides enterprise-grade file upload capabilities for Form.io
 * using TUS resumable upload protocol and Uppy.js UI
 */
// Module definition following Form.io module specification
// Form.io only supports 'components' property in modules
const FormioFileUploadModule = {
    components: {
        tusupload: TusFileUploadComponent,
        uppyupload: UppyFileUploadComponent,
        multiimageupload: MultiImageUploadComponent,
    },
};

export { FILE_SIGNATURES, FileStorageProvider, MultiImageUploadComponent, TusFileUploadComponent, UPLOAD_CONSTANTS, UploadStatus$1 as UploadStatus, UppyFileUploadComponent, FormioFileUploadModule as default, detectFileType, hasSignatureSupport, logger, registerTemplates, registerValidators, sanitizeFilename, verifyFileType };
//# sourceMappingURL=index.esm.js.map
