'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratCompositionCtrl
 * @description
 * # StratCompositionCtrl
 * Contrôlleur qui s'occupe de l'onglet de la composition
 */
angular.module('micorrApp')
    .controller('StratCompositionCtrl', function ($scope, $route, $window, StrataData, StratigraphyData) {

        //valeurs sélectionnées dans les champs de notre formulaire
        $scope.selectedScompositionFamily;
        $scope.selectedNmmcompositionFamily;
        $scope.selectedDcompositionFamily;
        $scope.selectedPomcompositionFamily;
        $scope.selectedCpcompositionFamily;
        $scope.selectedCmcompositionFamily;
        $scope.selectedMcompositionFamily;
        $scope.selectedSubcpcompositionFamily;
        $scope.selectedSubsubcpcompositionFamily;
        $scope.selectedSubcmcompositionFamily;
        $scope.selectedCpcompositionextensionFamily = [];
        $scope.selectedSubmcompositionFamily;

        var initStratComposition = function(){
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.scompositionFamily = StratigraphyData.getScompositionFamily()['characteristics'];
            $scope.nmmcompositionFamily = StratigraphyData.getNmmcompositionFamily()['characteristics'];
            $scope.dcompositionFamily = StratigraphyData.getDcompositionFamily()['characteristics'];
            $scope.pomcompositionFamily = StratigraphyData.getPomcompositionFamily()['characteristics'];
            $scope.cpcompositionFamily = StratigraphyData.getCpcompositionFamily()['characteristics'];
            $scope.cmcompositionFamily = StratigraphyData.getCmcompositionFamily()['characteristics'];
            $scope.mcompositionFamily = StratigraphyData.getMcompositionFamily()['characteristics'];
            $scope.cpcompositionextensionFamily = StratigraphyData.getCpcompositionextensionFamily()['characteristics'];
            $scope.subcpcompositionFamily = StratigraphyData.getSubcpcompositionFamily();
            $scope.subsubcpcompositionFamily = StratigraphyData.getSubsubcpcompositionFamily();
            $scope.subcmcompositionFamily = StratigraphyData.getSubcmcompositionFamily();
            $scope.submcompositionFamily = StratigraphyData.getSubmcompositionFamily();
        };

        $scope.$on('initShowStrat', function(event) {
            initStratComposition();
        });

        $scope.upMulti = function(){
            $scope.upComposition();
        };

         /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         * @params
         * @returns
         */
        $scope.$on('updateComposition', function(){

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];


            if (strata.getCharacteristicsByFamily("sCompositionFamily").length > 0) {
                $scope.selectedScompositionFamily = getCharacteristicByItsName($scope.scompositionFamily, strata.getCharacteristicsByFamily("sCompositionFamily")[0].getName());
            }

             if (strata.getCharacteristicsByFamily("nmCompositionFamily").length > 0) {
                $scope.selectedNmcompositionFamily = getCharacteristicByItsName($scope.nmcompositionFamily, strata.getCharacteristicsByFamily("nmCompositionFamily")[0].getName());
            }

             if (strata.getCharacteristicsByFamily("dCompositionFamily").length > 0) {
                $scope.selectedDcompositionFamily = getCharacteristicByItsName($scope.dcompositionFamily, strata.getCharacteristicsByFamily("dCompositionFamily")[0].getName());
            }
             if (strata.getCharacteristicsByFamily("pomCompositionFamily").length > 0) {
                $scope.selectedPomcompositionFamily = getCharacteristicByItsName($scope.pomcompositionFamily, strata.getCharacteristicsByFamily("pomCompositionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("cpCompositionFamily").length > 0) {
                $scope.selectedCpcompositionFamily = getCharacteristicByItsName($scope.cpcompositionFamily, strata.getCharacteristicsByFamily("cpCompositionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("cmCompositionFamily").length > 0) {
                $scope.selectedCmcompositionFamily = getCharacteristicByItsName($scope.cmcompositionFamily, strata.getCharacteristicsByFamily("cmCompositionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("mCompositionFamily").length > 0) {
                $scope.selectedMcompositionFamily = getCharacteristicByItsName($scope.mcompositionFamily, strata.getCharacteristicsByFamily("mCompositionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("cpCompositionExtensionFamily").length > 0) {
                $scope.selectedCpcompositionextensionFamily = getCharacteristicByItsName($scope.cpcompositionextensionFamily, strata.getCharacteristicsByFamily("cpCompositionExtensionFamily")[0].getName());
            }

            /* TODO: Sous caracteristique
            // met à jour les données des formulaires en fonction de mcompositionFamily
            if (strata.findDependency('submcompositionFamily')){
                $scope.submcompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'mCompositionFamily', strata.getMcompositionFamily(), '');
                $scope.selectedSubmcompositionFamily = getCharacteristicByItsName($scope.submcompositionFamily, strata.getSubmcompositionFamily());
            }
            // met à jour les données des formulaires en fonction de cmcompositionFamily
            if (strata.findDependency('subcmcompositionFamily')){
                $scope.subcmcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cmCompositionFamily', strata.getCmcompositionFamily(), '');
                $scope.selectedSubcmcompositionFamily = getCharacteristicByItsName($scope.subcmcompositionFamily, strata.getSubCmcompositionFamily());
            }
            // met à jour les données des formulaires en fonction de cpcompositionFamily
            if (strata.findDependency('subcpcompositionFamily')){
                $scope.subcpcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCpcompositionFamily(), '');
                $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcpcompositionFamily, strata.getSubcpcompositionFamily());
            }
            // met à jour les données des formulaires en fonction de subcpcompositionFamily
            if (strata.findDependency('subsubcpcompositionFamily')){
                $scope.subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCpcompositionFamily(), strata.getSubcpcompositionFamily());
                $scope.selectedSubsubcpcompositionFamily = getCharacteristicByItsName($scope.subsubcpcompositionFamily, strata.getSubsubcpcompositionFamily());
            }
            */
        });

         /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upComposition = function() {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            if (temp[index].findDependency('scompositionFamily'))
                temp[index].setScompositionFamily($scope.selectedScompositionFamily.name);
            if (temp[index].findDependency('nmmcompositionFamily'))
                temp[index].setNmmCompositionFamily($scope.selectedNmmcompositionFamily.name);
            if (temp[index].findDependency('dcompositionFamily'))
                temp[index].setDcompositionFamily($scope.selectedDcompositionFamily.name);
            if (temp[index].findDependency('pomcompositionFamily'))
                temp[index].setPomCompositionFamily($scope.selectedPomcompositionFamily.name);
            /*if (temp[index].findDependency('cpcompositionFamily'))
                temp[index].setCpcompositionFamily($scope.selectedCpcompositionFamily.name);*/
            /*if (temp[index].findDependency('cmcompositionFamily'))
                temp[index].setCmcompositionFamily($scope.selectedCmcompositionFamily.name);*/
            /*if (temp[index].findDependency('mcompositionFamily'))
                temp[index].setMcompositionFamily($scope.selectedMcompositionFamily.name);*/
            if (temp[index].findDependency('cpcompositionextensionFamily'))
                temp[index].setCpcompositionextensionFamily($scope.selectedCpcompositionextensionFamily);
            /*if (temp[index].findDependency('subcpcompositionFamily'))
                temp[index].setSubcpcompositionFamily($scope.selectedSubcpcompositionFamily.name);*/
            if (temp[index].findDependency('subsubcpcompositionFamily'))
                temp[index].setSubsubcpcompositionFamily($scope.selectedSubsubcpcompositionFamily.name);
            if (temp[index].findDependency('subcmcompositionFamily'))
                temp[index].setSubCmcompositionFamily($scope.selectedSubcmcompositionFamily.name);
            if (temp[index].findDependency('submcompositionFamily'))
                temp[index].setSubmcompositionFamily($scope.selectedSubmcompositionFamily.name);

            $scope.$emit('updateDraw');
            $scope.$emit('updateFormOnly');
        };

        /* Met à jour les données quand les valeurs de mcomposition, cpcomposition ou cmcomposition changent
         * @params
         * @returns
         */
        $scope.upComposition2 = function() {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();
            if (temp[index].findDependency('mcompositionFamily')){
                temp[index].setMcompositionFamily($scope.selectedMcompositionFamily.name);
                $scope.submcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'mCompositionFamily', temp[index].getMcompositionFamily(), '');
                $scope.selectedSubmcompositionFamily = getCharacteristicByItsName($scope.submcompositionFamily, temp[index].getSubmcompositionFamily());
            }
            if (temp[index].findDependency('cpcompositionFamily')) {
                temp[index].setCpcompositionFamily($scope.selectedCpcompositionFamily.name);
                $scope.subcpcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpCompositionFamily', temp[index].getCpcompositionFamily(), '');
                $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcpcompositionFamily, temp[index].getSubcpcompositionFamily());
            }
            if (temp[index].findDependency('cmcompositionFamily')) {
                temp[index].setCmcompositionFamily($scope.selectedCmcompositionFamily.name);
                $scope.subcmcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cmCompositionFamily', temp[index].getCmcompositionFamily(), '');
                $scope.selectedSubcmcompositionFamily = getCharacteristicByItsName($scope.subcmcompositionFamily, temp[index].getSubCmcompositionFamily());
            }
            $scope.$emit('updateFormOnly');
        };

        //Met à jour les données quand les valeurs de subcpcomposition changent
        $scope.upComposition3 = function() {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            temp[index].setSubcpcompositionFamily($scope.selectedSubcpcompositionFamily.name);
            $scope.subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpCompositionFamily', temp[index].getCpcompositionFamily(), temp[index].getSubcpcompositionFamily());
            $scope.selectedSubsubcpcompositionFamily = getCharacteristicByItsName($scope.subsubcpcompositionFamily, temp[index].getSubsubcpcompositionFamily());

            /*temp[index].setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
            $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), temp[index].getSubcprimicrostructureaggregateCompositionFamily());
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubsubcprimicrostructureaggregateCompositionFamily());
            */

            $scope.$emit('updateFormOnly');
        };
    });
