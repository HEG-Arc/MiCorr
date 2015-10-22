/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 */

//routage de l'application
angular.module('MiCorr', ['ngRoute', 'ngResource', 'ui.bootstrap', 'fxpicklist', 'ngProgress']).
  config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.
        when('/artefact/:name', { // affichage des stratigraphies
            templateUrl: '../static/micorr/views/artefact.html',
            controller: 'showArtefact'
        }).
        when('/artefact/:artefact/:strat/:stratigrapgydescription', { // affichage de la stratigraphie
            templateUrl: '../static/micorr/views/strat.html'
        }).
        otherwise({
            redirectTo: '/', // affichage des artefacts
            templateUrl: '../static/micorr/views/listartefacts.html',
            controller: 'listArtefacts'
        });

    // Désactivation de la mis en cache pour requetes http pour IE
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

// Controlleur qui est appelé lors de l'affichage d'une stratographie
angular.module('MiCorr').controller('showStrat', function ($scope, $routeParams, $timeout, MiCorrService, StrataData) {

    // Variable mise a false à chaque fois qu'n ouvre une stratigraphie
    $scope.askLeave = false;
    // Quand l'url change on appelle cette méthode
    $scope.$on('$locationChangeStart', function( event ) {
        if ($scope.askLeave == true){ // Si on a modifié quelque chose alors on demande si on veut quitter la page sans sauver
            var answer = confirm("Are you sure you want to leave this page ?")
            if (!answer) {
                event.preventDefault();
            }
        }
    });

    // on charge une nouvelle stratigraphie donc on supprime la stratigraphie en mémoire dans le service
    StrataData.clear();

    /* Déplace une strate vers le haut et met à jour l'interface
     * @params i strate actuelle qui va se faire déplacer
     * @returns
     */
    $scope.movestrataup = function(i) {
            var current = parseInt(i);
            if (current > 0) {
                StrataData.swapTwoStratas(current, current - 1);
                $scope.$broadcast('doUpdate', current - 1);
                $scope.$broadcast('updateDraw');
            }
    };

     /* Déplace une strate vers le bas et met à jour l'interface
     * @params i strate actuelle qui va se faire déplacer
     * @returns
     */
    $scope.movestratadown = function(i) {
        var current = parseInt(i);
        if (parseInt(StrataData.getCurrentSelectedStrata()) + 1 < StrataData.getStratas().length){
            StrataData.swapTwoStratas(current, current + 1);
            $scope.$broadcast('doUpdate', current + 1);
            $scope.$broadcast('updateDraw', current + 1);
        }
    };


    // variable qui permettent d'afficher les interfaces ou morphologies
    // par défaut quand on arrive sur l'application, on aterrit sur l'onglet de morphologie
    $scope.activeTabInterface = false;
    $scope.activeMorphologyTab = true;

    /* Affiche l'onglet des interface quand l'utilisateur clique sur l'interface générée
     * @params
     * @returns
     */
    $scope.setInterfaceTab = function(val) {
        $scope.activeTabInterface = val;
        $scope.activeMorphologyTab = !val;
        $scope.$apply();
    }


    $scope.artefactName     = $routeParams.artefact;        // nom de l'artefact
    $scope.stratigraphyName = $routeParams.strat;           // nom de la stratigraphie
    $scope.stratigrapgydescription = $routeParams.stratigrapgydescription; // description de la stratigraphie
    $scope.rstratas         = StrataData.getStratas();      // liste des strates de la stratigraphie se trouvant dans le service
    $scope.natures          = natures;                      // liste des natures de matériau dans le fichier init.js
    $scope.strataName       = "No strata selected";         // par défaut aucune strata n'est choisie
    $scope.natureFamilyname = "";                           // par défaut aucune nature n'est choisie

    //ces variables servent à afficher/masquer dans le formulaire les champs appartenants à une nature de matériau
    // par exemple SI on prend D, le champ colourFamily s'affiche alors qu'il va se masquer dès qu'on va sélectionner un SV
    $scope.showTabForms = false;        //par défaut le formulaire est masqué

    $scope.showColor = false;
    $scope.showBrightness = false;
    $scope.showOpacity = false;
    $scope.showMagnetism = false;
    $scope.showPorosity = false;
    $scope.showcprimicrostructureFamily = false;
    $scope.showmmicrostructureFamily = false;
    $scope.showCohesion = false;
    $scope.showHardness = false;
    $scope.showCracking = false;
    $scope.showScomposition = false;
    $scope.showNmmcomposition = false;
    $scope.showDcomposition = false;
    $scope.showPomcomposition = false;
    $scope.showCpcomposition = false;
    $scope.showCmcomposition = false;
    $scope.showMcomposition = false;
    $scope.showinterfacetransition = false;
    $scope.showinterfaceroughness = false;
    $scope.showinterfaceadherence = false;
    $scope.showCmlevelofcorrosionFamily = false;
    $scope.showcpcompositionextensionfamily = false;
    $scope.showcprimicrostructureaggregatecompositionFamily = false;
    $scope.showcprimicrostructureaggregatecompositionextensionFamily = false;
    $scope.showsubcpcompositionFamily = false;
    $scope.showsubsubcpcompositionFamily = false;
    $scope.showsubcprimicrostructureFamily = false;
    $scope.showsubcprimicrostructureaggregatecompositionFamily = false;
    $scope.showsubsubcprimicrostructureaggregatecompositionFamily = false;
    $scope.showsubcmcompositionFamily = false;
    $scope.showsubcmlevelofcorrosionFamily = false;
    $scope.showsubmmicrostructureFamily = false;
    $scope.showsubmcompositionFamily = false;

    //Quand on accède au détail d'une stratigraphie, la première chose effectuée est le chargement en asynchrone des strates qui constituent cette stratigraphie.
    MiCorrService.getDetailedStratigraphy($scope.stratigraphyName).success(function(data){
        // On parcourt toutes les strates que le service nous a retourné
        for (var i = 0; i < data.length; i++) {
            var loadedStrata = data[i];
            // Pour pouvoir générer une strates, il faut au minimum une charactéristique qui est natureFamily. Si elle n'existe pas alors il ne peut pas y avoir de strates
            if (loadedStrata['characteristics'].length == 0){
                console.log("Can not load this strata. Probably this strata has no natureFamily characteristics !");
                alert("Error : Strata '" + loadedStrata.name + "' has no nature characteristics. This strata can not be loaded !");
            }
            else { // Si c'est tout bon on génère la strate
                // On commence par créer une instance de strate qui contient les valeurs des données communes à chaque strates
                var strata = natureFactory($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "natureFamily"));
                strata.setNatureFamilyUid($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "natureFamily"));
                strata.setName(loadedStrata.name);

                /* on utilise la méthode getCharacteristicByFamily qui possède deux paramètres
                 * 1) la liste des charactéristiques pour cette strate au format JSON
                 * 2) la famille de characteristiques qu'on veut ressortir
                 * On fait ça comme ça car les données sont une liste au format json
                 * et cette méthode permet de retrouver la bonne charactéristique pour la bonne famille de charactéristique
                 */
                strata.setShapeFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "shapeFamily"));
                strata.setWidthFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "widthFamily"));
                strata.setThicknessFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "thicknessFamily"));
                strata.setContinuityFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "continuityFamily"));
                strata.setDirectionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "directionFamily"));

                // Puis on charge les données qui sont propres à chaque nature de strate dans l'instance de la strate
                if (strata.findDependency('colourFamily'))
                    strata.setColourFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "colourFamily"));
                if (strata.findDependency('brightnessFamily'))
                    strata.setBrightnessFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "brightnessFamily"));
                if (strata.findDependency('opacityFamily'))
                    strata.setOpacityFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "opacityFamily"));
                if (strata.findDependency('magnetismFamily'))
                    strata.setMagnetismFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "magnetismFamily"));
                if (strata.findDependency('porosityFamily'))
                    strata.setPorosityFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "porosityFamily"));
                if (strata.findDependency('cprimicrostructureFamily'))
                    strata.setCpriMicrostructureFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cpriMicrostructureFamily"));
                if (strata.findDependency('mmicrostructureFamily'))
                    strata.setMmicrostructureFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "mMicrostructureFamily"));
                if (strata.findDependency('cohesionFamily'))
                    strata.setCohesionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cohesionFamily"));
                if (strata.findDependency('hardnessFamily'))
                    strata.setHardnessFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "hardnessFamily"));
                if (strata.findDependency('crackingFamily'))
                    strata.setCrackingFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "crackingFamily"));
                if (strata.findDependency('scompositionFamily'))
                    strata.setScompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "sCompositionFamily"));
                if (strata.findDependency('nmmcompositionFamily'))
                    strata.setNmmCompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "nmmCompositionFamily"));
                if (strata.findDependency('dcompositionFamily'))
                    strata.setDcompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "dCompositionFamily"));
                if (strata.findDependency('pomcompositionFamily'))
                    strata.setPomCompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "pomCompositionFamily"));
                if (strata.findDependency('cpcompositionFamily'))
                    strata.setCpcompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cpCompositionFamily"));
                if (strata.findDependency('cmcompositionFamily'))
                    strata.setCmcompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cmCompositionFamily"));
                if (strata.findDependency('mcompositionFamily'))
                    strata.setMcompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "mCompositionFamily"));
                if (strata.findDependency('cmlevelofcorrosionFamily'))
                    strata.setCmLevelOfCorrosionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cmLevelOfCorrosionFamily"))
                if (strata.findDependency('cprimicrostructureaggregatecompositionFamily'))
                    strata.setCprimicrostructureaggregateCompositionFamily($scope.getCharacteristicByFamily(loadedStrata['characteristics'], "cpriMicrostructureAggregateCompositionFamily"));

                // Puis on charge les interfaces dans l'instance de la strate
                strata.setInterfaceprofileFamily($scope.getCharacteristicByFamily(loadedStrata['interfaces']['characteristics'], "interfaceProfileFamily"));
                if (strata.findDependency('interfacetransitionFamily'))
                    strata.setInterfacetransitionFamily($scope.getCharacteristicByFamily(loadedStrata['interfaces']['characteristics'], "interfaceTransitionFamily"));
                if (strata.findDependency('interfaceroughnessFamily'))
                    strata.setInterfaceroughnessFamily($scope.getCharacteristicByFamily(loadedStrata['interfaces']['characteristics'], "interfaceRoughnessFamily"));
                if (strata.findDependency('interfaceadherenceFamily'))
                    strata.setInterfaceadherenceFamily($scope.getCharacteristicByFamily(loadedStrata['interfaces']['characteristics'], "interfaceAdherenceFamily"));

                //sub
                // Puis on charge les sous-caractéristiques et sous-sous-caractéristiques
                var subCharacteristicsList = loadedStrata['subcharacteristics'];
                if (strata.findDependency('subcpcompositionFamily'))
                   strata.setSubcpcompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubcpcompositionFamily()));
                if (strata.findDependency('subsubcpcompositionFamily'))
                   strata.setSubsubcpcompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubsubcpcompositionFamily()));
                if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily'))
                    strata.setSubcprimicrostructureaggregateCompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubcprimicrostructureaggregatecompositionFamily()));
                if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily'))
                    strata.setSubsubcprimicrostructureaggregateCompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubsubcprimicrostructureaggregatecompositionFamily()));
                if (strata.findDependency('subcmcompositionFamily'))
                    strata.setSubCmcompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubcmcompositionFamily()));
                if (strata.findDependency('subcmlevelofcorrosionFamily'))
                    strata.setSubCmLevelOfCorrosionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubcmLevelOfCorrosionFamily()));
                if (strata.findDependency('submcompositionFamily'))
                    strata.setSubmcompositionFamily($scope.getSubCharacteristicByFamily(subCharacteristicsList, StrataData.getSubmcompositionFamily()));


                // Picklist
                // on charge les données pour les picklist
                if (strata.findDependency('subcprimicrostructureFamily'))
                    strata.setSubcprimicrostructureFamily($scope.getSubCharacteristicByFamilyMulti(subCharacteristicsList, StrataData.getSubcprimicrostructureFamily()));
                if (strata.findDependency('submmicrostructureFamily'))
                    strata.setSubmmicrostructureFamily($scope.getSubCharacteristicByFamilyMulti(subCharacteristicsList, StrataData.getSubmmicrostructureFamily()));
                if (strata.findDependency('cpcompositionextensionFamily'))
                    strata.setCpcompositionextensionFamily($scope.getCharacteristicByFamilyMulti(loadedStrata['characteristics'], "cpCompositionExtensionFamily"));
                if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily'))
                    strata.setCprimicrostructureaggregateCompositionextensionFamily($scope.getCharacteristicByFamilyMulti(loadedStrata['characteristics'], "cpriMicrostructureAggregateCompositionExtensionFamily"));


                // Une fois notre instance de strate créé avec tous les paramètres nécessaires, alors on l'ajoute à notre service.
                StrataData.pushOneStrata(strata);
            }
        }});

     /* cherche dans une liste une famille et retourne la valeur name de la famille
     * @params data : charactéristique au format json
     *         family : nom de la famille
     * @returns valeur de la charactéristique
     */
    $scope.getCharacteristicByFamily = function(data, family) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].family == family){
                return data[i].name;
            }
        }
        return "";
    }

    /* cherche dans une liste une famille et retourne tous les valeurs de la famille
     * @params data : charactéristique au format json
     *         family : nom de la famille
     * @returns valeurs de la charactéristique
     */
    $scope.getCharacteristicByFamilyMulti = function(data, family) {
        var t = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].family == family){
                t.push({'name' : data[i].name});
            }
        }
        return t;
    }

     /* cherche dans une liste (liste de sous-charactéristiques) une valeur et si elle correspond
     * à la valeur donnée en paramètre alors on retourne la sous caractéristique
     * @params sub : sous-charactéristique de cette strate
     *         list : liste des sous caractéristiques pour cette famille
     * @returns valeur de la charactéristique
     */
    $scope.getSubCharacteristicByFamily = function(sub, list) {
        for (var i = 0; i < sub.length; i++) {
            for (var j = 0; j < list.length; j++) {
                if (sub[i].name == list[j].name)
                    return sub[i].name;
            }
        }
        return "";
    }

    /* cherche dans une liste (liste de sous-charactéristiques) des valeurs et si elles correspondent
     * à la valeur donnée en paramètre alors on retourne les sous caractéristiques
     * @params sub : sous-charactéristique de cette strate
     *         list : liste des sous caractéristiques pour cette famille
     * @returns valeurs de la charactéristique
     */
    $scope.getSubCharacteristicByFamilyMulti = function(sub, list) {
        var t = [];
        for (var i = 0; i < sub.length; i++) {
            for (var j = 0; j < list.length; j++) {
                if (sub[i].name == list[j].name)
                    t.push({'name' : sub[i].name});
                    //return sub[i].name;
            }
        }
        return t;
    }


     /* exécute une mise à jour de l'interface après un événement en provenance d'un enfant
     * @params index : index de la strate sélectionnée
     * @returns
     */
    $scope.$on('doUpdate', function(event, index){
        $timeout(function(){// attend que tous les $apply() soient finis avant de faire notre udate
            $scope.update(index); // on donne toujours l'index de la strate sélectionnée pour la mise à jour
        });
    });

     /* exécute une mise à jour de l'interface. On met à jour le formulaire pour être plus précis
     * @params index : index de la strate sélectionnée
     * @returns
     */
    $scope.update = function(index){
        $scope.showTabForms = true; //Affichage de formulaire
        StrataData.setSelectedStrata(index); // on set dans le sevice quelle est la strate sélectionnée
        $scope.hideShowForms(StrataData.getStratas()[index]);   // On affiche/masque les champs en fonction de la nature de la strate
        $scope.strataName = StrataData.getStratas()[index].getName();   // On affiche le nom de la strate
        $scope.natureFamilyname = StrataData.getStratas()[index].getNatureFamily(); // On affiche la nature de la strate

        // Dans notre formulaire on a des onglets
        // chaque onglet a un controlleur
        // il faut mettre à jour chaque contrôlleur
        $scope.$broadcast('updateMorphology');
        $scope.$broadcast('updateTexture');
        $scope.$broadcast('updateMicrostructure');
        $scope.$broadcast('updateComposition');
        $scope.$broadcast('updateInterface');

        // apply les mises à jour de l'interface
        $scope.$apply();
        $scope.askLeave = true;
    };

    /* Met à jour le formulaire
     * @params
     * @returns
     */
    $scope.$on('updateFormOnly', function(event){
        $scope.hideShowForms(StrataData.getStratas()[StrataData.getCurrentSelectedStrata()]);
    });

     /* affiche/masque des champs en fonction de la strate
     * @params strata : strate sélectionnée
     * @returns
     */
    $scope.hideShowForms = function(strata) {
        $scope.showColor = strata.findDependency('colourFamily');
        $scope.showBrightness = strata.findDependency('brightnessFamily');
        $scope.showOpacity = strata.findDependency('opacityFamily');
        $scope.showMagnetism = strata.findDependency('magnetismFamily');
        $scope.showPorosity = strata.findDependency('porosityFamily');
        $scope.showmmicrostructureFamily = strata.findDependency('mmicrostructureFamily');
        $scope.showCohesion = strata.findDependency('cohesionFamily');
        $scope.showHardness = strata.findDependency('hardnessFamily');
        $scope.showCracking = strata.findDependency('crackingFamily');
        $scope.showScomposition = strata.findDependency('scompositionFamily');
        $scope.showNmmcomposition = strata.findDependency('nmmcompositionFamily');
        $scope.showDcomposition =  strata.findDependency('dcompositionFamily');
        $scope.showPomcomposition = strata.findDependency('pomcompositionFamily');
        $scope.showCpcomposition = strata.findDependency('cpcompositionFamily');
        $scope.showCmcomposition = strata.findDependency('cmcompositionFamily');
        $scope.showMcomposition = strata.findDependency('mcompositionFamily');
        $scope.showinterfacetransition = strata.findDependency('interfacetransitionFamily');
        $scope.showinterfaceroughness = strata.findDependency('interfaceroughnessFamily');
        $scope.showinterfaceadherence = strata.findDependency('interfaceadherenceFamily');
        $scope.showCmlevelofcorrosionFamily = strata.findDependency('cmlevelofcorrosionFamily');
        $scope.showcpcompositionextensionfamily = strata.findDependency('cpcompositionextensionFamily');
        $scope.showsubcpcompositionFamily = strata.findDependency('subcpcompositionFamily');
        $scope.showsubsubcpcompositionFamily = strata.findDependency('subsubcpcompositionFamily');
        $scope.showsubcmcompositionFamily = strata.findDependency('subcmcompositionFamily');
        $scope.showsubcmlevelofcorrosionFamily = strata.findDependency('subcmlevelofcorrosionFamily');
        $scope.showsubmmicrostructureFamily = strata.findDependency('submmicrostructureFamily');

        $scope.showcprimicrostructureFamily = strata.findDependency('cprimicrostructureFamily');
        $scope.showsubmcompositionFamily = strata.findDependency('submcompositionFamily');

        // on affiche seulement si cprimicrostructure n'est pas égal à noMiccrostructure
        if (strata.findDependency('cprimicrostructureFamily') && strata.getCpriMicrostructureFamily() != "noMicrostructureCharacteristic") {
            $scope.showsubcprimicrostructureFamily = strata.findDependency('subcprimicrostructureFamily');
            $scope.showsubcprimicrostructureaggregatecompositionFamily = strata.findDependency('subcprimicrostructureaggregatecompositionFamily');
            $scope.showsubsubcprimicrostructureaggregatecompositionFamily = strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily');
            $scope.showcprimicrostructureaggregatecompositionFamily = strata.findDependency('cprimicrostructureaggregatecompositionFamily');
            $scope.showcprimicrostructureaggregatecompositionextensionFamily = strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily');
        }
        else {
            $scope.showsubcprimicrostructureFamily = false;
            $scope.showsubcprimicrostructureaggregatecompositionFamily = false;
            $scope.showsubsubcprimicrostructureaggregatecompositionFamily = false;
            $scope.showcprimicrostructureaggregatecompositionFamily = false;
            $scope.showcprimicrostructureaggregatecompositionextensionFamily = false;
        }
    };

     /* Mise à jour du dessin lors d'un évenement provenant d'un enfant
     * @params
     * @returns
     */
    $scope.$on('updateDraw', function() {
        $timeout(function(){ // on attend que tous les $apply() soient finis
            /*On force ici la mise à jour des dessins qui sont dans une liste qui sont affichés avec une directive
             * rstratas contient une liste d'instance de stratigraphies
             * Si on met à jour une propriété dans notre service, le watch ne verra rien et rien ne sera mis à jour
             * SI on veut forcer une mise à jour il faut supprimer la référence vers le service qui contient les strates
             * forcer une mise à jour avec $apply()
             * récupérer la référence vers les strates du service et enfin refaire une mise à jour avec $apply()*/
            $scope.rstratas = new Array();
            $scope.$apply();
            $scope.rstratas = StrataData.getStratas();
            $scope.$apply();
        });
    });

     /* appelle le service rest qui sauvegarde la stratigraphie en cours de construction
     * est appelé par un événement provenant d'un enfant
     * @params
     * @returns
     */
    $scope.$on('save', function() {
        var j = JSON.stringify(StrataData.StratasToJson($scope.artefactName, $scope.stratigraphyName));
        console.log(j);
        MiCorrService.saveStratigraphy(encodeURIComponent(j));
        $scope.askLeave = false;
    });

// contrôlleur qui est le formulare qui contient les champs mais sans les onglets
}).controller('tabsStrata', function ($scope, $route, $window, MiCorrService, StrataData) {

//Contrôlleur qui s'occupe de l'onglet de la morphologie
}).controller('stratMorphologyCtrl', function ($scope, $route, $window, StrataData) {
    // On récupère les valeurs qui vont aller dans les champs de notre formulaire
    $scope.fShapeFamily     = "";
    $scope.shapeFamily      = StrataData.getShapeFamily()['characteristics'];
    $scope.widthFamily      = StrataData.getWidthFamily()['characteristics'];
    $scope.thicknessFamily  = StrataData.getThicknessFamily()['characteristics'];
    $scope.continuityFamily = StrataData.getContinuityFamily()['characteristics'];
    $scope.directionFamily  = StrataData.getDirectionFamily()['characteristics'];
    $scope.colourFamily     = StrataData.getColourFamily()['characteristics'];
    $scope.brightnessFamily = StrataData.getBrightnessFamily()['characteristics'];
    $scope.opacityFamily    = StrataData.getOpacityFamily()['characteristics'];
    $scope.magnetismFamily  = StrataData.getMagnetismFamily()['characteristics'];

    //valeurs sélectionnées dans les champs de notre formulaire
    $scope.selectedShapeFamily;
    $scope.selectedWidthFamily;
    $scope.selectedThicknessFamily;
    $scope.selectedContinuityFamily;
    $scope.selectedDirectionFamily;
    $scope.selectedColourFamily;
    $scope.selectedBrightnessFamily;
    $scope.selectedOpacityFamily;
    $scope.selectedMagnetismFamily;

     /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
     * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
     * @params
     * @returns
     */
    $scope.$on('updateMorphology', function(){
        var strata = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];
        $scope.selectedShapeFamily = getCharacteristicByItsName($scope.shapeFamily, strata.getShapeFamily());
        $scope.selectedWidthFamily = getCharacteristicByItsName($scope.widthFamily, strata.getWidthFamily());
        $scope.selectedThicknessFamily = getCharacteristicByItsName($scope.thicknessFamily, strata.getThicknessFamily());
        $scope.selectedContinuityFamily = getCharacteristicByItsName($scope.continuityFamily, strata.getContinuityFamily());
        $scope.selectedDirectionFamily = getCharacteristicByItsName($scope.directionFamily, strata.getDirectionFamily());

        if (strata.findDependency('colourFamily'))
            $scope.selectedColourFamily = getCharacteristicByItsName($scope.colourFamily, strata.getColourFamily());
        if (strata.findDependency('brightnessFamily'))
            $scope.selectedBrightnessFamily = getCharacteristicByItsName($scope.brightnessFamily, strata.getBrightnessFamily());
        if (strata.findDependency('opacityFamily'))
            $scope.selectedOpacityFamily = getCharacteristicByItsName($scope.opacityFamily, strata.getOpacityFamily());
        if (strata.findDependency('magnetismFamily'))
            $scope.selectedMagnetismFamily = getCharacteristicByItsName($scope.magnetismFamily, strata.getMagnetismFamily());


    });

     /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
     * @params
     * @returns
     */
    $scope.upMorpho = function() {
        var temp = StrataData.getStratas();
        var index = StrataData.getCurrentSelectedStrata();

        temp[index].setShapeFamily($scope.selectedShapeFamily.name);
        temp[index].setWidthFamily($scope.selectedWidthFamily.name);
        temp[index].setThicknessFamily($scope.selectedThicknessFamily.name);
        temp[index].setContinuityFamily($scope.selectedContinuityFamily.name);
        temp[index].setDirectionFamily($scope.selectedDirectionFamily.name);
        if (temp[index].findDependency('colourFamily'))
            temp[index].setColourFamily($scope.selectedColourFamily.name);
        if (temp[index].findDependency('brightnessFamily'))
            temp[index].setBrightnessFamily($scope.selectedBrightnessFamily.name);
        if (temp[index].findDependency('opacityFamily'))
            temp[index].setOpacityFamily($scope.selectedOpacityFamily.name);
        if (temp[index].findDependency('magnetismFamily'))
            temp[index].setMagnetismFamily($scope.selectedMagnetismFamily.name);

        //mise à jour du dessin
        $scope.$emit('updateDraw');
    };
//Contrôlleur qui s'occupe de l'onglet de la texture
}).controller('stratTextureCtrl', function ($scope, $route, $window, StrataData) {

    $scope.porosityFamily   = StrataData.getPorosityFamily()['characteristics'];
    $scope.cohesionFamily   = StrataData.getCohesionFamily()['characteristics'];
    $scope.hardnessFamily   = StrataData.getHardnessFamily()['characteristics'];
    $scope.crackingFamily   = StrataData.getCrackingFamily()['characteristics'];

    //valeurs sélectionnées dans les champs de notre formulaire
    $scope.selectedPorosityFamily;
    $scope.selectedCohesionFamily;
    $scope.selectedHardnessFamily;
    $scope.selectedCrackingFamily;

     /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
     * @params
     * @returns
     */
    $scope.$on('updateTexture', function(){
        var strata = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];

        if (strata.findDependency('porosityFamily'))
            $scope.selectedPorosityFamily = getCharacteristicByItsName($scope.porosityFamily, strata.getPorosityFamily());
        if (strata.findDependency('cohesionFamily'))
            $scope.selectedCohesionFamily = getCharacteristicByItsName($scope.cohesionFamily, strata.getCohesionFamily());
        if (strata.findDependency('hardnessFamily'))
            $scope.selectedHardnessFamily = getCharacteristicByItsName($scope.hardnessFamily, strata.getHardnessFamily());
        if (strata.findDependency('crackingFamily'))
            $scope.selectedCrackingFamily = getCharacteristicByItsName($scope.crackingFamily, strata.getCrackingFamily());
    });

     /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
     * @params
     * @returns
     */
    $scope.upTexture = function() {
        var temp = StrataData.getStratas();
        var index = StrataData.getCurrentSelectedStrata();

        if (temp[index].findDependency('porosityFamily'))
            temp[index].setPorosityFamily($scope.selectedPorosityFamily.name);
        if (temp[index].findDependency('cohesionFamily'))
            temp[index].setCohesionFamily($scope.selectedCohesionFamily.name);
        if (temp[index].findDependency('hardnessFamily'))
            temp[index].setHardnessFamily($scope.selectedHardnessFamily.name);
        if (temp[index].findDependency('crackingFamily'))
            temp[index].setCrackingFamily($scope.selectedCrackingFamily.name);

        $scope.$emit('updateDraw');
    };
//Contrôlleur qui s'occupe de l'onglet de la microstructure
}).controller('stratMicrostructureCtrl', function ($scope, $route, $window, StrataData) {
    // On récupère les valeurs qui vont aller dans les champs de notre formulaire
    $scope.cprimicrostructureFamily   = StrataData.getCprimicrostructureFamily()['characteristics'];
    $scope.mmicrostructureFamily      = StrataData.getMmicrostructureFamily()['characteristics'];
    $scope.cmlevelofcorrosionFamily   = StrataData.getCmlevelofcorrosionFamily()['characteristics'];
    $scope.cprimicrostructureaggregatecompositionFamily = StrataData.getCprimicrostructureaggregatecompositionFamily()['characteristics'];
    $scope.cprimicrostructureaggregatecompositionExtensionFamily = StrataData.getCprimicrostructureaggregatecompositionextensionFamily()['characteristics'];
    $scope.subcprimicrostructureFamily = StrataData.getSubcprimicrostructureFamily();
    $scope.subcprimicrostructureaggregatecompositionFamily = StrataData.getSubcprimicrostructureaggregatecompositionFamily();
    $scope.subsubcprimicrostructureaggregatecompositionFamily = StrataData.getSubsubcprimicrostructureaggregatecompositionFamily();
    $scope.subcmlevelofcorrosionFamily = StrataData.getSubcmLevelOfCorrosionFamily();
    $scope.submmicrostructureFamily = StrataData.getSubmmicrostructureFamily();

    //valeurs sélectionnées dans les champs de notre formulaire
    $scope.selectedCprimicrostructureFamily;
    $scope.selectedMmicrostructureFamily;
    $scope.selectedCmlevelofcorrosionFamily;
    $scope.selectedSubcprimicrostructureFamily = [];
    $scope.selectedCprimicrostructureaggregatecompositionFamily;
    $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = [];
    $scope.selectedSubcprimicrostructureaggregatecompositionFamily;
    $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily;
    $scope.selectedSubcmlevelofcorrosionFamily;
    $scope.selectedSubmmicrostructureFamily = [];


    $scope.upMulti = function(){
        $scope.upMicrostructure();
    };

     /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
     * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
     * @params
     * @returns
     */
    $scope.$on('updateMicrostructure', function(){
        var strata = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];

        if (strata.findDependency('cprimicrostructureFamily'))
            $scope.selectedCprimicrostructureFamily = getCharacteristicByItsName($scope.cprimicrostructureFamily, strata.getCpriMicrostructureFamily());
        if (strata.findDependency('mmicrostructureFamily'))
            $scope.selectedMmicrostructureFamily = getCharacteristicByItsName($scope.mmicrostructureFamily, strata.getMmicrostructureFamily());
        if (strata.findDependency('cmlevelofcorrosionFamily'))
            $scope.selectedCmlevelofcorrosionFamily = getCharacteristicByItsName($scope.cmlevelofcorrosionFamily, strata.getCmLevelOfCorrosionFamily());
        if (strata.findDependency('cprimicrostructureaggregatecompositionFamily'))
            $scope.selectedCprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.cprimicrostructureaggregatecompositionFamily, strata.getCprimicrostructureaggregateCompositionFamily());

        // en fonction des données dans cprimicrostructureaggregatecomposition on change les données du formulaire
        if (strata.findDependency('subcprimicrostructureaggregatecompositionFamily')){
            $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCprimicrostructureaggregateCompositionFamily(), '');
            $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, strata.getSubcprimicrostructureaggregateCompositionFamily());
        }
        // en fonction des données dans subcprimicrostructureaggregatecomposition on change les données du formulaire
        if (strata.findDependency('subsubcprimicrostructureaggregatecompositionFamily')){
            $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', strata.getCprimicrostructureaggregateCompositionFamily(), strata.getSubcprimicrostructureaggregateCompositionFamily());
            $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subsubcprimicrostructureaggregatecompositionFamily, strata.getSubsubcprimicrostructureaggregateCompositionFamily());
        }
        if (strata.findDependency('subcmlevelofcorrosionFamily'))
            $scope.selectedSubcmlevelofcorrosionFamily = getCharacteristicByItsName($scope.subcmlevelofcorrosionFamily, strata.getSubCmLevelOfCorrosionFamily());

        if (strata.findDependency('subcprimicrostructureFamily'))
            $scope.selectedSubcprimicrostructureFamily = getCharacteristicByItsNameMulti($scope.subcprimicrostructureFamily, strata.getSubcprimicrostructureFamily());
        if (strata.findDependency('submmicrostructureFamily'))
            $scope.selectedSubmmicrostructureFamily = getCharacteristicByItsNameMulti($scope.submmicrostructureFamily, strata.getSubmmicrostructureFamily());
        if (strata.findDependency('cprimicrostructureaggregatecompositionextensionFamily'))
            $scope.selectedCprimicrostructureaggregatecompositionExtensionFamily = getCharacteristicByItsNameMulti($scope.cprimicrostructureaggregatecompositionExtensionFamily, strata.getCprimicrostructureaggregateCompositionextensionFamily());

    });

     /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
     * @params
     * @returns
     */
    $scope.upMicrostructure = function() {
        var temp = StrataData.getStratas();
        var index = StrataData.getCurrentSelectedStrata();

        if (temp[index].findDependency('cprimicrostructureFamily'))
            temp[index].setCpriMicrostructureFamily($scope.selectedCprimicrostructureFamily.name);
        if (temp[index].findDependency('mmicrostructureFamily'))
            temp[index].setMmicrostructureFamily($scope.selectedMmicrostructureFamily.name);
        if (temp[index].findDependency('cmlevelofcorrosionFamily'))
            temp[index].setCmLevelOfCorrosionFamily($scope.selectedCmlevelofcorrosionFamily.name);
        /*if (temp[index].findDependency('cprimicrostructureaggregatecompositionFamily'))
            temp[index].setCprimicrostructureaggregateCompositionFamily($scope.selectedCprimicrostructureaggregatecompositionFamily.name);*/
        if (temp[index].findDependency('cprimicrostructureaggregatecompositionextensionFamily'))
            temp[index].setCprimicrostructureaggregateCompositionextensionFamily($scope.selectedCprimicrostructureaggregatecompositionExtensionFamily);
        if (temp[index].findDependency('subcmlevelofcorrosionFamily'))
            temp[index].setSubCmLevelOfCorrosionFamily($scope.selectedSubcmlevelofcorrosionFamily.name);
        if (temp[index].findDependency('submmicrostructureFamily'))
            temp[index].setSubmmicrostructureFamily($scope.selectedSubmmicrostructureFamily);
        if (temp[index].findDependency('subcprimicrostructureFamily'))
            temp[index].setSubcprimicrostructureFamily($scope.selectedSubcprimicrostructureFamily);

        /*if (temp[index].findDependency('subcprimicrostructureaggregatecompositionFamily'))
            temp[index].setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);*/
        if (temp[index].findDependency('subsubcprimicrostructureaggregatecompositionFamily'))
            temp[index].setSubsubcprimicrostructureaggregateCompositionFamily($scope.selectedSubsubcprimicrostructureaggregatecompositionFamily.name);

        $scope.$emit('updateDraw');
        //Update formulaire pour afficher/masquer les sub/cpri microstructure
        $scope.$emit('updateFormOnly');
    };


     /* est appelé quand la valeur du champ cprimicrostructurecompositionextension change
      * sert à mettre  jour les données des formulaire
     * @params
     * @returns
     */
    $scope.upMicrostructure2 = function() {
        var temp = StrataData.getStratas();
        var index = StrataData.getCurrentSelectedStrata();

        temp[index].setCprimicrostructureaggregateCompositionFamily($scope.selectedCprimicrostructureaggregatecompositionFamily.name);
        $scope.subcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), '');
        $scope.selectedSubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubcprimicrostructureaggregateCompositionFamily());

        $scope.$emit('updateFormOnly');
    };

    /* est appelé quand la valeur du champ subcprimicrostructurecompositionextension change
      * sert à mettre  jour les données des formulaire
     * @params
     * @returns
     */
    $scope.upMicrostructure3 = function() {
        var temp = StrataData.getStratas();
        var index = StrataData.getCurrentSelectedStrata();

        temp[index].setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
        $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), temp[index].getSubcprimicrostructureaggregateCompositionFamily());
        $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubsubcprimicrostructureaggregateCompositionFamily());

        $scope.$emit('updateFormOnly');
    };

//Contrôlleur qui s'occupe des picklist
}).controller('PickListCtrl', function ($scope, $location, $routeParams, MiCorrService) {


//Contrôlleur qui s'occupe de l'onglet de la composition
}).controller('stratCompositionCtrl', function ($scope, $route, $window, StrataData) {
    // On récupère les valeurs qui vont aller dans les champs de notre formulaire
    $scope.scompositionFamily      = StrataData.getScompositionFamily()['characteristics'];
    $scope.nmmcompositionFamily    = StrataData.getNmmcompositionFamily()['characteristics'];
    $scope.dcompositionFamily      = StrataData.getDcompositionFamily()['characteristics'];
    $scope.pomcompositionFamily    = StrataData.getPomcompositionFamily()['characteristics'];
    $scope.cpcompositionFamily     = StrataData.getCpcompositionFamily()['characteristics'];
    $scope.cmcompositionFamily     = StrataData.getCmcompositionFamily()['characteristics'];
    $scope.mcompositionFamily      = StrataData.getMcompositionFamily()['characteristics'];
    $scope.cpcompositionextensionFamily = StrataData.getCpcompositionextensionFamily()['characteristics'];
    $scope.subcpcompositionFamily  = StrataData.getSubcpcompositionFamily();
    $scope.subsubcpcompositionFamily  = StrataData.getSubsubcpcompositionFamily();
    $scope.subcmcompositionFamily  = StrataData.getSubcmcompositionFamily();
    $scope.submcompositionFamily = StrataData.getSubmcompositionFamily();

    //valeurs sélectionnées dans les champs de notre formulaire
    $scope.selectedScompositionFamily;
    $scope.selectedNmmcompositionFamily;
    $scope.selectedDcompositionFamily;
    $scope.selectedPomcompositionFamily;
    $scope.selectedCpcompositionFamily;
    $scope.selectedCmcompositionFamily;
    $scope.selectedMcompositionFamily;
    $scope.selectedSubcpcompositionFamily;
    $scope.selectedSubsubcpcompositionFamily;
    $scope.selectedSubcmcompositionFamily;
    $scope.selectedCpcompositionextensionFamily = [];
    $scope.selectedSubmcompositionFamily;

    $scope.upMulti = function(){
        $scope.upComposition();
    };

     /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
     * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
     * @params
     * @returns
     */
    $scope.$on('updateComposition', function(){
        var strata = StrataData.getStratas()[StrataData.getCurrentSelectedStrata()];

        if (strata.findDependency('scompositionFamily'))
            $scope.selectedScompositionFamily = getCharacteristicByItsName($scope.scompositionFamily, strata.getScompositionFamily());
        if (strata.findDependency('nmmcompositionFamily'))
            $scope.selectedNmmcompositionFamily = getCharacteristicByItsName($scope.nmmcompositionFamily, strata.getNmmCompositionFamily());
        if (strata.findDependency('dcompositionFamily'))
            $scope.selectedDcompositionFamily = getCharacteristicByItsName($scope.dcompositionFamily, strata.getDcompositionFamily());
        if (strata.findDependency('pomcompositionFamily'))
            $scope.selectedPomcompositionFamily = getCharacteristicByItsName($scope.pomcompositionFamily, strata.getPomcompositionFamily());
        if (strata.findDependency('cpcompositionFamily'))
            $scope.selectedCpcompositionFamily = getCharacteristicByItsName($scope.cpcompositionFamily, strata.getCpcompositionFamily());
        if (strata.findDependency('cmcompositionFamily'))
            $scope.selectedCmcompositionFamily = getCharacteristicByItsName($scope.cmcompositionFamily, strata.getCmcompositionFamily());
        if (strata.findDependency('mcompositionFamily'))
            $scope.selectedMcompositionFamily = getCharacteristicByItsName($scope.mcompositionFamily, strata.getMcompositionFamily());
        if (strata.findDependency('cpcompositionextensionFamily'))
            $scope.selectedCpcompositionextensionFamily = getCharacteristicByItsNameMulti($scope.cpcompositionextensionFamily, strata.getCpcompositionextensionFamily());

        // met à jour les données des formulaires en fonction de mcompositionFamily
        if (strata.findDependency('submcompositionFamily')){
            $scope.submcompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'mCompositionFamily', strata.getMcompositionFamily(), '');
            $scope.selectedSubmcompositionFamily = getCharacteristicByItsName($scope.submcompositionFamily, strata.getSubmcompositionFamily());
        }
        // met à jour les données des formulaires en fonction de cmcompositionFamily
        if (strata.findDependency('subcmcompositionFamily')){
            $scope.subcmcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cmCompositionFamily', strata.getCmcompositionFamily(), '');
            $scope.selectedSubcmcompositionFamily = getCharacteristicByItsName($scope.subcmcompositionFamily, strata.getSubCmcompositionFamily());
        }
        // met à jour les données des formulaires en fonction de cpcompositionFamily
        if (strata.findDependency('subcpcompositionFamily')){
            $scope.subcpcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCpcompositionFamily(), '');
            $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcpcompositionFamily, strata.getSubcpcompositionFamily());
        }
        // met à jour les données des formulaires en fonction de subcpcompositionFamily
        if (strata.findDependency('subsubcpcompositionFamily')){
            $scope.subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpCompositionFamily', strata.getCpcompositionFamily(), strata.getSubcpcompositionFamily());
            $scope.selectedSubsubcpcompositionFamily = getCharacteristicByItsName($scope.subsubcpcompositionFamily, strata.getSubsubcpcompositionFamily());
        }

    });

     /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
     * @params
     * @returns
     */
    $scope.upComposition = function() {
        var temp = StrataData.getStratas();
        var index = StrataData.getCurrentSelectedStrata();

        if (temp[index].findDependency('scompositionFamily'))
            temp[index].setScompositionFamily($scope.selectedScompositionFamily.name);
        if (temp[index].findDependency('nmmcompositionFamily'))
            temp[index].setNmmCompositionFamily($scope.selectedNmmcompositionFamily.name);
        if (temp[index].findDependency('dcompositionFamily'))
            temp[index].setDcompositionFamily($scope.selectedDcompositionFamily.name);
        if (temp[index].findDependency('pomcompositionFamily'))
            temp[index].setPomCompositionFamily($scope.selectedPomcompositionFamily.name);
        /*if (temp[index].findDependency('cpcompositionFamily'))
            temp[index].setCpcompositionFamily($scope.selectedCpcompositionFamily.name);*/
        /*if (temp[index].findDependency('cmcompositionFamily'))
            temp[index].setCmcompositionFamily($scope.selectedCmcompositionFamily.name);*/
        /*if (temp[index].findDependency('mcompositionFamily'))
            temp[index].setMcompositionFamily($scope.selectedMcompositionFamily.name);*/
        if (temp[index].findDependency('cpcompositionextensionFamily'))
            temp[index].setCpcompositionextensionFamily($scope.selectedCpcompositionextensionFamily);
        /*if (temp[index].findDependency('subcpcompositionFamily'))
            temp[index].setSubcpcompositionFamily($scope.selectedSubcpcompositionFamily.name);*/
        if (temp[index].findDependency('subsubcpcompositionFamily'))
            temp[index].setSubsubcpcompositionFamily($scope.selectedSubsubcpcompositionFamily.name);
        if (temp[index].findDependency('subcmcompositionFamily'))
            temp[index].setSubCmcompositionFamily($scope.selectedSubcmcompositionFamily.name);
        if (temp[index].findDependency('submcompositionFamily'))
            temp[index].setSubmcompositionFamily($scope.selectedSubmcompositionFamily.name);

        $scope.$emit('updateDraw');
        $scope.$emit('updateFormOnly');
    };

    /* Met à jour les données quand les valeurs de mcomposition, cpcomposition ou cmcomposition changent
     * @params
     * @returns
     */
    $scope.upComposition2 = function() {
        var temp = StrataData.getStratas();
        var index = StrataData.getCurrentSelectedStrata();
        if (temp[index].findDependency('mcompositionFamily')){
            temp[index].setMcompositionFamily($scope.selectedMcompositionFamily.name);
            $scope.submcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'mCompositionFamily', temp[index].getMcompositionFamily(), '');
            $scope.selectedSubmcompositionFamily = getCharacteristicByItsName($scope.submcompositionFamily, temp[index].getSubmcompositionFamily());
        }
        if (temp[index].findDependency('cpcompositionFamily')) {
            temp[index].setCpcompositionFamily($scope.selectedCpcompositionFamily.name);
            $scope.subcpcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpCompositionFamily', temp[index].getCpcompositionFamily(), '');
            $scope.selectedSubcpcompositionFamily = getCharacteristicByItsName($scope.subcpcompositionFamily, temp[index].getSubcpcompositionFamily());
        }
        if (temp[index].findDependency('cmcompositionFamily')) {
            temp[index].setCmcompositionFamily($scope.selectedCmcompositionFamily.name);
            $scope.subcmcompositionFamily  = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cmCompositionFamily', temp[index].getCmcompositionFamily(), '');
            $scope.selectedSubcmcompositionFamily = getCharacteristicByItsName($scope.subcmcompositionFamily, temp[index].getSubCmcompositionFamily());
        }
        $scope.$emit('updateFormOnly');
    };

    //Met à jour les données quand les valeurs de subcpcomposition changent
    $scope.upComposition3 = function() {
        var temp = StrataData.getStratas();
        var index = StrataData.getCurrentSelectedStrata();

        temp[index].setSubcpcompositionFamily($scope.selectedSubcpcompositionFamily.name);
        $scope.subsubcpcompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpCompositionFamily', temp[index].getCpcompositionFamily(), temp[index].getSubcpcompositionFamily());
        $scope.selectedSubsubcpcompositionFamily = getCharacteristicByItsName($scope.subsubcpcompositionFamily, temp[index].getSubsubcpcompositionFamily());

        /*temp[index].setSubcprimicrostructureaggregateCompositionFamily($scope.selectedSubcprimicrostructureaggregatecompositionFamily.name);
        $scope.subsubcprimicrostructureaggregatecompositionFamily = returnSubCharacteristicsFromParent(StrataData.getRawCharacteristics(), 'cpriMicrostructureAggregateCompositionFamily', temp[index].getCprimicrostructureaggregateCompositionFamily(), temp[index].getSubcprimicrostructureaggregateCompositionFamily());
        $scope.selectedSubsubcprimicrostructureaggregatecompositionFamily = getCharacteristicByItsName($scope.subcprimicrostructureaggregatecompositionFamily, temp[index].getSubsubcprimicrostructureaggregateCompositionFamily());
        */

        $scope.$emit('updateFormOnly');
    };
//Contrôlleur qui s'occupe de l'onglet de l'interface
}).controller('stratInterfaceCtrl', function ($scope, $route, $window, StrataData) {


    // On récupère les valeurs qui vont aller dans les champs de notre formulaire
    $scope.interfaceprofileFamily    = StrataData.getInterfaceprofileFamily()['characteristics'];
    $scope.interfacetransitionFamily = StrataData.getInterfacetransitionFamily()['characteristics'];
    $scope.interfaceroughnessFamily  = StrataData.getInterfaceroughnessFamily()['characteristics'];
    $scope.interfaceadherenceFamily  = StrataData.getInterfaceadherenceFamily()['characteristics'];

    //valeurs sélectionnées dans les champs de notre formulaire
    $scope.selectedInterfaceprofileFamily;
    $scope.selectedInterfacetransitionFamily;
    $scope.selectedInterfaceroughnessFamily;
    $scope.selectedInterfaceadherenceFamily;

     /* Met à jour les valeurs dans les champs quand on change de strate. Est appelé par un événement parent
     * On met à jour les valeurs sélectionnées en fonction des valeurs qui se trouvent dans la strate actuelle
     * @params
     * @returns
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

     /* Met à jour les données de la strate en fonction des valeurs dans le formulaire
     * @params
     * @returns
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
// Contrôlleur qui s'occupe d'ajouter une strate
}).controller('ModalAddStrataCtrl', function ($scope, $modal, $log) {
    $scope.artefactName = $scope.$parent.artefactName;
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'modalAddStrata.html',
            controller: 'ModalAddStrataInstanceCtrl',
            resolve : {
                arg1 : function(){
                    return "hello";
                }
            }
        });
    }; // Instance du contrôlleur qui s'occupe d'ajouter une strate
}).controller('ModalAddStrataInstanceCtrl', function ($scope, $route, $modalInstance, MiCorrService, arg1, StrataData) {
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
// Contrôlleur qui s'occupe de supprimer une strate dans le service
}).controller('ModalDelStrataCtrl', function ($scope, $modal, $log, StrataData) {
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
// Contrôlleur qui s'occupe de sauvegarder une stratigraphie
}).controller('ModalSaveStrataCtrl', function ($scope, $route, $modal, $log, StrataData) {
    $scope.artefactName = $scope.$parent.artefactName;

     /* appelle une méthode parent pour sauvegarder la stratigraphie qui se trouve dans le service
     * @params
     * @returns
     */
    $scope.doSave = function () {
        $scope.$emit('save');
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
});


//Contrôlleur qui s'occupe d'afficher toutes les stratigraphies pour un artefact
angular.module('MiCorr').controller('showArtefact', function ($scope, $location, $routeParams, MiCorrService) {
    $scope.artefactName = $routeParams.name;
    // Quand on lance la page, alors il se passe une requête asynchrone qui va chercher toutes les stratigraphies
    MiCorrService.getStratigraphyByArtefact($scope.artefactName).success(function(data){
        $scope.strats = data['strats'];
    });
});


//Contrôlleur qui s'occupe d'afficher tous les artefacts
angular.module('MiCorr').controller('listArtefacts', function ($scope, $routeParams, MiCorrService) {
    // Quand on lance la page, alors il se passe une requête asynchrone qui va chercher tous les artefacts
    MiCorrService.getAllArtefacts().success(function(data){
        $scope.artefacts = data['artefacts'];
    });


});

// controlleur qiu s'occupe de l'ajout d'une stratigraphie
angular.module('MiCorr').controller('ModalAddStratigraphyCtrl', function ($scope, $modal, $log) {
    $scope.artefactName = $scope.$parent.artefactName;
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'modalAddStratigraphy.html',
            controller: 'ModalAddStratigraphyInstanceCtrl',
            resolve : {
                artefact : function(){
                    return $scope.artefactName;
                }
            }
        });
    };
// instance du contrôlleur qui s'occupe de l'ajout d'une stratigraphie
}).controller('ModalAddStratigraphyInstanceCtrl', function ($scope, $route, $modalInstance, MiCorrService, artefact) {
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
//COntrôlleur des messages d'erreurs qui surviennent lors de l'ajout d'une stratigraphie
}).controller('addStratigraphyCtrl', function ($scope) {
    $scope.alerts = [];

    $scope.addAlert = function() {
        $scope.alerts.push({type : 'danger', msg: 'This stratigraphy already exists in database ! '});
    };

    $scope.$on('addArtefact', function(event, sc){
        $scope.addAlert();
    });

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
});

/* Contrôlleur très important car il est appelé une fois lors du chargement du site
 * Ce contrôlleur est parent à chaque autres contrôlleurs de MiCorrApp
 * Lorsqu'on appelle une page de MiCorrApp ce contrôlleur est exécuté et il fait principalement une seule chose
 * Il va chercher la liste des charactéristiques présentes dans la base afin de les charger dans les services
 * Attention si on accède aux détails d'une stratigraphie sans que les charactéristiques soient chargées au préalable alors il va y avoir un problème
 * On doit avant tout accéder d'abord à la liste des artefacts ou stratigraphies avant d'aller dans les détails sinon les charactéristiques ne sont pas chargées
*/
angular.module('MiCorr').controller('mainController', function ($scope, $route, $routeParams, MiCorrService, StrataData, ngProgress) {

    ngProgress.height('4px');
    ngProgress.start();

    /* Quand le site est chargé pour la première fois le contrôlleur fait une requête asynchrone
     * Il va chercher la liste de toutes les charactéristiques afin de les mettre dans le service (StrataData)
     * La liste est au format json. Elle est constitué de charactéristiques classées par famille
     * Chaque charactéristique peut avoir une sous-caractéristique et chaque sous caractéristique peut avoir une sous caractéristique
     * Attention une sous caractéristique n'est pas liée à une famille mais à une caractéristique
     */
    MiCorrService.getAllCharacteristic().success(function(data){
        ngProgress.complete();
        characteristics = data;

        StrataData.setRawCharacteristics(characteristics);

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

    });

     /* parcourt les caractéristiques de data et retourne les caractéristiques de la famille voulue
     * @params name : nom de la famille
     * @returns liste des caractéristiques d'une famille au format json
     */
    $scope.parseCharasteristic = function(name) {
        for (var i = 0; i < characteristics.length; i++) {
            if (characteristics[i].family == name)
                return characteristics[i];
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




}).controller('ModalDelstratigraphyCtrl', function ($scope, $route, $modal, $log, StrataData, MiCorrService) {
    $scope.open = function (size, strat) {
        var modalInstance = $modal.open({
            templateUrl: 'delStratigraphyContent.html',
            size: size,
            controller: ['$scope', '$modalInstance','scopeParent', 'id',
                function($scope, $modalInstance,scopeParent,id) {
                    $scope.ok = function() {
                        MiCorrService.deleteStratigraphy(strat).success(function(data){
                            $route.reload();
                        });
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
}).controller('ModalAddArtefactCtrl', function ($scope, $route, $modal, $log, StrataData, MiCorrService) {
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'AddArtefactContent.html',
            size: size,
            controller: ['$scope', '$modalInstance','scopeParent', 'id',
                function($scope, $modalInstance,scopeParent,id) {
                    $scope.artefact;
                    $scope.ok = function() {
                        if (testUserInput($scope.artefact)) {
                            MiCorrService.createArtefact($scope.artefact).success(function(data){
                                if (data['res'] == 0)
                                    alert("This artefact already exists in database !");
                                else {
                                    $modalInstance.close();
                                    $route.reload();
                                }
                            });
                        }
                        else
                            alert("Only alphanumeric characters are allowed");

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
}).controller('ModalDelArtefactCtrl', function ($scope, $route, $modal, $log, StrataData, MiCorrService) {
    $scope.open = function (size, artefact) {
        $scope.artefact = artefact;
        var modalInstance = $modal.open({
            templateUrl: 'delArtefactContent.html',
            size: size,
            controller: ['$scope', '$modalInstance','scopeParent', 'artefact',
                function($scope, $modalInstance,scopeParent,artefact) {
                    $scope.ok = function() {
                        MiCorrService.deleteArtefact(artefact).success(function (data) {
                            $modalInstance.close();
                            $route.reload();
                        });
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
                artefact: function(){
                    return $scope.artefact; // On passe en paramètre l'id de l'élément à supprimer.
                }
            }
        });

    };
//contrôlleur qui s'occupe d'afficher les artefacts similaires
}).controller('ModalShowSimilarStrataCtrl', function ($scope, $route, $modal, $log, StrataData, MiCorrService) {
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'showSimilarStrataContent.html',
            size: size,
            controller: ['$scope', '$modalInstance','scopeParent',
                function($scope, $modalInstance,scopeParent) {
                    $scope.results = "";
                    /* A l'ouverture de la fenêtre on va appeler un service qui va chercher les artefacts similaires
                     * Ce service prend comme paramètre la stratigraphie complète au format JSON
                     * Il est inutile de renseigner les nom d'artefact et de stratigraphie car on compare uniquement les couches de corrosion entre elles
                     * Une fois la requête effectuée, on ressort le résultat
                     */
                    MiCorrService.matchStratigraphy(encodeURIComponent(JSON.stringify(StrataData.StratasToJson("USELESS", "USELESS")))).success(function(data){
                         $scope.results = data;
                    });

                    $scope.ok = function() {
                        $modalInstance.close();
                    };
                }
            ],
            resolve: {
                scopeParent: function() {
                    return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                }
            }
        });

    };
//Contrôlleur qui va ouvrir une fenêtre modale pour exporter les dessins au format png
//La fenêtre contient chaque dessins mais au format png et non svg
}).controller('ModalExportStrataCtrl', function ($scope, $route, $modal, $log, StrataData, MiCorrService) {
    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'exportStrataContent.html',
            size: size,
            controller: ['$scope', '$modalInstance','scopeParent', 'images',
                function($scope, $modalInstance, scopeParent, images) {
                    //on récupères les images (paper de raphaeljs) pour les mettre dans notre scope afin de les afficher par notre directive
                    $scope.images = images;

                    $scope.ok = function() {
                        $modalInstance.close();
                    };
                }
            ],
            resolve: {
                scopeParent: function() {
                    return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
                },
                images : function() {
                    return StrataData.getImages();
                }
            }
        });

    };
});

