#coding:utf-8
import requests
import time
from bs4 import BeautifulSoup as bp

print('LeslieBlog 自动推送开启....','utf-8')
time.sleep(0.5)
site_url = 'http://blog.leslie168.com/baidusitemap.xml'

try:
    print('LeslieBlog 获取sitemap链接....','utf-8')
    data_ = bp(requests.get(site_url).content,'lxml')
except Exception as e:
    print (e)

list_url=[]

def get_(data):
    headers={'User-Agent':'curl/7.12.1 ',
             'Content-Type':'text/plain '}
    try:
        r = requests.post(url='http://data.zz.baidu.com/urls?site=blog.leslie168.com&token=这里改写成你的token',data=data)
        print (r.status_code)
        print (r.content)
    except Exception as e:
        print (e)

print ('---------------------------------')
for x,y in enumerate(data_.find_all('loc')):
    print (x,y.string)
    list_url.append(y.string.replace('http://','http://www.'))

print ('---------------------------------')

print ('LeslieBlog 开始推送....','utf-8')

for x in list_url:
    print('LeslieBlog 当前推送条目为:','utf-8') + x
    get_(x)
