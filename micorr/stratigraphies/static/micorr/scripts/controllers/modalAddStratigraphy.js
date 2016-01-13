'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalAddStratigraphyCtrl
 * @description
 * # ModalAddStratigraphyCtrl
 * Controlleur qui s'occupe de l'ajout d'une stratigraphie
 */
angular.module('micorrApp')
    .controller('ModalAddStratigraphyCtrl', function ($scope, $modal, $log) {
        $scope.artefactName = $scope.$parent.artefactName;
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'modalAddStratigraphy.html',
                controller: 'ModalAddStratigraphyInstanceCtrl',
                resolve : {
                    artefact : function(){
                        return $scope.artefactName;
                    }
                }
            });
        };
    });
