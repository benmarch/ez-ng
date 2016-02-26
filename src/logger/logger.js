/*global angular:false*/
(function (module) {
    'use strict';

    /**
     * @name LogLevel
     * @enum {number}
     *
     * @property TRACE
     * @property DEBUG
     * @property INFO
     * @property WARN
     * @property ERROR
     * @property FATAL
     */
    var LogLevel = {
        TRACE: 1,
        DEBUG: 2,
        INFO: 3,
        WARN: 4,
        ERROR: 5,
        FATAL: 6
    };

    /**
     * @ngdoc value
     * @name module:ezNg.ezLoggerLevel
     * @type {LogLevel}
     * @default 'DEBUG'
     *
     * @description
     * Sets the log level for ezLogger
     */
    module.value('ezLoggerLevel', 'DEBUG');

    /**
     * @ngdoc value
     * @name module:ezNg.ezLoggerFormat
     * @type {string}
     * @default '{dateTime}\t{name}\t{level}\t{message}'
     *
     * @description
     * Sets the output format of log statements
     */
    module.value('ezLoggerFormat', '{dateTime}\t{name}\t{level}\t{message}');

    /**
     * @ngdoc value
     * @name module:ezNg.ezLoggerDateTimeFormatter
     * @type {function}
     * @default date.toString();
     *
     * @description
     * Sets the output format of date and time. Function takes the current date (new Date()) and returns a string.
     */
    module.value('ezLoggerDateTimeFormatter', function (date) {
        return date.toString();
    });


    /**
     * @ngdoc service
     * @kind service
     * @name module:ezNg.ezLogger
     *
     * @description
     * Provides a simple abstraction of $log that provides output formatting and level thresholds
     *
     */
    module.factory('ezLogger', ['$window', '$log', 'ezLoggerLevel', 'ezLoggerFormat', 'ezLoggerDateTimeFormatter', 'ezFormatter', function ($window, $log, ezLoggerLevel, ezLoggerFormat, ezLoggerDateTimeFormatter, ezFormatter) {

        var factory = {},
            format = ezFormatter.assoc();

        function getLogLevel(logger) {
            return LogLevel[$window.ezLoggerLevel] || logger.level;
        }

        function log(logger, method, levelName) {
            return function (/*message, args...*/) {
                var args = Array.prototype.slice.call(arguments),
                    message = '';

                if (typeof args[0] === 'string') {
                    message = args.shift();
                }

                if (LogLevel[levelName] >= getLogLevel(logger)) {
                    $log[method].apply($log, [format(logger.format || '', {
                        dateTime: logger.dateTimeFormatter(new Date()),
                        timeStamp: new Date().getTime(),
                        name: logger._name,
                        level: levelName,
                        message: message
                    })].concat(args));
                }
            };
        }


        /**
         * @ngdoc method
         * @name module:ezNg.ezLogger#create
         * @method
         * @returns {module:ezNg.ezLogger~Logger}
         *
         * @description
         * Factory function for creating a new logger with an optional name
         *
         */
        factory.create = function (name) {

            /**
             * @name module:ezNg.ezLogger~Logger
             *
             */
            var logger = {};

            angular.extend(logger, {
                _name: name,
                format: ezLoggerFormat,
                level: LogLevel[ezLoggerLevel],
                dateTimeFormatter: ezLoggerDateTimeFormatter,
                trace: log(logger, 'debug', 'TRACE'),
                debug: log(logger, 'debug', 'DEBUG'),
                info:  log(logger, 'info',  'INFO'),
                warn:  log(logger, 'warn',  'WARN'),
                error: log(logger, 'error', 'ERROR'),
                fatal: log(logger, 'error', 'FATAL'),
                log:   log(logger, 'log',   'INFO')
            });

            /**
             * @name module:ezNg.ezLogger~Logger#setFormat
             * @method
             *
             * @description
             * Sets the log message format for this logger. See {@link module:ezNg.ezLoggerLevel}
             *
             * @param {string} format String containing placeholders for log message properties
             */
            logger.setFormat = function (format) {
                logger.format = format;
            };

            /**
             * @name module:ezNg.ezLogger~Logger#setFormat
             * @method
             *
             * @description
             * Sets the output format of date and time for this logger. See {@link module:ezNg.ezLoggerDateTimeFormatter}
             *
             * @param {function} formatter Function takes the current date (new Date()) and returns a string.
             */
            logger.setDateTimeFormatter = function (formatter) {
                logger.dateTimeFormatter = formatter || ezLoggerDateTimeFormatter;
            };

            /**
             * @name module:ezNg.ezLogger~Logger#setFormat
             * @method
             *
             * @description
             * Sets the log level for this logger.
             *
             * @param {LogLevel} level Threshold log level. See {@link module:ezNg.ezLoggerLevel}
             */
            logger.setLevel = function (level) {
                logger.level = LogLevel[level];
            };

            return logger;
        };

        return factory;

    }]);

}(angular.module('ezNg')));
