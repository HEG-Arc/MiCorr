'use strict';

import {natures, returnNatureCharacteristic} from "../init";
import {Strata} from "../business/strata";
import {Characteristic} from "../business/characteristic";


/**
 * @ngdoc function
 * @name micorrApp.controller:AddStratigraphyCtrl
 * @description
 * # AddStratigraphyCtrl
 * Contrôlleur qui s'occupe d'ajouter une strate
 */
angular.module('micorrApp')
    .controller('ModalAddStrataCtrl', function ($scope, $rootScope, $route, $modal, MiCorrService, StratigraphyData) {
        $rootScope.route = $route;
        $rootScope.natures = natures;

        $scope.artefactName = $scope.$parent.artefactName;

        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'modalAddStrata.html',
                controller: ['$scope', 'scopeParent', '$modalInstance',
                    function ($scope, scopeParent, $modalInstance) {
                        $scope.ok = function () {

                            var nature = returnNatureCharacteristic($scope.nature.code);
                            if (nature != undefined) {
                                var newStrata = new Strata(nature.getRealName(), false);
                                newStrata.replaceCharacteristic(nature);
                                newStrata.setIndex(StratigraphyData.getStratigraphy().getStratas().length);
                                newStrata.setUid(StratigraphyData.getStratigraphy().getUid() + '_strata_' + (newStrata.getIndex() + 1));

                                //Si c'est une strate CM on lui ajoute deux strates enfant
                                if (nature.getRealName() == 'Corroded metal') {
                                    //Ajout d'un ratio de corrosion défini à 1 par défaut
                                    var ratioChar = new Characteristic();
                                    ratioChar.setName('r1Characteristic');
                                    ratioChar.setRealName('r1');
                                    ratioChar.setFamily('cmCorrosionRatioFamily')
                                    newStrata.replaceCharacteristic(ratioChar);

                                    //Ajout de la sous strate CP
                                    var cpNature = returnNatureCharacteristic('CP');
                                    var childCPStrata = new Strata(cpNature.getRealName(), true);
                                    childCPStrata.replaceCharacteristic(cpNature);
                                    childCPStrata.setUid(newStrata.getUid() + '_childCP');
                                    newStrata.addChildStrata(childCPStrata);

                                    //Ajout de la sous strate M
                                    var mNature = returnNatureCharacteristic('M');
                                    var childMStrata = new Strata(mNature.getRealName(), true);
                                    childMStrata.replaceCharacteristic(mNature);
                                    childMStrata.setUid(newStrata.getUid() + '_childM');
                                    newStrata.addChildStrata(childMStrata);
                                }


                                StratigraphyData.pushOneStrata(newStrata);

                                scopeParent.$emit('doUpdate', StratigraphyData.getStratigraphy().getStratas().length - 1);
                                scopeParent.$emit('updateDraw');
                                $modalInstance.close();
                            }

                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                resolve: {
                    scopeParent: function () {
                        return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                    }
                }
            });
        }

    });
