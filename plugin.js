const path = require('path');
const fs = require('fs');
const ParserHelpers = require('webpack/lib/ParserHelpers');
const babel = require('babel-core');

function encode(id, key, sid, keyword) {
  const kw = [];
  let mask = '';
  let k;
  for (let i = 0; i < sid.length; i += 1) {
    k = keyword ? keyword.charCodeAt(i % keyword.length) % 0xFF :
      parseInt(Math.random() * 0xFF, 10);
    kw.push(k);
    mask += (sid[i] + `0${k.toString(16)}`.slice(-2));
  }
  const l = kw.length;
  for (let i = 0; i < id.length; i += 1) {
    k = kw[i % l];
    mask += `0${((id.charCodeAt(i) + k) % 0xFF).toString(16)}`.slice(-2);
  }
  for (let i = 0; i < key.length; i += 1) {
    k = kw[i % l];
    mask += `0${((key.charCodeAt(i) + k) % 0xFF).toString(16)}`.slice(-2);
  }
  const splitArr = mask.match(/.{3}/g);
  splitArr.push(mask.substring(splitArr.join('').length));
  return splitArr.map(eachData => String.fromCharCode(parseInt(`3${eachData}`, 16))).join('');
}

const fileContext = babel.transform(`
import JSSHA from 'jssha/src/sha1';
const oneDayDuration = 24 * 60 * 60;
module.exports = class DzhyunTokenManager {
  constructor({ index }) {
    const mask = masks[index || 0];
    if (mask) {
      const code = (Array(...Array(mask.length))).map((undef, i) => mask.charCodeAt(i).toString(16).substring(1)).join('');
      const bytes = Array(...Array(parseInt(code.length - 24) / 2)).reduce((rs, undef, i) => {
        const byte = parseInt(code.substring((i * 2) + 24, (i * 2) + 26), 16) - rs[i % 8];
        rs.push(byte > 0 ? byte : (byte + 0xFF));
        return rs;
      }, Array(...Array(8)).reduce((rs, undef, i) => {
        rs.splice(i, 0, parseInt(code.substring((i * 3) + 1, (i * 3) + 3), 16));
        rs.push(code.charCodeAt(i * 3));
        return rs;
      }, []));
      this.generateToken = this.generateToken.bind(this, bytes);
    }
  }
  getToken(duration = oneDayDuration) {
    if (!this._promise) {

      // 先判断如果有缓存的token，否则先尝试本地生成，失败则再尝试请求远程接口
      this._promise = Promise.resolve(this.getCacheToken())
      .catch(() => this.generateToken(duration))
      .then((token) => {
        this._promise = null;
        this._token = token;
        return token;
      });
    }
    return this._promise;
  }
  generateToken(bytes, duration = oneDayDuration) {
    if (typeof bytes === 'undefined') {
      return Promise.reject('缺少信息，无法生成token');
    }
    return new Promise((resolve) => {
      const expiredTime = parseInt(Date.now() / 1000, 10) + duration + '';
      const shaObj = new JSSHA('SHA-1', 'HEX');
      shaObj.setHMACKey(bytes.slice(48).map(byte => byte.toString(16)).join(''), 'HEX');
      bytes.slice(16, 48).forEach(byte => shaObj.update(byte.toString(16)));
      shaObj.update('5F');
      Array(...Array(expiredTime.length)).forEach((undef, index) => shaObj.update(expiredTime.charCodeAt(index).toString(16)));
      shaObj.update('5F');
      bytes.slice(48).forEach(byte => shaObj.update(byte.toString(16)));
      const hexMask = shaObj.getHMAC('HEX');
      const token = [String.fromCharCode(...bytes.slice(8, 16)), expiredTime, hexMask].join(':');
      resolve(token);
    });
  }
  getCacheToken() {
    return new Promise((resolve, reject) => {
      if (this._token) {

        // 判断保留的token是否过期
        const expireTime = this._token.split(':')[1] + '000';
        if (parseInt(expireTime, 10) > Date.now()) {
          return resolve(this._token);
        }
      }
      return reject();
    });
  }
};
`, { presets: ["es2015", "stage-2"] }).code;

class DzhyunTokenManagerPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    const masks = [];
    compiler.plugin('compilation', (compilation, data) => {
      data.normalModuleFactory.plugin('parser', (parser) => {
        const that = this;

        // 扩展walkObjectExpression方法，筛选出appinfo信息编码后替换掉
        parser.walkObjectExpression = (function(origFun) {
          return function(expression) {
            if (expression.properties && !expression.handled) {
              const properties = {};
              expression.properties.forEach((prop) => {
                if (prop && prop.value) {
                  if (prop.value.type === 'Literal') {
                    properties[prop.key.name] = prop.value.value;
                  } else if (prop.value.type.indexOf('Expression') >= 0) {
                    parser.evaluateExpression(prop.value);
                  }
                }
              });
              if (properties.appid && properties.secret_key && properties.shortid) {
                const mask = encode(properties.appid, properties.secret_key, properties.shortid,
                  that.options.keyword);
                let appInfo = {};

                // 填充fake信息
                if (that.options.useFake) {
                  appInfo = DzhyunTokenManagerPlugin.getFakeAppInfo(properties.shortid);
                }
                if (masks.length > 0) {
                  appInfo.index = masks.length;
                }
                masks.push(mask);
                if (ParserHelpers.toConstantDependency.length > 1) {
                  ParserHelpers.toConstantDependency(parser, JSON.stringify(appInfo))(expression);
                } else {
                  ParserHelpers.toConstantDependency(JSON.stringify(appInfo)).bind(parser)(expression);
                }
                expression.handled = true;
              }
            }
            origFun.call(this, expression);
          };
        })(parser.walkObjectExpression);

        // parser.plugin('program', () => {
        //   if (masks.length > 0 && /(?:DzhyunTokenManager\.js|dzhyun-token\.js)/.test(parser.state.current.request)) {
        //     ParserHelpers.addParsedVariableToModule(parser, 'masks', JSON.stringify(masks));
        //   }
        // });
      });

      data.normalModuleFactory.plugin('after-resolve', (result, callback) => {
        if (/(?:DzhyunTokenManager\.js|dzhyun-token\.js)/.test(result.resource)) {
          const tempFile = path.resolve(__dirname, '.tmp.js');

          // 生成临时文件
          fs.writeFileSync(tempFile, fileContext);

          // 修改依赖到临时文件
          // eslint-disable-next-line no-param-reassign
          result.resource = tempFile;

          // 编译完成删除临时文件（避免webpack监听编译时找不到文件的问题，改成退出进程时删除文件）
          process.on('exit', () => fs.existsSync(tempFile) && fs.unlinkSync(tempFile));
          // compiler.plugin('done', () => fs.existsSync(tempFile) && fs.unlinkSync(tempFile));
        }
        callback(null, result);
      });

      compilation.plugin('optimize-modules', (modules) => {
        modules.forEach((module) => {
          if (/(?:DzhyunTokenManager\.js|dzhyun-token\.js)/.test(module.request)) {
            module.addVariable('masks', JSON.stringify(masks), []);
          }
        })
      });
    });
  }

  static getFakeAppInfo(sid) {
    const id = Array(...Array(32)).map(() => parseInt(Math.random() * 16, 10).toString(16)).join('');
    const key = Array(...Array(12)).map(() => String.fromCharCode(parseInt(Math.random() * 26, 10) + 65)).join('');
    return { appid: id, secret_key: key, shortid: sid };
  }
}
module.exports = DzhyunTokenManagerPlugin;
