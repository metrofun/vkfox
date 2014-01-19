/* jshint esnext:true */
/**
 * Adapter for firefox internal preferences system.
 * @see about:config
 */
var chromeModule  = require('chrome'),
    Cc = chromeModule.Cc,
    Ci = chromeModule.Ci,
    prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService),
    prefBranch = prefService.getBranch("");

prefBranch.QueryInterface(Ci.nsIPrefBranch);

module.exports = {
    get: function (prefVarPath) {
        switch (prefBranch.getPrefType(prefVarPath)) {
            case prefBranch.PREF_STRING:
                return prefBranch.getCharPref(prefVarPath);
            case prefBranch.PREF_INT:
                return prefBranch.getIntPref(prefVarPath);
            case prefBranch.PREF_BOOL:
                return prefBranch.getBoolPref(prefVarPath);
        }
    },
    /**
     * Sets preference
     *
     * @param {String} varName Can be dot seperated chain
     * @param {String|Number|Boolean} value
     */
    set: function (varName, value) {
        switch (prefBranch.getPrefType(varName)) {
            case prefBranch.PREF_STRING:
                prefBranch.setCharPref(varName, value);
                break;
            case prefBranch.PREF_INT:
                prefBranch.setIntPref(varName, value);
                break;
            case prefBranch.PREF_BOOL:
                prefBranch.setBoolPref(varName, value);
        }
    }
};

