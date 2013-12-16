var expect = require('chai').expect;
var View = require('view');
var $ = require('jquery');
var inherits = require('inherits');

'use strict';

describe('view', function () {
    var view;
    beforeEach(function () {
        view = new View();
    });
    describe('.setElement(element)', function () {
        it('sets .el and $el when passed an HTMLElement', function () {
            var element = document.createElement('div');
            view.setElement(element);
            expect(view.el).to.equal(element);
            expect(view.$el instanceof $).to.equal(true);
            expect(view.$el[0]).to.equal(element);
        });
        it('sets .el and $el when passed an jQuery Element', function () {
            var element = document.createElement('div'),
                $element = $(element);
            view.setElement($element);
            expect(view.el).to.equal(element);
            expect(view.$el instanceof $).to.equal(true);
            expect(view.$el[0]).to.equal(element);
        });
        describe('on subclass with an event map', function () {
            var ViewWithEvents;
            beforeEach(function () {
                ViewWithEvents = function () {
                    this.clickedEls = [];
                    View.apply(this, arguments);
                };
                inherits(ViewWithEvents, View);

                ViewWithEvents.prototype.events = View.prototype.events.extended({
                    'click': function (e) {
                        this.clickedEls.push(e.target);
                    }
                });
            });
            it('construction delegates events', function () {
                var view = new ViewWithEvents();
                view.$el.click();
                expect(view.clickedEls.length).to.equal(1);
                expect(view.clickedEls).to.include(view.el);
            });
            it('.setElement undelegates from old el and delegates events to the new .el', function () {
                var view = new ViewWithEvents();
                var newEl = document.createElement('div');
                view.setElement(newEl);
                view.$el.click();
                expect(view.clickedEls.length).to.equal(1);
                expect(view.clickedEls).to.include(newEl);
            });
        });
    });
    describe('$', function () {
        it('queries the local Element', function () {
            view.setElement('<div><test>test</test></div>');
            expect(view.$('test').html()).to.equal('test');
        });
    });
    describe('.delegateEvents()', function () {
        it('understands method names as callbacks', function () {
            view.setElement('<div><test>test</test></div>');
            view.truth = false;
            view.setTruth = function() { this.truth = true; };
            var events = { 'click.hub test': 'setTruth' };

            view.delegateEvents(events);
            view.$('test').trigger('click.hub');

            expect(view.truth).to.equal(true);
        });
        it('understands functions as callbacks', function () {
            view.setElement('<div><test>test</test></div>');
            view.truth = false;
            var events = {
                'click test': function () {
                    view.truth = true;
                }
            };

            view.delegateEvents(events);
            view.$('test').trigger('click');

            expect(view.truth).to.equal(true);
        });
    });
    describe('.undelegateEvents()', function () {
        it('can take out the trash', function() {
            view.setElement('<div><test>test</test></div>');
            view.truth = false;
            var events = {
                'click test': function () {
                    view.truth = true;
                }
            };

            view.delegateEvents(events);
            view.undelegateEvents();
            view.$('test').trigger('click.hub');

            expect(view.truth).to.equal(false);
        });
        it('can take out the trash for namespaced events', function() {
            view.setElement('<div><test>test</test></div>');
            view.truth = false;
            var events = {
                'click.hub test': function () {
                    view.truth = true;
                }
            };

            view.delegateEvents(events);
            view.undelegateEvents();
            view.$('test').trigger('click.hub');

            expect(view.truth).to.equal(false);
        });
    });
    describe('.events.extended()', function () {
        it('can be used to easily extend a Parent View\'s EventMap', function () {
            var onClickParent = function () {};
            function ParentView () {
                View.apply(this, arguments);
            }
            inherits(ParentView, View);
            ParentView.prototype.events = View.prototype.events.extended({
                'click .parent': onClickParent
            });

            var onClickChild = function () {};
            function ChildView () {
                ParentView.apply(this, arguments);
            }
            inherits(ChildView, ParentView);
            ChildView.prototype.events = ParentView.prototype.events.extended({
                'click .child': onClickChild
            });

            var childView = new ChildView();
            expect(childView.events['click .parent']).to.equal(onClickParent);
            expect(childView.events['click .child']).to.equal(onClickChild);
        });
    });
});
