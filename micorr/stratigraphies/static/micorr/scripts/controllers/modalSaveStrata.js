'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalSaveStrataCtrl
 * @description
 * # ModalSaveStrataCtrl
 * Contrôlleur qui s'occupe de sauvegarder une stratigraphie
 */
angular.module('micorrApp')
    .controller('ModalSaveStrataCtrl', function ($scope, $route, $modal, $log, $location, MiCorrService) {
        $scope.artefactName = $scope.$parent.artefactName;
        $scope.email_to = 'alessio.desanto@he-arc.ch';

        MiCorrService.isAuthenticated().success(function(data){
            $scope.is_authenticated = data['is_authenticated'];
        });

         // appelle une méthode parent pour sauvegarder la stratigraphie qui se trouve dans le service
        $scope.doSave = function () {
            $scope.$emit('save');
            $scope.$emit('updateDraw');
        };

        $scope.doSend = function () {
            MiCorrService.sendEmail($scope.email_to, $location.url());
        };

        // ouvre la fenêtre et si l'utilisateur appuie sur ok alors on sauvegarde
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'saveStrataContent.html',
                size: size,
                controller: ['$scope', '$modalInstance','scopeParent', 'id',
                    function($scope, $modalInstance,scopeParent,id) {
                        $scope.ok = function() {
                            scopeParent.doSave();
                            $modalInstance.close();
                        };
                        $scope.send = function() {
                            scopeParent.doSend();
                            $modalInstance.close();
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ],
                resolve: {
                    scopeParent: function() {
                        return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                    },
                    id: function(){
                        return $scope.id; // On passe en paramètre l'id de l'élément à supprimer.
                    }
                }
            });

        };
    });
