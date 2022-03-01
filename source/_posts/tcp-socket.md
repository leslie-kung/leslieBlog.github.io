---
title: tcp_socket
type: categories
copyright: true
date: 2022-03-01 14:52:00
tags:
    - python
    - tcp
    - socket
categories: [python, tcp, socket]
keywords: tcp, socket, python
---

<script type="text/javascript" src="/js/src/bai.js"></script>

## 用python实现tcp socket服务端与客户端的通信

#### tcp客户端
```python
import socket
import traceback
import threading


def send_msg(client_socket):
    # 准备发送数据
    send_data = input("要发送的数据：").encode('utf8')
    # 发送数据
    client_socket.send(send_data)


def recv_msg(client_socket):
    # 接收数据
        recv_data = client_socket.recv(1024).decode('utf8')
        print(recv_data)


def main():
    # 创建socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # 建立连接
    client_socket.connect(('127.0.0.1', 8989))
    try:
        while 1:
            # 发送数据
            send_msg(client_socket)
            # 接收数据
            recv_process = threading.Thread(target=recv_msg, args=(client_socket,))
            recv_process.start()
            recv_process.join()
            # recv_msg(client_socket)
            flag = input("是否结束会话(yes or no):")
            if flag == 'yes':
                # 关闭socket
                client_socket.close()
                break
    except:
        client_socket.close()
        print('客户端出现异常', traceback.format_exc())
```
<!-- more -->

#### tcp服务端
```python
import socket
import threading
import traceback


def recv_msg(client_socket):
    # 接收客户端的数据
    recv_data = client_socket.recv(1024).decode("utf8")
    print(recv_data)


def send_msg(client_socket):
    # 返回给客户端的数据
    send_data = input("返回给客户端的数据：").encode('utf8')
    client_socket.send(send_data)


def main():
    # 创建socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # 设置socket选项， 立即释放端口
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, True)
    # 绑定端口
    server_socket.bind(('', 8989))
    # 设置监听
    server_socket.listen(128)
    # 创建服务于客户端的socket
    client_socket, ip_port = server_socket.accept()
    try:
        while 1:
            # 返回给客户端的数据
            send_msg(client_socket)
            # 接收客户端的数据
            recv_process = threading.Thread(target=recv_msg, args=(client_socket,))
            recv_process.start()
            # recv_msg(client_socket)
            recv_process.join()
            # 关闭服务客户端的socket
            client_socket.close()
    except:
        # 关闭服务客户端的socket
        client_socket.close()
        print("服务器出现异常：", traceback.format_exc())
    # 关闭监听的socket, 不再接收客户端的连接
    server_socket.close()
```




