const Gulp = require('gulp')                              // 任务分发工具 
const WebpackStream = require('webpack-stream')           // JS 模块化打包
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // JS 压缩插件
const Rimraf = require('rimraf')                          // 删除文件
const Path = require('path') 

const PROJ_DIR = __dirname                                // 项目目录
const SOURCE_DIR = Path.join(PROJ_DIR, 'src')             // 源文件目录
const DIST_DIR = Path.join(PROJ_DIR, 'dist')              // 目标文件目录

function watch(sources, tasks) {
// 文件监视程序，当文件修改的时候触发一些事件
// sources: Array<string> - 监视的文件路径
// tasks: Array<strings> - 打算运行的任务
  Gulp.watch(sources, {
    debounceDelay: 20,
    mode: 'auto',
    cwd: PROJ_DIR
  }).on('change', function (e) {
    const now = new Date()
    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
    const pathname = Path.relative(process.cwd(), e.path)
    console.log('[\033[90m' + time + '\033[0m] ' + pathname + ' was \033[35m' + e.type + '\033[0m')
    Gulp.start.apply(Gulp, tasks)
  })
}

Gulp.task('clear', function (cb) {
// 删除目标文件目录
  Rimraf.sync(DIST_DIR)
  cb()
})

Gulp.task('copy', function () {
// 源文件目录 -> 拷贝非代码文件 -> 目标文件目录
  return Gulp
           .src(Path.join(SOURCE_DIR, './**/*.!(ts|tsx)'), {
             base: SOURCE_DIR
           })
           .pipe(Gulp.dest(DIST_DIR))
})

Gulp.task('build-src', function compileComponents() {
  var webpackStream = WebpackStream({
    target: 'web',
    entry: Path.join(SOURCE_DIR, 'index.ts'),
    output: {
      filename: 'index.js',
      libraryTarget: "umd",
      library: "WebshipAjax"
    },
    externals: {},
    resolve: {
      extensions: ['.ts', '.js'],
    },
    devtool: 'source-map',
    module: {
      rules: [
        { 
          test: /\.ts$/, 
          use: ['awesome-typescript-loader'],
          exclude: /node_modules/
        },
      ]
    },
    plugins: [
      new UglifyJsPlugin()
    ]
  }).on('error', function (error) {
    console.error(error.toString())
    this.emit('end')
  })
  return Gulp
          .src(SOURCE_DIR, {
            base: SOURCE_DIR
          })
          .pipe(webpackStream)
          .pipe(Gulp.dest(DIST_DIR))
})   

Gulp.task('watchfiles', function () {
// 监视文件变化
  watch(['src/**/*.ts'], ['build-src'])
})

Gulp.task('build', ['clear', 'build-src', /*'build-test',*/ 'copy'])
Gulp.task('watch', ['build', 'watchfiles'])