const path = require('path');

const fs = require('fs');

const Promise = require('bluebird');

const stat = Promise.promisify(fs.stat);

const mkdir = Promise.promisify(fs.mkdir);

const writeFile = Promise.promisify(fs.writeFile);

const copyFileSync = Promise.promisify(fs.copyFileSync);

const ejs = require('ejs');

const renderFile = Promise.promisify(ejs.renderFile);

async function createTable(tableName, tableFolder) {
  const folderArray = tableFolder.split('/');

  const parentFolder = path.join(__dirname, `../../src/view/${folderArray[1]}`);

  const folder = path.join(__dirname, `../../src/view/${tableFolder}`);

  const apiParentFolder = path.join(__dirname, `../../src/api/${folderArray[1]}`);

  const apiFolder = path.join(__dirname, `../../src/api/${tableFolder}`);

  const editOrigin = path.join(__dirname, '../../tools/table/Edit');

  const editFolder = path.join(__dirname, `../../src/view/${tableFolder}/Edit`);

  const utilsOrigin = path.join(__dirname, '../../tools/table/utils.js');

  const utilsFile = path.join(__dirname, `../../src/view/${tableFolder}/utils.js`);

  const apiOrigin = path.join(__dirname, '../../tools/table/api.js');

  const apiTaget = path.join(__dirname, `../../src/api/${tableFolder}.js`);

  try {
    await stat(parentFolder);
  } catch (err) {
    await mkdir(parentFolder);
  }
  try {
    await stat(folder);
  } catch (err) {
    await mkdir(folder);
  }
  try {
    await stat(apiParentFolder);
  } catch (err) {
    await mkdir(apiParentFolder);
  }
  try {
    await stat(utilsFile);
  } catch (err) {
    await fs.copyFileSync(utilsOrigin, utilsFile);
    console.log('create Edit successful');
  }

  try {
    await stat(editFolder);
  } catch (err) {
    await copyFolder(editOrigin, editFolder);
    console.log('create utils.js successful');
  }
  try {
    await stat(apiFolder);
  } catch (err) {
    await fs.copyFileSync(apiOrigin, apiTaget);
    console.log('create api.js successful');
  }

  try {
    const tablePath = path.join(folder, `${tableName}.vue`);

    try {
      await stat(tablePath);
      throw new Error(`tablePage ${tablePath} already created`);
    } catch (err) {
      const templateFile = 'table.template.ejs';

      const WrappedComponentName = path.basename(tableFolder);

      let componentName = tableName;

      if (componentName === 'index') {
        componentName = WrappedComponentName;
      }
      const content = await renderFile(path.join(__dirname, templateFile), {
        componentName,
        tableFolder,
      });

      await writeFile(tablePath, content);
      console.log(`create tablePage ${tablePath} successful`);
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function copyFolder(from, to) {
  // 复制文件夹到指定目录
  let files = [];

  if (fs.existsSync(to)) {
    // 文件是否存在 如果不存在则创建
    files = fs.readdirSync(from);
    files.forEach((file, index) => {
      const targetPath = `${from}/${file}`;

      const toPath = `${to}/${file}`;

      if (fs.statSync(targetPath).isDirectory()) {
        // 复制文件夹
        const readable = fs.createReadStream(targetPath); // 创建读取流

        const writable = fs.createWriteStream(toPath); // 创建写入流

        readable.pipe(writable);
      } else {
        // 拷贝文件
        fs.copyFileSync(targetPath, toPath);
      }
    });
  } else {
    fs.mkdirSync(to);
    copyFolder(from, to);
  }
}

async function table(tableName, folder) {
  try {
    await createTable(tableName, folder);
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = table;
