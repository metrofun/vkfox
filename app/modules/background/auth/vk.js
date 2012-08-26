if (window.name === 'vkfox-login-iframe'){
    chrome.extension.sendRequest(
        {
            location : decodeURIComponent(window.location.href),
            from : 'auth/vk.js'
        },
        function(response) {
            //console.log(response);
        }
    );
}
