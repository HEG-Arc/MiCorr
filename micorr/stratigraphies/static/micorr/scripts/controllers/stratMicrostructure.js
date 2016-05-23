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
                $scope.selectedCprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.cprimicrostructureaggregatecompositionFamily, strata.getCharacteristicsByFamily("cpriMicrostructureAggregateCompositionFamily")[0].getName());
            }


            // en fonction des données dans cprimicrostructureaggregatecomposition on change les données du formulaire
            if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')) {
                $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily')[0].getName(), '');
                $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily')[0].getName());
            }
            // en fonction des données dans subcprimicrostructureaggregatecomposition on change les données du formulaire
            if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')) {
                $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily'), strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily'));
                $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subsubcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily'));
            }


            if (strata.findDependency('subcmlevelofcorrosionFamily'))
                $scope.selectedSubcmlevelofcorrosionFamily = getCharacteristicByItsName($scope.subcmlevelofcorrosionFamily, strata.getSubCharacteristicsByFamily('subcmlevelofcorrosionFamily')[0].getName());
            if (strata.findDependency('subcprimicrostructureFamily'))
                $scope.selectedSubcprimicrostructureFamily = getCharacteristicByItsNameMulti($scope.subcprimicrostructureFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureFamily'));
            if (strata.findDependency('submmicrostructureFamily'))
                $scope.selectedSubmmicrostructureFamily = getCharacteristicByItsNameMulti($scope.submmicrostructureFamily, strata.getSubCharacteristicsByFamily('submmicrostructureFamily'));
            if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily'))
                $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = getCharacteristicByItsNameMulti($scope.cprimicrostructureaggregatecompositionExtensionFamily, strata.getCharacteristicsByFamily('cprimicrostructureaggregatecompositionextensionFamily'));
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

                if ($scope.selectedMmicrostructureFamily != undefined) {
                    char.setName($scope.selectedMmicrostructureFamily.name);
                    char.setRealName($scope.selectedMmicrostructureFamily.real_name);
                }
                else {
                    char.setName = "";
                    char.setRealName = "";
                }

                strata.replaceCharacteristic(char);
            }


            if (strata.findDependency('cmlevelofcorrosionFamily')) {
                var char = new characteristic.Characteristic();
                char.setFamily("cmLevelOfCorrosionFamily");
                if ($scope.selectedCmlevelofcorrosionFamily != undefined) {
                    char.setName($scope.selectedCmlevelofcorrosionFamily.name);
                    char.setRealName($scope.selectedCmlevelofcorrosionFamily.real_name);
                }
                else {
                    char.setName = "";
                    char.setRealName = "";
                }
                strata.replaceCharacteristic(char);
            }


            if (strata.findDependency('cprimicrostructureaggregatecompositionFamily')) {
                var char = new characteristic.Characteristic();
                char.setFamily("cpriMicrostructureAggregateCompositionFamily");
                if ($scope.selectedCprimicrostructureaggregatecompositionFamily != undefined) {
                    char.setName($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
                    char.setRealName($scope.selectedCprimicrostructureaggregatecompositionFamily.real_name);
                }
                else {
                    char.setName = "";
                    char.setRealName = "";
                }
                strata.replaceCharacteristic(char);
            }


            if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily')) {
                var char = new characteristic.Characteristic();
                char.setFamily("cpriMicrostructureaggregateCompositionExtensionFamily");
                if ($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily != undefined) {
                    char.setName($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily.name);
                    char.setRealName($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily.real_name);
                }
                else {
                    char.setName = "";
                    char.setRealName = "";
                }
                strata.replaceCharacteristic(char);
            }


            if (strata.findDependency('subcmlevelofcorrosionFamily')) {
                var subChar = new subCharacteristic.SubCharacteristic();
                subChar.setFamily('subcmlevelofcorrosionFamily');
                if($scope.selectedSubcmlevelofcorrosionFamily != undefined) {
                    subChar.setName($scope.selectedSubcmlevelofcorrosionFamily.name);
                }
                else{
                    subChar.setName("");
                }
                strata.replaceSubCharacteristic(subChar);
            }

            if (strata.findDependency('submmicrostructureFamily')) {

                strata.clearSubCharacteristicsFromFamily('submmicrostructureFamily');
                var test = strata.getSubCharacteristicsByFamily('submmicrostructureFamily');
                for (var i = 0; i < $scope.selectedSubmmicrostructureFamily.length; i++) {
                    var subChar = new subCharacteristic.SubCharacteristic();
                    subChar.setName($scope.selectedSubmmicrostructureFamily[i].name);
                    subChar.setFamily('submmicrostructureFamily');
                    strata.addSubCharacteristic(subChar);
                }
            }

            if (strata.findDependency('subcprimicrostructureFamily')) {

                strata.clearSubCharacteristicsFromFamily('subcprimicrostructureFamily');
                for (var i = 0; i < $scope.selectedSubcprimicrostructureFamily.length; i++) {
                    var subChar = new subCharacteristic.SubCharacteristic();
                    subChar.setName($scope.selectedSubcprimicrostructureFamily[i].name);
                    subChar.setFamily('subcprimicrostructureFamily')
                    strata.addSubCharacteristic(subChar);
                }
            }

            if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')) {
                var subChar = new subCharacteristic.SubCharacteristic();
                subChar.setFamily('subcprimicrostructureaggregatecompositionFamily');
                if($scope.selectedSubcprimicrostructureaggregatecompositionFamily != undefined) {
                    subChar.setName($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
                }
                else{
                    subChar.setName("");
                }
                strata.replaceSubCharacteristic(subChar);
            }
            if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')) {
                var subChar = new subCharacteristic.SubCharacteristic();
                subChar.setFamily('subsubcprimicrostructureaggregatecompositionFamily');
                if($scope.selectedSubsubcprimicrostructureaggregatecompositionFamily != undefined) {
                    subChar.setName($scope.selectedSubsubcprimicrostructureaggregatecompositionFamily.name);
                }
                else{
                    subChar.setName("");
                }
                strata.replaceSubCharacteristic(subChar);
            }

            $scope.$emit('updateDraw');
            //Update formulaire pour afficher/masquer les sub/cpri microstructure
            $scope.$emit('updateFormOnly');
        };


        /* est appelé quand la valeur du champ cprimicrostructurecompositionextension change
         * sert à mettre  jour les données des formulaire
         */
        $scope.upMicrostructure2 = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            var char = new characteristic.Characteristic();
            char.setName($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
            char.setFamily('cpriMicrostructureAggregateCompositionFamily');
            strata.replaceCharacteristic(char);


            $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCharacteristicByFamily('cpriMicrostructureAggregateCompositionFamily')[0].getName(), '');
            $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily'));

            $scope.$emit('updateFormOnly');
        };

        /* est appelé quand la valeur du champ subcprimicrostructurecompositionextension change
         * sert à mettre  jour les données des formulaire
         */
        $scope.upMicrostructure3 = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            var char = new characteristic.Characteristic();
            char.setName($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
            char.setFamily('subsubcprimicrostructureaggregatecompositionFamily');
            strata.replaceCharacteristic(char);

            $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCharacteristicsByFamily('cprimicrostructureaggregatecompositionFamily')[0].getName(), strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily')[0].getName());
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subsubcprimicrostructureaggregatecompositionFamily')[0].getName());

            $scope.$emit('updateFormOnly');
        };

    });
