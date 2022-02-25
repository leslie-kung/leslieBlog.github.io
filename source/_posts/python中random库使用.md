---
title: python中random库使用
type: categories
copyright: true
date: 2020-01-02 11:55:30
tags:
    - python
categories: python
---

### 1、random.random() 生成一个随机的浮点数，范围在0.0~0.1之间；

```python
num = random.random()
print(num)  # num=0.4329135788510704
```
### 2、random.uniform() 函数可以设定浮点数的范围，需要两个参数，一个上限，另一个下限；

<!--more-->

```python
num = random.uniform(1, 2)
print(num)  # num=1.9499995621894857
```
### 3、random.randint() 随机生成一个整数int类型,可以指定这个整数的范围，同样有上限和下限

```python
num = random.randint(1, 10)
print(num)  # num=2
```
### 4、random.choice() 可以从任意序列，比如list列表中，选取一个随机的元素返回，可以用字符串、列表、元组等

```python
list = [i for i in range(10)]
num = random.choice(list)
print(num)  # num=5
```
### 5、random.shuffle() 随机打乱一个序列

```python
list = [i for i in range(10)]
print(list)  # list=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
random.shuffle(list)
print(list)  # list=[1, 5, 4, 2, 0, 6, 9, 8, 3, 7]
```
### 6、random.sample() 可以从指定的序列中，随机截取指定长度的片段，不做原地修改

```python
list = [i for i in range(10)]
new_list = random.sample(list, 5)  # 第一个参数要截取的对象，第二个参数是截取的长度
print(new_list)  # [7, 9, 0, 8, 1]
```