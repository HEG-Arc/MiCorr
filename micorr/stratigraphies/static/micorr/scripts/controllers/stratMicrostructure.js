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
            $scope.selectedCprimicrostructureFamily = null;
            $scope.selectedMmicrostructureFamily = null;
            $scope.selectedCmlevelofcorrosionFamily = null;

            $scope.selectedCprimicrostructureaggregatecompositionFamily = null;

            $scope.selectedSubcprimicrostructureaggregatecompositionFamily = null;
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = null;
            $scope.selectedSubcmlevelofcorrosionFamily = null;

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

        function emptyFields() {
            $scope.selectedCprimicrostructureFamily = null;
            $scope.selectedMmicrostructureFamily = null;
            $scope.selectedCmlevelofcorrosionFamily = null;

            $scope.selectedCprimicrostructureaggregatecompositionFamily = null;

            $scope.selectedSubcprimicrostructureaggregatecompositionFamily = null;
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = null;
            $scope.selectedSubcmlevelofcorrosionFamily = null;
        }

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
            if (strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily').length > 0) {
                $scope.selectedCprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.cprimicrostructureaggregatecompositionFamily, strata.getCharacteristicsByFamily("cpriMicrostructureAggregateCompositionFamily")[0].getName());
            }


            /* PLUS UTILISE
            // en fonction des données dans cprimicrostructureaggregatecomposition on change les données du formulaire
            if (strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily').length > 0) {
                if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')) {
                    $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily')[0].getName(), '');
                    $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily')[0].getName());
                }
            }
            // en fonction des données dans subcprimicrostructureaggregatecomposition on change les données du formulaire
            if (strata.getSubCharacteristicsByFamily('subsubcprimicrostructureaggregatecompositionFamily').length > 0) {
                if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')) {
                    $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily'), strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily'));
                    $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subsubcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily'));
                }
            }
            */

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
            if (strata.getSubCharacteristicsByFamily('submmicrostructureFamily').length > 0) {
                if (strata.findDependency('submmicrostructureFamily')) {
                    $scope.selectedSubmmicrostructureFamily = getCharacteristicByItsNameMulti($scope.submmicrostructureFamily, strata.getSubCharacteristicsByFamily('submmicrostructureFamily'));
                }
            }
            if (strata.getSubCharacteristicsByFamily('cprimicrostructureaggregatecompositionextensionFamily').length > 0) {
                if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily')) {
                    $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = getCharacteristicByItsNameMulti($scope.cprimicrostructureaggregatecompositionExtensionFamily, strata.getCharacteristicsByFamily('cprimicrostructureaggregatecompositionextensionFamily'));
                }
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
                    var char = new characteristic.Characteristic();
                    char.setFamily("cpriMicrostructureFamily");
                    char.setName($scope.selectedCprimicrostructureFamily.name);
                    char.setRealName($scope.selectedCprimicrostructureFamily.real_name);
                    strata.replaceCharacteristic(char);
                }
            }


            if ($scope.selectedMmicrostructureFamily != null) {
                if (strata.findDependency('mmicrostructureFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("mMicrostructureFamily");


                    char.setName($scope.selectedMmicrostructureFamily.name);
                    char.setRealName($scope.selectedMmicrostructureFamily.real_name);


                    strata.replaceCharacteristic(char);
                }
            }

            if ($scope.selectedCmlevelofcorrosionFamily != null) {

                if (strata.findDependency('cmlevelofcorrosionFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("cmLevelOfCorrosionFamily");

                    char.setName($scope.selectedCmlevelofcorrosionFamily.name);
                    char.setRealName($scope.selectedCmlevelofcorrosionFamily.real_name);

                    strata.replaceCharacteristic(char);
                }
            }


            if ($scope.selectedCprimicrostructureaggregatecompositionFamily != null) {
                if (strata.findDependency('cprimicrostructureaggregatecompositionFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("cpriMicrostructureAggregateCompositionFamily");

                    char.setName($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
                    char.setRealName($scope.selectedCprimicrostructureaggregatecompositionFamily.real_name);

                    strata.replaceCharacteristic(char);
                }
            }


            if ($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily != null) {
                if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily("cpriMicrostructureaggregateCompositionExtensionFamily");

                    char.setName($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily.name);
                    char.setRealName($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily.real_name);

                    strata.replaceCharacteristic(char);
                }
            }


            if ($scope.selectedSubcmlevelofcorrosionFamily != null) {
                if (strata.findDependency('subcmlevelofcorrosionFamily')) {
                    var subChar = new subCharacteristic.SubCharacteristic();
                    subChar.setFamily('subcmlevelofcorrosionFamily');

                    subChar.setName($scope.selectedSubcmlevelofcorrosionFamily.name);


                    strata.replaceSubCharacteristic(subChar);
                }
            }

            if (strata.findDependency('submmicrostructureFamily')) {
                strata.clearSubCharacteristicsFromFamily('submmicrostructureFamily');
                for (var i = 0; i < $scope.selectedSubmmicrostructureFamily.length; i++) {
                    var subChar = new subCharacteristic.SubCharacteristic();
                    subChar.setName($scope.selectedSubmmicrostructureFamily[i].name);
                    subChar.setUid($scope.selectedSubmmicrostructureFamily[i].uid);
                    subChar.setFamily('submmicrostructureFamily');
                    strata.addSubCharacteristic(subChar);
                }
            }

            if (strata.findDependency('subcprimicrostructureFamily')) {

                strata.clearSubCharacteristicsFromFamily('subcprimicrostructureFamily');
                for (var i = 0; i < $scope.selectedSubcprimicrostructureFamily.length; i++) {
                    var subChar = new subCharacteristic.SubCharacteristic();
                    var test = $scope.selectedSubcprimicrostructureFamily[i];
                    subChar.setName($scope.selectedSubcprimicrostructureFamily[i].name);
                    subChar.setUid($scope.selectedSubcprimicrostructureFamily[i].uid);
                    subChar.setFamily('subcprimicrostructureFamily')
                    strata.addSubCharacteristic(subChar);
                }
            }

            /* PLUS UTILISE
            if ($scope.selectedSubcprimicrostructureaggregatecompositionFamily != null) {
                if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')) {
                    var subChar = new subCharacteristic.SubCharacteristic();
                    subChar.setFamily('subcprimicrostructureaggregatecompositionFamily');

                    subChar.setName($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);

                    strata.replaceSubCharacteristic(subChar);
                }
            }

            if ($scope.selectedSubsubcprimicrostructureaggregatecompositionFamily != null) {
                if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')) {
                    var subChar = new subCharacteristic.SubCharacteristic();
                    subChar.setFamily('subsubcprimicrostructureaggregatecompositionFamily');

                    subChar.setName($scope.selectedSubsubcprimicrostructureaggregatecompositionFamily.name);

                    strata.replaceSubCharacteristic(subChar);
                }
            }
            */

            $scope.$emit('updateDraw');
            //Update formulaire pour afficher/masquer les sub/cpri microstructure
            $scope.$emit('updateFormOnly');
        };


        /* est appelé quand la valeur du champ cprimicrostructurecompositionextension change
         * sert à mettre  jour les données des formulaire
         */
        $scope.upMicrostructure2 = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            /* PLUS UTILISE
            var char = new characteristic.Characteristic();
            char.setName($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
            char.setFamily('cpriMicrostructureAggregateCompositionFamily');
            strata.replaceCharacteristic(char);
            */

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
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            var char = new characteristic.Characteristic();
            char.setName($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
            char.setFamily('subsubcprimicrostructureaggregatecompositionFamily');
            strata.replaceCharacteristic(char);

            $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCharacteristicsByFamily('cprimicrostructureaggregatecompositionFamily')[0].getName(), strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily')[0].getName());
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subsubcprimicrostructureaggregatecompositionFamily')[0].getName());
            */
            $scope.$emit('updateFormOnly');
        };


    });
