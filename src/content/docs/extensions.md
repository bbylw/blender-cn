---
title: 扩展与脚本
tagline: 扩展仓库、插件系统与 Python API
description: Blender 4.2 起以“扩展（Extensions）”取代传统插件形态。本文介绍内置/线上扩展仓库、手工安装扩展，以及用 Python 脚本扩展 Blender。
icon: blocks
group: manual
order: 10
updated: 2026-09 · 面向 Blender 5.2 LTS
source:
  url: https://docs.blender.org/manual/zh-hans/latest/extensions/index.html
  label: 官方手册：扩展
---

## 从“插件”到“扩展”

Blender 4.2 起，官方把安装第三方功能的形态从传统“插件（Add-on）”升级为 **扩展（Extensions）**：每个扩展是一个标准化的发布包，带版本号与依赖声明，可来自线上扩展仓库或本地文件。旧插件大多也能加载（Blender 提供兼容入口），但新生态以扩展为准。

扩展能做的事五花八门：建模工具集、材质预设、导入/导出格式、渲染器集成、资产管理、节点工具……本质上都是用 Python 写的功能模块。

## 安装扩展

**两种主要渠道：**

1. **在线扩展仓库（推荐）**：官方仓库是 <https://extensions.blender.org>。在 **偏好设置 → 获取扩展（Get Extensions）** 中可看到仓库里的扩展，一键安装、自动检查更新与依赖；也可以把自己维护的仓库地址加进来（自定义仓库/离线镜像）。
2. **本地安装**：拿到 `.zip` 扩展包后，在 偏好设置 → 获取扩展 → 右上角菜单 → **从磁盘安装**。

安装后部分扩展需要**启用**（Enable）；启动参数 `--offline-mode`（或对应偏好设置）可阻止联网更新，适合离线环境与渲染农场。

> 依赖问题：扩展的依赖会自动安装；卸载时留意是否还有其他扩展在使用同一依赖。

## 用 Python 扩展 Blender

Blender 内置完整的 Python 3 环境与 **bpy** 模块——从“录制宏”到“写完整插件”都能做：

- **交互式实验**：切换到 **Scripting 工作区**，下方是 Python 控制台，上方是文本编辑器；
- **从操作学 API**：几乎所有界面操作都会在**信息（Info）编辑器**里回显对应 Python 命令——这是学习 bpy 的最佳教材；
- **写一个小脚本**：在文本编辑器写好 → “运行脚本”（Alt + P）即可执行；
- **自动执行**：把脚本保存在偏好设置的“启动脚本”目录，或注册为扩展随 Blender 启动。

一个最小“操作（Operator）”示例（作为扩展/脚本内注册后，会出现在操作搜索 `F3` 中）：

```python
import bpy

class HelloOperator(bpy.types.Operator):
    """在信息区打印问候语"""
    bl_idname = "wm.hello_world"
    bl_label = "Hello Blender 中文站"

    def execute(self, context):
        self.report({'INFO'}, "你好，Blender！")
        return {'FINISHED'}

def register():
    bpy.utils.register_class(HelloOperator)

def unregister():
    bpy.utils.unregister_class(HelloOperator)

if __name__ == "__main__":
    register()
```

### 常用官方文档

- **Python API 参考**：<https://docs.blender.org/api/current/>（随版本更新）
- **扩展编写指南**：见官方手册“扩展”章节中的开发者说明
- 查询类名/属性时，`bpy.types.…` 的文档与 `dir()` / 控制台补全配合使用效率最高

## 一些提醒

- 第三方扩展良莠不齐，装前看仓库星级、更新日期与用户评论；涉及数据安全的代码请先阅读；
- 渲染农场/团队协作时固定扩展版本，避免“我这边能跑你那边崩”；
- Blender 升级前留意扩展兼容性，LTS 版本更适合依赖第三方扩展的生产流程。

## 官方参考

- [官方中文手册 · 扩展](https://docs.blender.org/manual/zh-hans/latest/extensions/index.html)：扩展仓库、安装与旧插件迁移
- [官方扩展仓库](https://extensions.blender.org)：浏览与搜索扩展
- [官方手册 · 脚本编写（英文）](https://docs.blender.org/manual/en/latest/advanced/scripting/index.html)：Python 入门
