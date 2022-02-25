---
title: docker镜像
type: categories
copyright: true
date: 2020-01-02 16:49:05
tags:
    - docker
categories: docker
---

## docker 镜像
### 获取镜像

&emsp;&emsp;镜像是docker的三大组件之一，docker运行容器需要本地存在对应的镜像，如果镜像不存在，docker会从镜像仓库下载，默认是从docker hub 公共注册服务器的仓库中下载。可以通过 docker pull 命令从仓库中获取需要的镜像；

<!--more-->
```sh
# 拉取Ubuntu12.04镜像
1 $ sudo docker pull ubuntu:12.04
2 Pulling repository ubuntu
3 ab8e2728644c: Pulling dependent layers
4 511136ea3c5a: Download complete
5 5f0ffaa9455e: Download complete
6 a300658979be: Download complete
7 904483ae0c30: Download complete
8 ffdaafd1ca50: Download complete
9 d047ae21eeaf: Download complete
```
下载过程中会输出获取每一层镜像的信息
该命令相当于
```sh
$ sudo docker pull
registry.hub.docker.com/ubuntu:12.04 
```
&emsp;&emsp;如果官方注册服务器下载比较慢的时候，可以选择从其他仓库进行下载，从其他仓库下载需要指定完整的仓库注册服务器的地址；

```sh
1 $ sudo docker pull dl.dockerpool.com:5000/ubuntu:12.04
2 Pulling dl.dockerpool.com:5000/ubuntu
3 ab8e2728644c: Pulling dependent layers
4 511136ea3c5a: Download complete
5 5f0ffaa9455e: Download complete
6 a300658979be: Download complete
7 904483ae0c30: Download complete
8 ffdaafd1ca50: Download complete
9 d047ae21eeaf: Download complete
```
下载镜像完成后，就可以使用镜像了。

### 使用 docker images 列出本地所有镜像
```sh
$ sudo docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              16.04               5e8b97a2a082        3 weeks ago         114MB
ubuntu              14.04               578c3e61a98c        3 weeks ago         223MB
ubuntu              latest              113a43faa138        3 weeks ago         81.2MB
hello-world         latest              e38bc07ac18e        2 months ago        1.85kB
ubuntu              12.04               5b117edd0b76        14 months ago       104MB
```
可以看到本地已有镜像的信息，包括镜像名，镜像标记，镜像ID，镜像的创建时间和镜像的大小；

利用创建的镜像来启动容器
```sh
$ sudo docker run -t -i ubuntu:16.04 /bin/bash
root@4af941efaebf:/# ls
```

### 可以用 docker tag 命令来修改镜像的标签
```sh
$ sudo docker tag 5e8b97a2a082 ubuntu16.04:my
$ sudo docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu16.04         latest              5e8b97a2a082        3 weeks ago         114MB
ubuntu16.04         my                  5e8b97a2a082        3 weeks ago         114MB
ubuntu              16.04               5e8b97a2a082        3 weeks ago         114MB
ubuntu              14.04               578c3e61a98c        3 weeks ago         223MB
ubuntu              latest              113a43faa138        3 weeks ago         81.2MB
hello-world         latest              e38bc07ac18e        2 months ago        1.85kB
ubuntu              12.04               5b117edd0b76        14 months ago       104MB
```

### 本地导入镜像
先下载一个镜像，比如Ubuntu14.04，之后使用以下命令进行导入
```sh
$ sudo cat ubuntu-14.04-x86_64-minimal.tar.gz |docker import - ubuntu:14.04
```

### 上传镜像
&emsp;&emsp;用户可以通过docker push 命令来上传自己创建的镜像到仓库中进行共享。例如，用户在Docker Hub上注册后可以推送自己的镜像到仓库中
```sh
$ sudo docker push ouruser/sinatra
The push refers to a repository [ouruser/sinatra] (len: 1)
Sending image list
Pushing repository ouruser/sinatra (3 tags)
```

### 存储镜像
可以使用docker save 命令，导出docker 镜像到本地文件中
```sh
$ sudo docker save -o ubuntu_14.04.tar ubuntu:14.04
```

### 载入镜像
可以使用docker load 命令，将本地文件的镜像导入到本地镜像库
```sh
$ sudo docker load --input ubuntu_14.04.tar
# 或者
$ sudo docker load < ubuntu_14.04.tar
```

### 移除本地镜像
可以使用docker rmi 命令移除本地镜像；移除镜像前需要先使用**docker rm**命令删除依赖该镜像的所有容器
```sh
$ sudo docker rmi Ubuntu16.04
```

### 清理所有未打过标签的本地镜像
```sh
$ sudo docker rmi $(docker images -q -f "dangling=true")
# 或者
$ sudo docker rmi $(docker images --quiet --filter "dangling=true")
```
