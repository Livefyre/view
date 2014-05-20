var expect = require('chai').expect;
var View = require('view');
var CompositeView = require('view/composite-view');
var $ = require('jquery');
var inherits = require('inherits');

'use strict';

describe('composite-view', function () {

    describe('on construction', function () {
        describe('with variable child view arguments', function () {
            it ('adds the same number of child views as specified in arguments', function () {
                var args = [new View(), new View(), new View()];
                var viewObj = Object.create(CompositeView.prototype);
                CompositeView.apply(viewObj, args);
                expect(viewObj._childViews.length).to.equal(args.length);
            });
        });
    });

    describe('when adding a child view', function () {
        it ('adds a child view to #_childViews and immediately renders it', function () {
            var compositeView = new CompositeView();
            compositeView.add(new View());
            expect(compositeView._childViews.length).to.equal(1);
        });
    });

    describe('when remove a child view', function () {
        var compositeView = new CompositeView();
        var childView = new View();
        compositeView.add(childView);

        it('removes the specified child view from #_childViews and destroys it', function () {
            compositeView.remove(childView);
            expect(compositeView._childViews.length).to.equal(0);
        });
    });

    describe('when rendering', function () {
        var compositeView = new CompositeView(new View(), new View());
        it('appends to the DOM the number of child views', function () {
            compositeView.render();
            expect(compositeView.$el.children().length).to.equal(2);
        });
    });

    describe('when destroying', function () {
        var view1 = new View();
        var view2 = new View();
        var compositeView = new CompositeView(view1, view2);
        it('removes from the DOM the all child views', function () {
            compositeView.destroy();
            expect(compositeView.$el.children().length).to.equal(0);
        });
    });
});
