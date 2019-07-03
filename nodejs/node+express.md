#### 这有一篇Nojs+Express的初级指南……
#### 写在前面：
    这是小生跟着视频学习的总结，文末贴的有地址，很容易上手，自己都跟着敲了一遍，觉得不错，
    值得总结安利一下，欢迎纠错……
### 一、 Nodejs创建第一个应用
1. 引入 http 模块
 
        var http = require("http");
2. 创建服务器<br>         
接下来我们使用 http.createServer() 方法创建服务器，并使用 listen 方法绑定 8888 端口。 函数通过 request, response 参数来接收和响应数据。
```
var http = require('http'); 
http.createServer(function (request, response) {
// 发送 HTTP 头部
// HTTP 状态值: 200 : OK
//设置 HTTP 头部，状态码是 200，文件类型是 html，字符集是 utf8 response.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
// 发送响应数据 "Hello World"
res.end("哈哈哈哈，我买了一个 iPhone" + (1+2+3) + "s"); }).listen(8888 );
// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
```
3. 运行程序

        node server.js

### 二、HTTP模块, URL模块
 2.1 HTTP 模块的使用
 ```
 //引用模块
var http = require("http");
//创建一个服务器，回调函数表示接收到请求之后做的事情
var server = http.createServer(function(req,res){ //req 参数表示请求，res 表示响应
// 设置一个响应头
res.writeHead(200,{"Content-Type":"text/htm l;c harset=UTF8"});

console.log("服务器接收到了请求" + req.url);

res.end(); // End 方法使 Web 服务器停止处理脚本并返回当前结果
});
//监听端口
server.listen(3000,"127.0.0.1");
 ```
 2.2、URL 模块的使用
 
    
    url.parse() 解析 URL
    url.format(urlObject) //是上面 url.parse() 操作的逆向操作
    url.resolve(from, to) 添加或者替换地址
    
  1. url.parse()
  

![](https://user-gold-cdn.xitu.io/2018/12/14/167ac4d3ff0f2313?w=447&h=227&f=png&s=32378)

![](https://user-gold-cdn.xitu.io/2018/12/14/167ac4f171da6b25?w=416&h=200&f=png&s=31073)

2. url.format()

![](https://user-gold-cdn.xitu.io/2018/12/14/167ac50a985a884c?w=563&h=253&f=png&s=42154)
3. url.resolve()

![](https://user-gold-cdn.xitu.io/2018/12/14/167ac511df915277?w=416&h=75&f=png&s=7596)

三、 Nodejs 自启动工具 supervisor

supervisor 会不停的 watch 你应用下面的所有文件，发现有文件被修改，就重新载入程序文件这样就实现了部署，修改了程序文件后马上就能看到变更后的结果。麻麻再也不用担心我的重启 nodejs 了!

1. 首先安装 supervisor

        npm install -g supervisor

2. 使用 supervisor 代替 node 命令启动应用

    
 

![](https://user-gold-cdn.xitu.io/2018/12/14/167ac53b8673b60f?w=438&h=132&f=png&s=12951)

### 三、 Nodejs中的 FS 模块

1. fs.stat 检测是文件还是目录
```
fs.stat('hello.js', (error, stats) =>{ 
    if (error){
        console .log(error) 
    } else {
        console .log(stats)
        console .log(`文件: ${stats.isFile()}` )
        console .log(`目录: ${stats.isDirectory()}` ) 
    }
})
```
2. fs.mkdir 创建目录
```
const fs = require('fs')
fs.mkdir('logs', (error) => { 
    if (error){
        console .log(error)
    } else {
        console .log('成功创 建目录:logs' )
    }
})
```
3. fs.writeFile 创建写入文件
```
fs.writeFile('logs/hello.log', '您好 ~ \n', (error) => {
    if(error) {
        console .log(error)
    } else {
        console .log('成功写入文件' )
    }
})
```
4. fs.appendFile 追加文件
```
 fs.appendFile('logs/hello.log', 'hello ~ \n', (error) => { 
     if(error) {
        console .log(error) } 
    else {
        console .log('成功写入文件' ) 
    }
})
```
5. fs.readFile 读取文件
```
const fs = require('fs')
fs.readFile('logs/hello.log', 'utf8', (error, data) =>{ 
    if (error) {
        console .log(error) 
    } else {
        console .log(data) 
    }
})
```
6. fs.readdir 读取目录
```
const fs = require('fs')
fs.readdir('logs', (error, files) => { 
    if (error) {
        console .log(error)
    } else {
        console .log(files)
    } 
})
```
7. fs.rename 重命名
```
const fs = require('fs')
fs.rename('js/hello.log', 'js/greeting.log', (error) =>{
    if (error) {
        console .log(error)
    } else {
        console .log(' 重命名成功' )
    } 
})
```
 
 
8. fs.rmdir 删除目录
```
fs.rmdir('logs', (error) =>{
    if (error) {
        console .log(error)
    } else { 
        console.log('成功的删除了目录:logs')
    } 
})
```
9. fs.unlink 删除文件
 ```
 fs.unlink(`logs/${file}`, (error) => { 
    if (error) {
        console .log(error)
    } else {
        console.log(`成功的删除了文件: ${file}`) 
    }
})
 ```
 
10. fs.createReadStream 从文件流中读取数据
 ```
const fs = require('fs')
var fileReadStream = fs.createReadStream('data.json')
let count=0; 
var str='';
fileReadStream.on('data', (chunk) => {
    console.log(`${ ++count } 接收到:${chunk.length}`);
    str += chunk; 
})
fileReadStream.on('end', () => { 
    console.log('--- 结束 ---'); 
    console.log(count );
    console.log(str ); 
})
fileReadStream.on('error', (error) => { 
    console .log(error)
})
```
 
 
11. fs.createWriteStream 写入文件
 ```
var fs = require("fs");
var data = '我是从数据库获取的数据，我要保存起来';
// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt'); 
// 使用 utf8 编码写入数据
writerStream .write(data ,'UTF8' ); // 标记文件末尾
writerStream .end();
// 处理流事件 --> finish 事件
writerStream.on('finish', function() { 
/*finish - 所有数据已被写入到底层系统时触发。*/ 
    console .log("写入完成。" );
});
writerStream.on('error', function(err){
    console.log(err.stack); 
});
console .log("程序执行完毕" );
```
12. 管道流 管道提供了一个输出流到输入流的机制。
通常我们用于从一个流中获取数据并将数据传递到另外一个流中。

![](https://user-gold-cdn.xitu.io/2018/12/14/167acf76097adf62?w=552&h=426&f=png&s=31527)
如上面的图片所示，我们把文件比作装水的桶，而水就是文件里的内容，我们用一根管子(pipe )连接两个桶使得水从一个桶流入另一个桶，这样就慢慢的实现了大文件的复制过程。以下实例我们通过读取一个文件内容并将内容写入到另外一个文件中。
```
var fs = require("fs");
// 创建一个可读流
var readerStream = fs.createReadStream('input.txt'); // 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');
// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中 
readerStream.pipe(writerStream );
console.log("程 序执行完毕" );
```
### 四、 Nodejs 创建一个 WEB 服务器。
1. server.js
```
// 引入http模块
var http = require('http');
// 引入fs模块
var fs = require('fs');
// 引入path模块
var path = require('path');
// 引入url模块
var url = require('url');
// 引入自定义的解析模块;
var mime = require('./model/getMimeFile.js');
http.createServer(function (req,res) {
    <!-- 处理请求地址，获取请求的pathname  -->
    var pathName = url.parse(req.url).pathname;
    <!-- 设置响应头 根据文件后缀设置不同的Content-Type,让浏览器解析该文件 -->
    res.writeHead(200, {"Content-Type": " " + mime.getMime(fs, path.extname(pathName))+ "; charset=utf-8"});
    
    if(pathName == '/') pathName = '/index/html';
    if(pathName !== '/favicon.ico') {
        // 文件操作去读取static下面的index.html
        fs.readFile('static/'+pathName,function (err,data) {
            if(err){
                fs.readFile('static/404.html',function (err,data404) {
                    res.write(data404);
                    res.end();
                })
            } else {
                // console.log(data);
                res.write(data);
                res.end();
            }
        })
    }
    
}).listen('8002');
```
2.  getMimeFile.js 
```
exports.getMime = function (fs,extname) {
    var data = fs.readFileSync('./mime.json');
    var Mimes = JSON.parse(data.toString())
    return Mimes[extname] || 'text/html';
}
```
### 五、 Nodejs 的非阻塞 I/O、异步、事件驱动
1. Nodejs的单线程 非阻塞I/O事件驱动

 ```
 在 Java、PHP 或者.net 等服务器端语言中，会为每一个客户端连接创建一个新的线程。
 而每个线程需要耗费大约 2MB 内存。也就是说，理论上，一个8GB 内存的服务器可以同时 连接的最大用户数为 4000 个左右。
 要让 Web 应用程序支持更多的用户，就需要增加服务器 的数量，而 Web 应用程序的硬件成本当然就上升了。
 Node.js 不为每个客户连接创建一个新的线程，而仅仅使用一个线程。
 当有用户连接了,就触发一个内部事件，通过非阻塞 I/O、事件驱动机制，让 Node.js 程序宏观上也是并行的。 
 使用 Node.js，一个 8GB 内存的服务器，可以同时处理超过 4 万用户的连接。
```
2. Nodejs 回调处理异步

```
//正确的处理异步:
function getData(callback){ //模拟请求数据
    var result=''; 
    setTimeout(function (){
        result='这是请求到的 数据'; 
        callback(result);
    },200); 
}
getData(function(data){
    console.log(data);
})
```
3. Nodejs events 模块处理异步
```
// 引入 events 模块
var events = require('events');
var EventEmitter = new events.EventEmitter() ; /*实例化事件对象*/
EventEmitter.on('toparent',function(){ 
    console.log('接收到了广播事件');
})
setTimeout(function (){
    console.log('广播');
    EventEmitter.emit('toparent'); /*发送广播*/ 
},1000)
```
### 六、 Nodejs的 ejs 模板引擎 

1. 路由      
官方解释:       
路由(Routing)是由一个 URI(或者叫路径)和一个特定的 HTTP 方法(GET、POST 等)组成 的，涉及到应用如何响应客户端对某个网站节点的访问。


![](https://user-gold-cdn.xitu.io/2018/12/14/167ad0dc9d1bfc6c?w=800&h=468&f=png&s=47406)

2.  初识 EJS 模块引擎
 
文档：  https://www.npmjs.com/package/ejs     
安装 ：  

    npm install ejs –save     /     cnpm install ejs --save

 Nodejs中使用：
 
 
    ejs.renderFile(filename, data, options, function(err, str){ 
        str => Rendered HTML string
    });
    
EJS 常用标签

 * <%%>流程控制标签
 * <%=%>输出标签(原文输出HTML标签) 
 * <%-%>输出标签(HTML会被浏览器解析)
 ```
    <a href="<%= url %>"><img src="<%= imageURL %>" alt=""></a><ul>
    <ul>
        <% for(var i = 0 ; i < news.length ; i++){ %> 
            <li> <%= news[i] %> </li> 
        <% } %>
    </ul>
    
 ```
3.  Get、Post

**超文本传输协议(HTTP)的设计目的是保证客户端机器与服务器之间的通信。<br/>在客户端和服务器之间进行请求-响应时，两种最常被用到的方法是:GET 和 POST。<br/>
GET - 从指定的资源请求数据。(一般用于获取数据)<br/>
POST - 向指定的资源提交要被处理的数据。(一般用于提交数据)**

获取 GET 传值:

    var urlinfo = url.parse(req.url,true); 
    urlinfo.query();
获取 POST 传值:
```
var postData = ''; // 数据块接收中
req.on('data', function (postDataChunk) { 
    postData += postDataChunk;
});
// 数据接收完毕，执行回调函数
req.on('end', function () { 
    try {
        postData = JSON.parse(postData); 
    } 
    catch (e) { }
    req.query = postData;
    console.log(querystring .parse(postData));
});
```
## 七、 MongoDb 数据库介绍、安装、使用

   1. 数据库和文件的主要区别
   ```
   1、 数据库有数据库表、行和列的概念，让我们存储操作数据更方便
   2、 数据库提供了非常方便的接口，可以让 nodejs、php java .net 很方便的实现增加修改删除功能。
   ```
   2. NoSql 介绍    
   ```
   NoSQL(NoSQL = Not Only SQL )，意即“不仅仅是 SQL”，
   它指的是非关系型的数据库，是以key-value形式存储，和传统的关系型数据库不一样，
   不一定遵循传统数据库的一些基本要求.
   ```
   3. 什么时候建议使用 NoSql
   ```
   1、对数据库高并发读写的需求 
   2、对海量数据的高效率存储和访问的需求
   3、对数据库的高可扩展性和高可用性的需求
   ```
   4. NoSql 和传统数据库简单对比
   ```
   非结构型数据库。没有行、列的概念。用 JSON 来存储数据。
   集合就相当于“表 ”，文档就相当于“行”。
   ```
   
![](https://user-gold-cdn.xitu.io/2018/12/24/167df3506d17fbb7?w=535&h=348&f=png&s=59755)
   
   5. mongodb的使用方法     
    i. [mongodb的安装方法](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)；     
    ii.  开启 mongodb服务:要管理数据库，必须先开启服务,然后进行数据库的相关操作      
    iii. mongodb的常用指令 

        查询 (find)    
        增加 (insert)  
        修改 (update)  
        删除（remove）
    ```
    查看所有数据库列表    show dbs
    使用数据库、创建 数据库    use student  (student代表 data_base_name);
    
    插入(增加)一条数据    db.student.insert({“name”:”xiaoming”});
    db.表名.insert({"name":"zhangsan"}); student 集合名称(表)
    
    显示当前的数据集合(mysql 中叫表)    show collections
    删除数据库，删除当前所在的数据库    db.dropDatabase();
    删除集合，删除指定的集合 删除表     db.user.drop()；
    
    1、查询所有记 录
    db.userInfo.find();
    相当于:select* from userInfo;
    
    2、查询 age > 22 的记录 db.userInfo.find({age: {$gt: 22}});
    相当于:select * from userInfo where age >22;
    
    3、查询 age < 22 的记录
    db.userInfo.find({age: {$lt: 22}}); 
    相当于:select * from userInfo where age <22; 
    
    4、查询 age >= 25 的记录
    db.userInfo.find({age: {$gte: 25}}); 
    相当于:select * from userInfo where age >= 25;
    
    5、查询 age <= 25 的记录 
    db.userInfo.find({age: {$lte: 25}});
    
    6. 按照年龄排序 1 升序 -1 降序 
    升序: db.userInfo.find().sort({age: 1}); 
    降序: db.userInfo.find().sort({age: -1});
    
    7. 查询前 5 条数据 db.userInfo.find().limit(5 ); 
       相当于:selecttop 5 * from userInfo;
    
    修改数据  
    查找名字叫做小明的，把年龄更改为 16 岁:
    db.student.update({"name":"小明"},{$set:{"ag e":16}});
    
    删除数据
    db.collectionsNames.remove( { "borough": "Manhattan" } )
    db.users.remove({age: 132});
    
    ```
## 八、 express的介绍

#### 1. express的安装使用
    npm install express –save 
``` 
demo:
    var express=require('express');  /*引入 express*/
    var app=newexpress(); /*实例化express 赋值给app*/
    //配置路由 匹配 URl 地址实现不同的功能
    app.get('/',function(req,res){ 
        res.send('首页');
    }) 
    app.get('/search',function(req,res){
        res.send('搜索'); //?keyword=华为手机&enc=utf-8&suggest=1.his.0.0&wq
    })
    app.get('/login',function(req,res){ 
        res.send('登录');
    }) 
    app.get('/register',function(req,res){
        res.send('注册');
    }) 
    app.listen(3000,"127.0.0.1");
```

#### 2. Express 框架中的路由
```

当用 get 请求访问一个网址的时候，做什么事情:
app.get("网址",function(req,res){

});

当用 post 访问一个网址的时候，做什么事情:
app.post("网址",function(req,res){

});
// user 节点接受 PUT 请求
app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user'); 
});

// user 节点接受 DELETE 请求 
app.delete('/user', function (req, res) {
   res.send('Got a DELETE request at /user'); 
});

动态路由配置:
"/user/:id "
app.get( ,function(req,res){ 
    var id = req.params["id"];
    res.send(id); 
});
路由的正则匹配:(了解)
 app.get('/ab*cd', function(req, res) { 
    res.send('ab*cd');
});

路由里面获取 Get 传值
/news?id=2&sex=nan

app.get('/news, function(req, res) { 
    console.log(req.query);
});
```


 #### 3、Express 框架中 ejs 的安装使用:
 
    i. npm install ejs --save-dev   // 安装
    
    ii. Express 中 ejs 的使用:
    
    var express = require("express");
    var app = express();
    app.set("view engine","ejs");
    app.get("/",function(req,res){ });
    res.render("news",{
        "news" : ["我是小新闻啊","我也是啊","哈哈哈哈"]
    }); app.listen(3000);
    
    iii. 指定模板位置 ，默认模板位置在 views
     
     app.set('views', __dirname + '/views');
     
    iv. Ejs 后缀修改为 Html
    这是一个小技巧，看着.ejs 的后缀总觉得不爽，使用如下方法，可以将模板文件的后缀换成我们习惯的.html。
    
    1.在 app.js 的头上定义 ejs:,代码如下:
    var ejs = require('ejs');
    2.注册 html 模板引擎代码如下: 
    app.engine('html',ejs.__express);
    3.将模板引擎换成 html代码如下:
    app.set('view engine', 'html');
    4.修改模 板文件的后缀为 .html。

#### 4. 利用 Express.static 托管静态文件
 1、如果你的静态资源存放在多个目录下面，你可以多次调用 express.static 中间件:
 
    app.use(express.static('public'));
  现在，public目录下面的文件就可以访问了
  

![](https://user-gold-cdn.xitu.io/2018/12/24/167df6991eff1872?w=683&h=195&f=png&s=24904)

 2、如果你希望所有通过 express.static 访问的文件都存放在一个“虚拟(virtual)”目 录(即目录根本不存在)下面，可以通过为静态资源目录指定一个挂载路径的方式来实现
 
    app.use('/static', express.static('public'));
现在，你就可以通过带有 “/static” 前缀的地址来访问 public 目录下 面的文件了。

![](https://user-gold-cdn.xitu.io/2018/12/24/167df693477775cf?w=681&h=199&f=png&s=32147)

#### 5、 Express 中间件 （powerful function）

1. 应用级中间件

![](https://user-gold-cdn.xitu.io/2018/12/24/167df6ca0ace367f?w=646&h=504&f=png&s=54850)
2. 路由中间件

![](https://user-gold-cdn.xitu.io/2018/12/24/167df6d50764b050?w=644&h=192&f=png&s=23944)
3. 错误处理中间件
   
![](https://user-gold-cdn.xitu.io/2018/12/24/167df6dfd46ec984?w=627&h=305&f=png&s=32416)

4. 内置中间件

![](https://user-gold-cdn.xitu.io/2018/12/24/167df6e9c4e3f55f?w=641&h=94&f=png&s=24586)
5. 第三方中间件 
```
body-parser    获取post提交的数据  
```
#### 6、 获取 Get Post 请求的参数
 ● GET 请求的参数在 URL 中，在原生 Node 中，需要使用 url 模块来识别参数字符串。在Express 中，不需要使用 url 模块了。可以直接使用 **req.query** 对象。

● POST 请求在 express 中不能直接获得，可以使用 **body-parser**模块。使用后，将可以用**req.body**得到参数。但是如果表单中含有文件上传，那么还是需要使用 **formidable** 模块。
```
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(function (req, res) { 
    res.setHeader('Content-Type', 'text/plain') 
    res.write('you posted:\n')
    res.end(JSON.stringify(req.body, null, 2))
})
```
知识点大概总结这么多，也算是给前段时间的学习做了一个总结，省得学点，忘点[捂脸🤦‍♀️]

GitHub地址： [node+express](https://github.com/ruiyongsheng/node_express);
欢迎交流学习……

##### 声明：知识点总结是跟着    [大地老师的node视频](https://www.itying.com/goods-548.html)
一点点学习的，整个课程还是很详细的，有兴趣的可以下载下来自学……


