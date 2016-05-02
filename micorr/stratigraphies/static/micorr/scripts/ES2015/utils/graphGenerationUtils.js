/**
 * Created by thierry on 27.04.16.
 */

import{Stratigraphy} from '../business/stratigraphy';
import{Strata} from '../business/stratigraphy';
import{Characteristic} from '../business/characteristic';
import{subCharacteristic} from '../business/subCharacteristic';


class GraphGenerationUtil{
    constructor(win){
        if(win != null){
            var drawer = require(svg.js)(win)
        }
        else{
            var drawer = require(svg.js)
        }
        this.canvas = SVG('drawing');
    }

    drawStratigraphy(stratigraphy){

    }

    drawStrata(){

    }
}

export{GraphGenerationUtil}