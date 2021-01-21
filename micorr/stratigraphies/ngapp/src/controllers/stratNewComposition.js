'use strict';

import {initStratTab, updateStratModelFromTab, updateStratTabFromModel} from "./stratLib";



angular.module('micorrApp')
    .controller('StratNewCompositionCtrl', function ($scope, $route, $window, StratigraphyData) {
        $scope.$on('initShowStrat', function (event) {
            initStratTab($scope, StratigraphyData, 'fgComposition');
        });

        $scope.$on('updateComposition', function () {
            updateStratTabFromModel($scope, StratigraphyData);
        });

        $scope.updateModel = function () {
            updateStratModelFromTab($scope, StratigraphyData);
            $scope.$emit('updateSelectedStrata');
        };
        $scope.getGroup = function (item) {
            return item.optgroup || item.category;
        }
    });
