/*global jasmine:false, describe:false, it:false, beforeEach: false, module: false, inject: false*/
'use strict';

describe('ezLogger', function () {

    var ezLogger,
        $logMock,
        logger,
        $window;

    beforeEach(module('ezNg'));
    beforeEach(module(function ($provide) {
        $logMock = {
            log: jasmine.createSpy('log'),
            debug: jasmine.createSpy('debug'),
            info: jasmine.createSpy('info'),
            warn: jasmine.createSpy('warn'),
            error: jasmine.createSpy('error')
        };
        $provide.value('$log', $logMock);
    }));

    beforeEach(inject(function (_ezLogger_, _$window_) {
        ezLogger = _ezLogger_;
        logger = ezLogger.create('logger');

        $window = _$window_;
        $window.ezLoggerLevel = null;
    }));

    it('should log a message to the console', function () {
        //when
        logger.log('hello');

        //then
        expect($logMock.log).toHaveBeenCalled();
    });

    it('should not log a TRACE using default level', function () {
        //when
        logger.trace('hello');

        //then
        expect($logMock.debug).not.toHaveBeenCalled();
    });

    it('should not log when level is increased to WARN', function () {
        //given
        $window.ezLoggerLevel = 'WARN';

        //when
        logger.log('hello');

        //then
        expect($logMock.log).not.toHaveBeenCalled();
    });

    it('should take a new log level', function () {
        //given
        logger.setLevel('WARN');

        //when
        logger.log('hello');

        //then
        expect($logMock.log).not.toHaveBeenCalled();
    });

    it('should take a new format', function () {
        //given
        logger.setFormat('{level} {message}');

        //when
        logger.log('hello');

        //then
        expect($logMock.log).toHaveBeenCalledWith('INFO hello');
    });

    it('should take a new dateTime formatter', function () {
        //given
        var date = new Date();
        var dateString = date.getDay() + ' ' + date.getMonth() + ' ' + date.getFullYear();
        logger.setDateTimeFormatter(function (date) {
            return date.getDay() + ' ' + date.getMonth() + ' ' + date.getFullYear();
        });

        //when
        logger.log('hello');

        //then
        expect($logMock.log).toHaveBeenCalledWith(dateString + '\tlogger\tINFO\thello');
    });

    it('should pass additional arguments', function () {
        //when
        logger.setFormat('{message}');
        logger.log('hello', {}, [], 1);

        //then
        expect($logMock.log).toHaveBeenCalledWith('hello', {}, [], 1);
    });

    it('should pass an object message as a second argument', function () {
        //when
        logger.setFormat('{message}');
        logger.log({});

        //then
        expect($logMock.log).toHaveBeenCalledWith('', {});
    });

});
