// Inits width and height of the popup,
// Runs first, therefore without any external dependencies
(function () {
    var css, property;

    try {
        css = JSON.parse(localStorage.getItem('resize'));
    } catch (e) {
    }
    if (!css) {
        css = {
            width: 320,
            height: 480,
            fontSize: 12
        };
    }
    for (property in css) {
        document.documentElement.style[property] = css[property] + 'px';
    }
})();
