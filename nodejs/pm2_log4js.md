### 再说打日志你不会，pm2 + log4js，你值得拥有……

最近接了个新需求，让在服务器通过Nodejs去打日志文件，捕捉请求日志。。。<br>
然后我就想到了log4js……

废话不多说，上代码

## 安装log4js
    npm install log4js --save
    
对log4js不熟的查看文档 [log4js](https://www.npmjs.com/package/log4js);
### 在config文件夹下新建log_config.js文件：
```
var log4js = require("log4js");
var path = require("path");
var fs = require("fs");
var basePath = path.resolve(__dirname, "../logs");

var errorPath = basePath + "/errors/";
var resPath = basePath + "/responses/";

var errorFilename = errorPath + "/error";
var resFilename = resPath + "/response";

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
var confirmPath = function(pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr);
    console.log("createPath: " + pathStr);
  }
};
log4js.configure({
  appenders: {
    errorLog: {
      type: "dateFile", //日志类型
      filename: errorFilename, //日志输出位置
      alwaysIncludePattern: true, //是否总是有后缀名
      pattern: "-yyyy-MM-dd.log" //后缀，每小时创建一个新的日志文件
    },
    responseLog: {
      type: "dateFile",
      filename: resFilename,
      alwaysIncludePattern: true,
      pattern: "-yyyy-MM-dd.log"
    }
  },
  categories: {
    errorLog: { appenders: ['errorLog'], level: 'error' },
    responseLog: { appenders: ["responseLog"], level: "info" },
    default: { appenders: ['responseLog','errorLog',], level: 'trace' }
  },
  // pm2: true,
  // pm2InstanceVar: 'INSTANCE_ID',
  disableClustering: true
});
//创建log的根目录'logs'
if (basePath) {
  confirmPath(basePath);
  //根据不同的logType创建不同的文件目录
  confirmPath(errorPath);
  confirmPath(resPath);
}

module.exports = log4js;

```
这段代码中有解释，照着官方文档配置就行；

### 在config文件夹下新建log.js文件：
```
var log4js = require("./log_config");

var errorLog = log4js.getLogger("errorLog"); //此处使用category的值
var resLog = log4js.getLogger("responseLog"); //此处使用category的值

var log = {};
log.i = function(req, resTime) {
  if (req) {
    resLog.info(formatRes(req, resTime));
  }
};

log.e = function(ctx, error, resTime) {
  if (ctx && error) {
    errorLog.error(formatError(ctx, error, resTime));
  }
};

//格式化请求日志
var formatReqLog = function(req, resTime) {

  let getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
  };
  let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);

  var logText = new String();
  //访问方法
  var method = req.method;
  logText += "request method: " + method + "\n";
  //请求原始地址

  logText += "request originalUrl:  " + req.originalUrl + "\n";
  //客户端ip
  logText += "request client ip:  " + ip + "\n";
  
  //请求参数
  if (method === "GET") {
    logText += "request query:  " + JSON.stringify(req.query) + "\n";
  } else {
    logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
  }

  //服务器响应时间
  logText += "response time: " + resTime + "\n";

  return logText;
};

//格式化响应日志
var formatRes = function(res, resTime) {
  var logText = new String();
  //响应日志开始
  logText += "\n" + "*************** response log start ***************" + "\n";

  //添加请求日志
  logText += formatReqLog(res, resTime);

  //响应状态码
  logText += "response status: " + res.res.statusCode + "\n";

  //响应内容
  logText += "response body: " + "\n" + JSON.stringify(res.body) + "\n";

  //响应日志结束
  logText += "*************** response log end ***************" + "\n";

  return logText;
};

//格式化错误日志
var formatError = function(ctx, err, resTime) {
  var logText = new String();

  //错误信息开始
  logText += "\n" + "*************** error log start ***************" + "\n";

  //添加请求日志
  logText += formatReqLog(ctx, resTime);

  //错误名称

  logText += "err name: " + err.name + "\n";
  //错误信息

  logText += "err message: " + err.message + "\n";
  //错误详情

  logText += "err stack: " + err.stack + "\n";

  //错误信息结束
  logText += "*************** error log end ***************" + "\n";

  return logText;
};

module.exports = log;
```
这里边就是写个三个函数，
1. 格式化请求日志  formatReqLog；
2. 格式化响应日志  formatRes；
3. 格式化错误日志  formatError；
 

### 在app.js中配置使用
```
const log = require("./config/log");
// logger
app.all("*", async (req, res, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  ms = new Date() - start;
  try {
    //开始进入到下一个中间件
    await next();
    //记录响应日志
    log.i(req, ms);
  } catch (error) {
    //记录异常日志
    log.e(req, error, ms);
  }
  console.log(`${req.method} ${req.url} - ${ms}ms-${res.statusCode}`);
});

```

代码没啥可讲的，照着使用就行，这里我来谈谈踩过的坑吧

## 故障1： pm2 + log4js启动项目时候报错
Nodejs application Error: bind EADDRINUSE when use pm2 deploy
    
    sudo lsof -i -P | grep 3000
    
 [解决该问题戳这里](https://stackoverflow.com/questions/18687877/nodejs-application-error-bind-eaddrinuse-when-use-pm2-deploy)；
 
 ## 故障2： log4js搭配pm2集群异常日志<br>
 参考如下链接：[log4js搭配pm2集群异常日志的解决方案](https://log4js-node.github.io/log4js-node/clustering.html)<br>
 
 这是pm2在cluster模式下启动，导致log4js不正常输出日志，有两种解决方案吗，
 1. 只需要在log_config.js里添加如下命令就行
 ```
 disableClustering: true
 ```
 2. 
  i. 安装pm2的`pm2-intercom`进程间通信模块<br>
  ii. 然后需要在log_config.js里添加如下命令就行
 ```
 pm2: true,
 pm2InstanceVar: 'INSTANCE_ID'
 ```
 iii. pm2.json 如下
 ```
 { "apps": [
    { "name": "testing",
      "script": "pm2.js",
      "instances": 0,
      "instance_var": "INSTANCE_ID", // 添加这一行
      "exec_mode": "cluster"
      }
    ]
}
 ```
两种解决方法的区别是：(摘自log4js作者的原话,能得到他的帮助，我特开心😊)
```
 you don’t need `disableClustering` and `pm2` in your config.
 `pm2: true` turns on support for using pm2-intercom, `disableClustering: true` turns off all clustering support so it won’t use pm2-intercom.
 Use one or the other, but not both.
``` 

![](https://user-gold-cdn.xitu.io/2018/8/24/1656b22e68787e0e?w=1127&h=105&f=png&s=32324)

### 部署到服务器上就能正常输出日志了，如下

![](https://user-gold-cdn.xitu.io/2018/8/24/1656b2454edb6144?w=673&h=585&f=png&s=90516)


欢迎沟通交流<br>
<img src='https://user-gold-cdn.xitu.io/2018/6/19/16417078c2513e99'>


最后参考文章如下：

 ## 官方文档链接
 [pm2官方文档](https://pm2.io/doc/en/runtime/guide/installation/)<br/>
 [pm2的用法解析](https://www.zhaokeli.com/article/8312.html)
 
 ## log4js
 
 1. [log4js译文](http://www.wangweilin.net/static/pages/log4js-node.html)；
 2. [log4js搭配pm2集群异常日志的解决方案](https://log4js-node.github.io/log4js-node/clustering.html)
 3. [PM2 && log4js && winston 日志管理](https://segmentfault.com/a/1190000011988772)
 4. [vim的命令](https://blog.csdn.net/scaleqiao/article/details/45153379);
 5. [log4js的配置](https://panmin.github.io/2017/06/12/node.js%E9%A1%B9%E7%9B%AE%E4%B8%AD%E4%BD%BF%E7%94%A8log4js%E4%BF%9D%E5%AD%98%E6%97%A5%E5%BF%97%E6%96%87%E4%BB%B6/)；