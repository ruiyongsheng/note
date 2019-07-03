## 子查询与连接
### 1.子查询是指在另一个查询语句中的SELECT子句。

  例句：

  SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);

  其中，SELECT * FROM t1 ...称为Outer Query[外查询](或者Outer Statement),

  SELECT column1 FROM t2 称为Sub Query[子查询]。

  所以，我们说子查询是嵌套在外查询内部。而事实上它有可能在子查询内部再嵌套子查询。

  子查询必须出现在圆括号之间。
  

  行级子查询

  SELECT * FROM t1 WHERE (col1,col2) = (SELECT col3, col4 FROM t2 WHERE id = 10);

  SELECT * FROM t1 WHERE ROW(col1,col2) = (SELECT col3, col4 FROM t2 WHERE id = 10);
  
  行级子查询的返回结果最多为一行。
  
 示例：
 ```
 -- 创建数据表

  CREATE TABLE IF NOT EXISTS tdb_goods(
    goods_id    SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    goods_name  VARCHAR(150) NOT NULL,
    goods_cate  VARCHAR(40)  NOT NULL,
    brand_name  VARCHAR(40)  NOT NULL,
    goods_price DECIMAL(15,3) UNSIGNED NOT NULL DEFAULT 0,
    is_show     BOOLEAN NOT NULL DEFAULT 1,
    is_saleoff  BOOLEAN NOT NULL DEFAULT 0
  );

 -- 写入记录
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('R510VC 15.6英寸笔记本','笔记本','华硕','3399',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Y400N 14.0英寸笔记本电脑','笔记本','联想','4899',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('G150TH 15.6英寸游戏本','游戏本','雷神','8499',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('X550CC 15.6英寸笔记本','笔记本','华硕','2799',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('X240(20ALA0EYCD) 12.5英寸超极本','超级本','联想','4999',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('U330P 13.3英寸超极本','超级本','联想','4299',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('SVP13226SCB 13.3英寸触控超极本','超级本','索尼','7999',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('iPad mini MD531CH/A 7.9英寸平板电脑','平板电脑','苹果','1998',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('iPad Air MD788CH/A 9.7英寸平板电脑 （16G WiFi版）','平板电脑','苹果','3388',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES(' iPad mini ME279CH/A 配备 Retina 显示屏 7.9英寸平板电脑 （16G WiFi版）','平板电脑','苹果','2788',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('IdeaCentre C340 20英寸一体电脑 ','台式机','联想','3499',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Vostro 3800-R1206 台式电脑','台式机','戴尔','2899',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('iMac ME086CH/A 21.5英寸一体电脑','台式机','苹果','9188',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('AT7-7414LP 台式电脑 （i5-3450四核 4G 500G 2G独显 DVD 键鼠 Linux ）','台式机','宏碁','3699',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Z220SFF F4F06PA工作站','服务器/工作站','惠普','4288',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('PowerEdge T110 II服务器','服务器/工作站','戴尔','5388',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('Mac Pro MD878CH/A 专业级台式电脑','服务器/工作站','苹果','28888',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES(' HMZ-T3W 头戴显示设备','笔记本配件','索尼','6999',DEFAULT,DEFAULT);

 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('商务双肩背包','笔记本配件','索尼','99',DEFAULT,DEFAULT);

 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('X3250 M4机架式服务器 2583i14','服务器/工作站','IBM','6888',DEFAULT,DEFAULT);
 
 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('玄龙精英版 笔记本散热器','笔记本配件','九州风神','',DEFAULT,DEFAULT);

 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES(' HMZ-T3W 头戴显示设备','笔记本配件','索尼','6999',DEFAULT,DEFAULT);

 INSERT tdb_goods (goods_name,goods_cate,brand_name,goods_price,is_show,is_saleoff) VALUES('商务双肩背包','笔记本配件','索尼','99',DEFAULT,DEFAULT);
 ```
 ```
 -- 求所有电脑产品的平均价格,并且保留两位小数，AVG,MAX,MIN、COUNT、SUM为聚合函数

   SELECT ROUND(AVG(goods_price),2) AS avg_price FROM tdb_goods;

-- 查询所有价格大于平均价格的商品，并且按价格降序排序

   SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price > 5868.11 ORDER BY goods_price DESC;
  
-- 使用子查询来实现

  SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price > (SELECT ROUND(AVG(goods_price),2) AS avg_price FROM tdb_goods) ORDER BY goods_price DESC;


-- 查询类型为“超记本”的商品价格

   SELECT goods_price FROM tdb_goods WHERE goods_cate = '超级本';

-- 查询价格大于或等于"超级本"价格的商品，并且按价格降序排列

   SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price = ANY(SELECT goods_price FROM tdb_goods WHERE goods_cate = '超级本') ORDER BY goods_price DESC;
   
-- = ANY 或 = SOME 等价于 IN

   SELECT goods_id,goods_name,goods_price FROM tdb_goods 

   WHERE goods_price IN (SELECT goods_price FROM tdb_goods WHERE goods_cate = '超级本')

   ORDER BY goods_price DESC; 
 ```
 
![](https://user-gold-cdn.xitu.io/2019/4/8/169fbe71e28635c8?w=1828&h=708&f=png&s=364429)

示例：

![](https://user-gold-cdn.xitu.io/2019/4/8/169fbeccee03c67a?w=1362&h=1013&f=png&s=172933)

```
-- 创建“商品分类”表

  CREATE TABLE IF NOT EXISTS tdb_goods_cates(
    cate_id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cate_name VARCHAR(40)
  );
  
-- 查询tdb_goods表的所有记录，并且按"类别"分组

  SELECT goods_cate FROM tdb_goods GROUP BY goods_cate;

-- 将分组结果写入到tdb_goods_cates数据表

  INSERT tdb_goods_cates (cate_name) SELECT goods_cate FROM tdb_goods GROUP BY goods_cate;
```
示例：

![](https://user-gold-cdn.xitu.io/2019/4/8/169fbf77d3eb2ca2?w=808&h=836&f=png&s=96709)

### 多表更新：
```
-- 通过tdb_goods_cates数据表来更新tdb_goods表

  UPDATE tdb_goods INNER JOIN tdb_goods_cates ON goods_cate = cate_name 

  SET goods_cate = cate_id ;
```

![](https://user-gold-cdn.xitu.io/2019/4/8/169fbfdaba6dac6b?w=1298&h=546&f=png&s=229224)

示例：

![](https://user-gold-cdn.xitu.io/2019/4/8/169fc03f7937aa1e?w=681&h=1021&f=png&s=135403)

### 多表更新之一步到位；
```
-- 通过CREATE...SELECT来创建数据表并且同时写入记录
 
  SELECT brand_name FROM tdb_goods GROUP BY brand_name;

  CREATE TABLE tdb_goods_brands (

    brand_id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

    brand_name VARCHAR(40) NOT NULL

  ) SELECT brand_name FROM tdb_goods GROUP BY brand_name;
  
  -- 通过tdb_goods_brands数据表来更新tdb_goods数据表(错误)

  UPDATE tdb_goods  INNER JOIN tdb_goods_brands ON brand_name = brand_name

  SET brand_name = brand_id;

  -- Column 'brand_name' in field list is ambigous

  -- 正确

  UPDATE tdb_goods AS  g  INNER JOIN tdb_goods_brands AS b ON g.brand_name = b.brand_name

  SET g.brand_name = b.brand_id;

```
示例：

![](https://user-gold-cdn.xitu.io/2019/4/8/169fc114f65994f4?w=1274&h=574&f=png&s=152102)
```
-- 通过ALTER TABLE语句修改数据表结构

  ALTER TABLE tdb_goods  

  CHANGE goods_cate cate_id SMALLINT UNSIGNED NOT NULL,

  CHANGE brand_name brand_id SMALLINT UNSIGNED NOT NULL;
  
-- 分别在tdb_goods_cates和tdb_goods_brands表插入记录

   INSERT tdb_goods_cates(cate_name) VALUES('路由器'),('交换机'),('网卡');

   INSERT tdb_goods_brands(brand_name) VALUES('海尔'),('清华同方'),('神舟');

-- 在tdb_goods数据表写入任意记录

   INSERT tdb_goods(goods_name,cate_id,brand_id,goods_price) VALUES(' LaserJet Pro P1606dn 黑白激光打印机','12','4','1849');

```
示例：
![](https://user-gold-cdn.xitu.io/2019/4/8/169fc171891ffc93?w=745&h=686&f=png&s=112003)

### 连接

```
-- 查询所有商品的详细信息(通过内连接实现)

   SELECT goods_id,goods_name,cate_name,brand_name,goods_price FROM tdb_goods AS g
   INNER JOIN tdb_goods_cates AS c ON g.cate_id = c.cate_id
   INNER JOIN tdb_goods_brands AS b ON g.brand_id = b.brand_id\G;

-- 查询所有商品的详细信息(通过左外连接实现)

   SELECT goods_id,goods_name,cate_name,brand_name,goods_price FROM tdb_goods AS g
   LEFT JOIN tdb_goods_cates AS c ON g.cate_id = c.cate_id
   LEFT JOIN tdb_goods_brands AS b ON g.brand_id = b.brand_id\G;

-- 查询所有商品的详细信息(通过右外连接实现)

   SELECT goods_id,goods_name,cate_name,brand_name,goods_price FROM tdb_goods AS g
   RIGHT JOIN tdb_goods_cates AS c ON g.cate_id = c.cate_id
   RIGHT JOIN tdb_goods_brands AS b ON g.brand_id = b.brand_id\G;
```

### 无限分类的数据表设计

```
CREATE TABLE tdb_goods_types(
     type_id   SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
     type_name VARCHAR(20) NOT NULL,
     parent_id SMALLINT UNSIGNED NOT NULL DEFAULT 0
  ); 

  INSERT tdb_goods_types(type_name,parent_id) VALUES('家用电器',DEFAULT);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('电脑、办公',DEFAULT);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('大家电',1);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('生活电器',1);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('平板电视',3);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('空调',3);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('电风扇',4);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('饮水机',4);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('电脑整机',2);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('电脑配件',2);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('笔记本',9);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('超级本',9);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('游戏本',9);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('CPU',10);
  INSERT tdb_goods_types(type_name,parent_id) VALUES('主机',10);
```
