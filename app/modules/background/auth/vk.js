if (window.name === 'vkfox-login-iframe') {
    chrome.extension.sendMessage(['auth:iframe', decodeURIComponent(window.location.href)]);
}
