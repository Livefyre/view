var expect = require('chai').expect;
var EventMap = require('view/event-map');

'use strict';

describe('view/event-map', function () {
    it('can be constructed with no args', function () {
        expect(function () {
            new EventMap();
        }).not.to.throw();
    });
    it('can be constructed with an object', function () {
        var onClick = function () {};
        var onClickThing = function () {};
        var eventMap = new EventMap({
            'click': onClick,
            'click thing': onClickThing
        });
        expect(eventMap.click).to.equal(onClick);
        expect(eventMap['click thing']).to.equal(onClickThing);
    });
    describe('.extended', function () {
        it('returns a new object', function () {
            var onClick = function () {};
            var onClickThing = function () {};
            var onClickOtherThing = function () {};
            var eventMap = new EventMap({
                'click': onClick
            });
            var extendedEventMap = eventMap.extended({
                'click thing': onClickThing
            },{
                'click otherThing': onClickOtherThing
            });
            expect(eventMap).not.to.equal(extendedEventMap);
            expect(eventMap.click).to.equal(onClick);
            expect(eventMap['click thing']).to.equal(undefined);
            expect(extendedEventMap.click).to.equal(onClick);
            expect(extendedEventMap['click thing']).to.equal(onClickThing);
            expect(extendedEventMap['click otherThing']).to.equal(onClickOtherThing);
        });
        it('extension keys overwrite parent keys', function () {
            var onClick1 = function () {};
            var onClick2 = function () {};
            var eventMap = new EventMap({
                'click': onClick1
            });
            var extendedEventMap = eventMap.extended({
                'click': onClick2
            });
            expect(eventMap).not.to.equal(extendedEventMap);
            expect(extendedEventMap.click).to.equal(onClick2);
        });
    });
});
