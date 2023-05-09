# 基于 SpreadJS 前后端分离的在线采购管理系统

本系统是基于 React 和 Node.js 开发的在线采购系统，其中有涉及到表格的部分采用 SpreadJs 实现。

## 目录

1. [`项目功能介绍`](#1-项目功能介绍)

    1.1. [`创建报价单并发布`](#11-创建报价单并发布)

    1.2. [`填写报价单`](#12-填写报价单)

    1.3. [`汇总与分析`](#13-汇总与分析)

2. [`技术栈介绍`](#2-技术栈介绍)

    2.1. [`数据绑定`](#21-数据绑定)

    2.2. [`公式`](#22-公式)

    2.3. [`图表与条件格式`](#23-图表与条件格式)

3. [`总结`](#3-总结)

4. ['源码'](#4-源码)

---

## 1. 项目功能介绍

在该系统中主要存在两种角色，一种是报价单发布者以及接受报价单的供应商，整体流程为：

报价单发布者创建报价单 -> 报价单发布者发布报价 -> 供应商填写并提交报价单 -> 报价单发布者收到填写完成的报价单并查看报价分析

以上为最简单的流程，在这个流程中还存在许多细节上的设计，接下来我将逐个介绍。

---

## 1.1 创建报价单并发布

用户通过注册并登录进入系统后能看见报价模板管理的界面。

![报价模板管理](/assets/images/报价模板管理.png '报价模板管理')

在这个界面，用户可以看见所有自己创建的报价单，点击添加报价单按钮，右侧会弹出一个 `Drawer`。

一个报价单由一个报价单名称和多个报价单配置项组成。

而一个报价单配置项则由配置项的名称、尺寸、数量、单位、金额和描述组成。

![添加报价单](/assets/images/添加报价单.png '添加报价单')

逐个填写，并添加报价单后，将会在报价模板管理界面看到新添加的报价单，这时如果直接点击预览，只能看见一个空模板，所以在此之前需要先进行报价单的模板配置。

![模板配置](/assets/images/模板配置.png '模板配置')

全选并保存配置后，再次点击预览，就可以看见配置好的报价单。

![报价单预览](/assets/images/报价单预览.png '报价单预览')

这里使用了 `SpreadJS` 来实现，通过数据绑定可以快速地将想要的数据渲染到表格上，然后对表格的样式进行了部分修改后得到了上图的效果。

以上步骤全部完成后，报价单的配置就算完成了，接下来就是将报价单发送给对应的报价商。

点击返回按钮回到报价模板管理的界面，点击发布报价按钮，右侧会弹出一个 `Drawer` 供用户选择想要发布报价的供应商。

![发布报价](/assets/images/发布报价.png '发布报价')

当用户数较多的时候，为了更方便用户查找供应商，可以点击用户名右侧的筛选按钮，输入供应商的用户名来查找并选择。

这里我们选择所有供应商，然后点击发布报价单按钮，看到成功的提示后就说明报价单发布成功了。

需要注意的是，报价单不能发布多次，报价单一经发布，它的状态就会变成已发布，此时无法再次发布，也无法删除，同理也无法对它重新进行模板配置。

---

## 1.2 填写报价单

在这一步，我们需要将用户切到刚才所选择的那几个供应商那边，我们将以供应商的身份去填写报价单。

以供应商的身份登录进来后点击左侧选项栏的第二个按钮————供应商报价切换到报价的界面。

![供应商报价](/assets/images/供应商报价.png '供应商报价')

此处可以看见我们刚才发送给这个报价商的电脑报价单，点击开始报价按钮进入报价界面。

![开始报价](/assets/images/开始报价.png '开始报价')

报价界面也使用了 `SpreadJS` 去开发，黄色边框框起来的单价列就是供应商需要填写的区域，其他的区域则都被保护了起来，供应商无法进行修改。

将每个货物的单价输入后，就可以在表单的最右侧看到小计和总计，此处是通过 `SpreadJS` 的 `Formula` 实现的。

下图为完成报价后的表格。

![完成报价](/assets/images/完成报价.png '完成报价')

然后点击完成报价按钮，供应商的任务到这里就算结束了。

这里我只演示了一个供应商的步骤，其他两个供应商的步骤也是一样的，在这里就不过多演示了。

另外需要注意的是，报价单一经填写并完成就无法再次填写，同时也无法拒绝报价。

---

## 1.3 汇总与分析

等所有的供应商的报价单都填写完毕并点击完成报价的按钮后，就可以切换回报价单发布者的账号，在左侧选项栏的第三个按钮的界面中就可以看到这个账号所有发布了的报价单的汇总信息。

![报价分析](/assets/images/报价分析.png '报价分析')

选择刚才填写完的电脑报价单，点击报价分析按钮，进入比价界面。

![比价](/assets/images/比价.png '比价')

在这个界面忠可以看到详细的报价信息，各个供应商报价的分析结果以及图标分析结果。

![柱状图分析结果](/assets/images/柱状图分析结果.png '柱状图分析结果')
![折线图分析结果](/assets/images/折线图分析结果.png '折线图分析结果')
![条状图分析结果](/assets/images/条状图分析结果.png '条状图分析结果')

该页面的表格中所有内容均已被保护，所以用户也无法对这里面的内容进行编辑，是只读的。

---

## 2. 技术栈介绍

前端：`React` `AntDesign` `SpreadJs`

后端：`Express`

数据库：`MongoDB`

本项目中的核心业务均是用 `SpreadJs` 表格控件来实现的，这里着重介绍一下我是如何使用 `SpreadJs` 来实现这些表格的。

---

## 2.1 数据绑定

此处我参考了官方文档中的[`数据绑定`](https://demo.grapecity.com.cn/spreadjs/SpreadJSTutorial/features/data-binding/table-binding/purejs)文档，设置了 `DataSource` 和 `BindingPathCellType` 后就可以将数据绑定到表格上，我在本项目中创建了一个 `table` 对象，在这个 `table` 对象中我绑定了多个 `tableColumn，这些` `tableColumn` 都在初始化的时候绑定了指定的数据，这样一来就可以在表格中看到数据源中的数据被渲染到了指定的位置上。

![数据绑定](/assets/images/数据绑定.png '数据绑定')

---

## 2.2 公式

Excel 中最强大的地方就在于公式，SpreadJs 也内置了公式，我在填写报价单界面和比价界面都使用了这个功能来计算订单的金额，具体实现代码请看下图。

![公式](/assets/images/公式.png '公式')

使用 `setColumnDataFormula` 方法为表格的最后一列设置小计的计算公式，使用 `setColumnFormula` 方法为表格的 `Footer` 设置计算公式，从而达到小计和总计的计算效果。

---

## 2.3 图表与条件格式

表格中的数据在呈现的时候往往不怎么直观，因此表格和条件格式(`Conditional Format`)就登场了，我在最后的比价界面中使用了它们，从而能够为用户提供更直观的价格比较。

首先来介绍图表的实现方法，图表的实现方法比较简单，先定义每一个图表的类型、描述、数据源等信息，我在这里用了一个 `ChartArray` 将所有我想要渲染到 `Sheet` 中的图表装了起来，然后使用一个 `For` 循环将它们依次插入到 `Sheet` 中，具体代码见下图。

图表数组的定义：

![图表定义](/assets/images/图表定义.png '图表定义')

图表渲染循环：

![图表渲染](/assets/images/图表渲染.png '图表渲染')

然后就是条件格式的设定，这里的实现我分成了两个部分，一个是小计那部分，还有一个是总计那部分，参考下图。

小计：
![条件格式1](/assets/images/条件格式1.png '条件格式1')

总计：
![条件格式2](/assets/images/条件格式2.png '条件格式2')

因为小计会随着表单中项目的数量变化，所以要用一个循环来实现，而总计在一个表中仅有一个，所以不需要循环来实现。

---

## 3. 总结

这个项目总体来说是比较简单的，核心业务采用 `SpreadJs` 来实现，这个控件使用起来简单方便，相比 `Excel` 那种臃肿的体量，对于个人开发者来说是一个非常不错的选择。

---

## 4. 源码