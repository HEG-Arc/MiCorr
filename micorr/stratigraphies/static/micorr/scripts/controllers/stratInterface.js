'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:StratInterfaceCtrl
 * @description
 * # StratInterfaceCtrl
 * Contrôlleur qui s'occupe de l'onglet de l'interface
 */
angular.module('micorrApp')
    .controller('StratInterfaceCtrl', function ($scope, $route, $window, StrataData) {

        //valeurs sélectionnées dans les champs de notre formulaire
        $scope.selectedInterfaceprofileFamily;
        $scope.selectedInterfacetransitionFamily;
        $scope.selectedInterfaceroughnessFamily;
        $scope.selectedInterfaceadherenceFamily;

        var initStratInterface = function(){
            // On récupère les valeurs qui vont aller dans les champs de notre formulaire
            $scope.interfaceprofileFamily = StrataData.getInterfaceprofileFamily()['characteristics'];
            $scope.interfacetransitionFamily = StrataData.getInterfacetransitionFamily()['characteristics'];
            $scope.interfaceroughnessFamily = StrataData.getInterfaceroughnessFamily()['characteristics'];
            $scope.interfaceadherenceFamily = StrataData.getInterfaceadherenceFamily()['characteristics'];
        };

        $scope.$on('initShowStrat', function(event) {
            initStratInterface();
        });


         /*
         * Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
         * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
         */
        $scope.$on('updateInterface', function(){
            var strata = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];

            $scope.selectedInterfaceprofileFamily = getCharacteristicByItsName($scope.interfaceprofileFamily, strata.getInterfaceprofileFamily());
            if (strata.findDependency('interfacetransitionFamily'))
                $scope.selectedInterfacetransitionFamily = getCharacteristicByItsName($scope.interfacetransitionFamily, strata.getInterfacetransitionFamily());
            if (strata.findDependency('interfaceroughnessFamily'))
                $scope.selectedInterfaceroughnessFamily = getCharacteristicByItsName($scope.interfaceroughnessFamily, strata.getInterfaceroughnessFamily());
            if (strata.findDependency('interfaceadherenceFamily'))
                $scope.selectedInterfaceadherenceFamily = getCharacteristicByItsName($scope.interfaceadherenceFamily, strata.getInterfaceadherenceFamily());

        });

         /*
         * Met à jour les données de la strate en fonction des valeurs dans le formulaire
         */
        $scope.upInterface = function() {
            var temp = StrataData.getStratas();
            var index = StrataData.getCurrentSelectedStrata();

            temp[index].setInterfaceprofileFamily($scope.selectedInterfaceprofileFamily.name);
            if (temp[index].findDependency('interfacetransitionFamily'))
                temp[index].setInterfacetransitionFamily($scope.selectedInterfacetransitionFamily.name);
            if (temp[index].findDependency('interfaceroughnessFamily'))
                temp[index].setInterfaceroughnessFamily($scope.selectedInterfaceroughnessFamily.name);
            if (temp[index].findDependency('interfaceadherenceFamily'))
                temp[index].setInterfaceadherenceFamily($scope.selectedInterfaceadherenceFamily.name);

            $scope.$emit('updateDraw');
        };
    });
