'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ListArtefactsCtrl
 * @description
 * # ListArtefactsCtrl
 * Contrôlleur qui s'occupe d'afficher tous les artefacts
 */
angular.module('micorrApp')
    .controller('ListArtefactsCtrl', function ($scope, $routeParams, MiCorrService, ngProgress) {
        // Quand on lance la page, alors il se passe une requête asynchrone qui va chercher tous les artefacts
        MiCorrService.getAllArtefacts().success(function(data){
            $scope.artefacts = data['artefacts'];
            ngProgress.complete();
        });
    });
