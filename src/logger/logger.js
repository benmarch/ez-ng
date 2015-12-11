/*global angular:false*/
(function (module) {
    'use strict';

    var LogLevel = {
        TRACE: 1,
        DEBUG: 2,
        INFO: 3,
        WARN: 4,
        ERROR: 5,
        FATAL: 6
    };

    module.value('ezLoggerLevel', 'DEBUG');
    module.value('ezLoggerFormat', '{dateTime}\t{name}\t{level}\t{message}');
    module.value('ezLoggerDateTimeFormatter', function (date) {
        return date.toString();
    });

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

        factory.create = function (name) {
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

            logger.setFormat = function (format) {
                logger.format = format;
            };

            logger.setDateTimeFormatter = function (formatter) {
                logger.dateTimeFormatter = formatter || ezLoggerDateTimeFormatter;
            };

            logger.setLevel = function (level) {
                logger.level = LogLevel[level];
            };

            return logger;
        };

        return factory;

    }]);

}(angular.module('ezNg')));
