## 一、js基础知识点及常考面试题

### 原始（Primitive）类型
>涉及面试题： 1.原始类型有哪几种？null是对象么？
js中，有6种原始值，分别是：

* boolean
* null
* undefined
* number
* string
* symbol

### 对象（Objecet）类型

```
涉及面试题：对象类型和原始类型的不同之处？函数参数是对象，会发生什么问题？
js数据类型：
原始数据类型： 按值传递
对象类型：按引用传递（空间/指针）
```
示例：
```javascript
function test(person) {
  person.age = 26
  person = {
    name: 'yyy',
    age: 30
  }

  return person
}
const p1 = {
  name: 'yck',
  age: 25
}
const p2 = test(p1)
console.log(p1) // -> ? {name:'yck',age:26};
console.log(p2) // -> ? {name: 'yyy',age:30};
```

* 首先，函数传参是传递对象指针的副本
* 函数内部修改参数属性，代表引用更改，所以**P1**的值也被更改
* 重新为person分配对象时，person拥有了新的指针，和**p1**没啥关系了。
#### typeof vs instanceof

```!
面试题：typeof是否能正确判断类型？instanceof能正确判断对象的原理是什么？
```

typeof 对象原始类型来说，除了null都可以显示正确的类型：
```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
```
typeof对于对象来说，除了函数都会显示object,所以说typeof并不能准确判断变量到底是什么类型
```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```
想判断一个对象的正确类型，考虑使用**instanceof**,因为内部机制是通过原型链来判断的
```javascript
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

var str = 'hello world'
str instanceof String // false

var str1 = new String('hello world')
str1 instanceof String // true
```
对于原始类型来说，你想直接通过 instanceof 来判断类型是不行的，当然我们还是有办法让 instanceof 判断原始类型的
```
class PrimitiveString {
  static [Symbol.hasInstance](x) {
    return typeof x === 'string'
  }
}
console.log('hello world' instanceof PrimitiveString) // true
```
你可能不知道 `Symbol.hasInstance` 是什么东西，其实就是一个能让我们自定义 instanceof 行为的东西，以上代码等同于 `typeof    'hello world' === 'string'`，所以结果自然是 true 了。这其实也侧面反映了一个问题， instanceof 也不是百分之百可信的。

### 类型转换

![](https://user-gold-cdn.xitu.io/2020/5/19/1722aee3fcd1f466?w=1004&h=716&f=png&s=328633)

#### 转Boolean
在条件判断时，除了 `undefined， null， false， NaN， ''， 0， -0`，其他所有值都转为 true，包括所有对象。
#### 对象转原始类型
对象在转换类型的时候，会调用内置的`[[ToPrimitive]]`函数，对于该函数来说，算法逻辑一般如下：

* 如果已经是原始类型了，就不需要转换了
* 调用`x.valueOf()`,如果转换为基础类型，就返回转换的值
* 调用`x.toString()`,如果转换为基础类型，就返回转换的值
* 如果都没有返回原始类型，就会报错
当然你也可以重写`Symbol.toPrimitive`,该方法在转原始类型调用优先级最高。
```javascript
let  a = {
    valueOf() {
        return 0
    },
    toString() {
        return '1'
    },
    [Symbol.toPrimitive](){
        return 2
    }
}
1 + a // => 3
```
#### 四则运算符
加法运算符不同于其他几个运算符，它有以下几个特点：

* 特点一：运算中其中一方为字符串，那么就会把另一方也转换为字符串
* 特点二：如果一方不是字符串或者数字，那么会将它转换为数字或者字符串
```
1 + '1' // '11' 特点一
true + true  // 2 特点二
4 + [1,2,3] // '41,2,3'  特点二：将数组toString得到1,2,3
```
另外对于加法还需要注意这个表达式 'a' ++ 'b'
```
'a' ++'b' // -> 'aNaN'
```
因为`+'b'`等于`NaN`,所以结果为'aNaN',你可能也会在一些代码中看到过`+'1'`的形式快速获取`number`类型。
那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字
```
4*'3' // 12
4*[] // 0
4*[1,2] // NaN
```
比较运算符

* 如果是对象，就通过`toPrimitive`转换对象
* 如果是字符串，就通过`unicode`字符索引来比较
```
let a = {
    valueOf() {
        return 0
    },
    toString () {
        return '1'
    }
}
a > -1 // true
```
在以上代码中，因为`a`是对象，所以会通过`valueOf`转换为原始类型在比较值
#### this
```!
如何正确判断this,箭头函数的this是什么？
```
```js
function foo() {
  console.log(this.a)
}
var a = 1
foo() // 1   this指向window，实际为window.foo();

const obj = {
  a: 2,
  foo: foo
}
obj.foo() // 2  this执行obj

const c = new foo() // undefined this指向c
```

![](https://user-gold-cdn.xitu.io/2020/5/19/1722bb993dd27474?w=968&h=684&f=png&s=109403)
#### == vs ===

![](https://user-gold-cdn.xitu.io/2020/5/19/1722bd55e8aeebe5?w=1106&h=556&f=png&s=201130)

#### 闭包
```!
什么是闭包？
函数A内部有一个函数B，函数B可以访问到函数A中的变量，那么函数B就是闭包
```
```js
function A() {
  let a = 1
  window.B = function () {
      console.log(a)
  }
}
A()
B() // 1
```
在js中，闭包存在的意思就是让我们可以间接访问函数内部的变量
>经典面试题，循环中使用闭包解决`var`定义函数的问题
```
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```
首先因为`setTimeout`是个异步函数，所以会先把循环执行完毕，这时候i就是6了，所以会输出一堆6。
<br>
解决办法有三种：
```js
for(var i =1; i<=5;i++) {
    ;(function(j) {
        setTimeout(function timer () {
            console.log(j);
        },j*1000)
    }
    )(i)
}
```
在上述代码中，我们首先使用了立即执行函数将`i` 传入函数内部，这个时候值就被固定在了参数`j`上面不会改变，当下次执行`timer`这个闭包的时候，就可以使用外部函数的变量`j`,从而达到目的。<br>
第二种就是使用`setTimeout`的第三个参数，这个参数会被当成`timer`函数的参数传入。
```js
for(var i =1; i<=5;i++) {
    setTimeout(function timer(j) {
        console.log(j);
    },
    i*1000,
    i)
}
```
第三种就是使用`let`定义`i`了来解决这个问题
```js
for(let i = 1; i<=5; i++) {
    setTimeout(function timer() {
        console.log(i);
    }, i*1000)
}
```
### 深浅拷贝
```!
什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？
```
#### 浅拷贝
`Object.assign` 浅拷贝，只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址，并不是深拷贝.
```js
let a = {
  age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```
另外，我们还可以通过展开运算符（扩展运算符）`...`来实现浅拷贝
```js
let a = {
  age: 1
}
let b = { ...a }
a.age = 2
console.log(b.age) // 1
```
通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况就可以需要使用到深拷贝了
```
let a = {
  age: 1,
  jobs: {
    first: 'FE'
  }
}
let b = { ...a }
a.jobs.first = 'native'
console.log(b.jobs.first) // native
```
浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到最开始的话题，两者享有相同的地址。要解决这个这个问题，就得使用深拷贝了。

#### 深拷贝
这个问题通常可以通过`JSON.parse(JSON.stringify(object))` 来解决。
```js
let a = {
  age: 1,
  jobs: {
    first: 'FE'
  }
}
let b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) // FE
```
但是该方法也是有局限性的：

* 会忽略 `undefined`
* 会忽略 `Symbol`
* 不能序列化函数
* 不能解决循环引用的对象
```js
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
}
obj.c = obj.b
obj.e = obj.a
obj.b.c = obj.c
obj.b.d = obj.b
obj.b.e = obj.b.c
let newObj = JSON.parse(JSON.stringify(obj))
console.log(newObj)
```
如果你有这么一个循环引用的对象，你会发现并不能通过该方法实现深拷贝


![](https://user-gold-cdn.xitu.io/2020/5/19/1722d1b130e59b9c?w=1284&h=166&f=png&s=208263)
在遇到函数、`undefined`或者`symbol`的时候，该对象也不能正常的序列化
```js
let a = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function() {},
  name: 'yck'
}
let b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "yck"}
```
你会发现在上述情况中，该方法会忽略掉函数和 `undefined` 。<br>
当然你可能想自己来实现一个深拷贝，但是其实实现一个深拷贝是很困难的，需要我们考虑好多种边界情况，比如原型链如何处理、DOM 如何处理等等，lodash 的深拷贝函数。
```js
function deepClone(obj) {
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null
  }

  if (!isObject(obj)) {
    throw new Error('非对象')
  }

  let isArray = Array.isArray(obj)
  let newObj = isArray ? [...obj] : { ...obj }
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
  })

  return newObj
}

let obj = {
  a: [1, 2, 3],
  b: {
    c: 2,
    d: 3
  }
}
let newObj = deepClone(obj)
newObj.b.c = 1
console.log(obj.b.c)  // 2
```
#### 原型
```!
如何理解原型？如何理解原型链
```
当我们创建一个对象时`let obj = { age: 25 }`，我们可以发现能使用很多种函数，但是我们明明没有定义过它们，对于这种情况你是否有过疑惑？

![](https://user-gold-cdn.xitu.io/2020/5/19/1722d583f792fd2c?w=488&h=180&f=png&s=37777)
当我们在浏览器中打印 obj 时你会发现，在 obj 上居然还有一个` __proto__` 属性，那么看来之前的疑问就和这个属性有关系了。

**其实每个 JS 对象都有 `__proto__` 属性，这个属性指向了原型**。这个属性在现在来说已经不推荐直接去使用它了，这只是浏览器在早期为了让我们访问到内部属性 [[prototype]] 来实现的一个东西。

讲到这里好像还是没有弄明白什么是原型，接下来让我们再看看 `__proto__` 里面有什么吧。

![](https://user-gold-cdn.xitu.io/2020/5/19/1722d5a387ba3342?w=770&h=546&f=png&s=363723)
看到这里你应该明白了，原型也是一个对象，并且这个对象中包含了很多函数，所以我们可以得出一个结论：对于 obj 来说，可以通过 `__proto__` 找到一个**原型对象**，在该对象中定义了很多函数让我们来使用。

在上面的图中我们还可以发现一个 `constructor` 属性，也就是**构造函数**

![](https://user-gold-cdn.xitu.io/2020/5/19/1722d5c7f1fa66de?w=1210&h=852&f=png&s=586761)
打开 `constructor` 属性我们又可以发现其中还有一个 `prototype` 属性，并且这个属性对应的值和先前我们在 `__proto__` 中看到的一模一样。所以我们又可以得出一个结论：**原型的 constructor 属性指向构造函数，构造函数又通过 prototype 属性指回原型**，但是并不是所有函数都具有这个属性，Function.prototype.bind() 就没有这个属性。

![](https://user-gold-cdn.xitu.io/2020/5/19/1722d5e63ac2e462?w=1190&h=1564&f=png&s=935869)
看完这张图，我再来解释下什么是原型链吧。其实原型链就是多个对象通过 `__proto__` 的方式连接了起来。<br>
为什么 obj 可以访问到 valueOf 函数，就是因为 obj 通过原型链找到了 valueOf 函数。

对于这一小节的知识点，总结起来就是以下几点：


* Object 是所有对象的爸爸，所有对象都可以通过 __proto__ 找到它

* Function 是所有函数的爸爸，所有函数都可以通过 __proto__ 找到它

* 函数的 prototype 是一个对象

* 对象的 `__proto__` 属性指向原型， `__proto__` 将对象和原型连接起来组成了原型链

![](https://user-gold-cdn.xitu.io/2020/5/19/1722d62faf051951?w=862&h=1460&f=png&s=275816)