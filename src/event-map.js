'use strict';

/**
 * An extensible object that maps event selectors to callback functions
 * @param events {Object} - Initial event mapping
 */
function EventMap (events) {
    extend(this, [events]);
}

/**
 * Return another EventMap that has been extended with
 * the provided objects
 * @param {...object} extensions - Objects to extend from
 * @returns {EventMap} - A new EventMap, extended from this and others
 */
EventMap.prototype.extended = function () {
    var newMap = new EventMap(this);
    var extensions = [].slice.apply(arguments);
    extend(newMap, extensions);
    return newMap;
};

/**
 * Extend the first argument with keys from the rest, left to right
 * Only extends ownProperties (unlike $.extend)
 * @param {object} target - Target Object to extend
 * @param {object[]} extensions - Array of Objects to extend from
 */
function extend (target, extensions) {
    var copy, name, options, extensionsLength;
    target = target || {},
    extensions = extensions || [];
    extensionsLength = extensions.length;

    for (var i=0; i < extensionsLength; i++) {
        // Only deal with non-undefined values
        if ((options = extensions[i]) !== undefined) {
            // Extend the base object
            for (name in options) {
                if ( ! options.hasOwnProperty(name)) {
                    continue;
                }
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
}

module.exports = EventMap;
