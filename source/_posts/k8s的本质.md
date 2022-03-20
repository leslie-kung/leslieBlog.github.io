---
title: k8s的本质
type: categories
copyright: true
tags:
  - k8s
categories:
  - k8s
keywords: kubernetes
abbrlink: 495928604
date: 2022-03-20 22:03:07
---

### 容器
一个‘容器’， 实际上是一个由Linux namespace、 Linux cgroups和rootfs 三种技术构建出来的进程的隔离环境。

#### 架构
一旦要追求项目的普适性，就一定要从顶层开始做好设计
<!-- more -->

#### K8s 项目架构
- k8s 由master和node两种节点组成， 即控制节点和计算节点；
- master节点，有三个紧密协作的独立组件组合而成;
    - kube-apiserver： 负责API服务;
    - kube-scheduler： 负责调度;
    - kube-controller-manager：负责容器编排。
- 集群的持久化数据，由kube-apiserver 处理后保存在Ectd 中。
- node节点核心组件： kubelet
    > kubelet 主要负责同容器运行时（docker项目）打交道。交互所依赖的，是一个称作CRI（Container Runtime Interface）的远程调用接口，这个接口定义了容器运行时的各项核心操作。比如：启动一个容器需要的所有参数。
- 此外， kubelet还通过gRPC协议同一个叫做Device Plugin的插件进行交互，这个插件是用来管理GPU等宿主机物理设备的主要组件，也是基于kubernetes项目进行机器学习训练、高性能作业支持等工作必须关注的功能
- kubelet的另一个重要功能则是调用网络插件和存储插件为容器配置网络和持久化存储。
- k8s 将一些需要频繁的交互和访问或直接通过本地文件进行信息交换的应用划分为一个 pod, pod的容器共享一个网段，同一组数据卷，从而达到高效率交换信息的目的。
    - pod是k8s项目中最基础的一个对象。
    - k8s 项目为pod对象绑定一个service服务，service服务声明的ip地址等信息不变，主要作用是作为pod 的代理入口，代理pod对外暴露一个固定的网络地址。
- 除了应用与应用之间的关系外， 应用运行的形态时影响‘如何容器化这个应用’的第二个重要因素。
    - k8s 定义新的，基于pod改进后的对象：
    - Job, 用来描述一次性运行的pod(比如大数据任务);
    - DaemonSet, 用来描述每个宿主机必须且只能运行一个副本的守护进程服务;
    - CronJob, 用于描述定时任务;

#### 声明式API
>  首先， 通过一个“编排对象”，比如Pod、Job、CronJob等，来描述你试图管理的应用；
 然后，再为它定义一些“服务对象”，比如Service、Secret、Horizontal Pod Autoscaler(自动水平扩展器)等， 这些对象，会负责具体的平台级功能

#### k8s项目全景图
![k8s项目全景图](/image/code/clipboard.png)

按照这幅图的线索，我们从容器这个最基础的概念出发，首先遇到了容器间“紧密协作”关系的难 题，于是就扩展到了 Pod；

有了 Pod 之后，我们希望能一次启动多个应用的实例，这样就需要 Deployment 这个 Pod 的多实例管理器；

而有了这样一组相同的 Pod 后，我们又需要通过一个 固定的 IP 地址和端口以负载均衡的方式访问它，于是就有了 Service;

可是，如果现在两个不同 Pod 之间不仅有“访问关系”，还要求在发起时加上授权信息。最典型 的例子就是 Web 应用对数据库访问时需要 Credential（数据库的用户名和密码）信息。那么， 在 Kubernetes 中这样的关系又如何处理呢？

Kubernetes 项目提供了一种叫作 Secret 的对象，它其实是一个保存在 Etcd 里的键值对数据。 这样，你把 Credential 信息以 Secret 的方式存在 Etcd 里，Kubernetes 就会在你指定的 Pod（比如，Web 应用的 Pod）启动时，自动把 Secret 里的数据以 Volume 的方式挂载到容器 里。这样，这个 Web 应用就可以访问数据库了。

