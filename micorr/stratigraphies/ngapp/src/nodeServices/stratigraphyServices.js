/**
 * Created by Thierry Hubmann
 * Ce fichier contient tous les services liés aux stratigraphies pour Node.js
 */
var request = require("request");
var Stratigraphy = require('../business/stratigraphy').Stratigraphy;
import {Strata} from "../business/strata";
var Characteristic = require('../business/characteristic').Characteristic;
var SubCharacteristic = require('../business/subCharacteristic').SubCharacteristic;
var GraphGenerationUtil = require('../utils/graphGenerationUtil').GraphGenerationUtil;

//import {GraphGenerationUtil} from "../utils/graphGenerationUtil";

var url = process.env.DJANGO_SERVICE_URL || "http://django:5000/micorr";
console.log('stratigrapyService.js: DJANGO_SERVICE_URL='+url);

module.exports = {

    /**
     * Retourne une instance de Stratigraphy en spécifiant son nom
     * @param name le nom de la stratigraphie
     * return une instance de la stratigraphie
     */
    getStratigraphyByName: function (name, callback) {
        var stratigraphy = new Stratigraphy();
        request(url + "/json/getstratigraphydetails/" + name, function (error, response, body) {
            let data = JSON.parse(body);
            stratigraphy.load(data,name);
            return callback(stratigraphy);
        });
    },

    /**
     * Dessine la stratigraphie et retourne le SVG généré
     * @param stratigraphy
     * @param width
     * @param callback
     * @returns le SVG généré
     */
    drawStratigraphy: function (stratigraphy, width, callback) {
        // require('svgdom') returns a window with a document and an svg root node that'll be used by svg.js
        // see nodeUtils.js getDrawer
        const window   = require('svgdom');
        var drawer = new GraphGenerationUtil(window, stratigraphy);
        if (width == undefined) {
            width = 200;
        }
        else
            width = parseInt(width);
        var result = drawer.drawStratigraphy(width);
        console.log('stratigraphy drawn')
        return callback(result);
    }

    };
