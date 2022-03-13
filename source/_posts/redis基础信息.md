---
title: redis基础
type: categories
copyright: true
tags:
  - 数据库
  - redis
categories:
  - 数据库
  - redis
keywords: redis
abbrlink: 2025154759
date: 2022-03-10 21:46:18
---


## redis数据库基础知识

### redis常用的5种数据类型
- string 字符串（可以为整形、浮点型和字符串，统称为元素）
- list 列表（实现队列,元素不唯一，先入先出原则）
- set 集合（各不相同的元素）
- hash hash散列值（hash的key必须是唯一的）
- sort set 有序集合

### redis不常用的三种类型
<!-- more -->
- geospatial

&emsp;&emsp;该功能可以推算出地理位置信息，两地之间的距离；
- hyperloglog

&emsp;&emsp;基数: 数学上集合的元素个数，不能重复；

&emsp;&emsp; 该数据结构就是基于基数统计的算法，主要应用场景是计算网站的访问量；
- bitmap

&emsp;&emsp; 位图，通过最小单位bit来进行0或1的设置，表示某个元素对应的值或是状态；常用于统计用户的二元性信息，比如是否登录，是否打卡，性别等等；


### redis到底是单线程还是多线程
redis不能简单的说是单线程的，redis是单线程模型，指的是执行命令的核心模块是单线程的，就整个redis实例而言，在4.0之后的版本中引入了惰性删除，也叫异步删除，这是由额外的线程执行的，例如删除一个key,同步的话del key,异步的话就是unlink key;

这样处理的优点就是不会使redis的主线程卡顿，把这些删除操作交给后台线程来执行；持久化，集群数据同步等等都是由额外的子线程执行的；

### redis单线程高效的原因
- 基于内存操作

&emsp;&emsp;redis所有的数据都是存在内存中的，所有的运算都是内存级别的，所以性能比较高；
- 数据结构简单

&emsp;&emsp; redis的数据结构都是简单的基础类型的数据结构，这些类型数据结构的查询和操作的时间复杂度都是O(1)；

- I/O多路复用的设计模式

&emsp;&emsp;redis使用i/o多路复用来监听多个socket连接客户端，这样就可以使用单线程来处理多个情况；减少了线程切换和资源竞争的消耗，从而提高了效率；

### redis的性能瓶颈
redis是基于内存操作的，它的性能瓶颈来自于内存和网络带宽，而不是cpu，既然cpu不是主要原因，那么采用单线程模式是非常合适的；

### redis的应用场景
- [缓存][cache]
- 排行榜
- 任务队列
- 计数(利用redis的原子递增)
- 处理带有过期时间的任务


### redis的回收策略
- volatile-lru：从已设置过期时间的数据集（server.db[i].expires）中挑选最近最少使用的数据淘汰

- volatile-ttl：从已设置过期时间的数据集（server.db[i].expires）中挑选将要过期的数据淘汰

- volatile-random：从已设置过期时间的数据集（server.db[i].expires）中任意选择数据淘汰

- allkeys-lru：从数据集（server.db[i].dict）中挑选最近最少使用的数据淘汰

- allkeys-random：从数据集（server.db[i].dict）中任意选择数据淘汰

- no-enviction（驱逐）：禁止驱逐数据，不回收

使用策略规则：

&emsp;&emsp; 1、如果数据呈现幂律分布，也就是一部分数据访问频率高，一部分数据访问频率低，则使用allkeys-lru；

&emsp;&emsp; 2、如果数据呈现平等分布，也就是所有的数据访问频率都相同，则使用allkeys-random；


[cache]: https://blog.leslie168.com/posts/3531308952.html
