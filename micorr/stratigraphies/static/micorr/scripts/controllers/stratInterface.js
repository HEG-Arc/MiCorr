'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratInterfaceCtrl
 * @description
 * # StratInterfaceCtrl
 * Contrôlleur qui s'occupe de l'onglet de l'interface
 */
angular.module('micorrApp')
    .controller('StratInterfaceCtrl', function ($scope, $route, $window, StrataData, StratigraphyData) {

        //valeurs sélectionnées dans les champs de notre formulaire
        $scope.selectedInterfaceprofileFamily;
        $scope.selectedInterfacetransitionFamily;
        $scope.selectedInterfaceroughnessFamily;
        $scope.selectedInterfaceadherenceFamily;


        var initStratInterface = function () {


            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.interfaceprofileFamily = StratigraphyData.getInterfaceprofileFamily()['characteristics'];
            $scope.interfacetransitionFamily = StratigraphyData.getInterfacetransitionFamily()['characteristics'];
            $scope.interfaceroughnessFamily = StratigraphyData.getInterfaceroughnessFamily()['characteristics'];
            $scope.interfaceadherenceFamily = StratigraphyData.getInterfaceadherenceFamily()['characteristics'];
        };

        $scope.$on('initShowStrat', function (event) {
            initStratInterface();
        });

        function emptyFields() {
            $scope.selectedInterfaceprofileFamily = null;
            $scope.selectedInterfacetransitionFamily = null;
            $scope.selectedInterfaceroughnessFamily = null;
            $scope.selectedInterfaceadherenceFamily = null;
        }


        /*
         * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         */
        $scope.$on('updateInterface', function () {

            emptyFields();

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if (strata.getCharacteristicsByFamily("interfaceProfileFamily").length > 0) {
                $scope.selectedInterfaceprofileFamily = getCharacteristicByItsName($scope.interfaceprofileFamily, strata.getCharacteristicsByFamily("interfaceProfileFamily")[0].getName());
            }

            if (strata.getCharacteristicsByFamily("interfaceTransitionFamily").length > 0) {
                $scope.selectedInterfacetransitionFamily = getCharacteristicByItsName($scope.interfacetransitionFamily, strata.getCharacteristicsByFamily("interfaceTransitionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("interfaceRoughnessFamily").length > 0) {
                $scope.selectedInterfaceroughnessFamily = getCharacteristicByItsName($scope.interfaceroughnessFamily, strata.getCharacteristicsByFamily("interfaceRoughnessFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("interfaceAdherenceFamily").length > 0) {
                $scope.selectedInterfaceadherenceFamily = getCharacteristicByItsName($scope.interfaceadherenceFamily, strata.getCharacteristicsByFamily("interfaceAdherenceFamily")[0].getName());
            }

        });

        /*
         * Met à jour les données de la strate en fonction des valeurs dans le formulaire
         */
        $scope.upInterface = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if ($scope.selectedInterfaceprofileFamily != null) {
                if (strata.findDependency('interfaceprofileFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("interfaceProfileFamily");
                    char.setName($scope.selectedInterfaceprofileFamily.name);
                    char.setRealName($scope.selectedInterfaceprofileFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
            if ($scope.selectedInterfacetransitionFamily != null) {
                if (strata.findDependency('interfacetransitionFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("interfaceTransitionFamily");
                    char.setName($scope.selectedInterfacetransitionFamily.name);
                    char.setRealName($scope.selectedInterfacetransitionFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
            if ($scope.selectedInterfaceroughnessFamily != null) {
                if (strata.findDependency('interfaceroughnessFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("interfaceRoughnessFamily");
                    char.setName($scope.selectedInterfaceroughnessFamily.name);
                    char.setRealName($scope.selectedInterfaceroughnessFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }

            if ($scope.selectedInterfaceadherenceFamily != null) {
                if (strata.findDependency('interfaceadherenceFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("interfaceAdherenceFamily");
                    char.setName($scope.selectedInterfaceadherenceFamily.name);
                    char.setRealName($scope.selectedInterfaceadherenceFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }


            $scope.$emit('updateDraw');
        };

        /* Ne semble plus utilisé
         $scope.addCorrodedMetalStrata = function () {
         if (StrataData.getCurrentSelectedStrata() != 0) {
         if (StrataData.getStratas()[StrataData.getCurrentSelectedStrata() - 1].getNatureFamilyUid() == "cpCharacteristic") {
         var cmStrata = natureFactory("CM");
         cmStrata.relatedCP = StrataData.getStratas()[StrataData.getCurrentSelectedStrata() - 1];
         cmStrata.relatedM = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()]
         StrataData.getStratas().splice(StrataData.getCurrentSelectedStrata(), 0, cmStrata);
         $scope.$emit('doUpdate', StrataData.getCurrentSelectedStrata());
         $scope.$emit('updateDraw');
         } else {
         cmStrata.relatedM = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];
         var cmStrata = natureFactory("CM");
         StrataData.getStratas().splice(StrataData.getCurrentSelectedStrata(), 0, cmStrata);
         var cpStrata = natureFactory("CP");
         StrataData.getStratas().splice(StrataData.getCurrentSelectedStrata(), 0, cpStrata);
         cmStrata.relatedCP = cpStrata;
         $scope.$emit('doUpdate', StrataData.getCurrentSelectedStrata());
         $scope.$emit('updateDraw');

         }
         } else {
         cmStrata.relatedM = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];
         var cmStrata = natureFactory("CM");
         StrataData.getStratas().splice(StrataData.getCurrentSelectedStrata(), 0, cmStrata);
         var cpStrata = natureFactory("CP");
         StrataData.getStratas().splice(StrataData.getCurrentSelectedStrata(), 0, cpStrata);
         cmStrata.relatedCP = cpStrata;
         $scope.$emit('doUpdate', StrataData.getCurrentSelectedStrata());
         $scope.$emit('updateDraw');
         }


         };*/
    });
