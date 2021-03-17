// es5 中的类

1. 通过创建构造函数来创建类
```js
function Person () {
	this.name = '张三';
	this.age = 20;
}
var p = new Person();
console.log(p.name);
// outputs:  张三
```
2 . 构造函数和原型链里增加方法
 ```js
 function Person () {
 	this.name = '张三';
 	this.age = 20; // 属性
 	this.run = function (){  // 实例方法
 	    console.log(this.name + '在运动');
 	}
 }
Person.prototype.sex = '男';
Person.prototype.work = function(){
    console.log(this.name + '工作');
}
Person.getInfo = function(){
    alert('我是静态方法');
}


var p = new Person();
p.run();  // outputs： 张三在运动
p.work(); // outputs： 张三在工作；
 ```
3 . 调用静态方法
Person.getInfo();

4 . es5中的继承 （对象冒充的继承）
```js
function Person () {
 	this.name = '张三';
 	this.age = 20; // 属性
 	this.run = function (){  // 实例方法
 	    console.log(this.name + '在运动');
 	}
 }
Person.prototype.sex = '男';
Person.prototype.work = function(){
    console.log(this.name + '工作');
}
// 定义web类 继承Person 类  原型链 + 对象冒充的组合继承模式
function web(){
    Person.call(this);  // 对象冒充实现继承
}
var w = new web();
w.run(); // 张三在运动
w.work(); // 对象冒充可以继承构造函数的属性和方法，但是不能继承原型链上面的属性和方法
```

5 . 原型链实现继承
```js
function Person () {
 	this.name = '张三';
 	this.age = 20; // 属性
 	this.run = function (){  // 实例方法
 	    console.log(this.name + '在运动');
 	}
 }
Person.prototype.sex = '男';
Person.prototype.work = function(){
    console.log(this.name + '工作');
}
// 定义web类 继承Person 类
function web(){

}
web.prototype = new Person();
var w = new web();
w.run(); // 张三在运动
w.work(); // 张三在工作
```
6 . 原型链实现继承 会遇到的问题？？？
```js
function Person (name,age) {
 	this.name = '张三';
 	this.age = 20; // 属性
 	this.run = function (){  // 实例方法
 	    console.log(this.name + '在运动');
 	}
 }
Person.prototype.sex = '男';
Person.prototype.work = function(){
    console.log(this.name + '工作');
}
// 定义web类 继承Person 类
function web(name,age){

}
web.prototype = new Person();
var w = new web('赵四',20); // 实例化子类的时候没法给父类传参
w.run(); // undefined 在运动
```
7 .  原型链 + 构造函数的组合继承模式

```js
function Person (name,age) {
 	this.name = '张三';
 	this.age = 20; // 属性
 	this.run = function (){  // 实例方法
 	    console.log(this.name + '在运动');
 	}
 }
Person.prototype.sex = '男';
Person.prototype.work = function(){
    console.log(this.name + '工作');
}
// 定义web类 继承Person 类
function web(name,age){
   Person.call(this,name,age) // 对象冒充继承 实例化子类可以给父类传参
}
web.prototype = new Person();
var w = new web('赵四',20);
w.run(); // 赵四 在运动
w.work(); // 赵四在 工作
```

8 .  原型链 + 构造函数的组合继承模式 的另一种方式

```js
function Person (name,age) {
 	this.name = '张三';
 	this.age = 20; // 属性
 	this.run = function (){  // 实例方法
 	    console.log(this.name + '在运动');
 	}
 }
Person.prototype.sex = '男';
Person.prototype.work = function(){
    console.log(this.name + '工作');
}
// 定义web类 继承Person 类
function web(name,age){
   Person.call(this,name,age) // 对象冒充继承 实例化子类可以给父类传参
}
web.prototype = Person.prototype;
var w = new web('赵四',20);
w.run(); // 赵四 在运动
w.work(); // 赵四在 工作
```