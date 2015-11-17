
/**
 * @fileOverview Utility functions.
 */

module.exports = {
    /**
     * Is the current browser mobile?
     * @return {boolean} yay or nay.
     */
    isMobile: function () {
        var mobile = navigator.appVersion.indexOf('Mobile') !== -1;
        var android = navigator.appVersion.indexOf('Android') !== -1;
        return mobile || android;
    }
};
