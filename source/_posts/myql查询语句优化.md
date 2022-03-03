---
title: myql查询语句优化
type: categories
copyright: true
date: 2022-03-03 17:41:13
tags:
    - 数据库
    - mysql
categories: [数据库, mysql]
keywords: SQL
---

<script type="text/javascript" src="/js/src/bai.js"></script>

## Sql语句优化和索引
### Innerjoin和左连接，右连接，子查询
- inner join内连接也叫等值连接是，left/rightjoin是外连接。
```
SELECT A.id,A.name,B.id,B.name FROM A LEFT JOIN B ON A.id =B.id;
SELECT A.id,A.name,B.id,B.name FROM A RIGHT JOIN ON B A.id= B.id;
SELECT A.id,A.name,B.id,B.name FROM A INNER JOIN ON A.id =B.id;
```
经过来之多方面的证实inner join性能比较快，因为inner join是等值连接，或许返回的行数比较少。但是我们要记得有些语句隐形的用到了等值连接，如：
```
SELECT A.id,A.name,B.id,B.name FROM A,B WHERE A.id = B.id;
```
推荐：能用inner join连接尽量使用inner join连接
<!-- more -->

- 子查询的性能又比外连接性能慢，尽量用外连接来替换子查询。
```
  Select* from A where exists (select * from B where id>=3000 and A.uuid=B.uuid);
```
A表的数据为十万级表，B表为百万级表，在本机执行差不多用2秒左右，我们可以通过explain可以查看到子查询是一个相关子查询(DEPENDENCE SUBQUERY);Mysql是先对外表A执行全表查询，然后根据uuid逐次执行子查询，如果外层表是一个很大的表，我们可以想象查询性能会表现比这个更加糟糕。
  一种简单的优化就是用innerjoin的方法来代替子查询，查询语句改为：
```
   Select* from A inner join B using(uuid) where b.uuid>=3000;
```
 这个语句执行测试不到一秒；

- 在使用ON 和 WHERE 的时候，记得它们的顺序，如：
```
SELECT A.id,A.name,B.id,B.name FROM A LEFT JOIN B ON A.id =B.id WHERE B.NAME=’XXX’
```
执行过程会先执行ON 后面先过滤掉B表的一些行数。然而WHERE是后再过滤他们两个连接产生的记录。
不过在这里提醒一下大家：ON后面的条件只能过滤出B表的条数，但是连接返回的记录的行数还是A表的行数是一样。如：
```
SELECT A.id,A.name,B.id,B.name FROM A LEFT JOIN B ON A.id =B.id;
```
返回的记录数是A表的条数，ON后面的条件只起到过滤B表的记录数，而
```
SELECT A.id,A.name,B.id,B.name FROM A ,B WHERE A.id = B.id
```
返回的条数，是笛卡尔积后，符合A.id = B.id这个条件的记录

- 使用JOIN时候，应该用小的结果驱动打的结果（left join 左边表结果尽量小，如果有条件应该放到左边先处理，right join同理反向），同事尽量把牵涉到多表联合的查询拆分多个query(多个表查询效率低，容易锁表和阻塞)。如：
```
Select * from A left join B ona.id=B.ref_id where B.ref_id>10;
```
可以优化为：
```
select * from (select * from A wehre id >10) T1 left join B onT1.id=B.ref_id;
```

### 建立索引,加快查询性能.

### limit千万级分页的时候优化
- 在我们平时用limit,如：
```
Select * from A order by id limit 1,10;
```
这样在表数据很少的时候，看不出什么性能问题，倘若到达千万级，如：
```
Select * from A order by id limit10000000,10;
```
虽然都是只查询10记录，但是这个就性能就让人受不了了。所以为什么当表数据很大的时候，我们还继续用持久层框架如hibernate,ibatis就会有一些性能问题，除非持久层框架对这些大数据表做过优化。
- 在遇见上面的情况，我们可以用另外一种语句优化，如：
```
Select * from A where id>=(Select idfrom a limit 10000000,1) limit 10;
```
确实这样快了很多，不过前提是，id字段建立了索引。也许这个还不是最优的，其实还可以这样写：
```
Select * from A where id between 10000000and 10000010;
```
这样的效率更加高。

### 尽量避免Select * 命令
从表中读取越多的数据，查询会变得更慢。它会增加磁盘的操作时间，还是在数据库服务器与web服务器是独立分开的情况下，你将会经历非常漫长的网络延迟。仅仅是因为数据不必要的在服务器之间传输

### 尽量不要使用BY RAND()命令
如果您真需要随机显示你的结果，有很多更好的途径实现。而这个函数可能会为表中每一个独立的行执行BY RAND()命令—这个会消耗处理器的处理能力，然后给你仅仅返回一行

### 利用limit 1取得唯一行
有时要查询一张表时，你要知道需要看一行，你可能去查询一条独特的记录。你可以使用limit 1.来终止数据库引擎继续扫描整个表或者索引,如：
```
Select * from A  where namelike ‘%xxx’ limit 1;
```
这样只要查询符合like ‘%xxx’的记录，那么引擎就不会继续扫描表或者索引了。

### 尽量少排序
排序操作会消耗较多的CPU资源，所以减少排序可以在缓存命中率高等

### 尽量少OR
当where子句中存在多个条件以“或”并存的时候，Mysql的优化器并没有很好的解决其执行计划优化问题，再加上mysql特有的sql与Storage分层架构方式，造成了其性能比较地下，很多时候使用union all或者union(必要的时候)的方式代替“or”会得到更好的效果。

### 尽量用union all 代替union
union和union all的差异主要是前者需要将两个（或者多个）结果集合并后再进行唯一性过滤操作，这就会涉及到排序，增加大量的cpu运算，加大资源消耗及延迟。所以当我们可以确认不可能出现重复结果集或者不在乎重复结果集的时候，尽量使用union all而不是union.

### 避免类型转换
这里所说的“类型转换”是指where子句中出现column字段的类型和传入的参数类型不一致的时候发生的类型转换。人为的上通过转换函数进行转换，直接导致mysql无法使用索引。如果非要转型，应该在传入参数上进行转换

### 不要在列上进行运算
如下面:
```
select * fromusers where YEAR(adddate)<2007;
```
将在每个行进行运算，这些导致索引失效进行全表扫描，因此我们可以改成：
```
Select * from users where adddate<’2007-01-01’;
```
### 尽量不要使用NOT IN和<>操作
- NOT IN和<>操作都不会使用索引，而是将会进行全表扫描。NOT IN可以NOT EXISTS代替，id<>3则可以使用id>3 or id <3;如果NOT EXISTS是子查询，还可以尽量转化为外连接或者等值连接，要看具体sql的业务逻辑。

- 把NOT IN转化为LEFT JOIN如：
```
SELECT * FROM customerinfo WHERE CustomerIDNOT in (SELECT CustomerID FROM salesinfo );
```
优化：
```
SELECT * FROM customerinfo LEFT JOINsalesinfoON customerinfo.CustomerID=salesinfo. CustomerID WHEREsalesinfo.CustomerID IS NULL;
```
### 使用批量插入节省交互（最好是使用存储过程）

### 锁定表
尽管事务是维护数据库完整性的一个非常好的方法,但却因为它的独占性,有时会影响数据库的性能,尤其是在很多的应用系统中.由于事务执行的过程中,数据库将会被锁定,因此其他的用户请求只能暂时等待直到该事务结算.如果一个数据库系统只有少数几个用户来使用,事务造成的影响不会成为一个太大问题;但假设有成千上万的用户同时访问一个数据库系统,例如访问一个电子商务网站,就会产生比较严重的响应延迟.其实有些情况下我们可以通过锁定表的方法来获得更好的性能.如:
```
LOCK TABLE inventory write
Select quanity from inventory whereitem=’book’;
…
Update inventory set quantity=11 whereitem=’book’;
UNLOCK TABLES;
```
这里，我们用一个select语句取出初始数据，通过一些计算，用update语句将新值更新到列表中。包含有write关键字的LOCK TABLE语句可以保证在UNLOCK TABLES命令被执行之前，不会有其他的访问来对inventory进行插入，更新或者删除的操作。

### 对多表关联的查询，建立视图
对多表的关联可能会有性能上的问题，我们可以对多表建立视图，这样操作简单话，增加数据安全性，通过视图，用户只能查询和修改指定的数据。且提高表的逻辑独立性，视图可以屏蔽原有表结构变化带来的影响






