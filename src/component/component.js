/* global angular: false */
(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @name module:ezNg.ezComponent
     *
     * @function
     * @param {object} options Options to pass into directive definition
     *
     * @description
     * Shim for angular 1.5's component service (copied from AngularJs source)
     * https://github.com/angular/angular.js/blob/master/src/ng/compile.js
     *
     * See [Angular's Component documentation](https://docs.angularjs.org/api/ng/provider/$compileProvider#component)
     * for all options.
     *
     * Additionally provides styles and stylesUrl options for injecting "scoped" styles. See component-helpers.js
     *
     * Does not support the one-way binding operator ('<') in versions < 1.5
     *
     * @example
     * ```js
     * module.directive('myComponent', ['ezComponent', function (ezComponent) {
     *
     *     return ezComponent({
     *         bindings: {
     *             watched: '=',
     *             input: '@',
     *             output: '&'
     *         },
     *         styles: '.my-component { color: red; }',
     *         //OR
     *         stylesUrl: 'components/my-component/my-component.css'
     *     });
     *
     * }]);
     * ```
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
