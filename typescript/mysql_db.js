/*
定义一个操作数据库的库  支持mysql MoogoDb Mssql;
要求1： mysql MoogoDb Mssql 功能都一样，都有 add update delete get方法；
注意： 约束统一的规范 以及代码重用
解决方案： 需要约束规范以定义接口 需要代码重用所以用到泛型
    1. 面向对象编程中  接口是一种规范的定义 它定义了行为和动作的规范
    2. 泛型 通俗理解 ：就是解决  类  方法  接口的复用性
* */
// 定义一个操作数据库mysql的类
var Mysql_db = /** @class */ (function () {
    function Mysql_db() {
    }
    Mysql_db.prototype.add = function (info) {
        console.log(info);
        return true;
    };
    Mysql_db.prototype.delete = function (id) {
        return false;
    };
    Mysql_db.prototype.get = function (id) {
        return [];
    };
    Mysql_db.prototype.update = function (info, id) {
        return false;
    };
    return Mysql_db;
}());
// 定义一个操作数据库Mssql的类
var Mssql_db = /** @class */ (function () {
    function Mssql_db() {
    }
    Mssql_db.prototype.add = function (info) {
        return false;
    };
    Mssql_db.prototype.delete = function (id) {
        return false;
    };
    Mssql_db.prototype.get = function (id) {
        return [];
    };
    Mssql_db.prototype.update = function (info, id) {
        return false;
    };
    return Mssql_db;
}());
// 操作用户表 定义一个User类和数据表做映射
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
var u = new User();
u.username = '张三';
u.password = '123456';
var mysql = new Mysql_db(); // 类作为参数来约束数据传入的类型
mysql.add(u);
// User {username: "张三", password: "123456"}
