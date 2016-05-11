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
                    //TODO: Courbe de Beziers
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
        //TODO: Sous characteristique
        /*
         if (strata.getCharacteristicsByFamily('subcprimicrostructureFamily').length > 0) {
         for (var i = 0; i < strata.getCharacteristicsByFamily('subcprimicrostructureFamily'); i++) {
         var char = strata.getCharacteristicsByFamily('subcprimicrostructureFamily')[i].getName();
         if (char == "eutecticPhaseNoMicrostructureCpri" ||
         char == "eutecticPhaseCristallineMicrostructureCpri" ||
         char == "eutecticPhaseIsolatedAggregateMicrostructureCpri" ||
         char == "eutecticPhaseScatteredAggregateMicrostructureCpri" ||
         char == "eutecticPhaseAlternatingBandsCpri" ||
         char == "eutecticPhaseHexagonalNetworkCpri" ||
         char == "eutecticPhasePseudomorphOfDendriticCpri" ||
         char == "eutecticPhasePseudomorphOfGranularCpri") {
         //TODO: PoissonDisk
         }
         else if (char == "twinLinesNoMicrostructureCpri" ||
         char == "twinLinesCristallineMicrostructureCpri" ||
         char == "twinLinesIsolatedAggregateMicrostructureCpri" ||
         char == "twinLinesScatteredAggregateMicrostructureCpri" ||
         char == "twinLinesAlternatingBandsCpri" ||
         char == "twinLinesHexagonalNetworkCpri" ||
         char == "twinLinesPseudomorphOfDendriticCpri" ||
         char == "twinLinesPseudomorphOfGranularCpri") {
         var image = draw.image("../static/micorr/images/c/macles/Macles_" + height + "x" + width + ".png");
         image.size(width, height)
         }
         else if (char == "inclusionsNoMicrostructureCpri" ||
         char == "inclusionsCristallineMicrostructureCpri" ||
         char == "inclusionsIsolatedAggregateMicrostructureCpri" ||
         char == "inclusionsScatteredAggregateMicrostructureCpri" ||
         char == "inclusionsAlternatingBandsCpri" ||
         char == "inclusionsHexagonalNetworkCpri" ||
         char == "inclusionsPseudomorphOfDendriticCpri" ||
         char == "inclusionsPseudomorphOfGranularCpri") {
         var image = draw.image("../static/micorr/images/c/inclusion/Inclusions_" + height + "x" + width + ".png");
         image.size(width, height)
         }
         }
         }
         */
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

        /*
         //SubmMicrostructureFamily
         //TODO: Sous-characteristique
         if (strata.getCharacteristicsByFamily('submMicrostructureFamily').length > 0) {
         for (var i = 0; i < strata.getCharacteristicsByFamily('submMicrostructureFamily'); i++) {
         var char = strata.getCharacteristicsByFamily('submMicrostructureFamily')[i].getName();
         if (char == "eutecticPhaseDendritic" ||
         char == "eutecticPhaseGrainElongated" ||
         char == "eutecticPhaseGrainLarge" ||
         char == "eutecticPhaseGrainSmall") {
         //TODO: PoissonDisk
         }
         else if (char == "twinLinesDendritic" ||
         char == "twinLinesGrainElongated" ||
         char == "twinLinesGrainLarge" ||
         char == "twinLinesGrainSmall") {
         var image = draw.image("../static/micorr/images/c/macles/Macles_" + height + "x" + width + ".png");
         image.size(width, height);
         }

         else if (char == "inclusionsDendritic" ||
         char == "inclusionsGrainElongated" ||
         char == "inclusionsGrainLarge" ||
         char == "inclusionsGrainSmall") {
         var image = draw.image("../static/micorr/images/c/inclusion/Inclusions_" + height + "x" + width + ".png");
         image.size(width, height);
         }
         }
         }
         */

        if (strata.getCharacteristicsByFamily('crackingFamily').length > 0) {
            var char = strata.getCharacteristicsByFamily('crackingFamily')[0].getName();
            switch (char) {
                case "simpleCracksCharacteristic" :
                    //TODO: Courbe de beziers
                    break;

                case "branchedCracksCharacteristic" :
                    //TODO: Courbe de beziers
                    break;

                case "networkCracksCharacteristic" :
                    //TODO: Courbe de beziers
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