---
title: python版布隆过滤器(二)
type: categories
copyright: true
tags:
  - python
  - redis
categories:
  - 数据库
  - redis
keywords: redis
abbrlink: 3745698069
date: 2019-12-31 17:30:00
---

<script type="text/javascript" src="/js/src/bai.js"></script>

[python版布隆过滤器(一)][blom]

## 布隆过滤器扩容和删除过期数据

&emsp;&emsp; 我们知道，布隆过滤器是不可变的，但如果布隆过滤器容量确实不够了，该怎么办呢？或者如果要每个月都删除几个月前的去重数据，该如何处理呢？这边要记录一种布隆过滤器的巧用，多个布隆过滤器组成的循环布隆过滤器。

<!-- more -->

### 布隆过滤器扩容
&emsp;&emsp; 因为布隆过滤器的不可逆，我们没法重新建一个更大的布隆过滤器然后去把数据重新导入。这边采取的扩容的方法是，保留原有的布隆过滤器，建立一个更大的，新增数据都放在新的布隆过滤器中，去重的时候检查所有的布隆过滤器。

代码实现：
```python
class BloomFilterAdapter(object):
    def __init__(self, old_filters, new_filter):
        self.old_filters = old_filters
        self.new_filter = new_filter

    def add(self, key):
        self.new_filter.add(key)

    def exists(self, key):
        return any([f.exists(key) for f in self.old_filters]) or self.new_filter.exists(key)

    def __len__(self):
        return sum([len(f) for f in self.old_filters]) + len(self.new_filter)
```

### 删除过期数据

&emsp;&emsp; 为了实现这么一个需求：使用布隆过滤器对url去重，但是每五个月要重新爬取一次。这边介绍一种循环的布隆过滤器，类似于之前的思路，由多个布隆过滤器组成，每个月都清空最早的那个过滤器。

```python
class CircleBloomFilter(object):
    def __init__(self, filter_num):
        """
        :param filter_num: 预期包含的filter数量
        """
        self.filter_num = filter_num
        self.filters = [new_bloomfilter()]

    def do_circle(self):
        """
        执行循环逻辑
        :return: 
        """
        if len(self.filters) >= self.filter_num:
            self.filters.pop(0)
        self.filters.append(new_bloomfilter())

    def add(self, key):
        self.filters[-1].add(key)

    def exists(self,key):
        return any([f.exists(key) for f in self.filters])
    
    def __len__(self):
        return sum([len(f) for f in self.filters])
```

&emsp;&emsp; 1、我们只需要定期执行do_circle方法就可以定期清除最早的过滤器；

&emsp;&emsp; 2、上面的add方法是对最后一个过滤器执行添加的操作，查询判断则是对所有过滤器都进行判断，这种适合于插入数据过多，而查询判断较少的场景；

&emsp;&emsp; 3、另一种场景则是插入数据较少，而查询判断过多的场景；因此add方法和exists方法可以适当修改一下；
```python
    def add(self,key):
        [f.add(key) for f in self.filters]
        
    def exists(self,key):
        return self.filters[0].exists(key)
```
我们在插入数据过程中，对每个过滤器都执行添加操作，而在查询判断的过程中，我们只需要对任意一个过滤器进行查询就可以了。


[blom]: https://blog.leslie168.com/posts/1886603895.html
