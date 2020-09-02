'use strict';

import {initStratTab, updateStratModelFromTab, updateStratTabFromModel} from "./stratLib";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratTextureCtrl
 * @description
 * # StratTextureCtrl
 * Contrôlleur qui s'occupe de l'onglet de la texture
 */
angular.module('micorrApp')
    .controller('StratNewMicrostructureCtrl', function ($scope, $route, $window, StratigraphyData) {
        $scope.$on('initShowStrat', function (event) {
            initStratTab($scope, StratigraphyData, 'fgMicrostructure');
        });

        $scope.$on('updateMicrostructure', function () {
            updateStratTabFromModel($scope, StratigraphyData);
        });

        $scope.updateModel = function () {
            updateStratModelFromTab($scope, StratigraphyData);
            $scope.$emit('updateSelectedStrata');
        };
        $scope.getGroup = function (item) {
            return item.optgroup;
        }
    });
