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
