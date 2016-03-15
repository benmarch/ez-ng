/* global angular:false */
(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @kind service
     * @name module:ezNg.ezComponentHelpers
     *
     * @description
     * Provides a few functions that can be used with directives to provide easy access to templates and styles.
     * Use in a directive's link function or component's controller. The factory function takes the same arguments
     * as a link function.
     *
     * @example
     * ```js
     * //in a link function:
     * //...
     * link: function (scope, element, attrs, ctrl, transclude) {
     *     let ch = ezComponentHelpers.apply(null, arguments); //or just invoke directly like ezComponentHelpers(scope, element...)
     *
     *     ch.useTemplate('<span>Hello, World!</span');
     * }
     * //...
     *
     * //in a controller:
     * //...
     * controller: ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {
     *     let ch = ezComponentHelpers($scope, $element, $attrs, this, $transclude);
     *
     *     ch.useTemplate('<span>Hello, World!</span');
     * }
     * //...
     * ```
     */
    module.factory('ezComponentHelpers', ['$http', '$templateCache', '$compile', '$document', '$window', function ($http, $templateCache, $compile, $document, $window) {

        var scopedStyleSequence = 10000,
            styleNode = $document[0].createElement('style');

        styleNode.type = 'text/css';
        (document.head || document.getElementsByTagName('head')[0]).appendChild(styleNode);

        return function (scope, element, attrs, ctrl, transclude) {

            var helpers = {};

            /**
             * @ngdoc method
             * @name module:ezNg.ezComponentHelpers#useTemplate
             * @method
             *
             * @description
             * Takes a HTML template string and replaces the contents of element with a compiled and linked DOM tree
             *
             * @example
             * ```js
             * let ch = ezComponentHelpers.apply(null, arguments);
             *
             * ch.useTemplate('<span>Hello, World!</span>');
             * ```
             *
             * ```html
             * <!-- Result: -->
             * <my-component>
             *     <span>Hello, World!</span>
             * </my-component>
             * ```
             */
            helpers.useTemplate = function (template) {
                var newElement = $compile(template, transclude)(scope);

                element.empty();
                element.append(newElement);
            };

            /**
             * @ngdoc method
             * @name module:ezNg.ezComponentHelpers#useTemplateUrl
             * @method
             *
             * @description
             * Takes a URL that resolves to a HTML template string and replaces the contents of element with a compiled and linked DOM tree.
             * The result is the same as using {@link module:ezNg.ezComponentHelpers#useTemplate} but does not require and inline template.
             *
             * @example
             * ```js
             * let ch = ezComponentHelpers.apply(null, arguments);
             *
             * ch.useTemplateUrl('/components/my-component/template.html'); //<span>Hello, World!</span>
             * ```
             *
             * ```html
             * <!-- Result: -->
             * <my-component>
             *     <span>Hello, World!</span>
             * </my-component>
             * ```
             *
             * @returns {Promise} Resolves after contents have been compile, linked, and appended to the element
             */
            helpers.useTemplateUrl = function (url) {
                return $http.get(url, {
                    cache: $templateCache
                }).success(function (template) {
                    helpers.useTemplate(template);
                });
            };

            /**
             * @ngdoc method
             * @name module:ezNg.ezComponentHelpers#useStyles
             * @method
             *
             * @description
             * Takes a string of CSS styles and adds them to the element. The styles become scoped to the element
             * thanks to a fantastic script by Thomas Park (https://github.com/thomaspark/scoper). Note that the element itself
             * will also be affected by the scoped styles. Styles are applied after a browser event cycle.
             *
             * @example
             * ```js
             * let ch = ezComponentHelpers.apply(null, arguments);
             *
             * ch.useStyles('.my-class { color: red; }');
             * ```
             *
             * ```html
             * <!-- Result: -->
             * <span class="my-class">This text is black</span>
             * <my-component>
             *     <span class="my-class">This text is red</span>
             * </my-component>
             * ```
             */
            helpers.useStyles = function (styles) {
                var el = styleNode,
                    wrapper = angular.element($document[0].createElement('span')),
                    id = 'scoper-' + scopedStyleSequence++;

                wrapper[0].id = id;
                element.after(wrapper);
                wrapper.append(element);

                styles = $window.scoper(styles, '#' + id);
                /*el.type = 'text/css';
                el.scoped = true;
                el.setAttribute('scoped', 'scoped');*/
                if (el.styleSheet){
                    el.styleSheet.cssText += styles;
                } else {
                    el.appendChild($document[0].createTextNode(styles));
                }
            };

            /**
             * @ngdoc method
             * @name module:ezNg.ezComponentHelpers#useStylesUrl
             * @method
             *
             * @description
             * Takes a URL that resolves to CSS styles and adds them to the element. The results are the same as
             * {@link module:ezNg.ezComponentHelpers#useStyles}.
             *
             * @example
             * ```js
             * let ch = ezComponentHelpers.apply(null, arguments);
             *
             * ch.useStylesUrl('/components/my-component/styles.css'); //.my-class { color: red; }
             * ```
             *
             * ```html
             * <!-- Result: -->
             * <span class="my-class">This text is black</span>
             * <my-component>
             *     <span class="my-class">This text is red</span>
             * </my-component>
             * ```
             *
             * @returns {Promise} resolves after styles have been added but before they have been applied
             */
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
