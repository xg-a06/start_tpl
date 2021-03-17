const path = require('path');
const fs = require('fs');
const glob = require('glob');
const chalk = require('chalk');
const download = require('download-git-repo');
const Metalsmith = require('metalsmith');
const ejs = require('ejs');
const ora = require('ora');
const logSymbols = require('log-symbols');
const rm = require('rimraf').sync;
const prommpt = require('../lib/prompt');
const CONST = require('./const');
class App {
  constructor() {
    this.rootName;
    this.config;
    this.temp = path.join('.', 'download-temp');
  }
  async init(ctx) {
    try {
      await prommpt(ctx).then((config) => {
        this.config = config;
      });
      this.getRootPath();
      await this.downloadTpl();
      await this.generator();
      this.showHelp();
    } catch (err) {
      console.log(chalk.red(err));
    }
  }
  getRootPath() {
    let { projectName } = this.config;
    const list = glob.sync('*');
    let rootName = path.basename(process.cwd());
    if (rootName === projectName) {
      this.rootName = '.';
    } else if (list.length) {
      if (
        list.filter((itemName) => {
          const pathName = path.resolve(process.cwd(), itemName);
          const isDir = fs.statSync(pathName).isDirectory();
          return itemName.indexOf(projectName) !== -1 && isDir;
        }).length !== 0
      ) {
        throw `目录${projectName}已经存在`;
        return;
      }
      this.rootName = projectName;
    } else {
      this.rootName = projectName;
    }
  }
  getDownloadUrl() {
    let url = '';
    switch (this.config.projectType) {
      case CONST.SPA:
        if (this.config.framework === CONST.REACT) {
          url = 'direct:https://github.com/xg-a06/react_spa_tpl.git#master';
        } else if (this.config.framework === CONST.VUE) {
          url = 'direct:https://github.com/xg-a06/vue_spa_tpl.git#master';
        }
        // url = 'github:xg-a06/#master'
        break;
      case CONST.LIBRARY:
        url = 'xg-a06/lib_tpl';
        break;
      default:
        break;
    }
    return url;
  }
  downloadTpl() {
    const spinner = ora(`模板下载中,请稍后...`);
    spinner.start();
    return new Promise((resolve, reject) => {
      console.log('this.getDownloadUrl()', this.getDownloadUrl());
      download(this.getDownloadUrl(), this.temp, { clone: true }, (err) => {
        spinner.stop();
        if (err) {
          console.error(
            logSymbols.error,
            chalk.red(`下载失败：${err.message}`)
          );
          reject(err);
        } else {
          console.log(logSymbols.success, chalk.green('下载完成'));
          resolve();
        }
      });
    });
  }
  generator() {
    const spinner = ora(`根据配置开始创建模板,请稍后...`);
    spinner.start();
    return new Promise((resolve, reject) => {
      let src = this.temp,
        dist = this.rootName;
      Metalsmith(process.cwd())
        .metadata(this.config)
        .clean(false)
        .source(src)
        .destination(dist)
        .use((files, metalsmith, done) => {
          const meta = metalsmith.metadata();
          let ignoreFile = path.join(__dirname, '../', '.tplignore');
          const ignoreFiles = ejs
            .render(fs.readFileSync(ignoreFile).toString(), meta)
            .split('\n')
            .filter((item) => item.length > 5);
          Object.keys(files).forEach((fileName) => {
            ignoreFiles.forEach((ignorePath) => {
              if (fileName.trim() === ignorePath.trim()) {
                delete files[fileName];
              }
            });
          });
          Object.keys(files).forEach((fileName) => {
            if (fileName.indexOf('assets') === -1) {
              const t = files[fileName].contents.toString();
              files[fileName].contents = Buffer.from(ejs.render(t, meta));
            }
          });
          done();
        })
        .build((err) => {
          spinner.stop();
          rm(src);
          if (err) {
            console.error(
              logSymbols.error,
              chalk.red(`创建失败：${err.message}`)
            );
            reject(err);
          } else {
            console.log(logSymbols.success, chalk.green('创建成功'));
            resolve();
          }
        });
    });
  }
  showHelp() {
    console.log();
    console.log(chalk.green('执行如下命令,运行项目'));
    console.log(chalk.green(`cd ${this.config.projectName}`));
    console.log(chalk.green(`npm i`));
    console.log(chalk.green(`npm start`));
  }
}

module.exports = App;
