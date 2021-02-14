### 手写篇
1. instanceof
  what ?  instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

  ```
  <!-- 写法一： -->
  function myInstanceof(left, right) {
    // 非引用类型的直接返回false
    if (typeof left !== 'object' || left === null) return false;
    // 获取实例对象上的__proto__
    let proto = left.__proto__;
    // 判断成功
    if (proto === right.prototype) return true;
    // 否则，递归调用
    return myInstanceof(proto, right)
  }
  <!-- 写法二： -->
  function myInstanceof(left, right) {
    if (typeof left !== 'object' || left === null) return false;
    // 获取对象上的原型
    let prototype = right.prototype;
    // 获取实例的__proto__
    left = left.__proto__
    // 判断对象的类型是否等于类型的原型
    while (true) {
      if (left === null) return false;
      if (prototype === left) return true;
      left = left.__proto__;
    }
  }
  <!-- 写法三： -->
   function myInstanceof(left, right) {
    if (typeof left !== 'object' || left === null) return false;
    // 获取对象上的原型
    let proto = Object.getPrototypeOf(proto)
    while (true) {
      if (left === null) return false;
      if (prototype === left) return true;
      proto = Object.getPrototypeOf(proto)
    }
  }
  ```
2. Object.create()
```
  function myCreate(obj) {
    // 创建空的构造函数
    function F() { };
    // 将 obj的属性和方法都赋值给构造函数上的 prototype
    F.prototype = obj;
    // 执行构造函数
    return new F();
  }
  console.log('myCreate: ', myCreate({ age: '24' }), Object.create({ age: '24' }));
```
3. 手写 new

```
function rys(name, age) {
  this.strength = 60;
  this.age = age;
  return 'handsome boy';
  // return {
  //   name: name,
  //   age,
  //   habit: 'Games'
  // }
}

function myNew() {
  <!-- 1. 声明一个空对象 -->
  let obj = new Object();
  <!-- 2. 获取构造函数 -->
  let fn = [].shift.call(arguments);
  if (typeof fn !== 'function') throw new Error('fn is not function');
  <!-- 3. 根据原型链的理解，将构造函数的原型上的属性方法都赋值给新对象的原型属性上 -->
  obj.__proto__ = fn.prototype
  <!-- 4. new的特性，执行该函数，所以执行该函数，并修改 this 指向到 obj -->
  let res = fn.apply(this,obj);
  <!-- 判断构造函数执行的返回值是否是对象，如果是对象，则直接返回，如果不是, 则直接返回原值 -->
  return typeof res === 'object' ? res : obj;
}
console.log('myNew', myNew(rys, 'Kevin', '18'), new rys('Kevin', '18'))
```
4. 手写 call
```
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
// 手写call 两个作用
// 1. 执行该函数的执行结果
// 2. 改变 this 指向
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
sayHello.myCall(target, 10, 'male'); // myCall rys 10 male
sayHello.call(target, 10, 'male'); // myCall rys 10 male
```
5. 手写 apply
```
Function.prototype.myApply = function (context) {
  context = context || window;
  context.fn = this;
  let res;
  if(Array.isArray(arguments[1])) {
    res = context.fn(arguments[1])
  } else {
    throw new Error('arguments not array')
  }
  delete context.fn;
  return res;
}
let result = fn.MyApply({ name: 'this is apply name' }, [2, 3, 5]);
console.log('MyApply', result); // MyApply {x: [1,2,3]}
```
6. 手写 bind

```
    // bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
    // 1. 返回一个新函数
    // 2. 可以传入参数

    Function.prototype.myBind = function () {
      if (typeof this !== 'function') throw new Error('caller must be a function');
      // 保存 this指向
      let self = this;
      // 获取绑定的对象
      let context = arguments[0]
      let args = Array.prototype.slice.call(arguments, 1)
      let fn = function () {
        let fnArgs = Array.prototype.slice.call(arguments)
        // bind 函数的参数 + 延迟函数的参数
        self.apply(this instanceof self ? this : context, args.concat(fnArgs)
        )
      }
      fn.prototype = Object.create(self.prototype) // 维护原型
      return fn
    }

    Function.prototype.myBind = function (context) {
      if (typeof this !== "function") {
         throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
      }
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
    var value = 2;

    var foo = {
      value: 1
    };

    function bar(name, age) {
      this.habit = 'shopping';
      console.log(this.value);
      console.log(name);
      console.log(age);
    }

    bar.prototype.friend = 'kevin';

    var bindFoo = bar.myBind(foo, 'daisy');

    var obj = new bindFoo('18');
    // undefined
    // daisy
    // 18
    console.log(obj.habit);
    console.log(obj.friend);
```
7. 手写函数柯里化
```
function Curry (fn, ...arg) {
  if (fn.length <= arg.length) {
    return fn(...arg);
  } else {
    return function( ...arg2) {
      return Curry(fn,...arg, ...arg2)
    }
  }
}
function add(a, b, c) {
  return a + b + c;
}
console.log('柯里化',Curry(add, 1)(2)(3)) // 6
就是个闭包，等参数传递完成之后一起执行
```
8. 继承
```
<!-- 组合继承 -->
function Parent (value) {
  this.val = value;
}
Parent.prototype.getValue = function () {
  console.log(this.val);
}
function Child (value) {
  Parent.call(this, value);
}
Child.prototype = new Parent();
let Child = new Child(1);
child.getValue() // 1;
console.log(child instanceof Parent); // true;
<!-- 寄生组合继承 -->
function Parent (value) {
  this.val = value;
}
Parent.prototype.getValue = function () {
  console.log(this.val);
}
function Child(value) {
  Parent.call(this, value);
}
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true,
  }
})
const child = new Child(1);
child.getValue(); // 1
child instanceof Parent  // true;
```
9. 数组去重： indexOf, new Set, map.has()

```
function unique(arr) {
  let res = [];
  for(let i = 0; i< arr.length; i++) {
    for
  }
}

```
