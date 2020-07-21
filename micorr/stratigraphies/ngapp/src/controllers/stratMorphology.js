'use strict';

import {initStratTab, updateStratModelFromTab, updateStratTabFromModel} from "./stratLib";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratMorphologyCtrl
 * @description
 * # StratMorphologyCtrl
 * Contrôlleur qui s'occupe de l'onglet de la morphologie
 */
angular.module('micorrApp')
    .controller('StratMorphologyCtrl', function ($scope, $route, $window, StratigraphyData) {
        $scope.$on('initShowStrat', function (event) {
            initStratTab($scope, StratigraphyData, 'fgMorphology');
        });
        $scope.$on('updateMorphology', function () {
            updateStratTabFromModel($scope, StratigraphyData);
        });

        $scope.upMorpho = function () {
            updateStratModelFromTab($scope, StratigraphyData);
            $scope.$emit('updateSelectedStrata');
        };
        //$scope.itemForm.$setPristine();
    }).directive('dynamicModel', ['$compile', '$parse', function ($compile, $parse) {
        //used in dynamic family templates see strat.html
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem) {
            var name = $parse(elem.attr('dynamic-model'))(scope);
            elem.removeAttr('dynamic-model');
            elem.attr('ng-model', name);
            $compile(elem)(scope);
        }
     };
    }]).directive('smartFloat',function(){
				return{
					require: "ngModel",
					link: function(scope, elm, attrs, ctrl){

						var regex=/^\d{1,3}([\.,](\d{1,2})?)?$/;
						ctrl.$parsers.unshift(function(viewValue){
							if( regex.test(viewValue)){
                                var floatValue = viewValue.replace(',','.');
                                floatValue = parseFloat(floatValue);
                                if(floatValue >= 0 && floatValue <=100) {
                                    ctrl.$setValidity('validFloat',true);
                                    return parseFloat(floatValue);
                                }
                                else {
                                    ctrl.$setValidity('validFloat',false);
                                }
							}
                            else{
							    ctrl.$setValidity('validFloat',false);
                            }
							return viewValue;
						});
					}
				};
			});
