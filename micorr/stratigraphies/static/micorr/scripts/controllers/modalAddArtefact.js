'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalAddArtefactCtrl
 * @description
 * # ModalAddArtefactCtrl
 */
angular.module('micorrApp')
    .controller('ModalAddArtefactCtrl', function ($scope, $route, $modal, $log, StrataData, MiCorrService) {
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'AddArtefactContent.html',
                size: size,
                controller: ['$scope', '$modalInstance','scopeParent', 'id',
                    function($scope, $modalInstance,scopeParent,id) {
                        $scope.artefact;
                        $scope.ok = function() {
                            if (testUserInput($scope.artefact)) {
                                MiCorrService.createArtefact($scope.artefact).success(function(data){
                                    if (data['res'] == 0)
                                        alert("This artefact already exists in database !");
                                    else {
                                        $modalInstance.close();
                                        $route.reload();
                                    }
                                });
                            }
                            else
                                alert("Only alphanumeric characters are allowed");

                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                resolve: {
                    scopeParent: function() {
                        return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                    },
                    id: function(){
                        return $scope.id; // On passe en paramètre l'id de l'élément à supprimer.
                    }
                }
            });

        };
    });
