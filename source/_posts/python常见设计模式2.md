---
title: python常见设计模式(二)
type: categories
copyright: true
tags:
  - python
  - 设计模式
categories:
  - python
  - 设计模式
keywords: 设计模式
abbrlink: 100580167
date: 2022-03-13 18:42:11
---

[python常见设计模式(一)][1]

[python常见设计模式(三)][2]

## 结构型模式
- 适配器模式
- 装饰器模式
- 外观模式
- 享元模式
- 模型视图控制器模式(MVC)
- 代理模式
<!-- more -->

### 适配器模式
&emsp;&emsp; 所谓的适配器模式是指一种接口适配技术，它可以通过某个类来使用另一个与接口不兼容的类，运用此模式，两个类的接口都无需改动；

&emsp;&emsp; 适配器模式主要应用于希望复用一些现存的类，但接口又与复用环境要求不一致的情况；
```python
class Tagret:
  def request(self):
    print("普通请求")

class Adaptee:
  def specific_request(self):
    print("特殊请求")

class Adapter(Tagret):
  def __init__(self):
    self.adaptee = Adaptee()

  def request(self):
    self.adaptee.specific_request()

tagret = Adapter()
tagret.request()
```

### 装饰器模式
&emsp;&emsp; [装饰器][3]模式通常用于给一个对象扩展功能；
```python
import functools

# 定义一个装饰器
def memoize(fn):
  known = dict()

  @functools.wraps(fn)
  def memoizer(*args):
    if args not in known:
      known[args] = fn(*args)
    return known[args]
  return memoizer

# 返回前n个数的和
@memoize
def nsum(n):
  assert(n >= 0)  # 断言，n需要大于0
  return 0 if n == 0 else n + nsum(n-1)

# 返回菲波第n个数
@memoize
def fibo(n):
  assert (n >= 0)
  return n if n in (0, 1) else fibo(n-1) + fibo(n-2)
```

### 外观模式(门面模式)
&emsp;&emsp; 外观模式又叫做门面模式；在面向对象编程中，解耦是一种推崇的理念，但是事实上由于系统的复杂性，增加了客户端和子系统的耦合度，这时需要考虑使用外观模式，引入一个类对子系统进行包装，让客户端与其交互；

&emsp;&emsp; 外观模式(Facade Pattern)：外部与一个子系统的通信必须通过一个统一的外观对象进行，为子系统中的一组接口提供一个一致的界面，外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。外观模式又称为门面模式，它是一种对象结构型模式。

```python
from enum import Enum
from abc import ABC, abstractmethod

# 定义一个枚举类
# 对实例化对象固定的，我们可以用枚举类来定义；比如一年12个月是固定的
# 枚举类是特殊的类，不能实例化对象
# 我们可以通过类属性的方式获取枚举值，也可以通过遍历的方式获取
# 枚举类中各个成员的值，不能在类的外部做任何修改
State = Enum('State', ('new', 'running', 'sleeping', 'restart', 'zombie',))


class Server(ABC):
  """
  abstractmethod装饰的方法是：
  抽象方法 没有实现，所以基类不能实例化，子类实现了该抽象方法才能被实例化
  """
  @abstractmethod  
  def __init__(self):
    pass
  
  def __str__(self):
    return self.name

  @abstractmethod
  def boot(self):
    pass

  @abstractmethod
  def kill(self, restart=True):
    pass

# 定义一个文件服务
class FileServer(Server):
  def __init__(self):
    self.name = "File server"
    self.state = State.new

  def boot(self):
    # 启动文件进程
    print("booting the {}".format(self))
    self.state = State.running
  
  def kill(self, restart=True):
    # 终止文件进程
    print("kill the {}".format(self))
    self.state = State.restart if restart else State.zombie

  def create_file(self):
    pass

# 定义一个进程服务，类似于上面的文件服务
class ProcessServer(Server):
  pass

# 定义外观，统一的接口类
class OperateSys:
  def __init__(self):
    self.fs = FileServer()
    self.ps = ProcessServer()

  def start(self):
    # 启动
    [i.boot() for i in (self.fs, self.ps,)]

  def close(self):
    # 关闭
    [i.kill() for i in (self.fs, self.ps,)]

  def create_file(self):
    self.fs.create_file()

def main():
  ops = OperateSys()
  ops.start()
  ops.create_file()
  ops.close()
```

### 享元模式
运用共享技术有效地支持大量细粒度的对象。

**内部状态：** 享元对象中不会随环境改变而改变的共享部分。比如围棋棋子的颜色。

**外部状态：** 随环境改变而改变、不可以共享的状态就是外部状态。比如围棋棋子的位置。

**应用场景：** 程序中使用了大量的对象，如果删除对象的外部状态，可以用相对较少的共享对象取代很多组对象，就可以考虑使用享元模式。

```python
from enum import Enum

QiziColor = Enum('QiziColor', ('white', 'black',))

class Qizi:
  # 定义棋子类
  pool = dict()

  def __new__(cls, qizi_color):
    obj = cls.pool.get(qizi_color, None)
    if not obj:
      obj = object.__new__(cls)
      cls.pool[qizi_color] = obj
      obj.qizi_color = qizi_color
    return obj
  
  def render(self, nums):
    print("qizhi_color:{}, nums:{}".format(self.qizi_color, nums))

def main():
  qizi_count = 0
  for i in range(4):
    q1 = Qizi(QiziColor.white)
    q1.render(i)
    qizi_count += 1

  for i in range(5):
    q2 = Qizi(QiziColor.black)
    q2.render(i)
    qizi_count += 1

  print("qizi render count: {}".format(qizi_count))
  print("qizi create count: {}".format(len(Qizi.pool)))

  q1 = Qizi(QiziColor.white)
  q2 = Qizi(QiziColor.black)
  q3 = Qizi(QiziColor.white)
  print('{} == {}? {}'.format(id(q1), id(q2), id(q1)==id(q2)) )
  print('{} == {}? {}'.format(id(q1), id(q3), id(q1)==id(q3)) )

"""
qizhi_color:QiziColor.white, nums:0
qizhi_color:QiziColor.white, nums:1
qizhi_color:QiziColor.white, nums:2
qizhi_color:QiziColor.white, nums:3
qizhi_color:QiziColor.black, nums:0
qizhi_color:QiziColor.black, nums:1
qizhi_color:QiziColor.black, nums:2
qizhi_color:QiziColor.black, nums:3
qizhi_color:QiziColor.black, nums:4
qizi render count: 9
qizi create count: 2
140323920711864 == 140323920712144? False
140323920711864 == 140323920711864? True
"""
```

### 模型视图控制器模式(MVC)

### 代理模式


[//]:
    这是注释标签，可以进行注释
    
[1]: https://blog.leslie168.com/posts/2865700901.html

[2]: https://blog.leslie168.com/posts/2064489324.html

[3]: https://blog.leslie168.com/posts/1404355314.html


