var ProxyMethods = require('proxy-methods/proxy-methods.js');

module.exports = ProxyMethods.forward('users/users.bg.js', ['getProfilesById']);
