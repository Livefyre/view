'use strict';

var $ = require('jquery');
var View = require('view');
var inherits = require('inherits');

/**
 * A View that is composed of child views
 * (childView1, ..., childViewN, <opts>)
 * @param [arguments] The child views, and optional 'opts'
 * @exports view/composite-view
 * @constructor
 */
var CompositeView = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var hasOpts = !(args[args.length-1] instanceof View);
    var opts = hasOpts ? args.pop() : {};

    View.call(this, opts);

    this._childViews = [];

    var subViews = hasOpts ? args.slice(0, args.length) : args;
    for (var i=0; i < subViews.length; i++) {
        this.add(subViews[i]);
    }
};
inherits(CompositeView, View);

/**
 * Add a child view
 * @param view {View} The child view to add
 */
CompositeView.prototype.add = function (view) {
    this._childViews.push(view);
    this.$el.append(view.$el);
    view.render();
    return this;
};

/**
 * Remove a child view
 * @param view {View} The child view to remove
 */
CompositeView.prototype.remove = function (view) {
    view.destroy();
    this._childViews.splice($.inArray(view, this._childViews), 1);
    return this;
};

CompositeView.prototype.render = function () {
    View.prototype.render.call(this);
    for (var i=0; i < this._childViews.length; i++) {
        this._childViews[i].render();
    }
    return this;
};

CompositeView.prototype.destroy = function () {
    View.prototype.destroy.call(this);
    for (var i=0; i < this._childViews.length; i++) {
        this._childViews[i].destroy();
    }
    this._childViews = [];

    return this;
};

module.exports = CompositeView;
