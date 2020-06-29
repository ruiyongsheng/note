## Call
<hr>
一句话介绍call:

```!
call 方法是在使用一个指定的this值和若干个指定的参数值的前提下调用某个函数或者方法
```
举个例子：

```js
var foo = {
    value: 1
};
function bar () {
    console.log(this.value);
}
bar.call(foo); // 1;
```
注意两点：

1. call改变了this指向，指向到foo
2. bar函数执行了
#### 模拟实现第一步：
<hr>
那么我们应该怎么模拟实现这两个效果呢？

试想当调用Call的时候，把foo对象改造成如下：

```js
var foo = {
    value: 1,
    bar: function () {
        console.log(this.value);
    }
}
foo.bar(); // 1
```
这个时候 this就指向了foo,是不是很简单呢？

但是这样却给foo对象本身添加了一个属性，这可不行呐！
不过也不用担心，我们用Delete再删除它不就好了~
所以我们模拟的步骤可以分为：

1.  将函数设置为对象的属性
2.  执行该函数。
3.  删除该函数
以上个例子为例，就是：

```js
// 第一步
foo.fn = bar;
// 第二步
foo.fn();
// 第三步
delete foo.fn;
```
fn是对象的属性名，反正最后也要删除它，所以起成什么都无所谓。

根据这个思路，我们可以尝试着去写第一版的 **call2** 函数

```js
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可获取
    context.fn = this;
    context.fn();
    delete context.fn;
}
// 测试一下，
var foo = {
    value: 1
}
function bar() {
    console.log(this.value);
}
bar.call2(foo) // 1
```
正好可以打印1哎，是不是很开心
#### 模拟实现第二步
<hr>
最开始也讲了，call函数还能给定参数执行函数。举个例子：

```js
var foo  = {
    value: 1
}
function bar (name,age) {
    console.log(name);
    console.log(age);
    console.log(this.value);
}
bar.call(foo, 'kevien', 18);
// kevien
// 18
// 1
```
注意： 传入的参数并不确定，这可咋办？

不急，我们可以从Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。
比如这样：

```js
// 以上个例子为例，此时的arguments为：
// arguments = {
//    0: foo,
//    1: 'kevien'
//    2: 18,
//    length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环
var args = [];
for(var i =1; i< arguments.length; i++) {
   args.push('arguments[' + i + ']');
}
// 执行后 args 为 ["arguments[1]", "arguments[2]", "arguments[3]"]
```
不定长的参数问题解决了，我们接着要把这个参数数组放到要执行的函数的参数里面去。

```js
// 将数组里的元素作为多个参数放进函数的形参里
context.fn(args.join(','));
// 这个方法肯定也是不行的啦！！！
```
也许有人想到用 ES6 的方法，不过 call 是 ES3 的方法，我们为了模拟实现一个 ES3 的方法，要用到ES6的方法，好像……，嗯，也可以啦。但是我们这次用 eval 方法拼成一个函数，类似于这样：

```js
eval('context.fn(' + args +')')
```
这里 args 会自动调用 Array.toString() 这个方法。

所以我们的第二版克服了两个大问题，代码如下：

```js
Function.prototype.call2 = function() {
    context.fn = this;
    var args = [];
    for (var i =1; i< arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
    // args = [arguments[1],arguments[2]....]
    eval('context.fn(' + args +')');
    delete context.fn;
}
// 测试一下
var foo = {
    value: 1
}
function bar (name,age) {
    console.log(name);
    console.log(age);
    console.log(this.value);
}
bar.call2(foo, 'kevien', 18);
// kevin
// 18
// 1
```

![](https://user-gold-cdn.xitu.io/2020/7/1/1730a957abdd3333?w=904&h=706&f=png&s=94935)
#### 模拟实现第三步
<hr>
模拟代码已经完成 80%，还有两个小点要注意：

1. this参数可以传null,当为null的时候，视为指向window
举个例子：

```js
var value = 1;
function bar () {
    console.log(this.value);
}
bar.call(null) // 1;
```
虽然这个例子本身不使用 call，结果依然一样。
2. 函数是可以有返回值的
举个例子：

```js
var obj = {
    value: 1
}
function bar (name,age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}
console.log(bar.call(obj, 'kevien',18))
// object {
    // value: 1,
    // name: 'kevien',
    // age: 18
//}
```

![](https://user-gold-cdn.xitu.io/2020/7/1/1730a9f821829166?w=782&h=404&f=png&s=43949)
不过都很好解决，让我们直接看第三版也就是最后一版的代码：

```js
// 第三版
Function.prototype.call2 = function (context) {
    context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null);
console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

![](https://user-gold-cdn.xitu.io/2020/7/1/1730aa80e41e0a43?w=904&h=1104&f=png&s=124242)
至此，我们完成了 call的模拟实现。
#### apply的模拟实现
apply 的实现跟 call 类似，在这里直接给代码，


```js
Function.prototype.apply = function (context, arr) {
    context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```
#### 关于eval
eval函数接收参数是个字符串<br>
定义与用法

```!
eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码。
```
语法： `eval(string)`

```!
string必需。要计算的字符串，其中含有要计算的 JavaScript 表达式或要执行的语句。该方法只接受原始字符串作为参数，如果 string 参数不是原始字符串，那么该方法将不作任何改变地返回。因此请不要为 eval() 函数传递 String 对象来作为参数。
```
简单来说吧，就是用JavaScript的解析引擎来解析这一堆字符串里面的内容，这么说吧，你可以这么理解，你把eval看成是 `<script>` 标签。

`eval('function Test(a,b,c,d){console.log(a,b,c,d)};Test(1,2,3,4)')`

拆解上述实现的步骤：

```js
var args = [];
for(var i = 1, i < arguments.length;  i++) {
        args.push('arguments[' + i + ']');
}
```
最终的数组为：

```js
var args = [arguments[1], arguments[2], ...]
```
然后：

```js
var result = eval('context.fn(' + args +')');
```
在eval中，args 自动调用 args.toString()方法，最终的效果相当于：

```js
var result = context.fn(arguments[1], arguments[2], ...);
```
这样就做到了把传给call的参数传递给了 `contex.fn` 函数