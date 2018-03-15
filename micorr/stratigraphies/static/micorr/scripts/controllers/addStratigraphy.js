'use strict';
import angular from 'angular';
/**
 * @ngdoc function
 * @name micorrApp.controller:AddStratigraphyCtrl
 * @description
 * # AddStratigraphyCtrl
 * Contrôlleur des messages d'erreurs qui surviennent lors de l'ajout d'une stratigraphie
 */
export default angular.module('micorrApp')
    .controller('AddStratigraphyCtrl', function ($scope) {
        $scope.alerts = [];

        $scope.addAlert = function() {
            $scope.alerts.push({type : 'danger', msg: 'This stratigraphy already exists in database ! '});
        };

        $scope.$on('addArtefact', function(event, sc){
            $scope.addAlert();
        });

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }).name;
