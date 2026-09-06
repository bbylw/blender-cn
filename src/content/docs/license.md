---
title: 许可证
tagline: GPLv3 与开源生态
description: Blender 整体基于 GNU GPLv3 发布；个别文件采用不同但相互兼容的许可证。本文用中文解释其含义与对你使用、分发的影响。
icon: shield
group: dev
order: 14
updated: 2026-09
source:
  url: https://www.blender.org/about/license/
  label: blender.org 许可证说明
---

## 一句话结论

> Blender 整体基于 **GNU 通用公共许可证第三版（GPLv3）** 发布。个别文件可能采用不同但相互兼容的许可证。

（来源：Blender 项目 README 与 [blender.org/about/license](https://www.blender.org/about/license)）

## GPLv3 意味着什么

GPL 是“自由软件”许可证：它保护的是**使用者的自由**，而不是限制。核心自由包括：

- **运行自由**：无论个人、商业还是政府用途，都可以自由运行，无需付费或授权；
- **学习与修改自由**：可以阅读源码、学习它、修改它；
- **再分发自由**：可以把 Blender 或修改后的版本发给别人（收费也可以，但必须同时提供源码）；
- **Copyleft（著佐权）**：如果你发布修改版或基于它的衍生作品，**必须同样以 GPL 兼容许可开源**，保证自由被传递下去，而不是被私有化。

用一句话记忆：**“你可以拿走它，但改了再给别人时，也必须继续开源。”**

## 对普通用户的实际影响

### 你可以自由做的事

- 下载、安装、使用 Blender 制作**任何内容**——个人作品、公司项目、商业广告、游戏素材、电影，均无限制、无需署名或付费；
- 修改源码自用或发布修改版（发布时遵守 GPL 义务）；
- 分发 Blender 本体（可收费，需附源码与许可证）。

### 用 Blender 创作的作品归谁？

**归你。** GPL 约束的是 Blender 软件本身，不约束你用软件产出的内容。你渲染的图片、动画、模型文件（`.blend` 作品文件）的版权属于你——除非素材本身来自他人（如第三方模型、贴图、字体的授权限制）。

### 需要注意的边界

- 如果**把 Blender 的代码/库嵌入你的产品**并对外分发，你的产品衍生部分需要 GPL 开源——这主要影响“把 Blender 当开发平台做商业软件”的场景，不影响“用 Blender 做内容”；
- **商标**：Blender® 名称与徽标是 Blender 基金会的商标，不因代码开源而自动获得使用许可；
- 具体商业场景（尤其是嵌入式/再分发）请咨询法律专业人士，本页仅为科普性概括。

## 个别文件的不同许可

Blender 代码库并非单一 GPL：个别文件可能采用 **MIT、Apache、BSD、CC0** 等与 GPL 兼容的许可证（例如部分第三方库、构建脚本或数据文件）。因此严格来说，每个文件以其文件头标注的许可证为准——整体项目的“默认许可”是 GPLv3。官方许可页面列出了主要例外与依据。

## 本站内容与许可证

本站是社区整理的**中文编译/导读**，不是官方文档的逐字翻译：

- 文中引用与改写自 Blender 项目 README、[官方参考手册](https://docs.blender.org/manual/zh-hans/latest/)与[开发者文档](https://developer.blender.org/docs/)；
- 本站网页源码与文字内容以开放许可发布（详见仓库 LICENSE 说明），转载或复用请保留出处；
- Blender 名称与徽标版权归 Blender 基金会所有，本站不主张任何所有权，亦与基金会无隶属关系。

## 官方参考

- 官方许可页：<https://www.blender.org/about/license/>
- 官方手册 · 关于章节：<https://docs.blender.org/manual/zh-hans/latest/getting_started/about/index.html>
- GNU GPLv3 全文：<https://www.gnu.org/licenses/gpl-3.0.html>
