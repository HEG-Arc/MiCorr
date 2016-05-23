'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:AddStratigraphyCtrl
 * @description
 * # AddStratigraphyCtrl
 * Contrôlleur qui s'occupe d'ajouter une strate
 */
angular.module('micorrApp')
    .controller('ModalAddStrataCtrl', function ($scope, $rootScope, $route, $modal, MiCorrService, StrataData, StratigraphyData) {
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

                            var nature = returnNatureCharacteristic($scope.nature);
                            var newStrata = new strata.Strata(nature.getRealName());
                            newStrata.replaceCharacteristic(nature);
                            newStrata.setUid($scope.strataName);
                            newStrata.setIndex(StratigraphyData.getStratigraphy().getStratas().length);

                            StratigraphyData.pushOneStrata(newStrata);
                            scopeParent.$emit('doUpdate', StratigraphyData.getStratigraphy().getStratas().length-1);
                            scopeParent.$emit('updateDraw');
                            $modalInstance.close();
                            /*
                            var newStrata = natureFactory($scope.nature);
                            newStrata.setName($scope.strataName);
                            newStrata.setUid($scope.strataUid);
                            StrataData.pushOneStrata(newStrata);
                            scopeParent.$emit('doUpdate', StrataData.getStratas().length-1);
                            scopeParent.$emit('updateDraw');
                            $modalInstance.close(); */
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
