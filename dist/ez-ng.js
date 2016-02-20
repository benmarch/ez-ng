/*global angular:false*/
(function () {
  'use strict';

}(angular.module('ezNg', [])));

/* global angular:false */
(function (module) {
    'use strict';

    module.factory('ezComponentHelpers', ['$http', '$templateCache', '$compile', '$document', function ($http, $templateCache, $compile, $document) {

        return function (scope, element, attrs, ctrl, transclude) {

            var helpers = {};

            helpers.useTemplate = function (template) {
                var newElement = $compile(template, transclude)(scope);

                element.empty();
                element.append(newElement);
            };

            helpers.useTemplateUrl = function (url) {
                return $http.get(url, {
                    cache: $templateCache
                }).success(function (template) {
                    helpers.useTemplate(template);
                });
            };

            helpers.useStyles = function (styles) {
                var el = $document[0].createElement('style');

                el.type = 'text/css';
                el.scoped = true;
                el.setAttribute('scoped', 'scoped');

                if (el.styleSheet){
                    el.styleSheet.cssText = styles;
                } else {
                    el.appendChild($document[0].createTextNode(styles));
                }

                element.append(el);
            };

            helpers.useStylesUrl = function (url) {
                return $http.get(url, {
                    cache: $templateCache
                }).success(function (styles) {
                    helpers.useStyles(styles);
                });
            };

            return helpers;

        };

    }]);

}(angular.module('ezNg')));

/* global angular: false */
(function (module) {
    'use strict';

    /**
     * Shim for angular 1.5's component service (copied from AngularJs source)
     * https://github.com/angular/angular.js/blob/master/src/ng/compile.js
     *
     * Additionally provides styles and stylesUrl options for injecting "scoped" styles. See directive-helpers.js
     */
    module.factory('ezComponent', ['$injector', 'ezComponentHelpers', function ($injector, ch) {

        var CNTRL_REG = /^(\S+)(\s+as\s+([\w$]+))?$/;
        function identifierForController(controller, ident) {
            if (ident && angular.isString(ident)) {
                return ident;
            }
            if (angular.isString(controller)) {
                var match = CNTRL_REG.exec(controller);
                if (match) {
                    return match[3];
                }
            }
        }

        return function (options) {
            var controller = options.controller || function() {},
                template = (!options.template && !options.templateUrl ? '' : options.template);

            function makeInjectable(fn) {
                if (angular.isFunction(fn) || angular.isArray(fn)) {
                    return function(tElement, tAttrs) {
                        return $injector.invoke(fn, this, {$element: tElement, $attrs: tAttrs});
                    };
                } else {
                    return fn;
                }
            }

            return {
                controller: controller,
                controllerAs: identifierForController(options.controller) || options.controllerAs || '$ctrl',
                template: makeInjectable(template),
                templateUrl: makeInjectable(options.templateUrl),
                transclude: options.transclude,
                scope: {},
                bindToController: options.bindings || {},
                restrict: 'E',
                require: options.require,
                compile: function (tElement, tAttrs) {
                    if (options.styles) {
                        ch(null, tElement).useStyles(options.styles);
                    } else if (options.stylesUrl) {
                        ch(null, tElement).useStylesUrl(options.stylesUrl);
                    }
                    if (options.compile) {
                        options.compile.apply(this, arguments);
                    }
                }
            };

        };

    }]);
}(angular.module('ezNg')));

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

/*!
 * <style scoped> shim
 * http://github.com/richtr
 *
 * Copyright 2012 Rich Tibbett
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date: 8th November 2012
 */

/*
 * DESCRIPTION:
 * ------------
 *
 * Javascript shim for <style scoped> elements.
 *
 * Reference specification ->
 *
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/semantics.html#attr-style-scoped
 *
 * Demo page ->
 *
 * http://fiddle.jshell.net/RZ99U/1/show/light/
 *
 * USAGE:
 * ------
 *
 * 1. Add this file anywhere in your web page (outside of any load event handlers):
 *
 * <script type="text/javascript" src="style_scoped_shim.js"></script>
 *
 *
 * 2. Use <style scoped> elements as normal
 *
 * See the test page linked above for a live example.
 *
 */

(function() {

    document.addEventListener('DOMContentLoaded', function() {

        // Don't run if the UA implicitly supports <style scoped>
        var testEl = document.createElement("style");
        if (testEl.scoped !== undefined && testEl.scoped !== null) return;

        var rewriteCSS = function(el) {

            el._scopedStyleApplied = true;

            var elName = "scopedstylewrapper";
            var elId = "s" + (Math.floor(Math.random() * 1e15) + 1);
            var uid = "." + elId;

            // Wrap a custom HTML container around style[scoped]'s parent node
            var container = el.parentNode;
            if(container == document.body) {
                uid = "body"; // scope CSS rules to <body>
            } else {
                var parent = container.parentNode;
                var wrapper = document.createElement(elName);
                wrapper.className = elId;
                parent.replaceChild(wrapper, container);
                wrapper.appendChild(container);
            }

            // Prefix all CSS rules with uid
            var rewrittenCSS = el.textContent.replace(/(((?:(?:[^,{]+),?)*?)\{(?:([^}:]*):?([^};]*);?)*?\};*)/img, uid + " $1");

            // <style scoped> @-directives rules from WHATWG specification

            // Remove added uid prefix from all CSS @-directives commands
            // since we have no way of scoping @-directives yet
            // e.g. .scopingClass @font-face { ... } does not currently work :(
            rewrittenCSS = rewrittenCSS.replace(new RegExp(uid + "\\s+(@[\\w|-]+)" , 'img'), "$1");
            // Remove @global (to make the @global CSS rule work globally)
            rewrittenCSS = rewrittenCSS.replace("@global", "");
            // Ignore @page directives (not allowed in <style scoped>)
            rewrittenCSS = rewrittenCSS.replace("@page", ".notAllowedInScopedCSS @page");

            el.textContent = rewrittenCSS;
        };

        var extractScopedStyles = function( root ) {
            // Obtain style[scoped] elements from page
            if(root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE)
                return;
            var els = root.querySelectorAll('style[scoped]');
            for (var i = 0, l = els.length; i < l; i++) {
                if(!els[i]._scopedStyleApplied)
                    rewriteCSS(els[i]);
            }
        };

        // Process scoped stylesheets from current page
        extractScopedStyles(document);

        // Listen for scoped stylesheet injection
        document.addEventListener('DOMNodeInserted', function(e) {
            var el = e.target;
            if (el.tagName === "STYLE" && (el.getAttribute("scoped") !== undefined &&
                el.getAttribute("scoped") !== null) && !el._scopedStyleApplied) {
                rewriteCSS(el);
            }
            // Process nested style[scope] elements (if any)
            extractScopedStyles(el);
        }, false);

    }, false);

}());

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

/*global angular:false*/
(function (module) {
    'use strict';

    module.factory('ezFormatter', [function () {

        var factory = {},
            assocCapture = new RegExp('\\{(.*?)\\}', 'g');

        function zip(arr1, arr2) {
            var newArr = [];
            while (arr1.length && arr2.length) {
                newArr.push(arr1.shift());
                newArr.push(arr2.shift());
            }
            return newArr.concat(arr1).concat(arr2);
        }

        factory.index = function () {
            return function (/*format, replacements...*/) {
                var args = Array.prototype.slice.call(arguments),
                    format = args.shift(),
                    segments = format.split('{}');

                return zip(segments, args).join('');
            };
        };

        factory.assoc = function () {
            return function replace(format, replacements) {
                var captures = format.match(assocCapture);

                if (!captures || !captures.length) {
                    return format;
                }

                replacements = replacements || {};

                angular.forEach(captures, function (capture) {
                    var key = capture.substring(1, capture.length-1),
                        value = replacements[key];

                    format = format.replace(capture, value);
                });

                return replace(format, replacements);
            };
        };

        return factory;

    }]);

}(angular.module('ezNg')));
