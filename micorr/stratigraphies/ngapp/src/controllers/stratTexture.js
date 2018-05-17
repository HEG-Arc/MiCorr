'use strict';

import {Characteristic} from "../business/characteristic";
import {getSelectedFamilyCharacteristic} from "../init";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratTextureCtrl
 * @description
 * # StratTextureCtrl
 * Contrôlleur qui s'occupe de l'onglet de la texture
 */
angular.module('micorrApp')
    .controller('StratTextureCtrl', function ($scope, $route, $window, StratigraphyData) {

        const textureFamilies = ["porosityFamily","cohesionFamily", "hardnessFamily", "crackingFamily"];
        $scope.$on('initShowStrat', function (event) {
            for (let f of textureFamilies)
                $scope[f] = StratigraphyData[f].characteristics;
            $scope.selected = {};
            for (let f of textureFamilies)
                $scope.selected[f] = null;
            $scope.descriptions = StratigraphyData.descriptions;
        });


        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.$on('updateTexture', function () {
            let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            for (let f of textureFamilies)
                $scope.selected[f]=getSelectedFamilyCharacteristic(strata, f, $scope[f]);
                // e.g $scope.selected["porosityFamily"] = getSelectedFamilyCharacteristic(strata, "porosityFamily", $scope.porosityFamily);
        });

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upTexture = function () {
            let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            for (let f of textureFamilies)
                strata.replaceCharacteristic(new Characteristic(f, $scope.selected[f]));
                // e.g strata.replaceCharacteristic(new Characteristic("porosityFamily", $scope.selected["porosityFamily"]));
            $scope.$emit('updateSelectedStrata');
        };
    });
