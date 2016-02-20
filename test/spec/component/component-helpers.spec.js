/*global jasmine:false, describe:false, it:false, beforeEach: false, module: false, inject: false*/
'use strict';

describe('ezComponentHelpers', function () {

    var ezComponentHelpers,
        $httpBackend,
        $compile,
        $scope,
        $timeout,
        $document,
        testTemplate = '<div>Hello World</div>',
        testStyles = '.my-style {color: red;}';

    beforeEach(module('ezNg'));

    beforeEach(inject(function (_ezComponentHelpers_, _$httpBackend_, _$compile_, _$rootScope_, _$timeout_, _$document_) {
        ezComponentHelpers = _ezComponentHelpers_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
        $document = _$document_;
    }));

    describe('templates', function () {

        describe('#useTemplate', function () {

            it('should replace the contents of an element with a supplied template', function () {

                //given
                var element = $compile('<div>Some element content</div>')($scope);

                //when
                ezComponentHelpers($scope, element).useTemplate(testTemplate);

                //then
                expect(element.text().indexOf('Hello World')).not.toBe(-1);

            });

        });

        describe('#useTemplateUrl', function () {

            it('should replace the contents of an element with a supplied template URL', function () {

                //given
                var testTemplateUrl = 'test-template.html';
                var element = $compile('<div>Some element content</div>')($scope);
                $httpBackend.whenGET(testTemplateUrl).respond(testTemplate);

                //when
                ezComponentHelpers($scope, element).useTemplateUrl(testTemplateUrl);
                $httpBackend.flush();
                $scope.$digest();

                //then
                expect(element.text().indexOf('Hello World')).not.toBe(-1);

            });

        });

    });

    describe('styles', function () {

        var outerElement,
            innerElement;

        beforeEach(function () {
            outerElement = $compile('<div class="my-style"><span>This should not be red</span></div>')($scope);
            innerElement = $compile('<div class="my-style">This should be red</div>')($scope);
            outerElement.append(innerElement);
            $document.find('body').append(outerElement);
        });

        describe('#useStyles', function () {

            it('should inject scoped styles into an element', function () {

                //when
                ezComponentHelpers($scope, innerElement).useStyles(testStyles);
                $scope.$digest();

                //then
                $timeout(function () {
                    expect(getComputedStyle(innerElement[0]).getPropertyValue('color')).toBe('rgb(255, 0, 0)');
                    expect(getComputedStyle(outerElement[0]).getPropertyValue('color')).toBe('rgb(0, 0, 0)');
                });

            });

        });

        describe('#useStylesUrl', function () {

            it('should inject scoped styles into an element given a URL', function () {

                //given
                var testStylesUrl = 'test-styles.css';
                $httpBackend.whenGET(testStylesUrl).respond(testStyles);

                //when
                ezComponentHelpers($scope, innerElement).useStylesUrl(testStylesUrl);
                $httpBackend.flush();
                $scope.$digest();

                //then
                $timeout(function () {
                    expect(getComputedStyle(innerElement[0]).getPropertyValue('color')).toBe('rgb(255, 0, 0)');
                    expect(getComputedStyle(outerElement[0]).getPropertyValue('color')).toBe('rgb(0, 0, 0)');
                });

            });

        });

    });

});
