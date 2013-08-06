if (window.name === 'vkfox-login-iframe') {
    chrome.runtime.sendMessage(['auth:iframe', decodeURIComponent(window.location.href)]);
}
