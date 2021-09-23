# 我的项目

![GitHub package.json version](https://img.shields.io/github/package-json/v/LanyuanXiaoyao-Studio/utools-recent-projects)
[![GitHub stars](https://img.shields.io/github/stars/LanyuanXiaoyao-Studio/utools-recent-projects)](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects/stargazers)
[![GitHub license](https://img.shields.io/github/license/LanyuanXiaoyao-Studio/utools-recent-projects)](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects)

在 uTools 中快速查询历史项目并打开, 支持 JetBrains, Visual Studio Code 等, 支持的软件有很多, 后续也会继续增加其他软件, 目前以我常用的软件为主.

> 为了玩一下自定义模板插件的设置界面, 所以造了个轮子, uTools 插件市场也有同类型的插件, 也非常好用, 比如「Quick Open」,「JetBrains」,「QuickJet」:P


> 关于自定义模板插件设置界面的细节, 可以参照[这篇文章](https://yuanliao.info/d/3979)


> 由于有的软件的历史记录, 如 vscode, 没有打开时间, 所以在「Projects」关键字里面查看的所有历史项目将不会按照最近打开时间排序(不同软件的历史记录没办法互相排序), 在单独的关键字里, 如「JetBrains Projects」, 会根据最近打开时间排序

# 软件支持列表

如果你希望插件能够支持更多的软件, 请通过 [uTools「历史记录」插件适配软件建议](https://docs.qq.com/form/page/DZFhlZXRSendzc3dR) 向我提出

- Browser History
  - Firefox
  - Chromium
  - Google Chrome
  - Microsoft Edge
  - QQ Browser
  - Maxthon
  - Opera
  - Brave
  - CentBrowser
  - Yandex
  - 猎豹浏览器
  - Safari
  - 深度浏览器
- Editor
  - Visual Studio Code
  - Typora
  - Sublime Text
- IDE
  - JetBrains 全家桶
  - Android Studio
  - Visual Studio
  - Xcode
- Office
  - WPS Office International
  - Office 2019
  - LibreOffice

## 操作系统支持

<table>
<thead>
<tr>
<th rowspan="2">名称</th>
<th colspan="2">浏览器</th>
<th rowspan="2">Windows</th>
<th rowspan="2">macOS</th>
<th rowspan="2">Linux</th>
</tr>
<tr>
<th>书签</th>
<th>历史记录</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center">Firefox</td>
<td style="text-align: center">√</td>
<td style="text-align: center">√</td>
<td style="text-align: center">√</td>
<td style="text-align: center">√</td>
<td style="text-align: center">√</td>
</tr>
</tbody>
</table>

|           名称           | Windows | macOS | Linux |
| :----------------------: | :-----: | :---: | :---: |
|         Firefox          |    √    |   √   |   √   |
|         Chromium         |    √    |   √   |   √   |
|      Google Chrome       |    √    |   √   |   √   |
|      Microsoft Edge      |    √    |   √   |   √   |
|          Opera           |    √    |   √   |   √   |
|          Brave           |    √    |   √   |   √   |
|          Yandex          |    √    |   √   |   √   |
|        QQ Browser        |    √    |       |       |
|         Maxthon          |    √    |       |       |
|       CentBrowser        |    √    |       |       |
|        猎豹浏览器        |    √    |       |       |
|          Safari          |         |   √   |       |
|        深度浏览器        |         |       |   √   |
|    Visual Studio Code    |    √    |   √   |   √   |
|          Typora          |    √    |       |   √   |
|       Sublime Text       |    √    |   √   |   √   |
|        JetBrains         |    √    |   √   |   √   |
|      Android Studio      |    √    |   √   |   √   |
|      Visual Studio       |    √    |       |       |
| WPS Office International |         |   √   |       |
|       Office 2019        |    √    |   √   |       |
|       LibreOffice        |    √    |   √   |   √   |

# 源码地址

[Github](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects)

## 源码镜像

[Gitee](https://gitee.com/LanyuanXiaoyao-Studio/utools-recent-projects)

# 使用说明

使用 Setting 关键字打开插件设置界面, 可以根据自己拥有的软件设置相应的参数, 目前需要设置的参数有两个: 保存历史记录的**数据文件**和软件的**可执行程序路径**.

> **特别提醒**
>
> 关于 m1 的 mac, 由于 mac 现在分为 x86 和 arm 两种 CPU 架构, 所以当下原生支持 m1 的应用, 如 JetBrains, 都会在程序内置两套可执行程序作为入口, 所以在 m1 mac 下如果按下面的文档设置可执行程序路径, 会导致报错且无法执行, 所以对于 m1 的 mac 需要单独配置属于 arm 架构的可执行程序路径, 由于我没有 m1 的 mac, 所以无法调试, 需要大家自己尝试.  
> 目前已知的是, JetBrains 安装完成后会在`/usr/local/bin`下设置一个软链链接到正确的入口, 如`/usr/local/bin/idea`, 所以可以尝试将可执行程序的路径设置为这个, 同样的, Visual Studio Code 也有类似的东西.

- **Browser History**  
  目前所有支持的浏览器历史记录获取都需要通过 sqlite3 进行, 为了避免不同浏览器采用的 sqlite 版本不同, 所以需要用户自行下载 sqlite 命令行作为可执行程序路径, sqlite 命令行可以在 sqlite
  官网下载到: [官网下载页面](https://www.sqlite.org/download.html), 需要自行下载对应平台的命令行程序.
  > 360 安全浏览器因为安全, 所以相关数据是加密过的, 无法适配

- **JetBrains 系列**
  - **数据文件**  
    macOS: `/Users/用户名/Library/Application Support/JetBrains/软件名称/options/recentProjects.xml`
    Windows: `C:\Users\用户名\AppData\Roaming\JetBrains\软件名\options\recentProjects.xml`
  - **可执行程序路径**  
    macOS:`/Applications/软件名称.app/Contents/MacOS/软件名称`(更早的版本, 数据文件路径里面没有`JetBrains`这一级)
    Windows: 默认安装在`C:\Program Files\JetBrains\软件名\bin\软件名64.exe`(如果使用 JetBrains Toolbox 安装的话,
    默认路径会在类似`C:\Users\用户名\AppData\Local\JetBrains\Toolbox\apps\软件名\ch-0\版本号`, 具体的可以在 JetBrains Toolbox 的设置里找到)
- **Visual Studio Code**
  - **数据文件**  
    macOS: `/Users/lanyuanxiaoyao/Library/Application Support/Code/storage.json`  
    Windows: 默认安装在`C:\Users\Administrator\AppData\Roaming\Code\storage.json`
  - **可执行程序路径**  
    macOS: `/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code`
    Windows: 默认安装在`C:\Users\Administrator\AppData\Local\Programs\Microsoft VS Code\Code.exe`
- **Typora**
  - **数据文件**
    Windows: `C:\Users\Administrator\AppData\Roaming\Typora\history.data`
  - **可执行程序路径**
    Windows: `C:\Program Files\Typora\Typora.exe`
- **Sublime Text**
  - **数据文件**  
    macOS: `/Users/lanyuanxiaoyao/Library/Application Support/Sublime Text/Local/Session.sublime_session`
  - **可执行程序路径 (注意 Sublime Text 单独提供了命令行程序, 不是程序本体)**  
    macOS: `/Users/lanyuanxiaoyao/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl`
- **WPS Office International for mac**  
  WPS 使用`open`命令打开, 无需设置可执行程序路径
  - **数据文件**  
    `/Users/lanyuanxiaoyao/Library/Containers/com.kingsoft.wpsoffice.mac.global/Data/Library/Preferences/com.kingsoft.plist`
- **Office 2019 (Windows)**  
  什么设置都不需要, 正常安装完成的情况下, 历史记录将在`C:\Users\Administrator\AppData\Roaming\Microsoft\Office\Recent`, 所以将会直接解析, 值得注意的是,
  因为这个路径下有很多非文件的内容, 所以插件通过文件后缀名来过滤出 Office 文档, 仅支持大部分格式, 如有遗漏, 请反馈
- **Office 2019 for mac**  
  使用`open`命令打开, 无需设置可执行程序路径
  - **Word**  
    `/Users/lanyuanxiaoyao/Library/Containers/Microsoft Word/Data/Library/Preferences/com.microsoft.Word.securebookmarks.plist`
  - **Excel**  
    `/Users/lanyuanxiaoyao/Library/Containers/Microsoft Excel/Data/Library/Preferences/com.microsoft.Excel.securebookmarks.plist`
  - **PowerPoint**  
    `/Users/lanyuanxiaoyao/Library/Containers/Microsoft Powerpoint/Data/Library/Preferences/com.microsoft.Powerpoint.securebookmarks.plist`
- **Xcode**  
  什么设置都不需要,
  因为配置文件的位置固定在`/Users/xxx/Library/Application Support/com.apple.sharedfilelist/com.apple.LSSharedFileList.ApplicationRecentDocuments/com.apple.dt.xcode.sfl2`
  , 所以将会直接解析
- **Visual Studio**
  - **数据文件**  
    如果是在官网使用官方下载器安装, 那么数据文件应该在以下位置, 目前方案是依据最新的 Visual Studio 2019 开发, 暂不考虑过往版本  
    `C:\Users\Administrator\AppData\Local\Microsoft\VisualStudio\版本号\ApplicationPrivateSettings.xml`

配置完成后可以在「Projects」关键字里搜索到全部项目, 或者在各个单独的关键字里只搜索某个软件的项目, 如「jb」, 「vsc」(关键字的分类一般按系列软件区分, 如 JetBrains 系列不再细分, 主要是因为我懒).

![](https://z3.ax1x.com/2021/08/04/fkUt4x.png)

# 已知问题

JetBrains 的配置文件里面可能存在内置变量, 如`$APPLICATION_CONFIG_DIR$`, `$MODULE_DIR$`, `$PROJECT_DIR$`, `$APPLICATION_HOME_DIR$`等,
这些变量插件无法主动获取, 如果配置文件中存在类似的变量, 将无法正常通过插件打开项目, 暂时还没有好的方式能够解决这个问题, 如果有朋友知道如何获取这些变量, 可以告诉我适配到插件里.

# 开发说明

由于 uTools 特有的人工审核机制, 官方要求模板插件的代码必须要可读, 也就是源码, 所以无法直接使用 webpack 等打包工具直接进行打包, 因此该项目源码必须通过直接执行`build.sh`来生成打包. `build.sh`
里做的事情也很简单, 将 ts 源码单独编译成 js 代码, 再通过复制粘贴在 dist 文件夹下组合成需要目录结构.

> Windows 下提供了`build.ps1`作为构建脚本, 需要注意的是, 这个是 powershell 脚本, 不是 bat 脚本.

希望 uTools 官方能早日摆脱这种代码要求, 走进现代 js 开发模式 (
