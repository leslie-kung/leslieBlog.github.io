---
title: pep8的使用
copyright: true
date: 2019-12-30 19:23:56
tags: 
	- 编码规范
categories: python
---

## 1 介绍(Introduction)
本文档给出了包含主要Python发行版中的标准库的Python代码的编码约定。
随着时间的推移，随着更多的约定被识别，过去的约定被语言本身的变化所淘汰，这种风格指南也在不断发展。

<!--more-->
## 2 代码布局(Code Lay-Out)
### 2.1 缩进(Indentation)
每个缩进需要使用4个空格。

连续行所包装的元素应该要么采用Python隐式续行，即垂直对齐于圆括号、方括号和花括号，要么采用悬挂缩进。采用悬挂缩进时需考虑以下两点：第一行不应该包括参数，并且在续行中需要再缩进一级以便清楚表示。

正确的写法

    # 同开始分界符(左括号)对齐
    foo = long_function_name(var_one, var_two,
                             var_three, var_four)
                             
    # 续行多缩进一级以同其他代码区别
    def long_function_name(
            var_one, var_two, var_three,
            var_four):
        print(var_one)
       
    # 悬挂缩进需要多缩进一级
    foo = long_function_name(
        var_one, var_two,
        var_three, var_four)

错误的写法

    # 采用悬挂缩进时第一行不应该有参数
    foo = long_function_name(var_one, var_two,
        var_three, var_four)
     
    # 续行并没有被区分开，因此需要再缩进一级
    def long_function_name(
        var_one, var_two, var_three,
        var_four):
        print(var_one)

对于延续行，4个空格的规则是可选使用的。

同样可行的例子:


    # 悬挂缩进可以不采用4空格的缩进方法。
    foo = long_function_name(
      var_one, var_two,
      var_three, var_four)
      
如果if语句太长，需要用多行书写，2个字符(例如,if)加上一个空格和一个左括号刚好是4空格的缩进，但这对多行条件语句的续行是没用的。因为这会和if语句中嵌套的其他的缩进的语句产生视觉上的冲突。这份PEP中并没有做出明确的说明应该怎样来区分条件语句和if语句中所嵌套的语句。以下几种方法都是可行的，但不仅仅只限于这几种方法：

    # 不采用额外缩进
    if (this_is_one_thing and
        that_is_another_thing):
        do_something()
    
    # 增加一行注释，在编辑器中显示时能有所区分
    # supporting syntax highlighting.
    if (this_is_one_thing and
        that_is_another_thing):
        # Since both conditions are true, we can frobnicate.
        do_something()
    
    # 在条件语句的续行增加一级缩进
    if (this_is_one_thing
            and that_is_another_thing):
        do_something()
        
多行结束右圆/方/花括号可以单独一行书写，和上一行的缩进对齐：

    my_list = [
        1, 2, 3,
        4, 5, 6,
        ]
    result = some_function_that_takes_arguments(
        'a', 'b', 'c',
        'd', 'e', 'f',
        )
        
也可以和多行开始的第一行的第一个字符对齐：

    my_list = [
        1, 2, 3,
        4, 5, 6,
    ]
    result = some_function_that_takes_arguments(
        'a', 'b', 'c',
        'd', 'e', 'f',
    )
    
Tab还是空格？(Tab Or Space?)

推荐使用空格来进行缩进。

Tab应该只在现有代码已经使用tab进行缩进的情况下使用，以便和现有代码保持一致。

Python 3不允许tab和空格混合使用。

Python 2的代码若有tab和空格混合使用的情况，应该把tab全部转换为只有空格。

### 2.2 每行最大长度(Maximum Line Length)
将所有行都限制在79个字符长度以内。

对于连续大段的文字（比如文档字符串(docstring)或注释），其结构上的限制更少，这些行应该被限制在72个字符长度内。

限制编辑器的窗口宽度能让好几个文件同时打开在屏幕上显示，在使用代码评审(code review)工具时在两个相邻窗口显示两个版本的代码效果很好。

很多工具的默认自动换行会破坏代码的结构，使代码更难以理解。在窗口大小设置为80个字符的编辑器中，即使在换行时编辑器可能会在最后一列放置一个记号，为避免自动换行也需要限制每行字符长度。一些基于web的工具可能根本没有自动换行的功能。

一些团队会强烈希望行长度比79个字符更长。当代码仅仅只由一个团队维护时，可以达成一致让行长度增加到80到100字符(实际上最大行长是99字符)，注释和文档字符串仍然是以72字符换行。

Python标准库比较传统，将行长限制在79个字符以内（文档字符串/注释为72个字符）。

一种推荐的换行方式是利用Python圆括号、方括号和花括号中的隐式续行。长行可以通过在括号内换行来分成多行。应该最好加上反斜杠来区别续行。

隐式续行

    a = ('sdfaf' 
        'test')

有时续行只能使用反斜杠。例如，较长的多个with语句不能采用隐式续行，只能接受反斜杠表示换行：

    with open('/path/to/some/file/you/want/to/read') as file_1, \
         open('/path/to/some/file/being/written', 'w') as file_2:
        file_2.write(file_1.read())
        
### 2.3 二元运算符之前还是之后换行？(Should a line break before or after a binary operator?)

长期以来一直推荐的风格是在二元运算符之后换行。但是这样会影响代码可读性，包括两个方面：一是运算符会分散在屏幕上的不同列上，二是每个运算符会留在前一行并远离操作数。所以，阅读代码的时候眼睛必须做更多的工作来确定哪些操作数被加，哪些操作数被减：

    # 错误的例子：运算符远离操作数
    income = (gross_wages +
              taxable_interest +
              (dividends - qualified_dividends) -
              ira_deduction -
              student_loan_interest)
        
为了解决这个可读性问题，数学家及其出版商遵循相反的规定。Donald Knuth在他的“电脑和排版”系列中解释了传统的规则：“尽管在段落中的公式总是在二元运算符之后换行，但显示公式时总是在二元运算符之前换行”。
        
    # 正确的例子：更容易匹配运算符与操作数
    income = (gross_wages
              + taxable_interest
              + (dividends - qualified_dividends)
              - ira_deduction
              - student_loan_interest)
              
在Python代码中，只要在统一项目中约定一致，就可以在二元运算符之前或之后换行。对于新编写的代码，建议使用Knuth的风格。
        
### 2.4 空行(Blank Line)

使用2个空行来分隔最外层的函数(function)和类(class)定义。

使用1个空行来分隔类中的方法(method)定义。

可以使用额外的空行（尽量少）来分隔一组相关的函数。在一系列相关的仅占一行的函数之间，空行也可以被省略（比如一组虚函数定义）。

在函数内使用空行（尽量少）使代码逻辑更清晰。

例子：

    def func():
        
        
        class A(object):
            pass
        
        def func1():
            a = A()
            
        def func2():
            print('aaa')
            print('bbb')

Python支持control-L（如:^L）换页符作为空格；许多工具将这些符号作为分页符，因此你可以使用这些符号来分页或者区分文件中的相关区域。注意，一些编辑器和基于web的代码预览器可能不会将control-L识别为分页符，而是显示成其他符号。

### 2.5 源文件编码(Source File Encoding)

Python核心发行版中的代码应该一直使用UTF-8（Python 2中使用ASCII）。

使用ASCII（Python 2）或者UTF-8（Python 3）的文件不应该添加编码声明。

在标准库中，只有用作测试目的，或者注释或文档字符串需要提及作者名字而不得不使用非ASCII字符时，才能使用非默认的编码。否则，在字符串文字中包括非ASCII数据时，推荐使用\x, \u, \U或\N等转义符。

对于Python 3.0及其以后的版本中，标准库遵循以下原则（参见PEP 3131）：Python标准库中的所有标识符都必须只采用ASCII编码的标识符，在可行的条件下也应当使用英文词（很多情况下，使用的缩写和技术术语词都不是英文）。此外，字符串文字和注释应该只包括ASCII编码。只有两种例外：

(a) 测试情况下为了测试非ASCII编码的特性

(b) 作者名字。作者名字不是由拉丁字母组成的也必须提供一个拉丁音译名。

鼓励具有全球受众的开放源码项目采用类似的原则。

### 2.6 模块引用(Imports)

Imports应该分行写，而不是都写在一行，例如：

    # 分开写
    import os
    import sys
    
    # 不要像下面一样写在一行
    import sys, os
    
这样写也是可以的：

    from subprocess import Popen, PIPE
    
Imports应该写在代码文件的开头，位于模块(module)注释和文档字符串(docstring)之后，模块全局变量(globals)和常量(constants)声明之前。
    
Imports应该按照下面的顺序分组来写：

1. 标准库imports
2. 相关第三方imports
3. 本地应用/库的特定imports

如：

    import re
    from lxml import etree
    from ak_spider.common.mongo_models import *
    from ak_spider.settings import CAPTCHA_SERVER, AK_PROXY_SERVER, logger

不同组的imports之前用空格隔开。

推荐使用绝对(absolute)imports，因为这样通常更易读，在import系统没有正确配置（比如中的路径以sys.path结束）的情况下，也会有更好的表现（或者至少会给出错误信息）：
    
    import mypkg.sibling
    from mypkg import sibling
    from mypkg.sibling import example
    
然而，除了绝对imports，显式的相对imports也是一种可以接受的替代方式。特别是当处理复杂的包布局(package layouts)时，采用绝对imports会显得啰嗦。
    
    from . import sibling
    from .sibling import example
    
标准库代码应当一直使用绝对imports，避免复杂的包布局。

隐式的相对imports应该永不使用，并且Python 3中已经被去掉了

当从一个包括类的模块中import一个类时，通常可以这样写：

    from myclass import MyClass
    from foo.bar.yourclass import YourClass
    
如果和本地命名的拼写产生了冲突，应当直接import模块：

    import myclass
    import foo.bar.yourclass
    
然后使用”myclass.MyClass”和”foo.bar.yourclass.YourClass”。

避免使用通配符imports(from <module> import *)，因为会造成在当前命名空间出现的命名含义不清晰，给读者和许多自动化工具造成困扰。有一个可以正当使用通配符import的情形，即将一个内部接口重新发布成公共API的一部分（比如，使用备选的加速模块中的定义去覆盖纯Python实现的接口，预先无法知晓具体哪些定义将被覆盖）。

当使用这种方式重新发布命名时，指南后面关于公共和内部接口的部分仍然适用。

### 2.7 模块级的双下划线命名(Module level dunder names)

模块中的“双下滑线”（变量名以两个下划线开头，两个下划线结尾）变量，比如__all__，__author，__version__等，应该写在文档字符串(docstring)之后，除了form __future__引用(imports)的任何其它类型的引用语句之前。Python要求模块中__future__的导入必须出现在除文档字符串(docstring)之外的任何其他代码之前。
    
例如：

    """This is the example module.
    
    This module does stuff.
    """
    
    from __future__ import barry_as_FLUFL
    
    __all__ = ['a', 'b', 'c']
    __version__ = '0.1'
    __author__ = 'Cardinal Biggles'
    
    import os
    import sys
    
##  3 字符串引用(String Quotes)

在Python中表示字符串时，不管用单引号还是双引号都是一样的。但是不推荐将这两种方式看作一样并且混用。最好选择一种规则并坚持使用。当字符串中包含单引号时，采用双引号来表示字符串，反之也是一样，这样可以避免使用反斜杠，代码也更易读。

对于三引号表示的字符串，使用双引号字符来表示(即用"""而不是''')。
    
## 4 表达式和语句中的空格(Whitespace In Expressions And Statements)

    
### 4.1 一些痛点(Pet Peeves)

在下列情形中避免使用过多的空白：
    
方括号，圆括号和花括号之后：

    #正确的例子:
    spam(ham[1], {eggs: 2})
    
    #错误的例子：
    spam( ham[ 1 ], { eggs: 2 } )
    
逗号，分号或冒号之前：

    #正确的例子:
    if x == 4: print x, y; x, y = y, x
    
    #错误的例子:
    if x == 4 : print x , y ; x , y = y , x
    
不过，在切片操作时，冒号和二元运算符是一样的，应该在其左右两边保留相同数量的空格（就像对待优先级最低的运算符一样）。在扩展切片操作中，所有冒号的左右两边空格数都应该相等。不过也有例外，当切片操作中的参数被省略时，应该也忽略空格。

    #正确的例子:
    ham[1:9], ham[1:9:3], ham[:9:3], ham[1::3], ham[1:9:]
    ham[lower:upper], ham[lower:upper:], ham[lower::step]
    ham[lower+offset : upper+offset]
    ham[: upper_fn(x) : step_fn(x)], ham[:: step_fn(x)]
    ham[lower + offset : upper + offset]
    
    #错误的例子:
    ham[lower + offset:upper + offset]
    ham[1: 9], ham[1 :9], ham[1:9 :3]
    ham[lower : : upper]
    ham[ : upper]
    
在调用函数时传递参数list的括号之前：

    #正确的例子:
    spam(1)
    
    #错误的例子:
    pam (1)

在索引和切片操作的左括号之前：

    #正确的例子:
    dct['key'] = lst[index]
    
    #错误的例子:
    dct ['key'] = lst [index]
    
赋值(或其他)运算符周围使用多个空格来和其他语句对齐：

    #正确的例子:
    x = 1
    y = 2
    long_variable = 3
    
    #错误的例子:
    x             = 1
    y             = 2
    long_variable = 3
    
### 4.2 其他建议(Other Recommendations)

避免任何行末的空格。因为它通常是不可见的，它可能会令人困惑：例如反斜杠后跟空格和换行符不会作为续行标记。一些编辑器会自动去除行末空格，许多项目（如CPython本身）都有提交前的预处理钩子来自动去除行末空格。

在二元运算符的两边都使用一个空格：赋值运算符(=)，增量赋值运算符(+=, -= etc.)，比较运算符(==, <, >, !=, <>, <=, >=, in, not in, is, is not)，布尔运算符(and, or, not)。
    
如果使用了优先级不同的运算符，则在优先级较低的操作符周围增加空白。请你自行判断，不过永远不要用超过1个空格，永远保持二元运算符两侧的空白数量一样。
    
    #正确的例子:
    i = i + 1
    submitted += 1
    x = x*2 - 1
    hypot2 = x*x + y*y
    c = (a+b) * (a-b)
    
    #错误的例子:
    i=i+1
    submitted +=1
    x = x * 2 - 1
    hypot2 = x * x + y * y
    c = (a + b) * (a - b)    

使用=符号来表示关键字参数或参数默认值时，不要在其周围使用空格。

    #正确的例子:
    def complex(real, imag=0.0):
    return magic(r=real, i=imag)
    
    #错误的例子:
    def complex(real, imag = 0.0):
    return magic(r = real, i = imag)

函数注解中的:也遵循一般的:加空格的规则，在->两侧各使用一个空格。

    #正确的例子:
    def munge(input: AnyStr): ...
    def munge() -> AnyStr: ...
    
    #错误的例子:
    def munge(input:AnyStr): ...
    def munge()->PosInt: ...
    
在组合使用函数注解和参数默认值时，需要在=两侧各使用一个空格（只有当这个参数既有函数注解，又有默认值的时候）。

    #正确的例子:
    def munge(sep: AnyStr = None): ...
    def munge(input: AnyStr, sep: AnyStr = None, limit=1000): ...
    
    #错误的例子:
    def munge(input: AnyStr=None): ...
    def munge(input: AnyStr, limit = 1000): ...
    
复合语句（即将多行语句写在一行）一般是不鼓励使用的。

    #正确的例子:
    if foo == 'blah':
    do_blah_thing()
    do_one()
    do_two()
    do_three()
    
    #最好不要这样:
    if foo == 'blah': do_blah_thing()
    do_one(); do_two(); do_three()
    
有时也可以将短小的if/for/while中的语句写在一行，但对于有多个分句的语句永远不要这样做。也要避免将多行都写在一起。
    
    #最好不要这样：
    if foo == 'blah': do_blah_thing()
    for x in lst: total += x
    while t < 10: t = delay()
    
    #绝对不要这样：
    if foo == 'blah': do_blah_thing()
    else: do_non_blah_thing()
    
    try: something()
    finally: cleanup()
    
    do_one(); do_two(); do_three(long, argument,
    list, like, this)
    
    if foo == 'blah': one(); two(); three()
    
## 5 何时在末尾加逗号(When to use trailing commas)
    
末尾逗号通常是可选的，除非在定义单元素元组(tuple)时是必需的（而且在Python 2中，它们具有print语句的语义）。为了清楚起见，建议使用括号（技术上来说是冗余的）括起来。
    
    #正确的例子:
    FILES = ('setup.cfg',)
    
    #也正确，但令人困惑:
    FILES = 'setup.cfg',
    
当使用版本控制系统时，在将来有可能扩展的列表末尾添加冗余的逗号是有好处的。具体的做法是将每一个元素写在单独的一行，并在行尾添加逗号，右括号单独占一行。但是，与有括号在同一行的末尾元素后面加逗号是没有意义的（上述的单元素元组除外）。

    #正确的例子:
    FILES = [
        'setup.cfg',
        'tox.ini',
        ]
    initialize(FILES,
               error=True,
               )
    
    #错误的例子:
    FILES = ['setup.cfg', 'tox.ini',]
    initialize(FILES, error=True,)
    
## 6 注释(Comments)

和代码矛盾的注释还不如没有。当代码有改动时，一定要优先更改注释使其保持最新。

注释应该是完整的多个句子。如果注释是一个短语或一个句子，其首字母应该大写，除非开头是一个以小写字母开头的标识符（永远不要更改标识符的大小写）。

如果注释很短，结束的句号可以被忽略。块注释通常由一段或几段完整的句子组成，每个句子都应该以句号结束。

你应该在句尾的句号后再加上2个空格。

使用英文写作，参考Strunk和White的《The Elements of Style》

来自非英语国家的Python程序员们，请使用英文来写注释，除非你120%确定你的代码永远不会被不懂你所用语言的人阅读到。

### 6.1 块注释（Block Comments）

块注释一般写在对应代码之前，并且和对应代码有同样的缩进级别。块注释的每一行都应该以#和一个空格开头（除非该文本是在注释内缩进对齐的）。

块注释中的段落应该用只含有单个#的一行隔开。

### 6.2 行内注释（Inline Comments）

尽量少用行内注释。

行内注释是和代码语句写在一行内的注释。行内注释应该至少和代码语句之间有两个空格的间隔，并且以#和一个空格开始。

行内注释通常不是必要的，在代码含义很明显时甚至会让人分心。请不要这样做：

    x = x + 1                 # x自加

但这样做是有用的：

    x = x + 1                 # 边界补偿

### 6.3 文档字符串(Documentation Strings)

要知道如何写出好的文档字符串（docstring），请参考PEP 257

所有的公共模块，函数，类和方法都应该有文档字符串。对于非公共方法，文档字符串不是必要的，但你应该留有注释说明该方法的功能，该注释应当出现在def的下一行。

PEP 257描述了好的文档字符应该遵循的规则。其中最重要的是，多行文档字符串以单行"""结尾，不能有其他字符，例如：

    """Return a foobang
    
    Optional plotz says to frobnicate the bizbaz first.
    """

对于仅有一行的文档字符串，结尾处的"""应该也写在这一行。

## 7 命名约定（Naming Conventions）

Python标准库的命名约定有一些混乱，因此我们永远都无法保持一致。但如今仍然存在一些推荐的命名标准。新的模块和包（包括第三方框架）应该采用这些标准，但若是已经存在的包有另一套风格的话，还是应当与原有的风格保持内部一致。

### 7.1 首要原则（Overriding Principle）

对于用户可见的公共部分API，其命名应当表达出功能用途而不是其具体的实现细节。

### 7.2 描述：命名风格（Descriptive: Naming Styles）

存在很多不同的命名风格，最好能够独立地从命名对象的用途认出采用了哪种命名风格。

通常区分以下命名样式：

- b (单个小写字母)
- B (单个大写字母)
- lowercase(小写)
- lower_case_with_underscores(带下划线小写)
- UPPERCASE(大写)
- UPPER_CASE_WITH_UNDERSCORES(带下划线大写)
- CapitalizedWords (也叫做CapWords或者CamelCase – 因为单词首字母大写看起来很像驼峰)。也被称作StudlyCaps。注意：当CapWords里包含缩写时，将缩写部分的字母都大写。HTTPServerError比HttpServerError要好。
- mixedCase (注意：和CapitalizedWords不同在于其首字母小写！)
- Capitalized_Words_With_Underscores (这种风格超丑！)

也有风格使用简短唯一的前缀来表示一组相关的命名。这在Python中并不常见，但为了完整起见这里也捎带提一下。比如，os.stat()函数返回一个tuple，其中的元素名原本为st_mode,st-size,st_mtime等等。（这样做是为了强调和POSIX系统调用结构之间的关系，可以让程序员更熟悉。）

X11库中的公共函数名都以X开头。在Python中这样的风格一般被认为是不必要的，因为属性和方法名之前已经有了对象名的前缀，而函数名前也有了模块名的前缀。

此外，要区别以下划线开始或结尾的特殊形式（可以和其它的规则结合起来）：

_single_leading_underscore: 以单个下划线开头是”内部使用”的弱标志。 比如， from M import *不会import下划线开头的对象。

single_trailing_underscore_: 以单个下划线结尾用来避免和Python关键词产生冲突，例如:
            
        Tkinter.Toplevel(master, class_='ClassName')

__double_leading_underscore: 以双下划线开头的风格命名类属性表示触发命名修饰（在FooBar类中，__boo命名会被修饰成_FooBar__boo;）。

### 7.3 规范：命名约定(Prescriptive: Naming Conventions)

#### 7.3.1 需要避免的命名(Names To Avoid)

不要使用字符’l’（L的小写的字母），’O’（o大写的字母），或者’I’（i的大写的字母）来作为单个字符的变量名。

在一些字体中，这些字符和数字1和0无法区别开来。比如，当想使用’l’时，使用’L’代替。

#### 7.3.2 ASCII兼容性(ASCII Compatibility)

标准库中使用的标识符必须与ASCII兼容(参见PEP 3131中的[policy](https://www.python.org/dev/peps/pep-3131/#policy-specification)这一节) 。

#### 7.3.3 包和模块命名(Package And Module Names)

模块命名应短小，且为全小写。若下划线能提高可读性，也可以在模块名中使用。Python包命名也应该短小，且为全小写，但不应使用下划线。

当使用C或C++写的扩展模块有相应的Python模块提供更高级的接口时（比如，更加面向对象），C/C++模块名以下划线开头（例如，_sociket）

#### 7.3.4 类命名(Class Names)

类命名应该使用驼峰（CapWords）的命名约定。

当接口已有文档说明且主要是被用作调用时，也可以使用函数的命名约定。

注意对于内建命名(builtin names)有一个特殊的约定：大部分内建名都是一个单词（或者两个一起使用的单词），驼峰(CapWords)的约定只对异常命名和内建常量使用。

#### 7.3.5 类型变量命名(Type variable names)

PEP 484中引入的类型变量名称通常应使用简短的驼峰命名: T，AnyStr，Num。 建议将后缀_co或_contra添加到用于声明相应的协变(covariant)和逆变(contravariant)的行为。例如：

    from typing import TypeVar
    
    VT_co = TypeVar('VT_co', covariant=True)
    KT_contra = TypeVar('KT_contra', contravariant=True)

#### 7.3.6 异常命名(Exception Names)

由于异常实际上也是类，因此类命名约定也适用与异常。不同的是，如果异常实际上是抛出错误的话，异常名前应该加上”Error”的前缀。

#### 7.3.7 全局变量命名(Global Variable Names)

（在此之前，我们先假定这些变量都仅在同一个模块内使用。）这些约定同样也适用于函数命名。

对于引用方式设计为from M import *的模块，应该使用__all__机制来避免import全局变量，或者采用下划线前缀的旧约定来命名全局变量，从而表明这些变量是“模块非公开的”。

#### 7.3.8 函数命名(Function Names)

函数命名应该都是小写，必要时使用下划线来提高可读性。

只有当已有代码风格已经是混合大小写时（比如threading.py），为了保留向后兼容性才使用混合大小写。

#### 7.3.9 函数和方法参数(Function And Method Arguments)

实例方法的第一参数永远都是self。

类方法的第一个参数永远都是cls。

在函数参数名和保留关键字冲突时，相对于使用缩写或拼写简化，使用以下划线结尾的命名一般更好。比如，class_比clss更好。（或许使用同义词避免这样的冲突是更好的方式。）

#### 7.3.10 方法命名和实例变量(Method Names And Instance Variables)

使用函数命名的规则：小写单词，必要时使用下划线分开以提高可读性。

仅对于非公开方法和变量命名在开头使用一个下划线。

避免和子类的命名冲突，使用两个下划线开头来触发Python的命名修饰机制。

Python类名的命名修饰规则：如果类Foo有一个属性叫__a，不能使用Foo.__a的方式访问该变量。（有用户可能仍然坚持使用Foo._Foo__a的方法访问。）一般来说，两个下划线开头的命名方法仅用于避免与设计为子类的类中的属性名冲突。

#### 7.3.11 常量(Constants)

常量通常是在模块级别定义的，使用全部大写并用下划线将单词分开。如：MAX_OVERFLOW和TOTAL 。

#### 7.3.12 继承的设计(Designing For Inheritance)

记得永远区别类的方法和实例变量（属性）应该是公开的还是非公开的。如果有疑虑的话，请选择非公开的；因为之后将非公开属性变为公开属性要容易些。

公开属性是那些你希望和你定义的类无关的客户来使用的，并且确保不会出现向后不兼容的问题。非公开属性是那些不希望被第三方使用的部分，你可以不用保证非公开属性不会变化或被移除。

我们在这里没有使用“私有（private）”这个词，因为在Python里没有什么属性是真正私有的（这样设计省略了大量不必要的工作）。

另一类属性属于子类API的一部分（在其他语言中经常被称为”protected”）。一些类是为继承设计的，要么扩展要么修改类的部分行为。当设计这样的类时，需要谨慎明确地决定哪些属性是公开的，哪些属于子类API，哪些真的只会被你的基类调用。

请记住以上几点，下面是Python风格的指南：

- 公开属性不应该有开头下划线。
- 如果公开属性的名字和保留关键字有冲突，在你的属性名尾部加上一个下划线。这比采用缩写和简写更好。（然而，和这条规则冲突的是，‘cls’对任何变量和参数来说都是一个更好地拼写，因为大家都知道这表示class，特别是在类方法的第一个参数里。）
- 对于简单的公共数据属性，最后仅公开属性名字，不要公开复杂的调用或设值方法。请记住，如果你发现一个简单的数据属性需要增加功能行为时，Python为功能增强提供了一个简单的途径。这种情况下，使用Properties注解将功能实现隐藏在简单数据属性访问语法之后。注意 1：Properties注解仅仅对新风格类有用。
注意 2：尽量保证功能行为没有副作用，尽管缓存这种副作用看上去并没有什么大问题。
注意 3: 对计算量大的运算避免试用properties；属性的注解会让调用者相信访问的运算量是相对较小的。
- 如果你的类将被子类继承的话，你有一些属性并不想让子类访问，考虑将他们命名为两个下划线开头并且结尾处没有下划线。这样会触发Python命名修饰算法，类名会被修饰添加到属性名中。这样可以避免属性命名冲突，以免子类会不经意间包含相同的命名。注意 1：注意命名修饰仅仅是简单地将类名加入到修饰名中，所以如果子类有相同的类名合属性名，你可能仍然会遇到命名冲突问题。
注意 2：命名修饰可以有特定用途，比如在调试时，\_\_getattr\_\_()比较不方便。然而命名修饰算法的可以很好地记录，并且容意手动执行。
注意 3：不是所有人都喜欢命名修饰。需要试着去平衡避免偶然命名冲突的需求和高级调用者使用的潜在可能性。

### 7.4 公开和内部接口(Public And Internal Interfaces)

任何向后兼容性保证仅对公开接口适用。相应地，用户能够清楚分辨公开接口和内部接口是很重要的。

文档化的接口被认为是公开的，除非文档中明确申明了它们是临时的或者内部接口，不保证向后兼容性。所有文档中未提到的接口应该被认为是内部的。

为了更好审视公开接口和内部接口，模块应该在__all属性中明确申明公开API是哪些。将__all__设为空list表示该模块中没有公开API。

即使正确设置了__all属性，内部接口（包，模块，类，函数，属性或其他命名）也应该以一个下划线开头。

如果接口的任一一个命名空间（包，模块或类）是内部的，那么该接口也应该是内部的

引用的命名应该永远被认为是实现细节。其他模块不应当依赖这些非直接访问的引用命名，除非它们在文档中明确地被写为模块的API，例如os.path或者包的__init__模块，那些从子模块展现的功能。

## 8 编程建议(Programming Recommendations)

1 代码应该以不影响其他Python实现（PyPy，Jython，IronPython，Cython，Psyco等）的方式编写。

例如，不要依赖于 CPython 在字符串拼接时的优化实现，像这种语句形式a += b和a = a + b。即使是 CPython（仅对某些类型起作用） 这种优化也是脆弱的，不是在所有的实现中都不使用引用计数。在库中性能敏感的部分，用''.join形式来代替。这会确保在所有不同的实现中字符串拼接是线性时间的。

2 与单例作比较，像None应该用is或is not，从不使用==操作符。

同样的，当心if x is not None这样的写法，你是不知真的要判断x不是None。例如，测试一个默认值为None的变量或参数是否设置成了其它值，其它值有可能是某种特殊类型（如容器），这种特殊类型在逻辑运算时其值会被当作Flase来看待。

用is not操作符而不是not ... is。虽然这两个表达式是功能相同的，前一个是更可读的，是首选。

推荐的写法:

    if foo is not None:
    
不推荐的写法:

    if not foo is None:

3 用富比较实现排序操作的时候，最好实现所有六个比较操作符（ \_\_eq__ 、 \_\_ne__ 、 \_\_lt__ , \_\_le__ , \_\_gt__ , \_\_ge__），而不是依靠其他代码来进行特定比较。

为了最大限度的减少工作量，functools.total_ordering()装饰器提供了一个工具去生成缺少的比较方法。

PEP 207 说明了 Python 假定的所有反射规则。因此，解释器可能使用y > x替换x < y，使用y >= x替换x <= y，也可能交换x == y和x != y的操作数。sort()和min()操作肯定会使用<操作符，max()函数肯定会使用>操作符。当然，最好是六个操作符都实现，以便在其他情况下不会出现混淆。

4 始终使用def语句来代替直接绑定了一个lambda表达式的赋值语句。

推荐的写法:

    def f(x): return 2*x

不推荐的写法:

    f = lambda x: 2*x

第一个表单意味着生成的函数对象的名称是'f'而不是通用的'<lambda>'。通常这对异常追踪和字符串表述是更有用的。使用赋值语句消除了使用lambda表达式可以提供，而一个显式的def语句不能提供的唯一好处，如，lambda能镶嵌在一个很长的表达式里。

5 异常类应派生自Exception而不是BaseException。直接继承BaseException是为Exception保留的，从BaseException继承并捕获异常这种做法几乎总是错的。

设计异常的层次结构，应基于那些可能出现异常的代码，而不是引发异常的位置。编码的时候，以回答“出了什么问题？”为目标，而不是仅仅指出“这里出现了问题”（见 PEP 3151 一个内建异常结构层次的例子）。

类的命名约定适用于异常，如果异常类是一个错误，你应该给异常类加一个后缀Error。用于非本地流程控制或者其他形式的信号的非错误异常不需要一个特殊的后缀。

6 适当的使用异常链。在 Python 3 里，应该使用raise X from Y来指示显式替换，而不会丢失原始的追溯。

当有意替换一个内部的异常时（在 Python 2 用raise X，Python 3.3+ 用raise X from None），请确保将相关详细信息转移到新异常中（例如，将KeyError转换为AttributeError时保留属性名称，或将原始异常的文本嵌入到新的异常消息中）。

7 在 Python 2 里抛出异常时，用raise ValueError('message')代替旧式的raise ValueError, 'message'。

在 Python 3 之后的语法里，旧式的异常抛出方式是非法的。

使用括号形式的异常意味着，当你传给异常的参数过长或者包含字符串格式化时，你就不需要使用续行符了，这要感谢括号！

8 捕获异常时，尽可能使用明确的异常，而不是用一个空的except:语句。

例如，用：

    try:
        import platform_specific_module
    except ImportError:
        platform_specific_module = None

一个空的except:语句将会捕获到SystemExit和KeyboardInterrupt异常，很难区分程序的中断到底是Ctrl+C还是其他问题引起的。如果你想捕获程序的所有错误，使用except Exception:(空except:等同于except BaseException)。

一个好的经验是限制使用空except语句，除了这两种情况：

- 如果异常处理程序会打印出或者记录回溯信息；至少用户意识到错误的存在。
- 如果代码需要做一些清理工作，但后面用raise向上抛出异常。try .. finally是处理这种情况更好的方式。

9 绑定异常给一个名字时，最好使用 Python 2.6 里添加的明确的名字绑定语法：

    try:
        process_data()
    except Exception as exc:
        raise DataProcessingFailedError(str(exc))

Python 3 只支持这种语法，避免与基于逗号的旧式语法产生二义性。

10 捕获操作系统错误时，最好使用 Python 3.3 里引进的明确的异常结构层次，而不是内省的errno值。

11 另外，对于所有try / except子句，将try子句限制为必需的绝对最小代码量。同样，这样可以避免屏蔽错误。

推荐的写法：

    try:
        value = collection[key]
    except KeyError:
        return key_not_found(key)
    else:
        return handle_value(value)
        
不推荐的写法：

    try:
        # Too broad!
        return handle_value(collection[key])
    except KeyError:
        # Will also catch KeyError raised by handle_value()
        return key_not_found(key)

12 当某个资源仅被特定代码段使用，用with语句确保其在使用后被立即干净的清除了，try/finally也是也接受的。

13 当它们做一些除了获取和释放资源之外的事的时候，上下文管理器应该通过单独的函数或方法调用。例如：

推荐的写法:

    with conn.begin_transaction():
        do_stuff_in_transaction(conn)

不推荐的写法：

    with conn:
        do_stuff_in_transaction(conn)

第二个例子没有提供任何信息来表明__enter__和__exit__方法在完成一个事务后做了一些除了关闭连接以外的其它事。在这种情况下明确是很重要的。

14 坚持使用return语句。函数内的return语句都应该返回一个表达式，或者None。如果一个return语句返回一个表达式，另一个没有返回值的应该用return None清晰的说明，并且在一个函数的结尾应该明确使用一个return语句（如果有返回值的话）。

推荐的写法：

    def foo(x):
        if x >= 0:
            return math.sqrt(x)
        else:
            return None
    
    def bar(x):
        if x < 0:
            return None
        return math.sqrt(x)
        
不推荐的写法：

    def foo(x):
        if x >= 0:
            return math.sqrt(x)
    
    def bar(x):
        if x < 0:
            return
        return math.sqrt(x)

15 用字符串方法代替字符串模块。

字符串方法总是快得多，并且与unicode字符串共享相同的API。如果需要与2.0以下的Python的向后兼容，则覆盖此规则。

16 用''.startswith()和''.endswith()代替字符串切片来检查前缀和后缀。

startswith()和endswith()是更简洁的，不容易出错的。例如：

    #推荐的写法：
    if foo.startswith('bar'):
    
    #不推荐的写法：
    if foo[:3] == 'bar':

17 对象类型的比较应该始终使用isinstance()而不是直接比较。

    #推荐的写法：
    if isinstance(obj, int):
    
    #不推荐的写法：
    if type(obj) is type(1):

当比较一个对象是不是字符串时，记住它有可能也是一个 unicode 字符串！在 Python 2 里面，str和unicode有一个公共的基类叫basestring，因此你可以这样做：

    if isinstance(obj, basestring):

注意，在 Python 3 里面，unicode和basestring已经不存在了（只有str），byte对象不再是字符串的一种（被一个整数序列替代）。

18 对于序列（字符串、列表、元组）来说，空的序列为False：

正确的写法：

    if not seq:
    if seq:

错误的写法：

    if len(seq):
    if not len(seq):
    
19 不要让字符串对尾随的空格有依赖。这样的尾随空格是视觉上无法区分的，一些编辑器（或者，reindent.py）会将其裁剪掉。

20 不要用==比较True和False。

    #推荐的写法：
    if greeting:
    
    #不推荐的写法：
    if greeting == True:
    
    #更加不推荐的写法：
    if greeting is True:
    