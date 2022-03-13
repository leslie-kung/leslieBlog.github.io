---
title: 解决api变化问题
type: categories
copyright: true
tags:
  - 项目
  - requests
  - jsdom
categories:
  - python
  - 爬虫
abbrlink: 865398304
date: 2020-01-02 15:48:11
---

## python解决api变化的问题

案例：http://cic.org.vn

&emsp;&emsp;该网站用python进行模拟登录时，url链接是经过js加载生成的，当我们用requests发送get请求的时候，返回的结果并不是真正的主页数据，而是一段js代码，但是直接从这段js代码中解析我们需要的登录页url很困难，因此这里我们可以构造一个轻量级的js环境，执行js代码来获取我们需要的数据。

环境：
我们通过jsdom来构造一个轻量的环境，它是基于node的，因此我们需要安装node环境，这里安装的是node8的版本；
<!--more-->

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
安装jsdom
```
npm install jsdom
```

创建js的运行环境
```python
js_env = '''
    const jsdom = require("jsdom");const { JSDOM } = jsdom;
    const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
        url: "%s",
        contentType: "text/html;charset=utf-8",
        includeNodeLocations: true,
        storageQuota: 10000000
    });
    const window=dom.window;
    const document=dom.window.document;
    const navigator = dom.window.navigator;
    '''
```
### 爬虫部分
#### 导包
```python
# -*- coding: utf-8 -*-

import execjs
import requests
from scrapy import Selector
```

#### 构造请求
```python
sess = requests.Session()

headers = {
    'Host': 'cic.org.vn',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:49.0) Gecko/20100101 Firefox/49.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

url = "http://cic.org.vn/"
res = sess.get(url=url, headers=headers)
html = Selector(text=res.text)
js = html.xpath("/html/head/script/text()").extract_first()
```

#### 将我们获取的js代码加载到我们能构建的js运行环境中

```python
ctx = execjs.compile(js_env % res.url + js)
```

执行js获取生成的下一个链接

```python
next_url = ctx.eval("href") + ctx.eval("query")
print(next_url)

# 结果
url = "https://cic.org.vn/webcenter/portal/CMSPortal/;jsessionid=4Hej6rGiIAbPiBs6nsBUMP61E9XNGVRYkRzjI5H0kxOhUW9dTaqR!873813657?_afrLoop=715225492645337"
```

接下来的步骤都类似上一步，直到我们最终得到登录的url；最后我们就可以正常的模拟登录进行操作抓取数据了。

## 总结
&emsp;&emsp;本次的案例是我第一次遇到的爬虫情况，该网站的主页url也是经过js加载的，其参数是一直变化的，其返回的结果并不是主页的数据，因此我们无法直接从返回的数据中解析出我们需要的参数，所以我们构造这么一个轻量级的js环境进行交互，直接问询我们需要的url参数，到最终获取我们需要的登录页链接中间这种js交互需要3次。