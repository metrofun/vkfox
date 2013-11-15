(function(){ window.i18n || (window.i18n = {}) 
var MessageFormat = { locale: {} };
MessageFormat.locale.en = function ( n ) {
  if ( n === 1 ) {
    return "one";
  }
  return "other";
};

})();