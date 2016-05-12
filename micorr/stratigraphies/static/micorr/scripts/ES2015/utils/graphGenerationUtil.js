/**
 * Created by thierry on 27.04.16.
 */

import{Stratigraphy} from '../business/stratigraphy';
import{Strata} from '../business/stratigraphy';
import{Characteristic} from '../business/characteristic';
import{subCharacteristic} from '../business/subCharacteristic';


class GraphGenerationUtil {
    constructor(win, divID) {
        if (win != null) {
            var drawer = require(svg.js)(win)
        }
        this.divID = divID;
    }

    /**
     * Cette méthode permet de dessiner une strate
     * @param strata
     */
        drawStrata(strata) {


        var height = getThicknesses(strata.getCharacteristicsByFamily('thicknessFamily')[0].getName());
        var width = getWidths(strata.getCharacteristicsByFamily('widthFamily')[0].getName());
        var color = 'white';

        // Initialisation du POISSON DISK DISTRIBUTION
        var poisson = [];
        var pds = new PoissonDiskSampler(width, height);

        if (strata.getCharacteristicsByFamily('colourFamily').length > 0) {
            color = strata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
        }

        if (color == 'black'){
            color = '#34282C';
        }


        var draw = SVG(this.divID).size(width, height);
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
                    drawalternatingBands(draw, 6, 10, width, height);
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
            else if (char == "grainSmallCharacteristic"
                || char == "grainElongatedCharacteristic") {
                var image = draw.image("../static/micorr/images/c/grains/Grains_" + height + "x" + width + ".png");
                image.size(width, height);
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

        if (strata.getCharacteristicsByFamily('crackingFamily').length > 0) {
            var char = strata.getCharacteristicsByFamily('crackingFamily')[0].getName();
            switch (char) {
                case "simpleCracksCharacteristic" :
                    drawCracking(draw, width, height, 1, 0);
                    break;

                case "branchedCracksCharacteristic" :
                    drawCracking(draw, width, height, 1, 1);
                    break;

                case "networkCracksCharacteristic" :
                    drawCracking(draw, width, height, 2, 5);
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

    getDivID() {
        return this.divID;
    }

    setDivID(id) {
        this.divID = id;
    }
}


export {
    GraphGenerationUtil
    }