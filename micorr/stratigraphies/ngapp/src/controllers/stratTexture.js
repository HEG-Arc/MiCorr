'use strict';

import {Characteristic} from "../business/characteristic";
import {getSelectedFamilyCharacteristic} from "../init";
import {initStratTab, updateStratModelFromTab, updateStratTabFromModel} from "./stratLib";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratTextureCtrl
 * @description
 * # StratTextureCtrl
 * Contrôlleur qui s'occupe de l'onglet de la texture
 */
angular.module('micorrApp')
    .controller('StratTextureCtrl', function ($scope, $route, $window, StratigraphyData) {
        const textureFamilies = ["porosityFamily","cohesionFamily", "hardnessFamily", "crackingFamily"];
        $scope.$on('initShowStrat', function (event) {
            initStratTab($scope,StratigraphyData, textureFamilies);
        });

        $scope.$on('updateTexture', function () {
            updateStratTabFromModel($scope,StratigraphyData, textureFamilies);
        });

        $scope.upTexture = function () {
            updateStratModelFromTab($scope, StratigraphyData, textureFamilies);
            $scope.$emit('updateSelectedStrata');
        };
    });
