/*global angular:false*/
(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @kind service
     * @name module:ezNg.ezEventEmitter
     *
     * @description
     * Provides a simple event emitter that is *not* hooked into the Scope digest cycle.
     *
     */
    module.factory('ezEventEmitter', ['ezLogger', function (ezLogger) {

        var factory = {},
            logger = ezLogger.create('ezEventEmitter');

        logger.setLevel(ezLogger.logLevel.INFO);

        /**
         * @name module:ezNg.ezEventEmitter~EventEmitter
         * @alias EventEmitter
         * @kind interface
         *
         * @description
         * Describes a simple event emitter
         */

        function createEmitter(name) {

            var handlers = {},
                emitter = {
                    _name: name
                };

            /**
             * @name module:ezNg.ezEventEmitter~EventEmitter#on
             * @function
             *
             * @param {string} events Space-separated of events to listen for
             * @param {function} handler Function to invoke when event is triggered
             *
             * @description
             * Registers a listener for a specific event or multiple events
             *
             * @example
             * ```js
             * let emitter = ezEventEmitter.create();
             *
             * emitter.on('someEvent', function (arg1, arg2) {
             *     console.log(arg1); //hello
             *     console.log(arg2); //world
             * });
             *
             * emitter.emit('someEvent', 'hello', 'world');
             * ```
             */
            emitter.on = function (events, handler) {
                var eventNames = events.split(' ');
                angular.forEach(eventNames, function (eventName) {
                    if (!handlers[eventName]) {
                        handlers[eventName] = [];
                    }
                    handlers[eventName].push(handler);
                    logger.debug('Added handler for event '+ eventName + ' to emitter ' + emitter.name || '(anonymous)');
                });
            };


            /**
             * @name module:ezNg.ezEventEmitter~EventEmitter#once
             * @function
             *
             * @param {string} events Space-separated of events to listen for
             * @param {function} handler Function to invoke when event is triggered for the first time
             *
             * @description
             * Registers a listener for a specific event or multiple events, and immediately cancels the listener
             * after it is invoked the first time
             *
             * @example
             * ```js
             * let emitter = ezEventEmitter.create(),
             *     count = 0;
             *
             * emitter.once('inc', function () {
             *     console.log('Current count: ' + (++count));
             * });
             *
             * emitter.emit('inc'); // Current count: 1
             * emitter.emit('inc'); //
             * ```
             */
            emitter.once = function (events, handler) {
                logger.debug('Added one-time handler for event '+ events + ' to emitter ' + emitter.name || '(anonymous)');
                handler.onlyOnce = true;
                emitter.on(events, handler);
            };


            /**
             * @name module:ezNg.ezEventEmitter~EventEmitter#off
             * @function
             *
             * @param {string} events Space-separated of events to remove listeners for
             * @param {function} handler Reference to listener to cancel
             *
             * @description
             * Cancels listeners for specified event(s)
             *
             * @example
             * ```js
             * let emitter = ezEventEmitter.create(),
             *     count = 0,
             *     increment = function () {
             *        console.log('Current count: ' + (++count));
             *     };
             *
             * emitter.on('inc', increment);
             *
             * emitter.emit('inc'); // Current count: 1
             * emitter.emit('inc'); // Current count: 2
             * emitter.off('inc', increment);
             * emitter.emit('inc'); //
             * ```
             */
            emitter.off = function (events, handler) {
                var eventNames = events.split(' ');
                angular.forEach(eventNames, function (eventName) {
                    if (!handlers[eventName]) {
                        return;
                    }
                    handlers[eventName].splice(handlers[eventName].indexOf(handler), 1);
                    logger.debug('Removed handler for event '+ eventName + ' from emitter ' + emitter.name || '(anonymous)');
                });
            };


            /**
             * @name module:ezNg.ezEventEmitter~EventEmitter#emit
             * @function
             *
             * @param {string} eventName Name of event to trigger
             * @param {...any} arguments Arguments to pass to handlers
             *
             * @description
             * Triggers specified event with provided arguments
             *
             * @example
             * ```js
             * let emitter = ezEventEmitter.create();
             *
             * emitter.on('someEvent', function (arg1, arg2) {
             *     console.log(arg1); //hello
             *     console.log(arg2); //world
             * });
             *
             * emitter.emit('someEvent', 'hello', 'world');
             * ```
             */
            emitter.emit = function (eventName/*, arguments*/) {
                var args = Array.prototype.slice.call(arguments),
                    handlerCount = 0,
                    toRemove = [];

                args.shift();

                if (handlers[eventName]) {
                    handlerCount = handlers[eventName].length;
                    angular.forEach(handlers[eventName], function (handler) {
                        handler.apply(null, args);
                        if (handler.onlyOnce) {
                            toRemove.push(handler);
                        }
                    });
                    angular.forEach(toRemove, function (handler) {
                        emitter.off(eventName, handler);
                    });
                }
                logger.debug('Emitted event '+ eventName + ' with emitter ' + emitter.name || '(anonymous)' + '. Invoked ' + handlerCount + ' handlers.');
            };

            return emitter;

        }


        /**
         * @ngdoc method
         * @name module:ezNg.ezEventEmitter#create
         * @method
         *
         * @param {string=} name Optional name for debugging purposes
         * @returns {module:ezNg.ezEventEmitter~EventEmitter}
         *
         * @description
         * Returns a new event emitter with the provided name
         *
         * @example
         * ```js
         * let emitter = ezEventEmitter.create('myEmitter');
         * ```
         */
        factory.create = createEmitter;

        /**
         * @ngdoc method
         * @name module:ezNg.ezEventEmitter#mixin
         * @method
         *
         * @param {Object} object Object to extend with {@link EventEmitter} characteristics
         * @param {string=} name Optional name for debugging purposes
         * @returns {module:ezNg.ezEventEmitter~EventEmitter}
         *
         * @description
         * Returns a new event emitter with the provided name
         *
         * @example
         * ```js
         * let myObject = {},
         *     emitter = ezEventEmitter.mixin(myObject, 'myEmitter');
         *
         * myObject.on('myEvent', function () {});
         * myObject.emit('myEvent');
         * ```
         */
        factory.mixin = function (object, name) {
            return angular.extend(object, createEmitter(name));
        };

        /**
         * @ngdoc method
         * @name module:ezNg.ezEventEmitter#debug
         * @method
         *
         * @description
         * Put ezEventEmitter into debug mode. This will cause all actions
         * to be logged to the console for easy debugging.
         *
         * @example
         * ```js
         * let emitter = ezEventEmitter.create('myEmitter');
         * ezEventEmitter.debug();
         *
         * emitter.emit('hello'); //"Emitted event hello with emitter myEmitter. Invoked 0 handlers."
         *```
         */
        factory.debug = function () {
            logger.setLevel(ezLogger.logLevel.DEBUG);
        };

        /**
         * @ngdoc method
         * @name module:ezNg.ezEventEmitter#_getLogger
         * @method
         *
         * @description
         * Debugging function for retrieving a reference to the logger
         *
         * @returns {Logger}
         * @private
         */
        factory._getLogger = function () {
            return logger;
        };

        return factory;

    }]);

}(angular.module('ezNg')));
