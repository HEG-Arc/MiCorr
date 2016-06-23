'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratTextureCtrl
 * @description
 * # StratTextureCtrl
 * Contrôlleur qui s'occupe de l'onglet de la texture
 */
angular.module('micorrApp')
    .controller('StratTextureCtrl', function ($scope, $route, $window, StrataData, StratigraphyData) {

        //valeurs sélectionnées dans les champs de notre formulaire
        $scope.selectedPorosityFamily;
        $scope.selectedCohesionFamily;
        $scope.selectedHardnessFamily;
        $scope.selectedCrackingFamily;

        var initStratTexture = function () {
            $scope.porosityFamily = StratigraphyData.getPorosityFamily()['characteristics'];
            $scope.cohesionFamily = StratigraphyData.getCohesionFamily()['characteristics'];
            $scope.hardnessFamily = StratigraphyData.getHardnessFamily()['characteristics'];
            $scope.crackingFamily = StratigraphyData.getCrackingFamily()['characteristics'];
        };

        $scope.$on('initShowStrat', function (event) {
            initStratTexture();
        });

        /**
         * Cette fonction vide les champs et est appelée à chaque chargement du formulaire
         * pour éviter de garder des anciennes valeurs
         */
        function emptyFields() {
            $scope.selectedPorosityFamily = null;
            $scope.selectedCohesionFamily = null;
            $scope.selectedHardnessFamily = null;
            $scope.selectedCrackingFamily = null;
        }

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.$on('updateTexture', function () {
            emptyFields();

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if (strata.getCharacteristicsByFamily("porosityFamily").length > 0) {
                $scope.selectedPorosityFamily = getCharacteristicByItsName($scope.porosityFamily, strata.getCharacteristicsByFamily("porosityFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("cohesionFamily").length > 0) {
                $scope.selectedCohesionFamily = getCharacteristicByItsName($scope.cohesionFamily, strata.getCharacteristicsByFamily("cohesionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("hardnessFamily").length > 0) {
                $scope.selectedHardnessFamily = getCharacteristicByItsName($scope.hardnessFamily, strata.getCharacteristicsByFamily("hardnessFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("crackingFamily").length > 0) {
                $scope.selectedCrackingFamily = getCharacteristicByItsName($scope.crackingFamily, strata.getCharacteristicsByFamily("crackingFamily")[0].getName());
            }
        });

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upTexture = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if($scope.selectedPorosityFamily != null) {
                if (strata.findDependency('porosityFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("porosityFamily");
                    char.setName($scope.selectedPorosityFamily.name);
                    char.setRealName($scope.selectedPorosityFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
            if($scope.selectedCohesionFamily != null) {
                if (strata.findDependency('cohesionFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("cohesionFamily");
                    char.setName($scope.selectedCohesionFamily.name);
                    char.setRealName($scope.selectedCohesionFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
            if($scope.selectedHardnessFamily != null) {
                if (strata.findDependency('hardnessFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("hardnessFamily");
                    char.setName($scope.selectedHardnessFamily.name);
                    char.setRealName($scope.selectedHardnessFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
            if($scope.selectedCrackingFamily != null) {
                if (strata.findDependency('crackingFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("crackingFamily");
                    char.setName($scope.selectedCrackingFamily.name);
                    char.setRealName($scope.selectedCrackingFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
           $scope.$emit('updateSelectedStrata');
        };
    });
