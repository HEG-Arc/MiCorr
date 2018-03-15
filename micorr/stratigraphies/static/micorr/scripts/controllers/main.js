'use strict';
import angular from 'angular';
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
export default angular.module('micorrApp')
    .controller('MainCtrl', function ($scope, $route, $routeParams, MiCorrService, StratigraphyData, ngProgress, httpRequestTracker) {

        ngProgress.height('4px');
        ngProgress.color('#e27e14;');
        ngProgress.start();

        $scope.hasPendingRequests = function () {
            // due to getBBox not working on hidden elements (needed for strata labels drawing)
            // we temporarily disable ngProgress loader, by hiding loader animation when returning always false
            //return httpRequestTracker.hasPendingRequests();
            return false;
        };
    }).name;
