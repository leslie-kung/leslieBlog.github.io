---
title: python字典多次嵌套
type: categories
copyright: true
date: 2020-01-02 11:15:28
tags:
    - python
categories: python
---

## python实现字典多层嵌套

```python
# 对于字典
dict1 = {"a":1, "b":2, "c.1":3, "c.2":4, "d.5.2":5, "d.5.3":6, "d.4.1":7}

# 将其实现多次嵌套效果
dict2 = {'a': 1, 'b': 2, 'c': {'1': 3, '2': 4}, 
        'd': {'5': {'2': 5, '3': 6}, '4': {'1': 7}}}
```
<!--more-->

### 解决方案
```python
d1 = {"a":1, "b":2, "c.1":3, "c.2":4, "d.5.2":5, "d.5.3":6, "d.4.1":7}
d2 = {}

def fun(d1):
    for key, value in d1.items():
        if '.' in key:
            parts = key.split('.')
            par = d2
            key = parts.pop(0)
            print('==========', key)
            while parts:
                par = par.setdefault(key, {})
                print(par)
                key = parts.pop(0)
            par[key] = value
            print(par)
        else:
        d2[key] = value

fun(d1)
print(d2)
```

### 其中用到了字典的setdefault方法

```python
dict.setdefault(key,default=None)
```
如果键不存在于字典中，将会添加新的键，并将值设置为默认值；如果字典中包含该给定的键，则返回该键对应的值，否则返回该键设置的默认值。

### get方法
dict.get(key,default=None)
get方法返回给定键的值，如果键不可用返回默认值；

### collection defaultdict
defaultdict()返回一个字典，自动给每一个键赋一个初始值


*参考链接地址：https://blog.csdn.net/whgyxy/article/details/72458000*
