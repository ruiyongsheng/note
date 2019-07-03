/*
定义一个操作数据库的库  支持mysql MoogoDb Mssql;
要求1： mysql MoogoDb Mssql 功能都一样，都有 add update delete get方法；
注意： 约束统一的规范 以及代码重用
解决方案： 需要约束规范以定义接口 需要代码重用所以用到泛型
    1. 面向对象编程中  接口是一种规范的定义 它定义了行为和动作的规范
    2. 泛型 通俗理解 ：就是解决  类  方法  接口的复用性
* */

interface DBI <T> {
    add(info:T):boolean;

    update(info:T,id:number):boolean;

    delete(id:number):boolean;

    get(id:number):any[];
}
// 定义一个操作数据库mysql的类

class Mysql_db<T> implements DBI <T>{
    add(info: T): boolean {
        console.log(info);
        return  true;
    }

    delete(id: number): boolean {
        return false;
    }

    get(id: number): any[] {
        return [];
    }

    update(info: T, id: number): boolean {
        return false;
    }
}
// 定义一个操作数据库Mssql的类
class Mssql_db<T> implements DBI<T>{
    add(info: T): boolean {
        return false;
    }

    delete(id: number): boolean {
        return false;
    }

    get(id: number): any[] {
        return [];
    }

    update(info: T, id: number): boolean {
        return false;
    }

}
// 操作用户表 定义一个User类和数据表做映射
class User {
    username: string | undefined;
    password: string | undefined;
}

let u = new User();
u.username = '张三';
u.password = '123456';

let mysql = new Mysql_db<User>(); // 类作为参数来约束数据传入的类型
mysql.add(u);
// User {username: "张三", password: "123456"}