// 布尔值
let isDone:boolean = false;
isDone = false;
console.log(isDone);

// 数字类型 number
let decLiteral: number = 6;
console.log(decLiteral);

// 字符串类型
let test_name:string = 'bob';
test_name = '124';
console.log(test_name);

// 数组 类型
let list: number[] = [1, 2, 3];
console.log(list);
let arr:Array<number> =[1,2,3,4,];
console.log(arr);

// 元组 Tuple

// Declare a tuple type
let x: [string, number,string,string,string,string,string];
// Initialize it
x = ['hello', 10,'ni','hao','shun','sha','ne']; // OK
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

enum Color {Red = 1, Green , Blue = 4}
let colorName: string = Color[4];

console.log(colorName);  // 显示'Green'因为上面代码里它的值是2

// any 类型
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean

// void 类型
function warnUser(): void {
    console.log("This is my warning message");
}

// 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
let unusable: void = undefined;

// Null 和 Undefined
let u: undefined = undefined;
let n: null = null;

// never 类型
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}

// object 类型
// object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。
declare function create(o: object | null): void;

// create({ prop: 0 }); // OK
// create(null); // OK

// create(42); // Error
// create("string"); // Error
// create(false); // Error
// create(undefined); // Error

// 类型断言
// 1. 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 2. 另一种为as语法：
// let someValue: any = "this is a string";
// let strLength: number = (someValue as string).length;
// 两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在TypeScript里使用JSX时，只有 as语法断言是被允许的
// 关于let
// 你可能已经注意到了，我们使用let关键字来代替大家所熟悉的JavaScript关键字var。 let关键字是JavaScript的一个新概念，TypeScript实现了它。 我们会在以后详细介绍它，很多常见的问题都可以通过使用 let来解决，所以尽可能地使用let来代替var吧。

class Per {
    name: string;
    constructor(name:string){
        this.name = name;
    }
    getName():string {
        return this.name;
    }
    setName(name:string):void {
        this.name = name;
    }
}
var p = new Per('张三');
console.log(p.getName());
p.setName('李四');
console.log(p.getName());

class Person {
    name:string;
    constructor(name:string) {
        this.name = name;
    }
    run():string {
        return  `${this.name}在运动`;
    }
}
var p1 = new Person('王五');
console.log(p1.run()); // 王五在运动
class web extends  Person {
    constructor(name:string){
        super(name);
    }
    work() {
        return `${this.name}在工作`
    }
}
var w = new web('web');
console.log(w.run()); // web在运动
console.log(w.work()); // web在工作

abstract class animal {
    name:string;
    constructor(name:string){
        this.name = name;
    }
    abstract eat():any;
}
// var a = new animal(); 错误写法，抽象类不能被实例化
class Dog extends animal {
    // 抽象类的子类必须实现抽象类里面的抽象方法
    constructor(name:any){
        super(name);
    }
    eat(){
        console.log(this.name+'吃粮食')
    }
}
var d = new Dog('小黑狗');
d.eat(); // 小黑狗吃粮食

interface limit {
    firstName: string,
    secondName:string;
}
function printName(name:limit) {
    console.log(name.firstName + name.secondName);
}
let obj = {
    firstName:'张',
    secondName:'三',
};
printName(obj); // 张三
let obj2  = {
    firstName:'李四',
    secondName:'王五',
};
function printAge(obj) {
    console.log(obj.firstName + obj.secondName);
}
printAge(obj2); // 李四王五

interface Config {
    type:string,
    url:string,
    data?:string,
    dataType:string,
}
function ajax(config:Config) {
    let xhr = new XMLHttpRequest();
    xhr.open(config.type,config.url,true);
    xhr.send(config.data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('success');
            if (config.dataType == 'json'){
              console.log( JSON.parse(xhr.responseText));
            } else {
                console.log(xhr.responseText);
            }
        }
    }
}
ajax({
    type:'get',
    url:'http://a.itying.com/api/productlist',
    dataType:'json',
});
// 函数类型接口：对方法传入的额参数 以及返回值进行约束
// 加密的函数类型接口
interface encrypt {
    (key:string,value:string):string;
}
let md5:encrypt = function (key:string,value:string):string {
//   模拟操作
    return key + value;
};
console.log(md5('name','zambian'));

let md8:encrypt = function (key:string,value:string):string {
//   模拟操作
    return key +'----'+ value;
};
console.log(md8('name','zambian'));

// 可索引接口：数组 对象的约束
// ts定义数组的方式
/*
* let arr2:number[] = [111,222];
* let arr1:Array<string> = ['111','222'];
*/
interface UserArr {
    [index:number]:string
}
let arr1:UserArr =['111','222'];
console.log(arr1[0]);

// 可索引接口：对象的约束
interface UserObj {
    [index:string]:string
}
let arr2:UserObj = {name:'john'};

// 类类型接口：对类的约束 和 抽象类有点相似
interface Animal {
    name:string;
    eat(str:string):void;
}
class Cat implements Animal {
    name:string;
    constructor(name:string) {
        this.name = name;
    }
    eat(){
        console.log(this.name +'吃mouse');
    }
}
let cat = new Cat('小花喵');
cat.eat() ;
class  Dog implements Animal{
    name:string;
    constructor(name:string) {
        this.name = name;
    }
    eat(){
        console.log(this.name +'吃粮食');
    }
}
let D = new Dog('小黑狗');
D.eat() ;

// 接口的扩展： 接口可以继承接口
interface Animal {
    eat():void;
}
interface Person2 extends  Animal{
    work():void;
}
class Program {
   public name:string;
   constructor(name:string) {
       this.name = name;
   }
   coding(code:string){
       console.log(this.name+code);
   }
}
class Web extends Program implements Person2{

     constructor(name:string){
         super(name);
     }
     eat() {
         console.log(this.name + '喜欢吃馒头');
     }
     work(): void {
         console.log(this.name + '喜欢工作');
     }
}
let w1 = new Web('小李');
w1.coding('学typescript');
// 小李学typescript;

// 泛型： 可以支持不特定的数据类型 要求：春如的参数和返回的参数一致

function getData<T>(value:T):T {
    return  value;
}
getData<number>(12);
// getData<number>('12');  语法报错了

// 泛型类：比如有个最小堆算法，需要同时支持返回数字和字符串两种类型。通过类的泛型来实现

class MinClass<T> {
    public list:T[] = [];
    add(value:T):viod {
        this.list.push(value);
    }
    min():T {
        let minNum = this.list[0];
        for (let i =0; i< this.list.length;i++) {
            if (minNum > this.list[i]) {
                minNum = this.list[i];
            }
        }
        return minNum;
    }
}
let m = new MinClass<number>();
m.add(3);
m.add(11);
m.add(1);
m.add(33);
console.log(m.min()); // 1
let m1 = new MinClass<string>();
m1.add('e');
m1.add('f');
m1.add('a');
m1.add('g');
console.log(m1.min()); // 'a'

// 泛型接口

interface ConfigFn {
    (value1:string,value2:string):string;
}

let setData:ConfigFn = (value1:string,value2:string):string => {
    return value1 + value2;
};
console.log(setData('My name is','张三')); // My name is 张三

// 开始改造

interface ConfigFnChange {
    <T>(value1:T,value2:T):T;
}

let setDataChange:ConfigFnChange = (value1:T,value2:T):T => {
    return value1 + value2;
};
console.log(setDataChange<string>('My name is','张三')); // My name is 张三
console.log(setDataChange<number>(1,2)); // 3
