
## http协议背后的那些事儿
![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedc20cc571?w=1111&h=536&f=jpeg&s=147421)
第一步：先请求    
第二步：再响应

![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedc20ad89e?w=1143&h=596&f=jpeg&s=492166)

**DNS** 服务器用来解析域名    
常见面试题：*当在浏览器中输入按钮之后发生了什么？*
```   
1. 输入网址并回车
2. DNS服务器先去解析域名
3. 浏览器发送HTTP请求
4. 服务器处理请求
5. 服务器返回HTML响应
6. 浏览器处理HTML页面
7. 继续请求其他资源
```
![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedc2136a18?w=1179&h=605&f=jpeg&s=220908)


#### http与https的区别
![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedc24cb4dd?w=1126&h=607&f=jpeg&s=154825)

https比http多了层链路协议（TLS,SSL）  应用层协议；  
http默认端口（80；  
https默认端口（443）

![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedc2aaef3f?w=1169&h=603&f=jpeg&s=379811)

![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee68eb63b9?w=930&h=627&f=jpeg&s=231809)

## http状态码

![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedcd0844ca?w=2236&h=1178&f=jpeg&s=487837)

## cookie 和 session 的使用

![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedf2b53bc5?w=1144&h=601&f=jpeg&s=295566)

#### cookie的使用
![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedf55f8908?w=1222&h=662&f=jpeg&s=309536)

#### session的使用

![](https://user-gold-cdn.xitu.io/2018/5/16/16366eedf887c8e9?w=2132&h=882&f=jpeg&s=263058)

#### 缓存的使用

![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee01b70bf4?w=1063&h=586&f=jpeg&s=270566)

![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee01c3d343?w=1070&h=608&f=jpeg&s=333073)

### http2
![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee26b818a9?w=818&h=559&f=jpeg&s=156009)
#### http与反向代理
![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee33724d6f?w=1011&h=592&f=jpeg&s=162635)

1. 正向代理
![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee3943bdb1?w=748&h=518&f=jpeg&s=59424)

2. 反向代理 
 ![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee4a83671d?w=822&h=541&f=jpeg&s=61797)

## 反向代理的用途
 ![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee61348bac?w=1161&h=647&f=jpeg&s=190958)
 #### 反向代理做负载均衡
 ![](https://user-gold-cdn.xitu.io/2018/5/16/16366eee614a5685?w=909&h=643&f=jpeg&s=158527)