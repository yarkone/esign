'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // ENV_CONFIG: '"dev"',
  // BASE_API: '"http://192.168.0.21:8028"' // 要配置本地地址，配置后台地址不能访问
})
