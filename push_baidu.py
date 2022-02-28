#coding:utf-8
import requests
import time
from bs4 import BeautifulSoup as bp

print('LeslieBlog 自动推送开启....')
time.sleep(0.5)
# site_url = 'http://blog.leslie168.com/baidusitemap.xml'

try:
    # print('LeslieBlog 获取sitemap链接....')
    with open("./public/baidusitemap.xml") as f:
        content = f.read()
    data_ = bp(content,'lxml')
    # print(data_)
except Exception as e:
    print (e)

list_url=[]

def get_(data):
    headers={'User-Agent':'curl/7.12.1 ',
             'Content-Type':'text/plain '}
    try:
        r = requests.post(url='http://data.zz.baidu.com/urls?site=https://blog.leslie168.com&token=05lqs7XGJIo4QFv5',data=data)
        print (r.status_code)
        print (r.content)
    except Exception as e:
        print (e)

print ('---------------------------------')
for x,y in enumerate(data_.find_all('loc')):
    print (x,y.string)
    list_url.append(y.string)

# 添加万红门窗网站链接
print("添加万红门窗网站链接")
wanhong = ["https://wanhong.leslie168.com/", 
            "https://wanhong.leslie168.com/index",
            "https://wanhong.leslie168.com/about",
            "https://wanhong.leslie168.com/services",
            "https://wanhong.leslie168.com/contact"]

list_url.extend(wanhong)

print ('---------------------------------')

print ('LeslieBlog 开始推送....')

for x in list_url:
    print('LeslieBlog 当前推送条目为: %s' % x)
    get_(x)
