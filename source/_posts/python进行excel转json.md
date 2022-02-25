---
title: python进行excel转json
type: categories
copyright: true
date: 2020-01-02 11:36:53
tags:
    - 数据分析
    - python
categories: [python, 数据分析]
---
## 使用python进行excel转json文件
### 1、首先导入我们需要用到的库
```python
import xlrd
from collections import OrderedDict
import json
```
<!--more-->

### 2、具体代码如下：
```python
def Excel_to_json(file):
    wb = xlrd.open_workbook(file)

    convert_list = []
    sh = wb.sheet_by_index(0)
    title = sh.row_values(0)  # 表头，json文件的key
    print(title)
    for rownum in range(1, sh.nrows):
        rowvalue = sh.row_values(rownum)
        single = OrderedDict()  # 有序字典
        for colnum in range(0, len(rowvalue)):
            print("key:{0}, value:{1}".format(title[colnum], rowvalue[colnum]))
            single[title[colnum]] = rowvalue[colnum]
        convert_list.append(single)

    j = json.dumps(convert_list)

    with open("file.json", "w", encoding="utf8") as f:
        f.write(j)
```
## 使用python进行json转csv文件
### 1、同样，我们先导入需要的库

```python
import csv
import json
```
### 2、代码如下：

```python
def json_to_csv(path):
    with open(path + '.json', "r") as  f:
        data = f.read()
    jsonData = json.loads(data)

    csvfile = open(path + ".csv", "w", newline='')
    keys_write = True
    writer = csv.writer(csvfile)
    print(jsonData)
    for dic in jsonData:
        if keys_write:
            keys = list(dic.keys())
            print(keys)
            writer.writerow(keys)
            keys_write = False
        writer.writerow(list(dic.values()))
        print(list(dic.values()))
    csvfile.close()
```

```python
if __name__ == "__main__":
    path = "file"  # 文件的路径
    json_to_csv(path)
```
