'use strict';
import {Characteristic} from "../business/characteristic";
import {SubCharacteristic} from "../business/subCharacteristic";
import {getCharacteristicByItsName, getCharacteristicByItsNameMulti, returnSubCharacteristicsFromParent} from "../init";

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
        $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = [];
        $scope.selectedSubmmicrostructureFamily = [];
        $scope.selectedCmcpmicrostructureFamily = [];
        function emptyFields() {

            $scope.selectedCprimicrostructureFamily = null;
            $scope.selectedMmicrostructureFamily = null;
            $scope.selectedCmlevelofcorrosionFamily = null;
            /* cprimicrostructureaggregatecompositionFamily moved to stratComposition controller
            $scope.selectedCprimicrostructureaggregatecompositionFamily = null;
            */
            $scope.selectedSubcprimicrostructureaggregatecompositionFamily = null;
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = null;
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
            $scope.cprimicrostructureaggregatecompositionExtensionFamily = StratigraphyData.getCprimicrostructureaggregatecompositionextensionFamily()['characteristics'];
            $scope.subcprimicrostructureFamily = StratigraphyData.getSubcprimicrostructureFamily();
            $scope.subcprimicrostructureaggregatecompositionFamily = StratigraphyData.getSubcprimicrostructureaggregatecompositionFamily();
            $scope.subsubcprimicrostructureaggregatecompositionFamily = StratigraphyData.getSubsubcprimicrostructureaggregatecompositionFamily();
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

            if (strata.getCharacteristicsByFamily("cpriMicrostructureFamily").length > 0) {
                $scope.selectedCprimicrostructureFamily = getCharacteristicByItsName($scope.cprimicrostructureFamily, strata.getCharacteristicsByFamily("cpriMicrostructureFamily")[0].getName());
            }

            if (strata.getCharacteristicsByFamily("mMicrostructureFamily").length > 0) {
                $scope.selectedMmicrostructureFamily = getCharacteristicByItsName($scope.mmicrostructureFamily, strata.getCharacteristicsByFamily("mMicrostructureFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("cmLevelOfCorrosionFamily").length > 0) {
                $scope.selectedCmlevelofcorrosionFamily = getCharacteristicByItsName($scope.cmlevelofcorrosionFamily, strata.getCharacteristicsByFamily("cmLevelOfCorrosionFamily")[0].getName());
            }
            /* cprimicrostructureaggregatecompositionFamily moved to stratComposition controller
            if (strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily').length > 0) {
                $scope.selectedCprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.cprimicrostructureaggregatecompositionFamily, strata.getCharacteristicsByFamily("cpriMicrostructureAggregateCompositionFamily")[0].getName());
            }
            */
            //Reprise des characteristiques de microstructure pour la strate CM
            if (strata.getNature() == 'Corroded metal') {
                var CPChild = strata.getChildStrataByNature('Corrosion products');
                if (CPChild.getCharacteristicsByFamily("cmCpMicrostructureFamily").length > 0) {
                    $scope.selectedCmcpmicrostructureFamily = getCharacteristicByItsNameMulti($scope.cmcpmicrostructureFamily, CPChild.getCharacteristicsByFamily("cmCpMicrostructureFamily"));
                }
            }


            if (strata.getSubCharacteristicsByFamily('subcmlevelofcorrosionFamily').length > 0) {
                if (strata.findDependency('subcmlevelofcorrosionFamily')) {

                    $scope.selectedSubcmlevelofcorrosionFamily = getCharacteristicByItsName($scope.subcmlevelofcorrosionFamily, strata.getSubCharacteristicsByFamily('subcmlevelofcorrosionFamily')[0].getName());
                }
            }

            if (strata.getSubCharacteristicsByFamily('subcprimicrostructureFamily').length > 0) {
                if (strata.findDependency('subcprimicrostructureFamily')) {
                    $scope.selectedSubcprimicrostructureFamily = getCharacteristicByItsNameMulti($scope.subcprimicrostructureFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureFamily'));
                }
            }
            else{
                $scope.selectedSubcprimicrostructureFamily = [];
            }

            if (strata.getSubCharacteristicsByFamily('submmicrostructureFamily').length > 0) {
                if (strata.findDependency('submmicrostructureFamily')) {
                    $scope.selectedSubmmicrostructureFamily = getCharacteristicByItsNameMulti($scope.submmicrostructureFamily, strata.getSubCharacteristicsByFamily('submmicrostructureFamily'));
                }
            }
            else{
                $scope.selectedSubmmicrostructureFamily = [];
            }

            if (strata.getSubCharacteristicsByFamily('cprimicrostructureaggregatecompositionextensionFamily').length > 0) {
                if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily')) {
                    $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = getCharacteristicByItsNameMulti($scope.cprimicrostructureaggregatecompositionExtensionFamily, strata.getCharacteristicsByFamily('cprimicrostructureaggregatecompositionextensionFamily'));
                }
            }
            else{
                $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = [];
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

            /* cprimicrostructureaggregatecompositionFamily moved to stratComposition controller
            if ($scope.selectedCprimicrostructureaggregatecompositionFamily != null) {
                if (strata.findDependency('cprimicrostructureaggregatecompositionFamily')) {
                    var char = new Characteristic();
                    char.setFamily("cpriMicrostructureAggregateCompositionFamily");

                    char.setName($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
                    char.setRealName($scope.selectedCprimicrostructureaggregatecompositionFamily.real_name);

                    strata.replaceCharacteristic(char);
                }
            }
            */

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
                for (var i = 0; i < $scope.selectedSubmmicrostructureFamily.length; i++) {
                    var subChar = new SubCharacteristic();
                    subChar.setName($scope.selectedSubmmicrostructureFamily[i].name);
                    subChar.setUid($scope.selectedSubmmicrostructureFamily[i].uid);
                    subChar.setFamily('submmicrostructureFamily');
                    strata.addSubCharacteristic(subChar);
                }
            }

            if (strata.findDependency('subcprimicrostructureFamily')) {

                strata.clearSubCharacteristicsFromFamily('subcprimicrostructureFamily');
                for (var i = 0; i < $scope.selectedSubcprimicrostructureFamily.length; i++) {
                    var subChar = new SubCharacteristic();
                    var test = $scope.selectedSubcprimicrostructureFamily[i];
                    subChar.setName($scope.selectedSubcprimicrostructureFamily[i].name);
                    subChar.setUid($scope.selectedSubcprimicrostructureFamily[i].uid);
                    subChar.setFamily('subcprimicrostructureFamily')
                    strata.addSubCharacteristic(subChar);
                }
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


        /* est appelé quand la valeur du champ cprimicrostructurecompositionextension change
         * sert à mettre  jour les données des formulaire
         */
        $scope.upMicrostructure2 = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCharacteristicByFamily('cpriMicrostructureAggregateCompositionFamily')[0].getName(), '');
            $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily'));

            $scope.$emit('updateFormOnly');
        };

        /* est appelé quand la valeur du champ subcprimicrostructurecompositionextension change
         * sert à mettre  jour les données des formulaire
         * Cette méthode n'est plus utilisée
         */
        $scope.upMicrostructure3 = function () {
            /* CETTE METHODE NE DEVRAIT PLUS ETRE UTILISEE
            */
            $scope.$emit('updateFormOnly');
        };


    });
