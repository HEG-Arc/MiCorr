'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalDelArtefactCtrl
 * @description
 * # ModalDelArtefactCtrl
 */
angular.module('micorrApp')
    .controller('ModalDelArtefactCtrl', function ($scope, $route, $modal, $log, MiCorrService) {
        $scope.open = function (size, artefact) {
            $scope.artefact = artefact;
            var modalInstance = $modal.open({
                templateUrl: 'delArtefactContent.html',
                size: size,
                controller: ['$scope', '$modalInstance','scopeParent', 'artefact',
                    function($scope, $modalInstance,scopeParent,artefact) {
                        $scope.ok = function() {
                            MiCorrService.deleteArtefact(artefact).then(function (response) {
                                $modalInstance.close();
                                $route.reload();
                            });
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
                    artefact: function(){
                        return $scope.artefact; // On passe en paramètre l'id de l'élément à supprimer.
                    }
                }
            });

        };
    });
