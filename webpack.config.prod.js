var config = require("./webpack.config.js");
    config.devtool = false;
    config.mode = "production";
    config.watch = false;

module.exports = config;