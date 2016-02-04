'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratMicrostructureCtrl
 * @description
 * # StratMicrostructureCtrl
 * Contrôlleur qui s'occupe de l'onglet de la microstructure
 */
angular.module('micorrApp')
    .controller('StratMicrostructureCtrl', function ($scope, $route, $window, StrataData) {

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

        var initMicrostructure = function(){
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.cprimicrostructureFamily = StrataData.getCprimicrostructureFamily()['characteristics'];
            $scope.mmicrostructureFamily = StrataData.getMmicrostructureFamily()['characteristics'];
            $scope.cmlevelofcorrosionFamily = StrataData.getCmlevelofcorrosionFamily()['characteristics'];
            $scope.cprimicrostructureaggregatecompositionFamily = StrataData.getCprimicrostructureaggregatecompositionFamily()['characteristics'];
            $scope.cprimicrostructureaggregatecompositionExtensionFamily = StrataData.getCprimicrostructureaggregatecompositionextensionFamily()['characteristics'];
            $scope.subcprimicrostructureFamily = StrataData.getSubcprimicrostructureFamily();
            $scope.subcprimicrostructureaggregatecompositionFamily = StrataData.getSubcprimicrostructureaggregatecompositionFamily();
            $scope.subsubcprimicrostructureaggregatecompositionFamily = StrataData.getSubsubcprimicrostructureaggregatecompositionFamily();
            $scope.subcmlevelofcorrosionFamily = StrataData.getSubcmLevelOfCorrosionFamily();
            $scope.submmicrostructureFamily = StrataData.getSubmmicrostructureFamily();
        };

        $scope.$on('initShowStrat', function(event) {
            if(typeof StrataData.getCprimicrostructureFamily() !== "undefined"){
                initMicrostructure();
            }
        });

        $scope.upMulti = function(){
            $scope.upMicrostructure();
        };

         /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         * @params
         * @returns
         */
        $scope.$on('updateMicrostructure', function(){
            var strata = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];

            if (strata.findDependency('cprimicrostructureFamily'))
                $scope.selectedCprimicrostructureFamily = getCharacteristicByItsName($scope.cprimicrostructureFamily, strata.getCpriMicrostructureFamily());
            if (strata.findDependency('mmicrostructureFamily'))
                $scope.selectedMmicrostructureFamily = getCharacteristicByItsName($scope.mmicrostructureFamily, strata.getMmicrostructureFamily());
            if (strata.findDependency('cmlevelofcorrosionFamily'))
                $scope.selectedCmlevelofcorrosionFamily = getCharacteristicByItsName($scope.cmlevelofcorrosionFamily, strata.getCmLevelOfCorrosionFamily());
            if (strata.findDependency('cprimicrostructureaggregatecompositionFamily'))
                $scope.selectedCprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.cprimicrostructureaggregatecompositionFamily, strata.getCprimicrostructureaggregateCompositionFamily());
            // en fonction des données dans cprimicrostructureaggregatecomposition on change les données du formulaire
            if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')){
                $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCprimicrostructureaggregateCompositionFamily(), '');
                $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubcprimicrostructureaggregateCompositionFamily());
            }
            // en fonction des données dans subcprimicrostructureaggregatecomposition on change les données du formulaire
            if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')){
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
        });

         /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upMicrostructure = function() {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            if (temp[index].findDependency('cprimicrostructureFamily'))
                temp[index].setCpriMicrostructureFamily($scope.selectedCprimicrostructureFamily.name);
            if (temp[index].findDependency('mmicrostructureFamily'))
                temp[index].setMmicrostructureFamily($scope.selectedMmicrostructureFamily.name);
            if (temp[index].findDependency('cmlevelofcorrosionFamily'))
                temp[index].setCmLevelOfCorrosionFamily($scope.selectedCmlevelofcorrosionFamily.name);
            if (temp[index].findDependency('cprimicrostructureaggregatecompositionFamily'))
                temp[index].setCprimicrostructureaggregateCompositionFamily($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
            if (temp[index].findDependency('cprimicrostructureaggregatecompositionextensionFamily'))
                temp[index].setCprimicrostructureaggregateCompositionextensionFamily($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily);
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

            $scope.$emit('updateDraw');
            //Update formulaire pour afficher/masquer les sub/cpri microstructure
            $scope.$emit('updateFormOnly');
        };


         /* est appelé quand la valeur du champ cprimicrostructurecompositionextension change
          * sert à mettre  jour les données des formulaire
         * @params
         * @returns
         */
        $scope.upMicrostructure2 = function() {
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
        $scope.upMicrostructure3 = function() {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            temp[index].setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
            $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), temp[index].getSubcprimicrostructureaggregateCompositionFamily());
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubsubcprimicrostructureaggregateCompositionFamily());

            $scope.$emit('updateFormOnly');
        };

    });
