'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratTextureCtrl
 * @description
 * # StratTextureCtrl
 * Contrôlleur qui s'occupe de l'onglet de la texture
 */
angular.module('micorrApp')
    .controller('StratTextureCtrl', function ($scope, $route, $window, StrataData) {

        var initStratTexture = function(){
            $scope.porosityFamily = StrataData.getPorosityFamily()['characteristics'];
            $scope.cohesionFamily = StrataData.getCohesionFamily()['characteristics'];
            $scope.hardnessFamily = StrataData.getHardnessFamily()['characteristics'];
            $scope.crackingFamily = StrataData.getCrackingFamily()['characteristics'];

            //valeurs sélectionnées dans les champs de notre formulaire
            $scope.selectedPorosityFamily;
            $scope.selectedCohesionFamily;
            $scope.selectedHardnessFamily;
            $scope.selectedCrackingFamily;
        };

        $scope.$on('initShowStrat', function(event) {
            initStratTexture();
        });

         /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.$on('updateTexture', function(){
            var strata = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];

            if (strata.findDependency('porosityFamily'))
                $scope.selectedPorosityFamily = getCharacteristicByItsName($scope.porosityFamily, strata.getPorosityFamily());
            if (strata.findDependency('cohesionFamily'))
                $scope.selectedCohesionFamily = getCharacteristicByItsName($scope.cohesionFamily, strata.getCohesionFamily());
            if (strata.findDependency('hardnessFamily'))
                $scope.selectedHardnessFamily = getCharacteristicByItsName($scope.hardnessFamily, strata.getHardnessFamily());
            if (strata.findDependency('crackingFamily'))
                $scope.selectedCrackingFamily = getCharacteristicByItsName($scope.crackingFamily, strata.getCrackingFamily());
        });

         /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upTexture = function() {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            if (temp[index].findDependency('porosityFamily'))
                temp[index].setPorosityFamily($scope.selectedPorosityFamily.name);
            if (temp[index].findDependency('cohesionFamily'))
                temp[index].setCohesionFamily($scope.selectedCohesionFamily.name);
            if (temp[index].findDependency('hardnessFamily'))
                temp[index].setHardnessFamily($scope.selectedHardnessFamily.name);
            if (temp[index].findDependency('crackingFamily'))
                temp[index].setCrackingFamily($scope.selectedCrackingFamily.name);

            $scope.$emit('updateDraw');
        };
    });
