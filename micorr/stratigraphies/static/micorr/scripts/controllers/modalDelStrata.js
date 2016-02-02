'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalDelStrataCtrl
 * @description
 * # ModalDelStrataCtrl
 * Contrôlleur qui s'occupe de supprimer une strate dans le service
 *
 * !!!CE FICHIER N'EST PLUS UTILISE!!!
 *
 */
angular.module('micorrApp')
    .controller('ModalDelStrataCtrl', function ($scope, $modal, $log, StrataData) {
        $scope.artefactName = $scope.$parent.artefactName;

        //quand on supprime une strate, on se positionne sur la strate 0 et on met à jour le dessin
        $scope.doUpdate = function () {
            StrataData.delStrata();
            $scope.$emit('doUpdate', 0);
            $scope.$emit('updateDraw');
        };

        //ouverture de la fenêtre de suppression de la strate.
        // SI on appuie sur ok alors la strate est supprimée dans le service et le dessin est mis à jour
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'delStrataContent.html',
                size: size,
                controller: ['$scope', '$modalInstance','scopeParent', 'id',
                    function($scope, $modalInstance,scopeParent,id) {
                        $scope.ok = function() {

                            scopeParent.doUpdate();

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
