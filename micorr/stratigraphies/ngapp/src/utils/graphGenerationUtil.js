/**
 * Created by Thierry Hubmann
 * Cette classe utilise la librairie graphique SVG.js pour générer le SVG
 * d'une stratigraphie ou d'une strate.
 */

import {Stratigraphy} from '../business/stratigraphy';
import {Strata} from '../business/stratigraphy';
import {Characteristic} from '../business/characteristic';
import {SubCharacteristic} from '../business/subCharacteristic';
import {PoissonDiskSampler} from '../algorithms/poissonDisk';

import * as utils from '../nodeServices/nodeUtils.js';

var SVG;

class GraphGenerationUtil {
    constructor(win, stratig) {
        if (win != null) {
            this.window = win;
            /*On appelle la librairie SVG.js depuis un module Node.js car celle ci
             n'est pas compatible avec ES2015 si l'on veut lui donner le paramètre window
             */
            //SVG= utils.getDrawer(win);
            SVG=require('svg.js')(win);
        }
        else
            SVG = require("svg.js");
        this.stratig = stratig;
    }

    /**
     * Cette méthode est utilisée par Node.js pour dessiner la stratigraphie entière
     */
    drawStratigraphy(width) {


        var stratigraphyHeight = 0;
        var resultDraw = SVG(this.window.document.documentElement);
        resultDraw.attr("shape-rendering","auto"); //set shape rendering to default (auto) vs crispEdges
        console.log("Nb of strata:" + this.stratig.getStratas().length);
        for (var i = 0; i < this.stratig.getStratas().length; i++) {
            var str = this.stratig.getStratas()[i];
            console.log('strataUid: ' + str.getUid());
            var nestedInterface = this.drawInterface(str, null, resultDraw);
            if (nestedInterface)
            {
                nestedInterface.y(stratigraphyHeight);
                stratigraphyHeight = stratigraphyHeight + nestedInterface.height();
            }
            var nestedStrata = this.drawStrata(str, null, resultDraw);
            nestedStrata.y(stratigraphyHeight);
            stratigraphyHeight = stratigraphyHeight + nestedStrata.height();
        }
        //var box = resultDraw.viewbox();
        var box = resultDraw.viewbox(0, 0, 500, stratigraphyHeight);
        box.width(width);
        var svgContent = resultDraw.svg();
        // remove all svg nodes from dom to be ready for next rendering
        resultDraw.clear();
        return svgContent;
    }

    /**
     * Cette méthode dessine l'interface de la strate
     * @param strata la strate
     * @param divID la div dans laquelle on veut dessiner l'interface
     */
    // Either pass divID (browser case) or svg.js draw context directly when called from nodejs
    // the other argument must be null
    drawInterface(strata, divID, draw) {
        var index = strata.getIndex();


        var interfaceHeight = 22;
        var borderColor = 'black';

        // CM stratum is itself an interface between M and CP strata so we don't draw any interface with a CM
        // No interface above CM

        let strataNature = strata.getFirstCharacteristicByFamily('natureFamily', 'name');
        if ( strataNature == 'cmCharacteristic')
            // we don't draw anything
            return null;
        // Nor below
        if (strata.index > 0) {
            var upperStrata = this.stratig.getStratas()[index - 1];
            if (upperStrata.getFirstCharacteristicByFamily('natureFamily', 'name') == 'cmCharacteristic' && strataNature == 'mCharacteristic') {
                return null;
            }
        }
        if (divID) {
            if (this.window == undefined) {
                var interfaceDiv = document.getElementById(divID);
                interfaceDiv.style.height = interfaceHeight + "px";
            }
            else {
                var interfaceDiv = this.window.document.getElementById(divID);
                interfaceDiv.style.height = interfaceHeight + "px";
            }
        }

        var borderWidth = 8;
        var divisionLineWidth = 5;

        let strataWidth = this.getWidths(strata.getFirstCharacteristicByFamily('widthFamily', 'name'));
        var interfaceWidth = strataWidth;

        draw = draw || SVG(divID).size(interfaceWidth, interfaceHeight);

        var nestedInterface = draw.nested();
        nestedInterface.height(interfaceHeight);
        nestedInterface.width(interfaceWidth);

        var upperInterfaceColor = "white";  // couleur de fond de la partie haute
        var lowerInterfaceColor = "white";  // couleur de fond de la partie basse

        // si on est pas à la première interface alors on change la couleur de fond du haut
        if (index > 0) {
                let color = this.stratig.getStratas()[index - 1].getFirstCharacteristicByFamily('colourFamily', 'realName');
                if (color) {
                    // !!! A MODIFIER QUAND ON FERA LE REFACTORING DU DAO...
                    if (color == "black") {
                        upperInterfaceColor = '#474747';
                    } else if (color == 'dark red') {
                        upperInterfaceColor = '#bc2c14';
                    } else if (color == 'light yellow') {
                        upperInterfaceColor = '#fcf0be';
                    } else if (color == 'ochre') {
                        upperInterfaceColor = '#cab91d';
                    } else if (color == 'dark green') {
                        upperInterfaceColor = '#046424';
                    } else if (color == 'medium green') {
                        upperInterfaceColor = '#3cbc65';
                    } else if (color == 'light green') {
                        upperInterfaceColor = '#a2cfaf';
                    } else if (color == 'dark blue') {
                        upperInterfaceColor = '#441cb3';
                    } else if (color == 'medium blue') {
                        upperInterfaceColor = '#4cb3d4';
                    } else if (color == 'light blue') {
                        upperInterfaceColor = '#a0cedb';
                    } else if (color != "" && color != "undefined") {
                        upperInterfaceColor = color;
                    }
                }
        }
        let color = strata.getFirstCharacteristicByFamily('colourFamily', 'realName');
        if (color) {
            // !!! A MODIFIER QUAND ON FERA LE REFACTORING DU DAO...
            if (color == "black") {
                lowerInterfaceColor = "#474747";
            } else if (color == 'dark red') {
                lowerInterfaceColor = '#bc2c14';
            } else if (color == 'light yellow') {
                lowerInterfaceColor = '#fcf0be';
            } else if (color == 'ochre') {
                lowerInterfaceColor = '#cab91d';
            } else if (color == 'dark green') {
                lowerInterfaceColor = '#046424';
            } else if (color == 'medium green') {
                lowerInterfaceColor = '#3cbc65';
            } else if (color == 'light green') {
                lowerInterfaceColor = '#a2cfaf';
            } else if (color == 'dark blue') {
                lowerInterfaceColor = '#441cb3';
            } else if (color == 'medium blue') {
                lowerInterfaceColor = '#4cb3d4';
            } else if (color == 'light blue') {
                lowerInterfaceColor = '#a0cedb';
            } else if (color != "" && color != "undefined"){
                lowerInterfaceColor = color;
            }
        }
        let transition = strata.getFirstCharacteristicByFamily('interfaceTransitionFamily', 'name');
        let diffuse = (transition == "diffuseCharacteristic");
        let profile = strata.getFirstCharacteristicByFamily('interfaceProfileFamily', 'name') || 'straightCharacteristic';

        //On va maintenant dessiner l'interface
            const nb_hop = {
                straightCharacteristic: 1,
                wavyCharacteristic: 8,
                bumpyCharacteristic: 20,
                irregularCharacteristic: 30
            };
            this.drawCustomInterface(nestedInterface, index, interfaceWidth, interfaceHeight, profile, nb_hop[profile],
                lowerInterfaceColor, upperInterfaceColor, borderWidth, divisionLineWidth, diffuse, transition);


        return nestedInterface;

    }

    /**
     * Cette méthode permet de dessiner une strate
     * @param strata
     * @param divID La div dans laquelle on veut dessiner la strate
     */
    // Either pass divID (browser case) or svg.js draw context directly when called from nodejs
    // the other argument must be null
    drawStrata(strata, divID, draw) {
        var borderColor = 'black';

        let height = this.getThicknesses(strata.getFirstCharacteristicByFamily('thicknessFamily', 'name'));
        let width = this.getWidths(strata.getFirstCharacteristicByFamily('widthFamily', 'name'));
        if (divID) {

            if (this.window == undefined) {
                document.getElementById(divID).style.height = height + "px";
            } else {
                this.window.document.getElementById(divID).style.height = height + "px";
            }
        }
        var borderWidth = 8;

        draw = draw || SVG(divID).size(width, height);


        //on crée un groupe pour englober la strate et pour pouvoir la réutiliser
        var nestedStrata = draw.nested();
        nestedStrata.height(height);
        nestedStrata.width(width);

        this.fillStrata(nestedStrata, strata);
        //Strate CM

        if (strata.getFirstCharacteristicByFamily('natureFamily', 'name') == 'cmCharacteristic') {
            if (strata.getIndex() < this.stratig.getStratas().length - 1) {
                var lowerStrata = this.stratig.getStratas()[strata.getIndex() + 1];
                if (lowerStrata.getFirstCharacteristicByFamily('natureFamily', 'name') == 'mCharacteristic') {
                    this.drawCM(strata, width, height, nestedStrata);
                }
            }
        }

        //Dessin des bords
        var leftBorder = nestedStrata.path("M0 0L0 " + height).fill('none');
        var rightBorder = nestedStrata.path("M" + width + " 0L" + width + " " + height).fill('none');
        leftBorder.stroke({color: borderColor, width: borderWidth});
        rightBorder.stroke({color: borderColor, width: borderWidth});

        //Dessin du bord inférieur si c'est la dernière strate
        if (strata.getIndex() == this.stratig.getStratas().length - 1) {
            var bottomBorder = nestedStrata.path("M0 " + height + "L" + width + " " + height).fill('none');
            bottomBorder.stroke({color: borderColor, width: borderWidth});
        }
        let strataColor = strata.getFirstCharacteristicByFamily("colourFamily","realName");
        let label = nestedStrata.plain(strata.getLabel()).attr({x:20, y:height/2, "text-anchor":"auto","font-size":18,fill:"black"});
        let labelBbox=label.bbox();
        console.log(`stratum ${strata.getLabel()} label bbox:${labelBbox.width}, ${labelBbox.height}`);
        // add a translucent rectangle in text background we needed to draw the text first to get its dimension
        // then we draw the rectangle and move it before the text to have it in its background (z-order arrangement)
        const wRectRatio=1.3, hRectRatio=1.1;
        label.before(nestedStrata.rect(labelBbox.width * wRectRatio, labelBbox.height * hRectRatio)
            .attr({
                x: labelBbox.x - labelBbox.width * ((wRectRatio - 1) / 2),
                y: labelBbox.y - labelBbox.height * ((hRectRatio - 1) / 2),
                rx: 5,
                ry: 5,
                'stroke-width': '1',
                stroke: 'black',
                fill:"white",
                "fill-opacity":"0.8"
            }));
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
        this.fillStrata(draw, lowerStrata, width, height);


        //On dessine ensuite une forme qui permet de cacher une partie de la strate pour donner
        //l'illusion que les triangles s'agrandissent/rapetississent
        let ratio = strata.getFirstCharacteristicByFamily('cmCorrosionRatioFamily', 'realName');
        if (ratio)
            ratio = parseInt(ratio.substr(1));
        else
            ratio = 0;


        var begin = 0;
        switch (ratio) {
            case 1:
                begin = 0 - 2 * height / 9 * 1;
                break;
            case 2:
                begin = 0 - height;
                break;
            case 3:
                begin = 0 - 2 * height / 9 * 8;
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
            var downY = topY - width / divisor;
            pathString = pathString + ' L ' + topY + ' ' + topX + ' L ' + downY + ' ' + rectHeight;
        }

        if (upperStrata != undefined) {

            var group = draw.group();
            this.fillStrata(group, upperStrata, width, height);

            var defs = draw.defs();
            var path = defs.path(pathString).attr({fill: 'none'});
            if (upperStrata.getFirstCharacteristicByFamily('colourFamily', 'realName') ==
                lowerStrata.getFirstCharacteristicByFamily('colourFamily', 'realName'))
                group.path(pathString).attr({fill: 'none', 'stroke-width': '1', stroke: 'black'});
                group.clipWith(path);
        }
        else {
            draw.path(pathString).attr({fill: 'white'});
        }

    }

    /**
     * Cette méthode remplit la strate avec les images et les éléments générés
     * @param canvas
     * @param strata
     */
    fillStrata(draw, strata, w, h) {


        //Création d'un groupe pour le contenu du fond de la strate pour pouvoir le réutiliser
        var group = draw.group;

        let height = h || this.getThicknesses(strata.getFirstCharacteristicByFamily('thicknessFamily', 'name'));
        let width = w || this.getWidths(strata.getFirstCharacteristicByFamily('widthFamily', 'name'));


        // Initialisation du POISSON DISK DISTRIBUTION
        var poisson = [];
        //Instance browser
        if (this.window == undefined) {
            var pds = new PoissonDiskSampler(width, height);
        }
        //Instance Node.js
        else {
            var pds = new PoissonDiskSampler(width, height);
        }

        var color = strata.getFirstCharacteristicByFamily('colourFamily','realName') || 'white';

        // !!! A MODIFIER QUAND ON FERA LE REFACTORING DU DAO...
        if (color == 'black') {
            color = '#474747';
        }
        if (color == 'dark red') {
            color = '#bc2c14';
        }
        if (color == 'light yellow') {
            color = '#fcf0be';
        }
        if (color == 'ochre') {
            color = '#cab91d';
        }
        if (color == 'dark green') {
            color = '#046424';
        }
        if (color == 'medium green') {
            color = '#3cbc65';
        }
        if (color == 'light green') {
            color = '#a2cfaf';
        }
        if (color == 'dark blue') {
            color = '#441cb3';
        }
        if (color == 'medium blue') {
            color = '#4cb3d4';
        }
        if (color == 'light blue') {
            color = '#a0cedb';
        }

        let rect = draw.rect(width, height).attr({fill: color, "shape-rendering": "crispEdges"});

        switch ( strata.getFirstCharacteristicByFamily('porosityFamily', 'name')) {
            case 'slightlyPorousCharacteristic':
                this.addImage(draw, "../static/micorr/images/c/CP/Porosity/CP_SlightlyPorous_" + height + "x" + width + ".svg", width, height);
                break;
            case 'porousCharacteristic':
                this.addImage(draw, "../static/micorr/images/c/CP/Porosity/CP_Porous_" + height + "x" + width + ".svg", width, height);

                break;
            case 'highlyPorousCharacteristic':
                this.addImage(draw, "../static/micorr/images/c/CP/Porosity/CP_HighlyPorous_" + height + "x" + width + ".svg", width, height);
                break;
        }


        //cprimicrostructure
        switch (strata.getFirstCharacteristicByFamily('cpriMicrostructureFamily', 'name')) {
            case "pseudomorphOfGranularCharacteristic":
                this.addImage(draw, "../static/micorr/images/c/grains/GrainsGris_" + height + "x" + width + ".png", width, height);
                break;

            case "pseudomorphOfDendriticCharacteristic":
                this.addImage(draw, "../static/micorr/images/c/CP/Dendrite/CP_Dendrite_" + height + "x" + width + ".svg", width, height);
                break;

            case "hexagonalNetworkCharacteristic":
                this.addImage(draw, "../static/micorr/images/c/hexagonal.png", width, height);
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


        //subcprimicrostructure
        if (strata.isSubCharacteristic('eutecticPhaseNoMicrostructureCpri', 'eutecticPhaseCristallineMicrostructureCpri', 'eutecticPhaseIsolatedAggregateMicrostructureCpri', 'eutecticPhaseScatteredAggregateMicrostructureCpri', 'eutecticPhaseAlternatingBandsCpri', 'eutecticPhaseHexagonalNetworkCpri', 'eutecticPhasePseudomorphOfDendriticCpri', 'eutecticPhasePseudomorphOfGranularCpri')) {

            this.addImage(draw, "../static/micorr/images/c/M/EutheticPhase/M_EutheticPhase_" + height + "x" + width + ".svg", width, height);
        }

        if (strata.isSubCharacteristic('twinLinesNoMicrostructureCpri', 'twinLinesCristallineMicrostructureCpri', 'twinLinesIsolatedAggregateMicrostructureCpri', 'twinLinesScatteredAggregateMicrostructureCpri', 'twinLinesAlternatingBandsCpri', 'twinLinesHexagonalNetworkCpri', 'twinLinesPseudomorphOfDendriticCpri', 'twinLinesPseudomorphOfGranularCpri')) {

            this.addImage(draw, "../static/micorr/images/c/CP/TwinLines/CP_TwinLinesGrainSmall_" + height + "x" + width + ".svg", width, height);
        }
        if (strata.isSubCharacteristic('inclusionsNoMicrostructureCpri', 'inclusionsCristallineMicrostructureCpri', 'inclusionsIsolatedAggregateMicrostructureCpri', 'inclusionsScatteredAggregateMicrostructureCpri', 'inclusionsAlternatingBandsCpri', 'inclusionsHexagonalNetworkCpri', 'inclusionsPseudomorphOfDendriticCpri', 'inclusionsPseudomorphOfGranularCpri')) {

            this.addImage(draw, "../static/micorr/images/c/CP/Inclusion/CP_InclusionGrainSmall_" + height + "x" + width + ".svg", width, height);
        }


        //MmicrostructureFamily
        switch (strata.getFirstCharacteristicByFamily('mMicrostructureFamily', 'name')) {
            case "dendriticCharacteristic":
                this.addImage(draw, "../static/micorr/images/c/M/Dendrites/M_Dendrites_" + height + "x" + width + ".svg", width, height);
                break;
            case "deformedDendritesCharacteristic":
                this.addImage(draw, "../static/micorr/images/c/M/Dendrites/M_DeformedDendrites_" + height + "x" + width + ".svg", width, height);
                break;
            case "grainSmallCharacteristic":
                this.addImage(draw, "../static/micorr/images/c/M/Grain/M_GrainSmall_" + height + "x" + width + ".svg", width, height);
                break;
            case "grainLargeCharacteristic":
                this.addImage(draw, "../static/micorr/images/c/M/Grain/M_GrainLarge_" + height + "x" + width + ".svg", width, height);
                break;
            case "grainElongatedCharacteristic":
                this.addImage(draw, "../static/micorr/images/c/M/Grain/M_GrainElongated_" + height + "x" + width + ".svg", width, height);
                break;
        }

        //SubmMicrostructure
        if (strata.isSubCharacteristic('eutecticPhaseDendritic', 'eutecticPhaseGrainElongated', 'eutecticPhaseGrainLarge', 'eutecticPhaseGrainSmall')) {
            this.addImage(draw, "../static/micorr/images/c/M/EutheticPhase/M_EutheticPhase_" + height + "x" + width + ".svg", width, height);
        }
        else if (strata.isSubCharacteristic('eutecticPhaseDeformedDendritic')) {
            this.addImage(draw, "../static/micorr/images/c/M/EutheticPhase/M_EutheticPhaseDeformedDendrite_" + height + "x" + width + ".svg", width, height);
        }

        if (strata.isSubCharacteristic('twinLinesDendritic', 'twinLinesGrainSmall')) {
            this.addImage(draw, "../static/micorr/images/c/M/TwinLines/M_TwinLinesGrainSmall_" + height + "x" + width + ".svg", width, height);
        }
        else if (strata.isSubCharacteristic('twinLinesGrainElongated')) {
            this.addImage(draw, "../static/micorr/images/c/M/TwinLines/M_TwinLinesGrainElongated_" + height + "x" + width + ".svg", width, height);
        }
        else if (strata.isSubCharacteristic('twinLinesGrainLarge')) {
            this.addImage(draw, "../static/micorr/images/c/M/TwinLines/M_TwinLinesGrainLarge_" + height + "x" + width + ".svg", width, height);
        }
        if (strata.isSubCharacteristic('elongatedInclusionsGrainSmall','elongatedInclusionsGrainLarge','elongatedInclusionsGrainElongated')) {
            this.addImage(draw, "../static/micorr/images/c/M/elongatedInclusions/elongatedInclusions_" + height + "x" + width + ".svg", width, height);
        }

        if (strata.isSubCharacteristic('eutecticPhaseGraphiteLamellas','eutecticPhaseMartensite','eutecticPhaseBainite')) {
            this.addImage(draw, "../static/micorr/images/c/M/eutecticPhase/eutecticPhaseGraphiteLamellas_" + height + "x" + width + ".svg", width, height);
        }

        if (strata.isSubCharacteristic('inclusionsGraphiteLamellas','inclusionsMartensite','inclusionsBainite')) {
            this.addImage(draw, "../static/micorr/images/c/M/Inclusion/InclusionsGraphiteLamellas_" + height + "x" + width + ".svg", width, height);
        }

        if (strata.isSubCharacteristic('slipLinesDendritic', 'slipLinesGrainSmall')) {
            this.addImage(draw, "../static/micorr/images/c/M/SlipLines/M_SlipLinesGrainSmall_" + height + "x" + width + ".svg", width, height);
        }
        else if (strata.isSubCharacteristic('slipLinesGrainElongated')) {
            this.addImage(draw, "../static/micorr/images/c/M/SlipLines/M_SlipLinesGrainElongated_" + height + "x" + width + ".svg", width, height);
        }
        else if (strata.isSubCharacteristic('slipLinesGrainLarge')) {
            this.addImage(draw, "../static/micorr/images/c/M/SlipLines/M_SlipLinesGrainLarge_" + height + "x" + width + ".svg", width, height);
        }


        if (strata.isSubCharacteristic('inclusionsDendritic', 'inclusionsGrainSmall', 'inclusionsGrainElongated')) {
            this.addImage(draw, "../static/micorr/images/c/M/Inclusion/M_InclusionGrainSmall_" + height + "x" + width + ".svg", width, height);
        }
        else if (strata.isSubCharacteristic('inclusionsGrainLarge')) {
            this.addImage(draw, "../static/micorr/images/c/M/Inclusion/M_InclusionGrainLarge_" + height + "x" + width + ".svg", width, height);
        }


        //Fissures
        switch (strata.getFirstCharacteristicByFamily('crackingFamily', 'name')) {
            case "simpleCracksCharacteristic" :
                this.addImage(draw, "../static/micorr/images/c/CP/Cracking/Simple/CP_CrackingSimpleHorizontale_" + height + "x" + width + ".svg", width, height);
                break;

            case "branchedCracksCharacteristic" :
                this.addImage(draw, "../static/micorr/images/c/CP/Cracking/Branched/CP_CrackingBranched_" + height + "x" + width + ".svg", width, height);
                break;

            case "networkCracksCharacteristic" :
                this.addImage(draw, "../static/micorr/images/c/CP/Cracking/Network/CP_CrackingNetwork_" + height + "x" + width + ".svg", width, height);
                break;
        }

        if (strata.getFirstCharacteristicByFamily('cohesionFamily', 'name') == 'powderyCharacteristic') {

            this.addImage(draw, "../static/micorr/images/c/CP/Cohesion/CP_CohesionPowdery_" + height + "x" + width + ".svg", width, height);
        }


        //Parcours et affichage des dessins générés par le poissonDisk:
        for (var i = 0; i < 500; i++) {
            for (var j = 0; j < poisson.length; j++) {
                // Création des points
                pds.createPointsPerso(poisson[j].min, poisson[j].max, poisson[j].img, poisson[j].imgw, poisson[j].imgh);
            }
        }


        //On dessine les images pour les points dans le tableau PoissonDisk
        //Pour l'instant ces images sont en png, il faudra les exporter en svg
        for (var i = 0; i < pds.pointList.length; i++) {
            var image = this.addImage(draw, "../static/micorr/images/c/" + pds.pointList[i].t + ".png", pds.pointList[i].w, pds.pointList[i].h);
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

    drawCustomInterface(draw, index, width, height, profile, nb_hop, bottomBackgroundColor, topBackgroundColor, borderWidth, interfaceLineThickness, diffuse, transition) {
        /* Le dessin des interfaces se fait en 3 étapes
         *  1) Tout d'abord on colorie la zone de dessin avec la couleur topBackground et sans cadre
         *  2) on dessine la ligne d'interface avec le tableau line = []
         *  3) on dessine la ligne d'interface accompagnée d'un polygone qui vient faire office de partie inférieure de l'interface et avec la couleur bottombackgroundcolor
         */

        // Si la couleur des deux strates est noire alors la ligne d'interface est blanche

        const bubbleTransitionSize = 4;
        let y = height / 2;
        let line = [], t=[];
        let nb = nb_hop;
        let x = 0;
        let h_hop = width / nb;
        let rndx, rndy;
        let strokeColor = "black";
        if (bottomBackgroundColor == "black" && topBackgroundColor == "black")
            strokeColor = "white";

        let rect = draw.rect(width, height).attr("shape-rendering", "crispEdges").fill(topBackgroundColor);

        if (index === 0) {
            rect.attr({ 'fill-opacity': '0' });
        }

        if ((transition == "semiGradualInferiorCharacteristic" || transition == "gradualCharacteristic") && index != 0) {
            let  pds;
            //Instance Browser
            if (this.window == undefined)
                pds = new PoissonDiskSampler(width, height);
            //Instance Node.js
            else
                pds = new PoissonDiskSampler(width, height);

            for (let i = 0; i < 50; i++)
                pds.createPointsPerso(10, 10, 'none', 0, 0);
            for (let i = 0; i < pds.pointList.length; i++) {
                let point = draw.circle(bubbleTransitionSize);
                point.x(pds.pointList[i].x);
                point.y(pds.pointList[i].y);
                point.fill(bottomBackgroundColor);
            }
        }

        for (let i = 0; i < nb; i++) {
            line.push('M', x, y);
            t.push('M', x, y);
            if (profile === "straightCharacteristic") {
                line.push("L", x + h_hop, y);
                t.push("L", x + h_hop, y);
            }
            else {
                line.push('Q');
                t.push('Q');
                // on utilise les courbes de béziers pour faire des vagues
                if (profile == "wavyCharacteristic") {
                    let pointx = x + width / nb / 2, pointy = y * ((i % 2) ? .5 : 1.5);
                    line.push(pointx, pointy);
                    t.push(pointx, pointy);
                }
                else if (profile == "bumpyCharacteristic") { // on fait des bosses avec les courbes de béziers en introduisant des hauteurs aléatoires
                    rndy = this.getRandomInt(0, y);
                    let pointx = x + width / nb / 2, pointy = y + rndy * ((i % 2) ? -1 : 1);
                    line.push(pointx, pointy);
                    t.push(pointx, pointy);
                }
                else if (profile == "irregularCharacteristic") { // on faire des formes irrégulières avec les courbes de béziers avec des valeurs aléatoires
                    rndx = this.getRandomInt(0, width / nb);
                    rndy = this.getRandomInt(-height * 0.8, height * 0.8);
                    line.push(x + rndx, y + rndy);
                    t.push(x + rndx, y + rndy);
                }
                line.push(x + h_hop, y);
                t.push(x + h_hop, y);
            }
            //Only extra points inserted in t array for closing path below
            t.push('L', x + h_hop, height);
            t.push('L', x, height);
            x += h_hop;
        }
        // commenting out diffuse / lineAttrs handling as it was not used in previous code
        // and as no effect once adapted as below
        // todo verify requirements here and svg.js api
        /*
        let lineAttrs = {"stroke-width": interfaceLineThickness};
        if (diffuse) {
            lineAttrs["stroke-dasharray"] = ["."];
            lineAttrs["stroke"] = "grey";
        }*/

        let path1 = draw.path(line.join(' ')).attr("shape-rendering", (profile === "straightCharacteristic") ? "crispEdges" : "auto").fill('none'); //.attr(lineAttrs);
        let path2 = draw.path(t.join(' ')).attr("shape-rendering", "crispEdges").fill(bottomBackgroundColor);

        path1.stroke({color: strokeColor, width: 5});
        path2.stroke({color: bottomBackgroundColor, width: 1});

        // Si c'est la première interface alros la bordure extérieure commence au milieu
        let startHeight = 0;
        if (index == 0) {
            startHeight = height / 2;
        }

        let leftBorder = draw.path("M0 " + startHeight + "L0 " + height).fill('none');
        leftBorder.stroke({color: 'black', width: borderWidth});

        let rightBorder = draw.path("M" + width + " " + startHeight + "L" + width + " " + height).fill('none');
        rightBorder.stroke({color: 'black', width: borderWidth});

        if (transition == "semiGradualSuperiorCharacteristic" || transition == "gradualCharacteristic") {
            let pds;
            if (this.window == undefined) //Instance Browser
                pds = new PoissonDiskSampler(width, height);
            else //Instance Node.js
                pds = new PoissonDiskSampler(width, height);
            for (let i = 0; i < 50; i++)
                pds.createPointsPerso(10, 10, 'none', 0, 0);
            for (let i = 0; i < pds.pointList.length; i++) {
                let point = draw.circle(bubbleTransitionSize);
                point.x(pds.pointList[i].x);
                point.y(pds.pointList[i].y);
                point.fill(topBackgroundColor);
            }
        }
    }


    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
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

            var path = draw.path(pathString).attr('shape-rendering', 'auto').fill('none');
            path.stroke({color: 'grey', width: 1})
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

    /**
     * Cette méthode permet d'ajouter des images
     * Sur nodeJS on extrait le contenu des images SVG et on l'ajoute au SVG généré
     * @param draw
     * @param url
     * @param width
     * @param height
     * @returns {*}
     */
    addImage(draw, url, width, height) {
        if (this.window) //node case we embed the images (svg and png) as datauri
        {
            const Datauri = require('datauri');
            url = new Datauri(url).content;
        }
        var image = draw.image(url);
        image.size(width, height);
        return image;
    }
}


export {
    GraphGenerationUtil
}
