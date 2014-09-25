var $ = require('jquery');
var delegate = require('view/delegate');
var EventEmitter = require('event-emitter');
var EventMap = require('view/event-map');
var inherits = require('inherits');

'use strict';

/**
 * A View is an Object that facades an HTMLElement, and provides helpful methods
 * for automatically creating appropriate Elements on construction, rendering
 * templates as their innerHTML, and delegating and undelegating event listeners
 * @param opts {Object} A set of options to config the view with
 * @param opts.el {HTMLElement} The element the View should control
 * @exports view/view
 * @constructor
 */
var View = function(opts) {
    EventEmitter.call(this);
    opts = opts || {};
    this.opts = opts;
    this.uid = delegate.getUniqueId();

    this.setElement(opts.el || document.createElement(this.elTag));
};
inherits(View, EventEmitter);

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

/**
 * Find elements within the View's .el by jQuery selector
 * @param {string} selector
 * @return {jQuery}
 */
View.prototype.$ = function(selector) {
    return this.$el.find(selector);
};

/**
 * Find elements by class name
 * @param {string} className
 * @return {jQuery}
 */
View.prototype.getElementsByClass = function(className) {
    return this.$el.find('.' + className);
};

/**
 * The HTMLElement tag to use if this View creates its own element
 * @type {string}
 */
View.prototype.elTag = 'div';

/**
 * Class to be added to the view's element.
 * @type {string}
 */
View.prototype.elClass = '';

/**
 * Event bindings.
 * @type {EventMap}
 */
View.prototype.events = new EventMap();

/**
 * Get contextual data for a template.
 * @type {function()}
 */
View.prototype.getTemplateContext = function () {
    return this;
};

/**
 * The template that may be used for this view.
 * @type {?function()}
 */
View.prototype.template = null;

/**
 * Set the element for the view to render in.
 * You will probably want to call .render() after this, but not always.
 * @param element {HTMLElement} The element to render this View in
 * @return this
 */
View.prototype.setElement = function (element) {
    if (this.el) {
        this.$el.removeClass(this.elClass);
        this.undelegateEvents();
    }

    this.$el = element instanceof $ ? element : $(element);
    this.el = this.$el[0];

    if (this.elClass) {
        this.$el.addClass(this.elClass);
    }

    this.delegateEvents();

    return this;
};

/**
 * Attatch the declared events
 * @param events {Object.<string, (string|function)>} Mapping of event/selectors to a function
 * or the name of a method on this view.
 * Backbone.View style, e.g. { "click testSelector": "updateTestEl" }
 */
View.prototype.delegateEvents = function (events) {
    if (!(events || (events = this.events))) {
        return this;
    }
    delegate.delegateEvents(this.$el, events, this.uid, this);
    return this;
};

/**
 * Unbinds the events registered with .delegateEvents
 */
View.prototype.undelegateEvents = function() {
    try {
        delegate.undelegateEvents(this.$el, this.uid);
    } catch(e){
        console.log('Undelegate failure ', this, this.$el, this.uid)
    }
    
    return this;
};

/**
 * If a template is set, render it in this.el
 * Subclasses will want to setElement on child views after rendering,
 *     then call .render() on those subelements
 */
View.prototype.render = function () {
    var context;
    if (typeof this.template === 'function') {
        context = this.getTemplateContext();
        this.$el.html(this.template(context));
    }
};

/**
 * The inverse of render. Detaches the element from the DOM.
 * Retains data and event handlers
 */
View.prototype.detach = function () {
    this.$el.detach();
};

/**
 * Destroy this View, rendering it useless.
 * Remove .el from the DOM, and unbind all event listeners in .events
 * Subclasses should free up as much memory as possible here.
 */
View.prototype.destroy = function () {
    this.undelegateEvents();
    this.$el.remove();
    this.$el = null;
    this.el = null;
    this.opts = null;
    this.template = null;
};

module.exports = View;
