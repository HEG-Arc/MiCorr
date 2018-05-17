'use strict';

import {Characteristic} from "../business/characteristic";
import {getSelectedFamilyCharacteristic} from "../init";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratInterfaceCtrl
 * @description
 * # StratInterfaceCtrl
 * Contrôlleur qui s'occupe de l'onglet de l'interface
 */
angular.module('micorrApp')
    .controller('StratInterfaceCtrl', function ($scope, $route, $window, StratigraphyData) {

        const interfaceFamilies = ["interfaceProfileFamily","interfaceTransitionFamily", "interfaceRoughnessFamily", "interfaceAdherenceFamily"];
        $scope.$on('initShowStrat', function (event) {
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            for (let f of interfaceFamilies)
                $scope[f] = StratigraphyData[f].characteristics;
            $scope.selected = {};
            for (let f of interfaceFamilies)
                $scope.selected[f] = null;
            $scope.descriptions = StratigraphyData.descriptions;
        });
        /*
         * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         */
        $scope.$on('updateInterface', function () {
            let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            for (let f of interfaceFamilies)
                $scope.selected[f]=getSelectedFamilyCharacteristic(strata, f, $scope[f]);
                // e.g $scope.selected["interfaceProfileFamily"] = getSelectedFamilyCharacteristic(strata, "interfaceProfileFamily", $scope.interfaceProfileFamily);
        });

        /*
         * Met à jour les données de la strate en fonction des valeurs dans le formulaire
         */
        $scope.upInterface = function () {
            let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            for (let f of interfaceFamilies)
                strata.replaceCharacteristic(new Characteristic(f, $scope.selected[f]));
               // e.g strata.replaceCharacteristic(new Characteristic("interfaceProfileFamily", $scope.selected["interfaceProfileFamily"]));

            $scope.$emit('updateSelectedInterface');
        };
  });
