ES5 核心技术
#### this 指向谁 
```
   this.a =20;
   var p = {
       a:30,
       test:function(){
       // this→ p;
           alert(this.a);
       }
   }
   p.test();
 ```      
 输出 <b>30</b>；当前this指向p;
  ```   
   this.a =20;
   var p = {
       a:30,
       test:function(){
           alert(this.a);
       }
   }
   // s → 指向window
   var s = p.test; 
   s();
```   
输出 <b>20</b>；当前this指向window;
```
   this.a =20;
   var p = {
       a:30,
       test:function(){
           alert(this.a);
           function s(){
               this.a = 60;
               alert(this.a);
           }
           return s;
       }
   }
   (p.test())();
```   
输出 <i>30</i> <b>60</b>;
 ```  
   this.a =20;
   var p = {
       a:30,
       test:function(){
           function s(){
               alert(this.a);
           }
           return s;
       }
   }
   var s = p.test();
   s();
   ```
输出 20， this指向window;
只是调用了p中的test函数，最后两句你可以这么理解
  ```
   var s = p.test() = function (){
       function s(){
           alert(this.a);
       }
       return s;
   }
   s();
   ```
最后执行的是s函数，它只是个声明函数，没有宿主对象，肯定指向window；
注意看下边写法：
```
   this.a =20;
   var p = {
       a:30,
       test:function(){
           function s(){
               alert(this.a);
           }
           s();
       }
   };
   p.test();
   ```
结果是一样的，输出20，和上例相似，只是写法不同而已；

#### 闭包
```
function f1 (){
   var n = 0;
   function f2(){
       n++;
       console.log(n);
   }
   return f2;
}
var result = f1();
result();
result();
result();
```
输出 1,2,3;函数执行了3次，这就是闭包，n的值一直就存在内存空间中;
```
function f1 (){
   var n = 0;
   function f2(){
       n++;
       console.log(n);
   }
   return f2;
}
var result = f1();
result();
result();
result();
result = null;
``` 
为了解决内存泄露（n一直存在）的问题：<br>
在函数执行后，添加 result = null，变量n就会被内存机制回收；
#### 私有变量
```
function product() {
   var name;
   this.setName = function(value) {
       name = value;
   }
   this.getName = function(){
       return name;
   }
}
var s = new product();
s.setName('hello');
console.log(s.getName());
```
这样就把name变成了私有变量，随用随取，就不会造成内存泄露；
#### 原型链
```
var Car = function(){
   // constructor（初始化的类） == Car 构造函数和初始化这个类就是一个东西了；
}
var s = new Car();
console.log(s);
```
如图所示：
![初始化的类等同于构造函数](https://user-gold-cdn.xitu.io/2018/2/28/161dc3f797c757e1?w=352&h=160&f=png&s=11072)

这时候给它添加属性color；

   var Car = function(color){
       // constructor（初始化的类） == Car 构造函数和初始化这个类就是一个东西了；
       this.color = color;
       this.sale = function(){
           console.log(this.color+'色的车卖13W一台')；
       }
    }
    var s = new Car('red');
    console.log(s.sale());
结果如图：
![](https://user-gold-cdn.xitu.io/2018/2/28/161dc4b71b494022?w=418&h=177&f=png&s=16143)
![](https://user-gold-cdn.xitu.io/2018/2/28/161dc4bf3afa99c6?w=423&h=165&f=png&s=17505)

上述是把父类创建成功了,然后创建子类，让子类继承父类方法；
```
var Car = function(color){
   // constructor（初始化的类） == Car 构造函数和初始化这个类就是一个东西了；
   this.color = color;
   console.log('111');
}
// 将sale挂载在构造函数的原型prototype上；
Car.prototype.sale = function(){
   console.log(this.color+'色的车卖13W一台')；
}
// 创建子类
var BMW = function(){
   // call是改变this指向；
   Car.call(this,color);
}
// 按引用传递；
BMW.prototype = new Car();
var m = new BMW('red');
console.log(m);
```
常规做法，得到结果如图

![](https://user-gold-cdn.xitu.io/2018/2/28/161dc723e7434ae0?w=625&h=443&f=png&s=55268)

结果显示，构造函数被执行了2遍，这样肯定是不科学的；这时候我们要解决如下问题

   1.拿到父类原型链上的方法； 
   2.不能让构造函数执行2次；
   3.引用的原型不能按值引用；
   4.修正子类的constructor;
所以，
```
var Car = function(color){
   // constructor（初始化的类） == Car 构造函数和初始化这个类就是一个东西了；
   this.color = color;
   console.log('111');
}
// 将sale挂载在构造函数的原型prototype上；
Car.prototype.sale = function(){
   console.log(this.color+'色的车卖13W一台')；
}
// 创建子类
var BMW = function(){
   // call是改变this指向；
   Car.call(this,color);
}
// 按引用传递；
//1.拿到父类原型链上的方法； 
//2.不能让构造函数执行2次；
//3.引用的原型不能按址引用；
//4.修正子类的constructor;

var __pro = Object.create(Car.prototype); // 第一：创建构造函数原型副本；
__pro.constructor = BMW;  // 第二步：修正子类的contructor;
BMW.prototype = __pro;     // 第三步：给子类原型赋值；
var m = new BMW('red');
console.log(m);
```
结果如图：

![](https://user-gold-cdn.xitu.io/2018/2/28/161dc80c862b9138?w=716&h=537&f=png&s=79009)

#### 函数提升
函数提升比变量提升  优先级高；
 ```     
   (function(){
       var a =20;
       var b= c =a;
   })();
   alert(c); 输出c 为 20；
   
    (function(){
       var a =20;
       var b, c = a;
   })();
   alert(c); 输出c is not defined;
   
   function test (){
       this.a = 20;
   }
   test.prototype.a = 30;
   var q = new test;
   alert(q.a); 输出 20;构造函数的a比原型链上的a优先级高；
   
   var user = {
       age:20,
       init:function(){
           console.log(this.age);
       }
   }
   var data ={age:40};
   var s= user.init.bind(data); //返回一个新对象；
   s(); 输出为40；
```   
   
总结： 

   1.立即执行函数；<br>
   2.闭包： 内部函数可以访问外部函数的变量，把函数返回出去；<br>
   闭包可以保护内部的变量 闭包会造成内存泄露，解决方法，在使用完后将其== null；<br>
   3.原型链 <br>
    3.1 构造函数里的属性的优先级比原型链的要高；<br>
    3.2 面向对象编程时，js(es5)中没有类的概念，可以用函数替代 <br>
    3.3 constructor实际就是对应的那个函数；<br>
    3.4 prototype按引用传递的 Object.create原型链的副本；<br>
   4.数值 字符串 布尔类型 按值传递     按引用传递 （对象、数组） <br>
   5.改变this的方法 call apply bind <br>
   6.函数提升 变量提升 函数提升的级别要比变量高 <br>