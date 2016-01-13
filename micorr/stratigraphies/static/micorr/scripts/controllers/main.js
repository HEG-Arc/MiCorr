'use strict';

/**
 * @ngdoc function
 * @name micorrApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Contrôlleur très important car il est appelé une fois lors du chargement du site
 * Ce contrôlleur est parent à chaque autres contrôlleurs de micorrApp
 * Lorsqu'on appelle une page de micorrApp ce contrôlleur est exécuté et il fait principalement une seule chose
 * Il va chercher la liste des charactéristiques présentes dans la base afin de les charger dans les services
 * TO SOLVE -->
 * Attention si on accède aux détails d'une stratigraphie sans que les caractéristiques soient chargées au préalable alors il va y avoir un problème
 * On doit avant tout accéder d'abord à la liste des artefacts ou stratigraphies avant d'aller dans les détails sinon les charactéristiques ne sont pas chargées
 */
angular.module('micorrApp')
    .controller('MainCtrl', function ($scope, $route, $routeParams, MiCorrService, StrataData, ngProgress) {

    ngProgress.height('4px');
    ngProgress.start();

    /* Quand le site est chargé pour la première fois le contrôlleur fait une requête asynchrone
     * Il va chercher la liste de toutes les caractéristiques afin de les mettre dans le service (StrataData)
     * La liste est au format json. Elle est constitué de charactéristiques classées par famille
     * Chaque charactéristique peut avoir une sous-caractéristique et chaque sous caractéristique peut avoir une sous caractéristique
     * Attention une sous caractéristique n'est pas liée à une famille mais à une caractéristique
     */
    MiCorrService.getAllCharacteristic().success(function(data){
        ngProgress.complete();

        $scope.characteristics = data;

        StrataData.setRawCharacteristics($scope.characteristics);

        // On commence par retrouver dans notre document chaque caractéristique et on la met dans notre service
        StrataData.setShapeFamily($scope.parseCharasteristic('shapeFamily'));
        StrataData.setWidthFamily($scope.parseCharasteristic('widthFamily'));
        StrataData.setThicknessFamily($scope.parseCharasteristic('thicknessFamily'));
        StrataData.setContinuityFamily($scope.parseCharasteristic('continuityFamily'));
        StrataData.setDirectionFamily($scope.parseCharasteristic('directionFamily'));
        StrataData.setColourFamily($scope.parseCharasteristic('colourFamily'));
        StrataData.setBrightnessFamily($scope.parseCharasteristic('brightnessFamily'));
        StrataData.setOpacityFamily($scope.parseCharasteristic('opacityFamily'));
        StrataData.setMagnetismFamily($scope.parseCharasteristic('magnetismFamily'));
        StrataData.setPorosityFamily($scope.parseCharasteristic('porosityFamily'));
        StrataData.setCprimicrostructureFamily($scope.parseCharasteristic('cpriMicrostructureFamily'));
        StrataData.setMmicrostructureFamily($scope.parseCharasteristic('mMicrostructureFamily'));
        StrataData.setCohesionFamily($scope.parseCharasteristic('cohesionFamily'));
        StrataData.setHardnessFamily($scope.parseCharasteristic('hardnessFamily'));
        StrataData.setCrackingFamily($scope.parseCharasteristic('crackingFamily'));
        StrataData.setScompositionFamily($scope.parseCharasteristic('sCompositionFamily'));
        StrataData.setNmmCompositionFamily($scope.parseCharasteristic('nmmCompositionFamily'));
        StrataData.setDcompositionFamily($scope.parseCharasteristic('dCompositionFamily'));
        StrataData.setPomcompositionFamily($scope.parseCharasteristic('pomCompositionFamily'));
        StrataData.setCpcompositionFamily($scope.parseCharasteristic('cpCompositionFamily'));
        StrataData.setCmcompositionFamily($scope.parseCharasteristic('cmCompositionFamily'));
        StrataData.setMcompositionFamily($scope.parseCharasteristic('mCompositionFamily'));
        StrataData.setInterfaceprofileFamily($scope.parseCharasteristic('interfaceProfileFamily'));
        StrataData.setInterfacetransitionFamily($scope.parseCharasteristic('interfaceTransitionFamily'));
        StrataData.setInterfaceroughnessFamily($scope.parseCharasteristic('interfaceRoughnessFamily'));
        StrataData.setInterfaceadherenceFamily($scope.parseCharasteristic('interfaceAdherenceFamily'));
        StrataData.setCmlevelofcorrosionFamily($scope.parseCharasteristic('cmLevelOfCorrosionFamily'));
        StrataData.setCpcompositionextensionFamily($scope.parseCharasteristic('cpCompositionExtensionFamily'));
        StrataData.setCprimicrostructureaggregatecompositionFamily($scope.parseCharasteristic('cpriMicrostructureAggregateCompositionFamily'));
        StrataData.setCprimicrostructureaggregatecompositionextensionFamily($scope.parseCharasteristic('cpriMicrostructureAggregateCompositionExtensionFamily'));

        // on met ensuite les sous-caractéristiques et sous sous caractéristiques dans notre service
        StrataData.setSubcpcompositionFamily($scope.getSubCharacteristicsFromFamily('cpCompositionFamily', 'sub'));
        StrataData.setSubsubcpcompositionFamily($scope.getSubCharacteristicsFromFamily('cpCompositionFamily', 'subsub'));

        StrataData.setSubcprimicrostructureFamily($scope.getSubCharacteristicsFromFamily('cpriMicrostructureFamily', 'sub'));
        StrataData.setSubcprimicrostructureaggregatecompositionFamily($scope.getSubCharacteristicsFromFamily('cpriMicrostructureAggregateCompositionFamily', 'sub'));
        StrataData.setSubsubcprimicrostructureaggregatecompositionFamily($scope.getSubCharacteristicsFromFamily('cpriMicrostructureAggregateCompositionFamily', 'subsub'));
        StrataData.setSubcmcompositionFamily($scope.getSubCharacteristicsFromFamily('cmCompositionFamily', 'sub'));
        StrataData.setSubcmLevelOfCorrosionFamily($scope.getSubCharacteristicsFromFamily('cmLevelOfCorrosionFamily', 'sub'));
        StrataData.setSubmmicrostructureFamily($scope.getSubCharacteristicsFromFamily('mMicrostructureFamily', 'sub'));
        StrataData.setSubmcompositionFamily($scope.getSubCharacteristicsFromFamily('mCompositionFamily', 'sub'));
    }).then(function(){
        $scope.$broadcast('StrataDataLoaded');
    });

     /*
     * parcours les caractéristiques de data et retourne les caractéristiques de la famille voulue
     * @params name : nom de la famille
     * @returns liste des caractéristiques d'une famille au format json
     */
    $scope.parseCharasteristic = function(name) {
        for (var i = 0; i < $scope.characteristics.length; i++) {
            if ($scope.characteristics[i].family == name)
                return $scope.characteristics[i];
        }
    };

     /* parcourt les sous-caractéristiques de data et retourne les sous caractéristique pour une famille
     * comme une sous caractéristique n'est pas liée à une famille on doit pour une famille parcourir toutes les sous-caractéristique de chaque caractéristique
     * et retourner ces sous caractéristiques dans une liste
     * @params family : nom de la famille
     *         level('sub') : on cherche les sous-caractéristiques
     *         level('subsub') : on cherche les sous-sous caractéristiques
     * @returns liste des caractéristiques d'une famille au format Array
     */
    $scope.getSubCharacteristicsFromFamily = function(family, level) {
        var subList = [];
        var subsubList = [];
        var list = $scope.parseCharasteristic(family);
        list = list['characteristics'];
        // on parcourt les caractéristiques et sous-caractéristiques pour la famille demandée
        // on alimente ûn tableau pour les sub et subsub
        for (var i = 0; i < list.length; i++){
            var sub = list[i]['subcharacteristics'];
            for (var j = 0; j < sub.length; j++) {
                subList.push({'name' : sub[j].name});
                var subsub = sub[j]['subcharacteristics'];
                for (var k = 0; k < subsub.length; k++) {
                    //console.log(subsub);
                    subsubList.push({'name' : subsub[k].name});
                }
            }

        }

        // selon ce qu'on demande on retourne l'un ou l'autre
        if (level == "sub")
            return subList;
        else if (level == "subsub")
            return subsubList;

    };
});
