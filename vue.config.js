module.exports = {
  configureWebpack: {
    resolve: {
      extensions: [],
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }

    }
  },
  devServer: {
    host: '192.168.1.209',
    port: 8080
  },
  publicPath: './'
}
