'use strict';

import {Characteristic} from "../business/characteristic";
import {getSelectedFamilyCharacteristic} from "../init";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratMorphologyCtrl
 * @description
 * # StratMorphologyCtrl
 * Contrôlleur qui s'occupe de l'onglet de la morphologie
 */
angular.module('micorrApp')
    .controller('StratMorphologyCtrl', function ($scope, $route, $window, StratigraphyData) {

        var initStratMorphology = function () {

            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.fShapeFamily = "";
            $scope.shapeFamily = StratigraphyData.getShapeFamily()['characteristics'];
            $scope.widthFamily = StratigraphyData.getWidthFamily()['characteristics'];
            $scope.thicknessFamily = StratigraphyData.getThicknessFamily()['characteristics'];
            $scope.continuityFamily = StratigraphyData.getContinuityFamily()['characteristics'];
            $scope.directionFamily = StratigraphyData.getDirectionFamily()['characteristics'];
            $scope.colourFamily = StratigraphyData.getColourFamily()['characteristics'];
            $scope.brightnessFamily = StratigraphyData.getBrightnessFamily()['characteristics'];
            $scope.opacityFamily = StratigraphyData.getOpacityFamily()['characteristics'];
            $scope.magnetismFamily = StratigraphyData.getMagnetismFamily()['characteristics'];
            $scope.descriptions = StratigraphyData.descriptions;
            $scope.familyGroup = [{"uid": "shapeFamily", "name": "Shape"}, {
                "uid": "magnetismFamily",
                "name": "Magnetism"
            }, {"uid": "thicknessFamily", "name": "Thickness"}, {
                "uid": "widthFamily",
                "name": "Width"
            }, {"uid": "directionFamily", "name": "Direction"}, {
                "uid": "continuityFamily",
                "name": "Continuity"
            }, {"uid": "brightnessFamily", "name": "Brightness"}, {
                "uid": "colourFamily",
                "name": "Colour"
            }, {"uid": "opacityFamily", "name": "Opacity"}]
        };

        $scope.$on('initShowStrat', function (event) {
            initStratMorphology();
        });

        const scopeVarToFamily = {
            selectedShapeFamily: "shapeFamily",
            selectedWidthFamily: "widthFamily",
            selectedThicknessFamily: "thicknessFamily",
            selectedContinuityFamily: "continuityFamily",
            selectedDirectionFamily: "directionFamily",
            selectedColourFamily: "colourFamily",
            selectedBrightnessFamily: "brightnessFamily",
            selectedOpacityFamily: "opacityFamily",
            selectedMagnetismFamily: "magnetismFamily"
        };

        /*
         * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         */
        $scope.$on('updateMorphology', function () {
            let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            for (let v in scopeVarToFamily)
                $scope[v]=getSelectedFamilyCharacteristic(strata, scopeVarToFamily[v], $scope[scopeVarToFamily[v]]);
                // e.g $scope.selectedShapeFamily = getSelectedFamilyCharacteristic(strata, "shapeFamily", $scope.shapeFamily);

        });


        /*
         * Met à jour les données de la strate en fonction des valeurs dans le formulaire
         */
        $scope.upMorpho = function () {
            let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            for (let v in scopeVarToFamily)
                strata.replaceCharacteristic(new Characteristic(scopeVarToFamily[v], $scope[v]));
                // e.g strata.replaceCharacteristic(new Characteristic("shapeFamily", $scope.selectedShapeFamily));
            //mise à jour du dessin
            $scope.$emit('updateSelectedStrata');
        };

    });
