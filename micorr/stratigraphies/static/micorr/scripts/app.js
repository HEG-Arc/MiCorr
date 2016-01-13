'use strict';

/**
 * @ngdoc overview
 * @name micorrApp
 * @description
 * # micorrApp
 *
 * Main module of the application.
 */

//routage de l'application
angular
    .module('micorrApp', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'fxpicklist',
        'ngProgress'
    ])
    .config(function($routeProvider, $httpProvider) {
        $routeProvider
        // affichage de la liste des stratigraphies
        .when('/artefact/:name', {
            templateUrl: '../static/micorr/views/artefact.html',
            controller: 'ShowArtefactCtrl'
        })
        // affichage de la stratigraphie
        .when('/artefact/:artefact/:strat/:stratigrapgydescription', {
            templateUrl: '../static/micorr/views/strat.html'
        })
        // affichage de la liste des artefacts
        .otherwise({
            redirectTo: '/',
            templateUrl: '../static/micorr/views/listartefacts.html',
            controller: 'ListArtefactsCtrl'
        });

    // Désactivation de la mise en cache pour requêtes http pour IE
    // initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors
    // disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
});
