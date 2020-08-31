'use strict';

import {initStratTab, updateStratModelFromTab, updateStratTabFromModel} from "./stratLib";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratInterfaceCtrl
 * @description
 * # StratInterfaceCtrl
 * Contrôlleur qui s'occupe de l'onglet de l'interface
 */
angular.module('micorrApp')
    .controller('StratInterfaceCtrl', function ($scope, $route, $window, StratigraphyData) {

        $scope.$on('initShowStrat', function (event) {
            initStratTab($scope,StratigraphyData, 'fgInterface');
        });

        /*
        * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
        * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
        */
       $scope.$on('updateInterface', function () {
            updateStratTabFromModel($scope,StratigraphyData);
        });

        /*
         * Met à jour les données de la strate en fonction des valeurs dans le formulaire
         */
        $scope.upModel = function () {
            updateStratModelFromTab($scope, StratigraphyData);
            $scope.$emit('updateSelectedInterface');
        };
  });
