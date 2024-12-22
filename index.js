#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const helpOptions = require('./lib/core/help');
const createCommands = require('./lib/core/create');
// 设置程序的描述
program
  .version(require('./package.json').version)
  .description('一个前端工程化工具，用于快速搭建和管理前端项目');

// 帮助和可选信息
helpOptions(program);
// 创建其他的指令
createCommands(program);

// 解析参数
program.parse(process.argv);


