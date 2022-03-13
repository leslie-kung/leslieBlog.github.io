---
title: python处理简单验证码
type: categories
copyright: true
tags:
  - python
  - 项目
categories:
  - python
  - 项目
abbrlink: 393345394
date: 2020-01-02 11:40:24
---
#### 利用python对简单的验证码进行处理
验证码如下所示：
![这里写图片描述](/image/code/code.png)
首先导入我们需要的包文件

```python
import os
import random
from string import ascii_lowercase
from PIL import Image
import numpy
```
将验证码进行切分，其中进行切分的坐标可以自行调整最佳；Image模块的convert()函数，用于不同模式图像之间的转换。

<!--more-->

```python
def div_im(im_name):
    im = Image.open(im_name).convert('L')   # 转换为灰度图像返回

    name = ''.join(random.sample(ascii_lowercase, 10))  # 随机序列化一个字符串
    regions = [(8, 6, 20, 26), (20, 6, 32, 26), (32, 6, 44, 26), (44, 6, 56, 26)]   # 定义切分坐标
    arr = list()
    for i, region in enumerate(regions):
        im2 = im.crop(region)   # 将验证码按坐标进行切分
        f_name = '{}_{}.jpg'.format(name, i)
        im2.save(f_name)
        arr.append(f_name)

    return arr
```
切分后返回的图片为：
![这里写图片描述](/image/code/code1.jpg) ![这里写图片描述](/image/code/code2.jpg) ![这里写图片描述](/image/code/code3.jpg) ![这里写图片描述](/image/code/code4.jpg)

将图片进行二值化处理

```python
def convert_im_to_array(im_name):
    im = Image.open(im_name).convert('L')
    a = numpy.array(im)
    a = numpy.array([[0 if j < 5 else 1 for j in i] for i in a])  # 数字5是自己调整的阈值
    return a
```
样本集标注：采集100张验证码图片进行切分，人为进行标注0~9；
![这里写图片描述](/image/code/test1.png)
![这里写图片描述](/image/code/test2.png)

最后就是进行测试

```python
def rec(f_name):
    a = convert_im_to_array(f_name)  # 测试图片的二值化数组
    min_i = -1
    min_v = 10000000  # 选择一个较大的数即可
    for i in range(10):
        p = 'sample_im/{}'.format(i)  # 样本集路径0~9
        for im in os.listdir(p):
            b = convert_im_to_array('{}/{}'.format(p, im))  # 样本集图片的二值化数组
            tmp = sum(sum((a - b)**2))  
            print(tmp)
            if tmp < min_v:
                min_v = tmp
                min_i = i
            print("min_v的值：",min_v)
        print("min_i的值：",min_i)
    return min_i  # 返回图片中的数字
```
最后可以进行多次测试比较识别的准确率。
