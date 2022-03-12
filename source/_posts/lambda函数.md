---
title: lambda函数
type: categories
copyright: true
date: 2020-01-02 15:41:29
tags:
    - python
    - 基础
categories: [python, 基础]
---

## 记一次项目中lambda函数的应用

lambda函数也叫做匿名函数，它允许我们快速定义，并且让代码更简洁
此次记录一下在项目中使用到lambda函数的场景

<!--more-->

### 代码
```python

def get(self, url=None, headers=None, encode=False, login_info=None, proxy_ip=None, path=None,  verify=False, retry_times=3, decision=lambda x: True, **kwargs):
    proxies = None
    if proxy_ip:
        proxies = {"http": proxy_ip, "https": proxy_ip}
    res = None
    data = kwargs['params'] if 'params' in kwargs else None
    for i in range(retry_times):
        try:
            flag = True
            res = self.session.get(url=url, headers=headers, proxies=proxies, verify=verify, **kwargs)
            self.save_src(url=url, headers=headers, data=data, res=res, login_info=login_info, path=path, encode=encode)
            flag = False
            if res.status_code != 200:
                logger.error('crawl_session get: internet error! url: %s' % url)
            if res.status_code >= 500:
                continue
            elif res.status_code == 200 and not decision(res):
                continue
            else:
                break
        except:
```

这里封装了一下requests的get方法，加入了一个decision参数，该参数是一个匿名函数，retry_times是重试次数，通过匿名函数对res结果进行判断，对爬取结果进行预处理；

```python
def decision(res):
    if 'java.lang.NullPointerException' in res.text:
        return False
    return True
```
上面的函数是我们在爬虫中定义的一个判断函数，当我们如果知道爬取结果中必定会有某个特殊的返回值时，通过该函数我们可以判断爬取的结果是否是正确的；简单的例子，当有可能我们请求服务端json数据时，返回状态码是200，response的json确是一个空值，而我们确定该json一定不是空值，这是我们可以通过lambda函数预处理进行重爬。

