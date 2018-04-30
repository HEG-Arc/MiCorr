'use strict';
import {Characteristic} from "../business/characteristic";
import {SubCharacteristic} from "../business/subCharacteristic";
import {getSelectedFamilyCharacteristic, getSelectedFamilyCharacteristicList} from "../init";

/**
 * @ngdoc function
 * @name micorrApp.controller:StratMicrostructureCtrl
 * @description
 * # StratMicrostructureCtrl
 * Contrôlleur qui s'occupe de l'onglet de la microstructure
 */
angular.module('micorrApp')
    .controller('StratMicrostructureCtrl', function ($scope, $route, $window, StratigraphyData) {

        //valeurs sélectionnées dans les champs de notre formulaire
        //todo DRY check - update then replace following statements by call to emptyFields
        $scope.selectedSubcprimicrostructureFamily = [];
        $scope.selectedSubmmicrostructureFamily = [];
        $scope.selectedCmcpmicrostructureFamily = [];
        function emptyFields() {

            $scope.selectedCprimicrostructureFamily = null;
            $scope.selectedMmicrostructureFamily = null;
            $scope.selectedCmlevelofcorrosionFamily = null;
            $scope.selectedSubcmlevelofcorrosionFamily = null;
            $scope.selectedCmcpmicrostructureFamily = [];

            $scope.selectedSubmmicrostructureFamily = [];
        }
        var initMicrostructure = function () {
            emptyFields(); //todo regression tests - caution here the last two lines of emptyFields were not executed in previous commit
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.cprimicrostructureFamily = StratigraphyData.getCprimicrostructureFamily()['characteristics'];

            $scope.mmicrostructureFamily = StratigraphyData.getMmicrostructureFamily()['characteristics'];
            $scope.cmlevelofcorrosionFamily = StratigraphyData.getCmlevelofcorrosionFamily()['characteristics'];
            $scope.subcprimicrostructureFamily = StratigraphyData.getSubcprimicrostructureFamily();
            $scope.subcmlevelofcorrosionFamily = StratigraphyData.getSubcmLevelOfCorrosionFamily();
            $scope.submmicrostructureFamily = StratigraphyData.getSubmmicrostructureFamily();
            $scope.cmcpmicrostructureFamily = StratigraphyData.getCmcpmicrostructureFamily()['characteristics'];

            $scope.descriptions = StratigraphyData.descriptions;
        };

        $scope.$on('initShowStrat', function (event) {
            if (typeof StratigraphyData.getCprimicrostructureFamily() !== "undefined") {
                initMicrostructure();
            }
        });

        $scope.upMulti = function () {
            $scope.upMicrostructure();
        };

        /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         * @params
         * @returns
         */
        $scope.$on('updateMicrostructure', function () {
            emptyFields();

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            $scope.selectedCprimicrostructureFamily = getSelectedFamilyCharacteristic(strata, "cpriMicrostructureFamily", $scope.cprimicrostructureFamily);
            $scope.selectedMmicrostructureFamily = getSelectedFamilyCharacteristic(strata, "mMicrostructureFamily", $scope.mmicrostructureFamily);
            $scope.selectedCmlevelofcorrosionFamily = getSelectedFamilyCharacteristic(strata, "cmLevelOfCorrosionFamily", $scope.cmlevelofcorrosionFamily);

            //Reprise des characteristiques de microstructure pour la strate CM
            if (strata.getNature() == 'Corroded metal') {
                let CPChild = strata.getChildStrataByNature('Corrosion products');
                $scope.selectedCmcpmicrostructureFamily = getSelectedFamilyCharacteristicList(CPChild, "cmCpMicrostructureFamily", $scope.cmcpmicrostructureFamily);
            }


            let subcmlevelofcorrosionCharacteristics = strata.getSubCharacteristicsByFamily('subcmlevelofcorrosionFamily');
            if (subcmlevelofcorrosionCharacteristics.length > 0) {
                if (strata.findDependency('subcmlevelofcorrosionFamily')) {
                    $scope.selectedSubcmlevelofcorrosionFamily = getCharacteristicByItsName($scope.subcmlevelofcorrosionFamily, subcmlevelofcorrosionCharacteristics[0].getName());
                }
            }
            let subcprimicrostructureCharacteristics = strata.getSubCharacteristicsByFamily('subcprimicrostructureFamily');
            if (subcprimicrostructureCharacteristics.length > 0) {
                $scope.selectedSubcprimicrostructureFamily = $scope.selectedCprimicrostructureFamily.subcharacteristics.filter(
                    e => subcprimicrostructureCharacteristics.find(sc => sc.name == e.sub_real_name));
            }
            else{
                $scope.selectedSubcprimicrostructureFamily = [];
            }
            let submmicrostructureCharacteristics = strata.getSubCharacteristicsByFamily('submmicrostructureFamily');
            if (submmicrostructureCharacteristics.length > 0) {
                $scope.selectedSubmmicrostructureFamily = $scope.selectedMmicrostructureFamily.subcharacteristics.filter(
                    e => submmicrostructureCharacteristics.find(sc => sc.name == e.sub_real_name));
            }
            else{
                $scope.selectedSubmmicrostructureFamily = [];
            }
        });

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upMicrostructure = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];


            if ($scope.selectedCprimicrostructureFamily != null) {
                if (strata.findDependency('cprimicrostructureFamily')) {
                    var char = new Characteristic();
                    char.setFamily("cpriMicrostructureFamily");
                    char.setName($scope.selectedCprimicrostructureFamily.name);
                    char.setRealName($scope.selectedCprimicrostructureFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }


            if ($scope.selectedMmicrostructureFamily != null) {
                if (strata.findDependency('mmicrostructureFamily')) {
                    var char = new Characteristic();
                    char.setFamily("mMicrostructureFamily");


                    char.setName($scope.selectedMmicrostructureFamily.name);
                    char.setRealName($scope.selectedMmicrostructureFamily.real_name);


                    strata.replaceCharacteristic(char);
                }
            }

            if ($scope.selectedCmlevelofcorrosionFamily != null) {

                if (strata.findDependency('cmlevelofcorrosionFamily')) {
                    var char = new Characteristic();
                    char.setFamily("cmLevelOfCorrosionFamily");

                    char.setName($scope.selectedCmlevelofcorrosionFamily.name);
                    char.setRealName($scope.selectedCmlevelofcorrosionFamily.real_name);

                    strata.replaceCharacteristic(char);
                }
            }


            if ($scope.selectedSubcmlevelofcorrosionFamily != null) {
                if (strata.findDependency('subcmlevelofcorrosionFamily')) {
                    var subChar = new SubCharacteristic();
                    subChar.setFamily('subcmlevelofcorrosionFamily');

                    subChar.setName($scope.selectedSubcmlevelofcorrosionFamily.name);


                    strata.replaceSubCharacteristic(subChar);
                }
            }

            if (strata.findDependency('submmicrostructureFamily')) {
                strata.clearSubCharacteristicsFromFamily('submmicrostructureFamily');
                for (let sc of $scope.selectedSubmmicrostructureFamily)
                    strata.addSubCharacteristic(new SubCharacteristic('submmicrostructureFamily',sc));
            }

            if (strata.findDependency('subcprimicrostructureFamily')) {
                strata.clearSubCharacteristicsFromFamily('subcprimicrostructureFamily');
                for (let sc of $scope.selectedSubcprimicrostructureFamily)
                    strata.addSubCharacteristic(new SubCharacteristic('subcprimicrostructureFamily',sc));
            }

            if (strata.getNature() == 'Corroded metal') {
                //Strate enfant CP
                var childCP = strata.getChildStrataByNature('Corrosion products');
                childCP.clearCharacteristicsFromFamily('cmCpMicrostructureFamily');
                for (var i = 0; i < $scope.selectedCmcpmicrostructureFamily.length; i++) {
                    var char = new Characteristic();
                    char.setFamily("cmCpMicrostructureFamily");
                    char.setName($scope.selectedCmcpmicrostructureFamily[i].name);
                    char.setRealName($scope.selectedCmcpmicrostructureFamily[i].real_name);
                    childCP.addCharacteristic(char);
                }
            }

            $scope.$emit('updateSelectedStrata');
            //Update formulaire pour afficher/masquer les sub/cpri microstructure
            $scope.$emit('updateFormOnly');
        };

    });
