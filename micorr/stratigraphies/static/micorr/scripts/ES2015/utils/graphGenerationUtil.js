/**
 * Created by thierry on 27.04.16.
 */

import{Stratigraphy} from '../business/stratigraphy';
import{Strata} from '../business/stratigraphy';
import{Characteristic} from '../business/characteristic';
import{SubCharacteristic} from '../business/subCharacteristic';
import{PoissonDiskSampler} from '../algorithms/poissonDisk';

class GraphGenerationUtil {
    constructor(win, stratig) {
        if (win != null) {
            this.window = win;
            //var drawer = require('svg.js')(win);
        }
        this.stratig = stratig;
    }

    /**
     * Cette méthode est utilisée par Node.js pour dessiner la stratigraphie entière
     */
        drawStratigraphy() {
        var drawings = new Array();

        var div = this.window.document.getElementById('drawing');
        for (var i = 0; i < this.stratig.getStratas().length; i++) {
            var str = this.stratig.getStratas()[i];
            //drawInterface(str, 'drawing');
            console.log('strataUid: ' + str.getUid())
            var nestedStrata = this.drawStrata(str, 'drawing');
            drawings.push(nestedStrata);
        }
        var resultDraw = SVG('result');
        var bottomY = 0;
        for(var i = 0; i<drawings.length; i++){
            var nestedObject = drawings[i];
            nestedObject.y(bottomY);
            bottomY = bottomY + nestedObject.height();
            resultDraw.add(drawings[i]);
        }
        var resultDiv = this.window.document.getElementById('result');
        var svgContent = resultDiv.innerHTML;
        return svgContent;
    }

    /**
     * Cette méthode dessine l'interface de la strate
     * @param strata la strate
     * @param divID la div dans laquelle on veut dessiner l'interface
     */
        drawInterface(strata, divID) {
        var index = strata.getIndex();
        var interfaceDiv = document.getElementById(divID);
        var interfaceHeight = 22;
        var isUpperCM = false;


        if (strata.index > 0) {
            var upperStrata = this.stratig.getStratas()[index - 1];
            if (upperStrata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic' && strata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'mCharacteristic') {
                isUpperCM = true;
            }
        }

        interfaceDiv.style.height = interfaceHeight + "px";

        var borderWidth = 8;
        var divisionLineWidth = 5;

        var strataWidth = 500

        if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
            strataWidth = getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
        }

        var interfaceWidth = strataWidth;

        var draw = SVG(divID).size(interfaceWidth, interfaceHeight);

        var upperInterfaceColor = "white";  // couleur de fond de la partie haute
        var lowerInterfaceColor = "white";  // couleur de fond de la partie basse

        // si on est pas à la première interface alors on change la couleur de fond du haut
        if (index > 0) {
            if (this.stratig.getStratas()[index - 1].getCharacteristicsByFamily('colourFamily').length > 0) {
                var color = this.stratig.getStratas()[index - 1].getCharacteristicsByFamily('colourFamily')[0].getRealName();
                if (color != "" && color != "undefined" && color != "black") {
                    upperInterfaceColor = color;
                }
                else if (color == "black") {
                    upperInterfaceColor = '#474747';
                }
            }
        }

        if (strata.getCharacteristicsByFamily('colourFamily').length > 0) {
            var color = strata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
            if (color != "" && color != "undefined" && color != "black") {
                lowerInterfaceColor = color;
            }
            else if (color == "black") {
                lowerInterfaceColor = "#474747";
            }
        }

        var diffuse = false;
        var transition = '';
        if (strata.getCharacteristicsByFamily('interfaceTransitionFamily').length > 0) {
            transition = strata.getCharacteristicsByFamily('interfaceTransitionFamily')[0].getName();
            if (transition == "diffuseCharacteristic") {
                diffuse = true;
            }
        }

        var profile = '';
        if (strata.getCharacteristicsByFamily('interfaceProfileFamily').length > 0) {
            profile = strata.getCharacteristicsByFamily('interfaceProfileFamily')[0].getName();
        }


        //On va maintenant dessiner l'interface

        //Si c'est une strate CM ou que la strate par dessus est une strate CM on n'affiche pas de trait
        if (isUpperCM) {
            var rect = draw.rect(interfaceWidth, interfaceHeight).attr({fill: lowerInterfaceColor});
            var borderPath = draw.path("M0 0L0 " + interfaceHeight + " M" + strataWidth + " " + " 0L" + interfaceWidth + " " + interfaceHeight).fill('none');
            borderPath.stroke({ color: 'black', width: borderWidth });
        }
        else if (strata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic') {
            var rect = draw.rect(interfaceWidth, interfaceHeight).attr({fill: upperInterfaceColor});
            var borderPath = draw.path("M0 0L0 " + interfaceHeight + " M" + strataWidth + " " + " 0L" + interfaceWidth + " " + interfaceHeight).fill('none');
            borderPath.stroke({ color: 'black', width: borderWidth });
        }
        else {
            //Si elle est droite on dessine simplement deux rectangles
            if (profile == 'straightCharacteristic' || profile == '') {
                var upperRect = draw.rect(interfaceWidth, interfaceHeight).attr({ fill: upperInterfaceColor });
                var lowerRect = draw.rect(interfaceWidth, interfaceHeight).x(0).y(interfaceHeight / 2).attr({fill: lowerInterfaceColor });

                //On dessine la bordure extérieure et la droite qui sépare les strates
                var borderPath = draw.path("M0 0L0 " + interfaceHeight + " M" + strataWidth + " " + " 0L" + interfaceWidth + " " + interfaceHeight).fill('none');
                borderPath.stroke({ color: 'black', width: borderWidth });

                var divisionPath = draw.path("M0 " + (interfaceHeight / 2) + "L" + interfaceWidth + " " + (interfaceHeight / 2)).fill('none');
                divisionPath.stroke({ color: 'black', width: divisionLineWidth });
            }
            else if (profile == 'wavyCharacteristic') {
                this.drawCustomInterface(draw, index, interfaceWidth, interfaceHeight, 'wavy', 8, lowerInterfaceColor, upperInterfaceColor, borderWidth, divisionLineWidth, diffuse, transition);
            }
            else if (profile == 'bumpyCharacteristic') {
                this.drawCustomInterface(draw, index, interfaceWidth, interfaceHeight, 'bumpy', 20, lowerInterfaceColor, upperInterfaceColor, borderWidth, divisionLineWidth, diffuse, transition);
            }
            else if (profile == 'irregularCharacteristic') {
                this.drawCustomInterface(draw, index, interfaceWidth, interfaceHeight, 'irregular', 30, lowerInterfaceColor, upperInterfaceColor, borderWidth, divisionLineWidth, diffuse, transition);
            }
        }

    }

    /**
     * Cette méthode permet de dessiner une strate
     * @param strata
     * @param divID La div dans laquelle on veut dessiner la strate
     */
        drawStrata(strata, divID) {

        var height = 100;
        var width = 500
        if (strata.getCharacteristicsByFamily('thicknessFamily').length > 0) {
            height = this.getThicknesses(strata.getCharacteristicsByFamily('thicknessFamily')[0].getName());
        }

        if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
            width = this.getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
        }

        if (this.window == undefined) {
            document.getElementById(divID).style.height = height + "px";
        }

        var borderWidth = 8;


        var draw = SVG(divID).size(width, height);
        //on crée un groupe pour englober la strate et pour pouvoir la réutiliser
        var nestedStrata = draw.nested();
        nestedStrata.height(height);
        nestedStrata.width(width);
        this.fillStrata(nestedStrata, strata);

        //Strate CM
        if (strata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic') {
            if (strata.getIndex() < this.stratig.getStratas().length - 1) {
                var lowerStrata = this.stratig.getStratas()[strata.getIndex() + 1];
                if (lowerStrata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'mCharacteristic') {
                    this.drawCM(strata, width, height, nestedStrata);
                }
            }
        }

        //Dessin des bords
        var leftBorder = nestedStrata.path("M0 0L0 " + height).fill('none');
        var rightBorder = nestedStrata.path("M" + width + " 0L" + width + " " + height).fill('none');
        leftBorder.stroke({ color: 'black', width: borderWidth });
        rightBorder.stroke({ color: 'black', width: borderWidth });

        //Dessin du bord inférieur si c'est la dernière strate
        if (strata.getIndex() == this.stratig.getStratas().length - 1) {
            var bottomBorder = nestedStrata.path("M0 " + height + "L" + width + " " + height).fill('none');
            bottomBorder.stroke({ color: 'black', width: borderWidth });
        }

        //On retourne le dessin de la strate
        return nestedStrata;

    }

    /**
     * Cette méthode s'occupe de dessiner la strate CM
     */
        drawCM(strata, width, height, draw) {
        var upperStrata;
        if (strata.getIndex() > 0) {
            upperStrata = this.stratig.getStratas()[strata.getIndex() - 1];
        }

        var lowerStrata = this.stratig.getStratas()[strata.getIndex() + 1];

        //On remplit le fond de la strate avec le même fond que la strate inférieure
        this.fillStrata(draw, lowerStrata);

        //On dessine ensuite une forme qui permet de cacher une partie de la strate pour donner
        //l'illusion que les triangles s'agrandissent/rapetississent
        var ratio = strata.getCharacteristicsByFamily('cmCorrosionRatioFamily')[0].getRealName();
        ratio = parseInt(ratio.substr(1));

        var begin = 0;
        switch (ratio) {
            case 1:
                begin = 0 - ((2 * height) / 9) * 1;
                break;
            case 2:
                begin = 0 - height;
                break;
            case 3:
                begin = 0 - ((2 * height) / 9) * 8;
                break;

        }

        var rectHeight = begin + height;
        var topX = rectHeight + height;
        var pathString = 'M 0 ' + begin + ' L ' + width + ' ' + begin + ' L ' + width + ' ' + rectHeight;

        //On dessine les triangles en fonction des dimensions de la strate
        //Ces triangles se trouve par dessus un rectangle qui fait les dimensions d'une strate
        for (var i = 0; i < 7; i++) {
            var divisor = 8;
            var topY = width - (i + 1) * (width / divisor) - i * (width / divisor);
            var downY = topY - (width / divisor)
            pathString = pathString + ' L ' + topY + ' ' + topX + ' L ' + downY + ' ' + rectHeight;
        }
        var upperStrataColor = 'white';
        if (upperStrata != undefined) {

            if (upperStrata.getCharacteristicsByFamily('colourFamily').length > 0) {
                upperStrataColor = upperStrata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
            }
        }
        draw.path(pathString).attr({ fill: upperStrataColor });
    }

    /**
     * Cette méthode remplit la strate avec les images et les éléments générés
     * @param canvas
     * @param strata
     */
        fillStrata(draw, strata) {

        var height = 100;
        var width = 500
        if (strata.getCharacteristicsByFamily('thicknessFamily').length > 0) {
            height = this.getThicknesses(strata.getCharacteristicsByFamily('thicknessFamily')[0].getName());
        }

        if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
            width = this.getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
        }

        // Initialisation du POISSON DISK DISTRIBUTION
        var poisson = [];
        //Instance Node.js
        if (this.window == undefined) {
            var pds = new poissonDisk.PoissonDiskSampler(width, height);
        }
        //Instance Browser
        else {
            var pds = new PoissonDiskSampler(width, height);
        }

        var color = 'white';
        if (strata.getCharacteristicsByFamily('colourFamily').length > 0) {
            color = strata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
        }

        if (color == 'black') {
            color = '#474747';
        }

        console.log("rectColor: " + color)

        var rect = draw.rect(width, height).attr({ fill: color });

        if (strata.getCharacteristicsByFamily('porosityFamily').length > 0) {
            var char = strata.getCharacteristicsByFamily('porosityFamily')[0].getName();
            var img = 'porosity';
            switch (char) {
                case 'slightlyPorousCharacteristic':
                    poisson.push({'min': 20, 'max': 90, 'img': img, 'imgw': 5, 'imgh': 5});
                    break;
                case 'porousCharacteristic':
                    poisson.push({'min': 20, 'max': 40, 'img': img, 'imgw': 5, 'imgh': 5});
                    break;
                case 'highlyPorousCharacteristic':
                    poisson.push({'min': 20, 'max': 20, 'img': img, 'imgw': 5, 'imgh': 5});
                    break;
            }
        }


        //cprimicrostructure
        if (strata.getCharacteristicsByFamily('cpriMicrostructureFamily').length > 0) {
            var char = strata.getCharacteristicsByFamily('cpriMicrostructureFamily')[0].getName();
            switch (char) {
                case "pseudomorphOfGranularCharacteristic":
                    var image = draw.image("../static/micorr/images/c/grains/GrainsGris_" + height + "x" + width + ".png");
                    image.size(width, height);
                    break;

                case "pseudomorphOfDendriticCharacteristic":
                    var image = draw.image("../static/micorr/images/c/dendrites/dendrites_" + height + "x" + width + ".png");
                    image.size(width, height);
                    break;

                case "hexagonalNetworkCharacteristic":
                    var image = draw.image("../static/micorr/images/c/hexagonal.png");
                    image.size(width, height);
                    break;

                case "alternatingBandsCharacteristic":
                    this.drawalternatingBands(draw, 6, 10, width, height);
                    break;

                case "cristallineMicrostructureCharacteristic":
                    poisson.push({'min': 13, 'max': 13, 'img': 'scattered2', 'imgw': 27, 'imgh': 27});
                    break;

                case "isolatedAggregateMicrostructureCharacteristic":
                    poisson.push({'min': 30, 'max': 60, 'img': 'isolated', 'imgw': 55, 'imgh': 27});
                    break;

                case "scatteredAggregateMicrostructureCharacteristic":
                    poisson.push({'min': 32, 'max': 60, 'img': 'scattered1', 'imgw': 43, 'imgh': 39});
                    poisson.push({'min': 23, 'max': 60, 'img': 'scattered2', 'imgw': 27, 'imgh': 27});
                    break;
            }
        }


        //subcprimicrostructure
        if (strata.isSubCharacteristic('eutecticPhaseNoMicrostructureCpri') || strata.isSubCharacteristic('eutecticPhaseCristallineMicrostructureCpri') ||
            strata.isSubCharacteristic('eutecticPhaseIsolatedAggregateMicrostructureCpri') || strata.isSubCharacteristic('eutecticPhaseScatteredAggregateMicrostructureCpri') ||
            strata.isSubCharacteristic('eutecticPhaseAlternatingBandsCpri') || strata.isSubCharacteristic('eutecticPhaseHexagonalNetworkCpri') ||
            strata.isSubCharacteristic('eutecticPhasePseudomorphOfDendriticCpri') || strata.isSubCharacteristic('eutecticPhasePseudomorphOfGranularCpri')) {

            poisson.push({'min': 40, 'max': 60, 'img': 'eutetic1', 'imgw': 80, 'imgh': 83});
            poisson.push({'min': 30, 'max': 50, 'img': 'eutetic2', 'imgw': 57, 'imgh': 60});
            poisson.push({'min': 36, 'max': 45, 'img': 'eutetic3', 'imgw': 71, 'imgh': 44});
        }
        if (strata.isSubCharacteristic('twinLinesNoMicrostructureCpri') || strata.isSubCharacteristic('twinLinesCristallineMicrostructureCpri') ||
            strata.isSubCharacteristic('twinLinesIsolatedAggregateMicrostructureCpri') || strata.isSubCharacteristic('twinLinesScatteredAggregateMicrostructureCpri') ||
            strata.isSubCharacteristic('twinLinesAlternatingBandsCpri') || strata.isSubCharacteristic('twinLinesHexagonalNetworkCpri') ||
            strata.isSubCharacteristic('twinLinesPseudomorphOfDendriticCpri') || strata.isSubCharacteristic('twinLinesPseudomorphOfGranularCpri')) {

            var image = draw.image("../static/micorr/images/c/macles/Macles_" + height + "x" + width + ".png");
            image.size(width, height);
        }
        if (strata.isSubCharacteristic('inclusionsNoMicrostructureCpri') || strata.isSubCharacteristic('inclusionsCristallineMicrostructureCpri') ||
            strata.isSubCharacteristic('inclusionsIsolatedAggregateMicrostructureCpri') || strata.isSubCharacteristic('inclusionsScatteredAggregateMicrostructureCpri') ||
            strata.isSubCharacteristic('inclusionsAlternatingBandsCpri') || strata.isSubCharacteristic('inclusionsHexagonalNetworkCpri') ||
            strata.isSubCharacteristic('inclusionsPseudomorphOfDendriticCpri') || strata.isSubCharacteristic('inclusionsPseudomorphOfGranularCpri')) {

            var image = draw.image("../static/micorr/images/c/inclusion/Inclusions_" + height + "x" + width + ".png");
            image.size(width, height);
        }


        //MmicrostructureFamily
        if (strata.getCharacteristicsByFamily('mMicrostructureFamily').length > 0) {
            var char = strata.getCharacteristicsByFamily('mMicrostructureFamily')[0].getName();
            if (char == "dendriticCharacteristic") {
                var image = draw.image("../static/micorr/images/c/dendrites/dendritesmetal_" + height + "x" + width + ".png");
                image.size(width, height);

            }
            else if (char == "grainSmallCharacteristic") {
                var image = draw.image("../static/micorr/images/c/grains/Grains_" + height + "x" + width + ".png");
                image.size(width, height);
            }
            else if (char == "grainLargeCharacteristic") {
                var image = draw.image("../static/micorr/images/c/GrainLarge/GrainLarge_" + height + "x" + width + ".png");
                image.size(width, height)
            }
            else if (char == "grainElongatedCharacteristic") {
                var image = draw.image("../static/micorr/images/c/ElongatedGrain/ElongatedGrain_" + height + "x" + width + ".png");
                image.size(width, height)
            }
        }


        //SubmMicrostructure
        if (strata.isSubCharacteristic('eutecticPhaseDendritic') || strata.isSubCharacteristic('eutecticPhaseGrainElongated') ||
            strata.isSubCharacteristic('eutecticPhaseGrainLarge') || strata.isSubCharacteristic('eutecticPhaseGrainSmall')) {
            poisson.push({'min': 40, 'max': 60, 'img': 'eutetic1', 'imgw': 80, 'imgh': 83});
            poisson.push({'min': 30, 'max': 50, 'img': 'eutetic2', 'imgw': 57, 'imgh': 60});
            poisson.push({'min': 36, 'max': 45, 'img': 'eutetic3', 'imgw': 71, 'imgh': 44});
        }
        if (strata.isSubCharacteristic('twinLinesDendritic') || strata.isSubCharacteristic('twinLinesGrainElongated') ||
            strata.isSubCharacteristic('twinLinesGrainLarge') || strata.isSubCharacteristic('twinLinesGrainSmall')) {
            var image = draw.image("../static/micorr/images/c/macles/Macles_" + height + "x" + width + ".png");
            image.size(width, height);
        }
        if (strata.isSubCharacteristic('inclusionsDendritic') || strata.isSubCharacteristic('inclusionsGrainElongated') ||
            strata.isSubCharacteristic('inclusionsGrainLarge') || strata.isSubCharacteristic('inclusionsGrainSmall')) {
            var image = draw.image("../static/micorr/images/c/inclusion/Inclusions_" + height + "x" + width + ".png");
            image.size(width, height);
        }

        if (strata.isSubCharacteristic('')) {

        }

        //Fissures
        if (strata.getCharacteristicsByFamily('crackingFamily').length > 0) {
            var char = strata.getCharacteristicsByFamily('crackingFamily')[0].getName();
            switch (char) {
                case "simpleCracksCharacteristic" :
                    var image = draw.image("../static/micorr/images/c/cracking/Simple/Horizontal/CP_CrackingSimple_" + height + "x" + width + ".png");
                    image.size(width, height);
                    break;

                case "branchedCracksCharacteristic" :
                    var image = draw.image("../static/micorr/images/c/cracking/Branched/CP_CrackingBranched_" + height + "x" + width + ".png");
                    image.size(width, height);
                    break;

                case "networkCracksCharacteristic" :
                    var image = draw.image("../static/micorr/images/c/cracking/Network/CP_CrackingNetwork_" + height + "x" + width + ".png");
                    image.size(width, height);
                    break;
            }
        }

        if (strata.getCharacteristicsByFamily('cohesionFamily').length > 0) {
            var char = strata.getCharacteristicsByFamily('cohesionFamily')[0].getName();
            if (char == 'powderyCharacteristic') {
                poisson.push({'min': 8, 'max': 15, 'img': 'powder', 'imgw': 15, 'imgh': 14});
            }
        }

        //Parcours et affichage des dessins générés par le poissonDisk:
        for (var i = 0; i < 500; i++) {
            for (var j = 0; j < poisson.length; j++) {
                // Création des points
                pds.createPointsPerso(poisson[j].min, poisson[j].max, poisson[j].img, poisson[j].imgw, poisson[j].imgh);
            }
        }


        for (var i = 0; i < pds.pointList.length; i++) {
            var image = draw.image("../static/micorr/images/c/" + pds.pointList[i].t + ".png");
            image.size(pds.pointList[i].w, pds.pointList[i].h);
            image.x(pds.pointList[i].x - pds.pointList[i].w / 2);
            image.y(pds.pointList[i].y - pds.pointList[i].h / 2);

        }
    }

    getThicknesses(thickness) {
        if (thickness == "thickCharacteristic")
            return 150;
        else if (thickness == "normalThicknessCharacteristic")
            return 100;
        else if (thickness == "thinCharacteristic")
            return 50;
        else
            return 100;

    }

    getWidths(width) {
        if (width == "largeCharacteristic")
            return 650;
        else if (width == "normalWidthCharacteristic")
            return 500;
        else if (width == "smallCharacteristic")
            return 300;
        else
            return 500;
    }

    drawCustomInterface(draw, index, width, height, type, nb_hop, bottomBackgroundColor, topBackgroundColor, borderWidth, interfaceLineThickness, diffuse, transition) {
        /* Le dessin des interfaces se fait en 3 étapes
         *  1) Tout d'abord on colorie la zone de dessin avec la couleur topBackground et sans cadre
         *  2) on dessine la ligne d'interface avec le tableau line = []
         *  3) on dessine la ligne d'interface accompagnée d'un polygone qui vient faire office de partie inférieure de l'interface et avec la couleur bottombackgroundcolor
         */

        // Si la couleur des deux strates est noire alors la ligne d'interface est blanche
        var strokeColor = "black";
        if (bottomBackgroundColor == "black" && topBackgroundColor == "black")
            strokeColor = "white";

        var bubbleTransitionSize = 4;

        // BEFORE : var rect = paper.rect(0, 0, width, height).attr("stroke-width", 0); // zone de dessin sans cadre
        var rect = draw.rect(width, height).fill('none');
        if ((transition == "semiGradualInferiorCharacteristic" || transition == "gradualCharacteristic") && index != 0) {
            var pds = new PoissonDiskSampler(width, height);
            for (var i = 0; i < 50; i++)
                pds.createPointsPerso(10, 10, 'none', 0, 0);
            for (var i = 0; i < pds.pointList.length; i++) {
                // BEFORE: paper.circle(pds.pointList[i].x, pds.pointList[i].y + bubbleTransitionSize, bubbleTransitionSize).attr("fill", bottomBackgroundColor);
                var point = draw.circle(bubbleTransitionSize);
                point.x(pds.pointList[i].x);
                point.y(pds.pointList[i].y);
                point.fill(bottomBackgroundColor);
            }
        }


        rect.attr("fill", topBackgroundColor);
        var y = height / 2;
        var t = [];
        var line = [];
        var nb = nb_hop;
        var x = 0;
        var h_hop = width / nb;
        var y = height / 2;
        for (var i = 0; i < nb; i++) {
            t.push('M');
            line.push('M');
            t.push(x);
            line.push(x);
            t.push(y);
            line.push(y);
            t.push('Q');
            line.push('Q');
            // on utilise les courbes de béziers pour faire des vagues
            if (type == "wavy") {
                t.push(x + width / nb / 2);
                line.push(x + width / nb / 2);
                if ((i % 2) == 0) {
                    line.push(y + y / 2);
                    t.push(y + y / 2);
                }
                else {
                    line.push(y - y / 2);
                    t.push(y - y / 2);
                }
            }
            else if (type == "bumpy") { // on fait des bosses avec les courbes de béziers en introduisant des hauteurs aléatoires
                t.push(x + width / nb / 2);
                line.push(x + width / nb / 2);
                var rnd = getRandomInt(0, y);
                if ((i % 2) == 0) {
                    line.push(y + rnd);
                    t.push(y + rnd);
                }
                else {
                    line.push(y - rnd);
                    t.push(y - rnd);
                }
            }
            else if (type == "irregular") { // on faire des formes irrégulières avec les courbes de béziers avec des valeurs aléatoires
                var rndx = getRandomInt(0, width / nb);
                t.push(x + rndx);
                line.push(x + rndx);
                var rnd = getRandomInt(-height * 0.8, height * 0.8);
                line.push(y + rnd);
                t.push(y + rnd);

            }
            line.push(x + h_hop);
            t.push(x + h_hop);
            line.push(y);
            t.push(y);


            t.push('L');
            t.push(x + h_hop);
            t.push(height);
            t.push('L');
            t.push(x);
            t.push(height);

            x += h_hop;
        }

        var lineAttrs = new Array();
        lineAttrs.push({"stroke-width": interfaceLineThickness});

        if (diffuse) {
            lineAttrs.push({"stroke-dasharray": ["."]});
            lineAttrs.push({"stroke": "grey"});
        }
        /*BEFORE
         paper.path(line).attr("stroke", strokeColor).attr(lineAttrs);
         paper.path(t).attr("fill", bottomBackgroundColor).attr("stroke", bottomBackgroundColor);;
         */
        var lineString = '';
        for (var i = 0; i < line.length; i++) {
            lineString = lineString + line[i] + ' ';
        }

        var tString = '';
        for (var i = 0; i < t.length; i++) {
            tString = tString + t[i] + ' ';
        }
        var path1 = draw.path(lineString).fill('none');
        var path2 = draw.path(tString).fill(bottomBackgroundColor);
        path1.stroke({ color: strokeColor, width: 5 })
        path2.stroke({ color: bottomBackgroundColor, width: 1 })
        // Si c'est la première interface alros la bordure extérieure commence au milieu
        var startHeight = 0;
        if (index == 0) {
            startHeight = height / 2;
        }

        var leftBorder = draw.path("M0 " + startHeight + "L0 " + height).fill('none');
        leftBorder.stroke({ color: 'black', width: borderWidth });

        var rightBorder = draw.path("M" + width + " " + startHeight + "L" + width + " " + height).fill('none');
        rightBorder.stroke({ color: 'black', width: borderWidth });

        if (transition == "semiGradualSuperiorCharacteristic" || transition == "gradualCharacteristic") {
            var heightBottom = height / 2 - bubbleTransitionSize;
            var pds = new PoissonDiskSampler(width, heightBottom);
            for (var i = 0; i < 50; i++)
                pds.createPointsPerso(10, 10, 'none', 0, 0);
            for (var i = 0; i < pds.pointList.length; i++) {
                var point = draw.circle(bubbleTransitionSize);
                point.x(pds.pointList[i].x);
                point.y(pds.pointList[i].y);
                point.fill(topBackgroundColor);
            }
        }

    }

    drawalternatingBands(draw, nb_hop, nb_lines, width, height) {
        var rect = draw.rect(0, 0, width, height).attr("stroke-width", 0);

        var y = height / nb_lines;

        for (var a = 0; a < nb_lines; a++) {
            var t = [];
            var nb = nb_hop;
            var x = 0;
            var h_hop = width / nb;

            for (var i = 0; i < nb; i++) {
                t.push('M');
                t.push(x);
                t.push(y);
                t.push('Q');

                t.push(x + width / nb / 2);
                if ((i % 2) == 0)
                    t.push(y + height / nb_lines);
                else
                    t.push(y - height / nb_lines);

                t.push(x + h_hop);
                t.push(y);

                x += h_hop;
            }
            y += height / nb_lines;

            var pathString = '';
            for (var i = 0; i < t.length; i++) {
                pathString = pathString + t[i] + ' ';
            }

            var path = draw.path(pathString).fill('none');
            path.stroke({ color: 'grey', width: 1 })
        }
    }

    getDivID() {
        return this.divID;
    }

    setDivID(id) {
        this.divID = id;
    }

    setStratig(stratig) {
        this.stratig = stratig;
    }

    getStratig() {
        return this.stratig;
    }
}


export {
    GraphGenerationUtil
    }