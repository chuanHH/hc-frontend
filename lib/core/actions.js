const { promisify } = require('util')
const download = promisify(require('download-git-repo'));
const { vueRepo } = require('../config/repo-config')
const { commandSpawn } = require('../utils/terminal')
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const createProjectAction = async (template, projectDirectory) => {
    // 动态导入 ora
    const ora = (await import('ora')).default;
    const spinner = ora();
    
    // 在 try 外部定义 templateDir，这样在 catch 块中也能访问到
    const templateDir = path.resolve(process.cwd(), projectDirectory);
    
    try {
        // 1、检查模板类型
        if (!['vue2', 'vue3'].includes(template)) {
            throw new Error('模板类型必须是 vue2 或 vue3');
        }
        
        // 2、下载模板
        spinner.start('正在下载模板...');
        const templateUrl = vueRepo[template].url;
        
        await download(templateUrl, templateDir);
        spinner.succeed('模板下载完成');
        
        // 3、安装依赖
        spinner.start('正在切换到淘宝源...');
        const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
        await commandSpawn(command, ['config', 'set', 'registry', 'https://registry.npmmirror.com'], { cwd: templateDir });
        spinner.succeed('已切换到淘宝源');
        
        // 4、安装依赖
        spinner.start('正在安装依赖...');
        const installPromise = commandSpawn(command, ['install'], { cwd: templateDir });
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('依赖安装超时')), 180000); // 3分钟超时
        });
        
        try {
            await Promise.race([installPromise, timeoutPromise]);
            spinner.succeed('依赖安装完成');
        } catch (installError) {
            if (installError.message === '依赖安装超时') {
                spinner.fail('依赖安装超时');
                console.log('\n❌ 依赖安装超时，可能的原因：');
                console.log('1. 网络连接不稳定');
                console.log('2. NPM 服务器响应慢');
                console.log('\n💡 建议：');
                console.log('1. 检查网络连接');
                console.log('2. 手动进入项目目录，执行以下命令：');
                console.log(`   cd ${projectDirectory}`);
                console.log('   npm install\n');
            }
            throw installError;
        }
        
        // 5、提示用户
        console.log('\n👉 请执行以下命令启动项目:');
        console.log(`\n  cd ${projectDirectory}`);
        console.log('  npm run dev\n');
        
    } catch (error) {
        // 如果在安装依赖之前就失败了，spinner 可能还在转动
        spinner.stop();
        console.log('\n❌ 创建失败');
        console.log('错误信息:', error.message);
        
        // 如果是依赖安装失败，保留项目文件，让用户可以手动安装
        if (!error.message.includes('依赖安装超时')) {
            try {
                const fs = require('fs');
                if (fs.existsSync(templateDir)) {
                    fs.rmdirSync(templateDir, { recursive: true });
                }
            } catch (cleanupError) {
                console.log('清理临时文件失败:', cleanupError.message);
            }
        }
    }
}
const createComponentAction = async (component, projectDirectory) => {
    try {
        // 打印接收到的目录参数
        console.log('目标目录:', projectDirectory);
        
        // 1. 先检查目标目录是否存在
        if (!projectDirectory) {
            throw new Error('请指定目标目录，例如：-d src/components');
        }

        // 2. 获取当前项目的 package.json 来判断是 Vue2 还是 Vue3
        let packageJson;
        try {
            packageJson = require(path.join(process.cwd(), 'package.json'));
        } catch (error) {
            throw new Error('请在 Vue 项目根目录下执行此命令');
        }

        const isVue3 = packageJson.dependencies?.vue?.startsWith('3');
        
        // 3. 选择对应的模板
        const templateName = isVue3 ? 'component.vue3.ejs' : 'component.vue2.ejs';
        const template = path.resolve(__dirname, `../templates/${templateName}`);
        
        // 4. 读取模板内容
        const content = fs.readFileSync(template, 'utf-8');
        
        // 5. 编译模板
        const result = ejs.render(content, {
            componentName: component.charAt(0).toUpperCase() + component.slice(1)
        });
        
        // 6. 确保目标目录存在
        const targetDir = path.resolve(process.cwd(), projectDirectory);
        console.log('完整路径:', targetDir);
        
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // 7. 写入文件
        const targetFile = path.join(targetDir, `${component}.vue`);
        
        // 检查文件是否已存在
        if (fs.existsSync(targetFile)) {
            throw new Error(`组件 ${component}.vue 已存在于 ${projectDirectory} 目录中`);
        }
        
        fs.writeFileSync(targetFile, result);
        
        console.log(`✅ 组件 ${component} 创建成功！`);
        console.log(`📁 位置：${targetFile}`);
    } catch (error) {
        console.log('❌ 组件创建失败:', error.message);
        if (error.message.includes('package.json')) {
            console.log('💡 提示：请确保你在 Vue 项目的根目录下执行此命令');
        }
    }
}

// 在 createProjectAction 中添加创建 .gitignore 的逻辑
const createGitignore = (targetDir) => {
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
.DS_Store

# Build output
dist/
build/

# Local env files
.env.local
.env.*.local

# Log files
logs/
*.log`;

    fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignoreContent);
};

module.exports = {
    createProjectAction,
    createComponentAction
}
