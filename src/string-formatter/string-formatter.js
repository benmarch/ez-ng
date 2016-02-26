/*global angular:false*/
(function (module) {
    'use strict';

    /**
     * @ngdoc service
     * @kind service
     * @name module:ezNg.ezFormatter
     *
     * @description
     * Provides a simple, easy-to-use string formatter to avoid long string concatenations.
     *
     * There are two types of formatters: associative and indexed.
     *
     */
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

        /**
         * @name module:ezNg.ezFormatter~formatFunction
         * @alias formatFunction
         * @function
         *
         * @param {string} placeholders A string containing placeholders to replace
         * @param {array|object} replacements An array for indexed formatters, object for associative formatters
         *      containing replacement values for placeholders
         *
         * @returns {string} Formatted string with placeholders replaced.
         */

        /**
         * @ngdoc method
         * @name module:ezNg.ezFormatter#index
         * @method
         *
         * @description
         * Factory function to return an indexed formatter.
         *
         * The indexed formatter takes a string with unnamed placeholders, and an array whose elements replace each
         * unnamed placeholder in the order that they occur.
         *
         * @example
         * ```js
         * let format = ezFormatter.index(),
         *     placeholder = '{} on {}: {} star(s)!';
         *
         * console.log(format(placeholder, ['Narcos', 'Netflix', 5])); //Narcos on Netflix: 5 star(s)!
         * ```
         *
         * @returns {module:ezNg.ezFormatter~formatFunction} Formatter
         */
        factory.index = function () {
            return function (/*format, replacements...*/) {
                var args = Array.prototype.slice.call(arguments),
                    format = args.shift(),
                    segments = format.split('{}');

                return zip(segments, args).join('');
            };
        };


        /**
         * @ngdoc method
         * @name module:ezNg.ezFormatter#assoc
         * @method
         *
         * @description
         * Factory function to return an associative formatter.
         *
         * The associative formatter takes a string with named placeholders, and an object whose keys are the names
         * of the placeholders and value are the replacement values.
         *
         * @example
         * ```js
         * let format = ezFormatter.assoc(),
         *     placeholder = '{title} on {channel}: {rating} star(s)!';
         *
         * console.log(format(placeholder, {title: 'Narcos', channel: 'Netflix', rating: 5})); //Narcos on Netflix: 5 star(s)!
         * ```
         * @returns {module:ezNg.ezFormatter~formatFunction} Formatter
         */
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
