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

        if (strata.getCharacteristicsByFamily('colourFamily').length > 0) {
            color = strata.getCharacteristicsByFamily('colourFamily')[0].getRealName();
        }


        var draw = SVG(this.divID).size(width, height);
        var rect = draw.rect(width, height).attr({ fill: color });


        if (strata.getCharacteristicsByFamily('porosityFamily').length > 0) {
            var char = strata.getCharacteristicsByFamily('porosityFamily')[0].getName();

            //TODO: Dessin des points pour représenter la porosité
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
                    //TODO: PoissonDisk
                    break;

                case "isolatedAggregateMicrostructureCharacteristic":
                    //TODO: PoissonDisk
                    break;

                case "scatteredAggregateMicrostructureCharacteristic":
                    //TODO: PoissonDisk
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

        if(strata.getCharacteristicsByFamily('crackingFamily').length > 0){
            var char = strata.getCharacteristicsByFamily('crackingFamily')[0].getName();
            switch (char){
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

        if(strata.getCharacteristicsByFamily('cohesionFamily').length > 0){
            var char = getCharacteristicsByFamily('cohesionFamily')[0].getName();
            if(char == 'powderyCharacteristic'){
                //TODO: PoissonDisk
            }
        }

        getDivID()
        {
            return this.divID;
        }

        setDivID(id)
        {
            this.divID = id;
        }
    }
}


export {
    GraphGenerationUtil
    }