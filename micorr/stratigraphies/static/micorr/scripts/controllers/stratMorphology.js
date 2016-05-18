'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratMorphologyCtrl
 * @description
 * # StratMorphologyCtrl
 * Contrôlleur qui s'occupe de l'onglet de la morphologie
 */
angular.module('micorrApp')
    .controller('StratMorphologyCtrl', function ($scope, $route, $window, StrataData, StratigraphyData) {

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
        };

        $scope.$on('initShowStrat', function (event) {
            initStratMorphology();
        });

        /*
         * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         */
        $scope.$on('updateMorphology', function () {


            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];


            if (strata.getCharacteristicsByFamily("shapeFamily").length > 0) {
                $scope.selectedShapeFamily = getCharacteristicByItsName($scope.shapeFamily, strata.getCharacteristicsByFamily("shapeFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("widthFamily").length > 0) {
                $scope.selectedWidthFamily = getCharacteristicByItsName($scope.widthFamily, strata.getCharacteristicsByFamily("widthFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("thicknessFamily").length > 0) {
                $scope.selectedThicknessFamily = getCharacteristicByItsName($scope.thicknessFamily, strata.getCharacteristicsByFamily("thicknessFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("continuityFamily").length > 0) {
                $scope.selectedContinuityFamily = getCharacteristicByItsName($scope.continuityFamily, strata.getCharacteristicsByFamily("continuityFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("directionFamily").length > 0) {
                $scope.selectedDirectionFamily = getCharacteristicByItsName($scope.directionFamily, strata.getCharacteristicsByFamily("directionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("colourFamily").length > 0) {
                $scope.selectedColourFamily = getCharacteristicByItsName($scope.colourFamily, strata.getCharacteristicsByFamily("colourFamily")[0].getName());
            }

            if (strata.getCharacteristicsByFamily("brightnessFamily").length > 0) {
                $scope.selectedBrightnessFamily = getCharacteristicByItsName($scope.brightnessFamily, strata.getCharacteristicsByFamily("brightnessFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("opacityFamily").length > 0) {
                $scope.selectedOpacityFamily = getCharacteristicByItsName($scope.opacityFamily, strata.getCharacteristicsByFamily("opacityFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("magnetismFamily").length > 0) {
                $scope.selectedMagnetismFamily = getCharacteristicByItsName($scope.magnetismFamily, strata.getCharacteristicsByFamily("magnetismFamily")[0].getName());
            }

        });

        /*
         * Met à jour les données de la strate en fonction des valeurs dans le formulaire
         */
        $scope.upMorpho = function () {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            //A VOIR SI ON NE AJOUTE PAS UNE OPTION 'DEFAULT' OU 'NULL' DANS NEO4J
            if ($scope.selectedShapeFamily == null)
                temp[index].setShapeFamily("");
            else
                temp[index].setShapeFamily($scope.selectedShapeFamily.name);
            if ($scope.selectedWidthFamily == null)
                temp[index].setWidthFamily("");
            else
                temp[index].setWidthFamily($scope.selectedWidthFamily.name);
            if ($scope.selectedThicknessFamily == null)
                temp[index].setThicknessFamily("");
            else
                temp[index].setThicknessFamily($scope.selectedThicknessFamily.name);
            if ($scope.selectedContinuityFamily == null)
                temp[index].setContinuityFamily("");
            else
                temp[index].setContinuityFamily($scope.selectedContinuityFamily.name);
            if ($scope.selectedDirectionFamily == null)
                temp[index].setDirectionFamily("");
            else
                temp[index].setDirectionFamily($scope.selectedDirectionFamily.name);
            if (temp[index].findDependency('colourFamily')) {
                if ($scope.selectedColourFamily == null)
                    temp[index].setColourFamily("");
                else
                    temp[index].setColourFamily($scope.selectedColourFamily.name);
            }
            if (temp[index].findDependency('brightnessFamily')) {
                if ($scope.selectedBrightnessFamily == null)
                    temp[index].setBrightnessFamily("");
                else
                    temp[index].setBrightnessFamily($scope.selectedBrightnessFamily.name);
            }
            if (temp[index].findDependency('opacityFamily')) {
                if ($scope.selectedOpacityFamily == null)
                    temp[index].setOpacityFamily("");
                else
                    temp[index].setOpacityFamily($scope.selectedOpacityFamily.name);
            }
            if (temp[index].findDependency('magnetismFamily')) {
                if ($scope.selectedMagnetismFamily == null)
                    temp[index].setMagnetismFamily("");
                else
                    temp[index].setMagnetismFamily($scope.selectedMagnetismFamily.name);
            }
            //mise à jour du dessin
            $scope.$emit('updateDraw');
        };
    });
