(function() {

Mousetrap.bindGlobal('ctrl+d', function() {
  require('nw.gui').Window.get().showDevTools();
  return false;
});

})();