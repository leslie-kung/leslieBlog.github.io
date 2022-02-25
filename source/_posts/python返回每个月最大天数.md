---
title: python返回每个月最大天数
type: categories
copyright: true
date: 2020-01-02 12:07:27
tags:
    - python
categories: python
---

## python返回过去时间里的每月最大天数

### 导包 
```python
import datetime
```

### 代码

<!--more-->

```python
def get_date_list(num=1):
    now = datetime.datetime.now()
    year = now.strftime('%Y')
    mon = now.strftime('%m')
    day = now.strftime('%d')
    date_list = []
    date_list.append([day, mon, year])
    temp = now
    for i in range(1, num):
        last_mon_day = temp - datetime.timedelta(days=temp.day)
        last_day = last_mon_day.strftime('%d')
        mon = last_mon_day.strftime('%m')
        year = last_mon_day.strftime('%Y')
        date_list.append([last_day, mon, year])
        temp = last_mon_day
    return date_list
```

```python
# 返回过去一年每个月的时间
date_list = get_date_list(12)
print(date_list)
```

```python
[['22', '06', '2018'], ['31', '05', '2018'], ['30', '04', '2018'], ['31', '03', '2018'], ['28', '02', '2018'], ['31', '01', '2018'], ['31', '12', '2017'], ['30', '11', '2017'], ['31', '10', '2017'], ['30', '09', '2017'], ['31', '08', '2017'], ['31', '07', '2017']]
```
