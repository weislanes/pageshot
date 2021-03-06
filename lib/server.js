const Koa = require('koa')
const serve = require('koa-static')
const pageshot = require('./pageshot.js')
const debuglog = require('./debuglog.js')
const chromeStat = require('./chrome-stat.js')
const chromeRestart = require('./chrome-restart.js')

module.exports = function ({ port = 3000, chromePort = 9222 }) {
  const app = new Koa()

  app.use(pageshot({chromePort, path: '/shot'}))
  app.use(serve('./public'))
  app.use(chromeStat({port: chromePort, path: '/stat'}))
  app.use(chromeRestart({port: chromePort, path: '/restart'}))

  app.listen(port, () => {
    console.log(`Pageshot server running on ${port}`)
  })

  app.on('error', err => {
    debuglog('ERR_APP:', err)
  })

  return app
}
