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
            $scope.selectedCmcompositionFamily = null;
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

        }
        emptyFields();
        $scope.compoundExactComposition = true;

        function CharacteristicsSelector(family)
        /**
         * construct an objet like : {characteristics:StratigraphyData[family];characteristics, selected:[]};
         * @param family
         * @constructor
         */ {
            this.characteristics = StratigraphyData[family].characteristics;
            this.selected = [];
        }

        function ElementSelector()
        /**
         * specialized CharacteristicsSelector for elementFamily
         * @constructor
         */ {
            CharacteristicsSelector.apply(this, ["elementFamily"]);
        }

        function CompoundSelector()
        /**
         * specialized CharacteristicsSelector for compoundFamily
         * @constructor
         */ {
            CharacteristicsSelector.apply(this, ["compoundFamily"]);
        }
        var initStratComposition = function () {
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.scompositionFamily = StratigraphyData.getScompositionFamily()['characteristics'];
            $scope.nmmcompositionFamily = StratigraphyData.getNmmcompositionFamily()['characteristics'];
            $scope.dcompositionFamily = StratigraphyData.getDcompositionFamily()['characteristics'];
            $scope.pomcompositionFamily = StratigraphyData.getPomcompositionFamily()['characteristics'];

            $scope.pomCompositionMetallicPollutants = new ElementSelector();
            $scope.mCompositionMainElements = new ElementSelector();
            $scope.mCompositionSecondaryElements = new ElementSelector();
            $scope.cpCompositionMainElements = new ElementSelector();
            $scope.cpCompositionSecondaryElements = new ElementSelector();
            $scope.cpCompositionCompounds =  new CompoundSelector();
            // list of secondary components for Microstructure composition for ex.
             $scope.secondaryComponents = [{
                 selectedCpcompositionFamily: null,
                 selectedSubcpcompositionFamily: null,
                 selectedSubsubcpcompositionFamily: null,
                 selectedcpcompositionextensionFamily : [],
                 subcpcompositionFamily: null,
                 subsubcpcompositionFamily: null
             }];
            $scope.secondaryComponents[0].mainElements = new ElementSelector();
            $scope.secondaryComponents[0].secondaryElements = new ElementSelector();
            $scope.secondaryComponents[0].compounds = new CompoundSelector();
            $scope.secondaryComponents[0].additionalElements = new ElementSelector();
            $scope.secondaryComponents[0].compoundExactComposition = true;

            $scope.cpcompositionFamily = StratigraphyData.getCpcompositionFamily()['characteristics'];
            $scope.cmcompositionFamily = StratigraphyData.getCmcompositionFamily()['characteristics'];

            $scope.cpcompositionextensionFamily = StratigraphyData.getCpcompositionextensionFamily()['characteristics'];
            // => to be replaced by
            $scope.cpCompositionAdditionalElements = new ElementSelector();

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
            $scope.cpCompositionAdditionalElements.selected = strata.getContainerElements("cpCompositionAdditionalElements");

            var selectedCharacteristicName;
            if (selectedCharacteristicName = strata.getFirstSecondaryComponentCharacteristicByFamily("cpCompositionFamily","name")) {
                $scope.secondaryComponents[0].selectedCpcompositionFamily = getCharacteristicByItsName($scope.cpcompositionFamily, selectedCharacteristicName);
            }
            let characteristics = strata.getSecondaryComponentCharacteristicsByFamily("cpCompositionExtensionFamily");
            if (characteristics.length > 0) {
                $scope.secondaryComponents[0].selectedCpcompositionextensionFamily = getCharacteristicByItsNameMulti($scope.cpcompositionextensionFamily, characteristics);
            }
            // => to be replaced by:
            $scope.secondaryComponents[0].mainElements.selected = strata.getSecondaryComponentContainerElements("cpCompositionMainElements");
            $scope.secondaryComponents[0].secondaryElements.selected = strata.getSecondaryComponentContainerElements("cpCompositionSecondaryElements");
            $scope.secondaryComponents[0].compounds.selected = strata.getSecondaryComponentContainerElements("cpCompositionCompounds");
            $scope.secondaryComponents[0].additionalElements.selected = strata.getSecondaryComponentContainerElements("cpCompositionAdditionalElements");

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
            strata.setContainerElements('cpCompositionAdditionalElements', $scope.cpCompositionAdditionalElements.selected);

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
            strata.updateSubCharacteristic('subcmcompositionFamily', $scope.selectedSubcmcompositionFamily);

            strata.updateSecondaryComponentCharacteristic('cpCompositionFamily',
                $scope.secondaryComponents[0].selectedCpcompositionFamily, 'cpriMicrostructureAggregateCompositionFamily');
            strata.updateSecondaryComponentSubCharacteristic('subcpcompositionFamily',
                $scope.secondaryComponents[0].selectedSubcpcompositionFamily, 'subcprimicrostructureaggregatecompositionFamily');
            strata.updateSecondaryComponentSubCharacteristic('subsubcpcompositionFamily',
                $scope.secondaryComponents[0].selectedSubsubcpcompositionFamily, 'subsubcprimicrostructureaggregatecompositionFamily');
            strata.updateSecondaryComponentCharacteristicList('cpCompositionExtensionFamily',
                $scope.secondaryComponents[0].selectedCpcompositionextensionFamily, 'cpriMicrostructureAggregateCompositionExtensionFamily');
            // to be replaced by =>
            strata.setSecondaryComponentContainerElements("cpCompositionMainElements", $scope.secondaryComponents[0].mainElements.selected);
            strata.setSecondaryComponentContainerElements("cpCompositionSecondaryElements", $scope.secondaryComponents[0].secondaryElements.selected);
            strata.setSecondaryComponentContainerElements("cpCompositionCompounds", $scope.secondaryComponents[0].compounds.selected);
            strata.setSecondaryComponentContainerElements("cpCompositionAdditionalElements", $scope.secondaryComponents[0].additionalElements.selected);

            $scope.$emit('updateSelectedStrata');
            $scope.$emit('updateFormOnly');
        };

         /* Met à jour les données quand les valeurs de mcomposition, cpcomposition ou cmcomposition changent
         * @params
         * @returns
         */
        $scope.upComposition2 = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];


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
    })
    .filter("filterCompounds", function() { // register new angular filter
            // helper function
            function extractElements(compound) {
            /** Parses the compound formula and returns elements
             * @param {!compound} String name of the compound including formula in brackets
             *     for example "Chalconatronite (CuNa2(CO3)2.3H2O)"
             *
             * @return {[String]} list of elements found in formula (symbol strings).
             *     ["Cu", "Na", "C", "O", "H"]
             */
                // first split formula using Upper case Lower case element as separator (and include them in the result as group)
            let preClosingParenthesisIndex = compound.search(/(\).*?\()/g);
            if (preClosingParenthesisIndex != -1)
                compound = compound.substring(preClosingParenthesisIndex);
            let formulaIndex = compound.indexOf('(');
            if (formulaIndex == -1)
                return [];
            else
                compound = compound.substring(formulaIndex);
            let seachUlElements = compound.split(/([A-Z][a-z])/g);
            let elements = [];
            for (let ulCandidate of seachUlElements) {
                if (ulCandidate !== '') {
                    if (ulCandidate.match(/[A-Z][a-z]/)) {
                        elements.push(ulCandidate);
                    }
                    else {
                        //Extract the single letters elements
                        let singleLetterElements = ulCandidate.match(/[A-Z]/g);
                        if (singleLetterElements) {
                            // Add them to the elements list
                            Array.prototype.push.apply(elements, singleLetterElements);
                        }
                    }
                }
            }
            return elements;
        }
        // core stateless "filterCompounds"  function
        return function(compounds, mainElements, secondaryElements, compoundExactComposition)
            /**
             * Filter the compounds list to return only those containing the list of all elements in
             * mainElements and secondaryElements arrays
             *
             * @param compounds:  input array of compounds to filter
             * @param mainElements:  Array of main elements (filter criteria)
             * @param secondaryElements: Array of secondary elements (filter criteria)
             * @param compoundExactComposition: boolean
             *          - if true then only compounds containing only mainElements and secondaryElements are returned
             *          - if false then compounds containing at least mainElements and secondaryElements are returned
             *            (compounds with other additional elements might be returned)
             */
        {
            compounds = compounds || []; // make sure compounds is valid as AngularJS calls filter function with undefined input as part of digest / $parseFilter cycle (causing exceptions)
                                         // (not explicitely required in ng doc but see example at https://docs.angularjs.org/guide/filter#creating-custom-filters
            return compounds.filter(function (compound, index, array) {
                function inCompound(element) {
                    // tests if the Element symbol is found inside the compound formula parenthesises
                    // e.g. in "Antlerite (Cu3(OH)4SO4)"
                    var search_re = new RegExp("\\(.*" + element.symbol + ".*\\)");
                    return (compound.real_name.search(search_re) != -1);
                    //return (compound.real_name.indexOf(element.symbol) != -1);
                }
                if (compoundExactComposition) {
                    var compoundElements = extractElements(compound.real_name);
                    var allcpElements = mainElements.selected.map(e => e.symbol).concat(secondaryElements.selected.map(e => e.symbol));
                    return allcpElements.every(symbol => compoundElements.includes(symbol)) && compoundElements.every(symbol => allcpElements.includes(symbol));
                }
                else
                    return (mainElements.selected.every(inCompound) && secondaryElements.selected.every(inCompound));
            });
        }
});
