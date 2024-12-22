const ejs = require('ejs');
const path = require('path');
const compile = (template, data) => {
  const templatePath = path.resolve(__dirname, `../templates/${template}`);
  const content = fs.readFileSync(templatePath, 'utf-8');
  const result = ejs.render(content, data);
  return result;
}

module.exports = {
    compile
}