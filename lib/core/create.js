const { createProjectAction, createComponentAction } = require('./actions');

const createCommands = (program) => {
    program
        .command('create <project-directory>')
        .description('create a new project')
        .action(async (projectDirectory) => {
            // 动态导入 inquirer
            const inquirer = (await import('inquirer')).default;
            
            // 使用 inquirer 进行交互式询问
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'template',
                    message: '请选择项目模板:',
                    choices: [
                        { name: 'Vue2 管理系统模板', value: 'vue2' },
                        { name: 'Vue3 管理系统模板', value: 'vue3' }
                    ]
                }
            ]);
            
            // 将用户选择传递给 action
            createProjectAction(answers.template, projectDirectory);
        })

    program
        .command('add <component>')
        .description('add a new component, 例如: hc-frontend add MyButton -d src/pages')
        .option('-d, --dest <path>', '目标目录，默认：src/components')
        .action((component, options) => {
            // 解析命令行参数
          //  const args = process.argv;
          //  const destIndex = args.indexOf('-d');
          // 如果找到 -d 参数，使用其后面的值作为目标目录
          //  const targetDir = destIndex !== -1 ? args[destIndex + 1] : 'src/components';
            const targetDir = program.opts().dest || 'src/components';
            console.log('目标目录:', targetDir);
            createComponentAction(component, targetDir);
        });
}

module.exports = createCommands;