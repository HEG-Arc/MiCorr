'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalExportStrataCtrl
 * @description
 * # ModalShowSimilarStrataCtrl
 * Contrôlleur qui va ouvrir une fenêtre modale pour exporter les dessins au format png
 * La fenêtre contient chaque dessins mais au format png et non svg
 */
angular.module('micorrApp')
    .controller('ModalExportStrataCtrl', function ($scope, $route, $modal, $log, StratigraphyData, MiCorrService) {
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'exportStrataContent.html',
                size: size,
                controller: ['$scope', '$modalInstance','scopeParent',
                    function($scope, $modalInstance, scopeParent) {

                        $scope.imgUrl = MiCorrService.getStratigraphyImageUrl(StratigraphyData.getStratigraphy().getUid(), 300, 'png');
                        $scope.ok = function() {
                            $modalInstance.close();
                        };
                    }
                ],
                resolve: {
                    scopeParent: function() {
                        return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                    }
                }
            });

        };
    });