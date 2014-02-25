var fs = require('fs');
var path = require('path');

var Albert = {};

// Setup the Albert root object.
Albert.DATA_PATH = path.join(process.env.APPDATA, 'Albert');
Albert.PLUGINS_PATH = path.join(Albert.DATA_PATH, 'Plugins');

// Run the first time Albert is initialized.
Albert.start = function() {
// Ensure the Albert root path exists.
  if (!fs.existsSync(Albert.DATA_PATH)) fs.mkdirSync(Albert.DATA_PATH);
  // Load plugins
  Albert.reloadPlugins();
};

// Define the functions for reloading plugins.
Albert.reloadPlugins = function() {
  // Ensure the path exists.
  if (!fs.existsSync(Albert.PLUGINS_PATH)) fs.mkdirSync(Albert.PLUGINS_PATH);

  // Read the plugins directory.
  var pluginPath;
  var pluginDirs = fs.readdirSync(Albert.PLUGINS_PATH);
  for (var i = 0; i < pluginDirs.length; i++) {
    // Ensure the plugin has a plugin.js file.
    pluginPath = path.join(Albert.PLUGINS_PATH, pluginDirs[i], 'plugin.js');
    if (fs.existsSync(pluginPath)) {
      // Read the code, passing Albert as an argument to the require.
      require(pluginPath)(Albert);
    }
  }
};

module.exports = Albert;