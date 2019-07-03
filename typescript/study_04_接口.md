#### 1. ts中的接口
1.1 属性类接口
```
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
    secondName:'王五',
    firstName:'李四', 
};
function printAge(obj) {
    console.log(obj.firstName + obj.secondName);
}
printAge(obj2); // 李四王五
// 接口的顺序可变，但是字段必须一样，添加？代表参数的是否必填
```
```
// 用ts封装ajax接口；
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
// success
```
1.2 函数类型接口
```
// 函数类型接口：对方法传入的额参数 以及返回值进行约束
// 加密的函数类型接口,用一个接口约束多个函数
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

```
1.3 可索引接口： 数组 | 对象的约束

``` 
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
```
1.4 类类型接口：对类的约束 和 抽象类有点相似
```
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
// 小黑狗吃粮食
// 类方法，eat()方法必须有
```
 1.5 接口的扩展： 接口可以继承接口
```
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
```

