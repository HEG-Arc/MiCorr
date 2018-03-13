"use strict";
import "./dependencies/angbootstrap.min.js";
import "./directives/picklist.js";
import "./dependencies/svg.js";
import "./utils/graphGenerationUtil.js";
import "./algorithms/poissonDisk.js";
import "./business/stratigraphy.js";
import "./business/strata.js";
import "./business/characteristic.js";
import "./business/subCharacteristic.js";
import "./init.js";
import "./controllers/addStratigraphy.js";
import "./controllers/listArtefacts.js";
import "./controllers/main.js";
import "./controllers/modalAddArtefact.js";
import "./controllers/modalAddStrata.js";
import "./controllers/modalAddStratigraphy.js";
import "./controllers/modalAddStratigraphyInstance.js";
import "./controllers/modalDelArtefact.js";
import "./controllers/modalDelStrata.js";
import "./controllers/modalDelStratigraphy.js";
import "./controllers/modalExportStrata.js";
import "./controllers/modalSaveStrata.js";
import "./controllers/modalShowSimilarStrata.js";
import "./controllers/pickList.js";
import "./controllers/showArtefact.js";
import "./controllers/showStrat.js";
import "./controllers/stratComposition.js";
import "./controllers/stratInterface.js";
import "./controllers/stratMicrostructure.js";
import "./controllers/stratMorphology.js";
import "./controllers/stratTexture.js";
import "./controllers/tabsStrata.js";
import "./services/services.js";
import "./directives/directives.js";
import "./algorithms/PoissonDiskSampler.js";
import "./dependencies/rhill-voronoi-core.min.js";
import "./algorithms/Voronoi.js";
import "./dependencies/ngprogress.min.js";

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
        'ngProgress',
        'ui.select',
        'ngSanitize'
    ])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            // affichage de la liste des stratigraphies
            .when('/artefact/:name', {
                templateUrl: '../static/micorr/views/artefact.html',
                controller: 'ShowArtefactCtrl'
            })
            // affichage de la stratigraphie
            .when('/stratigraphy/:strat', {
                templateUrl: '../static/micorr/views/strat.html'
            })
            // affichage de la stratigraphie
            // n'est plus utilisée mais je l'ai laissée quand même si jamais un lien n'a pas encore été modifié
            .when('/artefact/:artefact/:strat/:stratigraphyDescription', {
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
