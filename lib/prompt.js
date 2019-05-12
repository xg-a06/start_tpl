const inquirer = require('inquirer')
const chalk = require('chalk')
const CONST = require('./const')

function getQuestions(ctx) {
  const question = [
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name',
      default: ctx.projectName,
      validate: function(value) {
        if (value.length) {
          return true
        } else {
          return chalk.red('project name is required!')
        }
      }
    },
    {
      type: 'input',
      name: 'projectVersion',
      message: 'Project version',
      default: '1.0.0',
      validate: function(value) {
        if (/\d{1,3}\.\d{1,3}\.\d{1,3}/.test(value)) {
          return true
        } else {
          return chalk.red('error project version format!')
        }
      }
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: 'Project description'
    },
    {
      type: 'list',
      name: 'es6Env',
      message: 'ES6 preset env',
      choices: [
        {
          name: 'Preset-stage-1',
          value: CONST.STAGE1
        },
        {
          name: 'Preset-stage-2',
          value: CONST.STAGE2
        },
        {
          name: 'Preset-stage-3',
          value: CONST.STAGE3
        }
      ]
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Javascript framework',
      choices() {
        const arr = [
          {
            name: 'Vue',
            value: CONST.VUE
          },
          {
            name: 'React(coming soon...)',
            disabled: true
          }
        ]
        if (ctx.projectType === CONST.LIBRARY) {
          arr.unshift({
            name: 'No',
            value: CONST.NO
          })
        }
        return arr
      }
    },
    {
      when(result) {
        return result.framework === CONST.VUE
      },
      type: 'confirm',
      name: 'vueRouter',
      message: 'Install vue-router'
    },
    {
      when(result) {
        return result.framework === CONST.VUE
      },
      type: 'confirm',
      name: 'vuex',
      message: 'Install vuex'
    },
    {
      when(result) {
        return ctx.projectType === CONST.LIBRARY
      },
      type: 'confirm',
      name: 'needCss',
      message: 'Need css'
    },
    {
      when(result) {
        return (
          ctx.projectType === CONST.SPA ||
          ctx.projectType === CONST.MPA ||
          result.needCss
        )
      },
      type: 'list',
      name: 'css',
      message: 'Css preprocessor:',
      choices: [
        {
          name: 'No',
          value: CONST.NO
        },
        {
          name: 'Sass',
          value: CONST.SASS
        },
        {
          name: 'Less',
          value: CONST.LESS
        }
      ]
    },
    {
      when(result) {
        return result.framework === CONST.VUE
      },
      type: 'confirm',
      name: 'esLint',
      message: 'Use ESLint'
    }
  ]
  return question
}

module.exports = ctx => {
  return inquirer.prompt(getQuestions(ctx)).then(res => {
    let result = res
    console.log(result)
    return result
  })
}