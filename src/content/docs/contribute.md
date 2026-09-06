---
title: 参与贡献
tagline: 代码、Bug 报告、文档与社区
description: Blender 由全球社区共同开发。本文介绍如何报告 Bug、提交代码与补丁（Pull Request）、参与评审与模块系统，以及文档与翻译贡献。
icon: users
group: dev
order: 13
updated: 2026-09 · 基于 developer.blender.org 手册整理
source:
  url: https://developer.blender.org/docs/handbook/contributing/
  label: 开发者文档：贡献代码
---

> Blender 由世界各地的开发者、艺术家、文档志愿者与赞助企业共同维护。本文整理自官方开发者文档，介绍普通人（包括你）参与进来的方式。

## Blender 如何被“管起来”

- **Blender 基金会**（荷兰非营利组织）协调项目，拥有版权与商标；
- 开发按**模块（Modules）**划分——建模、动画、Cycles、EEVEE、几何节点、用户界面、Python API……每个模块有负责的维护者（模块所有者）；
- 重大功能提案通过**提案流程**（如设计任务、功能评审）讨论后再进入开发；
- 资金来自 **Blender 发展基金**：个人订阅与会员企业捐款，用来支付全职开发者的薪水。

了解这些有助于你判断“该找谁、怎么提”——通常先搜官方文档与论坛，再决定是否发帖或提任务。

## 报告 Bug：每个人都能做

Bug 是项目最需要的“贡献”之一。缺陷追踪在 **projects.blender.org**（源码托管与问题跟踪一体）：

1. **先搜索**是否已有人报过；已有则补充信息比重复开单更有价值；
2. 新建问题时**提供复现步骤**：Blender 版本与构建号、操作系统、显卡驱动、最小复现文件（.blend）、出错日志；
3. 描述要具体：“选中后按 X 崩溃”优于“程序不稳定”；
4. 硬件相关问题请附上硬件信息（官方有专用表格模板）。

安全相关漏洞**不要**公开发帖——请按官方文档说明私下联系安全联系人。

## 贡献代码

### 起步路径

- 从 **小而易验证** 的改动开始（文档修正、翻译、简单的 Python 脚本修复）；
- 加入并熟悉模块的沟通渠道，先说明“我想做 X，是否有人在做/有没有更好的方案”；
- 提交前阅读对应**风格指南**（C/C++、Python、GLSL、提交信息规范），代码评审通过前不要着急。

### 提交流程

- Blender 使用 Git，源码托管在 projects.blender.org，通过 **Pull Request（合并请求）** 提交代码；
- 大型改动建议先在 devtalk 或项目任务里贴出设计/草图，获得反馈后再写代码；
- 评审者会检查代码质量、风格、对现有功能的影响与测试覆盖；
- 想获得**直接提交权限**需先以普通 PR 建立信誉，再按官方流程申请并签署贡献者协议。

### 开发者文档速查

- 开发者文档首页：<https://developer.blender.org/docs/>
- 贡献代码指南（含 PR 流程）：<https://developer.blender.org/docs/handbook/contributing/>
- 代码评审与缺陷追踪：<https://projects.blender.org>
- 开发者论坛 DevTalk：<https://devtalk.blender.org>

## 非代码贡献同样重要

| 方式 | 说明 |
| --- | --- |
| **文档与翻译** | Blender 参考手册的简体中文翻译由社区志愿者在官方翻译平台维护；修正错别字、补写缺失章节都是实打实的贡献 |
| **测试每日构建** | 使用每日构建（Daily Builds），在功能正式发布前发现回归并报告 |
| **美术与样例** | 为模板/官方素材库提供公开授权的模型与作品 |
| **社区与教程** | 在论坛、中文社区解答新手问题、制作教程——教程是很多人入坑的第一扇门 |
| **资助开发** | 订阅 Blender 发展基金（个人也可以，几欧元/月），或推动公司成为会员企业 |

## 沟通礼仪

- 官方要求所有沟通渠道遵守 **行为准则（Code of Conduct）**：尊重、建设性、就事论事；
- 提问前先阅读文档、搜索论坛（“没有调查就没有发言权”在开源社区同样成立）；
- 讨论用英语为主（官方渠道），回复“谢谢”与跟进结果会大大提升社区好感度。

## 官方参考

- [开发者文档 · 贡献指南](https://developer.blender.org/docs/handbook/contributing/)（Pull Requests、评审、协议）
- [开发者文档 · 沟通与行为准则](https://developer.blender.org/docs/handbook/communication/code_of_conduct/)
- [代码仓库 projects.blender.org](https://projects.blender.org)：源码、问题跟踪、Wiki 与发布
- [Blender 发展基金](https://fund.blender.org)：赞助页面（fund.blender.org）
