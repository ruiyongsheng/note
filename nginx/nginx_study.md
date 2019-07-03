## 学习 nginx

为什么要使用Nginx
1. IO多路复用epoll，解决高并发<br>
  什么是epoll?<br>
  IO多路复用的实现方式有Select, poll, epoll<br>
 #### 什么是select？

![](https://user-gold-cdn.xitu.io/2018/8/27/1657a0c9472f8262?w=1150&h=574&f=png&s=189693)
线性读取模式，效率低下

 #### epoll模式：   
 
![](https://user-gold-cdn.xitu.io/2018/8/27/1657a090d8377448?w=1292&h=442&f=png&s=109720)
2. 轻量级 
   功能模块少  代码模块化     
3. CPU亲和     
4. sendFile 
5. 
基于Nginx的中间件架构
️一. 安装目录讲解
``` 
路径                                                   作用
/etc/nginx/mime.types                          设置http协议的Content-Type与扩展名对应关系

/usr/lib/systemd/system/nginx-debug.service    用于配置出系统守护进行管理器管理方式
/usr/lib/system/nginx.service  
/etc/sysconfig/nginx
/etc/sysconfig/nginx-debug

/var/cache/nginx                               Nginx的缓存目录

/var/log/nginx                                 Nginx的日志目录

```
二、 安装编译参数


![](https://user-gold-cdn.xitu.io/2018/8/27/1657a1e89d021882?w=2732&h=1372&f=png&s=1431622)

![](https://user-gold-cdn.xitu.io/2018/8/27/1657a1ebae89eb22)

![](https://user-gold-cdn.xitu.io/2018/8/27/1657a1f2e96d5c20?w=1534&h=546&f=png&s=210840)

Nginx的日志类型

error.log,access.log
通过log_format来输出log

三、 Nginx变量
![](https://user-gold-cdn.xitu.io/2018/8/27/1657a6a2778dd7cf?w=1592&h=576&f=png&s=176742)

四、 Nginx模块

![](https://user-gold-cdn.xitu.io/2018/8/27/1657a9191ed9624d?w=1156&h=230&f=png&s=99334)


![](https://user-gold-cdn.xitu.io/2018/8/27/1657abedb9412ba6?w=1416&h=630&f=png&s=318080)

![](https://user-gold-cdn.xitu.io/2018/8/28/1657e59053765295?w=1528&h=492&f=png&s=190373)


### Nginx处理静态文件---CDN

![](https://user-gold-cdn.xitu.io/2018/8/28/1657e61962f1a2e6?w=1346&h=680&f=png&s=381052)


![](https://user-gold-cdn.xitu.io/2018/8/28/1657e74abc86f071?w=1076&h=956&f=png&s=311868)


![](https://user-gold-cdn.xitu.io/2018/8/28/1657e8e1024f34c2?w=1524&h=626&f=png&s=373782)
#### 代理的区别
   区别在于代理的对象不一样<br>
   正向代理     代理的对象是客户端<br>
   反向代理     代理的对象是服务端<br>
 
   
   
![](https://user-gold-cdn.xitu.io/2018/8/28/1657ea3a46ae15a9?w=1512&h=648&f=png&s=357638)


![](https://user-gold-cdn.xitu.io/2018/8/28/1657ea4d47ad4525?w=1598&h=850&f=png&s=444103)


![](https://user-gold-cdn.xitu.io/2018/8/28/1657ea58c1ff9315?w=1518&h=564&f=png&s=218990)


![](https://user-gold-cdn.xitu.io/2018/8/28/1657ea8a52e14149?w=1464&h=630&f=png&s=389953)


![](https://user-gold-cdn.xitu.io/2018/8/28/1657f1fe2e7025d9?w=1436&h=506&f=png&s=312405)


![](https://user-gold-cdn.xitu.io/2018/8/28/1657f25562d2d53d?w=1412&h=562&f=png&s=493740)


###  Nginx 缓存

![](https://user-gold-cdn.xitu.io/2018/8/28/1657f4daa0dc0cb0?w=1486&h=484&f=png&s=242492)


![](https://user-gold-cdn.xitu.io/2018/8/28/1657f921e24679f2?w=980&h=456&f=png&s=119061)


![](https://user-gold-cdn.xitu.io/2018/8/28/16580102ddcaecba?w=952&h=512&f=png&s=138446)

参考文章：
[Nginx入门指南](http://wiki.jikexueyuan.com/project/nginx/)