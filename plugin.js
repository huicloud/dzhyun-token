const path = require('path');
const fs = require('fs');
const ParserHelpers = require('webpack/lib/ParserHelpers');

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
          // const tempFile = path.resolve(__dirname, '.tmp.js');

          // // 生成临时文件
          // fs.writeFileSync(tempFile, fileContext);

          // // 修改依赖到临时文件
          // // eslint-disable-next-line no-param-reassign
          // result.resource = tempFile;

          // 编译完成删除临时文件（避免webpack监听编译时找不到文件的问题，改成退出进程时删除文件）
          // process.on('exit', () => fs.existsSync(tempFile) && fs.unlinkSync(tempFile));

          // 修改依赖到mask文件
          result.resource = path.resolve(__dirname, 'dist/dzhyun-token-mask.js');
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
