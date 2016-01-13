'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:ModalAddStratigraphyInstanceCtrl
 * @description
 * # ModalAddStratigraphyInstanceCtrl
 * instance du contrôlleur qui s'occupe de l'ajout d'une stratigraphie
 */
angular.module('micorrApp')
    .controller('ModalAddStratigraphyInstanceCtrl', function ($scope, $route, $modalInstance, MiCorrService, artefact) {
        $scope.route = $route;
        $scope.artefactName = artefact;
        $scope.strat = '';              // nom de la nouvelle stratigraphie
        $scope.s = [];                  // liste des stratigraphies pour cet artrefact

         /* Permet de proposer un nom automatique de stratigraphie à l'utilisateur quand ce dernier
          * appuie sur add stratigraphy. Le nom est calculé puis proposé dans le textarea de la modal
         * @params nom de l'artefact
         * @returns
         */
        MiCorrService.getStratigraphyByArtefact($scope.artefactName).success(function(data){
            $scope.s = data['strats'];  // on récupère toutes les stratigraphies pour cet artefact
            // après on affiche dans la modal la stratigraphie sous forme :
            // artefact_stratigrahpyN
            $scope.strat = $scope.artefactName + "_stratigraphy" + (parseInt($scope.s.length) + 1);
        });

        // Si l'utilisateur valide le formulaire
        $scope.ok = function () {
            if (testUserInput($scope.strat)) { // on contrôle si les valeurs entrées sont ok
                var ok = true;
                for (var i = 0; i < $scope.s.length; i++){
                    if ($scope.s[i].description == $scope.strat){
                        alert("This stratigraphy already exists for this artefact!");
                        ok = false;
                        break;
                    }
                }

                if (ok){    // Si tout est ok alors on ajoute la stratigraphie
                    MiCorrService.addStratigraphy($scope.artefactName, $scope.strat).success(function (data) {
                        if (data['insertStatus'] == true) {
                            $modalInstance.close();
                            $scope.route.reload();
                        }
                        else {
                            console.log("Impossible d'ajouter la stratigraphie.");
                            alert("Erreur d'ajout de la stratigraphie");
                        }
                    })
                }
            }
            else
                alert("Only alphanumeric characters and '_' are allowed");
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
