/*global jasmine:false, describe:false, it:false, beforeEach: false, module: false, inject: false*/
'use strict';

describe('ezFormatter', function () {

    var ezFormatter;

    beforeEach(module('ezNg'));

    beforeEach(inject(function (_ezFormatter_) {
        ezFormatter = _ezFormatter_;
    }));

   describe('index-based formatter', function () {

       var format;

       beforeEach(function () {
           format = ezFormatter.index();
       });

       it('should replace placeholders with correct values', function () {
           //given
           var placeholder = 'Hello, my name is {} and I am a {}.';

           //when
           var formatted = format(placeholder, 'Ben', 'chemist');

           //then
           expect(formatted).toBe('Hello, my name is Ben and I am a chemist.');
       });

       it('should tack on extra values', function () {
           //given
           var placeholder = 'Hello, my name is {} and I am a {}.';

           //when
           var formatted = format(placeholder, 'Ben', 'chemist', 'foo', 'bar');

           //then
           expect(formatted).toBe('Hello, my name is Ben and I am a chemist.foobar');
       });

       it('should work when first token should be replaced', function () {
           //given
           var placeholder = '{} said {} is a {}.';

           //when
           var formatted = format(placeholder, 'Ben', 'he', 'chemist');

           //then
           expect(formatted).toBe('Ben said he is a chemist.');
       });

   });

   describe('association-based formatter', function () {
       var format;

       beforeEach(function () {
           format = ezFormatter.assoc();
       });

       it('should replace placeholders with correct values', function () {
           //given
           var placeholder = 'Hello, my name is {name} and I am a {occupation}.';

           //when
           var formatted = format(placeholder, {
               name: 'Ben',
               occupation: 'chemist'
           });

           //then
           expect(formatted).toBe('Hello, my name is Ben and I am a chemist.');
       });

       it('should replace multiple instances of placeholders', function () {
           //given
           var placeholder = '{name} said his name is {name} and he is a {occupation}.';

           //when
           var formatted = format(placeholder, {
               name: 'Ben',
               occupation: 'chemist'
           });

           //then
           expect(formatted).toBe('Ben said his name is Ben and he is a chemist.');
       });

       it('should replace placeholders with embedded placeholders', function () {
           //given
           var placeholder = 'Hello, my name is {name} and I am a {occupation}.';

           //when
           var formatted = format(placeholder, {
               first: 'Ben',
               last: 'March',
               name: '{first} {last}',
               occupation: 'chemist'
           });

           //then
           expect(formatted).toBe('Hello, my name is Ben March and I am a chemist.');
       });
   });

});
