'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratMicrostructureCtrl
 * @description
 * # StratMicrostructureCtrl
 * Contrôlleur qui s'occupe de l'onglet de la microstructure
 */
angular.module('micorrApp')
    .controller('StratMicrostructureCtrl', function ($scope, $route, $window, StrataData, StratigraphyData) {

        //valeurs sélectionnées dans les champs de notre formulaire
        $scope.selectedCprimicrostructureFamily;
        $scope.selectedMmicrostructureFamily;
        $scope.selectedCmlevelofcorrosionFamily;
        $scope.selectedSubcprimicrostructureFamily = [];
        $scope.selectedCprimicrostructureaggregatecompositionFamily;
        $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = [];
        $scope.selectedSubcprimicrostructureaggregatecompositionFamily;
        $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily;
        $scope.selectedSubcmlevelofcorrosionFamily;
        $scope.selectedSubmmicrostructureFamily = [];

        var initMicrostructure = function () {
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.cprimicrostructureFamily = StratigraphyData.getCprimicrostructureFamily()['characteristics'];
            $scope.mmicrostructureFamily = StratigraphyData.getMmicrostructureFamily()['characteristics'];
            $scope.cmlevelofcorrosionFamily = StratigraphyData.getCmlevelofcorrosionFamily()['characteristics'];
            $scope.cprimicrostructureaggregatecompositionFamily = StratigraphyData.getCprimicrostructureaggregatecompositionFamily()['characteristics'];
            $scope.cprimicrostructureaggregatecompositionExtensionFamily = StratigraphyData.getCprimicrostructureaggregatecompositionextensionFamily()['characteristics'];
            $scope.subcprimicrostructureFamily = StratigraphyData.getSubcprimicrostructureFamily();
            $scope.subcprimicrostructureaggregatecompositionFamily = StratigraphyData.getSubcprimicrostructureaggregatecompositionFamily();
            $scope.subsubcprimicrostructureaggregatecompositionFamily = StratigraphyData.getSubsubcprimicrostructureaggregatecompositionFamily();
            $scope.subcmlevelofcorrosionFamily = StratigraphyData.getSubcmLevelOfCorrosionFamily();
            $scope.submmicrostructureFamily = StratigraphyData.getSubmmicrostructureFamily();
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
            if (strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily').length > 0) {
                $scope.selectedCprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.cprimicrostructureaggregatecompositionFamily, strata.getCprimicrostructureaggregateCompositionFamily());
            }

            /* TODO: Sous characteristique dans le formulaire
             // en fonction des données dans cprimicrostructureaggregatecomposition on change les données du formulaire
             if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')) {
             $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCprimicrostructureaggregateCompositionFamily(), '');
             $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubcprimicrostructureaggregateCompositionFamily());
             }
             // en fonction des données dans subcprimicrostructureaggregatecomposition on change les données du formulaire
             if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')) {
             $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCprimicrostructureaggregateCompositionFamily(), strata.getSubcprimicrostructureaggregateCompositionFamily());
             $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subsubcprimicrostructureaggregatecompositionFamily, strata.getSubsubcprimicrostructureaggregateCompositionFamily());
             }
             if (strata.findDependency('subcmlevelofcorrosionFamily'))
             $scope.selectedSubcmlevelofcorrosionFamily = getCharacteristicByItsName($scope.subcmlevelofcorrosionFamily, strata.getSubCmLevelOfCorrosionFamily());
             if (strata.findDependency('subcprimicrostructureFamily'))
             $scope.selectedSubcprimicrostructureFamily = getCharacteristicByItsNameMulti($scope.subcprimicrostructureFamily, strata.getSubcprimicrostructureFamily());
             if (strata.findDependency('submmicrostructureFamily'))
             $scope.selectedSubmmicrostructureFamily = getCharacteristicByItsNameMulti($scope.submmicrostructureFamily, strata.getSubmmicrostructureFamily());
             if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily'))
             $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = getCharacteristicByItsNameMulti($scope.cprimicrostructureaggregatecompositionExtensionFamily, strata.getCprimicrostructureaggregateCompositionextensionFamily());
             */
        });

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upMicrostructure = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if (strata.findDependency('cprimicrostructureFamily')) {
            var char = new characteristic.Characteristic();
            char.setFamily("cpriMicrostructureFamily");
            char.setName($scope.selectedCprimicrostructureFamily.name);
            char.setRealName($scope.selectedCprimicrostructureFamily.real_name);
            strata.replaceCharacteristic(char);
            }

            if (strata.findDependency('mmicrostructureFamily')) {
            var char = new characteristic.Characteristic();
            char.setFamily("mMicrostructureFamily");
            char.setName($scope.selectedMmicrostructureFamily.name);
            char.setRealName($scope.selectedMmicrostructureFamily.real_name);
            strata.replaceCharacteristic(char);
            }
            if (strata.findDependency('cmlevelofcorrosionFamily')) {
            var char = new characteristic.Characteristic();
            char.setFamily("cmLevelOfCorrosionFamily");
            char.setName($scope.selectedCmlevelofcorrosionFamily.name);
            char.setRealName($scope.selectedCmlevelofcorrosionFamily.real_name);
            strata.replaceCharacteristic(char);
            }
            if (strata.findDependency('cprimicrostructureaggregatecompositionFamily')) {
            var char = new characteristic.Characteristic();
            char.setFamily("cpriMicrostructureAggregateCompositionFamily");
            char.setName($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
            char.setRealName($scope.selectedCprimicrostructureaggregatecompositionFamily.real_name);
            strata.replaceCharacteristic(char);
            }
            if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily')) {
            var char = new characteristic.Characteristic();
            char.setFamily("cpriMicrostructureaggregateCompositionExtensionFamily");
            char.setName($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily.name);
            char.setRealName($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily.real_name);
            strata.replaceCharacteristic(char);
            }


            /* TODO: Sous caracteristiques
            if (temp[index].findDependency('subcmlevelofcorrosionFamily'))
                temp[index].setSubCmLevelOfCorrosionFamily($scope.selectedSubcmlevelofcorrosionFamily.name);
            if (temp[index].findDependency('submmicrostructureFamily'))
                temp[index].setSubmmicrostructureFamily($scope.selectedSubmmicrostructureFamily);
            if (temp[index].findDependency('subcprimicrostructureFamily'))
                temp[index].setSubcprimicrostructureFamily($scope.selectedSubcprimicrostructureFamily);
            if (temp[index].findDependency('subcprimicrostructureaggregatecompositionFamily'))
                temp[index].setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
            if (temp[index].findDependency('subsubcprimicrostructureaggregatecompositionFamily'))
                temp[index].setSubsubcprimicrostructureaggregateCompositionFamily($scope.selectedSubsubcprimicrostructureaggregatecompositionFamily.name);
            */
            $scope.$emit('updateDraw');
            //Update formulaire pour afficher/masquer les sub/cpri microstructure
            $scope.$emit('updateFormOnly');
        };


        /* est appelé quand la valeur du champ cprimicrostructurecompositionextension change
         * sert à mettre  jour les données des formulaire
         * @params
         * @returns
         */
        $scope.upMicrostructure2 = function () {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            temp[index].setCprimicrostructureaggregateCompositionFamily($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
            $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), '');
            $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubcprimicrostructureaggregateCompositionFamily());

            $scope.$emit('updateFormOnly');
        };

        /* est appelé quand la valeur du champ subcprimicrostructurecompositionextension change
         * sert à mettre  jour les données des formulaire
         * @params
         * @returns
         */
        $scope.upMicrostructure3 = function () {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            temp[index].setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
            $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), temp[index].getSubcprimicrostructureaggregateCompositionFamily());
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubsubcprimicrostructureaggregateCompositionFamily());

            $scope.$emit('updateFormOnly');
        };

    });
