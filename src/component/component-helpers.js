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

            return helpers

        }

    }]);

}(angular.module('ezNg')));
