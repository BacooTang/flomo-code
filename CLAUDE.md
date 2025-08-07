# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个Chrome浏览器扩展，为flomo笔记应用的Markdown代码块提供语法高亮功能。该插件基于Manifest V3规范，主要作用是解析和美化flomo中的代码内容，支持多种编程语言的语法高亮。

## Project Architecture

### Core Components

**Manifest V3 Extension Structure**:
- `manifest.json`: 扩展配置文件，定义权限和功能
- `service-worker.js`: 后台脚本，处理主题切换和内容脚本注册
- `scripts/content.js`: 内容脚本，在flomo页面中执行代码高亮逻辑

**Key Functionality**:
- **代码解析**: 识别```包围的代码块并提取语言类型
- **语法高亮**: 使用highlight.js库对代码进行语法着色
- **主题系统**: 支持明亮和暗黑两种代码高亮主题
- **复制功能**: 为每个代码块添加复制按钮

### Target Websites
该扩展专门为以下网站设计：
- `https://v.flomoapp.com/*`
- `https://flomoapp.com/*`
- `https://h5.udrig.com/*`

### Code Processing Logic

**代码块识别流程**:
1. 扫描页面中的`.richText`元素
2. 查找以```开头的段落作为代码块标记
3. 提取语言类型（如`javascript`, `python`等）
4. 收集代码内容直到遇到结束的```
5. 创建`<pre><code>`元素并应用语法高亮

**特殊处理**:
- URL链接转换：代码块中的`<a>`标签会被转换为纯文本URL
- HTML解码：确保代码内容正确显示

## Development Commands

### Loading Extension for Development
1. 打开Chrome浏览器，访问`chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目根目录

### Testing
- 访问flomo网站测试代码高亮功能
- 使用开发者工具检查console日志输出
- 测试主题切换功能是否正常工作

## Key Files and Their Purposes

- `include/highlight.min.js`: highlight.js库，负责语法高亮
- `include/highlight.min.css`: 基础样式文件
- `include/theme/`: 高亮主题CSS文件目录
- `popup/`: 扩展弹窗界面，用于主题选择
- `images/`: 图标资源文件

## Architecture Notes

**权限配置**: 扩展需要`storage`、`scripting`、`tabs`、`activeTab`、`webRequest`权限来实现完整功能。

**动态CSS注入**: 主题切换通过动态注册和注销内容脚本实现，确保新样式能够立即生效。

**消息传递**: 使用Chrome extension messaging API在service worker和content script之间通信，实现自动高亮功能。

**代码清理**: 原始的```标记会被移除，替换为格式化的代码块元素。