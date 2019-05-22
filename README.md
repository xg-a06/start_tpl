# a06-tpl 快速初始化你的项目模版

可以快速初始化你的项目模版,目前支持单页,和js库两种模版,后续会增加多页模版的支持

## 安装

```sh
npm install a06-tpl -g
```

## 执行

```sh

// 以xxx为项目名称初始化单页模版,也可以不输出项目名
$ a06-tpl spa xxx

// 以xxx为项目名称初始化js库模版,也可以不输出项目名
$ a06-tpl lib xxx

```

## 帮助

```sh
$ a06-tpl -h
Usage: a06-tpl <command>

Options:
  -v, --version       output the version number
  -h, --help          output usage information

Commands:
  spa [project-name]  create a spa project
  lib [project-name]  create a lib project

Examples:
  a06-tpl  spa xxx
  a06-tpl  lib xxx

```

## License

The MIT license.
