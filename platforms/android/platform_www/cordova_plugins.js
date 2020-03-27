cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-audioinput.AudioInput",
      "file": "plugins/cordova-plugin-audioinput/www/audioInputCapture.js",
      "pluginId": "cordova-plugin-audioinput",
      "clobbers": [
        "audioinput"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-audioinput": "1.0.2"
  };
});