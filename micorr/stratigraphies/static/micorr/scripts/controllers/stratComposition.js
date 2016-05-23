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

        var initStratComposition = function () {
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

        $scope.$on('initShowStrat', function (event) {
            initStratComposition();
        });

        $scope.upMulti = function () {
            $scope.upComposition();
        };

        /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         * @params
         * @returns
         */
        $scope.$on('updateComposition', function () {

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
                $scope.selectedCpcompositionextensionFamily = getCharacteristicByItsNameMulti($scope.cpcompositionextensionFamily, strata.getCharacteristicsByFamily("cpCompositionExtensionFamily"));
            }


            //Sous caracteristiques

             // met à jour les données des formulaires en fonction de mcompositionFamily
             if (strata.findDependency('submcompositionFamily')){
             $scope.submcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'mCompositionFamily', strata.getCharacteristicsByFamily('mCompositionFamily')[0].getName(), '');
             $scope.selectedSubmcompositionFamily = getCharacteristicByItsName($scope.submcompositionFamily, strata.getSubCharacteristicsByFamily('submcompositionFamily')[0].getName());
             }

             // met à jour les données des formulaires en fonction de cmcompositionFamily
             if (strata.findDependency('subcmcompositionFamily')){
             $scope.subcmcompositionFamily  = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cmCompositionFamily', strata.getCharacteristicsByFamily('cmCompositionFamily')[0].getName(), '');
             $scope.selectedSubcmcompositionFamily = getCharacteristicByItsName($scope.subcmcompositionFamily, strata.getSubCharacteristicsByFamily('subcmcompositionFamily')[0].getName());
             }
             // met à jour les données des formulaires en fonction de cpcompositionFamily
             if (strata.findDependency('subcpcompositionFamily')){
             $scope.subcpcompositionFamily  = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), '');
             $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcpcompositionFamily, strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getName());
             }
             // met à jour les données des formulaires en fonction de subcpcompositionFamily
             if (strata.findDependency('subsubcpcompositionFamily')){
             $scope.subsubcpcompositionFamily = returnSubCharacteristicsFromParent(Stratigraphydata.getRawCharacteristics(), 'cpCompositionFamily', strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getName());
             $scope.selectedSubsubcpcompositionFamily = getCharacteristicByItsName($scope.subsubcpcompositionFamily, strata.getSubsubcpcompositionFamily());
             }

        });

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upComposition = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];


            if (strata.findDependency('scompositionFamily')) {
                var char = new characteristic.Characteristic();
                char.setFamily("sCompositionFamily");
                if ($scope.selectedScompositionFamily != undefined) {
                    char.setName($scope.selectedScompositionFamily.name);
                    char.setRealName($scope.selectedScompositionFamily.real_name);
                }
                else {
                    char.setName("");
                    char.setRealName("");
                }

                strata.replaceCharacteristic(char);
            }
            if (strata.findDependency('nmmcompositionFamily')) {
                var char = new characteristic.Characteristic();
                char.setFamily("nmmCompositionFamily");
                if ($scope.selectedNmmcompositionFamily != undefined) {
                    char.setName($scope.selectedNmmcompositionFamily.name);
                    char.setRealName($scope.selectedNmmcompositionFamily.real_name);
                }
                else {
                    char.setName("");
                    char.setRealName("");
                }
                strata.replaceCharacteristic(char);
            }

            if (strata.findDependency('dcompositionFamily')) {
                var char = new characteristic.Characteristic();
                char.setFamily("dCompositionFamily");
                if ($scope.selectedNmmcompositionFamily != undefined) {
                    char.setName($scope.selectedDcompositionFamily.name);
                    char.setRealName($scope.selectedDcompositionFamily.real_name);
                }
                else {
                    char.setName("");
                    char.setRealName("");
                }
                strata.replaceCharacteristic(char);
            }
            if (strata.findDependency('pomcompositionFamily')) {
                var char = new characteristic.Characteristic();
                char.setFamily("pomCompositionFamily");
                if ($scope.selectedPomcompositionFamily != undefined) {
                    char.setName($scope.selectedPomcompositionFamily.name);
                    char.setRealName($scope.selectedPomcompositionFamily.real_name);
                }
                else {
                    char.setName("");
                    char.setRealName("");
                }
                strata.replaceCharacteristic(char);
            }


            if (temp[index].findDependency('cpcompositionextensionFamily')) {
                strata.clearCharacteristicsFromFamily('cpCompositionextensionFamily');
                for(var j = 0; $scope.selectedCpCompositionExtensionFamily.length; i++){
                    var char = new characteristic.Characteristic();
                    char.setFamily("cpCompositionExtensionFamily");
                    char.setName($scope.selectedCpcompositionextensionFamily.name);
                    char.setRealName($scope.selectedCpcompositionextensionFamily.real_name);
                    strata.addCharacteristic(char);
                }


            }


            //Sous caractéristiques
            if (strata.findDependency('subsubcpcompositionFamily')) {
                var subChar = new subCharacteristic.SubCharacteristic();
                subChar.setFamily("subsubcpcompositionFamily");
                if ($scope.selectedSubsubcpcompositionFamily != undefined) {
                    subChar.setName($scope.selectedSubsubcpcompositionFamily.name);
                    subChar.setRealName($scope.selectedSubsubcpcompositionFamily.real_name);
                }
                else {
                    subChar.setName("");
                    subChar.setRealName("");
                }
                strata.replaceSubCharacteristic(subChar);
            }

            if (strata.findDependency('subcmcompositionFamily')) {
                var subChar = new subCharacteristic.SubCharacteristic();
                subChar.setFamily("subcmcompositionFamily");
                if ($scope.selectedSubcmcompositionFamily != undefined) {
                    subChar.setName($scope.selectedSubcmcompositionFamily.name);
                    subChar.setRealName($scope.selectedSubcmcompositionFamily.real_name);
                }
                else {
                    subChar.setName("");
                    subChar.setRealName("");
                }
                strata.replaceSubCharacteristic(subChar);
            }

            if (strata.findDependency('submcompositionFamily')) {
                var subChar = new subCharacteristic.SubCharacteristic();
                subChar.setFamily("submcompositionFamily");
                if ($scope.selectedSubmcompositionFamily != undefined) {
                    subChar.setName($scope.selectedSubmcompositionFamily.name);
                    subChar.setRealName($scope.selectedSubmcompositionFamily.real_name);
                }
                else {
                    subChar.setName("");
                    subChar.setRealName("");
                }
                strata.replaceSubCharacteristic(subChar);
            }



            //Plus utilisé
            /*if (temp[index].findDependency('cpcompositionFamily'))
             temp[index].setCpcompositionFamily($scope.selectedCpcompositionFamily.name);*/
            /*if (temp[index].findDependency('cmcompositionFamily'))
             temp[index].setCmcompositionFamily($scope.selectedCmcompositionFamily.name);*/
            /*if (temp[index].findDependency('mcompositionFamily'))
             temp[index].setMcompositionFamily($scope.selectedMcompositionFamily.name);*/

            /*if (temp[index].findDependency('subcpcompositionFamily'))
             temp[index].setSubcpcompositionFamily($scope.selectedSubcpcompositionFamily.name);*/

            $scope.$emit('updateDraw');
            $scope.$emit('updateFormOnly');
        };

        /* Met à jour les données quand les valeurs de mcomposition, cpcomposition ou cmcomposition changent
         * @params
         * @returns
         */
        $scope.upComposition2 = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if(strata.findDependency('mcompositionFamily')){
                var char = new characteristic.Characteristics();
                char.setFamily('mCompositionFamily');
                if($scope.selectedMcompositionFamily != undefined){
                    char.setName($scope.selectedMcompositionFamily.name);
                    char.setRealName($scope.selectedMcompositionFamily.real_name);
                }
                else{
                    char.setName("");
                    char.setRealName("");
                }
                strata.replaceCharacteristic(char);

                $scope.submcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'mCompositionFamily', strata.getCharacteristicsByFamily('mCompositionFamily')[0].getName(), '');
                $scope.selectedSubmcompositionFamily = getCharacteristicByItsName($scope.submcompositionFamily, strata.getSubCharacteristicsByFamily('submcompositionFamily')[0].getName());
            }

            if(strata.findDependency('cpcompositionFamily')){
                var char = new characteristic.Characteristics();
                char.setFamily('cpcompositionFamily');
                if($scope.selectedCpcompositionFamily != undefined){
                    char.setName($scope.selectedCpcompositionFamily.name);
                    char.setRealName($scope.selectedCpcompositionFamily.real_name);
                }
                else{
                    char.setName("");
                    char.setRealName("");
                }
                strata.replaceCharacteristic(char);

                $scope.subcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), '');
                $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcpcompositionFamily, strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getName());
            }

            if(strata.findDependency('cmcompositionFamily')){
                var char = new characteristic.Characteristics();
                char.setFamily('cmcompositionFamily');
                if($scope.selectedCmcompositionFamily != undefined){
                    char.setName($scope.selectedCmcompositionFamily.name);
                    char.setRealName($scope.selectedCmcompositionFamily.real_name);
                }
                else{
                    char.setName("");
                    char.setRealName("");
                }
                strata.replaceCharacteristic(char);

                $scope.subcmcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cmCompositionFamily', strata.getCharacteristicsByFamily('cmCompositionFamily')[0].getName(), '');
                $scope.selectedSubcmcompositionFamily = getCharacteristicByItsName($scope.subcmcompositionFamily, strata.getSubCharacteristicsByFamily('subcmcompositionFamily')[0].getName());
            }

            $scope.$emit('updateFormOnly');
        };

//Met à jour les données quand les valeurs de subcpcomposition changent
        $scope.upComposition3 = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if(strata.findDependency('subcpcompositionFamily')){
                var subChar = new subCharacteristic.SubCharacteristic();
                subChar.setFamily('subcpcompositionFamily');
                if($scope.selectedSubcpcompositionFamily != undefined){
                    subChar.setName($scope.selectedSubcpcompositionFamily.name);
                    subChar.setRealName($scope.selectedSubcpcompositionFamily.real_name);
                }
                else{
                    subChar.setName("");
                    subChar.setRealName("");
                }
                strata.replaceSubCharacteristic(subChar);

                $scope.subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), strata.getSubCharacteristicsByFamily('subcpcompositionFamily'));
                $scope.selectedSubsubcpcompositionFamily = getCharacteristicByItsName($scope.subsubcpcompositionFamily, strata.getSubCharacteristicsByFamily('subsubcpcompositionFamily')[0].getName());
            }


            //Plus utilisé
            /*temp[index].setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
             $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), temp[index].getSubcprimicrostructureaggregateCompositionFamily());
             $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubsubcprimicrostructureaggregateCompositionFamily());
             */

            $scope.$emit('updateFormOnly');
        };
    })
;
