const { merge } = require("webpack-merge");

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    open: true,
    port: 3000,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    historyApiFallback: true,
  },
});
