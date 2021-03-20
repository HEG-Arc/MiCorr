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

        MiCorrService.isAuthenticated().then(function(response){
            $scope.is_authenticated = response.data['is_authenticated'];
        });

         // appelle une méthode parent pour sauvegarder la stratigraphie qui se trouve dans le service
        $scope.doSave = function () {
            $scope.$emit('save');
        };

        $scope.doSend = function (email_to) {
            MiCorrService.sendEmail(email_to, $location.url());
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

        // ouvre la fenêtre et si l'utilisateur appuie sur ok alors on sauvegarde
        $scope.open_send = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'sendStrataContent.html',
                size: size,
                controller: ['$scope', '$modalInstance','scopeParent', 'id',
                    function($scope, $modalInstance,scopeParent,id) {
                        $scope.email_to = ""
                        $scope.send = function() {
                            scopeParent.doSave();
                            scopeParent.doSend($scope.email_to);
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
