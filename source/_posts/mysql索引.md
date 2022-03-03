---
title: mysql索引
type: categories
copyright: true
date: 2022-03-03 17:20:21
tags:
    - 数据库
    - mysql
categories: [数据库, mysql]
keywords: [mysql, 索引]
---

<script type="text/javascript" src="/js/src/bai.js"></script>

##  mysql索引

### 索引的优点
- 可以大大加快数据的检索速度，这也是创建索引的最主要的原因。
- 通过使用索引，可以在查询的过程中，使用优化隐藏器，提高系统的性能。

### 索引的缺点
- 时间方面：创建索引和维护索引要耗费时间，具体地，当对表中的数据进行增加、删除和修改的时候，索引也要动态的维护，会降低增/改/删的执行效率；
- 空间方面：索引需要占物理空间。

<!-- more -->
从存储结构上来划分：BTree索引（B-Tree或B+Tree索引），Hash索引，full-index全文索引，R-Tree索引。这里所描述的是索引存储时保存的形式，

从应用层次来分：普通索引，唯一索引，复合索引。
- 普通索引：即一个索引只包含单个列，一个表可以有多个单列索引
- 唯一索引：索引列的值必须唯一，但允许有空值
- 复合索引：多列值组成一个索引，专门用于组合搜索，其效率大于索引合并
- 聚簇索引(聚集索引)：并不是一种单独的索引类型，而是一种数据存储方式。具体细节取决于不同的实现，InnoDB的聚簇索引其实就是在同一个结构中保存了B-Tree索引(技术上来说是B+Tree)和数据行。
- 非聚簇索引： 不是聚簇索引，就是非聚簇索引

根据中数据的物理顺序与键值的逻辑（索引）顺序关系： 聚集索引，非聚集索引。

### 联合索引

MySQL可以使用多个字段同时建立一个索引，叫做联合索引。在联合索引中，如果想要命中索引，需要按照建立索引时的字段顺序挨个使用，否则无法命中索引。

具体原因为:

MySQL使用索引时需要索引有序，假设现在建立了"name，age，school"的联合索引，那么索引的排序为: 先按照name排序，如果name相同，则按照age排序，如果age的值也相等，则按照school进行排序。

当进行查询时，此时索引仅仅按照name严格有序，因此必须首先使用name字段进行等值查询，之后对于匹配到的列而言，其按照age字段严格有序，此时可以使用age字段用做索引查找，以此类推。因此在建立联合索引的时候应该注意索引列的顺序，一般情况下，将查询需求频繁或者字段选择性高的列放在前面。此外可以根据特例的查询或者表结构进行单独的调整。

### 最左前缀原则
最左前缀原则就是最左优先，在创建多列索引时，要根据业务需求，where子句中使用最频繁的一列放在最左边。

mysql会一直向右匹配直到遇到范围查询(>、<、between、like)就停止匹配，比如a = 1 and b = 2 and c > 3 and d = 4 如果建立(a,b,c,d)顺序的索引，d是用不到索引的，如果建立(a,b,d,c)的索引则都可以用到，a,b,d的顺序可以任意调整。

=和in可以乱序，比如a = 1 and b = 2 and c = 3 建立(a,b,c)索引可以任意顺序，mysql的查询优化器会帮你优化成索引可以识别的形式。

### 前缀索引
因为可能我们索引的字段非常长，这既占内存空间，也不利于维护。所以我们就想，如果只把很长字段的前面的公共部分作为一个索引，就会产生超级加倍的效果。但是，我们需要注意，order by不支持前缀索引 。
- 先计算完整列的选择性 : select count(distinct col_1)/count(1) from table_1
- 再计算不同前缀长度的选择性 : select count(distinct left(col_1,4))/count(1) from table_1
- 找到最优长度之后，创建前缀索引 : create index idx_front on table_1 (col_1(4))

### 索引下推
MySQL 5.6引入了索引下推优化。默认开启，使用SET optimizer_switch = ‘index_condition_pushdown=off’;可以将其关闭。
- 有了索引下推优化，可以在减少回表次数
- 在InnoDB中只针对二级索引有效

官方文档中给的例子和解释如下：

在 people_table中有一个二级索引(zipcode，lastname，address)，查询是SELECT * FROM people WHERE zipcode=’95054′ AND lastname LIKE ‘%etrunia%’ AND address LIKE ‘%Main Street%’
- 如果没有使用索引下推技术，则MySQL会通过zipcode=’95054’从存储引擎中查询对应的数据，返回到MySQL服务端，然后MySQL服务端基于lastname LIKE ‘%etrunia%’ and address LIKE ‘%Main Street%’来判断数据是否符合条件
- 如果使用了索引下推技术，则MYSQL首先会返回符合zipcode=’95054’的索引，然后根据lastname LIKE ‘%etrunia%’ and address LIKE ‘%Main Street%’来判断索引是否符合条件。如果符合条件，则根据该索引来定位对应的数据，如果不符合，则直接reject掉。

### 索引失效
- 使用!= 或者 <> 导致索引失效
- 类型不一致导致的索引失效
- 函数导致的索引失效
```
# 如果使用函数在索引列，这是不走索引的。
SELECT * FROM `user` WHERE DATE(create_time) = '2020-09-03';
```
- 运算符导致的索引失效
```
SELECT * FROM `user` WHERE age - 1 = 20;
```
- OR引起的索引失效
```
SELECT * FROM `user` WHERE `name` = '张三' OR height = '175';
```
OR导致索引是在特定情况下的，并不是所有的OR都是使索引失效，如果OR连接的是同一个字段，那么索引不会失效，反之索引失效。

- 模糊搜索导致的索引失效
```
SELECT * FROM `user` WHERE `name` LIKE '%冰';
```
当%放在匹配字段前是不走索引的，放在后面才会走索引。
- NOT IN、NOT EXISTS导致索引失效



