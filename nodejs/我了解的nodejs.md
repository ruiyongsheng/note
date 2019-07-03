### 一. 什么是nodejs

* nodejs是javascript的解析器
* nodejs是javascript的运行环境
* nodejs是一个服务器程序
* nodejs本身是V8引擎
* nodejs不是Web服务器

### 二. 为什么要使用 nodejs

* 为了提高高性能的Web服务
* IO性能强大
* 事件处理机制强大
* 天然能够处理DOM

### 三、 nodejs的优势在哪里

* 处理大流量的数据
* 适合实时交互的应用
* 完美支持对象数据库
* 异步处理大量并发连接

### 四. 一个简单的hello world;
在IDE里创建一个server.js；贴如下代码；
```
var http = require('http');
http.createServer((req,res) => {
  // 定义响应头
  res.writeHead(200,{'Content-Type':'text/plan'});
  // 定义响应内容
  res.end('hello world\n');
}).listen(3000);
console.log('服务运行在3000端口了');
```
在terminal中输入  **node server.js**;    
浏览器里输入localhost:3000; 即可看到输入的hello world;

### 五. Nodejs的回调函数
什么是回调？
* 函数的调用方式同步调用、回调、异步调用；；
* 回调是一种双向调用模式；
* 可以通过回调函数来实现回调

nodejs的回调机制


* 阻塞和非阻塞关注的是程序在等待调用的结果（消息，返回值）时的状态；
* 阻塞就是做不完不准回来
* 非阻塞就是你先做，我先看看有木有其他事儿，做完了告诉我一声；

```
// 阻塞代码
var fs = require('fs');
var data = fs.readFileSync('data.txt'); readFileSync 同步读取文件
console.log(data.toString()); // ABCDEF
```
```
// 非阻塞代码
var fs = require('fs');
fs.readFile('data.txt',function (err, data) {
  if (err) {
    return console.error(err);
  } 
  console.log(data.toString());
})
console.log('程序执行完毕了');
输出：
程序执行完毕了
ABCDEF
```
比较上述两代码片段，就知道，阻塞代码和非阻塞代码的区别了；

### 六、 Nodejs的事件驱动模型；

![](https://user-gold-cdn.xitu.io/2018/7/7/16473d35c715a302?w=2198&h=1160&f=jpeg&s=207493)

事件处理代码流程

* 引入events对象，创建eventEmitter对象；
* 绑定事件处理程序
* 触发事件

```
// 引入events对象，创建eventEmitter对象；
var events = require('events');
var eventEmitter = new events.EventEmitter();
// 绑定事件处理函数
var connetHandler = function connted() {
  console.log('connected被调用了');
}
eventEmitter.on('connection', connetHandler); // 完成事件的绑定
// 触发事件
eventEmitter.emit('connection');
console.log('程序执行完毕');

输出：
// connected被调用了
// 程序执行完毕
注意： 需要先完成事件的绑定.on(),然后才能触发事件.emit();
```

### 七、 nodejs的模块化


![](https://user-gold-cdn.xitu.io/2018/7/7/16473e5d7509c033?w=2194&h=1136&f=jpeg&s=361993)

#### nodejs的模块加载流程
![](https://user-gold-cdn.xitu.io/2018/7/7/16473e89dc75379e?w=900&h=1128&f=png&s=331808)

#### nodejs的模块加载方式

* 从文件模块缓存区去加载
* 从原生模块去加载
* 从文件加载
![](https://user-gold-cdn.xitu.io/2018/7/7/16473e79dd4c58ed?w=1738&h=1136&f=png&s=2310548)

代码示例 <br>
hello模块   hello.js
```
// 模块的主要逻辑
function hello() {
  var name;
  this.setName = function (argName) {
    name = argName;
  }
  this.sayHello = function () {
    console.log('Hello '+ name);
  }
}
// 对模块进行导出
module.exports = hello;
```

main.js
```
// 引入hello 模块；
var hello = require('./hello');
hi = new hello();
hi.setName ('rys');
hi.sayHello();
```
然后执行node main.js <br>
输出 hello rys;

### 八. nodejs路由
戳这里 [nodejs路由](http://www.runoob.com/nodejs/nodejs-router.html)；

### 九. nodejs的全局对象

戳这里 [nodejs全局对象](http://www.runoob.com/nodejs/nodejs-global-object.html)；
