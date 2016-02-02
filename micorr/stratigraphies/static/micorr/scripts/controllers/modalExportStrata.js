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
    .controller('ModalExportStrataCtrl', function ($scope, $route, $modal, $log, StrataData, MiCorrService) {
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'exportStrataContent.html',
                size: size,
                controller: ['$scope', '$modalInstance','scopeParent', 'images',
                    function($scope, $modalInstance, scopeParent, images) {
                        //on récupères les images (paper de raphaeljs) pour les mettre dans notre scope afin de les afficher par notre directive
                        $scope.images = images;

                        $scope.ok = function() {
                            $modalInstance.close();
                        };
                    }
                ],
                resolve: {
                    scopeParent: function() {
                        return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                    },
                    images : function() {
                        return StrataData.getImages();
                    }
                }
            });

        };
    });
