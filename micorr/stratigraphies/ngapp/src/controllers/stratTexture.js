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
    .controller('StratTextureCtrl', function ($scope, $route, $window, StratigraphyData) {
        $scope.$on('initShowStrat', function (event) {
            initStratTab($scope, StratigraphyData, 'fgTexture');
        });

        $scope.$on('updateTexture', function () {
            updateStratTabFromModel($scope, StratigraphyData);
        });

        $scope.upTexture = function () {
            updateStratModelFromTab($scope, StratigraphyData);
            $scope.$emit('updateSelectedStrata');
        };
    });
