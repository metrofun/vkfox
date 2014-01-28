/*global self */
window.addEventListener('message', function (e) {
    if (e.data.from === 'page') {
        self.port.emit('message', JSON.parse(e.data.data));
    }
});
self.port.on('message', function (messageData) {
    document.defaultView.postMessage({from: 'content-script', data: JSON.stringify(messageData)}, '*');
});
