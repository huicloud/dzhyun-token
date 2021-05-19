module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
(function(G){function r(d,b,c){var h=0,a=[],f=0,g,m,k,e,l,p,q,t,w=!1,n=[],u=[],v,r=!1;c=c||{};g=c.encoding||"UTF8";v=c.numRounds||1;if(v!==parseInt(v,10)||1>v)throw Error("numRounds must a integer >= 1");if("SHA-1"===d)l=512,p=z,q=H,e=160,t=function(a){return a.slice()};else throw Error("Chosen SHA variant is not supported");k=A(b,g);m=x(d);this.setHMACKey=function(a,f,b){var c;if(!0===w)throw Error("HMAC key already set");if(!0===r)throw Error("Cannot set HMAC key after calling update");
g=(b||{}).encoding||"UTF8";f=A(f,g)(a);a=f.binLen;f=f.value;c=l>>>3;b=c/4-1;if(c<a/8){for(f=q(f,a,0,x(d),e);f.length<=b;)f.push(0);f[b]&=4294967040}else if(c>a/8){for(;f.length<=b;)f.push(0);f[b]&=4294967040}for(a=0;a<=b;a+=1)n[a]=f[a]^909522486,u[a]=f[a]^1549556828;m=p(n,m);h=l;w=!0};this.update=function(b){var e,g,c,d=0,q=l>>>5;e=k(b,a,f);b=e.binLen;g=e.value;e=b>>>5;for(c=0;c<e;c+=q)d+l<=b&&(m=p(g.slice(c,c+q),m),d+=l);h+=d;a=g.slice(d>>>5);f=b%l;r=!0};this.getHash=function(b,g){var c,k,l,p;if(!0===
w)throw Error("Cannot call getHash after setting HMAC key");l=B(g);switch(b){case "HEX":c=function(a){return C(a,e,l)};break;case "B64":c=function(a){return D(a,e,l)};break;case "BYTES":c=function(a){return E(a,e)};break;case "ARRAYBUFFER":try{k=new ArrayBuffer(0)}catch(I){throw Error("ARRAYBUFFER not supported by this environment");}c=function(a){return F(a,e)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");}p=q(a.slice(),f,h,t(m),e);for(k=1;k<v;k+=1)p=q(p,e,0,x(d),e);
return c(p)};this.getHMAC=function(b,g){var c,k,n,r;if(!1===w)throw Error("Cannot call getHMAC without first setting HMAC key");n=B(g);switch(b){case "HEX":c=function(a){return C(a,e,n)};break;case "B64":c=function(a){return D(a,e,n)};break;case "BYTES":c=function(a){return E(a,e)};break;case "ARRAYBUFFER":try{c=new ArrayBuffer(0)}catch(I){throw Error("ARRAYBUFFER not supported by this environment");}c=function(a){return F(a,e)};break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
}k=q(a.slice(),f,h,t(m),e);r=p(u,x(d));r=q(k,e,l,r,e);return c(r)}}function C(d,b,c){var h="";b/=8;var a,f;for(a=0;a<b;a+=1)f=d[a>>>2]>>>8*(3+a%4*-1),h+="0123456789abcdef".charAt(f>>>4&15)+"0123456789abcdef".charAt(f&15);return c.outputUpper?h.toUpperCase():h}function D(d,b,c){var h="",a=b/8,f,g,m;for(f=0;f<a;f+=3)for(g=f+1<a?d[f+1>>>2]:0,m=f+2<a?d[f+2>>>2]:0,m=(d[f>>>2]>>>8*(3+f%4*-1)&255)<<16|(g>>>8*(3+(f+1)%4*-1)&255)<<8|m>>>8*(3+(f+2)%4*-1)&255,g=0;4>g;g+=1)8*f+6*g<=b?h+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m>>>
6*(3-g)&63):h+=c.b64Pad;return h}function E(d,b){var c="",h=b/8,a,f;for(a=0;a<h;a+=1)f=d[a>>>2]>>>8*(3+a%4*-1)&255,c+=String.fromCharCode(f);return c}function F(d,b){var c=b/8,h,a=new ArrayBuffer(c),f;f=new Uint8Array(a);for(h=0;h<c;h+=1)f[h]=d[h>>>2]>>>8*(3+h%4*-1)&255;return a}function B(d){var b={outputUpper:!1,b64Pad:"=",shakeLen:-1};d=d||{};b.outputUpper=d.outputUpper||!1;!0===d.hasOwnProperty("b64Pad")&&(b.b64Pad=d.b64Pad);if("boolean"!==typeof b.outputUpper)throw Error("Invalid outputUpper formatting option");
if("string"!==typeof b.b64Pad)throw Error("Invalid b64Pad formatting option");return b}function A(d,b){var c;switch(b){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(d){case "HEX":c=function(b,a,f){var g=b.length,c,d,e,l,p;if(0!==g%2)throw Error("String of HEX type must be in byte increments");a=a||[0];f=f||0;p=f>>>3;for(c=0;c<g;c+=2){d=parseInt(b.substr(c,2),16);if(isNaN(d))throw Error("String of HEX type contains invalid characters");
l=(c>>>1)+p;for(e=l>>>2;a.length<=e;)a.push(0);a[e]|=d<<8*(3+l%4*-1)}return{value:a,binLen:4*g+f}};break;case "TEXT":c=function(c,a,f){var g,d,k=0,e,l,p,q,t,n;a=a||[0];f=f||0;p=f>>>3;if("UTF8"===b)for(n=3,e=0;e<c.length;e+=1)for(g=c.charCodeAt(e),d=[],128>g?d.push(g):2048>g?(d.push(192|g>>>6),d.push(128|g&63)):55296>g||57344<=g?d.push(224|g>>>12,128|g>>>6&63,128|g&63):(e+=1,g=65536+((g&1023)<<10|c.charCodeAt(e)&1023),d.push(240|g>>>18,128|g>>>12&63,128|g>>>6&63,128|g&63)),l=0;l<d.length;l+=1){t=k+
p;for(q=t>>>2;a.length<=q;)a.push(0);a[q]|=d[l]<<8*(n+t%4*-1);k+=1}else if("UTF16BE"===b||"UTF16LE"===b)for(n=2,d="UTF16LE"===b&&!0||"UTF16LE"!==b&&!1,e=0;e<c.length;e+=1){g=c.charCodeAt(e);!0===d&&(l=g&255,g=l<<8|g>>>8);t=k+p;for(q=t>>>2;a.length<=q;)a.push(0);a[q]|=g<<8*(n+t%4*-1);k+=2}return{value:a,binLen:8*k+f}};break;case "B64":c=function(b,a,f){var c=0,d,k,e,l,p,q,n;if(-1===b.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");k=b.indexOf("=");b=b.replace(/\=/g,
"");if(-1!==k&&k<b.length)throw Error("Invalid '=' found in base-64 string");a=a||[0];f=f||0;q=f>>>3;for(k=0;k<b.length;k+=4){p=b.substr(k,4);for(e=l=0;e<p.length;e+=1)d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(p[e]),l|=d<<18-6*e;for(e=0;e<p.length-1;e+=1){n=c+q;for(d=n>>>2;a.length<=d;)a.push(0);a[d]|=(l>>>16-8*e&255)<<8*(3+n%4*-1);c+=1}}return{value:a,binLen:8*c+f}};break;case "BYTES":c=function(b,a,c){var d,m,k,e,l;a=a||[0];c=c||0;k=c>>>3;for(m=0;m<b.length;m+=
1)d=b.charCodeAt(m),l=m+k,e=l>>>2,a.length<=e&&a.push(0),a[e]|=d<<8*(3+l%4*-1);return{value:a,binLen:8*b.length+c}};break;case "ARRAYBUFFER":try{c=new ArrayBuffer(0)}catch(h){throw Error("ARRAYBUFFER not supported by this environment");}c=function(b,a,c){var d,m,k,e,l;a=a||[0];c=c||0;m=c>>>3;l=new Uint8Array(b);for(d=0;d<b.byteLength;d+=1)e=d+m,k=e>>>2,a.length<=k&&a.push(0),a[k]|=l[d]<<8*(3+e%4*-1);return{value:a,binLen:8*b.byteLength+c}};break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
}return c}function n(d,b){return d<<b|d>>>32-b}function u(d,b){var c=(d&65535)+(b&65535);return((d>>>16)+(b>>>16)+(c>>>16)&65535)<<16|c&65535}function y(d,b,c,h,a){var f=(d&65535)+(b&65535)+(c&65535)+(h&65535)+(a&65535);return((d>>>16)+(b>>>16)+(c>>>16)+(h>>>16)+(a>>>16)+(f>>>16)&65535)<<16|f&65535}function x(d){var b=[];if("SHA-1"===d)b=[1732584193,4023233417,2562383102,271733878,3285377520];else throw Error("No SHA variants supported");return b}function z(d,b){var c=[],h,a,f,g,m,k,e;h=b[0];a=b[1];
f=b[2];g=b[3];m=b[4];for(e=0;80>e;e+=1)c[e]=16>e?d[e]:n(c[e-3]^c[e-8]^c[e-14]^c[e-16],1),k=20>e?y(n(h,5),a&f^~a&g,m,1518500249,c[e]):40>e?y(n(h,5),a^f^g,m,1859775393,c[e]):60>e?y(n(h,5),a&f^a&g^f&g,m,2400959708,c[e]):y(n(h,5),a^f^g,m,3395469782,c[e]),m=g,g=f,f=n(a,30),a=h,h=k;b[0]=u(h,b[0]);b[1]=u(a,b[1]);b[2]=u(f,b[2]);b[3]=u(g,b[3]);b[4]=u(m,b[4]);return b}function H(d,b,c,h){var a;for(a=(b+65>>>9<<4)+15;d.length<=a;)d.push(0);d[b>>>5]|=128<<24-b%32;b+=c;d[a]=b&4294967295;d[a-1]=b/4294967296|0;
b=d.length;for(a=0;a<b;a+=16)h=z(d.slice(a,a+16),h);return h} true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return r}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=r),exports=r):G.jsSHA=r})(this);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sha = __webpack_require__(0);

var _sha2 = _interopRequireDefault(_sha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oneDayDuration = 24 * 60 * 60;
module.exports = function () {
  function DzhyunTokenManager(_ref) {
    var index = _ref.index;

    _classCallCheck(this, DzhyunTokenManager);

    var mask = masks[index || 0];
    if (mask) {
      var code = Array.apply(undefined, _toConsumableArray(Array(mask.length))).map(function (undef, i) {
        return mask.charCodeAt(i).toString(16).substring(1);
      }).join('');
      var bytes = Array.apply(undefined, _toConsumableArray(Array(parseInt(code.length - 24) / 2))).reduce(function (rs, undef, i) {
        var byte = parseInt(code.substring(i * 2 + 24, i * 2 + 26), 16) - rs[i % 8];
        rs.push(byte > 0 ? byte : byte + 0xFF);
        return rs;
      }, Array.apply(undefined, _toConsumableArray(Array(8))).reduce(function (rs, undef, i) {
        rs.splice(i, 0, parseInt(code.substring(i * 3 + 1, i * 3 + 3), 16));
        rs.push(code.charCodeAt(i * 3));
        return rs;
      }, []));
      this.generateToken = this.generateToken.bind(this, bytes);
    }
  }

  _createClass(DzhyunTokenManager, [{
    key: 'getToken',
    value: function getToken() {
      var _this = this;

      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : oneDayDuration;

      if (!this._promise) {

        // 先判断如果有缓存的token，否则先尝试本地生成，失败则再尝试请求远程接口
        this._promise = Promise.resolve(this.getCacheToken()).catch(function () {
          return _this.generateToken(duration);
        }).then(function (token) {
          _this._promise = null;
          _this._token = token;
          return token;
        });
      }
      return this._promise;
    }
  }, {
    key: 'generateToken',
    value: function generateToken(bytes) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : oneDayDuration;

      if (typeof bytes === 'undefined') {
        return Promise.reject('缺少信息，无法生成token');
      }
      return new Promise(function (resolve) {
        var expiredTime = parseInt(Date.now() / 1000, 10) + duration + '';
        var shaObj = new _sha2.default('SHA-1', 'HEX');
        shaObj.setHMACKey(bytes.slice(48).map(function (byte) {
          return byte.toString(16);
        }).join(''), 'HEX');
        bytes.slice(16, 48).forEach(function (byte) {
          return shaObj.update(byte.toString(16));
        });
        shaObj.update('5F');
        Array.apply(undefined, _toConsumableArray(Array(expiredTime.length))).forEach(function (undef, index) {
          return shaObj.update(expiredTime.charCodeAt(index).toString(16));
        });
        shaObj.update('5F');
        bytes.slice(48).forEach(function (byte) {
          return shaObj.update(byte.toString(16));
        });
        var hexMask = shaObj.getHMAC('HEX');
        var token = [String.fromCharCode.apply(String, _toConsumableArray(bytes.slice(8, 16))), expiredTime, hexMask].join(':');
        resolve(token);
      });
    }
  }, {
    key: 'getCacheToken',
    value: function getCacheToken() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2._token) {

          // 判断保留的token是否过期
          var expireTime = _this2._token.split(':')[1] + '000';
          if (parseInt(expireTime, 10) > Date.now()) {
            return resolve(_this2._token);
          }
        }
        return reject();
      });
    }
  }]);

  return DzhyunTokenManager;
}();

/***/ })
/******/ ]);
//# sourceMappingURL=dzhyun-token-mask.js.map