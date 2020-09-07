'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalShowSimilarStrataCtrl
 * @description
 * # ModalShowSimilarStrataCtrl
 */
angular.module('micorrApp')
    .controller('ModalShowSimilarStrataCtrl', function ($scope, $route, $modal, $log, StratigraphyData, MiCorrService) {
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'showSimilarStrataContent.html',
                size: size,
                controller: ['$scope', '$modalInstance', 'scopeParent',
                    function ($scope, $modalInstance, scopeParent) {
                        $scope.results = "";
                        /* A l'ouverture de la fenêtre on va appeler un service qui va chercher les artefacts similaires
                         * Ce service prend comme paramètre la stratigraphie complète au format JSON
                         * Il est inutile de renseigner les nom d'artefact et de stratigraphie car on compare uniquement les couches de corrosion entre elles
                         * Une fois la requête effectuée, on ressort le résultat
                         */
                        MiCorrService.matchStratigraphy(JSON.stringify(StratigraphyData.getStratigraphy().toJson())).then(function (response) {
                            $scope.results = response.data;
                        }).then(function () {
                            $scope.results.forEach(function (listItem, index) {
                                MiCorrService.getStratigraphyByArtefact(listItem.artefact).then(function (response) {
                                    let stratigraphies = response.data;
                                    MiCorrService.getStratigraphySvg(stratigraphies.strats[0].name, 100).then(function (response) {
                                        var test = $scope.results[index];
                                        $scope.results[index].svg = response.data;
                                        $scope.results[index].str_uid = stratigraphies.strats[0].name;
                                    });
                                });

                            });
                        });

                        $scope.ok = function () {
                            $modalInstance.close();
                        };
                    }
                ],
                resolve: {
                    scopeParent: function () {
                        return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                    }
                }
            });

        };
    });
