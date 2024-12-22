function helpOptions(program) {
  // 添加全局选项
  program
    .option('-d, --dest <dest>', '指定项目目录,例如：-d src/components')
    .option('-f, --framework <framework>', '选择模板,例如：-f vue')
    .action((options) => {
      // 当没有指定命令时，这里会处理全局选项
      console.log('Global options:', options);
    });

  program.addHelpText('after', `
示例:
  $ hc-frontend -d src/components            # 使用全局选项
  $ hc-frontend init -d src/components       # 在init命令中使用选项
  $ hc-frontend build -f vue                 # 在build命令中使用选项

其他:
  更多选项请参考文档...
`);
}

module.exports = helpOptions;
