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

        const familyGroup = [
            {uid: "widthFamily", visible: true, variable: false},
            {uid: "widthVarFamily", visible: false, variable: true, name:'Width value'},
            {uid: "thicknessFamily", visible: true, variable: false},
            {uid: "thicknessVarFamily", visible: false, variable: true,  name:'Thickness value'},
            {uid: "shapeFamily", visible: false, variable: false},
            {uid: "continuityFamily", visible: false, variable: false},
            {uid: "directionFamily", visible: false, variable: false},
            {uid: "colourFamily", visible: true, variable: false},
            {uid: "brightnessFamily", visible: false, variable: false},
            {uid: "opacityFamily", visible: false, variable: false},
        ];
        //add name property derived from familyName
        for (let f of familyGroup) {
            if (!f.name) { //Generate default name from uid if not provided
                let fname = f.uid.split('Family')[0];
                fname = fname.charAt(0).toUpperCase() + fname.slice(1);
                f.name = fname;
            }
        }
        const familyWithoutVariableUids = familyGroup.filter(f => !f.variable).map(f => f.uid);
        $scope.$on('initShowStrat', function (event) {
            initStratTab($scope, StratigraphyData, familyWithoutVariableUids);
            $scope.familyGroup = familyGroup;
        });
        $scope.$on('updateMorphology', function () {
            updateStratTabFromModel($scope, StratigraphyData, familyWithoutVariableUids);
        });

        $scope.upMorpho = function () {
            updateStratModelFromTab($scope, StratigraphyData, familyWithoutVariableUids);

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
