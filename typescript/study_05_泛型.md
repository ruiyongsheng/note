
1. 泛型： 可以支持不特定的数据类型 要求：春如的参数和返回的参数一致
2. 泛型函数
```
function getData<T>(value:T):T {
    return  value;
}
getData<number>(12);
// getData<number>('12');  语法报错了
```
3 . 泛型类：比如有个最小堆算法，需要同时支持返回数字和字符串两种类型。通过类的泛型来实现
```
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
```
4 . 泛型接口
```
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
```