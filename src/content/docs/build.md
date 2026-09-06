---
title: 从源码构建 Blender
tagline: 获取源码、安装依赖、CMake 配置与调试
description: 基于官方开发者文档整理的构建指南：获取源码、安装各平台依赖、配置 CMake、常用构建命令、IDE 设置与常见问题排查。
icon: terminal
group: dev
order: 12
updated: 2026-09 · 基于 developer.blender.org 手册整理
source:
  url: https://developer.blender.org/docs/handbook/building_blender/
  label: 开发者文档：构建 Blender
---

> 本文是对官方开发者文档 **Building Blender** 的中文整理，命令与步骤以官方文档为准（版本更新较快）。官方原稿见文末链接。

## 为什么要自己构建？

- 体验**最新代码**中的新功能（比正式版早数周/数月）；
- 修改或调试源码、参与 Blender 开发；
- 带上自定义编译选项（如精简依赖、只编译 Cycles、打开调试符号）；
- 满足好奇心——反正这本来就是自由软件。

构建 Blender 需要三类东西：**源码**、**编译工具链**、**第三方依赖库**。各平台略有差异，但整体思路一致。

## 前置要求

- 会使用终端与 Git（源码管理）；
- 磁盘空间充足（源码 + 依赖 + 构建产物约需 10 GB 以上）；
- 稳定的网络（首次要下载依赖库）。

## 第 1 步：获取源码

Blender 官方源码托管在 **projects.blender.org**：

```bash
# 克隆主线（main）：最新开发代码
git clone https://projects.blender.org/blender/blender.git
cd blender
```

- **main 分支**是日常开发分支，随时在变，可能无法构建或运行不稳定；
- 想构建某个正式版本，切换对应分支或标签，例如：

```bash
git checkout blender-v5.2-release   # 5.2 系列的发布维护分支
# 或精确到标签：
git tag | grep '^v5\.2'             # 查看 v5.2.x 标签
```

获取源码后执行一次 **更新依赖**（下载预编译的第三方库与扩展，见第 3 步）：

```bash
make update
```

这一步各平台都要做，Windows 会同时拉取官方预编译的库文件。

## 第 2 步：安装编译工具链

### Linux

Blender 支持 GCC/Clang。先装基础工具（Debian/Ubuntu 示例，发行版不同包名略有差异）：

```bash
sudo apt install build-essential git cmake ninja-build
```

然后使用官方脚本安装 Blender 所需的第三方依赖（会自动跳过已装项，并提示可选的 CUDA/OptiX 等）：

```bash
# 在源码根目录
./build_files/build_environment/install_deps.sh --help    # 先看可用选项
./build_files/build_environment/install_deps.sh           # 安装默认依赖
```

### Windows

1. 安装 **Visual Studio 2022**，勾选“使用 C++ 的桌面开发”工作负载（含 MSVC 与 Windows SDK）；
2. 安装 [Git for Windows](https://git-scm.com/)；
3. 第三方库**不需要手工装**——`make update` 会从官方镜像下载预编译好的库（放在源码目录旁的 `lib/`）。

### macOS

1. 安装 **Xcode**（或至少 Xcode Command Line Tools）；
2. 推荐用 Homebrew 安装 cmake 与 ninja：`brew install cmake ninja`；
3. 在 Apple Silicon 上默认编译为 arm64；需要 Intel 版时用 `make` 传对应架构参数。

## 第 3 步：配置与构建

Blender 使用 **CMake** 配置构建。官方在源码根目录提供了 `make` 封装脚本，会自动完成“配置 → 构建”：

```bash
make -j$(nproc)          # Linux 用全部核心编译
```

等价于手工两步：

```bash
cmake -S . -B build_linux -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build build_linux
```

构建完成后，可执行文件位于构建目录中：Linux 为 `build_linux/bin/blender`。

常用构建类型：

| CMAKE_BUILD_TYPE | 用途 |
| --- | --- |
| `Release` | 发布版，速度优先，几乎无调试信息 |
| `RelWithDebInfo` | 带调试符号的优化版（调试崩栈够用） |
| `Debug` | 完整调试，最慢但断点最可靠 |

查看/修改全部选项：

```bash
cmake -S . -B build_linux -LAH | grep -E 'WITH_|BUILD_'   # 列出开关
# 或图形化：
ccmake build_linux        # 终端交互界面
cmake-gui build_linux     # 图形界面（如已安装）
```

常用开关示例（在配置命令后追加 `-D名字=值`，名字以 `cmake -LAH` 实际输出为准）：

```bash
# 例：关闭 Cycles 渲染器，可加快纯建模 / 调试用途的构建与运行
cmake -S . -B build_linux -G Ninja -DCMAKE_BUILD_TYPE=Debug -DWITH_CYCLES=OFF
```

> 说明：Blender 的 CMake 选项非常多（`WITH_*` 系列控制 Cycles、OpenSubdiv、FFmpeg 等功能开关）。不确定时保持默认即可，官方文档的 “Options” 页有全量说明；用 `cmake -LAH` 可查看当前生效的每个选项。

## 第 4 步：用 IDE 开发调试

纯命令行 `gdb` 可用，但更推荐 IDE。官方文档为各主流 IDE 提供了详细配置（涉及调试器、C++ 智能感知与启动任务）：

- **VS Code**：官方推荐配置（C/C++ 扩展 + CMake Tools / clangd + 调试 launch 配置）；
- **Visual Studio（Windows）**：Windows 上最常见的开发环境，直接打开构建目录生成的 `Blender.sln`；
- **Xcode（macOS）**：macOS 上构建目录会生成 `blender.xcodeproj`，可图形化断点调试；
- **CLion / Qt Creator**：官方文档也提供支持。

## 第 5 步：跑测试

Blender 自带测试套件（以 `ctest` 运行，覆盖 C++ 单测、Python 测试与渲染对比测试）。配置后即可执行：

```bash
# 在源码根目录（脚本内部会 cd 到构建目录执行 ctest）
make test
# 或直接：
ctest --test-dir build_linux --output-on-failure
```

日常改动建议至少跑与改动相关的测试子集；新增功能应附带测试（官方对测试覆盖率有要求）。

## 常见问题排查

| 现象 | 常见原因与对策 |
| --- | --- |
| 找不到依赖头文件 | 依赖没装全或版本不匹配：重跑 `make update` 与依赖安装脚本；不要混用发行版包与官方脚本安装的库 |
| 显卡报错/渲染黑屏 | 独显驱动太旧；更新 GPU 驱动，检查是否被系统默认核显接管 |
| 编译极慢 | 首次全量编译几十分钟到数小时属正常；之后用增量构建 + ccache（`brew/pacman/apt install ccache`）会快很多 |
| 改代码不生效 | 确认改的是源码而非“已安装版本”；调试时使用 `Debug/RelWithDebInfo` 并重跑 `cmake` |
| 构建中途失败 | 先 `git pull` 更新到最新再试；仍失败则到官方渠道搜索/提问（见[参与贡献](/docs/contribute)） |

## 官方参考（Building Blender 手册）

- 构建总览：<https://developer.blender.org/docs/handbook/building_blender/>
- 源码获取：见该页 “Getting the Source Code” 小节
- 各平台说明：Linux / Windows / macOS 分页
- 编译选项（Options）与 IDE 设置（VS Code、Visual Studio、Xcode、CLion 等）分页
- 开发者文档首页：<https://developer.blender.org/docs/>
