大智慧云平台token前端管理模块
---
可以在前端根据appid和secret_key生成token

提供webpack插件，将明文的appid和secret_key在打包时加密

编码方式，将指定的关键字转换hex后拼上short_id从左开始拼接成2位字符，将appid和key的hex分别按位加上关键字转换hex数值取两位字符，然后生成的hex按3位一个转成字符得到转换后的字符串

### 使用
1、global

    <script src="dist/dzhyun-token.min.js"></script>
    <script>
      var tokenManager = new DzhyunTokenManager({appid: 'xxxxxx', secret_key: 'xxxxxx', shortid: 'xxxxxx'});
      tokenManager.getToken(86400).then(function(token) {
        ...
      });
    </script>

2、模块化

安装

    npm install dzhyun-token
    
使用

    import DzhyunTokenManager from 'dzhyun-token';
    ...

### API
new DzhyunTokenManager({address: 'xxxxxx', appid: 'xxxxxx', secret_key: 'xxxxxx', shortid: 'xxxxxx'})
- **address** `String` 可选，无法本地生成token时改为向远程地址请求token，需要依赖dzhyun-connection模块
- **appid** `String` 必填
- **secret_key** `String` 必填
- **shortid** `String` 必填

DzhyunTokenManager.prototype.getToken(duration) 得到token, 返回Promise对象，会缓存生成的token
- **duration** `Number` 可选，生成token的有效期秒数，默认不传时默认1天有效期

DzhyunTokenManager.prototype.generateToken(duration) 生成新的token, 返回Promise对象
- **duration** `Number` 可选，生成token的有效期秒数，默认不传时默认1天有效期

### webpack插件使用

    const DzhyunTokenManagerPlugin = require('dzhyun-token/plugin');

    plugins: [
        ...
        new DzhyunTokenManagerPlugin({ useFake: true, keyword: 'abcdef' })
    ],

参数说明
- **useFake** `Boolean` 可选，是否填充伪造假的appid信息
- **keyword** `String` 可选，指定加密混浊用关键字，默认使用随机字符每次编译混浊后的编码会不同，指定了关键字能保证每次编译后混浊后编码相同
