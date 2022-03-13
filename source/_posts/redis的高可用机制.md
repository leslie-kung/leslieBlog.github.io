---
title: redis的高可用机制
type: categories
copyright: true
tags:
  - 数据库
  - redis
categories:
  - 数据库
  - redis
keywords: redis
abbrlink: 1376421695
date: 2022-03-11 07:57:59
---


## redis实现高可用机制的方法

redis实现高可用机制需要用到
- redis的主从复制
- redis持久化机制
- 哨兵机制
- keepalived

主从复制的作用：
- 数据备份
- 读写分离
- 分布式集群
- 实现高可用
- 宕机容错机制

<!-- more -->

## redis的主从复制
主从复制分为两个角色：master和slave，但是redis中只支持一个master，不像ngnix，mysql可以多主多从；

redis的主从复制一般分为全量同步和增量同步；全量同步一般在slave初始化阶段，这时需要将master上的数据都复制一遍；

redis主从复制，主数据库可以执行读写操作，从数据库只能进行读操作；

### 全量同步
- 当一个从数据库slave启动时，会向master发送sync命令；
- master接收到sync命令后开始在后台保存快照(执行rdb操作)，并用缓存记录后续的写操作；
- master保存好快照文件后，会发送给从数据库slave；
- slave收到快照文件后，会丢弃所有的老数据，重新载入快照；
- master发送完快照文件后，会向slave发送缓存的写命令；
- 从数据库slave载入完快照后，开始接收命令请求，执行接收到的写命令；

### 增量同步
redis增量同步指的是slave已经完成了初始化阶段，正常工作运行，master发生的写操作同步到salve的过程；

## redis的哨兵机制
redis的哨兵机制需要主从复制支持；用于管理多个redis服务器；该系统主要执行以下三个操作
- 监控

&emsp;&emsp; 哨兵(sentinel)会不断检查master和slave是否正常工作；

- 通知

&emsp;&emsp; 当发现master或某个slave异常时，哨兵可以通过API向管理员或其他程序发送通知；

- 自动故障迁移

&emsp;&emsp; 当一个master不能正常运行时，哨兵会开始一次自动故障迁移操作，它会从slave中选择一个升级为新的master，并让其他的slave改为复制新的master，当客户端试图连接失效的master时，它应该返回新的master地址，使得集群可以用新的master来代替失效的master；

哨兵(sentinel)是一个分布式系统，可以在一个架构中运行多个哨兵进程，这些进程使用流言协议(gossipprotocols)来接收关于master是否下线的信息，并使用投票协议(agreement protocols)来决定是否执行自动故障迁移操作，以及选择哪一个slave作为新的master服务器；

“心跳检测”，每个哨兵会向其他哨兵，master，slave定时发送消息来确认对方状态，如果在设置的规定时间内没有获得响应，则暂时认为对方已经宕机，即主观认为宕机；

如果多个哨兵都报告某个master没有响应，系统则会认为该master真正“死亡”，即客观认为宕机；这时就会从剩下的slave中选择一个升级为新的master，然后自动修改相关的配置；


## 自动重启keepalived

keepalived主要通过虚拟路由冗余来实现高可用功能；
