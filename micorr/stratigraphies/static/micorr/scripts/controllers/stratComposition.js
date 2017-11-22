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
            $scope.selectedMcompositionFamily = null;
            $scope.selectedSubcpcompositionFamily = null;
            $scope.selectedSubsubcpcompositionFamily = null;
            $scope.selectedSubcmcompositionFamily = null;
            $scope.selectedSubmcompositionFamily = null;

            $scope.subcpcompositionFamily = null;
            $scope.subsubcpcompositionFamily = null;
            $scope.subcmcompositionFamily = null;
            $scope.submcompositionFamily = null;

            $scope.selectedCprimicrostructureFamily = null;
            $scope.selectedCprimicrostructureaggregatecompositionFamily = null;
            $scope.selectedSubcprimicrostructureaggregatecompositionFamily = null;
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = null;
            $scope.selectedCprimicrostructureaggregatecompositionextensionFamily = [];

/*
            $scope.cprimicrostructureaggregatecompositionFamily = null;
            $scope.subcprimicrostructureaggregatecompositionFamily = null;
            $scope.subsubcprimicrostructureaggregatecompositionFamily = null;
            $scope.cprimicrostructureaggregatecompositionextensionFamily = null;
*/

            $scope.selectedCpcompositionextensionFamily = [];
            //Les tableaux pour les picklist des strates enfant.
            $scope.selectedCmcpcomposition = [];
            $scope.selectedCmmcomposition = [];
            $scope.selectedCmcpaggregateCompositionFamily = [];
        }
        emptyFields();

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
            $scope.cmcpaggregateCompositionFamily = StratigraphyData.getCmcpaggregateCompositionFamily()['characteristics'];
            $scope.descriptions = StratigraphyData.descriptions;

            $scope.cprimicrostructureaggregatecompositionFamily = StratigraphyData.getCprimicrostructureaggregatecompositionFamily()['characteristics'];
            $scope.subcprimicrostructureaggregatecompositionFamily =StratigraphyData.getSubcprimicrostructureaggregatecompositionFamily();
            $scope.subsubcprimicrostructureaggregatecompositionFamily = StratigraphyData.getSubsubcprimicrostructureaggregatecompositionFamily();
            $scope.cprimicrostructureaggregatecompositionextensionFamily = StratigraphyData.getCprimicrostructureaggregatecompositionextensionFamily()['characteristics'];
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = StratigraphyData.getSubsubcprimicrostructureaggregatecompositionFamily();

/*
            setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
            $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), temp[index].getSubcprimicrostructureaggregateCompositionFamily());
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubsubcprimicrostructureaggregateCompositionFamily());
*/
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
            let characteristics = strata.getCharacteristicsByFamily("cpriMicrostructureAggregateCompositionFamily");
            if (characteristics.length > 0) {
                $scope.selectedCprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.cprimicrostructureaggregatecompositionFamily, characteristics[0].getName());
            }
            characteristics = strata.getCharacteristicsByFamily("cpriMicrostructureAggregateCompositionExtensionFamily");
            if (characteristics.length > 0) {
                $scope.selectedCprimicrostructureaggregatecompositionextensionFamily = getCharacteristicByItsNameMulti($scope.cprimicrostructureaggregatecompositionextensionFamily, characteristics);
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

            // met à jour les données des formulaires en fonction de mcompositionFamily
            if (strata.getSubCharacteristicsByFamily("submcompositionFamily").length > 0) {
                if (strata.findDependency('submcompositionFamily')) {
                    $scope.submcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'mCompositionFamily', strata.getCharacteristicsByFamily('mCompositionFamily')[0].getName(), '');
                    $scope.selectedSubmcompositionFamily = getCharacteristicByItsName($scope.submcompositionFamily, strata.getSubCharacteristicsByFamily('submcompositionFamily')[0].getName());
                }
            }

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
                    $scope.subcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), '');
                    $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcpcompositionFamily, strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getName());
                }
            }
            // met à jour les données des formulaires en fonction de subcpcompositionFamily
            if (strata.getSubCharacteristicsByFamily("subsubcpcompositionFamily").length > 0) {
                if (strata.findDependency('subsubcpcompositionFamily')) {
                    $scope.subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCharacteristicsByFamily('cpCompositionFamily')[0].getName(), strata.getSubCharacteristicsByFamily('subcpcompositionFamily')[0].getUid());
                    $scope.selectedSubsubcpcompositionFamily = getCharacteristicByItsName($scope.subsubcpcompositionFamily, strata.getSubCharacteristicsByFamily('subsubcpcompositionFamily')[0].getName());
                }
            }
            // met à jour les données des formulaires en fonction de cpriMicrostructureAggregateCompositionFamily
            if (strata.getSubCharacteristicsByFamily("subcprimicrostructureaggregatecompositionFamily").length > 0) {
                if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')) {
                    $scope.subcprimicrostructureaggregatecompositionFamily =
                        returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(),
                            'cpriMicrostructureAggregateCompositionFamily',
                            strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily')[0].getName(), '');
                    $scope.selectedSubcprimicrostructureaggregatecompositionFamily =
                        getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily,
                            strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily')[0].getName());
                }
            }
            // met à jour les données des formulaires en fonction de subcprimicrostructureaggregatecompositionFamily
            if (strata.getSubCharacteristicsByFamily("subsubcprimicrostructureaggregatecompositionFamily").length > 0) {
                if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')) {
                    $scope.subsubcprimicrostructureaggregatecompositionFamily =
                        returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(),
                            'cpriMicrostructureAggregateCompositionFamily',
                            strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily')[0].getName(),
                            strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily')[0].getUid());
                    $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subsubcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subsubcprimicrostructureaggregatecompositionFamily')[0].getName());
                }
            }
        });

        /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
         * @params
         * @returns
         */
        $scope.upComposition = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            strata.updateCharacteristic('cpriMicrostructureAggregateCompositionFamily', $scope.selectedCprimicrostructureaggregatecompositionFamily);
            strata.updateSubCharacteristic('subsubcprimicrostructureaggregatecompositionFamily', $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily);
            strata.updateCharacteristicList('cpriMicrostructureAggregateCompositionExtensionFamily', $scope.selectedCprimicrostructureaggregatecompositionextensionFamily);
            strata.updateCharacteristic('sCompositionFamily', $scope.selectedScompositionFamily);
            strata.updateCharacteristic('nmmCompositionFamily',$scope.selectedNmmcompositionFamily);
            strata.updateCharacteristic('dCompositionFamily',$scope.selectedDcompositionFamily);
            strata.updateCharacteristic('pomCompositionFamily',$scope.selectedPomcompositionFamily);
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
            strata.updateSubCharacteristic('submcompositionFamily', $scope.selectedSubmcompositionFamily);
            strata.updateCharacteristicList('cpCompositionExtensionFamily', $scope.selectedSubmcompositionFamily);
            strata.updateCharacteristic('cpriMicrostructureAggregateCompositionFamily', $scope.selectedCprimicrostructureaggregatecompositionFamily);
            strata.updateSubCharacteristic('subsubcprimicrostructureaggregatecompositionFamily', $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily);
            strata.updateCharacteristicList('cpriMicrostructureAggregateCompositionExtensionFamily', $scope.selectedCprimicrostructureaggregatecompositionextensionFamily);

            $scope.$emit('updateSelectedStrata');
            $scope.$emit('updateFormOnly');
        };

        /* Met à jour les données quand les valeurs de mcomposition, cpcomposition ou cmcomposition changent
         * @params
         * @returns
         */
        $scope.upComposition2 = function () {

            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

            if ($scope.selectedMcompositionFamily != null) {
                if (strata.findDependency('mcompositionFamily')) {
                    var char = new characteristic.Characteristic();
                    char.setFamily('mCompositionFamily');

                    char.setName($scope.selectedMcompositionFamily.name);
                    char.setRealName($scope.selectedMcompositionFamily.real_name);

                    strata.replaceCharacteristic(char);

                    if (strata.getCharacteristicsByFamily('mCompositionFamily').length > 0) {
                        $scope.submcompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'mCompositionFamily', strata.getCharacteristicsByFamily('mCompositionFamily')[0].getName(), '');

                        if (strata.getSubCharacteristicsByFamily('submcompositionFamily').length > 0) {
                            $scope.selectedSubmcompositionFamily = getCharacteristicByItsName($scope.submcompositionFamily, strata.getSubCharacteristicsByFamily('submcompositionFamily')[0].getName());
                        }
                    }
                }
            }

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

            if (strata.updateCharacteristic('cpriMicrostructureAggregateCompositionFamily', $scope.selectedCprimicrostructureaggregatecompositionFamily)) {
                $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getFirstCharacteristicByFamily('cpriMicrostructureAggregateCompositionFamily', 'name'), '');
                $scope.subsubcprimicrostructureaggregatecompositionFamily = null;
                if (strata.getCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily').length > 0) {
                    $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily')[0].getName());
                }
                $scope.$emit('updateSelectedStrata');
                $scope.$emit('updateFormOnly');
            }
        }

//Met à jour les données quand les valeurs de subcpcomposition changent
        $scope.upComposition3 = function () {
            var strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];

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

            if (strata.updateSubCharacteristic('subcprimicrostructureaggregatecompositionFamily',
                    $scope.selectedSubcprimicrostructureaggregatecompositionFamily))
            {
                // After changing strata Sub characteristic update subsub characteristic list (Aggregate compound)
                // (as in upComposition3 for subsubcpcompositionFamily)
                $scope.subsubcprimicrostructureaggregatecompositionFamily =
                    returnSubCharacteristicsFromParent(StratigraphyData.getRawCharacteristics(),
                        'cpriMicrostructureAggregateCompositionFamily',
                        strata.getCharacteristicsByFamily('cpriMicrostructureAggregateCompositionFamily')[0].getName(),
                        strata.getSubCharacteristicsByFamily('subcprimicrostructureaggregatecompositionFamily')[0].getUid());

                if (strata.getSubCharacteristicsByFamily('subsubcprimicrostructureaggregatecompositionFamily').length > 0) {
                    $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily =
                        getCharacteristicByItsName($scope.subsubcprimicrostructureaggregatecompositionFamily,
                            strata.getSubCharacteristicsByFamily('subsubcprimicrostructureaggregatecompositionFamily')[0].getName());
                }
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
