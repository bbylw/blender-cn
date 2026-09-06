---
title: 雕刻、纹理绘制与蜡笔
tagline: 数字雕刻、顶点/纹理绘制与 2D 动画蜡笔
description: 像捏粘土一样塑造模型，或直接在模型上绘制颜色与细节；用 Grease Pencil（蜡笔）在 3D 空间里做 2D 动画与故事板。
icon: sparkles
group: manual
order: 5
updated: 2026-09 · 面向 Blender 5.2 LTS
source:
  url: https://docs.blender.org/manual/zh-hans/latest/sculpt_paint/index.html
  label: 官方手册：雕刻与绘制
---

## 雕刻（Sculpting）

雕刻就像在数字粘土上作画：把网格当成一块泥，用各种“笔刷”推、拉、捏出形状。雕刻通常从较粗的低模开始，需要足够多的面数才能承载细节。

雕刻的前置知识：

- 在 3D 视口左上角把模式切换为 **雕刻（Sculpt Mode）**；
- 面数不够时使用**多精度（Multires）修改器**（保留基础网格的细分层级）或**动态拓扑（Dyntopo）**（按笔刷密度自动加面）；
- 配合**对称（Symmetry）**设置，左右镜像雕刻人物类模型；
- 用**遮罩（Mask）**锁定不想改动的区域，用**网格过滤器（Mesh Filter）**整体膨胀/平滑。

常用笔刷：`Draw`（拉伸）、`Clay Strips`（堆叠粘土感体积）、`Crease`（折痕）、`Smooth`（平滑）、`Inflate`、`Grab`（抓取大形）等。雕刻完的细节可**烘焙法线/置换贴图**，映射到低模上用于动画与渲染。

> 💡 雕刻与低多边形建模不冲突：多边形建模负责“布线合理”的拓扑，雕刻负责高模细节，两者通过烘焙结合。

## 顶点绘制与纹理绘制

Blender 的绘制体系分三块：

| 模式 | 画在哪里 | 典型用途 |
| --- | --- | --- |
| **顶点绘制（Vertex Paint）** | 直接给顶点上色 | 风格化效果、顶点色混合 |
| **权重绘制（Weight Paint）** | 顶点上的 0–1 权重 | 定义骨骼/形变影响范围（绑定必备） |
| **纹理绘制（Texture Paint）** | 模型的 UV 贴图上 | 给模型画漫反射、粗糙度等贴图 |

纹理绘制需要模型已有 UV 展开（见 [资产与文件](/docs/assets-files) 中关于 UV 的提示）。配合笔刷、图层与图像纹理节点，可在 Blender 内完成从打底到细节的全部绘制。

## Grease Pencil（蜡笔）与 2D 动画

Grease Pencil 是 Blender 里独一无二的混合媒介：**在 3D 空间中绘制 2D 笔画**，可以逐帧手绘做传统 2D 动画，也可以用来画故事板、标注 3D 场景、做动态文字。

- 每个“蜡笔物体”包含多层**笔画（Stroke）**与**帧**，类似带时间轴的矢量画布；
- 在**蜡笔工作流**里常结合“绘制模式 + 雕刻/编辑模式”修整笔画；
- 支持把蜡笔笔画转成网格（Fill、Convert），与 3D 场景无缝混排；
- 有独立的修改器（如 Outline、Thickness）与材质体系（Stroke + Fill）。

二维动画流程（简版）：切换至 2D Animation 工作区 → 用画笔逐帧画 → 洋葱皮辅助对齐 → 播放预览 → 导出 PNG 序列或直接渲染。

## 官方参考

- [官方中文手册 · 雕刻与绘制](https://docs.blender.org/manual/zh-hans/latest/sculpt_paint/index.html)
- [官方中文手册 · 蜡笔](https://docs.blender.org/manual/zh-hans/latest/grease_pencil/index.html)
