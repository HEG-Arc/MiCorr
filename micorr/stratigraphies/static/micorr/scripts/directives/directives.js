/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Contient les 3 directives qui sont utilisées dans MiCorrApp
 */

/* Cette directive représente le dessin de chaque strate
 * elle est composée de trois div. la première est la globale. cette div possède deux div
 * la première qui est embarquée est la div d'interface
 * la seconde est la div de strate
 * Dans chaque div, un <svg></svg> est créé grâce à raphaeljs
 * chaque svg est affiché à l'écrean
 */
angular.module('MiCorr').directive('strata', function($compile, StrataData){
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        template : '<div class="svgcanvas col-md-11 text-center"><div></div><div title="We ask for your age only for statistical purposes."></div></div>',
        link : function(scope, element, attrs) {
            var borderWidth = 8;
            var intLineThick = 5;
            var svgInterface = element.children()[0];   // div interface
            var svgStrata    = element.children()[1];   // div strate

            var index = attrs.index;            // index de la strat sélectionnée
            var strat = scope.rstratas[index];  // strate sélectionnée

            var width = getWidths(strat.getWidthFamily());              // largeur de la strate/interface
            var height = getThicknesses(strat.getThicknessFamily());    // hauteur de la strate
            var widthInt = width;

            // si on est à notre première strate alors on clear les images dans stratadata
            if (index == 0)
                StrataData.clearImages();
            else { // Si on est pas dans la première strate alors on fait quelques traitements
                var prevStrata = scope.rstratas[index-1];
                var prevS = getWidths(prevStrata.getWidthFamily());
                var thisS = getWidths(strat.getWidthFamily());
                if (prevS < thisS)
                   widthInt = prevS;
            }

            // Initialisation du POISSON DISK DISTRIBUTION
            var poisson = [];
            var pds = new PoissonDiskSampler(width, height);


            // DéBUT INTERFACE
            // Ici on va dessiner dans notre div qui représente les interfaces

            // On définit une hauteur d'interface fixe. ici 16px
            var heightInterface = 22;
            svgInterface.style.height = heightInterface + "px";
            var paperInt = Raphael(svgInterface, widthInt, heightInterface);

            var upperInterfaceColor = "white";  // couleur de fond de la partie haute
            var lowerInterfaceColor = "white";  // couleur de fond de la partie basse

            // si on est pas à la première interface alors on change la couleur de fond du haut
            if (index > 0) {
                if (scope.rstratas[index - 1].findDependency('colourFamily'))
                    if (scope.rstratas[index - 1].getColourFamily() != "" && typeof scope.rstratas[index - 1].getColourFamily() != "undefined")
                        upperInterfaceColor = returnFormattedColor(scope.rstratas[index - 1].getColourFamily());
            }
            // La couleur d'inteface du bas est la couleur de la strate
            if (strat.findDependency('colourFamily'))
                if (strat.getColourFamily() != "" && typeof strat.getColourFamily() != "undefined")
                    lowerInterfaceColor = returnFormattedColor(strat.getColourFamily());

            var diffuse = false;
            if (strat.findDependency('interfacetransitionFamily')) {
                var transition = strat.getInterfacetransitionFamily();
                if (transition == "diffuseCharacteristic")
                    diffuse = true;
            }

            var transition = "";
            if (strat.findDependency('interfacetransitionFamily')){
                if (strat.getInterfacetransitionFamily() != "")
                    transition = strat.getInterfacetransitionFamily();
            }

            //si l'interface est droite alors on dessine un rectangle qu'on pose sur la moitié basse de l'interface
            if (strat.getInterfaceprofileFamily() == "straightCharacteristic"){
                var sPath = "M0 " + heightInterface/2 + "L" + widthInt + " " + heightInterface/2;
                if (strat.findDependency('colourFamily'))
                    if (strat.getColourFamily() != "")
                        lowerInterfaceColor = returnFormattedColor(strat.getColourFamily());

                paperInt.rect(0, 0, widthInt, heightInterface/2).attr("fill", upperInterfaceColor).attr("stroke-width", 0);
                paperInt.rect(0, heightInterface/2, widthInt, heightInterface/2).attr("fill", lowerInterfaceColor).attr("stroke-width", 0);
                // bordure extérieure et ligne centrale de l'interface
                paperInt.path("M0 0L0 " + heightInterface + " M" + width + " " + " 0L" + widthInt + " " + heightInterface).attr("stroke-width", borderWidth);
                paperInt.path("M0 " + heightInterface/2 + "L" + widthInt + " " + heightInterface/2).attr("stroke-width", intLineThick);


            } // dans les autres cas on dessine notre interface
            else if (strat.getInterfaceprofileFamily() == "wavyCharacteristic"){
                drawInterface(paperInt, index, widthInt, heightInterface, 'wavy', 8, lowerInterfaceColor, upperInterfaceColor, borderWidth, intLineThick, diffuse, transition);
            }
            else if (strat.getInterfaceprofileFamily() == "bumpyCharacteristic"){
                drawInterface(paperInt, index, widthInt, heightInterface, 'bumpy', 20, lowerInterfaceColor, upperInterfaceColor, borderWidth, intLineThick, diffuse, transition);
            }
            else if (strat.getInterfaceprofileFamily() == "irregularCharacteristic"){
                drawInterface(paperInt, index, widthInt, heightInterface, 'irregular', 30, lowerInterfaceColor, upperInterfaceColor, borderWidth, intLineThick, diffuse, transition);
            }
            else
                svgInterface.style.height = "0px";

            // On ajoute notre interface à la collection d'images
            StrataData.pushOneImage(paperInt);

            //FIN INTERFACE


            // DéBUT GéNéRATION DES DESSINS
            // Génération du cadre
            // les cadres n'ont pas de bordures haut et basses mais des bordues aux côtés qui sont dessinés avec des lignes
            svgStrata.style.height = height + "px";
            var paper = Raphael(svgStrata, width, height);
            var rect = paper.rect(0, 0, width, height).attr("stroke-width", 0);
            paper.path("M0 0L0 " + height).attr("stroke-width", borderWidth);
            paper.path("M" + width + " 0L" + width + " " + height).attr("stroke-width", borderWidth);

            // la dernière strate a une bordure basse
            if (index == scope.rstratas.length - 1)
                paper.path("M0 " + height + "L" + width + " " + height).attr("stroke-width", borderWidth);

            // COuleur de fond du cadre de dessin
            var mainBackgroundColor = "white";
            if (strat.findDependency('colourFamily'))
                if (strat.getColourFamily() != "" && typeof strat.getColourFamily() != "undefined")
                    mainBackgroundColor = returnFormattedColor(strat.getColourFamily());
            rect.attr("fill", mainBackgroundColor);

            /*
             * A partir de maintenant on va s'attaquer à la génération des images avec soit
             * 1) le poisson disk distribution qui va répartir des images au hasard sur la zone
             *    On ajoute dans la variable poisson les images qu'on veut.
             *    On doit ensuite indiquer :
             *      min : rayon min entre le centre de l'image et une autre image
             *      max : rayon max entre le centre de l'image et une autre image
             *      img : le nom de l'image au format png et sans extension qui se trouve dans ../static/images/c
             *      imgw : largeur de l'image
             *      imgh : hauteur de l'image
             * 2) des images prédéfinies qu'on va appliquer sur notre zone de dessin
             *
             */

            // Porosity
            if (strat.findDependency('porosityFamily')){
                var img = 'porosity';
                if (strat.getPorosityFamily() == 'slightlyPorousCharacteristic')
                    poisson.push({'min' : 20, 'max' : 90, 'img' : img, 'imgw' : 5, 'imgh' : 5});
                    //pds.createPointsPerso(90, 90, img);
                if (strat.getPorosityFamily() == 'porousCharacteristic')
                    poisson.push({'min' : 20, 'max' : 40, 'img' : img, 'imgw' : 5, 'imgh' : 5});
                    //pds.createPointsPerso(40, 40, img);
                if (strat.getPorosityFamily() == 'highlyPorousCharacteristic')
                    poisson.push({'min' : 20, 'max' : 20, 'img' : img, 'imgw' : 5, 'imgh' : 5});
                    //pds.createPointsPerso(20, 20, img);
            }

            //cpriMicroStructure
            if (strat.findDependency('cprimicrostructureFamily')) {
                if (strat.getCpriMicrostructureFamily() == "pseudomorphOfGranularCharacteristic"){
                    paper.image("../static/micorr/images/c/grains/GrainsGris_" + height + "x" + width + ".png", 0, 0, width, height);
                }
                else if (strat.getCpriMicrostructureFamily() == "pseudomorphOfDendriticCharacteristic") {
                    paper.image("../static/micorr/images/c/dendrites/dendrites_" + height + "x" + width + ".png", 0, 0, width, height);
                }
                else if (strat.getCpriMicrostructureFamily() == "hexagonalNetworkCharacteristic"){
                    paper.image("../static/micorr/images/c/hexagonal.png", 0, 0, width, height);
                }
                else if (strat.getCpriMicrostructureFamily() == "alternatingBandsCharacteristic"){
                    drawalternatingBands(paper, 6, 10, width, height);
                }
                else if (strat.getCpriMicrostructureFamily() == "cristallineMicrostructureCharacteristic"){
                    poisson.push({'min': 13, 'max': 13, 'img': 'scattered2', 'imgw': 27, 'imgh': 27});
                }
                else if (strat.getCpriMicrostructureFamily() == "isolatedAggregateMicrostructureCharacteristic"){
                    poisson.push({'min': 30, 'max': 60, 'img': 'isolated', 'imgw': 55, 'imgh': 27});
                }
                else if (strat.getCpriMicrostructureFamily() == "scatteredAggregateMicrostructureCharacteristic"){
                    poisson.push({'min': 32, 'max': 60, 'img': 'scattered1', 'imgw': 43, 'imgh': 39});
                    poisson.push({'min': 23, 'max': 60, 'img': 'scattered2', 'imgw': 27, 'imgh': 27});
                }
            }

            //subcprimicrostructure
            if (strat.findDependency('subcprimicrostructureFamily')){
                var lsub = strat.getSubcprimicrostructureFamily();
                for (var i = 0; i < lsub.length; i++) {
                    var car = lsub[i].name;
                    if (car == "eutecticPhaseNoMicrostructureCpri" ||
                        car == "eutecticPhaseCristallineMicrostructureCpri" ||
                        car == "eutecticPhaseIsolatedAggregateMicrostructureCpri" ||
                        car == "eutecticPhaseScatteredAggregateMicrostructureCpri" ||
                        car == "eutecticPhaseAlternatingBandsCpri" ||
                        car == "eutecticPhaseHexagonalNetworkCpri" ||
                        car == "eutecticPhasePseudomorphOfDendriticCpri" ||
                        car == "eutecticPhasePseudomorphOfGranularCpri"){
                        poisson.push({'min': 40, 'max': 60, 'img': 'eutetic1', 'imgw': 80, 'imgh': 83});
                        poisson.push({'min': 30, 'max': 50, 'img': 'eutetic2', 'imgw': 57, 'imgh': 60});
                        poisson.push({'min': 36, 'max': 45, 'img': 'eutetic3', 'imgw': 71, 'imgh': 44});
                        //poisson.push({'min': 9, 'max': 20, 'img': 'eutetic4', 'imgw': 9, 'imgh': 17});
                    }
                    else if (car == "twinLinesNoMicrostructureCpri" ||
                            car == "twinLinesCristallineMicrostructureCpri" ||
                            car == "twinLinesIsolatedAggregateMicrostructureCpri" ||
                            car == "twinLinesScatteredAggregateMicrostructureCpri" ||
                            car == "twinLinesAlternatingBandsCpri" ||
                            car == "twinLinesHexagonalNetworkCpri" ||
                            car == "twinLinesPseudomorphOfDendriticCpri" ||
                            car == "twinLinesPseudomorphOfGranularCpri"    ) {
                            paper.image("../static/micorr/images/c/macles/Macles_" + height + "x" + width + ".png", 0, 0, width, height);
                    }
                    else if (car == "inclusionsNoMicrostructureCpri" ||
                            car == "inclusionsCristallineMicrostructureCpri" ||
                            car == "inclusionsIsolatedAggregateMicrostructureCpri" ||
                            car == "inclusionsScatteredAggregateMicrostructureCpri" ||
                            car == "inclusionsAlternatingBandsCpri" ||
                            car == "inclusionsHexagonalNetworkCpri" ||
                            car == "inclusionsPseudomorphOfDendriticCpri" ||
                            car == "inclusionsPseudomorphOfGranularCpri") {
                            paper.image("../static/micorr/images/c/inclusion/Inclusions_" + height + "x" + width + ".png", 0, 0, width, height);
                    }
                }
            }

            //MmicrostructureFamily
            if (strat.findDependency('mmicrostructureFamily')){
                if (strat.getMmicrostructureFamily() == "dendriticCharacteristic") {
                    paper.image("../static/micorr/images/c/dendrites/dendritesmetal_" + height + "x" + width + ".png", 0, 0, width, height);
                }
                else if (strat.getMmicrostructureFamily() == "grainLargeCharacteristic" ||
                    strat.getMmicrostructureFamily() == "grainSmallCharacteristic" ||
                    strat.getMmicrostructureFamily() == "grainElongatedCharacteristic") {
                    paper.image("../static/micorr/images/c/grains/grains_" + height + "x" + width + ".png", 0, 0, width, height);
                }
            }

            //SubmMicrostructureFamily
            if (strat.findDependency('submmicrostructureFamily')){
                var lsub = strat.getSubmmicrostructureFamily();
                for (var i = 0; i < lsub.length; i++) {
                    var car = lsub[i].name;
                    if (car == "eutecticPhaseDendritic" ||
                        car == "eutecticPhaseGrainElongated" ||
                        car == "eutecticPhaseGrainLarge" ||
                        car == "eutecticPhaseGrainSmall") {
                        poisson.push({'min': 40, 'max': 60, 'img': 'eutetic1', 'imgw': 80, 'imgh': 83});
                        poisson.push({'min': 30, 'max': 50, 'img': 'eutetic2', 'imgw': 57, 'imgh': 60});
                        poisson.push({'min': 36, 'max': 45, 'img': 'eutetic3', 'imgw': 71, 'imgh': 44});
                    }
                    else if (car == "twinLinesDendritic" ||
                        car == "twinLinesGrainElongated" ||
                        car == "twinLinesGrainLarge" ||
                        car == "twinLinesGrainSmall") {
                        paper.image("../static/micorr/images/c/macles/Macles_" + height + "x" + width + ".png", 0, 0, width, height);
                   }
                    else if (car == "inclusionsDendritic" ||
                            car == "inclusionsGrainElongated" ||
                            car == "inclusionsGrainLarge" ||
                            car == "inclusionsGrainSmall") {
                        paper.image("../static/micorr/images/c/inclusion/Inclusions_" + height + "x" + width + ".png", 0, 0, width, height);
                    }

                }
            }

            //CrackingFamily
            if (strat.findDependency('crackingFamily')){
                if (strat.getCrackingFamily() == "simpleCracksCharacteristic") {
                    drawCracking(paper, width, height, 1, 0);
                }
                else if (strat.getCrackingFamily() == "branchedCracksCharacteristic") {
                    drawCracking(paper, width, height, 1, 1);
                }
                else if (strat.getCrackingFamily() == "networkCracksCharacteristic") {
                    drawCracking(paper, width, height, 2, 5);
                }
            }

            //CohesionFamily
            if (strat.findDependency('cohesionFamily')){
                if (strat.getCohesionFamily() == "powderyCharacteristic"){
                    poisson.push({'min': 8, 'max': 15, 'img': 'powder', 'imgw': 15, 'imgh': 14});
                }
            }

            //Shape Family
            if (strat.getShapeFamily() == "vainsOrSeamsCharacteristic"){
                paper.image("../static/micorr/images/c/vains.png", width/2 - 150/2, height/2 - 18/2, 150, 18);
            }
            else if (strat.getShapeFamily() == "dropletCharacteristic"){
                poisson.push({'min': 4, 'max': 16, 'img': 'droplet1', 'imgw': 10, 'imgh': 10});
                poisson.push({'min': 8, 'max': 16, 'img': 'droplet2', 'imgw': 15, 'imgh': 15});
                poisson.push({'min': 11, 'max': 22, 'img': 'droplet3', 'imgw': 25, 'imgh': 25});
            }

            // PDS render
            // On va ici parcourir les différentes images ajoutées à notre variable poisson et afficher sur notre zone de dessin ces images
            for (var i = 0; i < 500; i++) {
                for (var j = 0; j < poisson.length; j++) {
                    // Création des points
                    pds.createPointsPerso(poisson[j].min, poisson[j].max, poisson[j].img, poisson[j].imgw, poisson[j].imgh);
                }
            }
            // affichage des points
            for (var i = 0; i < pds.pointList.length; i++){
                paper.image("../static/micorr/images/c/" + pds.pointList[i].t + ".png", pds.pointList[i].x-pds.pointList[i].w/2, pds.pointList[i].y-pds.pointList[i].h/2, pds.pointList[i].w, pds.pointList[i].h);
            }

            // On met ces caractéristiques au dessus des autres
            if (strat.getShapeFamily() == "pitCharacteristic") {
                paper.image("../static/micorr/images/c/pit.png", width/2-(47/2), 0, 47, 43);
            }
            else if (strat.getShapeFamily() == "craterCharacteristic") {
                paper.image("../static/micorr/images/c/crater.png", width/2-(84/2), 0, 84, 42);
            }
            else if (strat.getShapeFamily() == "pustuleCharacteristic"){
                paper.image("../static/micorr/images/c/pustule.png", width/2-(81/2), height-47, 81, 47);
            }

            // On push les images créé dans notre service pour les réutiliser
            StrataData.pushOneImage(paper);

            // On créé un événement pour que si l'utilisateur click sur une image, le formulaire se met à jour avec la strate sélectionnée
            // événement sur interface
            $(element.children()[0]).bind('click', function(){
                scope.update(index);
                scope.setInterfaceTab(true);
            });
            // événement sur strate
            $(element.children()[1]).bind('click', function(){
                scope.update(index);
                scope.setInterfaceTab(false);
            });

            // construction du texte à afficher dans le tooltip
            var tooltipText = [];
            for (var i = 0; i < strat.getJsonCharacteristics().length; i++)
                tooltipText.push(strat.getJsonCharacteristics()[i].name );
            for (var i = 0; i < strat.getJsonInterface().length; i++)
                tooltipText.push(strat.getJsonInterface()[i].name);

            tooltipText.sort();

            // on remplit la variable des caractéristique qu'on va afficher dans notre tooltip
            var tooltipStr = "";
            for (var i = 0; i < tooltipText.length; i++)
                if (tooltipText[i] != "" || tooltipText[i] != "undefined")
                    tooltipStr += tooltipText[i] + "\r\n";

            element.children()[1].setAttribute("title", tooltipStr);
            // on gére les toolstips avec jqueryui
            $(document).tooltip();


            // Compilation de notre html pour pouvoir être interprêté par le navigateur.
            $compile(element.contents())(scope);

        }
    };
/* Cette directive permet de retrouver le svg créé par raphaeljs,
 * mettre le contenu de ce svg dans un canvas et ensuite créer un png téléchargeable
 * Ce png contient aussi les images qui se trouvaient sur le svg
 */
}).directive('stratapng', function($compile, StrataData){
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        template : '<canvas></canvas>',
        link : function(scope, element, attrs) {
            // on récupère notre image
            var index = attrs.index;
            var images = StrataData.getImages();
            var image = images[index];
            // on convertir en svg avec la librairie raphael.export
            var svg = image.toSVG();
            // on convertit en image et on l'inscruste dans notre canvas
            canvg(element[0], svg);
        }
    };
})
/* Cette directive définit la classification (nommage) de la strate (CP1, CP2, M1, M2, M3, M1)
 * en fonction des autres strates de la stratigraphie
 * L'affichage vient à gauche des dessins des strates
 */
.directive('stratainfo', function($compile, StrataData){
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        template : '<div class="col-md-1 text-center"><div></div><div></div></div>',
        link : function(scope, element, attrs) {
            var index = attrs.index;    // index de la strate

            // on récupère les strates et la strate
            var stratas = scope.rstratas;
            var strata = stratas[index];
            var nb = stratas.length;

            var similarName = "";
            var sameNature = 0;

            var similar = false;

            // pour la strate actuelle on parcourt toutes les strates jusqu'à celle ci
            for (var i = 0; i < index; i++) {
                var s2 = stratas[i];

                if (strata.getShortNatureFamily() == s2.getShortNatureFamily()){
                    if (compareTwoStratas(strata, s2)){ // si les strates sont similaires alors onprend le nom de la strate similaire
                        strata.setOrderName(s2.getOrderName()); // la propriété orderName permet de stocker pour une strate, son nom (CP1, CP2, M1, M2, M3, M1)
                        similar = true;
                    }
                    sameNature++;
                }
            }

            // si les strates ne sont pas similaire alors on créé un nouveau nom et on lui ajouter le nom à la propriété orderName
            if (!similar)
                strata.setOrderName(strata.getShortNatureFamily() + (sameNature + 1));

            // On affiche le nom de la strate
            element.children()[0].innerText = strata.getOrderName();

            // on affiche les boutons pour bouger la strate
            var btns = "";
            if (index > 0)
                btns += '<button ng-click="movestrataup(' + index + ')" type="button" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></button>';
            if (index < stratas.length - 1)
                btns += '<button ng-click="movestratadown(' + index + ')" type="button" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></button>';

            $(element.children()[1]).append(btns);
            $compile(element.contents())(scope);
        }
    };
});