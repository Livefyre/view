var expect = require('chai').expect;
var View = require('view');
var $ = require('jquery');

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
});
