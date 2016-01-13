'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalAddChildStrataCtrl
 * @description
 * # ModalAddChildStrataCtrl
 * Contrôlleur qui s'occupe d'ajouter une strate enfant
 */
angular.module('micorrApp')
    .controller('ModalAddChildStrataCtrl', function ($scope, $modal, $log) {
        $scope.artefactName = $scope.$parent.artefactName;
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'modalAddStrata.html',
                controller: 'ModalAddChildStrataInstanceCtrl',
                resolve : {
                    arg1 : function(){
                        return "hello";
                    }
                }
            });
        }; // Instance du contrôlleur qui s'occupe d'ajouter une strate enfant
    });
