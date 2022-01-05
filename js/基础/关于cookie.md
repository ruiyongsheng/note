# 关于跨站和跨域

## 一级域名 二级域名 三级域名

一般来说就是比如`www.baidu.com`：

 `.com`是一级域名；

 `baidu`是二级域名；

 `www`是三级域名

跨域 ：
同源策略：`协议`   `域名`   `端口号`  三者不同，严格

跨站， 一级域名相同，互相请求就是跨站请求， cross-site

> 同源策略作为浏览器的安全基石，其“同源”判断是比较严格的，而相对而言，Cookie中的“同站”判断就比较宽松：只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口。其中，eTLD 表示**有效顶级域名**，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co、.uk、.github.io 等。而 eTLD+1 则表示，有效顶级域名+二级域名，例如 taobao.com等。

举个 🌰：  www.taobao.com 和www.baidu.com是跨域，www.a.taobao.com和www.b.taobao.com是同站，a.github.io和b.github.io是跨站(**注意是跨站**)。

## 关于cookie跨站：withCredentials 和 sameSite 属性

Cookie中的“同源”只关注  **域名**，忽略协议和端口，也就是Cookie可以跨二级域名来访问，即也可以称为“同站”。

浏览器本身是允许cookie同站通信的；而所谓的“跨站”，比如cookie跨站实现第三方cookie，实际上就是想利用浏览器更加“开放”的那些规则来突破“同站”的限制。

- withCredentials： 服务端+客户端xhr机制
  - 作用：如果需要跨域(包括“跨站”)AJAX发送Cookie (不仅会**发送**Cookie，还可以去设置远程主机域名下的Cookie)
  - 基于CORS：为了让这个属性生效，服务器必须显式返回  `Access-Control-Allow-Credentials` 这个头信息
    - 备注：`Access-Control-Allow-Origin` 就不能设为星号，要对应上你所允许放行的请求。同时，Cookie依然遵“同站”政策，只有用服务器域名设置的 Cookie才会上传，其他域名的Cookie并不会上传
  - 客户端的开启：`xhr.withCredentials = true;`
    - (反过来看，若未开启时的效果：`withCredentials`属性是一个布尔值，默认为`false`。即向“对于`example.com`是跨域的”请求时，不会发送`example.com`设置在本机上的Cookie（如果有的话）。)
  - (edge case：如果省略`withCredentials`设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭`withCredentials`。)
- --------- 分割线 -------------
- 浏览器sameSite属性：该属性可分别限制整个页面中的每个http的cookie跨站情况 (即其意图和CSRF相关)
  - 其**默认值**让 Cookie 在**跨站**请求时不会被发送，从而可以阻止跨站请求伪造攻击（即CSRF）
  - 出现后所带来的坑：在chrome 80中提出，导致之前上线的跨站的Cookie用不了。(其实就是针对和打击第三方Cookie)
  - **旧网站**临时解决sameSite默认值所带来的坑：手动设置 SameSite 为 none。

**Koa中设置Cookie的值**

`ctx.cookies.set(name, value, [options])`

**Options:** 

```js
options = {
    maxAge:"000000000"       // cookie有效时长，一个数字表示从 Date.now(),单位：毫秒数
    expires:"0000000000"      // 过期时间，unix时间戳
    path:"/"         //cookie保存路径, 默认是'/，set时更改，get时同时修改,不然会保存不上，服务同时也获取不到
    domain:".xxx.com"       // cookie可用域名，“.”开头支持顶级域名下的所有子域名
    secure:"false"       // 默认false，设置成true表示只有https可以访问
    httpOnly:"true"     //true，客户端不可读取
    overwrite:"true"    //一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（不管路径或域）是否在设置此Cookie 时从 Set-Cookie 标头中过滤掉。
}
```

关于 cookie 的 `same-site`  的解释：

```js
* Strict  //  完全禁止第三方 Cookie
* Lax   // default 
* None  // server 必须设置 sameSite=none;Secure 
```

详细见下方：

[Cookie 的 SameSite 属性 - 阮一峰的网络日志 (ruanyifeng.com)](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)

参考资料：

[Understanding "same-site" and "same-origin" (web.dev)](https://web.dev/same-site-same-origin/)

[关于我因为登录失败开始探究Cookie这档事 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/272495184)



[彻底明白ip地址，区分localhost、127.0.0.1和0.0.0.0 - 简书 (jianshu.com)](https://www.jianshu.com/p/ad7cd1d5be45)

