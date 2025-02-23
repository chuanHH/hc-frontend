/**
 * 执行终端相关代码
 **/

const { spawn } = require('child_process');

const commandSpawn = (...args) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(...args);
    
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    
    childProcess.on('close', () => {
      resolve();
    });
    
    childProcess.on('error', (err) => {
      reject(err);
    });
  });
};

module.exports = {
  commandSpawn
};