## 一、 初涉 mysql;
![](https://user-gold-cdn.xitu.io/2019/4/3/169e213c4c4d7d27?w=1438&h=518&f=png&s=266739)

1. 登录并查看数据库  
```
mysql -u root -p   然后输入数据库连接密码，代表以root身份连接数据库
```
![](https://user-gold-cdn.xitu.io/2019/4/3/169e2158772ac2c1?w=1786&h=482&f=png&s=237617)

2. 创建数据库
![](https://user-gold-cdn.xitu.io/2019/4/3/169e21401168b8fc?w=1794&h=514&f=png&s=199279)
```
CREATE DATABASE (IF NOT EXISTS 可加可不加) [数据库名字(必须小写)]  t2 CHARACTER SET（设置编码格式）= gbk;
```
3. 修改数据库

![](https://user-gold-cdn.xitu.io/2019/4/3/169e20e3e3871911?w=1596&h=506&f=png&s=191833)

4. 删除数据库
 
![](https://user-gold-cdn.xitu.io/2019/4/3/169e21105a065908?w=1726&h=368&f=png&s=141788)

## 二、 数据类型与数据表的操作
  
#### 数据类型
**1. 整型**
![](https://user-gold-cdn.xitu.io/2019/4/3/169e2181a1579bda?w=1966&h=1000&f=png&s=599338)
**2. 浮点型**
![](https://user-gold-cdn.xitu.io/2019/4/3/169e21a67c3a3ca7?w=1982&h=1006&f=png&s=421446) 
**3. 日期时间型**
![](https://user-gold-cdn.xitu.io/2019/4/3/169e21ba8aecdc8e?w=1980&h=996&f=png&s=185190)
**4. 字符型**
![](https://user-gold-cdn.xitu.io/2019/4/3/169e21d35433b287?w=1946&h=1000&f=png&s=415115)

#### 数据表
1. 连接数据库
2. USE 数据库名称
3. 查看自己使用的数据库名称，指令：   **SELECT DATABASE();**
4. 创建数据表 

```
  CREATE TABLE [IF NOT EXITS] table_name(
    column_name data_type,
    ....
  )
  // 示例
  CREATE TABLE tb1( 
      username VARCHAR(20),
      age TINYINT UNSIGNED,
      salary FLOAT(8,2) UNSIGNED 
  );
```
5. 表创建成功之后，查看表；

![](https://user-gold-cdn.xitu.io/2019/4/3/169e22e2b47e4c49?w=1452&h=490&f=png&s=214705)
6. 查看数据表的结构

![](https://user-gold-cdn.xitu.io/2019/4/3/169e2307bc3804fb?w=1774&h=464&f=png&s=193695)

7. 表的插入

![](https://user-gold-cdn.xitu.io/2019/4/3/169e234d9f833f9e?w=1770&h=436&f=png&s=145906)

8. 表的记录查找

![](https://user-gold-cdn.xitu.io/2019/4/3/169e2376394f6928?w=1390&h=452&f=png&s=112073)

示例：

![](https://user-gold-cdn.xitu.io/2019/4/3/169e23b918712c7d?w=1190&h=1024&f=png&s=178319)

## 三、数据表的约束
1. 空值与 **非空约束**
![](https://user-gold-cdn.xitu.io/2019/4/3/169e23ce5cd2c3e0?w=1274&h=544&f=png&s=147687)
示例：
![](https://user-gold-cdn.xitu.io/2019/4/3/169e243d7a15eb04?w=1376&h=1124&f=png&s=191082)

2. 自动递增 设置 **主键约束**
![](https://user-gold-cdn.xitu.io/2019/4/3/169e2805e7cc2a1e?w=1582&h=480&f=png&s=221698)

![](https://user-gold-cdn.xitu.io/2019/4/3/169e2822b5552919?w=1516&h=516&f=png&s=237592)
示例：

![](https://user-gold-cdn.xitu.io/2019/4/3/169e28a7731a41d1?w=1950&h=1392&f=png&s=281020)

**AUTO_INCREMENT 后必须跟PRIMARY KEY
但是PRIMARY KEY可以单独使用**


示例：

![](https://user-gold-cdn.xitu.io/2019/4/3/169e2a27ade9d5cb?w=2080&h=1400&f=png&s=303449)
3. **唯一约束**

![](https://user-gold-cdn.xitu.io/2019/4/3/169e33392e6f21ba?w=1358&h=562&f=png&s=257647)
示例：

![](https://user-gold-cdn.xitu.io/2019/4/3/169e3464c0030dc6?w=1330&h=1254&f=png&s=221538)

4. **默认约束**
![](https://user-gold-cdn.xitu.io/2019/4/3/169e33879c70851e?w=1752&h=438&f=png&s=175499)
示例：


![](https://user-gold-cdn.xitu.io/2019/4/3/169e33de61de8261?w=1326&h=1150&f=png&s=190233)
**什么叫约束：**
![](https://user-gold-cdn.xitu.io/2019/4/3/169e37708232b02c?w=1256&h=946&f=png&s=490867)

![](https://user-gold-cdn.xitu.io/2019/4/3/169e377e310e1025?w=1848&h=954&f=png&s=770341)
编辑数据表的默认存储引擎<br>
mysql配置文件<br>
default-storage-engine = INNODB;


![](https://user-gold-cdn.xitu.io/2019/4/4/169e6feffb8b3ab9?w=1944&h=972&f=png&s=772613)

![](https://user-gold-cdn.xitu.io/2019/4/4/169e704c1f6731a3?w=1776&h=688&f=png&s=566933)