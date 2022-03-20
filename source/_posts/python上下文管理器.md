---
title: python上下文管理器
type: categories
copyright: true
tags:
  - python
  - 基础
categories:
  - python
  - 基础
keywords: 上下文管理器
abbrlink: 3338556279
date: 2022-03-20 21:14:15
---

###  什么是上下文管理器

简单来说，在一个类中，我们实现了__enter__和__exit__两种方法，那么这个类的实例就是一个上下文管理器；

###  为何使用上下文管理器

- 通过上下文管理器，可以优雅的操作资源，比如数据库连接，文件的操作；
- 可以通过上下文管理器优雅的处理异常；

<!-- more -->

python中对上下文管理器的操作句柄**with**；

1、通过使用with操作文件对象
```python
with open(file, "r") as f:
    pass
```

2、通过with操作数据的连接
```python
with pymysql.connect(**kwargs) as conn:
    pass
```

3、 通过定义__enter__, __exit__方法来使用数据库；
```python
class Pipeline：
    def __init__(self, host, port, user, password, db):
        self.host = host
        self.port = port
        self.user = user
        self.passwd = password
        self.db = db
    def __enter__(self):
        self.conn = pymysql.connect(self.host, self.port, self.user, self.passwd, self.db)
        return self

    def __exit__(self):
        self.conn.close()
```

4、 使用上下文管理器来操作异常
```python
class DealExc:
    def __enter__(self):
        # 操作资源
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """
        exc_type：异常类型
        exc_val：异常值
        exc_tb：异常的错误栈信息
        """
        # 当主逻辑代码没有报异常时，这三个参数将都为None。
        # 关闭资源连接
        return True

    def operate(self):
        # 具体的内容
        pass

with DealExc() as d:
    d.operate()
```

### 理解并使用 contextlib

python中为了更简单的使用上下文管理器，提供了一个装饰器contexlib；我们按照它定义的写法来实现一个函数内容，就可以将该函数变成一个上下文管理器；

```python
import contextlib

@contextlib.contextmanager
def open_func(file_name):
    # __enter__方法
    print('open file:', file_name, 'in __enter__')
    file_handler = open(file_name, 'r')
	
    # 【重点】：yield
    yield file_handler

    # __exit__方法
    print('close file:', file_name, 'in __exit__')
    file_handler.close()
    return

with open_func(filename) as fp:
    for line in fp:
        print(line)
```
在被装饰函数里，必须是一个生成器（带有yield），而yield之前的代码，就相当于__enter__里的内容。yield 之后的代码，就相当于__exit__ 里的内容。

我们也可以在函数中进行异常处理；
```python
import contextlib

@contextlib.contextmanager
def open_func(file_name):
    # __enter__方法
    print('open file:', file_name, 'in __enter__')
    file_handler = open(file_name, 'r')

    try:
        yield file_handler
    except Exception as exc:
        # deal with exception
        print('the exception was thrown')
    finally:
        print('close file:', file_name, 'in __exit__')
        file_handler.close()
        return
```

