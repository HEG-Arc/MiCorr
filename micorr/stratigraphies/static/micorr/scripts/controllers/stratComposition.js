'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratCompositionCtrl
 * @description
 * # StratCompositionCtrl
 * Contrôlleur qui s'occupe de l'onglet de la composition
 */
angular.module('micorrApp')
    .controller('StratCompositionCtrl', function ($scope, $route, $window, StratigraphyData) {

         /**
         * Cette fonction vide les champs et est appelée à chaque chargement du formulaire
         * pour éviter de garder des anciennes valeurs
         */
        function emptyFields() {
            $scope.selectedScompositionFamily = null;
            $scope.selectedNmmcompositionFamily = null;
            $scope.selectedDcompositionFamily = null;
            $scope.selectedPomcompositionFamily = null;
            $scope.selectedCpcompositionFamily = null;
            $scope.selectedCmcompositionFamily = null;
            $scope.selectedSubcpcompositionFamily = null;
            $scope.selectedSubsubcpcompositionFamily = null;
            $scope.selectedSubcmcompositionFamily = null;

            $scope.subcpcompositionFamily = null;
            $scope.subsubcpcompositionFamily = null;
            $scope.subcmcompositionFamily = null;
            $scope.submcompositionFamily = null;

            $scope.selectedCpcompositionextensionFamily = [];
            //Les tableaux pour les picklist des strates enfant.
            $scope.selectedCmcpcomposition = [];
            $scope.selectedCmmcomposition = [];
            $scope.selectedCmcpaggregateCompositionFamily = [];

            // list of secondary components for Microstructure composition for ex.
             $scope.secondaryComponents = [{
                 selectedCpcompositionFamily: null,
                 selectedSubcpcompositionFamily: null,
                 selectedSubsubcpcompositionFamily: null,
                 selectedcpcompositionextensionFamily : [],
                 subcpcompositionFamily: null,
                 subsubcpcompositionFamily: null
             }]
        }
        emptyFields();

        var initStratComposition = function () {
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.scompositionFamily = StratigraphyData.getScompositionFamily()['characteristics'];
            $scope.nmmcompositionFamily = StratigraphyData.getNmmcompositionFamily()['characteristics'];
            $scope.dcompositionFamily = StratigraphyData.getDcompositionFamily()['characteristics'];
            $scope.pomcompositionFamily = StratigraphyData.getPomcompositionFamily()['characteristics'];

            $scope.pomCompositionMetallicPollutants = {characteristics:StratigraphyData.elementFamily.characteristics, selected:[]};
            $scope.mCompositionMainElements = {characteristics:StratigraphyData.elementFamily.characteristics, selected:[]};
            $scope.mCompositionSecondaryElements = {characteristics:StratigraphyData.elementFamily.characteristics, selected:[]};
            $scope.cpCompositionMainElements = {characteristics:StratigraphyData.elementFamily.characteristics, selected:[]};
            $scope.cpCompositionSecondaryElements = {characteristics:StratigraphyData.elementFamily.characteristics, selected:[]};
            $scope.cpCompositionCompounds =  {characteristics:StratigraphyData.compoundFamily.characteristics, selected:[]};

            $scope.cpcompositionFamily = StratigraphyData.getCpcompositionFamily()['characteristics'];
            $scope.cmcompositionFamily = StratigraphyData.getCmcompositionFamily()['characteristics'];
            $scope.cpcompositionextensionFamily = StratigraphyData.getCpcompositionextensionFamily()['characteristics'];
            $scope.cmcpaggregateCompositionFamily = StratigraphyData.getCmcpaggregateCompositionFamily()['characteristics'];
            $scope.descriptions = StratigraphyData.descriptions;
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


            emptyFields();
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            function getSelectedFamilyCharacteristic(familyUid,allCharacteristics)
            {
                let characteristics = strata.getCharacteristicsByFamily(familyUid);
                if (characteristics.length>0)
                    return getCharacteristicByItsName(allCharacteristics, characteristics[0].getName());
                else
                    return null;
            }
            function getSelectedFamilyCharacteristicList(familyUid,allCharacteristics)
            {
                let stratumCharacteristics = strata.getCharacteristicsByFamily(familyUid);
                if (stratumCharacteristics.length>0)
                    return getCharacteristicByItsNameMulti(allCharacteristics, stratumCharacteristics );
                else
                    return [];
            }
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

            $scope.pomCompositionMetallicPollutants.selected = strata.getContainerElements("pomCompositionMetallicPollutants");
            $scope.mCompositionMainElements.selected = strata.getContainerElements("mCompositionMainElements");
            $scope.mCompositionSecondaryElements.selected = strata.getContainerElements("mCompositionSecondaryElements");
            $scope.cpCompositionMainElements.selected = strata.getContainerElements("cpCompositionMainElements");
            $scope.cpCompositionSecondaryElements.selected = strata.getContainerElements("cpCompositionSecondaryElements");
            $scope.cpCompositionCompounds.selected = strata.getContainerElements("cpCompositionCompounds");

            if (strata.getCharacteristicsByFamily("cpCompositionFamily").length > 0) {
                $scope.selectedCpcompositionFamily = getCharacteristicByItsName($scope.cpcompositionFamily, strata.getCharacteristicsByFamily("cpCompositionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("cmCompositionFamily").length > 0) {
                $scope.selectedCmcompositionFamily = getCharacteristicByItsName($scope.cmcompositionFamily, strata.getCharacteristicsByFamily("cmCompositionFamily")[0].getName());
            }
            if (strata.getCharacteristicsByFamily("cpCompositionExtensionFamily").length > 0) {
                $scope.selectedCpcompositionextensionFamily = getCharacteristicByItsNameMulti($scope.cpcompositionextensionFamily, strata.getCharacteristicsByFamily("cpCompositionExtensionFamily"));
            }
            var selectedCharacteristicName;
            if (selectedCharacteristicName = strata.getFirstSecondaryComponentCharacteristicByFamily("cpCompositionFamily","name")) {
                $scope.secondaryComponents[0].selectedCpcompositionFamily = getCharacteristicByItsName($scope.cpcompositionFamily, selectedCharacteristicName);
            }
            let characteristics = strata.getSecondaryComponentCharacteristicsByFamily("cpCompositionExtensionFamily");
            if (characteristics.length > 0) {
                $scope.secondaryComponents[0].selectedCpcompositionextensionFamily = getCharacteristicByItsNameMulti($scope.cpcompositionextensionFamily, characteristics);
            }
            if (strata.getCharacteristicsByFamily('cmCorrosionRatioFamily').length > 0) {
                var ratio = strata.getCharacteristicsByFamily('cmCorrosionRatioFamily')[0].getRealName();
                ratio = parseInt(ratio.substr(1));
                $scope.ratio = new Ratio(ratio);
            }

            //Reprise des characteristiques de composition pour la strate CM
            if (strata.getNature() == 'Corroded metal') {
                var cpChild = strata.getChildStrataByNature('Corrosion products');
                var mChild = strata.getChildStrataByNature('Metal');
                if (cpChild.getCharacteristicsByFamily("cpCompositionExtensionFamily").length > 0) {
                    $scope.selectedCmcpcomposition = getCharacteristicByItsNameMulti($scope.cpcompositionextensionFamily, cpChild.getCharacteristicsByFamily("cpCompositionExtensionFamily"));
                }
                else{
                    $scope.selectedCmcpcomposition = [];
                }
                if (cpChild.getCharacteristicsByFamily("cmCpAggregatesCompositionFamily").length > 0) {
                    $scope.selectedCmcpaggregateCompositionFamily = getCharacteristicByItsNameMulti($scope.cmcpaggregateCompositionFamily, cpChild.getCharacteristicsByFamily("cmCpAggregatesCompositionFamily"));
                }
                else{
                    $scope.selectedCmcpaggregateCompositionFamily = [];
                }
                if (mChild.getCharacteristicsByFamily("cpCompositionExtensionFamily").length > 0) {
                    $scope.selectedCmmcomposition = getCharacteristicByItsNameMulti($scope.cpcompositionextensionFamily, mChild.getCharacteristicsByFamily("cpCompositionExtensionFamily"));
                }
                else{
                    $scope.selectedCmmcomposition = [];
                }
            }


            //Sous caracteristiques

            // met à jour les données des formulaires en fonction de cmcompositionFamily
            if (strata.getSubCharacteristicsByFamily("subcmcompositionFamily").length > 0) {
                if (strata.findDependency('subcmcompositionFamily')) {
                    $scope.subcmcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cmCompositionFamily', strata.getCharacteristicsByFamily('cmCompositionFamily')[0].getName(), '');
                    $scope.selectedSubcmcompositionFamily = getCharacteristicByItsName($scope.subcmcompositionFamily, strata.getSubCharacteristicsByFamily('subcmcompositionFamily')[0].getName());
                }
            }
            // met à jour les données des formulaires en fonction de cpcompositionFamily
            if (strata.getSubCharacteristicsByFamily("subcpcompositionFamily").length > 0) {
                if (strata.findDependency('subcpcompositionFamily')) {
                    $scope.subcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(),
                        'cpCompositionFamily',
                        strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), '');
                    $scope.selectedSubcpcompositionFamily =
                        getCharacteristicByItsName($scope.subcpcompositionFamily,
                        strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getName());
                }
            }
            // met à jour les données des formulaires en fonction de subcpcompositionFamily
            if (strata.getSubCharacteristicsByFamily("subsubcpcompositionFamily").length > 0) {
                if (strata.findDependency('subsubcpcompositionFamily')) {
                    $scope.subsubcpcompositionFamily =
                        returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(),
                            'cpCompositionFamily',
                            strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(),
                            strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getUid());
                    $scope.selectedSubsubcpcompositionFamily =
                        getCharacteristicByItsName($scope.subsubcpcompositionFamily,
                        strata.getSubCharacteristicsByFamily('subsubcpcompositionFamily')[0].getName());
                }
            }
            // met à jour les données des formulaires en fonction de cpriMicrostructureAggregateCompositionFamily
            if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')) {
                if (selectedCharacteristicName = strata.getFirstSecondaryComponentSubCharacteristicByFamily('subcpcompositionFamily', 'name')) {
                    $scope.secondaryComponents[0].subcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(),
                        'cpCompositionFamily', strata.getFirstSecondaryComponentCharacteristicByFamily('cpCompositionFamily', 'name'), '');

                    $scope.secondaryComponents[0].selectedSubcpcompositionFamily = getCharacteristicByItsName(
                        $scope.secondaryComponents[0].subcpcompositionFamily, selectedCharacteristicName);
                }
            }
            // met à jour les données des formulaires en fonction de subcprimicrostructureaggregatecompositionFamily
            if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')) {
                if (selectedCharacteristicName = strata.getFirstSecondaryComponentSubCharacteristicByFamily("subcpcompositionFamily", "uid")) {
                    $scope.secondaryComponents[0].subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(),
                        'cpCompositionFamily', strata.getFirstSecondaryComponentCharacteristicByFamily('cpCompositionFamily', 'name'), selectedCharacteristicName);
                    $scope.secondaryComponents[0].selectedSubsubcpcompositionFamily =
                        getCharacteristicByItsName($scope.secondaryComponents[0].subsubcpcompositionFamily,
                            strata.getFirstSecondaryComponentSubCharacteristicByFamily("subsubcpcompositionFamily", "name"));
                }
            }
        });

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upComposition = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            strata.updateCharacteristic('sCompositionFamily', $scope.selectedScompositionFamily);
            strata.updateCharacteristic('nmmCompositionFamily',$scope.selectedNmmcompositionFamily);
            strata.updateCharacteristic('dCompositionFamily',$scope.selectedDcompositionFamily);
            strata.updateCharacteristic('pomCompositionFamily',$scope.selectedPomcompositionFamily);
            strata.setContainerElements('pomCompositionMetallicPollutants',$scope.pomCompositionMetallicPollutants.selected);
            strata.setContainerElements('mCompositionMainElements', $scope.mCompositionMainElements.selected);
            strata.setContainerElements('mCompositionSecondaryElements', $scope.mCompositionSecondaryElements.selected);
            strata.setContainerElements('cpCompositionMainElements', $scope.cpCompositionMainElements.selected);
            strata.setContainerElements('cpCompositionSecondaryElements', $scope.cpCompositionSecondaryElements.selected);
            strata.setContainerElements('cpCompositionCompounds', $scope.cpCompositionCompounds.selected);

            strata.updateCharacteristicList('cpCompositionExtensionFamily',$scope.selectedCpcompositionextensionFamily);

            //Ajout  des composition aux deux strates enfant de la strate CM
            if (strata.getNature() == 'Corroded metal') {
                //Strate enfant CP
                var childCP = strata.getChildStrataByNature('Corrosion products');
                childCP.updateCharacteristicList('cpCompositionExtensionFamily',$scope.selectedCmcpcomposition);
                childCP.updateCharacteristicList('cmCpAggregatesCompositionFamily',$scope.selectedCmcpaggregateCompositionFamily);

                //Strate enfant M
                var childM = strata.getChildStrataByNature('Metal');
                childM.updateCharacteristicList('cpCompositionExtensionFamily',$scope.selectedCmcpcomposition);
            }

            //Sous caractéristiques
            strata.updateSubCharacteristic('subsubcpcompositionFamily', $scope.selectedSubsubcpcompositionFamily);
            strata.updateSubCharacteristic('subcmcompositionFamily', $scope.selectedSubcmcompositionFamily);

            strata.updateSecondaryComponentCharacteristic('cpCompositionFamily',
                $scope.secondaryComponents[0].selectedCpcompositionFamily, 'cpriMicrostructureAggregateCompositionFamily');
            strata.updateSecondaryComponentSubCharacteristic('subcpcompositionFamily',
                $scope.secondaryComponents[0].selectedSubcpcompositionFamily, 'subcprimicrostructureaggregatecompositionFamily');
            strata.updateSecondaryComponentSubCharacteristic('subsubcpcompositionFamily',
                $scope.secondaryComponents[0].selectedSubsubcpcompositionFamily, 'subsubcprimicrostructureaggregatecompositionFamily');
            strata.updateSecondaryComponentCharacteristicList('cpCompositionExtensionFamily',
                $scope.secondaryComponents[0].selectedCpcompositionextensionFamily, 'cpriMicrostructureAggregateCompositionExtensionFamily');

            $scope.$emit('updateSelectedStrata');
            $scope.$emit('updateFormOnly');
        };
        $scope.filterCompounds = function(compound, index, array) {
           // A predicate function can be used to write arbitrary filters. The function is called for each element of the array, with the element, its index, and the entire array itself as arguments.
           // The final result is an array of those elements that the predicate returned true for.
            function inCompound(element) {
                // tests if the Element symbol is found inside the compound formula parenthesises
                // e.g. in "Antlerite (Cu3(OH)4SO4)"
                var search_re = new RegExp("\\(.*" + element.symbol + ".*\\)");
                return (compound.real_name.search(search_re) != -1);
                //return (compound.real_name.indexOf(element.symbol) != -1);
            }

            return ($scope.cpCompositionMainElements.selected.every(inCompound) && $scope.cpCompositionSecondaryElements.selected.every(inCompound));
        };
        /* Met à jour les données quand les valeurs de mcomposition, cpcomposition ou cmcomposition changent
         * @params
         * @returns
         */
        $scope.upComposition2 = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if ($scope.selectedCpcompositionFamily != null) {
                if (strata.findDependency('cpcompositionFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily('cpCompositionFamily');

                    char.setName($scope.selectedCpcompositionFamily.name);
                    char.setRealName($scope.selectedCpcompositionFamily.real_name);

                    strata.replaceCharacteristic(char);

                    $scope.subcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), '');
                    $scope.subsubcpcompositionFamily = null;
                    if (strata.getCharacteristicsByFamily('subcpcompositionFamily').length > 0) {
                        $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcpcompositionFamily, strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getName());
                    }
                }
            }

            if ($scope.selectedCmcompositionFamily != null) {
                if (strata.findDependency('cmcompositionFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily('cmCompositionFamily');

                    char.setName($scope.selectedCmcompositionFamily.name);
                    char.setRealName($scope.selectedCmcompositionFamily.real_name);

                    strata.replaceCharacteristic(char);

                    $scope.subcmcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cmCompositionFamily', strata.getCharacteristicsByFamily('cmCompositionFamily')[0].getName(), '');
                    $scope.selectedSubcmcompositionFamily = getCharacteristicByItsName($scope.subcmcompositionFamily, strata.getSubCharacteristicsByFamily('subcmcompositionFamily')[0].getName());
                }
            }

            if (strata.updateSecondaryComponentCharacteristic('cpCompositionFamily', $scope.secondaryComponents[0].selectedCpcompositionFamily, 'cpriMicrostructureAggregateCompositionFamily')) {
                $scope.secondaryComponents[0].subcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpCompositionFamily', strata.getFirstSecondaryComponentCharacteristicByFamily('cpCompositionFamily', 'name'), '');
                $scope.secondaryComponents[0].subsubcpcompositionFamily = null;
                let characteristicName = strata.getFirstSecondaryComponentSubCharacteristicByFamily('subcpcompositionFamily', 'name');
                if (characteristicName)
                    $scope.secondaryComponents[0].selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.secondaryComponents[0].subcpcompositionFamily, characteristicName);
                $scope.$emit('updateSelectedStrata');
                $scope.$emit('updateFormOnly');
            }
        }

//Met à jour les données quand les valeurs de subcpcomposition changent
        $scope.upComposition3 = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            var characteristicName;

            if ($scope.selectedSubcpcompositionFamily != null) {
                if (strata.findDependency('subcpcompositionFamily')) {
                    var subChar = new subCharacteristic.SubCharacteristic();
                    subChar.setFamily('subcpcompositionFamily');
                    subChar.setUid($scope.selectedSubcpcompositionFamily.uid)
                    subChar.setName($scope.selectedSubcpcompositionFamily.name);
                    //subChar.setRealName($scope.selectedSubcpcompositionFamily.real_name);

                    strata.replaceSubCharacteristic(subChar);

                    $scope.subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getUid());

                    if (strata.getSubCharacteristicsByFamily('subsubcpcompositionFamily').length > 0) {
                        $scope.selectedSubsubcpcompositionFamily = getCharacteristicByItsName($scope.subsubcpcompositionFamily, strata.getSubCharacteristicsByFamily('subsubcpcompositionFamily')[0].getName());
                    }


                }
            }

            if (strata.updateSecondaryComponentSubCharacteristic('subcpcompositionFamily', $scope.secondaryComponents[0].selectedSubcpcompositionFamily,'subcprimicrostructureaggregatecompositionFamily'))
            {
                // After changing strata Sub characteristic update subsub characteristic list (Aggregate compound)
                $scope.secondaryComponents[0].subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(),
                        'cpCompositionFamily',
                        strata.getFirstSecondaryComponentCharacteristicByFamily('cpCompositionFamily','name'),
                        strata.getFirstSecondaryComponentSubCharacteristicByFamily('subcpcompositionFamily','uid'));
                if (characteristicName = strata.getFirstSecondaryComponentSubCharacteristicByFamily('subsubcpcompositionFamily', 'name'))
                    $scope.secondaryComponents[0].selectedSubsubcpcompositionFamily =
                        getCharacteristicByItsName($scope.secondaryComponents[0].subsubcpcompositionFamily, characteristicName);
            }

            $scope.$emit('updateSelectedStrata');
            $scope.$emit('updateFormOnly');
        };
        //Appelée lorsqu'on change déplace le slider dans la composition d'une strate CM
        $scope.ratioChange = function () {

            var ratioChar = new characteristic.Characteristic();

            var rName = 'r' + $scope.ratio.ratio;
            ratioChar.setName(rName + 'Characteristic');
            ratioChar.setRealName(rName);
            ratioChar.setFamily('cmCorrosionRatioFamily');
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
            strata.replaceCharacteristic(ratioChar);
            //mise à jour du dessin
            $scope.$emit('updateSelectedStrata');
        };
    });
