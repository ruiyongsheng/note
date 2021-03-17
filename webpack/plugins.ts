/* eslint-disable max-len */
import { Compiler } from 'webpack'

const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin')
const axios = require('axios')

interface InsertOptions {
  projectName: string
}

// 获取统计appid
const getAppidByName = (appName: string): Promise<any> => {
  const url = `https://feops.workec.com/tdapp/search?appName=${appName}`
  return axios.get(url)
}

class InsertToHtmlPlugin {
  options = {
    projectName: '',
  }

  constructor(options: InsertOptions) {
    this.options = options
  }

  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap('InsertToHtmlPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InsertToHtmlPlugin',
        (data, cb) => {
          if (data.html && 'html' in data) {
            getAppidByName(this.options.projectName)
              .then((res) => {
                if (
                  res &&
                  res.data &&
                  Array.isArray(res.data) &&
                  res.data.length > 0
                ) {
                  const appid = res.data[0].appId
                  data.html = String(data.html).replace(
                    '<!--#include',
                    `<script>var tdappid='${appid}'</script><!--#include`
                  )
                }
                cb(null, data)
              })
              .catch((error) => {
                cb(null, data)
              })
          } else {
            cb(null, data)
          }
        }
      )
    })
  }
}

export default InsertToHtmlPlugin
