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

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.$on('updateTexture', function () {

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

            if (strata.findDependency('porosityFamily')) {
            var char = new characteristic.Characteristic();
            char.setFamily("porosityFamily");
            char.setName($scope.selectedPorosityFamily.name);
            char.setRealName($scope.selectedPorosityFamily.real_name);
            strata.addCharacteristic(char);
            }
            /*
            if (temp[index].findDependency('cohesionFamily'))
                temp[index].setCohesionFamily($scope.selectedCohesionFamily.name);
            if (temp[index].findDependency('hardnessFamily'))
                temp[index].setHardnessFamily($scope.selectedHardnessFamily.name);
            if (temp[index].findDependency('crackingFamily'))
                temp[index].setCrackingFamily($scope.selectedCrackingFamily.name);

            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            /*
            if (temp[index].findDependency('porosityFamily'))
                temp[index].setPorosityFamily($scope.selectedPorosityFamily.name);
            if (temp[index].findDependency('cohesionFamily'))
                temp[index].setCohesionFamily($scope.selectedCohesionFamily.name);
            if (temp[index].findDependency('hardnessFamily'))
                temp[index].setHardnessFamily($scope.selectedHardnessFamily.name);
            if (temp[index].findDependency('crackingFamily'))
                temp[index].setCrackingFamily($scope.selectedCrackingFamily.name);
            */
            $scope.$emit('updateDraw');
        };
    });
