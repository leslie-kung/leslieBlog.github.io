---
title: python中对象和继承
type: categories
copyright: true
tags:
  - python
  - 基础
categories:
  - python
  - 基础
keywords:
  - 类
  - 继承
abbrlink: 3262789355
date: 2022-03-19 13:30:30
---

## python中的类

**类的定义：**  类是某类事物的统称，对象是基于类的实例；比如说我们定义一个动物类，那么狗便是这个类的一个实例对象；

python中类的创建有几个特殊的魔法糖(装饰器)对方法进行修饰，使其具有特殊的属性；

- @abstractmethod (抽象方法)
- @property (方法伪装属性)
- @classmethod (类方法)
- @staticmethod (静态方法)

<!-- more -->

### 抽象方法
具有@abstractmethod装饰的方法的类是不能实例化的，其子类也需要重写所有的abstractmethod所装饰的方法才能实例化，未被装饰的方法可以不重写；
```python
from abc import ABC, abstractmethod

class Person(ABC):
    pass
```

### 方法伪装属性
使用property进行装饰的特点

- 被装饰的方法返回 值及属性值；
- 被装饰的方法不能有参数；
- 必须进行实例化才能调用；
- 类本身不能调用；

**使用场景：** 对于用户模型类的定义，考虑到密码的安全性，我们在数据库不存储密码明文，因此定义一个方法，该方法使用property进行装饰，设置不可读；
```python
class User(db.Model):
    password_hash = db.Column(db.String(128), nullable=False)  # 加密的密码

    @property
    def password(self):
        # 将password方法提升为属性
        raise AttributeError("不可读")

    @password.setter
    def password(self, passwd):
        # 设置password属性时被调用，设置密码加密
        self.password_hash = generate_password_hash(passwd)

    def checkout_password(self, passwd):
        # 检查密码的正确性
        return check_password_hash(self.password_hash, passwd)
```

### 类方法
- 类方法通过@classmethod进行装饰，可以通过实例对象和类对象进行调用；-
- 被该函数装饰的方法的第一个参数默认为cls,代表类本身；
- 被装饰方法可以调用类属性，不能调用实例属性；


### 静态方法
- 静态方法通过@staticmethod进行装饰，可以通过实例对象和类对象进行调用；
- 被该函数装饰的方法可以没有参数
- 被装饰方法内部可以通过类名.属性的方式来引用类属性和类方法；
- 静态方法不能调用实例属性；

## python中的继承和多态

### 继承
python的类分为两种类型
- 经典类，python2的默认类
- 新式类，python3的默认类

**继承的概念：** 继承是类与类的一种关系，是子类和父类的关系；子类继承父类的属性和方法；

**继承的优点：** 通过继承，子类可以拥有父类的属性和方法；可以直接调用父类的属性和方法；可以避免重复定义相同的属性和方法，降低了代码的冗余程度，提升了代码的可读性；

**继承的顺序：** 继承的顺序和类的类型有关；简单来说，经典类采用的深度优先的顺序，新式类采用的广度优先的顺序；我们可以通过打印子类的__mro__属性来查看类的继承顺序；

**isinstance()及issubclass()方法**

Python 与其他语言不同点在于，当我们定义一个 class 的时候，我们实际上就定义了一种数据类型。我们定义的数据类型和Python自带的数据类型，比如str、list、dict没什么两样。

Python 有两个判断继承的函数：isinstance() 用于检查实例类型；issubclass() 用于检查类继承。

### 多态
**多态**是指一类事物具有多种形态；在面向对象编程上，一个抽象类具有多个子类；因而多态的概念依赖于继承的；

**多态性**是指具有不同功能的函数可以使用相同的函数名，这样可以用一个函数名调用不同内容的函数，即**一个接口，多种实现**；

### 鸭子类型
调用不同的子类会产生不同的行为，而不必知道这个子类实际上是什么；这便是多态的重要使用场景；

在python中，鸭子类型是动态类型的一种风格，其关注的并不是类型对象的本身，而是其如何使用的；

鸭子类型通常得益于不测试方法和函数中参数的类型，而是依赖文档、清晰的代码和测试来确保正确使用；

**举例**
- 如果一个对象实现了getitem方法，那python的解释器就会把它当做一个collection，就可以在这个对象上使用切片，获取子项等方法；

- 如果一个对象实现了iter和next方法，python就会认为它是一个iterator，就可以在这个对象上通过循环来获取各个子项；

