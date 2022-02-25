---
title: python中元素替换
type: categories
copyright: true
date: 2020-01-02 12:02:38
tags:
    - python
categories: python
---

## python中元素进行替换有很多方法，下面是我学习中的一些总结

### 1、字符串替换str.replace()方法

python中的replace()方法是把字符串中的old字符串替换成new的字符串，如果指定替换次数max,则按照替换次数进行替换
```python
str.replace(old,new,count=0)
```
<!--more-->

old：字符串替换前的字符
new：字符串替换后的字符
count：替换的次数，默认为0，不填表示全局替换

```python
>>> str = "hello world! I love python!"
>>> str.replace("l","@")  # 表示全局替换
'he@@o wor@d! I @ove python!'
>>> str.replace("l","@",2)  # 替换指定次数
'he@@o world! I love python!'
>>> str.replace("l","@",2).replace("o","$")  # 多个字符替换可以进行链式调用replace()方法
'he@@$ w$rld! I l$ve pyth$n!'
```

### 2、正则表达式中的sub()和subn()方法
sub(pattern, repl, string)
其中pattern表示原字符串中的字符，repl表示需要替换成的字符，string表示需要替换的字符串；
subn()和sub()的区别在于subn()返回的一个包含新字符串和替换次数的二元组；

```python
>>> import re
>>> str = "hello world! I love python!"
>>> re.sub("hello","nihao",str)  
'nihao world! I love python!'
>>> re.subn("l","*",str)
('he**o wor*d! I *ove python!', 4)
>>> 
```
### 3、如果同时处理多个字符串的替换，此时可以使用string的maketrans()和translate()方法

maketrans()方法用来生成字符映射表，而translate()方法则按映射表中定义的对应关系转换并替换其中的字符，用这两种方法可以同时处理多个不同的字符。

```python
>>> table = ''.maketrans("abcdefghij","1234567890")  # 创建映射表，注意字符串的长度要一致，达到一一对应的目的
>>> str = "hello world! i love python"
>>> str.translate(table)  # 按照关系表将sting中的字符逐个进行替换
'85llo worl4! 9 lov5 pyt8on'
>>> 
```
### 4、对列表里的元素进行替换，可以使用列表解析的方法

```python
>>> list = [1,2,3,4]
>>> rep = [5 if x==1 else x for x in list]
>>> rep
[5, 2, 3, 4]
>>> 

```

#### 4.1、批量进行替换

```python
>>> list = [1,2,3,4,5]
>>> pattern = [2,4]
>>> rep = ["a" if x in pattern else x for x in list]
>>> rep
[1, 'a', 3, 'a', 5]
>>> 

```
#### 4.2、根据字典的映射进行替换

```python
>>> list
[1, 2, 3, 4, 5]
>>> dict = {1:"apple", 3:"banana"}
>>> rep = [dict[x] if x in dict else x for x in list]
>>> rep
['apple', 2, 'banana', 4, 5]
>>> 

```

### 5、在Python中，字符串属于不可变对象，不支持原地修改，如果需要修改其中的值，只能重新创建一个新的字符串对象。但是如果一定要修改原字符串，可以使用io.StringIO对象。

```python
>>> from io import StringIO
>>> str = "hello world!" 
>>> io_str = StringIO(str)
>>> io_str
<_io.StringIO object at 0x7fa1e61addc8>
>>> io_str.tell()  # 返回当前的位置
0
>>> io_str.read()  # 从当前位置开始读取字符串
'hello world!'
>>> io_str.getvalue()  # 返回字符串的全部内容
'hello world!'
>>> io_str.seek(6)  # 定义开始修改的位置
6
>>> io_str.write("china")  # 修改字符串
5
>>> io_str.read()
'!'
>>> io_str.getvalue()  # 获取修改后的字符串全部内容
'hello china!'
>>> io_str.tell() 
12
>>> 

```
