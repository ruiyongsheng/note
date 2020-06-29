
现在总结篇：
手写Call


```js
Function.prototype.callme = function (context) {
    // 1.判断this是否是函数，
   if(this === Function.prototype){
        return undefined;
   }
   // 2. context为可选参数，如果不传的话默认上下文为`window`
   context = context || window;
   // 3. 为context 创建一个 Symbol（保证不会重名）属性，将当前函数赋值给这个属性
   const fn = Symbol();
   context[fn] = this;
   // 4. 处理参数，传入第一个参数后的其余参数
   const result = context.fn(...args);
   delete context.fn;
   return result;
}
```
apply

```js
Function.prototype.applyMe = function (contex, args) {
    if(this === Function.prototype) {
        return undefined;
    }
    context = context || window
    const fn = Symbol()
    context.fn = this;
    let result;
    result = Array.isArray(args) ? contex.fn(...args) : context.fn();
    delete context.fn;
    return result;
}
```
bind
1. 处理参数，返回一个闭包
2. 判断是否为构造函数使用，如果是则使用`new`调用当前函数
3. 如果不是，使用`apply`,将`context`和处理好的参数传入。
```js
Function.prototype.bindMe = function (context, ...args1) {
    if (this === Function.prototype) {
        throw new TypeError('Error');
    }
    const _this = this;
    return function F (...args2) {
        // 判断是否用于构造函数
        if(this instance F) {
            return new _this(...args1, ...args2);
        }
        return _this.apply(context,args1.concat(args2);
    }
}
```
拓展：

```
// 获取argument对象 类数组对象 不能调用数组方法
    function test1() {
      console.log('获取argument对象 类数组对象 不能调用数组方法', arguments);
    }

    // 获取参数数组  可以调用数组方法
    function test2(...args) {
      console.log('获取参数数组  可以调用数组方法', args);
    }

    // 获取除第一个参数的剩余参数数组
    function test3(first, ...args) {
      console.log('获取argument对象 类数组对象 不能调用数组方法', args);
    }

    // 透传参数
    function test4(first, ...args) {
      fn(...args);
      fn(...arguments);
    }

    function fn() {
      console.log('透传', ...arguments);
    }

    test1(1, 2, 3);
    test2(1, 2, 3);
    test3(1, 2, 3);
    test4(1, 2, 3);
```

![](https://user-gold-cdn.xitu.io/2020/7/2/1730fdf22af1a09d?w=1070&h=1186&f=png&s=208177)