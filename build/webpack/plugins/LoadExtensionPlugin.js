const fs = require('fs')
const path = require('path')
const compressing = require('compressing')

module.exports = class LoadExtensionPlugin {
  apply(compiler) {
    //定义目录
    const extensionFolder = path.resolve(`${process.cwd()}/app/static`)
    const devtoolsZipPath = path.resolve(`${process.cwd()}/app/static/devtools.zip`)
    //若dist目录不存在开发扩展插件目录，则做临时拷贝
    if (!fs.existsSync(`${extensionFolder}/devtools`)) {
      compressing.zip.uncompress(devtoolsZipPath, extensionFolder)
    }
  }
}
