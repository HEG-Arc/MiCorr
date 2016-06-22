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

        /**
         * Cette fonction vide les champs et est appelée à chaque chargement du formulaire
         * pour éviter de garder des anciennes valeurs
         */
        function emptyFields(){
            $scope.selectedShapeFamily = null;
            $scope.selectedWidthFamily = null;
            $scope.selectedThicknessFamily = null;
            $scope.selectedContinuityFamily = null;
            $scope.selectedDirectionFamily = null;
            $scope.selectedColourFamily = null;
            $scope.selectedBrightnessFamily = null;
            $scope.selectedOpacityFamily = null;
            $scope.selectedMagnetismFamily = null;
        }

        /*
         * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         */
        $scope.$on('updateMorphology', function () {

            emptyFields();

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
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];


            if ($scope.selectedShapeFamily != null) {

                var char = new characteristic.Characteristic();
                char.setFamily("shapeFamily");
                char.setName($scope.selectedShapeFamily.name);
                char.setRealName($scope.selectedShapeFamily.real_name);
                strata.replaceCharacteristic(char);
            }

            if ($scope.selectedWidthFamily != null) {
                var char = new characteristic.Characteristic();
                char.setFamily("widthFamily");
                char.setName($scope.selectedWidthFamily.name);
                char.setRealName($scope.selectedWidthFamily.real_name);
                strata.replaceCharacteristic(char);
            }
            if ($scope.selectedThicknessFamily != null) {
                var char = new characteristic.Characteristic();
                char.setFamily("thicknessFamily");
                char.setName($scope.selectedThicknessFamily.name);
                char.setRealName($scope.selectedThicknessFamily.real_name);
                strata.replaceCharacteristic(char);
            }
            if ($scope.selectedContinuityFamily != null) {
                var char = new characteristic.Characteristic();
                char.setFamily("continuityFamily");
                char.setName($scope.selectedContinuityFamily.name);
                char.setRealName($scope.selectedContinuityFamily.real_name);
                strata.replaceCharacteristic(char);
            }

            if ($scope.selectedDirectionFamily != null) {
                var char = new characteristic.Characteristic();
                char.setFamily("directionFamily");
                char.setName($scope.selectedDirectionFamily.name);
                char.setRealName($scope.selectedDirectionFamily.real_name);
                strata.replaceCharacteristic(char);
            }
            if ($scope.selectedColourFamily != null) {
                if (strata.findDependency('colourFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("colourFamily");
                    char.setName($scope.selectedColourFamily.name);
                    char.setRealName($scope.selectedColourFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }

            if ($scope.selectedBrightnessFamily != null) {
                if (strata.findDependency('brightnessFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("brightnessFamily");
                    char.setName($scope.selectedBrightnessFamily.name);
                    char.setRealName($scope.selectedBrightnessFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
            if ($scope.selectedOpacityFamily != null) {
                if (strata.findDependency('opacityFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("opacityFamily");
                    char.setName($scope.selectedOpacityFamily.name);
                    char.setRealName($scope.selectedOpacityFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
            if ($scope.selectedMagnetismFamily != null) {
                if (strata.findDependency('magnetismFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("magnetismFamily");
                    char.setName($scope.selectedMagnetismFamily.name);
                    char.setRealName($scope.selectedMagnetismFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }
            //mise à jour du dessin
            $scope.$emit('updateSelectedStrata');
        };

    });
