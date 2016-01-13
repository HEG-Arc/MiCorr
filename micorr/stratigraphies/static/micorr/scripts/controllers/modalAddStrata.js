'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:AddStratigraphyCtrl
 * @description
 * # AddStratigraphyCtrl
 * Contrôlleur qui s'occupe d'ajouter une strate
 */
angular.module('micorrApp')
    .controller('ModalAddStrataCtrl', function ($scope, $modal, $log) {
        $scope.artefactName = $scope.$parent.artefactName;
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'modalAddStrata.html',
                controller: 'ModalAddStrataInstanceCtrl',
                resolve : {
                    arg1 : function(){
                        return "hello";
                    }
                }
            });
        }; // Instance du contrôlleur qui s'occupe d'ajouter une strate
    });
