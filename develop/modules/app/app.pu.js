try {
    require('tracker/tracker.js').trackPage();
    require('angular').module('app', ['ui.keypress']);
    //include resize as soon as possible,
    //because it sets width/height
    require('resize/resize.pu.js');
    require('angularKeypress');
    require('filters/filters.pu.js');
    require('anchor/anchor.pu.js');
    require('tooltip/tooltip.pu.js');
    require('router/router.pu.js');
    zzz();
} catch (e) {
    // we don't use window.onerror
    // because Firefox doesn't provide an error object,
    // only line number and column
    require('tracker/tracker.js').error(e.stack);
    throw e;
}
