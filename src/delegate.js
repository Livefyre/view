/**
 * @fileOverview Delegate utils.
 */
var $ = require('jquery');
var EventMap = require('./event-map');

/** @const {string} */
var EVENT_ANTENNA = '.delegateEvents';

/** @const {RegExp} */
var EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

/** @type {number} */
var idCounts = 0;

/**
 * Delegate events. Binds a listener for all events onto the $antenna. The
 * uniqueId is used as a way to access them later.
 * @param {jQuery} $antenna
 * @param {Object.<string, string|function>} events
 * @param {string} uniqueId
 * @param {Object} context
 */
function delegateEvents($antenna, events, uniqueId, context) {
    undelegateEvents($antenna, uniqueId);
    if (events instanceof EventMap) {
        events = events.withContext(context);
    }
    for (var key in events) {
        if (events.hasOwnProperty(key)) {
            var method = events[key];
            if (typeof method === 'string') {
                method = context[method];
            }
            if (!method) {
                throw "Undefined method for: " + key;
            }
            method = $.proxy(method, context);

            var match = key.match(EVENT_SPLITTER);
            if (!match) {
                throw "Invalid event/selector pair: " + key;
            }
            var eventName = match[1];
            var selector = match[2];
            eventName += EVENT_ANTENNA + uniqueId;
            if (selector === '') {
                $antenna.on(eventName, method);
            } else {
                $antenna.on(eventName, selector, method);
            }
        }
    }
}

/**
 * Get a unique Id
 * @return {string}
 */
function getUniqueId () {
    return ++idCounts + '';
}

/**
 * Undelegate events. Removes all events from the provided antenna jQuery
 * element. Uses the uniqueId as a way of grabbing all delegated events.
 * @param {jQuery} $antenna The antenna element.
 * @param {string} uniqueId The id that all events are using.
 */
function undelegateEvents($antenna, uniqueId) {
    $antenna.off(EVENT_ANTENNA + uniqueId);
}

module.exports = {
    delegateEvents: delegateEvents,
    getUniqueId: getUniqueId,
    undelegateEvents: undelegateEvents
};
