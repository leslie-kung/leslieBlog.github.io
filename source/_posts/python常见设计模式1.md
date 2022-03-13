---
title: python常见设计模式(一)
type: categories
copyright: true
tags:
  - python
  - 设计模式
categories:
  - python
  - 设计模式
keywords: 设计模式
abbrlink: 2865700901
date: 2022-03-13 18:40:10
---

[python常见设计模式(二)][1]

[python常见设计模式(三)][2]

## 创建型模式
- 单例模式
- 工厂模式
- 建造者模式
- 原型模式

### 单例模式
&emsp;&emsp; 单例模式（Singleton Pattern）是一种常用的软件设计模式，该模式的主要目的是确保某一个类只有一个实例存在。当你希望在整个系统中，某个类只能出现一个实例时，单例对象就能派上用场。

[python的几种单例][singleton]

<!-- more -->
### 工厂模式
工厂模式是一个在软件开发过程中用来创建对象的设计模式；工厂模式包含一个超类，这个超类提供一个抽象化接口来创建一个特定类型的对象；

工厂模式有三种，分别为简单工厂，工厂方法，抽象工厂；
- **简单工厂模式**

&emsp;&emsp; 假如我们有一个汽车工厂，分别生成奔驰和宝马汽车；
```python
class Benchi:
  def __init__(self):
    return "benchi"

class Baoma:
  def __init__(self):
    return "baoma"

class CarFactory:  # 简单工厂，根据类型生成汽车
  def produce_car(self, car):
    if car == "benchi":
      return Benchi()
    elif car == "baoma":
      return Baoma()
    else:
      print("没有可生产的汽车！")
      return

def main():
  # 我们可以向固定的接口传递参数来获取想要的汽车对象
  cf = CarFactory()
  car1 = cf.produce_car("benchi")
  car2 = cf.produce_car("baoma")
```
- **工厂方法模式**

&emsp;&emsp; 我们已经有了简单工厂，但是如果需要新的汽车奥迪，我们不仅要写Audi类，还要修改工厂类，不利于以后的扩展；

&emsp;&emsp; 我们在简单工厂模式的基础上，抽象出不同的工厂，每个工厂对应生成自己的产品；
```python
class AbsFactory:
  # 抽象工厂
  def produce_car(self):
    # 只是定义方法，具体实现在子类中进行
    pass

class BenchiFac(AbsFactory):
  def produce_car(self):
    # 重写父类的方法
    return Benchi()

class BaomaFac(AbsFactory):
  def produce_car(self):
    return Baoma()

def main():
  # 我们可以通过特定的工厂来获取特定的产品
  car1 = BenchiFac().produce_car()
  car2 = BaomaFac().produce_car()
```
- **抽象工厂模式**

&emsp;&emsp; 工厂方法虽然方便了我们以后的扩展，但如果我们要生产很多不同产品，就同样需要写很多对应的工厂类。

&emsp;&emsp; 为了解决这个问题，我们需要把同类产品进一步抽象到一个工厂类中，这就是抽象工厂。
```python
# 同样品类我们生成轿车和SUV两种类型
class AbsFactory:
  def produce_car(self):
    pass
  
  def produce_suv(self):
    pass

class BenchiFac(AbsFactory):
  def produce_car(self):
    return Benchi()

  def produce_suv(self):
    return BenchiSuv()

def main():
  car = BenchiFac().produce_car()
  suv = BenchiFac().produce_suv()
```
三种工厂模式复杂度逐步递增，实际使用过程中，应根据系统复杂度采用合适的工厂模式。

### 建造者模式
将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

简单理解成：一个接口类定义创建对象的方法(基类)，一个指挥类型的类也可说是调度类型的类，用来指定哪个创造类(子类)创造，实例化；
```python
# 接口类基类
class Person:
  __metaclass__ = Singleton  # 创建一个单列

  def play(self):
    pass
  
  def study(self):
    pass

# 创造类 子类
class Boys(Person):
  def play(self):
    print("打篮球")
  
  def study(self):
    print("上课")

class Girls(Person):
  def play(self):
    print("踢键子")
  
  def study(self):
    print("上课")

# 指挥类，调度类
class Director:
  def __init__(self, person):
    self.person = person

  def active():
    self.person.play()
    self.person.study()


if __name__=='__main__':
  boys = Boys()
  girls = Girls()
  director_boys = Director(boys)
  director_boys.active()
  
  director_girls = Director(girls)
  director_girls.active()
```

### 原型模式
用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。

原型模式本质就是克隆对象，所以在对象初始化操作比较复杂的情况下，很实用，能大大降低耗时，提高性能，因为“不用重新初始化对象，而是动态地获得对象运行时的状态”。

```python
# 基类 原型类
class Student:
  def __init__(self, name, **kwargs):
    # **kwargs 有 age, gender, birth
    self.name = name
    self.__dict__.update(kwargs)
  
  def __str__(self):
    info = []
    for k, v in self.__dict__.items():
      info.append("{}: {}".format(k, v))
      info.append("\n")
    return "".join(info)

class Prototype:
  def __init__(self):
    self.objects = dict()

  def register(self, identifier, obj):
    self.objects[identifier] = obj

  def unregister(self, identifier):
    del self.objects[identifier]

  def clone(self, identifier, **attr):
    found = self.objects.get(identifier, None)
    if not found:
      raise ValueError('Incorrect object identifier: {}'.format(identifier))
    obj = copy.deepcopy(found)
    obj.__dict__.update(attr)
    return obj

def main():
  S1 = Student("张三", age=18, gender="男", birth="2002-09-12")
  pro = Prototype()
  cid = "s_01"
  pro.register(cid, S1)  # 注册

  # S2 = Student() 不在需要实例化一次
  S2 = pro.clone(cid, name="小芳", age=16, gender="女", birth="2004-12-08", classroom="高二(3)班")

  for i in (S1, S2):
    print(i)

"""
name: 张三
age: 18
gender: 男
birth: 2002-09-12

name: 小芳
age: 16
gender: 女
birth: 2004-12-08
classroom: 高二(3)班
"""
```


[1]: https://blog.leslie168.com/posts/100580167.html

[2]: https://blog.leslie168.com/posts/2064489324.html

[singleton]: https://blog.leslie168.com/posts/2767789526.html
