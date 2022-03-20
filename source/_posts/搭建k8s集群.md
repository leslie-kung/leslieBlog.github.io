---
title: 搭建k8s集群
type: categories
copyright: true
tags:
  - k8s
categories:
  - k8s
keywords: kubernetes
abbrlink: 1883251673
date: 2022-03-20 22:05:33
---


#### 准备工作
- 满足安装docker项目所需的要求，比如64位Linux操作系统，3.10及以上的内核版本
- x86或者ARM架构均可
- 机器之间网络互通，这是容器之间网络互通的前提
- 有外网访问权限，需要拉取镜像
- 能够访问 gcr.io、quay.io 这个两个docker registry，因为小部分镜像需要在这里拉取
- 单机可用资源建议2核CPU， 8GB内存或以上
- 30GB或以上的可用磁盘空间，这主要是留给docker镜像和日志文件使用

<!-- more -->

#### 目标
- 在所有节点上安装docker 和kubeadm
- 部署kubernets Master
- 部署容器网络插件
- 部署Dashboard 可视化插件
- 部署容器存储插件


#### 安装kubeadm和docker
```
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF > /etc/apt/sources.list.d/kubernetes.list 
deb http://mirrors.ustc.edu.cn/kubernetes/apt kubernetes-xenial main
EOF
apt-get update 
apt-get install -y docker.io kubeadm
```

上述安装kubeadm的过程中，kubeadm和kubelet、kubectl、kubernetes-cni这几个二进制文件都会被自动安装好

#### 部署K8s的master节点
++通过配置文件来部署，自定义一些功能++

1.编写yaml文件（kubeadm.yaml）
```
apiVersion: kubeadm.k8s.io/v1alpha1 
kind: MasterConfiguration 
controllerManagerExtraArgs:
    horizontal-pod-autoscaler-use-rest-clients: "true" 
    horizontal-pod-autoscaler-sync-period: "10s"
    node-monitor-grace-period: "10s" 
apiServerExtraArgs:  
    runtime-config: "api/all=true" 
kubernetesVersion: "stable-1.11"
```
配置中，设置horizontal-pod-autoscaler-use-rest-clients: "true"，将来部署kube-controller-manager能够使用自定义资源进行水平扩展

**部署命令**
```
kubeadm init --config kubeadm.yaml
```

部署完成会生成一行指令：
```
 kubeadm join 10.168.0.2:6443 --token 00bwbx.uvnaa2ewjflwu1ry --discovery-token- ....
```
这个join命令，是用来给这个master节点添加多个工作节点(worker)的命令，需要记录下来。

**部署配置信息**
```
mkdir -p $HONE/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
k8s集群默认需要加密方式访问，这几条命令，就是将刚刚部署生成的kubernetes集群的安全配置文件，保存在当前用户的.kube目录下，kubectl默认会使用这个目录下的授权信息访问k8s集群。

**查看节点状态**
```
$ kubectl get nodes
NAME      STATUS     ROLES     AGE       VERSION 
master    NotReady   master    1d        v1.11.1
```

**查看节点对象详细信息**
```
kubectl describe node master
```

**检查这个节点上各个系统Pod的状态**
```
kubectl get pods -n kube-system
```
kube-system是k8s项目预留的系统Pod的工作空间


#### 部署网络插件

部署网络插件只需执行kubectl apply指令，以Weave为例：
```
kubectl apply -f https://git.io/weave-kube-1.6
```
部署完成后，执行 kubectl get pods -n kube-system重新检查Pod状态


#### 部署k8s的worker节点
k8s的worker节点跟master节点几乎相同，它们运行着的都是一个kubelet组件，唯一的区别在于，kubeadm init的过程中，kubelet启动后， master节点上还会自动运行kube-apiserver、kube-scheduler、 kube-controller-manger 这三个系统Pod
- 安装kubeadm 和 docker
- 执行部署master节点时生成的kubeadm join 指令
```
$ kubeadm join 10.168.0.2:6443 --token 00bwbx.uvnaa2ewjflwu1ry --discovery-token-ca-cert ...
```

#### 通过Taint/Toleration调整master执行Pod的策略
默认情况下master节点是不允许运行用户Pod的，而k8s做到这一点，依靠的是k8s的Taint/Toleration机制。

**原理：**
一旦某个节点被加上一个Taint,即被‘打上了污点’，那么所有的Pod就都不能在这个节点上运行。

*打上污点命令*
```
$ kubectl taint nodes node1 foo=bar:NoSchedule
```
这时，该node1节点上就会增加一个键值对格式的Taint，即foo=bar:NoSchedule
其中值里面的NoSchedule，意味着这个Taint只会在调度新的Pod时产生作用，不会影响已经在node1上运行的Pod，哪怕它们没有Toleration。

#### Pod声明 Toleration
在Pod的.yaml文件中的spec部分，加入tolerations字段即可：
```
apiVersion: v1
kind: Pod
...
spec:
    tolerations:
    - key: "foo"
      operator: "Equal"
      value: "bar"
      effect: "NoSchedule"
```
这个Toleration的含义是，这个Pod能“接受”所有键值对为foo=bar 的Taint。

#### 让Pod运行在master节点上

```
apiVersion: v1
kind: Pod
...
spec:
    tolerations:
    - key: "foo"
      operator: "Exists"
      effect: "NoSchedule"
```
"Exists"操作符，表示该Pod能容忍所有以foo为键的Taint.

#### 如果只想要一个单节点的K8S,删除这个Taint才是正确的选择
```
$ kubectl taint nodes --all node-role.kubernetes.io/master-
```
我们在"node-role.kubernetes.io/master" 这个键后面加上了一个短横线"-"，这个格式就是移除所有以"node-role.kubernetes.io/master"为键的Taint。


#### 部署Dashboard可视化插件
```
 $ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/dep... 
```
部署完成后，可用查看Dashboard对应的Pod的状态了：
```
$ kubectl get pods -n kube-system
```
**注意：**
由于Dashboard是一个web server, 1.7版本后的默认只能通过Proxy的方式在本地访问。

#### 部署容器存储插件
k8s 集群的最后一块拼图：容器持久化存储
> **容器最典型的特征之一：无状态**
如果你在某一台机器上启动了一个容器，无法看到其他机器上的容器在它们的数据卷里写入的文件。

容器的持久化存储，就是用来保存容器存储状态的重要手段：存储插件会在容器里挂载一个基于网络或者其它机制的远程数据卷，使得在容器里创建的文件，实际上是保存在远程存储服务器上，或者以分布式的方式保存在多个节点上，而与当前宿主机没有任何绑定关系。

本次部署中，选择一个很重要的k8s存储插件项目：Rook
Rook项目是一个基于Ceph的k8s存储插件，Rook在自己的实现中加入了水平扩展，迁移，灾难备份，监控等大量的企业级功能，使得这个项目变成一个完整的、生成级别可用的容器存储插件。

```
$ kubectl apply -f https://raw.githubusercontent.com/rook/rook/master/cluster/examples/k...
```
