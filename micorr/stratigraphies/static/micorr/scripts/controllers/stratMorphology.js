'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratMorphologyCtrl
 * @description
 * # StratMorphologyCtrl
 * Contrôlleur qui s'occupe de l'onglet de la morphologie
 */
angular.module('micorrApp')
    .controller('StratMorphologyCtrl', function ($scope, $route, $window, StrataData) {

        var initStratMorphology = function(){
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.fShapeFamily = "";
            $scope.shapeFamily = StrataData.getShapeFamily()['characteristics'];
            $scope.widthFamily = StrataData.getWidthFamily()['characteristics'];
            $scope.thicknessFamily = StrataData.getThicknessFamily()['characteristics'];
            $scope.continuityFamily = StrataData.getContinuityFamily()['characteristics'];
            $scope.directionFamily = StrataData.getDirectionFamily()['characteristics'];
            $scope.colourFamily = StrataData.getColourFamily()['characteristics'];
            $scope.brightnessFamily = StrataData.getBrightnessFamily()['characteristics'];
            $scope.opacityFamily = StrataData.getOpacityFamily()['characteristics'];
            $scope.magnetismFamily = StrataData.getMagnetismFamily()['characteristics'];

            //valeurs sélectionnées dans les champs de notre formulaire
            $scope.selectedShapeFamily;
            $scope.selectedWidthFamily;
            $scope.selectedThicknessFamily;
            $scope.selectedContinuityFamily;
            $scope.selectedDirectionFamily;
            $scope.selectedColourFamily;
            $scope.selectedBrightnessFamily;
            $scope.selectedOpacityFamily;
            $scope.selectedMagnetismFamily;
        };

        $scope.$on('initShowStrat', function(event) {
            initStratMorphology();
        });

         /*
         * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         */
        $scope.$on('updateMorphology', function(){
            var strata = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];
            $scope.selectedShapeFamily = getCharacteristicByItsName($scope.shapeFamily, strata.getShapeFamily());
            $scope.selectedWidthFamily = getCharacteristicByItsName($scope.widthFamily, strata.getWidthFamily());
            $scope.selectedThicknessFamily = getCharacteristicByItsName($scope.thicknessFamily, strata.getThicknessFamily());
            $scope.selectedContinuityFamily = getCharacteristicByItsName($scope.continuityFamily, strata.getContinuityFamily());
            $scope.selectedDirectionFamily = getCharacteristicByItsName($scope.directionFamily, strata.getDirectionFamily());

            if (strata.findDependency('colourFamily'))
                $scope.selectedColourFamily = getCharacteristicByItsName($scope.colourFamily, strata.getColourFamily());
            if (strata.findDependency('brightnessFamily'))
                $scope.selectedBrightnessFamily = getCharacteristicByItsName($scope.brightnessFamily, strata.getBrightnessFamily());
            if (strata.findDependency('opacityFamily'))
                $scope.selectedOpacityFamily = getCharacteristicByItsName($scope.opacityFamily, strata.getOpacityFamily());
            if (strata.findDependency('magnetismFamily'))
                $scope.selectedMagnetismFamily = getCharacteristicByItsName($scope.magnetismFamily, strata.getMagnetismFamily());


        });

         /*
         * Met à jour les données de la strate en fonction des valeurs dans le formulaire
         */
        $scope.upMorpho = function() {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            temp[index].setShapeFamily($scope.selectedShapeFamily.name);
            temp[index].setWidthFamily($scope.selectedWidthFamily.name);
            temp[index].setThicknessFamily($scope.selectedThicknessFamily.name);
            temp[index].setContinuityFamily($scope.selectedContinuityFamily.name);
            temp[index].setDirectionFamily($scope.selectedDirectionFamily.name);
            if (temp[index].findDependency('colourFamily'))
                temp[index].setColourFamily($scope.selectedColourFamily.name);
            if (temp[index].findDependency('brightnessFamily'))
                temp[index].setBrightnessFamily($scope.selectedBrightnessFamily.name);
            if (temp[index].findDependency('opacityFamily'))
                temp[index].setOpacityFamily($scope.selectedOpacityFamily.name);
            if (temp[index].findDependency('magnetismFamily'))
                temp[index].setMagnetismFamily($scope.selectedMagnetismFamily.name);

            //mise à jour du dessin
            $scope.$emit('updateDraw');
        };
    });
