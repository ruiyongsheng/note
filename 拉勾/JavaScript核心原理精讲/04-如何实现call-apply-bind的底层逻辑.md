**手写实现 new**

```js
function _new (_ctor,...args) {
  if(typeof ctor !== 'function') {
    throw 'ctor must be a funciton'
  }
  let obj = new Object();
  obj.__proto__ = Object.create(ctor.prototype);
  let res = ctor.apply(obj,[...args]);
  let isObj = typeof res === 'object' && res !== null;
  let isFunction = typeof res === 'function';
  return isObj || isFunction ? res : obj;
}

写法二：
function myNew() {
  // 声明一个空对象
  let obj = new Object();
  // 获取构造函数
  let fn = [].shift.call(arguments);
  if (typeof fn !== 'function') throw new Error('fn is not function')
  // 根据原型链的理解, 将构造函数原型上的方法属性都赋值给新对象的原型属性上
  obj.__proto__ = fn.prototype;
  // 执行了该构造函数,并修改 this 指向到 obj
  let res = fn.apply(obj, arguments);
  // 判断构造函数执行的返回值是否是对象，如果是对象，就直接返回,如果不是，则直接返回原值
  return typeof res === 'object' ? res : obj;
}
console.log('myNew', myNew(rys, 'Kevin', '18'), new rys('Kevin', '18'))
```

**手写 apply 和 bind**

```js
Function.prototype.call = function (context, ...args) {
  var context = context || window;
  context.fn = this;
  var result = eval('context.fn(...args)');
  delete context.fn
  return result;
}
Function.prototype.apply = function (context, args) {
  let context = context || window;
  context.fn = this;
  let result = eval('context.fn(...args)');
  delete context.fn
  return result;
}
// 注意参数的变化
写法二：
// 手写call 两个作用
// 1. 执行该函数的执行结果
// 2. 改变 this 指向

Function.prototype.myCall = function (context, ...args) {
  // 给上下文赋值，如果不存在，指向window
  context = context || window;
  // 给上下文添加fn属性，保存 this指向
  context.fn = this;
  // 执行该函数的执行结果
  let res = context.fn(...args);
  delete context.fn;
  return res;
}

function myCall(context) {
  // 判断call的上下文存在? 不存在，则指向 window
  context = context || window;
  // 给上下文添加fn属性，保存 this 指向
  context.fn = this;
  // 执行 该 函数,
  let res = context.fn(...arguments)
  delete context.fn;
  return res;
};
let target = { name: 'rys' };
function sayHello(age, sex) {
  console.log('myCall', this.name, age, sex);
}
sayHello.myCall(target, 10, 'male');
sayHello.call(target, 10, 'male'); 
// myCall rys 10 male
// apply methods;
// 手写 apply, 跟 call类似，只是需要区分下参数的不同
Function.prototype.MyApply = function (context) {
  context = context || window;
  context.fn = this;
  let res;
  if (Array.isArray(arguments[1])) {
    res = context.fn(arguments[1]);
  } else {
    throw new Error('arguments not array')
  }
  delete context.fn;
  return res;
}
function fn(x) {
  console.log(this.name)
  return {
    x
  }
}
let result = fn.MyApply({ name: 'this is apply methods' }, [2, 3, 5]);
console.log('MyApply', result); 
// this is apply methods 
// MyApply, [2,3,5]
```

**手写 bind 的实现**

```js
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('this must be  a function');
  }
  var self = this;
  var fbound = function () {
    self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)))
  }
  if (this.prototype) {
    fbound.prototype = Obejct.create(this.prototype);
  }
  return fbound;
}
写法二： (不传参数)
Function.prototype.myBind = function () {
    if (typeof this !== 'function') if (typeof this !== 'function') throw new Error('caller must be a function');
   let self = this;
   let context = arguments[0];
   let args = Array.prototype.slice.call(arguments, 1);
   let fn = function () {
     let fnArgs = Array.prototype.slice.call(arguments);
     return self.apply(this instanceof self ? this: context, args.concat(fnArgs));
   }
   fn.prototype = Object.create(self.prototype);
   return fn;
}
写法三：     
Function.prototype.myBind = function (context) {
  let self = this;
  // 获取到myBind 函数从第二个参数到最后一个参数
  let args = [].slice.call(arguments, 1)
  // 防止直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype,所以新生成一个中转空函数
  let nop = function () { };
  let fBound = function () {
    // 获取到新函数里的参数
    let args2 = [].slice.call(arguments);
    return self.apply(this instanceof nop ? this : context, args.concat(args2))
  }
  // 保留 myBind 原型上的方法 挂到 中转函数的原型上
  nop.prototype = this.prototype;
  fBound.prototype = new nop();
  return fBound
}
```

![image-20210313172336338](/Users/rys/Library/Application Support/typora-user-images/image-20210313172336338.png)