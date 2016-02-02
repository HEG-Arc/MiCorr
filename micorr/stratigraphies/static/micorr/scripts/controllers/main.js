'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Contrôlleur très important car il est appelé une fois lors du chargement du site
 * Ce contrôlleur est parent à chaque autres contrôlleurs de micorrApp
 * Lorsqu'on appelle une page de micorrApp ce contrôlleur est exécuté et il fait principalement une seule chose
 * Il va chercher la liste des charactéristiques présentes dans la base afin de les charger dans les services
 * TO SOLVE -->
 * Attention si on accède aux détails d'une stratigraphie sans que les caractéristiques soient chargées au préalable alors il va y avoir un problème
 * On doit avant tout accéder d'abord à la liste des artefacts ou stratigraphies avant d'aller dans les détails sinon les charactéristiques ne sont pas chargées
 */
angular.module('micorrApp')
    .controller('MainCtrl', function ($scope, $route, $routeParams, MiCorrService, StrataData, ngProgress, httpRequestTracker) {

    ngProgress.height('4px');
    ngProgress.start();

    $scope.hasPendingRequests = function () {
       return httpRequestTracker.hasPendingRequests();
    };

    /* Quand le site est chargé pour la première fois le contrôlleur fait une requête asynchrone
     * Il va chercher la liste de toutes les caractéristiques afin de les mettre dans le service (StrataData)
     * La liste est au format json. Elle est constitué de charactéristiques classées par famille
     * Chaque charactéristique peut avoir une sous-caractéristique et chaque sous caractéristique peut avoir une sous caractéristique
     * Attention une sous caractéristique n'est pas liée à une famille mais à une caractéristique
     */

    /*
    MiCorrService.getAllCharacteristic().success(function(data) {
        ngProgress.complete();
        if (typeof data !== "undefined") {
            StrataData.clear();
            StrataData.Fill(data);
        }
    }).success(function(){
        $scope.$broadcast('initShowStrat');
    });
    */

});
