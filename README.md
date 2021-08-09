# 我的项目

![GitHub package.json version](https://img.shields.io/github/package-json/v/LanyuanXiaoyao-Studio/utools-recent-projects)
[![GitHub stars](https://img.shields.io/github/stars/LanyuanXiaoyao-Studio/utools-recent-projects)](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects/stargazers)
[![GitHub license](https://img.shields.io/github/license/LanyuanXiaoyao-Studio/utools-recent-projects)](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects)

在 uTools 中快速查询历史项目并打开, 支持 JetBrains, Visual Studio Code, 后续会继续增加其他软件, 如 Xcode VS Eclipse 等, 目前以我常用的软件为主.

> 为了玩一下自定义模板插件的设置界面, 所以造了个轮子, uTools 插件市场也有同类型的插件, 也非常好用 :P
> 关于自定义模板插件设置界面的细节, 可以参照[这篇文章](https://yuanliao.info/d/3979)

> 由于有的软件的历史记录, 如 vscode, 没有打开时间, 所以在「Projects」关键字里面查看的所有历史项目将不会按照最近打开时间排序(不同软件的历史记录没办法互相排序), 在单独的关键字里, 如「JetBrains Projects」, 会根据最近打开时间排序.

> Linux 在 uTools 2.x 支持 Linux 之后再支持

# 源码地址

[Github](https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects)

## 源码镜像

[Gitee](https://gitee.com/LanyuanXiaoyao-Studio/utools-recent-projects)

# 使用说明

使用 Setting 关键字打开插件设置界面, 可以根据自己拥有的软件设置相应的参数, 目前需要设置的参数有两个: 保存历史记录的**数据文件**和软件的**可执行程序路径**.

- JetBrains 系列
    - **数据文件一般会在**:
      macOS: `/Users/用户名/Library/Application Support/JetBrains/软件名称/options/recentProjects.xml`
      Windows: `C:\Users\用户名\AppData\Roaming\JetBrains\软件名\options\recentProjects.xml`
      **可执行程序路径一般会在**:
      macOS:`/Applications/软件名称.app/Contents/MacOS/软件名称`(更早的版本, 数据文件路径里面没有`JetBrains`这一级)
      Windows: 默认安装在`C:\Program Files\JetBrains\软件名\bin\软件名64.exe`(如果使用 JetBrains Toolbox 安装的话,
      默认路径会在类似`C:\Users\用户名\AppData\Local\JetBrains\Toolbox\apps\软件名\ch-0\版本号`, 具体的可以在 JetBrains Toolbox 的设置里找到)
      ![](https://z3.ax1x.com/2021/08/04/fktJsJ.png)
- Visual Studio Code
    - **数据文件在**
      macOS: `/Users/lanyuanxiaoyao/Library/Application Support/Code/storage.json`, Windows:
      默认安装在`C:\Users\Administrator\AppData\Roaming\Code\storage.json`
    - **可执行程序路径在**
      macOS: `/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code`
      Windows: 默认安装在`C:\Users\Administrator\AppData\Local\Programs\Microsoft VS Code\Code.exe`
      ![](https://z3.ax1x.com/2021/08/04/fktRot.png)
- Sublime Text
    - **数据文件在**
      macOS: `/Users/lanyuanxiaoyao/Library/Application Support/Sublime Text/Local/Session.sublime_session`
    - **可执行程序路径在 (注意 Sublime Text 单独提供了命令行程序, 不是程序本体)**
      macOS: `/Users/lanyuanxiaoyao/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl`
      ![](https://z3.ax1x.com/2021/08/09/f8UijS.png)

配置完成后可以在「Projects」关键字里搜索到全部项目, 或者在各个单独的关键字里只搜索某个软件的项目, 如「jb」, 「vsc」(关键字的分类一般按系列软件区分, 如 JetBrains 系列不再细分, 主要是因为我懒).

![](https://z3.ax1x.com/2021/08/04/fkUt4x.png)

# 开发说明

由于 uTools 特有的人工审核机制, 官方要求模板插件的代码必须要可读, 也就是源码, 所以无法直接使用 webpack 等打包工具直接进行打包, 因此该项目源码必须通过直接执行`build.sh`来生成打包. `build.sh`
里做的事情也很简单, 将 ts 源码单独编译成 js 代码, 再通过复制粘贴在 dist 文件夹下组合成需要目录结构, 所以没有提供 Windows 下的脚本文件, 如果不是在 Linux 或 macOS 系统上开发,
需要自己根据`build.sh`写一个 bat 脚本来执行打包.

希望 uTools 官方能早日摆脱这种代码要求, 走进现代 js 开发模式 (
