(function () {
    var port;
    port = chrome.runtime.connect();
    if (window.name === 'vkfox-login-iframe') {
        port.postMessage(['auth:iframe', decodeURIComponent(window.location.href)]);
    } else {
        port.postMessage(['auth:login', true]);
    }
    port.disconnect();
})();
