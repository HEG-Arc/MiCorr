'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:AddStratigraphyCtrl
 * @description
 * # AddStratigraphyCtrl
 * Contrôlleur qui s'occupe d'ajouter une strate
 */
angular.module('micorrApp')
    .controller('ModalAddStrataCtrl', function ($scope, $rootScope, $route, $modal, MiCorrService, StrataData) {
        $rootScope.route = $route;
        $rootScope.natures = natures;
        $scope.nature;
        $scope.strataName;
        $scope.strataUid;

        $scope.artefactName = $scope.$parent.artefactName;

        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'modalAddStrata.html',
                controller: ['$scope', 'scopeParent', '$modalInstance',
                    function ($scope, scopeParent, $modalInstance) {
                        $scope.ok = function () {
                            var newStrata = natureFactory($scope.nature);
                            newStrata.setName($scope.strataName);
                            newStrata.setUid($scope.strataUid);
                            StrataData.pushOneStrata(newStrata);
                            scopeParent.$emit('doUpdate', 0);
                            scopeParent.$emit('updateDraw');
                            $modalInstance.close();
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                resolve: {
                    scopeParent: function () {
                        return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                    }
                }
            });
        }

    });
