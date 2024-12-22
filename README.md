# hc-frontend

一个快速创建和管理 Vue 项目的命令行工具。

## 安装

```bash
npm install -g hc-frontend
```

## 使用

### 创建新项目

```bash
hc-frontend create my-project
```

### 添加新组件

这个命令会启动交互式问答，让你选择：
- Vue2 管理系统模板
- Vue3 管理系统模板

#

### 创建组件
在默认目录（src/components）创建组件
```bash
hc-frontend add MyButton
```
在指定目录创建组件
```bash
hc-frontend add MyButton -d src/components/my-components
```

## 特性

- 支持创建 Vue2/Vue3 项目
- 自动安装依赖
- 自动配置淘宝 npm 源
- 智能识别项目类型并创建对应组件
- 支持自定义组件创建目录

## 注意事项

- 创建组件时请确保在 Vue 项目根目录下执行命令
- 如果依赖安装失败，可以手动进入项目目录执行 `npm install`


