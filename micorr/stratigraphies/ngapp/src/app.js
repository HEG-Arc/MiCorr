"use strict";
import angular from "angular";


/**
 * @ngdoc overview
 * @name micorrApp
 * @description
 * # micorrApp
 *
 * Main module of the application.
 */

//routage de l'application
export default angular
    .module('micorrApp', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        //'ui.bootstrap.tooltip', //todo use $uibTooltipProvider
        //'ui.bootstrap.modal',
        'fxpicklist',
        'ngProgress',
        'ui.select',
        'ngSanitize',
        'toggle-switch'
    ])
    .config(function ($routeProvider, $locationProvider, $httpProvider, $tooltipProvider) {
        $routeProvider
            // affichage de la liste des stratigraphies
            .when('/artefact/:name', {
                template: require('../views/artefact.html'),
                controller: 'ShowArtefactCtrl'
            })
            // affichage de la stratigraphie
            .when('/stratigraphy/:strat', {
                template: require('../views/strat.html')
            })
            // affichage de la stratigraphie
            // n'est plus utilisée mais je l'ai laissée quand même si jamais un lien n'a pas encore été modifié
            .when('/artefact/:artefact/:strat/:stratigraphyDescription', {
                template: require('../views/strat.html')
            })
            // affichage de la liste des artefacts
            .otherwise({
                redirectTo: '/',
                template: require('../views/listartefacts.html'),
                controller: 'ListArtefactsCtrl'
            });
        // angular >=1.6 compatibility
        $locationProvider.hashPrefix('');

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

        //set ui-bootstrap tooltip directive default options
        $tooltipProvider.options({
            appendToBody: true, // same as tooltip-append-to-body="true" important to use inside other directives e.g. ui-select
            placement: 'top' //  tooltip-placement="top"
        });
    }).name;

import {strata, stratainfo} from "./directives/directives";

angular.module('micorrApp').directive('strata', strata).directive('stratainfo', stratainfo)
.filter('capitalize', function () {
    //register a "title" like capitalize ng filter
    // changing text to lowercase but first char to uppercase
    return function (input, scope) {
        if (input) {
            input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    };
});
