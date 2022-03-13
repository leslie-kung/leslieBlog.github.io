---
title: docker容器
type: categories
copyright: true
tags:
  - docker
categories: docker
abbrlink: 2868157989
date: 2020-01-02 17:02:31
---

## docker容器
### 容器介绍
&emsp;&emsp;容器是独立运行的一个或一组应用，以及它们的运行态环境。对应的，虚拟机可以理解为模拟运行的一整套操作系统和跑在上面的应用。

### 新建启动容器
&emsp;&emsp;启动容器的主要命令是docker run，下面的命令输出一个“hello world”，之后终止容器
<!--more-->

```sh
$ sudo docker run ubuntu:14.04 /bin/echo 'Hello world'
Hello world
```
&emsp;&emsp;下面命令启动一个bash终端，允许用户进行交互
```sh
$ sudo docker run -t -i ubuntu:14.04 /bin/bash
root@af8bae53bdd3:/#
```
&emsp;&emsp;命令中的-t 表示让docker分配一个伪终端并绑定到容器的标准输入上，-i 则表示让容器的标准输入持续打开

&emsp;&emsp;利用docker run 来创建容器时，docker 在后台运行的标准操作包括：

* 检查本地是否存在指定的镜像，不存在从公有仓库进行下载；
* 利用镜像创建并启动一个容器；
* 分配一个文件系统，并在只读的镜像层外面挂载一个可读写层；
* 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中；
* 从地址池配置一个IP地址给容器；
* 执行用户指定的应用程序；
* 执行完毕后容器被终止

### 启动已经终止的容器
可以使用docker start 命令，启动一个已经终止的容器
```sh
$ docker start 容器ID 
```

### 后台运行容器
如果需要让docker 后台运行，可以通过添加-d 参数来启动容器
```sh
$ sudo docker run -d ubuntu:14.04 /bin/sh -c "while true; do ech
o hello world; sleep 1; done"
```
&emsp;&emsp;-d参数启动后会返回一个唯一的id，可以通过docker ps 查看容器信息；要获取容器输入信息，可以通过docker logs命令进行查看

### 终止容器

&emsp;&emsp;可以使用docker stop命令来终止一个已经运行的容器，此外，当docker 容器中指定的应用结束时，容器也自动终止。当docker 启动终端时，可以通过exit或ctrl+d来退出终端，容器立刻终止；

终止后的容器可以通过docker ps -a 进行查看；

docker restart命令会将一个运行态的容器终止，然后重新启动它；
```sh
# 终止容器
$ docker stop 容器ID
# 查看容器
$ docker ps -a
```

### 进入容器
attach 命令

&emsp;&emsp;docker attach命令是docker自带的命令，命令后面接容器，可以进入到该容器，打开终端；但是使用 attach 命令有时候并不方便。当多个窗口同时 attach 到同一个容器的时候，所有窗口都会同步显示。当某个窗口因命令阻塞时,其他窗口也无法执行操作了。

nsenter命令

&emsp;&emsp;nsenter 工具在 util-linux 包2.23版本后包含。 如果系统中 util-linux 包没有该命令，可以按照下面的方法从源码安装。
```sh
$ cd /tmp; curl https://www.kernel.org/pub/linux/utils/util-linux/v2.24/util-linux-2.24.tar.gz | tar -zxf-; cd util-linux-2.24;
$ ./configure --without-ncurses
$ make nsenter && sudo cp nsenter /usr/local/bin
```
为了连接到容器，需要找到容器的第一个进程的pid,可以通过下面命令获取；
```sh
PID=$(docker inspect --format "{{ .State.Pid }}" <container>)
```
通过这个pid可以连接到这个容器
```sh
$ nsenter --target $PID --mount --uts --ipc --net --pid
```
#### 完整的demo
```sh
$ sudo docker run -idt ubuntu
# 返回的容器id
243c32535da7d142fb0e6df616a3c3ada0b8ab417937c853a9e1c251f499f550
$ sudo docker ps
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
243c32535da7 ubuntu:latest "/bin/bash" 18 seconds ago Up 17 seconds nostalgic_hypatia
$ PID=$(docker-pid 243c32535da7)
10981
$ sudo nsenter --target 10981 --mount --uts --ipc --net --pid
root@243c32535da7:/#
```
### 导出容器
如果要导出本地某个容器，可以使用docker export 命令
```sh
$ sudo docker ps -a
CONTAINER ID IMAGE COMMAND CREA
TED STATUS PORTS NA
MES
7691a814370e ubuntu:14.04 "/bin/bash" 36 h
ours ago Exited (0) 21 hours ago te
st
$ sudo docker export 7691a814370e > ubuntu.tar
```

### 导入容器快照
可以使用docker import 命令从容器快照文件中再导入为镜像
```sh
$ cat ubuntu.tar | sudo docker import - test/ubuntu:v1.0
$ sudo docker images
REPOSITORY TAG IMAGE ID CREA
TED VIRTUAL SIZE
test/ubuntu v1.0 9d37a6082e97 Abou
t a minute ago 171.3 MB
```
也可以通过指定的url或目录来导入
```sh
$ sudo docker import http://example.com/exampleimage.tgz example/imagerepo
```

&emsp;&emsp;用户既可以使用 docker load 来导入镜像存储文件到本地镜像库，也可以使用 docker import 来导入一个容器快照到本地镜像库。这两者的区别在于容
器快照文件将丢弃所有的历史记录和元数据信息（即仅保存容器当时的快照状
态），而镜像存储文件将保存完整记录，体积也要大。此外，从容器快照文件导入
时可以重新指定标签等元数据信息。

### 删除容器
可以使用docker rm 来删除一个处于终止状态的容器
```sh
$ sudo docker rm trusting_newton
trusting_newton
```
如果要删除一个正在运行的容器，可以添加 -f 参数，docker 会发送SIGKILL信号给容器。

### 清理所有处于终止状态的容器
使用命令 
```
docker rm $(docker ps -a -q)
```
