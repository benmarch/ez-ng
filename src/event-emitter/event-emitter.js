/*global angular:false*/
(function (module) {
    'use strict';

    module.factory('ezEventEmitter', ['$log', function ($log) {

        var factory = {};

        function createEmitter(name) {

            var handlers = {},
                emitter = {
                    _name: name
                };

            emitter.on = function (events, handler) {
                var eventNames = events.split(' ');
                angular.forEach(eventNames, function (eventName) {
                    if (!handlers[eventName]) {
                        handlers[eventName] = [];
                    }
                    handlers[eventName].push(handler);
                    $log.debug('Added handler for event '+ eventName + ' to emitter ' + emitter.name || '(anonymous)');
                });
            };

            emitter.once = function (events, handler) {
                $log.debug('Added one-time handler for event '+ events + ' to emitter ' + emitter.name || '(anonymous)');
                handler.onlyOnce = true;
                emitter.on(events, handler);
            };

            emitter.off = function (events, handler) {
                var eventNames = events.split(' ');
                angular.forEach(eventNames, function (eventName) {
                    if (!handlers[eventName]) {
                        return;
                    }
                    handlers[eventName].splice(handlers[eventName].indexOf(handler), 1);
                    $log.debug('Removed handler for event '+ eventName + ' from emitter ' + emitter.name || '(anonymous)');
                });
            };

            emitter.emit = function (eventName/*, arguments*/) {
                var args = Array.prototype.slice.call(arguments),
                    handlerCount = 0;

                args.shift();

                if (handlers[eventName]) {
                    handlerCount = handlers[eventName].length;
                    angular.forEach(handlers[eventName], function (handler) {
                        handler.apply(null, args);
                        if (handler.onlyOnce) {
                            emitter.off(eventName, handler);
                        }
                    });
                }
                $log.debug('Emitted event '+ eventName + ' with emitter ' + emitter.name || '(anonymous)' + '. Invoked ' + handlerCount + ' handlers.');
            };

            return emitter;

        }

        factory.create = createEmitter;
        factory.mixin = function (obj, name) {
            return angular.extend(obj, createEmitter(name));
        };

        return factory;

    }]);

}(angular.module('ezNg')));
