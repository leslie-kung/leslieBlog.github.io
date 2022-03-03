---
title: python基础
type: categories
copyright: true
date: 2022-03-03 17:03:00
tags:
    - python
categories: [python, 基础]
keywords: [内存管理, 参数传递]
---

<script type="text/javascript" src="/js/src/bai.js"></script>

## Python的参数传递是值传递还是引用传递
Python的参数传递有：
- 位置参数
- 默认参数，
- 可变参数,
- 关键字参数

函数的传值到底是值传递还是引用传递，要分情况

- 不可变参数用值传递：
像整数和字符串这样的不可变对象，是通过拷贝进行传递的，因为你无论如何都不可能在原处改变不可变对象

- 可变参数是用引用传递的：
比如像列表，字典这样的对象是通过引用传递，和C语言里面的用指针传递数组很相似，可变对象能在函数内部改变.

<!-- more -->

## Python是如何进行内存管理的
### 对象的引用计数机制

Python内部使用引用计数，来保持追踪内存中的对象，所有对象都有引用计数。

- 引用计数增加的情况：

    - 一个对象分配一个新名称
    - 将其放入一个容器中（如列表、元组或字典）
- 引用计数减少的情况：

    - 使用del语句对对象别名显示的销毁
    - 引用超出作用域或被重新赋值

### 垃圾回收
当一个对象的引用计数归零时，它将被垃圾收集机制处理掉。

### 内存池机制
Python提供了对内存的垃圾收集机制，但是它将不用的内存放到内存池而不是返回给操作系统:

- Pymalloc机制：为了加速Python的执行效率，Python引入了一个内存池机制，用于管理对小块内存的申请和释放。
- 对于Python对象，如整数，浮点数和List，都有其独立的私有内存池，对象间不共享他们的内存池。也就是说如果你分配又释放了大量的整数，用于缓存这些整数的内存就不能再分配给浮点数。

## 写出你认为最Pythonic的代码
下面是一些比较好的例子

交互变量
```python
# 非Pythonic
temp = a
a = b
b = temp
# pythonic:
a,b=b,a
```
判断其值真假
```python
name = 'Tim'
langs = ['AS3', 'Lua', 'C']
info = {'name': 'Tim', 'sex': 'Male', 'age':23 }  
# 非Pythonic
if name != '' and len(langs) > 0 and info != {}:
    print('All True!') 
# pythonic:
if name and langs and info:
    print('All True!')  
```
列表推导式
```python
[x for x in range(1,100) if x%2==0]
```
zip创建键值对
```python
keys = ['Name', 'Sex', 'Age']
values = ['Jack', 'Male', 23]
dict(zip(keys,values))
```

## csrf是什么？如何防范？
CSRF概念：CSRF跨站点请求伪造(Cross—Site Request Forgery)，跟XSS攻击一样，存在巨大的危害性，你可以这样来理解：

攻击者盗用了你的身份，以你的名义发送恶意请求，对服务器来说这个请求是完全合法的，但是却完成了攻击者所期望的一个操作，比如以你的名义发送邮件、发消息，盗取你的账号，添加系统管理员，甚至于购买商品、虚拟货币转账等。 如下：其中Web A为存在CSRF漏洞的网站，Web B为攻击者构建的恶意网站，User C为Web A网站的合法用户。

 CSRF攻击攻击原理及过程如下：

    1. 用户C打开浏览器，访问受信任网站A，输入用户名和密码请求登录网站A；

    2.在用户信息通过验证后，网站A产生Cookie信息并返回给浏览器，此时用户登录网站A成功，可以正常发送请求到网站A；

    3. 用户未退出网站A之前，在同一浏览器中，打开一个TAB页访问网站B；

    4. 网站B接收到用户请求后，返回一些攻击性代码，并发出一个请求要求访问第三方站点A；


    5. 浏览器在接收到这些攻击性代码后，根据网站B的请求，在用户不知情的情况下携带Cookie信息，向网站A发出请求。网站A并不知道该请求其实是由B发起的，所以会根据用户C的Cookie信息以C的权限处理该请求，导致来自网站B的恶意代码被执行。

 防御CSRF攻击：

目前防御 CSRF 攻击主要有三种策略：验证 HTTP Referer 字段；在请求地址中添加 token 并验证；在 HTTP 头中自定义属性并验证。




