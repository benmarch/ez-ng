/*global jasmine:false, describe:false, it:false, beforeEach: false, module: false, inject: false*/
'use strict';

describe('ezComponent', function () {

    var ezComponent,
        $compileProvider,
        $compile,
        ezComponentHelpersMock = {
            useStyles: jasmine.createSpy('useStyles'),
            useStylesUrl: jasmine.createSpy('useStylesUrl')
        };

    beforeEach(module('ezNg', function (_$compileProvider_) {
        $compileProvider = _$compileProvider_;
    }));

    beforeEach(module(function ($provide) {
        $provide.factory('ezComponentHelpers', function () {
            return function () {
                return ezComponentHelpersMock;
            };
        });
    }));

    beforeEach(inject(function (_ezComponent_, _$compile_) {
        ezComponent = _ezComponent_;
        $compile = _$compile_;
    }));

    it('should delegate to ezComponentHelpers#useStyles', function () {

        //given
        var myComponent = {
            styles: '.my-style {color: red;}'
        };
        $compileProvider.directive('myComponent', function () {
            return ezComponent(myComponent);
        });

        //when
        $compile('<my-component></my-component>');

        //then
        expect(ezComponentHelpersMock.useStyles).toHaveBeenCalledWith(myComponent.styles);

    });

    it('should delegate to ezComponentHelpers#useStylesUrl', function () {

        //given
        var myComponent = {
            stylesUrl: 'my-component-styles.css'
        };
        $compileProvider.directive('myComponent', function () {
            return ezComponent(myComponent);
        });

        //when
        $compile('<my-component></my-component>');

        //then
        expect(ezComponentHelpersMock.useStylesUrl).toHaveBeenCalledWith(myComponent.stylesUrl);

    });

});
