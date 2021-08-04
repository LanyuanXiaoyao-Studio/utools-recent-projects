# 我的项目

在 uTools 中快速查询历史项目并打开, 支持 JetBrains, Visual Studio Code, 后续会继续增加其他软件, 如 Xcode VS Eclipse 等, 目前以我常用的软件为主.

> 为了玩一下自定义模板插件的设置界面, 所以造了个轮子, uTools 插件市场也有同类型的插件, 也非常好用, 并没有说其他同类插件不好的意思 :P


> 由于有的软件的历史记录, 如 vscode, 没有打开时间, 所以在「Projects」关键字里面查看的所有历史项目将不会按照最近打开时间排序(不同软件的历史记录没办法互相排序), 在单独的关键字里, 如「JetBrains Projects」, 会根据最近打开时间排序.


> Windows 和 Linux 有空测试后再支持

# 使用说明

使用 Setting 关键字打开插件设置界面, 可以根据自己拥有的软件设置相应的参数, 目前需要设置的参数有两个: 保存历史记录的**数据文件**和软件的**可执行程序路径**.

以 macOS 为例:

- JetBrains 系列的数据文件一般会在`/Users/用户名/Library/Application Support/JetBrains/软件名称/options/recentProjects.xml`,
  可执行程序路径在`/Applications/软件名称.app/Contents/MacOS/软件名称`. (更早的版本, 数据文件路径里面没有`JetBrains`这一级)
  ![](https://z3.ax1x.com/2021/08/04/fktJsJ.png)
- Visual Studio Code 的数据文件在`/Users/lanyuanxiaoyao/Library/Application Support/Code/storage.json`,
  可执行程序路径在`/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code`
  ![](https://z3.ax1x.com/2021/08/04/fktRot.png)

配置完成后可以在「Projects」关键字里搜索到全部项目, 或者在各个单独的关键字里只搜索某个软件的项目, 如「jb」, 「vsc」(关键字的分类一般按系列软件区分, 如 JetBrains 系列不再细分, 主要是因为我懒).

![](https://z3.ax1x.com/2021/08/04/fkUt4x.png)
