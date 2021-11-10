![](https://z3.ax1x.com/2021/10/11/5Vg1X9.png)

![GitHub package.json version](https://img.shields.io/github/package-json/v/LanyuanXiaoyao-Studio/utools-recent-projects)
[![GitHub stars](https://img.shields.io/github/stars/LanyuanXiaoyao-Studio/utools-recent-projects)](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects/stargazers)
[![GitHub license](https://img.shields.io/github/license/LanyuanXiaoyao-Studio/utools-recent-projects)](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects)

在 uTools 中快速查询历史项目并打开，支持 JetBrains、Visual Studio Code 等，支持的软件有很多，后续也会继续增加其他软件，目前以我常用的软件为主。

> 为了玩一下自定义模板插件的设置界面，所以造了个轮子，uTools 插件市场也有同类型的插件，也非常好用，比如「Quick Open」,「JetBrains」,「QuickJet」:P

> 关于自定义模板插件设置界面的细节，可以参照[这篇文章](https://yuanliao.info/d/3979)。

> 插件图标来源  
> Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/)

# 软件支持列表

如果你希望插件能够支持更多的软件，请通过 [uTools「历史记录」插件适配软件建议](https://docs.qq.com/form/page/DZFhlZXRSendzc3dR) 向我提出。

> 支持列表仅从 2021 年开始，此前版本如果由于历史数据的结构变化导致不可用，将不再支持。

> 表中的 JetBrains 即为 JetBrains 旗下的所有独立 IDE，如 IDEA、PyCharm 等，不再一一列举。

|           名称           | Bookmark | History | Windows | macOS | Linux |
| :----------------------: | :------: | :-----: | :-----: | :---: | :---: |
|         Firefox          |    ✔     |    ✔    |    ✔    |   ✔   |   ✔   |
|         Chromium         |    ✔     |    ✔    |    ✔    |   ✔   |   ✔   |
|      Google Chrome       |    ✔     |    ✔    |    ✔    |   ✔   |   ✔   |
|      Microsoft Edge      |    ✔     |    ✔    |    ✔    |   ✔   |   ✔   |
|          Opera           |    ✔     |    ✔    |    ✔    |   ✔   |   ✔   |
|          Brave           |    ✔     |    ✔    |    ✔    |   ✔   |   ✔   |
|         Vivaldi          |    ✔     |    ✔    |    ✔    |   ✔   |   ✔   |
|          Yandex          |    ✔     |    ✔    |    ✔    |   ✔   |   ✔   |
|        QQ Browser        |    ✔     |    ✔    |    ✔    |       |       |
|         Maxthon          |    ✔     |    ✔    |    ✔    |       |       |
|       CentBrowser        |    ✔     |    ✔    |    ✔    |       |       |
|          LieBao          |    ✔     |    ✔    |    ✔    |       |       |
|          Safari          |    ✔     |    ✔    |         |   ✔   |       |
|          Deepin          |    ✔     |    ✔    |         |       |   ✔   |
|    Visual Studio Code    |          |    ✔    |    ✔    |   ✔   |   ✔   |
|          Typora          |          |    ✔    |    ✔    |       |   ✔   |
|         Obsidian         |          |    ✔    |    ✔    |   ✔   |   ✔   |
|       Sublime Text       |          |    ✔    |    ✔    |   ✔   |   ✔   |
|          Geany           |          |    ✔    |    ✔    |   ✔   |   ✔   |
|        JetBrains         |          |    ✔    |    ✔    |   ✔   |   ✔   |
|      Android Studio      |          |    ✔    |    ✔    |   ✔   |   ✔   |
|    Visual Studio 2019    |          |    ✔    |    ✔    |       |       |
| WPS Office International |          |    ✔    |    ✔    |   ✔   |   ✔   |
|       Office 2019        |          |    ✔    |    ✔    |   ✔   |       |
|       LibreOffice        |          |    ✔    |    ✔    |   ✔   |   ✔   |
|     Default Folder X     |          |    ✔    |    ✔    |   ✔   |   ✔   |

# 源码地址

[Github](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects)

## 源码镜像

[Gitee](https://gitee.com/LanyuanXiaoyao-Studio/utools-recent-projects)

# 使用说明

## 软件设置

使用 Setting 关键字打开插件设置界面，可以根据自己拥有的软件设置相应的参数，目前需要设置的参数主要有两个：保存历史记录的**数据文件**和软件的**可执行程序路径**。

已 Visual Studio Code 为例，需要配置配置文件所在路径和可执行程序所在路径，插件会解析配置文件获得历史记录，并通过可执行文件打开历史记录。
![vscode example](https://z3.ax1x.com/2021/10/11/5Vcass.png)

有的软件不需要可执行文件路径，是因为其历史记录通常是绑定了默认的打开方式，不需要指定可执行文件去打开，如浏览器相关的书签和历史记录。
![chrome example](https://z3.ax1x.com/2021/10/11/5Vc0Zq.png)

有的软件连配置文件也不需要，这一般出现在系统特有的软件上，比如 Safari 在 macOS 上的配置文件的路径是固定的，不需要额外配置。
![safari example](https://z3.ax1x.com/2021/10/11/5VcLyd.png)

**目前大部分软件的相关配置文件的路径在插件内的说明里有详细提及，下面针对一些特殊情况进行说明。**

### Browser History

目前所有支持的浏览器历史记录获取都需要通过 sqlite3 进行，由于 uTools 平台对二进制文件打包的限制，也为了避免不同浏览器采用的 sqlite 版本不同，所以需要用户自行下载 sqlite 命令行作为可执行程序路径。

sqlite 命令行可以在 sqlite 官网下载到：[官网下载页面](https://www.sqlite.org/download.html)，需要自行下载对应平台的命令行程序。
![sqlite3 download help](https://z3.ax1x.com/2021/10/11/5VcOOA.png)

### JetBrains

如果使用 JetBrains Toolbox 安装的话，默认路径会在类似`C:\Users\用户名\AppData\Local\JetBrains\Toolbox\apps\软件名\ch-0\版本号`，具体的可以在 JetBrains
Toolbox 的设置里找到。

### Typora

由于无法在 macOS 上找到 Typora 的配置数据文件，所以目前只支持 Windows 和 Linux，有知道的小伙伴和告诉我。

### Sublime Text

注意 Sublime Text 单独提供了命令行程序，不是程序本体，Windows 对应`subl.exe`，macOS 和 Linux 对应`subl`

### Visual Studio

如果是在官网使用官方下载器安装，那么数据文件应该在以下位置，目前方案是依据最新的 Visual Studio 2019 开发，暂不考虑过往版本  
`C:\Users\Administrator\AppData\Local\Microsoft\VisualStudio\版本号\ApplicationPrivateSettings.xml`

### Obsidian

Obsidian 没有开放获取文件列表的相关接口，解析配置文件只能得到 Vaults，所以具体的文件列表其实是遍历 Vault 对应的目录下的`md`结尾的文件，由于是遍历文件夹，所以性能可能会因为 Vault 中文件的数量太大而变差。

## 搜索

插件支持使用关键字在加载出来的书签记录和历史记录中进行搜索，方便查找打开，同时，**关键字支持拼音全拼匹配**。
![pingyin search](https://z3.ax1x.com/2021/10/11/5VgpY8.png)

## 插件配置

插件提供一些配置项来控制插件的一些行为，方便不同的用户使用习惯。
![plugin setting](https://z3.ax1x.com/2021/10/11/5VgilQ.png)

### 语言设置

目前提供了三种模式：自动、中文、English，尽管 uTools 可能没有国外用户，但也还是支持了 English，万一呢，对吧。
![english mode](https://z3.ax1x.com/2021/10/11/5VgkOs.png)

### 过滤不存在的文件

有一些软件的历史记录数据是定时更新的，即不是实时更新，也可能是出于其他的考虑，在源文件被删除之后，历史记录里面不会立刻将文件不存在的记录删除，所以会造成历史记录数据的冗余，为了避免过多的干扰,
可以通过这个选项将文件已经不存在的历史数据删除，这个选项只对那些历史记录是文件的软件生效，比如 wps，vscode 等。
![file filter](https://z3.ax1x.com/2021/10/11/5VgEmn.png)

### 获取 favicon

在浏览器适配的书签和历史记录里会用到，打开这个选项可以在线加载网址对应的图标
![favicon enable](https://z3.ax1x.com/2021/10/11/5VgZT0.png)
![favicon disable](https://z3.ax1x.com/2021/10/11/5VgnYT.png)

### 获取文件图标

和 favicon 类似，打开这个选项可以在结果列表里获取文件图标
![fileicon enable](https://z3.ax1x.com/2021/10/11/5VgufU.png)
![fileicon disable](https://z3.ax1x.com/2021/10/11/5VgQl4.png)

### 模糊匹配

插件默认使用的是准确匹配，即无论是输入文件名还是拼音，都需要一字不漏输入才能匹配成功，有时候确实模糊匹配会更省事，所以插件提供了模糊匹配的功能，但需要注意的是，插件的模糊匹配功能是通过文本相似度计算得到的，所以模糊匹配下会导致结果变多，难以确定唯一的结果，如果影响了搜索体验，还是使用精确匹配更加顺手。

_目前模糊匹配还处于测试阶段，还有待优化。_

# 特别说明

## 未知路径变量 Jetbrains 系列软件无法正常打开项目

JetBrains 的配置文件里面可能存在内置变量，如`$APPLICATION_CONFIG_DIR$`、`$MODULE_DIR$`、`$PROJECT_DIR$`、`$APPLICATION_HOME_DIR$`等,
这些变量插件无法主动获取，如果配置文件中存在类似的变量，将无法正常通过插件打开项目，暂时还没有好的方式能够解决这个问题，如果有朋友知道如何获取这些变量，可以告诉我适配到插件里。

## m1 mac 无法正常打开项目

关于 m1 的 mac，由于 mac 现在分为 x86 和 arm 两种 CPU 架构，所以当下原生支持 m1 的软件，如 JetBrains，都会在程序内置两套可执行程序作为入口，所以在 m1 mac
下如果按下面的文档设置可执行程序路径，会导致报错且无法执行，所以对于 m1 的 mac 需要单独配置属于 arm 架构的可执行程序路径，由于我没有 m1 的 mac，所以无法调试，需要大家自己尝试.  
目前已知的是，JetBrains 安装完成后会在`/usr/local/bin`下设置一个软链链接到正确的入口，如`/usr/local/bin/idea`，所以可以尝试将可执行程序的路径设置为这个，同样的，Visual Studio
Code 也有类似的东西。

## 适配 360 浏览器的书签和历史记录

360 安全浏览器因为安全，所以相关数据是加密过的，无法适配。

## 将所有支持的软件的记录合并在一个列表里同时查询

最开始只支持 jetbrains 和 vscode 的时候就有了，但相当一部分软件，比如 vscode 的历史记录没有最后打开时间，vscode 的 remote folder 没有具体的本地文件,
不同软件的历史记录放在一起就只能按字母排序，不能按最后操作时间来展示，而且每个软件的获取方式差异很大，同时获取有明显的短板效应，比如 xcode 和 office 都是靠命令行解析，等待时间相对 vscode 来说非常长,
整体体验下载感觉特别鸡肋，综合考虑之下就去掉了，只在同软件之间做了聚合，比如 office 或 jetbrains。

## 拼音搜索多音字识别不到

插件只是一个网页，这意味着浏览器的性能有限，无法做一些性能特别强的文字处理，此外 uTools
插件也不能保证自身在后台运行，运行时维护索引也不现实，所以最后没有采用全多音字索引，只使用了简单的拼音索引，对多音字有不小的误识别率，但好在还有拼音首字母匹配，使用体验可能比全拼要好不少。

# 特别感谢

[squallliu](https://gitee.com/squallliu) 提供了 Geany 的适配

# 开发说明

由于 uTools 特有的人工审核机制，官方要求模板插件的代码必须要可读，也就是源码，所以无法直接使用 webpack 等打包工具直接进行打包，因此该项目源码必须通过直接执行`build.sh`来生成打包. `build.sh`
里做的事情也很简单，将 ts 源码单独编译成 js 代码，再通过复制粘贴在 dist 文件夹下组合成需要目录结构。

> Windows 下提供了`build.ps1`作为构建脚本，需要注意的是，这个是 powershell 脚本，不是 bat 脚本。

希望 uTools 官方能早日摆脱这种代码要求，走进现代 js 开发模式 (
