## 基础类型
#### 布尔值
```
let isDone:boolean = false;
isDone = false;
console.log(isDone);
```
#### 数字类型 number

```
let decLiteral: number = 6;
console.log(decLiteral);
```
#### 字符串类型 string
```
let test_name:string = 'bob';
test_name = '124';
console.log(test_name);
```

#### 数组 类型 array
```
let list: number[] = [1, 2, 3];
console.log(list);
let arr:Array<number> =[1,2,3,4,];
console.log(arr);
```

### 元组 Tuple
```
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
x[6] = true; // Error, 布尔不是(string | number)类型
```
 #### 枚举 enum
// enum类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字
```
// enum Color {Red = 1, Green = 2, Blue = 4}
// let c: Color = Color.Green;
// console.log(c);

enum Color {Red = 1, Green , Blue = 4}
let colorName: string = Color[4];
console.log(colorName);  // 显示'Green'因为上面代码里它的值是2
```
####  any 类型
```
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```
###  void 类型
```
function warnUser(): void {
    console.log("This is my warning message");
}

// 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
let unusable: void = undefined;
```

####  Null 和 Undefined
```
let u: undefined = undefined;
let n: null = null;
```
#### never 类型
```
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
```
####  object 类型
object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型。
```
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```
####  类型断言

```
// 1. 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 2. 另一种为as语法：
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
// 两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在TypeScript里使用JSX时，只有 as语法断言是被允许的
```
#### 关于let
你可能已经注意到了，我们使用let关键字来代替大家所熟悉的JavaScript关键字var。 let关键字是JavaScript的一个新概念，TypeScript实现了它。 我们会在以后详细介绍它，很多常见的问题都可以通过使用 let来解决，所以尽可能地使用let来代替var吧。




