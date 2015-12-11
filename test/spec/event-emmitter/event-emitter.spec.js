/*global jasmine:false, describe:false, it:false, beforeEach: false, module: false, inject: false*/
'use strict';

describe('ezEventEmitter', function () {

    var ezEventEmitter;

    beforeEach(module('ezNg'));

    beforeEach(inject(function (_ezEventEmitter_) {
        ezEventEmitter = _ezEventEmitter_;
    }));

    it('should create a new emitter with given name', function () {
        //when
        var em = ezEventEmitter.create('myEmitter');

        //then
        expect(em._name).toBe('myEmitter');
    });

    it('should mix event emitter functionality into a proved object', function () {
        //when
        var toBeMixed = {};
        var em = ezEventEmitter.mixin(toBeMixed, 'myEmitter');

        //then
        expect(em).toBe(toBeMixed);
        expect(toBeMixed._name).toBe('myEmitter');
    });

    it('should call event handler when event is emitted', function () {
        //given
        var em = ezEventEmitter.create('myEmitter');
        var called = false;
        em.on('test', function () {
            called = true;
        });

        //when
        em.emit('test');

        //then
        expect(called).toBe(true);
    });

    it('should not call removed event handler when event is emitted', function () {
        //given
        var em = ezEventEmitter.create('myEmitter');
        var called = false;
        var handler = function () {
            called = true;
        };
        em.on('test', handler);
        em.off('test', handler);

        //when
        em.emit('test');

        //then
        expect(called).toBe(false);
    });

    it('should not break if #off is used on a non-existent handler', function () {
        //given
        var em = ezEventEmitter.create('myEmitter');
        function notToThrow() {
            em.off('test', function () {});
        }

        //when
        em.emit('test');

        //then
        expect(notToThrow).not.toThrow();
    });

    it('should only call a handler once', function () {
        //given
        var em = ezEventEmitter.create('myEmitter');
        var handler = jasmine.createSpy();
        em.once('test', handler);

        //when
        em.emit('test');
        em.emit('test');

        //then
        expect(handler.calls.count()).toBe(1);
    });

    it('should call all handlers', function () {
        //given
        var em = ezEventEmitter.create('myEmitter');
        var handler1 = jasmine.createSpy();
        var handler2 = jasmine.createSpy();
        var handler3 = jasmine.createSpy();
        em.on('test', handler1);
        em.on('test', handler2);
        em.on('test', handler3);

        //when
        em.emit('test');

        //then
        expect(handler1).toHaveBeenCalled();
        expect(handler2).toHaveBeenCalled();
        expect(handler3).toHaveBeenCalled();
    });

    it('should pass arguments to handlers', function () {
        //given
        var em = ezEventEmitter.create('myEmitter');
        var handler = jasmine.createSpy();
        em.on('test', handler);

        //when
        em.emit('test', 'arg1', 2, {arg: 3}, [4]);

        //then
        expect(handler).toHaveBeenCalledWith('arg1', 2, {arg: 3}, [4]);
    });

});
