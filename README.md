# ez-ng
[![Build Status][build-image]][build-url]
[![Code GPA][gpa-image]][gpa-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Bower Version][bower-image]][bower-url]
[![NPM version][npm-image]][npm-url]
[![IRC Channel][irc-image]][irc-url]
[![Gitter][gitter-image]][gitter-url]
[![GitTip][tip-image]][tip-url]

## Getting Started

Install with Bower:

```js
bower install ez-ng --save
```
    
Install with NPM:

```js
npm install ez-ng --save
```    
    
Include the module:

```js
angular.module('myApp', ['ezNg']);
```

## API Reference

## Modules

<dl>
<dt><a href="#module_ezNg">ezNg</a></dt>
<dd><p>A collection of very simple utilities that make developing AngularJS apps much easier.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#LogLevel">LogLevel</a> : <code>enum</code></dt>
<dd></dd>
</dl>

<a name="module_ezNg"></a>
## ezNg
A collection of very simple utilities that make developing AngularJS apps much easier.

**Ngdoc**: module  

* [ezNg](#module_ezNg)
    * [.ezComponentHelpers](#module_ezNg.ezComponentHelpers)
        * [.useTemplate()](#module_ezNg.ezComponentHelpers+useTemplate)
        * [.useTemplateUrl()](#module_ezNg.ezComponentHelpers+useTemplateUrl) ⇒ <code>Promise</code>
        * [.useStyles()](#module_ezNg.ezComponentHelpers+useStyles)
        * [.useStylesUrl()](#module_ezNg.ezComponentHelpers+useStylesUrl) ⇒ <code>Promise</code>
    * [.ezEventEmitter](#module_ezNg.ezEventEmitter)
        * _instance_
            * [.create([name])](#module_ezNg.ezEventEmitter+create) ⇒ <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>
            * [.mixin(object, [name])](#module_ezNg.ezEventEmitter+mixin) ⇒ <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>
            * [.debug()](#module_ezNg.ezEventEmitter+debug)
        * _inner_
            * [~EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)
                * [.on(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+on)
                * [.once(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+once)
                * [.off(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+off)
                * [.emit(eventName, ...arguments)](#module_ezNg.ezEventEmitter..EventEmitter+emit)
    * [.ezLogger](#module_ezNg.ezLogger)
        * _instance_
            * [.create()](#module_ezNg.ezLogger+create) ⇒ <code>[Logger](#module_ezNg.ezLogger..Logger)</code>
        * _inner_
            * [~Logger](#module_ezNg.ezLogger..Logger)
                * [.setFormat(format)](#module_ezNg.ezLogger..Logger+setFormat)
                * [.setFormat(formatter)](#module_ezNg.ezLogger..Logger+setFormat)
                * [.setFormat(level)](#module_ezNg.ezLogger..Logger+setFormat)
    * [.ezFormatter](#module_ezNg.ezFormatter)
        * _instance_
            * [.index()](#module_ezNg.ezFormatter+index) ⇒ <code>[formatFunction](#module_ezNg.ezFormatter..formatFunction)</code>
            * [.assoc()](#module_ezNg.ezFormatter+assoc) ⇒ <code>[formatFunction](#module_ezNg.ezFormatter..formatFunction)</code>
        * _inner_
            * [~formatFunction(placeholders, replacements)](#module_ezNg.ezFormatter..formatFunction) ⇒ <code>string</code>
    * [.ezLoggerLevel](#module_ezNg.ezLoggerLevel) : <code>[LogLevel](#LogLevel)</code>
    * [.ezLoggerFormat](#module_ezNg.ezLoggerFormat) : <code>string</code>
    * [.ezLoggerDateTimeFormatter](#module_ezNg.ezLoggerDateTimeFormatter) : <code>function</code>
    * [.ezComponent(options)](#module_ezNg.ezComponent)

<a name="module_ezNg.ezComponentHelpers"></a>
### ezNg.ezComponentHelpers
Provides a few functions that can be used with directives to provide easy access to templates and styles.
Use in a directive's link function or component's controller. The factory function takes the same arguments
as a link function.

**Kind**: static service of <code>[ezNg](#module_ezNg)</code>  
**Ngdoc**: service  
**Example**  
```js
//in a link function:
//...
link: function (scope, element, attrs, ctrl, transclude) {
    let ch = ezComponentHelpers.apply(null, arguments); //or just invoke directly like ezComponentHelpers(scope, element...)

    ch.useTemplate('<span>Hello, World!</span');
}
//...

//in a controller:
//...
controller: ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {
    let ch = ezComponentHelpers($scope, $element, $attrs, this, $transclude);

    ch.useTemplate('<span>Hello, World!</span');
}
//...
```

* [.ezComponentHelpers](#module_ezNg.ezComponentHelpers)
    * [.useTemplate()](#module_ezNg.ezComponentHelpers+useTemplate)
    * [.useTemplateUrl()](#module_ezNg.ezComponentHelpers+useTemplateUrl) ⇒ <code>Promise</code>
    * [.useStyles()](#module_ezNg.ezComponentHelpers+useStyles)
    * [.useStylesUrl()](#module_ezNg.ezComponentHelpers+useStylesUrl) ⇒ <code>Promise</code>

<a name="module_ezNg.ezComponentHelpers+useTemplate"></a>
#### ezComponentHelpers.useTemplate()
Takes a HTML template string and replaces the contents of element with a compiled and linked DOM tree

**Kind**: instance method of <code>[ezComponentHelpers](#module_ezNg.ezComponentHelpers)</code>  
**Ngdoc**: method  
**Example**  
```js
let ch = ezComponentHelpers.apply(null, arguments);

ch.useTemplate('<span>Hello, World!</span>');
```

```html
<!-- Result: -->
<my-component>
    <span>Hello, World!</span>
</my-component>
```
<a name="module_ezNg.ezComponentHelpers+useTemplateUrl"></a>
#### ezComponentHelpers.useTemplateUrl() ⇒ <code>Promise</code>
Takes a URL that resolves to a HTML template string and replaces the contents of element with a compiled and linked DOM tree.
The result is the same as using [useTemplate](#module_ezNg.ezComponentHelpers+useTemplate) but does not require and inline template.

**Kind**: instance method of <code>[ezComponentHelpers](#module_ezNg.ezComponentHelpers)</code>  
**Returns**: <code>Promise</code> - Resolves after contents have been compile, linked, and appended to the element  
**Ngdoc**: method  
**Example**  
```js
let ch = ezComponentHelpers.apply(null, arguments);

ch.useTemplateUrl('/components/my-component/template.html'); //<span>Hello, World!</span>
```

```html
<!-- Result: -->
<my-component>
    <span>Hello, World!</span>
</my-component>
```
<a name="module_ezNg.ezComponentHelpers+useStyles"></a>
#### ezComponentHelpers.useStyles()
Takes a string of CSS styles and adds them to the element. The styles become scoped to the element
thanks to a fantastic script by Thomas Park (https://github.com/thomaspark/scoper). Note that the element itself
will also be affected by the scoped styles. Styles are applied after a browser event cycle.

**Kind**: instance method of <code>[ezComponentHelpers](#module_ezNg.ezComponentHelpers)</code>  
**Ngdoc**: method  
**Example**  
```js
let ch = ezComponentHelpers.apply(null, arguments);

ch.useStyles('.my-class { color: red; }');
```

```html
<!-- Result: -->
<span class="my-class">This text is black</span>
<my-component>
    <span class="my-class">This text is red</span>
</my-component>
```
<a name="module_ezNg.ezComponentHelpers+useStylesUrl"></a>
#### ezComponentHelpers.useStylesUrl() ⇒ <code>Promise</code>
Takes a URL that resolves to CSS styles and adds them to the element. The results are the same as
[useStyles](#module_ezNg.ezComponentHelpers+useStyles).

**Kind**: instance method of <code>[ezComponentHelpers](#module_ezNg.ezComponentHelpers)</code>  
**Returns**: <code>Promise</code> - resolves after styles have been added but before they have been applied  
**Ngdoc**: method  
**Example**  
```js
let ch = ezComponentHelpers.apply(null, arguments);

ch.useStylesUrl('/components/my-component/styles.css'); //.my-class { color: red; }
```

```html
<!-- Result: -->
<span class="my-class">This text is black</span>
<my-component>
    <span class="my-class">This text is red</span>
</my-component>
```
<a name="module_ezNg.ezEventEmitter"></a>
### ezNg.ezEventEmitter
Provides a simple event emitter that is *not* hooked into the Scope digest cycle.

**Kind**: static service of <code>[ezNg](#module_ezNg)</code>  
**Ngdoc**: service  

* [.ezEventEmitter](#module_ezNg.ezEventEmitter)
    * _instance_
        * [.create([name])](#module_ezNg.ezEventEmitter+create) ⇒ <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>
        * [.mixin(object, [name])](#module_ezNg.ezEventEmitter+mixin) ⇒ <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>
        * [.debug()](#module_ezNg.ezEventEmitter+debug)
    * _inner_
        * [~EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)
            * [.on(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+on)
            * [.once(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+once)
            * [.off(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+off)
            * [.emit(eventName, ...arguments)](#module_ezNg.ezEventEmitter..EventEmitter+emit)

<a name="module_ezNg.ezEventEmitter+create"></a>
#### ezEventEmitter.create([name]) ⇒ <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>
Returns a new event emitter with the provided name

**Kind**: instance method of <code>[ezEventEmitter](#module_ezNg.ezEventEmitter)</code>  
**Ngdoc**: method  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>string</code> | Optional name for debugging purposes |

**Example**  
```js
let emitter = ezEventEmitter.create('myEmitter');
```
<a name="module_ezNg.ezEventEmitter+mixin"></a>
#### ezEventEmitter.mixin(object, [name]) ⇒ <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>
Returns a new event emitter with the provided name

**Kind**: instance method of <code>[ezEventEmitter](#module_ezNg.ezEventEmitter)</code>  
**Ngdoc**: method  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to extend with [EventEmitter](EventEmitter) characteristics |
| [name] | <code>string</code> | Optional name for debugging purposes |

**Example**  
```js
let myObject = {},
    emitter = ezEventEmitter.mixin(myObject, 'myEmitter');

myObject.on('myEvent', function () {});
myObject.emit('myEvent');
```
<a name="module_ezNg.ezEventEmitter+debug"></a>
#### ezEventEmitter.debug()
Put ezEventEmitter into debug mode. This will cause all actions
to be logged to the console for easy debugging.

**Kind**: instance method of <code>[ezEventEmitter](#module_ezNg.ezEventEmitter)</code>  
**Ngdoc**: method  
**Example**  
```js
let emitter = ezEventEmitter.create('myEmitter');
ezEventEmitter.debug();

emitter.emit('hello'); //"Emitted event hello with emitter myEmitter. Invoked 0 handlers."
```
<a name="module_ezNg.ezEventEmitter..EventEmitter"></a>
#### ezEventEmitter~EventEmitter
Describes a simple event emitter

**Kind**: inner interface of <code>[ezEventEmitter](#module_ezNg.ezEventEmitter)</code>  

* [~EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)
    * [.on(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+on)
    * [.once(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+once)
    * [.off(events, handler)](#module_ezNg.ezEventEmitter..EventEmitter+off)
    * [.emit(eventName, ...arguments)](#module_ezNg.ezEventEmitter..EventEmitter+emit)

<a name="module_ezNg.ezEventEmitter..EventEmitter+on"></a>
##### eventEmitter.on(events, handler)
Registers a listener for a specific event or multiple events

**Kind**: instance method of <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| events | <code>string</code> | Space-separated of events to listen for |
| handler | <code>function</code> | Function to invoke when event is triggered |

**Example**  
```js
let emitter = ezEventEmitter.create();

emitter.on('someEvent', function (arg1, arg2) {
    console.log(arg1); //hello
    console.log(arg2); //world
});

emitter.emit('someEvent', 'hello', 'world');
```
<a name="module_ezNg.ezEventEmitter..EventEmitter+once"></a>
##### eventEmitter.once(events, handler)
Registers a listener for a specific event or multiple events, and immediately cancels the listener
after it is invoked the first time

**Kind**: instance method of <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| events | <code>string</code> | Space-separated of events to listen for |
| handler | <code>function</code> | Function to invoke when event is triggered for the first time |

**Example**  
```js
let emitter = ezEventEmitter.create(),
    count = 0;

emitter.once('inc', function () {
    console.log('Current count: ' + (++count));
});

emitter.emit('inc'); // Current count: 1
emitter.emit('inc'); //
```
<a name="module_ezNg.ezEventEmitter..EventEmitter+off"></a>
##### eventEmitter.off(events, handler)
Cancels listeners for specified event(s)

**Kind**: instance method of <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| events | <code>string</code> | Space-separated of events to remove listeners for |
| handler | <code>function</code> | Reference to listener to cancel |

**Example**  
```js
let emitter = ezEventEmitter.create(),
    count = 0,
    increment = function () {
       console.log('Current count: ' + (++count));
    };

emitter.on('inc', increment);

emitter.emit('inc'); // Current count: 1
emitter.emit('inc'); // Current count: 2
emitter.off('inc', increment);
emitter.emit('inc'); //
```
<a name="module_ezNg.ezEventEmitter..EventEmitter+emit"></a>
##### eventEmitter.emit(eventName, ...arguments)
Triggers specified event with provided arguments

**Kind**: instance method of <code>[EventEmitter](#module_ezNg.ezEventEmitter..EventEmitter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | Name of event to trigger |
| ...arguments | <code>any</code> | Arguments to pass to handlers |

**Example**  
```js
let emitter = ezEventEmitter.create();

emitter.on('someEvent', function (arg1, arg2) {
    console.log(arg1); //hello
    console.log(arg2); //world
});

emitter.emit('someEvent', 'hello', 'world');
```
<a name="module_ezNg.ezLogger"></a>
### ezNg.ezLogger
Provides a simple abstraction of $log that provides output formatting and level thresholds

**Kind**: static service of <code>[ezNg](#module_ezNg)</code>  
**Ngdoc**: service  

* [.ezLogger](#module_ezNg.ezLogger)
    * _instance_
        * [.create()](#module_ezNg.ezLogger+create) ⇒ <code>[Logger](#module_ezNg.ezLogger..Logger)</code>
    * _inner_
        * [~Logger](#module_ezNg.ezLogger..Logger)
            * [.setFormat(format)](#module_ezNg.ezLogger..Logger+setFormat)
            * [.setFormat(formatter)](#module_ezNg.ezLogger..Logger+setFormat)
            * [.setFormat(level)](#module_ezNg.ezLogger..Logger+setFormat)

<a name="module_ezNg.ezLogger+create"></a>
#### ezLogger.create() ⇒ <code>[Logger](#module_ezNg.ezLogger..Logger)</code>
Factory function for creating a new logger with an optional name

**Kind**: instance method of <code>[ezLogger](#module_ezNg.ezLogger)</code>  
**Ngdoc**: method  
<a name="module_ezNg.ezLogger..Logger"></a>
#### ezLogger~Logger
**Kind**: inner property of <code>[ezLogger](#module_ezNg.ezLogger)</code>  

* [~Logger](#module_ezNg.ezLogger..Logger)
    * [.setFormat(format)](#module_ezNg.ezLogger..Logger+setFormat)
    * [.setFormat(formatter)](#module_ezNg.ezLogger..Logger+setFormat)
    * [.setFormat(level)](#module_ezNg.ezLogger..Logger+setFormat)

<a name="module_ezNg.ezLogger..Logger+setFormat"></a>
##### logger.setFormat(format)
Sets the log message format for this logger. See [ezLoggerLevel](#module_ezNg.ezLoggerLevel)

**Kind**: instance method of <code>[Logger](#module_ezNg.ezLogger..Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| format | <code>string</code> | String containing placeholders for log message properties |

<a name="module_ezNg.ezLogger..Logger+setFormat"></a>
##### logger.setFormat(formatter)
Sets the output format of date and time for this logger. See [ezLoggerDateTimeFormatter](#module_ezNg.ezLoggerDateTimeFormatter)

**Kind**: instance method of <code>[Logger](#module_ezNg.ezLogger..Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| formatter | <code>function</code> | Function takes the current date (new Date()) and returns a string. |

<a name="module_ezNg.ezLogger..Logger+setFormat"></a>
##### logger.setFormat(level)
Sets the log level for this logger.

**Kind**: instance method of <code>[Logger](#module_ezNg.ezLogger..Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>[LogLevel](#LogLevel)</code> | Threshold log level. See [ezLoggerLevel](#module_ezNg.ezLoggerLevel) |

<a name="module_ezNg.ezFormatter"></a>
### ezNg.ezFormatter
Provides a simple, easy-to-use string formatter to avoid long string concatenations.

There are two types of formatters: associative and indexed.

**Kind**: static service of <code>[ezNg](#module_ezNg)</code>  
**Ngdoc**: service  

* [.ezFormatter](#module_ezNg.ezFormatter)
    * _instance_
        * [.index()](#module_ezNg.ezFormatter+index) ⇒ <code>[formatFunction](#module_ezNg.ezFormatter..formatFunction)</code>
        * [.assoc()](#module_ezNg.ezFormatter+assoc) ⇒ <code>[formatFunction](#module_ezNg.ezFormatter..formatFunction)</code>
    * _inner_
        * [~formatFunction(placeholders, replacements)](#module_ezNg.ezFormatter..formatFunction) ⇒ <code>string</code>

<a name="module_ezNg.ezFormatter+index"></a>
#### ezFormatter.index() ⇒ <code>[formatFunction](#module_ezNg.ezFormatter..formatFunction)</code>
Factory function to return an indexed formatter.

The indexed formatter takes a string with unnamed placeholders, and an array whose elements replace each
unnamed placeholder in the order that they occur.

**Kind**: instance method of <code>[ezFormatter](#module_ezNg.ezFormatter)</code>  
**Returns**: <code>[formatFunction](#module_ezNg.ezFormatter..formatFunction)</code> - Formatter  
**Ngdoc**: method  
**Example**  
```js
let format = ezFormatter.index(),
    placeholder = '{} on {}: {} star(s)!';

console.log(format(placeholder, ['Narcos', 'Netflix', 5])); //Narcos on Netflix: 5 star(s)!
```
<a name="module_ezNg.ezFormatter+assoc"></a>
#### ezFormatter.assoc() ⇒ <code>[formatFunction](#module_ezNg.ezFormatter..formatFunction)</code>
Factory function to return an associative formatter.

The associative formatter takes a string with named placeholders, and an object whose keys are the names
of the placeholders and value are the replacement values.

**Kind**: instance method of <code>[ezFormatter](#module_ezNg.ezFormatter)</code>  
**Returns**: <code>[formatFunction](#module_ezNg.ezFormatter..formatFunction)</code> - Formatter  
**Ngdoc**: method  
**Example**  
```js
let format = ezFormatter.assoc(),
    placeholder = '{title} on {channel}: {rating} star(s)!';

console.log(format(placeholder, {title: 'Narcos', channel: 'Netflix', rating: 5})); //Narcos on Netflix: 5 star(s)!
```
<a name="module_ezNg.ezFormatter..formatFunction"></a>
#### ezFormatter~formatFunction(placeholders, replacements) ⇒ <code>string</code>
**Kind**: inner method of <code>[ezFormatter](#module_ezNg.ezFormatter)</code>  
**Returns**: <code>string</code> - Formatted string with placeholders replaced.  

| Param | Type | Description |
| --- | --- | --- |
| placeholders | <code>string</code> | A string containing placeholders to replace |
| replacements | <code>array</code> &#124; <code>object</code> | An array for indexed formatters, object for associative formatters      containing replacement values for placeholders |

<a name="module_ezNg.ezLoggerLevel"></a>
### ezNg.ezLoggerLevel : <code>[LogLevel](#LogLevel)</code>
Sets the log level for ezLogger

**Kind**: static property of <code>[ezNg](#module_ezNg)</code>  
**Default**: <code>&#x27;DEBUG&#x27;</code>  
**Ngdoc**: value  
<a name="module_ezNg.ezLoggerFormat"></a>
### ezNg.ezLoggerFormat : <code>string</code>
Sets the output format of log statements

**Kind**: static property of <code>[ezNg](#module_ezNg)</code>  
**Default**: <code>&quot;&#x27;{dateTime}\\t{name}\\t{level}\\t{message}&#x27;&quot;</code>  
**Ngdoc**: value  
<a name="module_ezNg.ezLoggerDateTimeFormatter"></a>
### ezNg.ezLoggerDateTimeFormatter : <code>function</code>
Sets the output format of date and time. Function takes the current date (new Date()) and returns a string.

**Kind**: static property of <code>[ezNg](#module_ezNg)</code>  
**Default**: <code>date.toString();</code>  
**Ngdoc**: value  
<a name="module_ezNg.ezComponent"></a>
### ezNg.ezComponent(options)
Shim for angular 1.5's component service (copied from AngularJs source)
https://github.com/angular/angular.js/blob/master/src/ng/compile.js

See [Angular's Component documentation](https://docs.angularjs.org/api/ng/provider/$compileProvider#component)
for all options.

Additionally provides styles and stylesUrl options for injecting "scoped" styles. See component-helpers.js

Does not support the one-way binding operator ('<') in versions < 1.5

**Kind**: static method of <code>[ezNg](#module_ezNg)</code>  
**Ngdoc**: service  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options to pass into directive definition |

**Example**  
```js
module.directive('myComponent', ['ezComponent', function (ezComponent) {

    return ezComponent({
        bindings: {
            watched: '=',
            input: '@',
            output: '&'
        },
        styles: '.my-component { color: red; }',
        //OR
        stylesUrl: 'components/my-component/my-component.css'
    });

}]);
```
<a name="LogLevel"></a>
## LogLevel : <code>enum</code>
**Kind**: global enum  
**Properties**

| Name |
| --- |
| TRACE | 
| DEBUG | 
| INFO | 
| WARN | 
| ERROR | 
| FATAL | 



## License

(The MIT License)

Copyright (c) 2015  

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[build-url]: https://travis-ci.org/benmarch/ez-ng
[build-image]: http://img.shields.io/travis/benmarch/ez-ng.png

[gpa-url]: https://codeclimate.com/github/benmarch/ez-ng
[gpa-image]: https://codeclimate.com/github/benmarch/ez-ng.png

[coverage-url]: https://codeclimate.com/github/benmarch/ez-ng/code?sort=covered_percent&sort_direction=desc
[coverage-image]: https://codeclimate.com/github/benmarch/ez-ng/coverage.png

[depstat-url]: https://david-dm.org/benmarch/ez-ng
[depstat-image]: https://david-dm.org/benmarch/ez-ng.png?theme=shields.io

[issues-url]: https://github.com/benmarch/ez-ng/issues
[issues-image]: http://img.shields.io/github/issues/benmarch/ez-ng.png

[bower-url]: http://bower.io/search/?q=ez-ng
[bower-image]: https://badge.fury.io/bo/ez-ng.png

[downloads-url]: https://www.npmjs.org/package/ez-ng
[downloads-image]: http://img.shields.io/npm/dm/ez-ng.png

[npm-url]: https://www.npmjs.org/package/ez-ng
[npm-image]: https://badge.fury.io/js/ez-ng.png

[irc-url]: http://webchat.freenode.net/?channels=ez-ng
[irc-image]: http://img.shields.io/badge/irc-%23ez-ng-brightgreen.png

[gitter-url]: https://gitter.im/benmarch/ez-ng
[gitter-image]: http://img.shields.io/badge/gitter-benmarch/ez-ng-brightgreen.png

[tip-url]: https://www.gittip.com/benmarch
[tip-image]: http://img.shields.io/gittip/benmarch.png
