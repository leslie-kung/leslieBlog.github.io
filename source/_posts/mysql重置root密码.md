---
title: mysql重置root密码
type: categories
copyright: true
date: 2022-02-27 21:37:21
tags:
    - 数据库
    - mysql
categories: [数据库, mysql]
---

## mysql重置root密码

#### 方法一：

1）：编辑mysqld.cnf文件
```sh
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf
```

2）：在文件中的skip-external-locking一行的下面添加一行：

skip-grant-tables

3）：重启MySQL服务
```sh
sudo service mysql restart
```
<!-- more -->

4）：终端输入mysql进入MySQL，输入USE mysql切换至mysql数据库
```sh
mysql
use mysql
```

5）：把root用户的密码修改为000000
```sh
UPDATE mysql.user SET authentication_string=password('000000') WHERE User='root' AND Host ='localhost';
```

6）：修改字段plugin
```sh
UPDATE user SET plugin="mysql_native_password";
```

7）：刷新权限
```sh
flush privileges;
```

8）：退出
```sh
quit;
```

9）：注释掉/etc/mysql/mysql.conf.d/mysqld.cnf文件中添加的一行

#### 方法二：

利用mysql自带的用户debian-sys-maint进行重置密码，只有Debian或Ubuntu服务器才有，存在于/etc/mysql/debian.cnf文件中

打开/etc/mysql/目录下的debian.cnf文件，里面包括用户名和密码
```sh
sudo vim /etc/mysql/debian.cnf
```

使用文件中提供的用户名和密码进入mysql
```sh
mysql -u debian-sys-maint -p

use mysql;

update user set authentication_string=password('123456') where user='root';
```

