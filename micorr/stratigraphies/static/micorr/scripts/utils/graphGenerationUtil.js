(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../business/stratigraphy', '../business/characteristic', '../business/subCharacteristic', '../algorithms/poissonDisk', '../nodeServices/nodeUtils.js', 'datauri'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../business/stratigraphy'), require('../business/characteristic'), require('../business/subCharacteristic'), require('../algorithms/poissonDisk'), require('../nodeServices/nodeUtils.js'), require('datauri'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.stratigraphy, global.characteristic, global.subCharacteristic, global.poissonDisk, global.nodeUtils, global.datauri);
        global.graphGenerationUtil = mod.exports;
    }
})(this, function (exports, _stratigraphy, _characteristic, _subCharacteristic, _poissonDisk, _nodeUtils, Datauri) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GraphGenerationUtil = undefined;

    var utils = _interopRequireWildcard(_nodeUtils);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var GraphGenerationUtil = function () {
        function GraphGenerationUtil(win, stratig) {
            _classCallCheck(this, GraphGenerationUtil);

            if (win != null) {
                this.window = win;
                /*On appelle la librairie SVG.js depuis un module Node.js car celle ci
                 n'est pas compatible avec ES2015 si l'on veut lui donner le paramètre window
                 */
                utils.getDrawer(win);
            }
            this.stratig = stratig;
        }

        /**
         * Cette méthode est utilisée par Node.js pour dessiner la stratigraphie entière
         */


        _createClass(GraphGenerationUtil, [{
            key: 'drawStratigraphy',
            value: function drawStratigraphy(width) {

                var stratigraphyHeight = 0;
                var resultDraw = SVG(this.window.document.documentElement);
                resultDraw.attr("shape-rendering", "auto"); //set shape rendering to default (auto) vs crispEdges
                console.log("Nb of strata:" + this.stratig.getStratas().length);
                for (var i = 0; i < this.stratig.getStratas().length; i++) {
                    var str = this.stratig.getStratas()[i];
                    console.log('strataUid: ' + str.getUid());
                    var nestedInterface = this.drawInterface(str, null, resultDraw);
                    if (nestedInterface) {
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
        }, {
            key: 'drawInterface',
            value: function drawInterface(strata, divID, draw) {
                var index = strata.getIndex();

                var interfaceHeight = 22;
                var borderColor = 'black';

                // CM stratum is itself an interface between M and CP strata so we don't draw any interface with a CM
                // No interface above CM
                if (strata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic')
                    // we don't draw anything
                    return null;
                // Nor below
                if (strata.index > 0) {
                    var upperStrata = this.stratig.getStratas()[index - 1];
                    if (upperStrata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic' && strata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'mCharacteristic') {
                        return null;
                    }
                }
                if (divID) {
                    if (this.window == undefined) {
                        var interfaceDiv = document.getElementById(divID);
                        interfaceDiv.style.height = interfaceHeight + "px";
                    } else {
                        var interfaceDiv = this.window.document.getElementById(divID);
                        interfaceDiv.style.height = interfaceHeight + "px";
                    }
                }

                var borderWidth = 8;
                var divisionLineWidth = 5;

                var strataWidth = 500;

                if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
                    strataWidth = this.getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
                }

                var interfaceWidth = strataWidth;

                draw = draw || SVG(divID).size(interfaceWidth, interfaceHeight);

                var nestedInterface = draw.nested();
                nestedInterface.height(interfaceHeight);
                nestedInterface.width(interfaceWidth);

                var upperInterfaceColor = "white"; // couleur de fond de la partie haute
                var lowerInterfaceColor = "white"; // couleur de fond de la partie basse

                // si on est pas à la première interface alors on change la couleur de fond du haut
                if (index > 0) {
                    if (this.stratig.getStratas()[index - 1].getCharacteristicsByFamily('colourFamily').length > 0) {
                        var color = this.stratig.getStratas()[index - 1].getCharacteristicsByFamily('colourFamily')[0].getRealName();
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

                if (strata.getCharacteristicsByFamily('colourFamily').length > 0) {
                    var color = strata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
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
                    } else if (color != "" && color != "undefined") {
                        lowerInterfaceColor = color;
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

                var profile = 'straightCharacteristic';
                if (strata.getCharacteristicsByFamily('interfaceProfileFamily').length > 0) {
                    profile = strata.getCharacteristicsByFamily('interfaceProfileFamily')[0].getName();
                }

                //On va maintenant dessiner l'interface
                var nb_hop = {
                    straightCharacteristic: 1,
                    wavyCharacteristic: 8,
                    bumpyCharacteristic: 20,
                    irregularCharacteristic: 30
                };
                this.drawCustomInterface(nestedInterface, index, interfaceWidth, interfaceHeight, profile, nb_hop[profile], lowerInterfaceColor, upperInterfaceColor, borderWidth, divisionLineWidth, diffuse, transition);

                return nestedInterface;
            }
        }, {
            key: 'drawStrata',
            value: function drawStrata(strata, divID, draw) {
                var borderColor = 'black';

                var height = 100;
                var width = 500;
                if (strata.getCharacteristicsByFamily('thicknessFamily').length > 0) {
                    height = this.getThicknesses(strata.getCharacteristicsByFamily('thicknessFamily')[0].getName());
                }

                if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
                    width = this.getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
                }
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
                leftBorder.stroke({ color: borderColor, width: borderWidth });
                rightBorder.stroke({ color: borderColor, width: borderWidth });

                //Dessin du bord inférieur si c'est la dernière strate
                if (strata.getIndex() == this.stratig.getStratas().length - 1) {
                    var bottomBorder = nestedStrata.path("M0 " + height + "L" + width + " " + height).fill('none');
                    bottomBorder.stroke({ color: borderColor, width: borderWidth });
                }
                var strataColor = strata.getFirstCharacteristicByFamily("colourFamily", "realName");
                var label = nestedStrata.plain(strata.getLabel()).attr({ x: 20, y: height / 2, "text-anchor": "auto", "font-size": 18, fill: "black" });
                var labelBbox = label.bbox();
                console.log('stratum ' + strata.getLabel() + ' label bbox:' + labelBbox.width + ', ' + labelBbox.height);
                // add a translucent rectangle in text background we needed to draw the text first to get its dimension
                // then we draw the rectangle and move it before the text to have it in its background (z-order arrangement)
                var wRectRatio = 1.3,
                    hRectRatio = 1.1;
                label.before(nestedStrata.rect(labelBbox.width * wRectRatio, labelBbox.height * hRectRatio).attr({
                    x: labelBbox.x - labelBbox.width * ((wRectRatio - 1) / 2),
                    y: labelBbox.y - labelBbox.height * ((hRectRatio - 1) / 2),
                    rx: 5,
                    ry: 5,
                    'stroke-width': '1',
                    stroke: 'black',
                    fill: "white",
                    "fill-opacity": "0.8"
                }));
                //On retourne le dessin de la strate
                return nestedStrata;
            }
        }, {
            key: 'drawCM',
            value: function drawCM(strata, width, height, draw) {
                var upperStrata;
                if (strata.getIndex() > 0) {
                    upperStrata = this.stratig.getStratas()[strata.getIndex() - 1];
                }

                var lowerStrata = this.stratig.getStratas()[strata.getIndex() + 1];

                //On remplit le fond de la strate avec le même fond que la strate inférieure
                this.fillStrata(draw, lowerStrata, width, height);

                //On dessine ensuite une forme qui permet de cacher une partie de la strate pour donner
                //l'illusion que les triangles s'agrandissent/rapetississent
                if (strata.getCharacteristicsByFamily('cmCorrosionRatioFamily').length > 0) {
                    var ratio = strata.getCharacteristicsByFamily('cmCorrosionRatioFamily')[0].getRealName();
                    ratio = parseInt(ratio.substr(1));
                } else {
                    ratio = 0;
                }

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
                    var path = defs.path(pathString).attr({ fill: 'none' });
                    if (upperStrata.getFirstCharacteristicByFamily('colourFamily', 'realName') == lowerStrata.getFirstCharacteristicByFamily('colourFamily', 'realName')) group.path(pathString).attr({ fill: 'none', 'stroke-width': '1', stroke: 'black' });
                    group.clipWith(path);
                } else {
                    draw.path(pathString).attr({ fill: 'white' });
                }
            }
        }, {
            key: 'fillStrata',
            value: function fillStrata(draw, strata, w, h) {

                //Création d'un groupe pour le contenu du fond de la strate pour pouvoir le réutiliser
                var group = draw.group;

                var height = 100;
                var width = 500;

                if (w != undefined) {
                    height = h;
                } else if (strata.getCharacteristicsByFamily('thicknessFamily').length > 0) {
                    height = this.getThicknesses(strata.getCharacteristicsByFamily('thicknessFamily')[0].getName());
                }

                if (w != undefined) {
                    width = w;
                } else if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
                    width = this.getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
                }

                // Initialisation du POISSON DISK DISTRIBUTION
                var poisson = [];
                //Instance browser
                if (this.window == undefined) {
                    var pds = new poissonDisk.PoissonDiskSampler(width, height);
                }
                //Instance Node.js
                else {
                        var pds = new _poissonDisk.PoissonDiskSampler(width, height);
                    }

                var color = strata.getFirstCharacteristicByFamily('colourFamily', 'realName') || 'white';

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

                var rect = draw.rect(width, height).attr({ fill: color, "shape-rendering": "crispEdges" });

                if (strata.getCharacteristicsByFamily('porosityFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('porosityFamily')[0].getName();

                    switch (char) {
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
                }

                //cprimicrostructure
                if (strata.getCharacteristicsByFamily('cpriMicrostructureFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('cpriMicrostructureFamily')[0].getName();
                    switch (char) {
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
                            poisson.push({ 'min': 13, 'max': 13, 'img': 'scattered2', 'imgw': 27, 'imgh': 27 });
                            break;

                        case "isolatedAggregateMicrostructureCharacteristic":
                            poisson.push({ 'min': 30, 'max': 60, 'img': 'isolated', 'imgw': 55, 'imgh': 27 });
                            break;

                        case "scatteredAggregateMicrostructureCharacteristic":
                            poisson.push({ 'min': 32, 'max': 60, 'img': 'scattered1', 'imgw': 43, 'imgh': 39 });
                            poisson.push({ 'min': 23, 'max': 60, 'img': 'scattered2', 'imgw': 27, 'imgh': 27 });
                            break;
                    }
                }

                //subcprimicrostructure
                if (strata.isSubCharacteristic('eutecticPhaseNoMicrostructureCpri') || strata.isSubCharacteristic('eutecticPhaseCristallineMicrostructureCpri') || strata.isSubCharacteristic('eutecticPhaseIsolatedAggregateMicrostructureCpri') || strata.isSubCharacteristic('eutecticPhaseScatteredAggregateMicrostructureCpri') || strata.isSubCharacteristic('eutecticPhaseAlternatingBandsCpri') || strata.isSubCharacteristic('eutecticPhaseHexagonalNetworkCpri') || strata.isSubCharacteristic('eutecticPhasePseudomorphOfDendriticCpri') || strata.isSubCharacteristic('eutecticPhasePseudomorphOfGranularCpri')) {

                    this.addImage(draw, "../static/micorr/images/c/M/EutheticPhase/M_EutheticPhase_" + height + "x" + width + ".svg", width, height);
                }

                if (strata.isSubCharacteristic('twinLinesNoMicrostructureCpri') || strata.isSubCharacteristic('twinLinesCristallineMicrostructureCpri') || strata.isSubCharacteristic('twinLinesIsolatedAggregateMicrostructureCpri') || strata.isSubCharacteristic('twinLinesScatteredAggregateMicrostructureCpri') || strata.isSubCharacteristic('twinLinesAlternatingBandsCpri') || strata.isSubCharacteristic('twinLinesHexagonalNetworkCpri') || strata.isSubCharacteristic('twinLinesPseudomorphOfDendriticCpri') || strata.isSubCharacteristic('twinLinesPseudomorphOfGranularCpri')) {

                    this.addImage(draw, "../static/micorr/images/c/CP/TwinLines/CP_TwinLinesGrainSmall_" + height + "x" + width + ".svg", width, height);
                }
                if (strata.isSubCharacteristic('inclusionsNoMicrostructureCpri') || strata.isSubCharacteristic('inclusionsCristallineMicrostructureCpri') || strata.isSubCharacteristic('inclusionsIsolatedAggregateMicrostructureCpri') || strata.isSubCharacteristic('inclusionsScatteredAggregateMicrostructureCpri') || strata.isSubCharacteristic('inclusionsAlternatingBandsCpri') || strata.isSubCharacteristic('inclusionsHexagonalNetworkCpri') || strata.isSubCharacteristic('inclusionsPseudomorphOfDendriticCpri') || strata.isSubCharacteristic('inclusionsPseudomorphOfGranularCpri')) {

                    this.addImage(draw, "../static/micorr/images/c/CP/Inclusion/CP_InclusionGrainSmall_" + height + "x" + width + ".svg", width, height);
                }

                //MmicrostructureFamily
                if (strata.getCharacteristicsByFamily('mMicrostructureFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('mMicrostructureFamily')[0].getName();
                    switch (char) {
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
                }

                //SubmMicrostructure
                if (strata.isSubCharacteristic('eutecticPhaseDendritic') || strata.isSubCharacteristic('eutecticPhaseGrainElongated') || strata.isSubCharacteristic('eutecticPhaseGrainLarge') || strata.isSubCharacteristic('eutecticPhaseGrainSmall')) {
                    this.addImage(draw, "../static/micorr/images/c/M/EutheticPhase/M_EutheticPhase_" + height + "x" + width + ".svg", width, height);
                } else if (strata.isSubCharacteristic('eutecticPhaseDeformedDendritic')) {
                    this.addImage(draw, "../static/micorr/images/c/M/EutheticPhase/M_EutheticPhaseDeformedDendrite_" + height + "x" + width + ".svg", width, height);
                }

                if (strata.isSubCharacteristic('twinLinesDendritic') || strata.isSubCharacteristic('twinLinesGrainSmall')) {
                    this.addImage(draw, "../static/micorr/images/c/M/TwinLines/M_TwinLinesGrainSmall_" + height + "x" + width + ".svg", width, height);
                } else if (strata.isSubCharacteristic('twinLinesGrainElongated')) {
                    this.addImage(draw, "../static/micorr/images/c/M/TwinLines/M_TwinLinesGrainElongated_" + height + "x" + width + ".svg", width, height);
                } else if (strata.isSubCharacteristic('twinLinesGrainLarge')) {
                    this.addImage(draw, "../static/micorr/images/c/M/TwinLines/M_TwinLinesGrainLarge_" + height + "x" + width + ".svg", width, height);
                }

                if (strata.isSubCharacteristic('slipLinesDendritic') || strata.isSubCharacteristic('slipLinesGrainSmall')) {
                    this.addImage(draw, "../static/micorr/images/c/M/SlipLines/M_SlipLinesGrainSmall_" + height + "x" + width + ".svg", width, height);
                } else if (strata.isSubCharacteristic('slipLinesGrainElongated')) {
                    this.addImage(draw, "../static/micorr/images/c/M/SlipLines/M_SlipLinesGrainElongated_" + height + "x" + width + ".svg", width, height);
                } else if (strata.isSubCharacteristic('slipLinesGrainLarge')) {
                    this.addImage(draw, "../static/micorr/images/c/M/SlipLines/M_SlipLinesGrainLarge_" + height + "x" + width + ".svg", width, height);
                }

                if (strata.isSubCharacteristic('inclusionsDendritic') || strata.isSubCharacteristic('inclusionsGrainSmall') || strata.isSubCharacteristic('inclusionsGrainElongated')) {
                    this.addImage(draw, "../static/micorr/images/c/M/Inclusion/M_InclusionGrainSmall_" + height + "x" + width + ".svg", width, height);
                } else if (strata.isSubCharacteristic('inclusionsGrainLarge')) {
                    this.addImage(draw, "../static/micorr/images/c/M/Inclusion/M_InclusionGrainLarge_" + height + "x" + width + ".svg", width, height);
                }

                //Fissures
                if (strata.getCharacteristicsByFamily('crackingFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('crackingFamily')[0].getName();
                    switch (char) {
                        case "simpleCracksCharacteristic":
                            this.addImage(draw, "../static/micorr/images/c/CP/Cracking/Simple/CP_CrackingSimpleHorizontale_" + height + "x" + width + ".svg", width, height);
                            break;

                        case "branchedCracksCharacteristic":
                            this.addImage(draw, "../static/micorr/images/c/CP/Cracking/Branched/CP_CrackingBranched_" + height + "x" + width + ".svg", width, height);
                            break;

                        case "networkCracksCharacteristic":
                            this.addImage(draw, "../static/micorr/images/c/CP/Cracking/Network/CP_CrackingNetwork_" + height + "x" + width + ".svg", width, height);
                            break;
                    }
                }

                if (strata.getCharacteristicsByFamily('cohesionFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('cohesionFamily')[0].getName();
                    if (char == 'powderyCharacteristic') {

                        this.addImage(draw, "../static/micorr/images/c/CP/Cohesion/CP_CohesionPowdery_" + height + "x" + width + ".svg", width, height);
                    }
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
        }, {
            key: 'getThicknesses',
            value: function getThicknesses(thickness) {
                if (thickness == "thickCharacteristic") return 150;else if (thickness == "normalThicknessCharacteristic") return 100;else if (thickness == "thinCharacteristic") return 50;else return 100;
            }
        }, {
            key: 'getWidths',
            value: function getWidths(width) {
                if (width == "largeCharacteristic") return 650;else if (width == "normalWidthCharacteristic") return 500;else if (width == "smallCharacteristic") return 300;else return 500;
            }
        }, {
            key: 'drawCustomInterface',
            value: function drawCustomInterface(draw, index, width, height, profile, nb_hop, bottomBackgroundColor, topBackgroundColor, borderWidth, interfaceLineThickness, diffuse, transition) {
                /* Le dessin des interfaces se fait en 3 étapes
                 *  1) Tout d'abord on colorie la zone de dessin avec la couleur topBackground et sans cadre
                 *  2) on dessine la ligne d'interface avec le tableau line = []
                 *  3) on dessine la ligne d'interface accompagnée d'un polygone qui vient faire office de partie inférieure de l'interface et avec la couleur bottombackgroundcolor
                 */

                // Si la couleur des deux strates est noire alors la ligne d'interface est blanche

                var bubbleTransitionSize = 4;
                var y = height / 2;
                var line = [],
                    t = [];
                var nb = nb_hop;
                var x = 0;
                var h_hop = width / nb;
                var rndx = void 0,
                    rndy = void 0;
                var strokeColor = "black";
                if (bottomBackgroundColor == "black" && topBackgroundColor == "black") strokeColor = "white";

                var rect = draw.rect(width, height).attr("shape-rendering", "crispEdges").fill(topBackgroundColor);
                if ((transition == "semiGradualInferiorCharacteristic" || transition == "gradualCharacteristic") && index != 0) {
                    var pds = void 0;
                    //Instance Browser
                    if (this.window == undefined) pds = new poissonDisk.PoissonDiskSampler(width, height);
                    //Instance Node.js
                    else pds = new _poissonDisk.PoissonDiskSampler(width, height);

                    for (var i = 0; i < 50; i++) {
                        pds.createPointsPerso(10, 10, 'none', 0, 0);
                    }for (var _i = 0; _i < pds.pointList.length; _i++) {
                        var point = draw.circle(bubbleTransitionSize);
                        point.x(pds.pointList[_i].x);
                        point.y(pds.pointList[_i].y);
                        point.fill(bottomBackgroundColor);
                    }
                }

                for (var _i2 = 0; _i2 < nb; _i2++) {
                    line.push('M', x, y);
                    t.push('M', x, y);
                    if (profile === "straightCharacteristic") {
                        line.push("L", x + h_hop, y);
                        t.push("L", x + h_hop, y);
                    } else {
                        line.push('Q');
                        t.push('Q');
                        // on utilise les courbes de béziers pour faire des vagues
                        if (profile == "wavyCharacteristic") {
                            var pointx = x + width / nb / 2,
                                pointy = y * (_i2 % 2 ? .5 : 1.5);
                            line.push(pointx, pointy);
                            t.push(pointx, pointy);
                        } else if (profile == "bumpyCharacteristic") {
                            // on fait des bosses avec les courbes de béziers en introduisant des hauteurs aléatoires
                            rndy = this.getRandomInt(0, y);
                            var _pointx = x + width / nb / 2,
                                _pointy = y + rndy * (_i2 % 2 ? -1 : 1);
                            line.push(_pointx, _pointy);
                            t.push(_pointx, _pointy);
                        } else if (profile == "irregularCharacteristic") {
                            // on faire des formes irrégulières avec les courbes de béziers avec des valeurs aléatoires
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

                var path1 = draw.path(line.join(' ')).attr("shape-rendering", profile === "straightCharacteristic" ? "crispEdges" : "auto").fill('none'); //.attr(lineAttrs);
                var path2 = draw.path(t.join(' ')).attr("shape-rendering", "crispEdges").fill(bottomBackgroundColor);

                path1.stroke({ color: strokeColor, width: 5 });
                path2.stroke({ color: bottomBackgroundColor, width: 1 });

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
                    var _pds = void 0;
                    if (this.window == undefined) //Instance Browser
                        _pds = new poissonDisk.PoissonDiskSampler(width, height);else //Instance Node.js
                        _pds = new _poissonDisk.PoissonDiskSampler(width, height);
                    for (var _i3 = 0; _i3 < 50; _i3++) {
                        _pds.createPointsPerso(10, 10, 'none', 0, 0);
                    }for (var _i4 = 0; _i4 < _pds.pointList.length; _i4++) {
                        var _point = draw.circle(bubbleTransitionSize);
                        _point.x(_pds.pointList[_i4].x);
                        _point.y(_pds.pointList[_i4].y);
                        _point.fill(topBackgroundColor);
                    }
                }
            }
        }, {
            key: 'getRandomInt',
            value: function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
        }, {
            key: 'drawalternatingBands',
            value: function drawalternatingBands(draw, nb_hop, nb_lines, width, height) {
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
                        if (i % 2 == 0) t.push(y + height / nb_lines);else t.push(y - height / nb_lines);

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
                    path.stroke({ color: 'grey', width: 1 });
                }
            }
        }, {
            key: 'getDivID',
            value: function getDivID() {
                return this.divID;
            }
        }, {
            key: 'setDivID',
            value: function setDivID(id) {
                this.divID = id;
            }
        }, {
            key: 'setStratig',
            value: function setStratig(stratig) {
                this.stratig = stratig;
            }
        }, {
            key: 'getStratig',
            value: function getStratig() {
                return this.stratig;
            }
        }, {
            key: 'addImage',
            value: function addImage(draw, url, width, height) {
                if (this.window) //node case we embed the images (svg and png) as datauri
                    {
                        url = new Datauri(url).content;
                    }
                var image = draw.image(url);
                image.size(width, height);
                return image;
            }
        }]);

        return GraphGenerationUtil;
    }();

    exports.GraphGenerationUtil = GraphGenerationUtil;
});
//# sourceMappingURL=graphGenerationUtil.js.map
