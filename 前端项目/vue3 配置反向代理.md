# 跨域配置的一种思路

node端app.js里面的设计

```js
const Koa = require('koa') // 引入koa包
const serve =  require('koa-static') // 静态资源处理包

const app = new Koa() // 创建一个web服务 

// 使用中间件
const {historyApiFallback} = require('koa2-connect-history-api-fallback')
// 先处理访问 
app.use(historyApiFallback({
    whiteList: ['/prod-api'] // prod-api不要帮我处理
}))
const path = require('path')

const proxy = require('koa2-proxy-middleware') // 代理中间件
// 注册中间件 里面proxy参数是镀锡
app.use(proxy({
    // targets =》 配置多个跨域 可以匹配不同的后缀，代理到不同的地址
    targets: {
        // （.*）表示/prod-api/后面跟什么都会被匹配到
        '/prod-api/(.*)': {
            // target区别于targets， target表示要代理的地址 注意后面有api
            // 跟不跟api 根据接口来设计
            target: 'http://ihrm-java.itheima.net/api',
            changeOrigin: true, // 是否开始跨域 =》 是
            // pathRewrite =》会忽略地址 省略 /prod-api =》替换为''
            // 如果没有pathRewrite替换，http://ihrm-java.itheima.net/api/prod-api就是结果
            // 加了 就变成 http://ihrm-java.itheima.net/api
            pathRewrite: {
                '/prod-api': ''
            }
        }
    }
}))




// 再将代码静态化 让服务器指向这个访问地址
app.use(serve(__dirname + "/public")) // 将public下的代码静态化


app.listen(3334, () => { // 侦听一个web服务 点击下面地址，就能够访问静态资源 代理成功
    console.log("人资项目启动, 启动的地址是http://localhost:3334");
})
```





而vue开发时的跨域设置
```js
module.exports = {
      devServer: {
        // proxy表示配置代理
        proxy: {
          '/api': {
            // ‘/api’表示匹配有api的后缀地址 如果没有后缀，就改为/
            // target表示我们代理到 http://pcapi-xiaotuxian-front-devtest.itheima.net/
            target: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/',
            changeOrigin: true
            // pathRewrite ''
          }
        }
  }
}
```

