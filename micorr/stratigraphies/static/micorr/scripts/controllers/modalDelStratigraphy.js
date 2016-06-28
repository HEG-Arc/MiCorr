'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalDelStratigraphyCtrl
 * @description
 * # ModalDelStratigraphyCtrl
 */
angular.module('micorrApp')
    .controller('ModalDelStratigraphyCtrl', function ($scope, $route, $modal, $log, MiCorrService) {
        $scope.open = function (size, strat) {
            var modalInstance = $modal.open({
                templateUrl: 'delStratigraphyContent.html',
                size: size,
                controller: ['$scope', '$modalInstance','scopeParent', 'id',
                    function($scope, $modalInstance,scopeParent,id) {
                        $scope.ok = function() {
                            MiCorrService.deleteStratigraphy(strat).success(function(data){
                                $route.reload();
                            });
                            $modalInstance.close();
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
