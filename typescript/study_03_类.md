1. ts中定义类
```
class Person {
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
var p = new Person('张三');
console.log(p.getName());
p.setName('李四');
console.log(p.getName());
```
2 . ts中实现继承

```
class Person {
    name:string;
    constructor(name:string) {
        this.name = name;
    }
    run():string {
        return  `${this.name}在运动`;
    }
}
var p = new Person('王五');
console.log(p.run()); // 王五在运动
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
```
3 . typescript 类里边的修饰符 <br>
```
public: 公有， 在类里面、子类、类外面都可以访问 
protected: 保护类型 在类里面、子类里面可以访问，在类外部都没法访问
private: 私有 在类里边可以访问，子类、类外部都没法访问
static: 静态方法  静态方法不能直接调用类里边的属性和方法，只能调用类里边的静态（static）属性

属性如果不加修饰符就代表public

 ```  
 4 . typescript中的多态:
 父类定义一个方法不去实现，让继承它的子类去实现，每一个子类有不同表现<br>
 多态属于继承的一种
 ```
 class animal {
    name:string;
    constructor(name:string) {
        this.name = name;
    }
    eat() { // 吃什么，不知道，继承他的子类去实现，每个子类表现都不一样；
        console.log('吃的方法')；
    }
 }
 class Dog extends animal {
    constructor(name:string) {
        super(name);
    }
    eat() {
       return this.name +'吃粮食'
    }
 }
 class Cat extends animal {
     constructor(name:string) {
         super(name);
     }
     eat() {
        return this.name +'吃老鼠'
     }
  }
 ```
 5 . typescript中的抽象类：它是提供其他类继承的基类，不能直接被实例化；<br/>
 // 用 abstract 关键字定义抽象类和抽象方法，抽象类中的抽象方法不包含具体实现并且必须在派生类中实现;<br/>
 // 用 abstract 抽象方法只能放在抽象类里面
 // 抽象类和抽象方法用来定义标准，标准： animal 这个类要求它的子类必须包含eat方法
 ```
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
 ```