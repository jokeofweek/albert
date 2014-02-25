(function() {

var listener = new window.keypress.Listener();

listener.simple_combo('ctrl d', function() {
  require('nw.gui').Window.get().showDevTools();
});

})();