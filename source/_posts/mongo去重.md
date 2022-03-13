---
title: mongo去重
type: categories
copyright: true
tags:
  - 数据库
  - mongo
categories:
  - 数据库
  - mongo
abbrlink: 546221521
date: 2020-01-02 16:06:51
---

## mongo 去重

进入到Mongo的安装目录，进入到bin文件夹下

导出数据：
```
mongoexport.exe -d database -c collection -o filename.json
```
导入数据：
<!--more-->
```
mongoimport.exe -d database -c collection --file file
```

查询集合中存在重复的数据：
```
db.collection.aggregate([{$group:{_id:{字段名:'$字段名'},count:{$sum:1}}},{$match:{count:{$gt:1}}}])
```

删除重复数据：
```
db.collection.aggregate([
{
$group:{_id:{字段名:'$字段名'},count:{$sum:1},dups:{$addToSet:'$_id'}}
},
{
$match:{count:{$gt:1}}
}]).forEach(function(doc){
doc.dups.shift();
db.collection.remove({_id:{$in:doc.dups}});
});
```

