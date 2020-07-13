'use strict';

import {Characteristic} from "../business/characteristic";
import {getSelectedFamilyCharacteristic} from "../init";
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

        const families = ["shapeFamily","widthFamily","thicknessFamily","continuityFamily","directionFamily","colourFamily","brightnessFamily","opacityFamily","magnetismFamily"];
        $scope.$on('initShowStrat', function (event) {
            initStratTab($scope, StratigraphyData, families);
            $scope.familyGroup = [];
            for (let f of families) {
                let fname = f.split('Family')[0];
                fname = fname.charAt(0).toUpperCase() + fname.slice(1);
                $scope.familyGroup.push({uid:f, name: fname, 'visible': ['widthFamily','thicknessFamily','colourFamily'].includes(f)})
            }
        });
        $scope.$on('updateMorphology', function () {
            updateStratTabFromModel($scope, StratigraphyData, families);
        });

        $scope.upMorpho = function () {
            updateStratModelFromTab($scope, StratigraphyData, families);
            $scope.$emit('updateSelectedStrata');
        };
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
    }]);
