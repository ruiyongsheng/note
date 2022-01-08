avaScript 在编程语言界是个异类，它和其他编程语言很不一样，JavaScript 可以在运行的时候动态地改变某个变量的类型。

比如你永远也没法想到像`isTimeout`这样一个变量可以存在多少种类型，除了布尔值`true`和`false`，它还可能是`undefined`、`1`和`0`、一个时间戳，甚至一个对象。

又或者你的代码跑异常了，打开浏览器开始断点，发现`InfoList`这个变量第一次被赋值的时候是个数组`[{name: 'test1', value: '11'}, {name: 'test2', value: '22'}]`，过了一会竟然变成了一个对象`{test1:'11', test2: '22'}`

除了变量可以在运行时被赋值为任何类型以外，JavaScript 中也能实现继承，但它不像 Java、C++、C# 这些编程语言一样基于类来实现继承，而是基于原型进行继承。

这是因为 JavaScript 中有个特殊的存在：对象。每个对象还都拥有一个原型对象，并可以从中继承方法和属性。

提到对象和原型，你曾经是否有过这些疑惑：

1. JavaScript 的函数怎么也是个对象？
2. `__proto__`和`prototype`到底是啥关系？
3. JavaScript 中对象是怎么实现继承的？
4. JavaScript 是怎么访问对象的方法和属性的？

下面我们一起结合问题，来探讨下 JavaScript 对象和继承。

### 原型对象和对象是什么关系

在 JavaScript 中，对象由一组或多组的属性和值组成：

复制代码

```
{

  key1: value1,

  key2: value2,

  key3: value3,

}
```

在 JavaScript 中，对象的用途很是广泛，因为它的值既可以是原始类型（`number`、`string`、`boolean`、`null`、`undefined`、`bigint`和`symbol`），还可以是对象和函数。

不管是对象，还是函数和数组，它们都是`Object`的实例，也就是说在 JavaScript 中，除了原始类型以外，其余都是对象。

这也就解答了疑惑 1：JavaScript 的函数怎么也是个对象？

在 JavaScript 中，函数也是一种特殊的对象，它同样拥有属性和值。所有的函数会有一个特别的属性`prototype`，该属性的值是一个对象，这个对象便是我们常说的“原型对象”。

我们可以在控制台打印一下这个属性：

复制代码

```
function Person(name) {

  this.name = name;

}

console.log(Person.prototype);
```

打印结果显示为：

![Drawing 0.png](https://s0.lgstatic.com/i/image6/M01/34/06/CioPOWBwCzyAM-CAAAAKDg-SVug894.png)

可以看到，该原型对象有两个属性：`constructor`和`__proto__`。

到这里，我们仿佛看到疑惑 “2：`__proto__`和`prototype`到底是啥关系？”的答案要出现了。在 JavaScript 中，`__proto__`属性指向对象的原型对象，对于函数来说，它的原型对象便是`prototype`。函数的原型对象`prototype`有以下特点：

- 默认情况下，所有函数的原型对象（`prototype`）都拥有`constructor`属性，该属性指向与之关联的构造函数，在这里构造函数便是`Person`函数；
- `Person`函数的原型对象（`prototype`）同样拥有自己的原型对象，用`__proto__`属性表示。前面说过，函数是`Object`的实例，因此`Person.prototype`的原型对象为`Object.prototype。`

我们可以用这样一张图来描述`prototype`、`__proto__`和`constructor`三个属性的关系：

![图片1.png](https://s0.lgstatic.com/i/image6/M00/39/C6/Cgp9HWB87hmAPbFxAACJvyE_nJI526.png)

从这个图中，我们可以找到这样的关系：

- 在 JavaScript 中，`__proto__`属性指向对象的原型对象；
- 对于函数来说，每个函数都有一个`prototype`属性，该属性为该函数的原型对象。

这是否就是疑惑 2 的完整答案呢？并不全是，在 JavaScript 中还可以通过`prototype`和`__proto__`实现继承。

### 使用 prototype 和 **proto** 实现继承

前面我们说过，对象之所以使用广泛，是因为对象的属性值可以为任意类型。因此，属性的值同样可以为另外一个对象，这意味着 JavaScript 可以这么做：通过将对象 A 的`__proto__`属性赋值为对象 B，即`A.__proto__ = B`，此时使用`A.__proto__`便可以访问 B 的属性和方法。

这样，JavaScript 可以在两个对象之间创建一个关联，使得一个对象可以访问另一个对象的属性和方法，从而实现了继承，此时疑惑 “3. JavaScript 中对象是怎么实现继承的？”解答完毕。

那么，JavaScript 又是怎样使用`prototype`和`__proto__`实现继承的呢？

继续以`Person`为例，当我们使用`new Person()`创建对象时，JavaScript 就会创建构造函数`Person`的实例，比如这里我们创建了一个叫“Lily”的`Person`：

复制代码

```
var lily = new Person("Lily");
```

上述这段代码在运行时，JavaScript 引擎通过将`Person`的原型对象`prototype`赋值给实例对象`lily`的`__proto__`属性，实现了`lily`对`Person`的继承，即执行了以下代码：

复制代码

```
// 实际上 JavaScript 引擎执行了以下代码

var lily = {};

lily.__proto__ = Person.prototype;

Person.call(lily, "Lily");
```

我们来打印一下`lily`实例：

![Drawing 3.png](https://s0.lgstatic.com/i/image6/M00/33/FE/Cgp9HWBwC56AVE8iAAAQagv5qXA279.png)

可以看到，`lily`作为`Person`的实例对象，它的`__proto__`指向了`Person`的原型对象，即`Person.prototype`。

这时，我们再补充下上图中的关系：

![图片2.png](https://s0.lgstatic.com/i/image6/M00/39/CF/CioPOWB87iuAaqLIAADOJoaQI4k669.png)

从这幅图中，我们可以清晰地看到构造函数和`constructor`属性、原型对象（`prototype`）和`__proto__`、实例对象之间的关系，这是很多初学者容易搞混的。根据这张图，我们可以得到以下的关系：

1. 每个函数的原型对象（`Person.prototype`）都拥有`constructor`属性，指向该原型对象的构造函数（`Person`）；
2. 使用构造函数（`new Person()`）可以创建对象，创建的对象称为实例对象（`lily`）；
3. 实例对象通过将`__proto__`属性指向构造函数的原型对象（`Person.prototype`），实现了该原型对象的继承。

那么现在，关于疑惑 2 中`__proto__`和`prototype`的关系，我们可以得到这样的答案：

- 每个对象都有`__proto__`属性来标识自己所继承的原型对象，但只有函数才有`prototype`属性；
- 对于函数来说，每个函数都有一个`prototype`属性，该属性为该函数的原型对象；
- 通过将实例对象的`__proto__`属性赋值为其构造函数的原型对象`prototype`，JavaScript 可以使用构造函数创建对象的方式，来实现继承。

现在我们知道，一个对象可通过`__proto__`访问原型对象上的属性和方法，而该原型同样也可通过`__proto__`访问它的原型对象，这样我们就在实例和原型之间构造了一条原型链。这里我用红色的线将`lily`实例的原型链标了出来。

![图片3.png](https://s0.lgstatic.com/i/image6/M01/39/CF/CioPOWB87jeAG0OeAADy6IPqiP8527.png)

下面一起来进行疑惑 4 “JavaScript 是怎么访问对象的方法和属性的？”的解答：在 JavaScript 中，是通过遍历原型链的方式，来访问对象的方法和属性。

### 通过原型链访问对象的方法和属性

当 JavaScript 试图访问一个对象的属性时，会基于原型链进行查找。查找的过程是这样的：

- 首先会优先在该对象上搜寻。如果找不到，还会依次层层向上搜索该对象的原型对象、该对象的原型对象的原型对象等（套娃告警）；
- JavaScript 中的所有对象都来自`Object`，`Object.prototype.__proto__ === null`。`null`没有原型，并作为这个原型链中的最后一个环节；
- JavaScript 会遍历访问对象的整个原型链，如果最终依然找不到，此时会认为该对象的属性值为`undefined`。

我们可以通过一个具体的例子，来表示基于原型链的对象属性的访问过程，在该例子中我们构建了一条对象的原型链，并进行属性值的访问：

复制代码

```
// 让我们假设我们有一个对象 o, 其有自己的属性 a 和 b：

var o = {a: 1, b: 2};

// o 的原型 o.__proto__有属性 b 和 c：

o.__proto__ = {b: 3, c: 4};

// 最后, o.__proto__.__proto__ 是 null.

// 这就是原型链的末尾，即 null，

// 根据定义，null 没有__proto__.

// 综上，整个原型链如下:

{a:1, b:2} ---> {b:3, c:4} ---> null

// 当我们在获取属性值的时候，就会触发原型链的查找：

console.log(o.a); // o.a => 1

console.log(o.b); // o.b => 2

console.log(o.c); // o.c => o.__proto__.c => 4

console.log(o.d); // o.c => o.__proto__.d => o.__proto__.__proto__ == null => undefined
```

可以看到，当我们对对象进行属性值的获取时，会触发该对象的原型链查找过程。

既然 JavaScript 中会通过遍历原型链来访问对象的属性，那么我们可以通过原型链的方式进行继承。

也就是说，可以通过原型链去访问原型对象上的属性和方法，我们不需要在创建对象的时候给该对象重新赋值/添加方法。比如，我们调用`lily.toString()`时，JavaScript 引擎会进行以下操作：

1. 先检查`lily`对象是否具有可用的`toString()`方法；
2. 如果没有，则``检查`lily`的原型对象（`Person.prototype`）是否具有可用的`toString()`方法；
3. 如果也没有，则检查`Person()`构造函数的`prototype`属性所指向的对象的原型对象（即`Object.prototype`）是否具有可用的`toString()`方法，于是该方法被调用。

由于通过原型链进行属性的查找，需要层层遍历各个原型对象，此时可能会带来性能问题：

- 当试图访问不存在的属性时，会遍历整个原型链；
- 在原型链上查找属性比较耗时，对性能有副作用，这在性能要求苛刻的情况下很重要。

因此，我们在设计对象的时候，需要注意代码中原型链的长度。当原型链过长时，可以选择进行分解，来避免可能带来的性能问题。

除了通过原型链的方式实现 JavaScript 继承，JavaScript 中实现继承的方式还包括经典继承(盗用构造函数)、组合继承、原型式继承、寄生式继承，等等。

- 原型链继承方式中引用类型的属性被所有实例共享，无法做到实例私有；
- 经典继承方式可以实现实例属性私有，但要求类型只能通过构造函数来定义；
- 组合继承融合原型链继承和构造函数的优点，它的实现如下：

复制代码

```
function Parent(name) {

  // 私有属性，不共享

  this.name = name;

}



// 需要复用、共享的方法定义在父类原型上

Parent.prototype.speak = function() {

  console.log("hello");

};



function Child(name) {

  Parent.call(this, name);

}



// 继承方法

Child.prototype = new Parent();
```

组合继承模式通过将共享属性定义在父类原型上、将私有属性通过构造函数赋值的方式，实现了按需共享对象和方法，是 JavaScript 中最常用的继承模式。

虽然在继承的实现方式上有很多种，但实际上都离不开原型对象和原型链的内容，因此掌握`__proto__`和`prototype`、对象的继承等这些知识，是我们实现各种继承方式的前提。

### 小结

关于 JavaScript 的原型和继承，常常会在我们面试题中出现。随着 ES6/ES7 等新语法糖的出现，我们在日常开发中可能更倾向于使用`class`/`extends`等语法来编写代码，原型继承等概念逐渐变淡。

但不管语法糖怎么先进，JavaScript 的设计在本质上依然没有变化，依然是基于原型来实现继承的。如果不了解这些内容，可能在我们遇到一些超出自己认知范围的内容时，很容易束手无策。

现在，本文开始的四个疑惑我都在文中进行解答了，现在该轮到你了：

1. JavaScript 的函数和对象是怎样的关系？
2. `__proto__`和`prototype`都表示原型对象，它们有什么区别呢？
3. JavaScript 中对象的继承和原型链是什么关系？

把你的想法写在留言区~

00:00

前端进击笔记

精选留言

![img](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABDlBMVEUAAAAAAAArKyscHBwrKyswMDAtLS0xMTEuLi4rKyszMzMzMzMyMjIvLy8zMzMxMTEvLy8tLS0zMzMyMjIxMTEwMDAyMjIwMDAzMzMxMTEwMDAxMTEyMjIzMzMyMjIzMzMxMTEyMjIyMjIyMjIyMjIyMjIyMjIzMzMyMjIzMzMyMjIyMjIzMzMyMjIzMzMyMjIyMjIzMzMyMjIyMjIzMzMyMjIyMjIyMjIzMzMyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIzMzMzMzMyMjIzMzMzMzMzMzMzMzMyMjIzMzMyMjIzMzMzMzMzMzMyMjIzMzMzMzMzMzMyMjIzMzMzMzMyMjIzMzMMFbxYAAAAWXRSTlMAAwYJDBARFRYYHiMkJigqKy0tMzk7PUBBQ0VJTFBSVVlbXGFla3B0dXh/hYeKjY+QkZSVlpiao6ausbK3u73DxcfIys3O0NPY3N3g4uXm6Ovu8fX3+Pr7/Z2GrlIAAAEvSURBVCjPdZJrT8JAEEVvC4ggqAiKiq0vlLa8tIoWBQFBRK0yIrTM//8jfighLWzPh8nNnsnMZrPAAlkxe+Q41DMVGUGiOrHbbzYazb7LpEf9TiVuKzEvx5Q2k7pUUo0HOX9vbsA1aZFNvl9ZI9+x6SWdq1ijyjoApGcWBFizNIAWxUUyTi0gwyUIKXEGZTchlgm3jG4HAAq2XQhWoNMF1QHAZraDFagTHCNMGg4mlbCxlT+MLIRgjWB9hTjp28IZ74vlIV8gQk9i2fqNABqfiJzKVwDk4Xhr3e3QmwQAKfrcXnUp+yfppSzRadCdT2hv2TfkS5/Kv3Av6fsWjgHk1d3NZFa9HfFYk/xzpkb0gT3mr9eR4JLp88f85qCoacXj2NrNp2wfhb0x3h83BKf/ogM3zcQrR7gAAAAASUVORK5CYII=)写留言

Better

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

19

老师讲的好棒👍🏻1. 函数是一种特殊的对象，在对象内部属性拥有仅供 JavaScript引擎读取的 Call 属性的对象称为函数，使用 typeof 检测时会被识别为 function 。2. proto 可以称作指针指向 prototype ，后者实质上也是对象。3. 可以将 proto 比作链，prototype 比作节点，以 null 为顶点链接起来形成原型链，当访问标识符时，实例没有则会去原型链上查找，找到则返回结果，直到顶端 null 没找到则返回 undefined。

全部

编辑回复： 你也好棒！

**2951

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

7

1、Function instanceof Object === true;2、只有函数才有prototype 只有对象才有__proto__;3、一个对象的__proto__指向了另一个对象， 另一个对象的__proto__又指向了其他对象，举例let a = {name : "a"}let b = {age: 12}let c={}c.__proto__ = bb.__proto__ = a此时 c继承了a 和 b b继承了 a，同时他们的继承关系组成了一条原型链

全部

讲师回复： 没毛病！

*聪

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

5

对于构造函数，原型对象等概念不清晰的同学可以看看我的CSDN上的博客（看完一定懂）：《帮你彻底搞懂JS中的prototype、__proto__与constructor（图解）》，没错，原创：码飞_CC，就是我啦~~

**雄

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

3

被删老师你好，我对于”函数的 `prototype` 属性指向它的原型对象“这句话有不同的看法；在此之前你说每个对象的 `__proto__` 指向它的原型对象，我是比较赞成的，所以对于函数，它的原型对象也应该是由 `__proto__` 指向的。那么函数的 `prototype` 要怎么理解的，它应该指向函数的实例对象的原型对象；对于一个函数，它的原型对象应该是 fn.__proto__ = Function.prototype , 也就是对于内置的构造函数 Function 的 prototype 指向它的实例对象 fn 的原型对象；以上是我结合老师讲解后，觉得有一丢丢矛盾的地方，进行了一点点自己的理解，不知道是否有偏差，希望老师能点评一下，万分感谢

全部

讲师回复： 文中应该没有说 prototype 属性指向它的原型对象？prototype 属性可以理解为就是函数的原型对象。 Function.prototype 在实例化之前就存在了，而 fn.__proto__ = Function.prototype 是在实例化过程中，将实例的 __proto__ 属性指向 Function.prototype 从而构成原型链。函数本身、以及函数的实例，这两者需要区分清楚~ 因此，你说的“对于内置的构造函数 Function 的 prototype 指向它的实例对象 fn 的原型对象”，个人认为这样可能更加准确：“fn 这个实例，它的 __proto__ 指向它的构造函数的原型对象，即 Function.prototype”。

**怿

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1

Person.__proto__ === lily.__proto__ ?

讲师回复： lily.__proto__ === Person.prototype； Person.prototype.__proto__ === Object.prototype；

*聪

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1

\1. JavaScript中的函数也是一种对象。除了七种基本类型值，其他的所有都是对象，这就是JS中所谓的万物皆对象。2.__ptoto__属性是对象独有的，prototype属性是函数所独有的，因为函数也是一种对象，所以函数既有__proto__属性，也具有prototype属性，这点需要细细品味！3.对象的继承是依靠原型链来实现的，通过原型链，我们才可以使用其他对象上的属性或方法。

全部

**敏

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

感觉文中“函数是Object的实例，因此Person.prototype的原型对象为Object.prototype。”这一段的逻辑关系有问题，函数是Object的实例，应该是得出Function.__proto__= Object.prototype吧，Person的原型对象是Object的实例才会得出后面的结论。

**远

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

其实 __proto__ 属性是 chrome 自己搞出来的，没有被标准化，并且最新的 chrome 浏览器已经弃用这个属性了，改为 prototype 表示私有属性。标准中有专门用来访问对象原型的方法啊，就是 Object.getPrototypeOf()，标准提供了 Get/SetPrototypeOf 这两个方法用来操作对象的原型，应该避免使用 __proto__ 属性。继承一个对象的话，也是推荐 Object.create 方法，避免使用 __proto__ 属性。

全部

*山

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

当原型链过长时，可以选择进行分解，来避免可能带来的性能问题，请问怎么分解？

讲师回复： 避免使用过长的原型链就可以，比如不使用过深的继承关系

Kerita

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

请问 Person.__proto__ 是什么东西？

讲师回复： Person.prototype.__proto__ === Object.prototype； 其实可以简单地去控制台打印看看的

**6082

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1.每一个构造函数都有一个prototype属性，指向函数的原型对象。并且当创建了一个构造函数后，其原型对象就会默认获得一个constructor属性，该属性解决了对象是由哪个构造函数创造出来的问题，即对象识别；2.每一个原型对象都有一个默认的constructor属性指向构造函数。除了constructor属性，还有__proto__指针；3.每一个对象都有一个__proto__属性，指向原型对象，也叫指针；4.构造函数的原型的原型是由Object生成的。即Foo.prototype.__proto__.constructor===Object 或者等价于Foo.prototype.__proto__===Object.prototype；5.原型链的终点是null,null不再有__proto__指针了。

全部

讲师回复： 妙呀

**玉

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1 都是对象，函数是一个不具体的对象，而对象是一个具体的对象，类似树与柳树的关系2 一个在函数上，一个在对象上3 继承依赖原型链，通过原型链来实现继承

**敏

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

1.javascript中除了基础类型外，都是对象，函数是特殊的对象2.所有对象都有__proto__属性，指向它的构造函数的原型对象，每个函数都有个prototype属性，即原型对象3.原型链某种程度上就可以看做继承的表现

**茂

![right-icon](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4BAMAAABaqCYtAAAAKlBMVEVHcExnZ2dzc3NmZmZqampmZmZmZmZnZ2dnZ2dnZ2dmZmZoaGhmZmZmZmZl+8SAAAAADXRSTlMA/AbsFtilbj5YwSqJPyESoQAAAZxJREFUOMt1lTtLA1EQha8xRhPTBEmhuKCCoNgoIlYLMcRKBG0sxIUgCDaBSDohEO0FEbQyIBZaBazERvAPWCwxPnP+i3tnrlGTmVPswn73NXNm7hrzq9m9kZ2ckTUUABifkOEBrK7liR7BMRFOA/uFc+BUgnV8mFisEW5IsIFi9FzBuwR91KJnAm8S9EIbxSBeBRZHk86MrBQJWjymJUC3nlugSyk+SQyhANfxos+s4krfM0DZvmbw2cuSCHNGi3PAfUygXYiU79ryyw1ibf0xZ9intBsz6SBadx24iiZXz8kPxCiTtYdLPzKTVFkkLQAZO/VikwYW/x/wHohcT/MiPQE8W9frxJrlbpiw4xvA0vbNmWyhj2Nrhmy+B7nEyTsN0rIaJAc0SDWqwX7rhAYfMa/Dui0bDZbwZAwUGNjWUWActnUUyN2hwDTaOkxRaSiwj6pRhjHKgTazSkWlwBK1jgIpBwrkHCgwyZ0oQ86BAjkHCjziG0KE8YBvCA/5KacOm6sgrHFAotouT6J23bkkLbsNDjM9yt7yP+IbQYga5De+eBMAAAAASUVORK5CYII=)

你好，学了以后收货很多。现在还有两点疑问详情见下。1.你说只有函数才有prototype 那object. prototype 是咋回事？2.你打印的Lili的实例的那张图，我看到里面是有两个__proto__是怎么看出来__proto__等于prototype 的

讲师回复： 1. 这里 Object.prototype 指 Object 的原型对象，并不是指 Object 的属性噢 2. 可以在控制台打印判断下噢，lily.__proto__ === Person.prototype