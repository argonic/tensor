var config = require("./webpack.config.js");
    config.mode = 'development';
    config.devtool = 'inline-source-map';
    config.watch = true;

module.exports = config;