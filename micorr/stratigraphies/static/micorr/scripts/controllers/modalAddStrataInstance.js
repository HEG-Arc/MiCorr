'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalAddStrataInstanceCtrl
 * @description
 * # ModalAddStrataInstanceCtrl
 * Instance du contrôlleur qui s'occupe d'ajouter une strate
 *
 * !!!CE FICHIER N'EST PLUS UTILISE!!!
 *
 */
angular.module('micorrApp')
    .controller('ModalAddStrataInstanceCtrl', function ($scope, $route, $modalInstance, MiCorrService, arg1, StrataData) {
        $scope.route = $route;
        $scope.natures = natures;
        $scope.nature;
        $scope.strataName;
        $scope.strataUid;

        // quand l'utilisateur appuie sur ok, on créé une instance de strate, et on l'ajoute dans notre service
        $scope.ok = function () {
            var newStrata = natureFactory($scope.nature);
            newStrata.setName($scope.strataName);
            newStrata.setUid($scope.strataUid);
            StrataData.pushOneStrata(newStrata);
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
