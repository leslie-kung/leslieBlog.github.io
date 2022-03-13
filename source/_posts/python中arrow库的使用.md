---
title: python中arrow库的使用
type: categories
copyright: true
tags:
  - python
  - 基础
categories:
  - python
  - 基础
abbrlink: 1524522455
date: 2020-01-02 11:57:58
---

 Arrow是一个Python库，为创建，操作，格式化和转换日期，时间和时间戳提供了一种明智的，人性化的方法。 它实现和更新日期时间类型，填补功能上的空白，并提供支持许多常见创建场景的智能模块API。 简而言之，它可以帮助您使用更少的进口和更少的代码来处理日期和时间。
### 安装

```
pip install arrow
```

<!--more-->

### 简单开始

```python
>>> import arrow
>>> utc = arrow.utcnow()  # 获取世界标准时间
>>> utc
<Arrow [2018-06-07T09:37:28.989983+00:00]>
>>> utc = arrow.now()  # 获取本地时间
>>> utc
<Arrow [2018-06-07T17:40:19.019529+08:00]>
>>> arrow.now('US/Pacific')  # 获取指定时区的时间
<Arrow [2018-06-07T02:41:54.815029-07:00]>
```

```python
>>> a = arrow.now()
>>> a
<Arrow [2018-06-07T17:44:43.519166+08:00]>
>>> a.year  # 当前年
2018
>>> a.month  # 当前月份
6
>>> a.day  # 当前天
7
>>> a.hour  # 当前第几个小时
17
>>> a.minute  # 当前多少分钟
44
>>> a.second  # 当前多少秒
43
>>> a.timestamp  # 获取时间戳
1528364683
>>> a.float_timestamp  # 浮点数时间戳
1528364683.519166
```

### 时间格式化

```python
>>> a = arrow.now()
>>> a
<Arrow [2018-06-07T17:59:36.917894+08:00]>
>>> a.format()
'2018-06-07 17:59:36+08:00'
>>> a.format('YYYY-MM-DD HH:mm:ss ZZ')
'2018-06-07 17:59:36 +08:00'
>>> a.ctime()  # 返回日期和时间的ctime格式化表示。
'Thu Jun  7 17:59:36 2018'  
>>> a.weekday()  # 以整数形式返回星期几（0-6）
3
>>> a.isoweekday()  # 以整数形式返回一周中的ISO日（1-7）
4
>>> a.isocalendar()  # 返回3元组（ISO年，ISO周数，ISO工作日）
(2018, 23, 4)
>>> a.toordinal()  # 返回日期的格雷戈里序数
736852
```

### 从string中解析时间对象

```python
>>> arrow.get('2018-06-07 18:52:45', 'YYYY-MM-DD HH:mm:ss')
<Arrow [2018-06-07T18:52:45+00:00]>
>>> str = 'June was born in May 1980'
>>> arrow.get(str,'MMMM YYYY')
<Arrow [1980-05-01T00:00:00+00:00]>
```

### 解析的格式化参考：http://arrow.readthedocs.io/en/latest/#tokens
### 时间的替换和偏移

```python
>>> arw = arrow.now()
>>> arw
<Arrow [2018-06-07T19:04:50.245201+08:00]>
>>> arw.replace(hour=20,minute=00)  # 替换时间
<Arrow [2018-06-07T20:00:50.245201+08:00]>
>>> arw.replace(tzinfo='US/Pacific')  # 替换时区
<Arrow [2018-06-07T19:04:50.245201-07:00]>

>>> arw.shift(days=+3)  # 往后偏移三天
<Arrow [2018-06-10T19:04:50.245201+08:00]>
>>> arw.shift(days=-3)  # 往前偏移三天
<Arrow [2018-06-04T19:04:50.245201+08:00]>
>>> 
```

### 按名称或tzinfo转换为时区

```python
>>> arw = arrow.utcnow()
>>> arw
<Arrow [2018-06-07T11:16:51.695083+00:00]>
>>> arw.to('US/Pacific')
<Arrow [2018-06-07T04:16:51.695083-07:00]>

```

### 更人性化的设计

```python
>>> past = arrow.utcnow().shift(hours=-1)
>>> past
<Arrow [2018-06-07T10:24:19.968351+00:00]>
>>> past.humanize()
'an hour ago'
>>> present = arrow.utcnow()
>>> future = present.shift(hours=+2)
>>> future
<Arrow [2018-06-07T13:25:57.160630+00:00]>
>>> future.humanize()
'in 2 hours'
>>> future.humanize(a,locale='ru')  # 支持更多的语言环境
'через 3 часа'
```

### 获取任意时间单位的时间跨度

```python
>>> arrow.utcnow().span('hour')
(<Arrow [2018-06-07T11:00:00+00:00]>, <Arrow [2018-06-07T11:59:59.999999+00:00]>)
>>> arrow.utcnow().span('year')
(<Arrow [2018-01-01T00:00:00+00:00]>, <Arrow [2018-12-31T23:59:59.999999+00:00]>)
>>> arrow.utcnow().span('month')
(<Arrow [2018-06-01T00:00:00+00:00]>, <Arrow [2018-06-30T23:59:59.999999+00:00]>)
>>> arrow.utcnow().span('day')
(<Arrow [2018-06-07T00:00:00+00:00]>, <Arrow [2018-06-07T23:59:59.999999+00:00]>)

```

### 只得到任意单位时间中的最大值或最小值

```python
>>> arrow.utcnow().floor('hour')  
<Arrow [2018-06-07T11:00:00+00:00]>
>>> arrow.utcnow().ceil('hour')  
<Arrow [2018-06-07T11:59:59.999999+00:00]>
>>> arrow.utcnow().floor('day')
<Arrow [2018-06-07T00:00:00+00:00]>
>>> arrow.utcnow().ceil('day')
<Arrow [2018-06-07T23:59:59.999999+00:00]>
>>> 
```

### 表示特定于语言环境的数据和功能的类

```python
arrow.locales.Locale
```

## arrow库的官方文档：http://arrow.readthedocs.io/en/latest/
