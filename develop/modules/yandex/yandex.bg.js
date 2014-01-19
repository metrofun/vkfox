var Env = require('env/env.js');

if (Env.firefox) {
    require('./yandex.moz.bg.js');
} else if (Env.chrome) {
    require('./yandex.webkit.bg.js');
}
