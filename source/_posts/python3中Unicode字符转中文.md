---
title: python3中Unicode字符转中文
type: categories
copyright: true
date: 2020-01-02 14:51:14
tags:
    - python
    - 爬虫
categories: [python, 爬虫]
---

## python3中将Unicode字符串转成中文

用python爬虫爬取数据时，有时候会发现爬取的数据类似于
```python
\u3010\u6f14\u5531\u4f1a\u30112000-\u62c9\u9614\u97f3\u4e50\u4f1a
```
这样的Unicode字符串，在python的交互环境里可以直接打印输出查看内容；
```python
print("\u3010\u6f14\u5531\u4f1a\u30112000-\u62c9\u9614\u97f3\u4e50\u4f1a")

# 【演唱会】2000-拉阔音乐会
```
<!--more-->

但是有些时候，我们需要保存的是中文数据，而不是Unicode字符串，所以我们需要将Unicode转成中文，我们知道encode()方法是将Unicode码转成我们需要的编码格式，但是我们返回的本身就是str格式，所以我们需要将Unicode字符串转成Unicode码，网上查了资料，是将字符串进行decode("unicode_escape")转换，但是在python3中，提示str没有decode的方法。

因此解决的办法是先采用encode()进行编码，在用同样的编码格式进行decode解码；

```python
data = "\u3010\u6f14\u5531\u4f1a\u30112000-\u62c9\u9614\u97f3\u4e50\u4f1a".encode("utf-8").decode("utf-8")
print(type(data))  # <class 'str'>
print(data)  # 【演唱会】2000-拉阔音乐会
```

```python
data = "\u3010\u6f14\u5531\u4f1a\u30112000-\u62c9\u9614\u97f3\u4e50\u4f1a".encode("GBK").decode("GBK")
print(type(data))  # <class 'str'>
print(data)  # 【演唱会】2000-拉阔音乐会
```

编码格式可以任意，只是解码的时候需要用相同的格式进行解码就行，这样我们就可以保存中文数据了。
