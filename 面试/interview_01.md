## HTML
1. #### 当你在浏览器中输入一个网址，发生了什么？
```
1.DNS域名解析；
2.建立TCP连接；
3.发送HTTP请求；
4.服务器处理请求；
5.返回响应结果；
6.关闭TCP连接；
7.浏览器解析HTML；
8.浏览器布局渲染
```
具体戳这里<br>
[浏览器输入URL后发生了什么](https://blog.csdn.net/sinat_23880167/article/details/78882766)<br>
[从输入URL到页面加载的过程？](https://zhuanlan.zhihu.com/p/34453198?group_id=957277540147056640)

## js
一. [ajax常见面试题](https://juejin.im/post/5aa2b26b518825556020873f?utm_medium=fe&utm_source=weixinqun#heading-5);<br>
二. [JavaScript面向对象核心知识归纳
](https://blog.dunizb.com/2016/10/25/JavaScript%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E6%A0%B8%E5%BF%83%E7%9F%A5%E8%AF%86%E5%BD%92%E7%BA%B3/)；真的是超详细的！！！
   1. 什么是原型
   原型能存储我们的方法，构造函数创建出来的实例对象能够引用原型中的方法
   2. 查看对象的原型
   当对象被创建之后，查看对象的原型的方法不止一种，以前一般使用对象的_proto_属性，ES6推出后，推荐用Object.getPrototypeOf()方法来获取对象的原型
```
function A() {
   this.name='lala';
}
var a=new A();
console.log(a.__proto__) 
// 输出：Object {}
 
// 推荐使用这种方式获取对象的原型
console.log(Object.getPrototypeOf(a)) 
// 输出：Object {}
```
#### 三、 原型链

 什么是原型链？
 凡是对象就有原型，那么原型又是对象那个，因此凡是给定一个对象，那么就可以找到他的原型，原型还有原型，那么如此下去，就构成一个对象的序列称该结构为原型链；
 ```
 每个实例对象都有一个__proto_属性，该属性指向它原型对象，这个实例对象的构造函数有一个原型属性prototype，与实例的__proto_属性指向同一个对象那个。
 当一个对象在查找一个属性的时候，自身没有就会根据__proto_向它的原型进行查找，如果都没有，则向他的原型的原型继续查找，直到查到Object.prototype.__proto_为null，这样也就形成了原型链；
 ```
 **题1.**
 ```
 function fun(n,o) {
      console.log(o);
      return {
        fun: function (m) {
          return fun(m,n)
        }
      }
    }
    var a = fun(0);
    a.fun(1);
    a.fun(2);
    a.fun(3);
    var b = fun(0).fun(1).fun(2).fun(3);
    求a,b分别输出的值是多少？
    答案： 
    a: undefined 0 0 0;
    b: undefined 0 1 2;（考察函数式编程的问题）
    
 ```
 **题2：**
 ```
    let p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('success');
        console.log(1);
      },1000)
      console.log(2);
    })
    console.log(p);
    p.then((result) => {
      console.log(result);
    },(err) => {
      console.log(err);
    })
    答案： 2 promise 1 success;(考察执行队列的问题)
 ```
 **题3：**
 ```
 // 考察闭包
 var a,b;
    (function(){
      console.log(a);// undefined
      console.log(b);// undefined
      function test(){
        var a= 1, b=3;
        console.log(a); // 1
        console.log(b); // 3
      }
      test();
      console.log(a);
      console.log(b);
    })();
    console.log(a);  // undefined
    console.log(b); // undefined
 ```
 **题4：如何判断一个变量类型是数组还是对象** <br>
 戳这里： [判断一个变量类型是数组还是对象](https://www.cnblogs.com/Walker-lyl/p/5597547.html)；<br>
 方法一： 通过length属性，一般情况下对象没有length属性值，其值为undefiend，而数组的length值为number类型；<br>
 方法二: 通过instanceof来判断区分 <br>
 通常来讲，使用 instanceof 就是判断一个实例是否属于某种类型
 ```
 var arr = [1, 2, 3];
 var obj = {
    name: 'lyl',
    age: 18,
    1: 'name'
 }
 console.log(arr instanceof Array); // true
 console.log(obj instanceof Array); // false
 ```
方三：通过constructor
```
var arr = [1, 2, 3];
var obj = {
    name: 'lyl',
    age: 18,
    1: 'name'
}
console.log(arr.constructor === Array); // true
console.log(obj.constructor === Array); // false
```
方法四：通过toString()方法，数组原型和对象原型定义的toString()方法不同 !!!(最好用的用法)
```
var arr = [1, 2, 3];
var obj = {
    name: 'lyl',
    age: 18,
    1: 'name'
}
console.log(Object.prototype.toString.call(arr) === '[object Array]'); //true
console.log(Object.prototype.toString.call(boj) === '[object Array]'); //false
```
**题五：js判断对象是否为空对象的几种方法**
1. 将json对象转化为json字符串，再判断该字符串是否为"{}"；
```
var data = {};
var b = (JSON.stringify(data) == "{}");
alert(b);//true
```
2. for in 循环判断
```
var obj = {};
var b = function() {
for(var key in obj) {
  return false;
}
  return true;
}
alert(b());//true
```
3. jquery的isEmptyObject方法
```
此方法是jquery将2方法(for in)进行封装，使用时需要依赖jquery
var data = {};
var b = $.isEmptyObject(data);
alert(b);// true
```
4. Object.getOwnPropertyNames()方法 <br>
此方法是使用Object对象的getOwnPropertyNames方法，获取到对象中的属性名，存到一个数组中，返回数组对象，我们可以通过判断数组的length来判断此对象是否为空;<br>
注意：此方法不兼容ie8，其余浏览器没有测试
```
var data = {};
var arr = Object.getOwnPropertyNames(data);
alert(arr.length == 0);//true
```
5. 使用ES6的Object.keys()方法
```
var data = {};
var arr = Object.keys(data);
alert(arr.length == 0); // true
```
**题6.**         
[JavaScript中基本数据类型和引用数据类型的区别](https://www.cnblogs.com/cxying93/p/6106469.html)；<br/>
