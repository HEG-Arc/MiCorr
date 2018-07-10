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

            /* uncomment for trial dynamic family templates (see comments in strat.html)
            $scope.familyGroup = [
                {"uid": "shapeFamily", "name": "Shape"},
                {"uid": "magnetismFamily", "name": "Magnetism"},
                {"uid": "thicknessFamily", "name": "Thickness"},
                {"uid": "widthFamily", "name": "Width"},
                {"uid": "directionFamily", "name": "Direction"},
                {"uid": "continuityFamily", "name": "Continuity"},
                {"uid": "brightnessFamily", "name": "Brightness"},
                {"uid": "colourFamily", "name": "Colour"},
                {"uid": "opacityFamily", "name": "Opacity"}];
                */
        });
        $scope.$on('updateMorphology', function () {
            updateStratTabFromModel($scope, StratigraphyData, families);
        });

        $scope.upMorpho = function () {
            updateStratModelFromTab($scope, StratigraphyData, families);
            $scope.$emit('updateSelectedStrata');
        };
    });
    /*
    .directive('dynamicModel', ['$compile', '$parse', function ($compile, $parse) {
        //used in trial dynamic family templates (see commented out template in strat.html)
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
*/
