---
title: list去重和单例
type: categories
copyright: true
date: 2022-03-03 16:11:51
tags:
    - python
    - 基础
categories: [python, 基础]
keywords: [单例, 列表去重]
top: 77
---

<script type="text/javascript" src="/js/src/bai.js"></script>

## python里面re模块match()和search()的区别
- match()函数指检测re是不是在str的开始位置匹配
- search()会扫描整个str查找匹配，会扫描整个字符串并返回第一个成功的匹配

也就是说match()只有在0位置匹配成功的话才有返回，如果不是开始位置匹配成功的话，返回none

## python传递可变默认参数类型，默认指向同一个引用
<!-- more -->
```python
def f(x,l=[]):  
    for i in range(x):  
        l.append(i*i)  
    print(l)  
f(2)#[0,1]  
f(3,[3,2,1])#[3,2,1,0,1,4]  
f(3)#[0,1,0,1,4]  
```
## 列表的去重方法
- 集合方法
```python
li = [1, 1, 2, 3, 3, 4, 4, 5, 5, 6]  
a = []  
# 列表去重方法一：集合方法  
b = set(li)  
print(b) 
```
- 遍历统计次数，删除重复选项 
```python
for i in li:  
    while li.count(i) > 1:  
        del li[li.index(i)]  
print(li) 
```
- 遍历列表，添加新列表对比 
```python
a = []  
for i in li:  
    if i in li:  
        if i not in a:  
            a.append(i)  
print(a)  
```
- 先对元素进行排序，然后从列表的最后开始扫描
```python
list = [1, 1, 2, 3, 3, 4, 4, 5, 5, 6]  
if list:  
    list.sort()  
    last = list[-1]  
  
    for i in range(len(list)-2,-1,-1):  
        if last == list[i]:  
            del list[i]  
        else:last = list[i]  
  
print(list)  
```
- 利用map的fromkeys来自动过滤重复值
```python
l1 = [1, 1, 2, 3, 3, 4, 4, 5, 5, 6]  
l2 = {}.fromkeys(l1).keys()  
print(l2)  
```

## 单例
所谓单例，是指一个类的实例从始至终只能被创建一次。 

### 方法一
```python
# 如果想使得某个类从始至终最多只有一个实例，使用__new__方法会很简单。Python中类是通过__new__来创建实例的：  
  
class Singleton(object):  
    _instance = None  
  
    def __new__(cls, *args, **kw):  
        if not cls._instance:  
            cls._instance = super(Singleton, cls).__new__(cls, *args, **kw)  
        return cls._instance  
  
class MyClass(Singleton):  
    a = 1  
one=MyClass()  
two=MyClass()  
print(id(one),id(two))  
```
结果：id相同  
在上面的代码中，我们将类的实例和一个类变量 _instance 关联起来，  
如果 cls._instance 为 None 则创建实例，否则直接返回 cls._instance。  

### 方法二
```python
# 有时候我们并不关心生成的实例是否具有同一id，而只关心其状态和行为方式。  
# 我们可以允许许多个实例被创建，但所有的实例都共享状态和行为方式：  
  
class Borg(object):     
    _shared_state={}     
    def __new__(cls,*args,**kwargs):       
        obj=super(Borg,cls).__new__(cls,*args,**kwargs)       
        obj.__dict__=cls._shared_state       
        return obj   
```
>将所有实例的__dict__指向同一个字典，这样实例就共享相同的方法和属性。  

>对任何实例的名字属性的设置，无论是在__init__中修改还是直接修改，所有的实例都会受到影响。

>不过实例的id是不同的。要保证类实例能共享属性，但不和子类共享，注意使用cls._shared_state,  

>而不是Borg._shared_state。  
>因为实例是不同的id，所以每个实例都可以做字典的key： 

如果这种行为不是你想要的，可以为Borg类添加__eq__和__hash__方法，  
使其更接近于单例模式的行为：  
```python
class Borg(object):     
    _shared_state={}     
    def __new__(cls,*args,**kwargs):       
        obj=super(Borg,cls).__new__(cls,*args,**kwargs)       
        obj.__dict__=cls._shared_state       
        return obj     
    def __hash__(self):       
        return 1    
    def __eq__(self,other):       
        try:         
            return self.__dict__ is other.__dict__       
        except:         
            return False  


if __name__=='__main__':     
    class Example(Borg):       
        pass    
    a=Example()     
    b=Example()     
    c=Example()     
    adict={}     
    j=0    
    for i in a,b,c:       
        adict[i]=j       
        j+=1    
    for i in a,b,c:       
        print(adict[i])  

# 所有的实例都能当一个key使用了。  
```
### 方法三

当你编写一个类的时候，某种机制会使用类名字，基类元组，类字典来创建一个类对象。新型类中这种机制默认为type，而且这种机制是可编程的，称为元类__metaclass__ 。
```python
class Singleton(type):     
    def __init__(self,name,bases,class_dict):       
        super(Singleton,self).__init__(name,bases,class_dict)       
        self._instance=None    
    def __call__(self,*args,**kwargs):       
        if self._instance is None:         
            self._instance=super(Singleton,self).__call__(*args,**kwargs)    
        return self._instance   
if __name__=='__main__':     
    class A(object):       
        __metaclass__=Singleton         
    a=A()     
    b=A()     
    print (id(a),id(b))  
# 结果：  
# 34248016 34248016  
# id是相同的。 
``` 
- 例子中我们构造了一个Singleton元类，并使用__call__方法使其能够模拟函数的行为。  
- 构造类A时，将其元类设为Singleton，那么创建类对象A时，行为发生如下：  
- A=Singleton(name,bases,class_dict),A其实为Singleton类的一个实例。  
- 创建A的实例时，A()=Singleton(name,bases,class_dict)()=Singleton(name,bases,class_dict).\_\_call__()，这样就将A的所有实例都指向了A的属性_instance上，这种方法与方法1其实是相同的。  

### 方法四
python中的模块module在程序中只被加载一次，本身就是单例的。可以直接写一个模块，将你需要的方法和属性，写在模块中当做函数和模块作用域的全局变量即可，根本不需要写类。 
```python
class _singleton(object):     
    class ConstError(TypeError):       
        pass    
    def __setattr__(self,name,value):       
        if name in self.__dict__:         
            raise self.ConstError       
            self.__dict__[name]=value     
    def __delattr__(self,name):       
        if name in self.__dict__:         
            raise self.ConstError       
        raise NameError   
import sys   
sys.modules[__name__]=_singleton()   
# python并不会对sys.modules进行检查以确保他们是模块对象，  
# 我们利用这一点将模块绑定向一个类对象，而且以后都会绑定向同一个对象了。  
# 将代码存放在single.py中： 
```
```
import single   
single.a=1  
single.a=2   
  
ConstError  
  
>>> del single.a  
ConstError   
```
### 方法五
```python
# 最简单的方法：  
  
class singleton(object):     
    pass  
singleton=singleton()   
# 将名字singleton绑定到实例上，singleton就是它自己类的唯一对象了
```

