'use strict';

var $ = require('jquery');
var View = require('view');
var inherits = require('inherits');

var CompositeView = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var hasOpts = !(args[args.length-1] instanceof View);
    var opts = hasOpts ? args.pop() : {};

    View.call(this, opts);

    this._childViews = [];

    var subViews = hasOpts ? args.slice(0, args.length) : args;
    for (var i=0; i < subViews.length; i++) {
        this.addView(subViews[i]);
    }
};
inherits(CompositeView, View);

CompositeView.prototype.addView = function (view) {
    this._childViews.push(view);
    this.$el.append(view.$el);
    view.render();
    return this;
};

CompositeView.prototype.removeView = function (view) {
    view.destroy();
    this._childViews.splice($.inArray(view, this._childViews), 1);
    return this;
};

CompositeView.prototype.render = function () {
    for (var i=0; i < this._childViews.length; i++) {
        this._childViews[i].render();
    }
    return this;
};

CompositeView.prototype.destroy = function () {
    for (var i=0; i < this._childViews.length; i++) {
        this._childViews.destroy();
    }
    this._childViews = [];

    return this;
};

module.exports = CompositeView;
