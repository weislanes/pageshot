const chromeLauncher = require('chrome-launcher')
const debuglog = require('./debuglog.js')
const axios = require('axios')

const instances = []

function launch ({port = 9222}) {
  return chromeLauncher.launch({
    port: port,
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars']
  }).then(chrome => {
    console.log(`Chrome debugging port running on ${chrome.port}`)
    instances.push({port, chrome})
  })
}

function kill ({port = 9222}) {
  const instance = instances.find(x => x.port === port)
  return instance
    ? instance.chrome.kill()
    : Promise.reject(new Error(`No chrome running on port ${port}`))
}

function restart ({port = 9222}) {
  debuglog(`Restarting chrome on ${port}`)
  return kill({port}).then(launch({port}))
}

function healthCheck ({port = 9222}) {
  return axios.get(`http://localhost:${port}/json`)
    .then(r => {
      debuglog('HELTH_CHECK', r.data)
      return r.data
    })
}

module.exports = {
  instances,
  launch,
  kill,
  restart,
  healthCheck
}
