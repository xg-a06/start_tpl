#!/usr/bin/env node
// 测试mac
const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')
const { version } = require('../package.json')
const CONST = require('../lib/const')
const App = require('../lib/app')

const app = new App()

console.log(chalk.green(figlet.textSync('A06-TPL', {})))

program.version(version, '-v, --version').usage('<command>')

program
  .command('spa [project-name]')
  .description(chalk.green('create a spa project'))
  .action(projectName => {
    const ctx = { projectType: CONST.SPA, projectName: projectName }
    app.init(ctx)
  })
program
  .command('lib [project-name]')
  .description(chalk.green('create a lib project'))
  .action(projectName => {
    const ctx = { projectType: CONST.LIBRARY, projectName: projectName }
    app.init(ctx)
  })
program
  .command('mpa [project-name]')
  .description(chalk.green('create a mpa project'))
  .action(projectName => {
    const ctx = { projectType: CONST.MPA, projectName: projectName }
    app.init(ctx)
  })
program.on('--help', function() {
  console.log('')
  console.log('Examples:')
  console.log(chalk.green('  a06-tpl ') + ' spa xxx')
  console.log(chalk.green('  a06-tpl ') + ' lib xxx')
  // console.log(chalk.green('  a06-tpl ') + ' mpa xxx')
})
program.parse(process.argv)
