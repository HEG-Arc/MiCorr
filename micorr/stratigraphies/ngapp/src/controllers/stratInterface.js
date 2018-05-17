'use strict';

import {Characteristic} from "../business/characteristic";
import {getCharacteristicByItsName, getSelectedFamilyCharacteristic} from "../init";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratInterfaceCtrl
 * @description
 * # StratInterfaceCtrl
 * Contrôlleur qui s'occupe de l'onglet de l'interface
 */
angular.module('micorrApp')
    .controller('StratInterfaceCtrl', function ($scope, $route, $window, StratigraphyData) {

        var initStratInterface = function () {
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.interfaceProfileFamily = StratigraphyData.getInterfaceprofileFamily()['characteristics'];
            $scope.interfaceTransitionFamily = StratigraphyData.getInterfacetransitionFamily()['characteristics'];
            $scope.interfaceRoughnessFamily = StratigraphyData.getInterfaceroughnessFamily()['characteristics'];
            $scope.interfaceAdherenceFamily = StratigraphyData.getInterfaceadherenceFamily()['characteristics'];
            $scope.descriptions = StratigraphyData.descriptions;
        };

        $scope.$on('initShowStrat', function (event) {
            initStratInterface();
        });
         function emptyFields() {
            $scope.selectedInterfaceProfileFamily = null;
            $scope.selectedInterfaceTransitionFamily = null;
            $scope.selectedInterfaceRoughnessFamily = null;
            $scope.selectedInterfaceAdherenceFamily = null;
        }
        const scopeVarToFamily = {
            selectedInterfaceProfileFamily: "interfaceProfileFamily",
            selectedInterfaceTransitionFamily: "interfaceTransitionFamily",
            selectedInterfaceRoughnessFamily: "interfaceRoughnessFamily",
            selectedInterfaceAdherenceFamily: "interfaceAdherenceFamily",
        };

        /*
         * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         */
        $scope.$on('updateInterface', function () {
            emptyFields();
            let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            //for (let v in scopeVarToFamily)
            //    $scope[v]=getSelectedFamilyCharacteristic(strata, scopeVarToFamily[v], $scope[scopeVarToFamily[v]]);
                // e.g $scope.selectedInterfaceProfileFamily = getSelectedFamilyCharacteristic(strata, "interfaceProfileFamily", $scope.interfaceProfileFamily);

            if (strata.getCharacteristicsByFamily("interfaceProfileFamily").length > 0) {
                $scope.selectedInterfaceProfileFamily = getCharacteristicByItsName($scope.interfaceProfileFamily, strata.getCharacteristicsByFamily("interfaceProfileFamily")[0].getName());
            }

            if (strata.getCharacteristicsByFamily("interfaceTransitionFamily").length > 0) {
                $scope.selectedInterfaceTransitionFamily = getCharacteristicByItsName($scope.interfaceTransitionFamily, strata.getCharacteristicsByFamily("interfaceTransitionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("interfaceRoughnessFamily").length > 0) {
                $scope.selectedInterfaceRoughnessFamily = getCharacteristicByItsName($scope.interfaceRoughnessFamily, strata.getCharacteristicsByFamily("interfaceRoughnessFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("interfaceAdherenceFamily").length > 0) {
                $scope.selectedInterfaceAdherenceFamily = getCharacteristicByItsName($scope.interfaceAdherenceFamily, strata.getCharacteristicsByFamily("interfaceAdherenceFamily")[0].getName());
            }

        });

        /*
         * Met à jour les données de la strate en fonction des valeurs dans le formulaire
         */
        $scope.upInterface = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if ($scope.selectedInterfaceProfileFamily != null) {
                if (strata.findDependency('interfaceProfileFamily')) {
                    var char = new Characteristic();
                    char.setFamily("interfaceProfileFamily");
                    char.setName($scope.selectedInterfaceProfileFamily.name);
                    char.setRealName($scope.selectedInterfaceProfileFamily.real_name);
                    char.setInterface(true);
                    strata.replaceCharacteristic(char);
                }
            }
            if ($scope.selectedInterfaceTransitionFamily != null) {
                if (strata.findDependency('interfaceTransitionFamily')) {
                    var char = new Characteristic();
                    char.setFamily("interfaceTransitionFamily");
                    char.setName($scope.selectedInterfaceTransitionFamily.name);
                    char.setRealName($scope.selectedInterfaceTransitionFamily.real_name);
                    char.setInterface(true);
                    strata.replaceCharacteristic(char);
                }
            }
            if ($scope.selectedInterfaceRoughnessFamily != null) {
                if (strata.findDependency('interfaceRoughnessFamily')) {
                    var char = new Characteristic();
                    char.setFamily("interfaceRoughnessFamily");
                    char.setName($scope.selectedInterfaceRoughnessFamily.name);
                    char.setRealName($scope.selectedInterfaceRoughnessFamily.real_name);
                    char.setInterface(true);
                    strata.replaceCharacteristic(char);
                }
            }

            if ($scope.selectedInterfaceAdherenceFamily != null) {
                if (strata.findDependency('interfaceAdherenceFamily')) {
                    var char = new Characteristic();
                    char.setFamily("interfaceAdherenceFamily");
                    char.setName($scope.selectedInterfaceAdherenceFamily.name);
                    char.setRealName($scope.selectedInterfaceAdherenceFamily.real_name);
                    char.setInterface(true);
                    strata.replaceCharacteristic(char);
                }
            }

            $scope.$emit('updateSelectedInterface');
        };
  });
