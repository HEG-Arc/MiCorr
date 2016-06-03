(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../business/stratigraphy', '../business/characteristic', '../business/subCharacteristic'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../business/stratigraphy'), require('../business/characteristic'), require('../business/subCharacteristic'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.stratigraphy, global.characteristic, global.subCharacteristic);
        global.graphGenerationUtil = mod.exports;
    }
})(this, function (exports, _stratigraphy, _characteristic, _subCharacteristic) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GraphGenerationUtil = undefined;

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

    let GraphGenerationUtil = function () {
        function GraphGenerationUtil(win, stratig) {
            _classCallCheck(this, GraphGenerationUtil);

            if (win != null) {
                var drawer = require(svg.js)(win);
            }
            this.stratig = stratig;
        }

        /**
         * Cette méthode dessine l'interface de la strate
         * @param strata la strate
         * @param divID la div dans laquelle on veut dessiner l'interface
         */


        _createClass(GraphGenerationUtil, [{
            key: 'drawInterface',
            value: function (_drawInterface) {
                function drawInterface(_x, _x2) {
                    return _drawInterface.apply(this, arguments);
                }

                drawInterface.toString = function () {
                    return _drawInterface.toString();
                };

                return drawInterface;
            }(function (strata, divID) {
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

                var strataWidth = 500;

                if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
                    strataWidth = getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
                }

                var interfaceWidth = strataWidth;

                var draw = SVG(divID).size(interfaceWidth, interfaceHeight);

                var upperInterfaceColor = "white"; // couleur de fond de la partie haute
                var lowerInterfaceColor = "white"; // couleur de fond de la partie basse

                // si on est pas à la première interface alors on change la couleur de fond du haut
                if (index > 0) {
                    if (this.stratig.getStratas()[index - 1].getCharacteristicsByFamily('colourFamily').length > 0) {
                        var color = this.stratig.getStratas()[index - 1].getCharacteristicsByFamily('colourFamily')[0].getRealName();
                        if (color != "" && color != "undefined" && color != "black") {
                            upperInterfaceColor = color;
                        } else if (color == "black") {
                            upperInterfaceColor = '#474747';
                        }
                    }
                }

                if (strata.getCharacteristicsByFamily('colourFamily').length > 0) {
                    var color = strata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
                    if (color != "" && color != "undefined" && color != "black") {
                        lowerInterfaceColor = color;
                    } else if (color == "black") {
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
                    var rect = draw.rect(interfaceWidth, interfaceHeight).attr({ fill: lowerInterfaceColor });
                    var borderPath = draw.path("M0 0L0 " + interfaceHeight + " M" + strataWidth + " " + " 0L" + interfaceWidth + " " + interfaceHeight).fill('none');
                    borderPath.stroke({ color: 'black', width: borderWidth });
                } else if (strata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic') {
                    var rect = draw.rect(interfaceWidth, interfaceHeight).attr({ fill: upperInterfaceColor });
                    var borderPath = draw.path("M0 0L0 " + interfaceHeight + " M" + strataWidth + " " + " 0L" + interfaceWidth + " " + interfaceHeight).fill('none');
                    borderPath.stroke({ color: 'black', width: borderWidth });
                } else {
                    //Si elle est droite on dessine simplement deux rectangles
                    if (profile == 'straightCharacteristic' || profile == '') {
                        var upperRect = draw.rect(interfaceWidth, interfaceHeight).attr({ fill: upperInterfaceColor });
                        var lowerRect = draw.rect(interfaceWidth, interfaceHeight).x(0).y(interfaceHeight / 2).attr({ fill: lowerInterfaceColor });

                        //On dessine la bordure extérieure et la droite qui sépare les strates
                        var borderPath = draw.path("M0 0L0 " + interfaceHeight + " M" + strataWidth + " " + " 0L" + interfaceWidth + " " + interfaceHeight).fill('none');
                        borderPath.stroke({ color: 'black', width: borderWidth });

                        var divisionPath = draw.path("M0 " + interfaceHeight / 2 + "L" + interfaceWidth + " " + interfaceHeight / 2).fill('none');
                        divisionPath.stroke({ color: 'black', width: divisionLineWidth });
                    } else if (profile == 'wavyCharacteristic') {
                        drawInterface(draw, index, interfaceWidth, interfaceHeight, 'wavy', 8, lowerInterfaceColor, upperInterfaceColor, borderWidth, divisionLineWidth, diffuse, transition);
                    } else if (profile == 'bumpyCharacteristic') {
                        drawInterface(draw, index, interfaceWidth, interfaceHeight, 'bumpy', 20, lowerInterfaceColor, upperInterfaceColor, borderWidth, divisionLineWidth, diffuse, transition);
                    } else if (profile == 'irregularCharacteristic') {
                        drawInterface(draw, index, interfaceWidth, interfaceHeight, 'irregular', 30, lowerInterfaceColor, upperInterfaceColor, borderWidth, divisionLineWidth, diffuse, transition);
                    }
                }
            })
        }, {
            key: 'drawStrata',
            value: function drawStrata(strata, divID) {

                var height = 100;
                var width = 500;
                if (strata.getCharacteristicsByFamily('thicknessFamily').length > 0) {
                    height = getThicknesses(strata.getCharacteristicsByFamily('thicknessFamily')[0].getName());
                }

                if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
                    width = getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
                }

                document.getElementById(divID).style.height = height + "px";
                var borderWidth = 8;

                var draw = SVG(divID).size(width, height);
                this.fillStrata(draw, strata);

                //Strate CM
                if (strata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'cmCharacteristic') {
                    if (strata.getIndex() < this.stratig.getStratas().length - 1) {
                        var lowerStrata = this.stratig.getStratas()[strata.getIndex() + 1];
                        if (lowerStrata.getCharacteristicsByFamily('natureFamily')[0].getName() == 'mCharacteristic') {
                            this.drawCM(strata, width, height, draw);
                        }
                    }
                }

                //Dessin des bords
                var leftBorder = draw.path("M0 0L0 " + height).fill('none');
                var rightBorder = draw.path("M" + width + " 0L" + width + " " + height).fill('none');
                leftBorder.stroke({ color: 'black', width: borderWidth });
                rightBorder.stroke({ color: 'black', width: borderWidth });

                //Dessin du bord inférieur si c'est la dernière strate
                var index = strata.getIndex();
                var lastIndex = this.stratig.getStratas().length;
                if (strata.getIndex() == this.stratig.getStratas().length - 1) {
                    var bottomBorder = draw.path("M0 " + height + "L" + width + " " + height).fill('none');
                    bottomBorder.stroke({ color: 'black', width: borderWidth });
                }
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
                this.fillStrata(draw, lowerStrata);

                //On dessine ensuite une forme qui permet de cacher une partie de la strate pour donner
                //l'illusion que les triangles s'agrandissent/rapetississent
                var ratio = strata.getCharacteristicsByFamily('cmCorrosionRatioFamily')[0].getRealName();
                ratio = parseInt(ratio.substr(1));

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
                var upperStrataColor = 'white';
                if (upperStrata != undefined) {

                    if (upperStrata.getCharacteristicsByFamily('colourFamily').length > 0) {
                        upperStrataColor = upperStrata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
                    }
                }
                draw.path(pathString).attr({ fill: upperStrataColor });
            }
        }, {
            key: 'fillStrata',
            value: function fillStrata(draw, strata) {

                var height = 100;
                var width = 500;
                if (strata.getCharacteristicsByFamily('thicknessFamily').length > 0) {
                    height = getThicknesses(strata.getCharacteristicsByFamily('thicknessFamily')[0].getName());
                }

                if (strata.getCharacteristicsByFamily('widthFamily').length > 0) {
                    width = getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
                }

                // Initialisation du POISSON DISK DISTRIBUTION
                var poisson = [];
                var pds = new PoissonDiskSampler(width, height);

                var color = 'white';
                if (strata.getCharacteristicsByFamily('colourFamily').length > 0) {
                    color = strata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
                }

                if (color == 'black') {
                    color = '#474747';
                }

                var rect = draw.rect(width, height).attr({ fill: color });

                if (strata.getCharacteristicsByFamily('porosityFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('porosityFamily')[0].getName();
                    var img = 'porosity';
                    switch (char) {
                        case 'slightlyPorousCharacteristic':
                            poisson.push({ 'min': 20, 'max': 90, 'img': img, 'imgw': 5, 'imgh': 5 });
                            break;
                        case 'porousCharacteristic':
                            poisson.push({ 'min': 20, 'max': 40, 'img': img, 'imgw': 5, 'imgh': 5 });
                            break;
                        case 'highlyPorousCharacteristic':
                            poisson.push({ 'min': 20, 'max': 20, 'img': img, 'imgw': 5, 'imgh': 5 });
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
                            drawalternatingBands(draw, 6, 10, width, height);
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

                    poisson.push({ 'min': 40, 'max': 60, 'img': 'eutetic1', 'imgw': 80, 'imgh': 83 });
                    poisson.push({ 'min': 30, 'max': 50, 'img': 'eutetic2', 'imgw': 57, 'imgh': 60 });
                    poisson.push({ 'min': 36, 'max': 45, 'img': 'eutetic3', 'imgw': 71, 'imgh': 44 });
                }
                if (strata.isSubCharacteristic('twinLinesNoMicrostructureCpri') || strata.isSubCharacteristic('twinLinesCristallineMicrostructureCpri') || strata.isSubCharacteristic('twinLinesIsolatedAggregateMicrostructureCpri') || strata.isSubCharacteristic('twinLinesScatteredAggregateMicrostructureCpri') || strata.isSubCharacteristic('twinLinesAlternatingBandsCpri') || strata.isSubCharacteristic('twinLinesHexagonalNetworkCpri') || strata.isSubCharacteristic('twinLinesPseudomorphOfDendriticCpri') || strata.isSubCharacteristic('twinLinesPseudomorphOfGranularCpri')) {

                    var image = draw.image("../static/micorr/images/c/macles/Macles_" + height + "x" + width + ".png");
                    image.size(width, height);
                }
                if (strata.isSubCharacteristic('inclusionsNoMicrostructureCpri') || strata.isSubCharacteristic('inclusionsCristallineMicrostructureCpri') || strata.isSubCharacteristic('inclusionsIsolatedAggregateMicrostructureCpri') || strata.isSubCharacteristic('inclusionsScatteredAggregateMicrostructureCpri') || strata.isSubCharacteristic('inclusionsAlternatingBandsCpri') || strata.isSubCharacteristic('inclusionsHexagonalNetworkCpri') || strata.isSubCharacteristic('inclusionsPseudomorphOfDendriticCpri') || strata.isSubCharacteristic('inclusionsPseudomorphOfGranularCpri')) {

                    var image = draw.image("../static/micorr/images/c/inclusion/Inclusions_" + height + "x" + width + ".png");
                    image.size(width, height);
                }

                //MmicrostructureFamily
                if (strata.getCharacteristicsByFamily('mMicrostructureFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('mMicrostructureFamily')[0].getName();
                    if (char == "dendriticCharacteristic") {
                        var image = draw.image("../static/micorr/images/c/dendrites/dendritesmetal_" + height + "x" + width + ".png");
                        image.size(width, height);
                    } else if (char == "grainSmallCharacteristic") {
                        var image = draw.image("../static/micorr/images/c/grains/Grains_" + height + "x" + width + ".png");
                        image.size(width, height);
                    } else if (char == "grainLargeCharacteristic") {
                        var image = draw.image("../static/micorr/images/c/GrainLarge/GrainLarge_" + height + "x" + width + ".png");
                        image.size(width, height);
                    } else if (char == "grainElongatedCharacteristic") {
                        var image = draw.image("../static/micorr/images/c/ElongatedGrain/ElongatedGrain_" + height + "x" + width + ".png");
                        image.size(width, height);
                    }
                }

                //SubmMicrostructure
                if (strata.isSubCharacteristic('eutecticPhaseDendritic') || strata.isSubCharacteristic('eutecticPhaseGrainElongated') || strata.isSubCharacteristic('eutecticPhaseGrainLarge') || strata.isSubCharacteristic('eutecticPhaseGrainSmall')) {
                    poisson.push({ 'min': 40, 'max': 60, 'img': 'eutetic1', 'imgw': 80, 'imgh': 83 });
                    poisson.push({ 'min': 30, 'max': 50, 'img': 'eutetic2', 'imgw': 57, 'imgh': 60 });
                    poisson.push({ 'min': 36, 'max': 45, 'img': 'eutetic3', 'imgw': 71, 'imgh': 44 });
                }
                if (strata.isSubCharacteristic('twinLinesDendritic') || strata.isSubCharacteristic('twinLinesGrainElongated') || strata.isSubCharacteristic('twinLinesGrainLarge') || strata.isSubCharacteristic('twinLinesGrainSmall')) {
                    var image = draw.image("../static/micorr/images/c/macles/Macles_" + height + "x" + width + ".png");
                    image.size(width, height);
                }
                if (strata.isSubCharacteristic('inclusionsDendritic') || strata.isSubCharacteristic('inclusionsGrainElongated') || strata.isSubCharacteristic('inclusionsGrainLarge') || strata.isSubCharacteristic('inclusionsGrainSmall')) {
                    var image = draw.image("../static/micorr/images/c/inclusion/Inclusions_" + height + "x" + width + ".png");
                    image.size(width, height);
                }

                if (strata.isSubCharacteristic('')) {}

                //Fissures
                if (strata.getCharacteristicsByFamily('crackingFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('crackingFamily')[0].getName();
                    switch (char) {
                        case "simpleCracksCharacteristic":
                            var image = draw.image("../static/micorr/images/c/cracking/Simple/Horizontal/CP_CrackingSimple_" + height + "x" + width + ".png");
                            image.size(width, height);
                            break;

                        case "branchedCracksCharacteristic":
                            var image = draw.image("../static/micorr/images/c/cracking/Branched/CP_CrackingBranched_" + height + "x" + width + ".png");
                            image.size(width, height);
                            break;

                        case "networkCracksCharacteristic":
                            var image = draw.image("../static/micorr/images/c/cracking/Network/CP_CrackingNetwork_" + height + "x" + width + ".png");
                            image.size(width, height);
                            break;
                    }
                }

                if (strata.getCharacteristicsByFamily('cohesionFamily').length > 0) {
                    var char = strata.getCharacteristicsByFamily('cohesionFamily')[0].getName();
                    if (char == 'powderyCharacteristic') {
                        poisson.push({ 'min': 8, 'max': 15, 'img': 'powder', 'imgw': 15, 'imgh': 14 });
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
        }]);

        return GraphGenerationUtil;
    }();

    exports.GraphGenerationUtil = GraphGenerationUtil;
});
