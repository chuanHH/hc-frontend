const fs = require('fs');
const writeToFile = (filePath, content) => {
   return fs.promises.writeFile(filePath, content)
}
// 递归创建目录
const createDirSync = (filePath) => {
    if(fs.existsSync(filePath)){
        return true
    } else {
      if(createDirSync(path.dirname(filePath))){
        fs.mkdirSync(filePath);
        return true;
      }  
    }
}
module.exports = {
    writeToFile,
    createDirSync
}