###  mysql的增删改查
1. 插入记录
   第一种方式：      
![](https://user-gold-cdn.xitu.io/2019/4/4/169e76ab23e142a0?w=1442&h=326&f=png&s=130443)
示例：
创建表并插入单条数据，（password字段应该是varchar(32);
![](https://user-gold-cdn.xitu.io/2019/4/4/169e89ed4274048a?w=962&h=1256&f=png&s=154109)
支持一次性插入多条数据，支持默认值，运算符，函数
![](https://user-gold-cdn.xitu.io/2019/4/4/169e8a1c1d003289?w=2154&h=1112&f=png&s=176788)
    第二种方式：
![](https://user-gold-cdn.xitu.io/2019/4/8/169fae40b1b2aef9?w=1736&h=520&f=png&s=194008)
示例：
![](https://user-gold-cdn.xitu.io/2019/4/8/169fae6d61296f79?w=635&h=406&f=png&s=48529)
### 2. 单表更新
![](https://user-gold-cdn.xitu.io/2019/4/8/169fae8685ebef27?w=1656&h=820&f=png&s=250954)
示例：
![](https://user-gold-cdn.xitu.io/2019/4/8/169faf2b88b48d96?w=737&h=978&f=png&s=129055)
### 3. 表删除记录
![](https://user-gold-cdn.xitu.io/2019/4/8/169faf320c33aecd?w=1644&h=400&f=png&s=103891)
示例：
![](https://user-gold-cdn.xitu.io/2019/4/8/169faf748b61a723?w=570&h=288&f=png&s=33202)

### 4. 查询表达式解析；
![](https://user-gold-cdn.xitu.io/2019/4/8/169faf7bcf33822e?w=1526&h=938&f=png&s=384074)

![](https://user-gold-cdn.xitu.io/2019/4/8/169faf9c3d46af0d?w=1438&h=780&f=png&s=386350)

示例：
![](https://user-gold-cdn.xitu.io/2019/4/8/169fafeed881c428?w=484&h=563&f=png&s=40792)

### 5. where语句进行条件查询


![](https://user-gold-cdn.xitu.io/2019/4/8/169fb0004e148bc2?w=1454&h=696&f=png&s=225287)

### 6. group by语句对查询结果分组
![](https://user-gold-cdn.xitu.io/2019/4/8/169fb015c719f4b0?w=1450&h=604&f=png&s=161706)
示例：
![](https://user-gold-cdn.xitu.io/2019/4/8/169fb08122bbf280?w=599&h=473&f=png&s=44440)

### 7. having 进行分组

![](https://user-gold-cdn.xitu.io/2019/4/8/169fb0b43cff669e?w=1386&h=562&f=png&s=101542)

### 8. order by语句对查询结果进行排序
![](https://user-gold-cdn.xitu.io/2019/4/8/169fb87729864144?w=1466&h=588&f=png&s=156399)
示例：
![](https://user-gold-cdn.xitu.io/2019/4/8/169fb8bf47608998?w=594&h=544&f=png&s=65519)

![](https://user-gold-cdn.xitu.io/2019/4/8/169fb8d9d09706de?w=568&h=560&f=png&s=68548)

### 9. 限制查询结果返回数量
![](https://user-gold-cdn.xitu.io/2019/4/8/169fb8e1686d180c?w=1504&h=592&f=png&s=142211)
示例：
![](https://user-gold-cdn.xitu.io/2019/4/8/169fb91d08a0afa3?w=561&h=945&f=png&s=109627)

![](https://user-gold-cdn.xitu.io/2019/4/8/169fb9a6f3a02549?w=648&h=439&f=png&s=63067)


## 总结：
```
** insert: ** 插入语句
(1) INSERT [INTO] tbl_name [(col_name..…)]{ VALUES I VALUE}

({expr I DEFAULT},..)...…

(2) INSERT [INTO] tbl_name SET col_name={expr |DEFAULT},.…

(3) INSERT [INTO] tbl_name [(col_name,..)] SELECT.…

** update ** 单表更新:

UPDATE [ LOW_PRIORITY] IGNORE] table_reference SET col_name1={ expr1lDEFAULT] L, col_name2={ expr2lDEFAULT].…

[ WHERE where_condition]

** delete ** 单表删除：

DELETE FROM tbl_name [WHERE where_condition]

** select ** ：

SELECT select expr L, select_expr..J FROM table_references

[ WHERE where_condition] 查询条件

[ GROUP BY { col_name I position}[ ASC IDESC].…] 进行记录的分组

[ HAVING where_condition]对分组进行条件的设定

[ ORDER BY { col name I expr I position}[ ASC | DESC],.…]对结果进行排序 

[ LIMIT{[ offset,] row_count I row_count OFFSET offset)]限制返回结果的数量
```