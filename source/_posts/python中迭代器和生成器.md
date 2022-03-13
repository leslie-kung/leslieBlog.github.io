---
title: python中迭代器和生成器
type: categories
copyright: true
tags:
  - python
  - 基础
categories:
  - python
  - 基础
keywords:
  - 迭代器
  - 生成器
abbrlink: 3766336343
date: 2022-03-13 16:26:16
---



## python中迭代器生成器实例详解

本文通过针对不同应用场景及其解决方案的方式，总结了Python中迭代器与生成器的一些相关知识；
- 手动遍历迭代器
- 代理迭代
- 反向迭代
- 有选择的迭代
- 同时迭代多个序列
- 不同集合上的迭代
- 展开嵌套的序列

### 手动遍历迭代器
**应用场景：** 想要遍历一个可迭代对象中所有元素，但是不想用for循环；

<!-- more -->

**解决方案：** 使用next()函数，并捕获StopIteration异常；
```python
def manual_iter():
    with open("/etc/passwd") as f:
        try:
            while True:
                line = next(f)
                if line is None:
                    break
                print(line, end="")
        except StopIteration:
            pass
```

### 代理迭代
**应用场景：** 想直接在一个包含有列表，元组或其他可迭代对象的容器对象上执行迭代操作；

**解决方案：** 定义一个iter方法，将迭代操作代理到容器内部的对象上；
```python
class Node:
    def __init__(self, value):
        self._value = value
        self._children = []

    def __repr__(self):
        return "Node({!r})".format(self._value)

    def add_children(self, node):
        self._children.append(node)

    def __iter__(self):
        # 将迭代请求传递给内部的_children属性
        return iter(self._children)

rt = Node(0)
cd1 = Node(1)
cd2 = Node(2)
rt.add_children(cd1)
rt.add_children(cd2)

for ch in rt:
    print(ch)
```

### 反向迭代
**应用场景：** 想要反向迭代一个序列

**解决方案：** 使用内置的reversed()函数或者在自定义类上实现reversed();
```python
a=[1,2,3,4]
for x in reversed(a):
    print(x) #4 3 2 1

class Countdown:
    def __init__(self, start):
        self.start = start

    # 常规迭代
    def __iter__(self):
        n = self.start
        while n > 0:
            yield n
            n -= 1
    
    # 反向迭代
    def __reversed__(self):
        n = 1
        while n <= self.start:
            yield n
            n += 1

#test case
for rr in reversed(Countdown(30)):
    print(rr)

for rr in Countdown(30):
    print(rr)
```

### 有选择的迭代
**应用场景：** 想要遍历一个可迭代对象，但是对它的某些元素不感兴趣，需要跳过；

**解决方案：** 使用itertools.dropwhile()；
```python
from itertools import dropwhile

with open("/etc/passwd") as f:
    for line in dropwhile(lambda line: line.startwith('#'), f):
        print(line, end="")
```

### 同时迭代多个序列
**应用场景：** 想要同时迭代多个序列，每次分别从一个序列中取出一个元素；

**解决方案：** 使用zip()函数；
```python
a = [1, 2, 3, 4, 5]
b = [6, 7, 8, 9, 10]

for x, y in zip(a, b):
    print(x, y)

# 1,6 
# 2,7 
# 3,8 
# 4,9 
# 5,10
```
```python
from itertools import zip_longest

a = [1, 2, 3]
b = ['w', 'x', 'y', 'z']

for i in zip_longest(a, b):
    print(i)

# (1, 'w')
# (2, 'x')
# (3, 'y')
# (None, 'z')


for i in zip_longest(a, b, fillvalue=0):
    # 空值设置默认参数自动填充
    print(i)
```

### 不同集合上元素的迭代
**应用场景：** 想要在多个迭代对象上执行同一操作，但是这些对象在不同的容器中；

**解决方案：** 使用itertools.chain()函数;
```python
from itertools import chain

a = [1, 2, 3, 4]
b = ['x', 'y', 'z']

for i in chain(a, b):
    print(i)

# 1
# 2
# 3
# 4
# x
# y
# z
```

### 展开嵌套的序列
**应用场景：** 想要将一个多层嵌套的序列展开成一个一维的列表；

**解决方案：** 使用包含yield from语句的递归生成器

```python
from collections import Iterable

def flatten(items, ignore_types=(str, bytes)):
    for x in items:
        if isinstance(x, Iterable) and not isinstance(x, ignore_types):
            yield from flatten(x)
        else:
            yield x

#test case
items=[1,2,[3,4,[5,6],7],8]
for x in flatten(items):
  print(x)
```

