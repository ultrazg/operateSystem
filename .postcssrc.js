// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: {
    'autoprefixer': {
    },
    'postcss-pxtorem': {
      rootValue: 16,
      exclude: /src/i
    }
  }
}
