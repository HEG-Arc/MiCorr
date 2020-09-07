'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ShowArtefactCtrl
 * @description
 * # ShowArtefactCtrl
 * Contrôlleur qui s'occupe d'afficher toutes les stratigraphies pour un artefact
 */
angular.module('micorrApp')
    .controller('ShowArtefactCtrl', function ($scope, $location, $routeParams, MiCorrService, ngProgress) {
        $scope.artefactName = $routeParams.name;


        // Quand on lance la page, alors il se passe une requête asynchrone qui va chercher toutes les stratigraphies
        MiCorrService.getStratigraphyByArtefact($scope.artefactName).then(function (response) {
            $scope.strats = response.data['strats'];

            //Lorsque les stratigraphies sont toutes chargées on va pour chaqune aller chercher son svg
        }).then(function () {
            $scope.strats.forEach(function (listItem, index) {
                MiCorrService.getStratigraphySvg(listItem.name, 150).then(function(response) {
                    $scope.strats[index].svg = response.data;
                });
            });
            ngProgress.complete();
        });


    });
