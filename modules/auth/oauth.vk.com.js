(function () {
    var port;
    if (window.name === 'vkfox-login-iframe') {
        port = chrome.runtime.connect();
        port.postMessage(['auth:iframe', decodeURIComponent(window.location.href)]);
        port.disconnect();
    }
})();
