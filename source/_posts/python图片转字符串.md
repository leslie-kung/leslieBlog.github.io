---
title: python图片转字符串
type: categories
copyright: true
date: 2020-01-02 16:26:32
tags:
    - python
categories: python
---

## python 图片转成字符串

<!--more-->

### 下面是原始图片
![红心](/image/crawl/red_heart.jpg)

### 代码
```python
from PIL import Image
ascii_char = list("$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. ")

WIDTH = 85 # 字符画的宽
HEIGHT = 25 # 字符画的高


# 将256灰度映射到70个字符上，也就是RGB值转字符的函数：
def get_char(r, g, b, alpha=256):  # alpha透明度
   if alpha == 0:
       return ' '
   length = len(ascii_char)
   gray = int(0.2126 * r + 0.7152 * g + 0.0722 * b)  # 计算灰度
   unit = (256.0 + 1) / length
   return ascii_char[int(gray / unit)]  # 不同的灰度对应着不同的字符
   # 通过灰度来区分色块


if __name__ == '__main__':
   img = './15.jpg' # 图片所在位置
   im = Image.open(img)
   im = im.resize((WIDTH, HEIGHT), Image.NEAREST)
   txt = ""
   for i in range(HEIGHT):
       for j in range(WIDTH):
           txt += get_char(*im.getpixel((j, i))) # 获得相应的字符
       txt += '\n'
   print(txt)  # 打印出字符画
   # 将字符画 写入文件中
   with open("15.txt", 'w') as f:
       f.write(txt)
```

### 转换后的效果

```
                                                                                
           .uahZO000Okhhw^.                  ..'hhhhhhkqZwk`'.                  
       'phkbddppJJJJmdppddbkb<             aZ0ZqQppppOOdppddbkhk.               
     .hkbddpppmJCpppp0JJQppJCqbk`      'mZ0dpppppJCJJJppppppppddbk:.            
   .mZbdpppppUJpppppppppJJpppLJCQO.   hbQCppppppLJOJJJJppppppppppdbk.           
  .hkdpZppZJJJZpppppppppppppdJJJddbkIhbdpppppppdJJJJJCJJCJJJJJpppppbk,          
  mbbppppppCJJJppppppppppppppppCppdddddpppppppppppJJJJJLppppppJJJ0q0L0.         
.,OLLpppLJqCJCCJppppppppppppppppppppppppppppppppppCppppppppppOJdppppCQ0         
.p0LJCCmppppqCJJwppppppppppZJJLppppppppppppppppppJJppppppppppJJJCqpppL0.        
 mkddppppppppppLJpppppqCJJpppJqpppppppppppJJJJCCJJJJJJJJJJJCqJJqCJJJJLQ         
 .kbdppppppppppJpppppppJmpppp0JdpppppppppwJCJpwJZpppppCJJJJdpppppJppdb[         
  lkbdpppwOqQJJCppppppppppOJJJJJJppppppCJOJpJJCpppppppppJJJpppppppppdq.         
   .kbdpppJwpdJLppppppppppCJCdppJJJppppppJJJppppJJJLppppJJJJJqpppdbk.           
     .kpCJqpppdOZOCLJJJJJJJJJppdJJppppppppJqp0JJJLppppppppppppdCdQ.             
       ."dbdppppJJJpCdCwpppppppppJJpppppppppppppJZppppppppppdbd'.               
            kkbLJppppwJJCppppppJJJJJppppppppppppJpppppppdbbm..                  
               .rkbddpppJJJJJCJJJpCJ0ppZLJJJJJJJJdpddpb^                        
                    .kbbpppppJJJqpppppppppppppppCQw'.                           
                        ^kbddppJppppppppppppdbkt.                               
                          .:hbdpppppppppppdb`.                                  
                              .kbdpppppdba.                                     
                                .kbbddb'                                        
                                  .ah..                                         
```

