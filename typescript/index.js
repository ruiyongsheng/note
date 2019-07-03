var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 布尔值
var isDone = false;
isDone = false;
console.log(isDone);
// 数字类型 number
var decLiteral = 6;
console.log(decLiteral);
// 字符串类型
var test_name = 'bob';
test_name = '124';
console.log(test_name);
// 数组 类型
var list = [1, 2, 3];
console.log(list);
var arr = [1, 2, 3, 4,];
console.log(arr);
// 元组 Tuple
// Declare a tuple type
var x;
// Initialize it
x = ['hello', 10, 'ni', 'hao', 'shun', 'sha', 'ne']; // OK
// Initialize it incorrectly
// x = [10, 'hello']; // Error
console.log(x[0].substr(1)); // OK
// console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
// 当访问一个越界的元素，会使用联合类型替代
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
// x[6] = true; // Error, 布尔不是(string | number)类型
// 枚举
// enum类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字
// enum Color {Red = 1, Green = 2, Blue = 4}
// let c: Color = Color.Green;
// console.log(c);
var Color;
(function (Color) {
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Blue"] = 4] = "Blue";
})(Color || (Color = {}));
var colorName = Color[4];
console.log(colorName); // 显示'Green'因为上面代码里它的值是2
// any 类型
var notSure = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
// void 类型
function warnUser() {
    console.log("This is my warning message");
}
// 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
var unusable = undefined;
// Null 和 Undefined
var u = undefined;
var n = null;
// never 类型
// 返回never的函数必须存在无法达到的终点
function error(message) {
    throw new Error(message);
}
// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}
// 返回never的函数必须存在无法达到的终点
function infiniteLoop() {
    while (true) {
    }
}
// create({ prop: 0 }); // OK
// create(null); // OK
// create(42); // Error
// create("string"); // Error
// create(false); // Error
// create(undefined); // Error
// 类型断言
// 1. 尖括号语法
var someValue = "this is a string";
var strLength = someValue.length;
// 2. 另一种为as语法：
// let someValue: any = "this is a string";
// let strLength: number = (someValue as string).length;
// 两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在TypeScript里使用JSX时，只有 as语法断言是被允许的
// 关于let
// 你可能已经注意到了，我们使用let关键字来代替大家所熟悉的JavaScript关键字var。 let关键字是JavaScript的一个新概念，TypeScript实现了它。 我们会在以后详细介绍它，很多常见的问题都可以通过使用 let来解决，所以尽可能地使用let来代替var吧。
var Per = /** @class */ (function () {
    function Per(name) {
        this.name = name;
    }
    Per.prototype.getName = function () {
        return this.name;
    };
    Per.prototype.setName = function (name) {
        this.name = name;
    };
    return Per;
}());
var p = new Per('张三');
console.log(p.getName());
p.setName('李四');
console.log(p.getName());
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    Person.prototype.run = function () {
        return this.name + "\u5728\u8FD0\u52A8";
    };
    return Person;
}());
var p1 = new Person('王五');
console.log(p1.run()); // 王五在运动
var web = /** @class */ (function (_super) {
    __extends(web, _super);
    function web(name) {
        return _super.call(this, name) || this;
    }
    web.prototype.work = function () {
        return this.name + "\u5728\u5DE5\u4F5C";
    };
    return web;
}(Person));
var w = new web('web');
console.log(w.run()); // web在运动
console.log(w.work()); // web在工作
var animal = /** @class */ (function () {
    function animal(name) {
        this.name = name;
    }
    return animal;
}());
// var a = new animal(); 错误写法，抽象类不能被实例化
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    // 抽象类的子类必须实现抽象类里面的抽象方法
    function Dog(name) {
        return _super.call(this, name) || this;
    }
    Dog.prototype.eat = function () {
        console.log(this.name + '吃粮食');
    };
    return Dog;
}(animal));
var d = new Dog('小黑狗');
d.eat(); // 小黑狗吃粮食
function printName(name) {
    console.log(name.firstName + name.secondName);
}
var obj = {
    firstName: '张',
    secondName: '三',
};
printName(obj); // 张三
var obj2 = {
    firstName: '李四',
    secondName: '王五',
};
function printAge(obj) {
    console.log(obj.firstName + obj.secondName);
}
printAge(obj2); // 李四王五
function ajax(config) {
    var xhr = new XMLHttpRequest();
    xhr.open(config.type, config.url, true);
    xhr.send(config.data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('success');
            if (config.dataType == 'json') {
                console.log(JSON.parse(xhr.responseText));
            }
            else {
                console.log(xhr.responseText);
            }
        }
    };
}
ajax({
    type: 'get',
    url: 'http://a.itying.com/api/productlist',
    dataType: 'json',
});
var md5 = function (key, value) {
    //   模拟操作
    return key + value;
};
console.log(md5('name', 'zambian'));
var md8 = function (key, value) {
    //   模拟操作
    return key + '----' + value;
};
console.log(md8('name', 'zambian'));
var arr1 = ['111', '222'];
console.log(arr1[0]);
var arr2 = { name: 'john' };
var Cat = /** @class */ (function () {
    function Cat(name) {
        this.name = name;
    }
    Cat.prototype.eat = function () {
        console.log(this.name + '吃mouse');
    };
    return Cat;
}());
var cat = new Cat('小花喵');
cat.eat();
var Dog = /** @class */ (function () {
    function Dog(name) {
        this.name = name;
    }
    Dog.prototype.eat = function () {
        console.log(this.name + '吃粮食');
    };
    return Dog;
}());
var D = new Dog('小黑狗');
D.eat();
var Program = /** @class */ (function () {
    function Program(name) {
        this.name = name;
    }
    Program.prototype.coding = function (code) {
        console.log(this.name + code);
    };
    return Program;
}());
var Web = /** @class */ (function (_super) {
    __extends(Web, _super);
    function Web(name) {
        return _super.call(this, name) || this;
    }
    Web.prototype.eat = function () {
        console.log(this.name + '喜欢吃馒头');
    };
    Web.prototype.work = function () {
        console.log(this.name + '喜欢工作');
    };
    return Web;
}(Program));
var w1 = new Web('小李');
w1.coding('学typescript');
// 小李学typescript;
// 泛型： 可以支持不特定的数据类型 要求：春如的参数和返回的参数一致
function getData(value) {
    return value;
}
getData(12);
// getData<number>('12');  语法报错了
// 泛型类：比如有个最小堆算法，需要同时支持返回数字和字符串两种类型。通过类的泛型来实现
var MinClass = /** @class */ (function () {
    function MinClass() {
        this.list = [];
    }
    MinClass.prototype.add = function (value) {
        this.list.push(value);
    };
    MinClass.prototype.min = function () {
        var minNum = this.list[0];
        for (var i = 0; i < this.list.length; i++) {
            if (minNum > this.list[i]) {
                minNum = this.list[i];
            }
        }
        return minNum;
    };
    return MinClass;
}());
var m = new MinClass();
m.add(3);
m.add(11);
m.add(1);
m.add(33);
console.log(m.min()); // 1
var m1 = new MinClass();
m1.add('e');
m1.add('f');
m1.add('a');
m1.add('g');
console.log(m1.min()); // 'a'
var setData = function (value1, value2) {
    return value1 + value2;
};
console.log(setData('My name is', '张三')); // My name is 张三
var setDataChange = function (value1, value2) {
    return value1 + value2;
};
console.log(setDataChange('My name is', '张三')); // My name is 张三
console.log(setDataChange(1, 2)); // 3
