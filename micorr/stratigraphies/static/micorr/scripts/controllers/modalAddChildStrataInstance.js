'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalAddChildStrataInstanceCtrl
 * @description
 * # ModalAddChildStrataInstanceCtrl
 * Instance du contrôlleur qui s'occupe d'ajouter une strate enfant
 */
angular.module('micorrApp')
    .controller('ModalAddChildStrataInstanceCtrl', function ($scope, $route, $modalInstance, MiCorrService, arg1, StrataData) {
        $scope.route = $route;
        $scope.natures = natures;
        $scope.nature;
        $scope.strataName;
        $scope.strataUid;

        // quand l'utilisateur appuie sur ok, on créé une instance de strate, et on l'ajoute dans notre service
        // TODO: ask Marcel why he does $scope.strataName as it is empty
        $scope.ok = function () {
            var newStrata = natureFactory($scope.nature);
            newStrata.setName($scope.strataName + "_Child");
            newStrata.setUid($scope.strataUid);
            StrataData.pushOneStrata(newStrata);
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
