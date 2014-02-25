var Albert = {};

// Wrap Albert in its own scope so that we don't lose anything.
(function(){
var fs = require('fs');
var path = require('path');

// Setup the Albert root object.
Albert.WIDTH = 600;
Albert.DATA_PATH = path.join(process.env.APPDATA, 'Albert');
Albert.PLUGINS_PATH = path.join(Albert.DATA_PATH, 'Plugins');
Albert.THEMES_PATH = path.join(Albert.DATA_PATH, 'Themes');

/**
 * Performs any initial Albert setup.
 */
Albert.start = function() {
  // Cache the DOM.
  Albert.document = document;
  // Cache some elements
  Albert.appContainer = document.querySelector('#app-container');
  Albert.searchBox = document.querySelector('#search-box');
  Albert.resultList = document.querySelector('#result-list');
  // Ensure the Albert root path exists.
  if (!fs.existsSync(Albert.DATA_PATH)) fs.mkdirSync(Albert.DATA_PATH);
  // Load plugins
  Albert.reloadPlugins();
  // Setup the event listeners
  Albert.searchBox.addEventListener('input', function() {
    Albert.updateSearch(this.value);
  }, false);
  // Initial root search
  Albert.updateSearch('');
};

/**
 * Reloads all Albert plugins from the PLUGINS_PATH.
 */
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

/**
 * This changes the Albert theme to a new theme if found.
 * @param  {string?} newTheme The name of the new theme, or null to have no theme.
 * @return {boolean}          A boolean stating whether the theme changed.
 */
Albert.changeTheme = function(newTheme) {
  // Remove the old theme element if present.
  var themeElement = document.querySelector('#theme-css');
  if (themeElement) {
    themeElement.remove();
  }
  
  // If we passed no theme, then return early.
  if (!newTheme) {
    return true;
  }

  // Ensure the theme exists.
  var themePath = path.join(Albert.THEMES_PATH, newTheme, 'theme.css');
  if (fs.existsSync(themePath)) {
    // Create the new theme element. We have to copy the text from the CSS file
    // as creating a new link element and adding a link to another file does 
    // not seem to be allowed.
    var newThemeElement = document.createElement('style');
    newThemeElement.appendChild(document.createTextNode(fs.readFileSync(themePath)));
    newThemeElement.id = 'theme-css';
    document.head.appendChild(newThemeElement);

    return true;
  } else {
    return false;
  }
};

Albert.updateSearch = function(query) {
  var results = ['A', 'B', 'C'];
  var matchingResults = results.filter(function(val){
    return val.indexOf(query) != -1;
  });

  // Create the document fragment
  var fragment = Albert.document.createDocumentFragment();
  for (var i = 0; i < matchingResults.length; i++) {
    var item = Albert.document.createElement('li');
    item.className = 'result';
    item.appendChild(Albert.document.createTextNode(matchingResults[i]));
    fragment.appendChild(item);
  }

  // Update the list
  Albert.resultList.innerHTML = '';
  Albert.resultList.appendChild(fragment);

  // Resize the window
  window.resizeTo(Albert.WIDTH, Albert.appContainer.offsetHeight);
};

// Start Albert!
Albert.start();
})();