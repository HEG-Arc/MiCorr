'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ShowArtefactCtrl
 * @description
 * # ShowArtefactCtrl
 * Contrôlleur qui s'occupe d'afficher toutes les stratigraphies pour un artefact
 */
angular.module('micorrApp')
    .controller('ShowArtefactCtrl', function ($scope, $location, $routeParams, MiCorrService) {
        $scope.artefactName = $routeParams.name;
        // Quand on lance la page, alors il se passe une requête asynchrone qui va chercher toutes les stratigraphies
        MiCorrService.getStratigraphyByArtefact($scope.artefactName).success(function(data){
            $scope.strats = data['strats'];
        });
    });
