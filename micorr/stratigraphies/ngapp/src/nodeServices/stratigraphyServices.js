/**
 * Created by Thierry Hubmann
 * Ce fichier contient tous les services liés aux stratigraphies pour Node.js
 */
var request = require("request");
var Stratigraphy = require('../business/stratigraphy').Stratigraphy;
var Strata = require('../business/strata').Strata;
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
        stratigraphy.setDescription(name);
        //On récupère le json retourné par le service
        request(url + "/json/getstratigraphydetails/" + name, function (error, response, body) {
            //On parse le JSON pour récupérer le contenu
            var jsonData = JSON.parse(body);
            console.log(jsonData);
            //Boucle sur les strates
            for (var i = 0; i < jsonData.strata.length; i++) {
                var strata = new Strata();
                var currentStrata = jsonData.strata[i];
                strata.setUid(currentStrata.name);
                strata.setIndex(i);
                //Boucle sur les characteristiques
                for (var j = 0; j < currentStrata.characteristics.length; j++) {
                    var currentCharacteristic = currentStrata.characteristics[j];
                    var characteristic = new Characteristic();
                    characteristic.setName(currentCharacteristic.name);
                    characteristic.setRealName(currentCharacteristic.real_name);
                    characteristic.setFamily(currentCharacteristic.family);
                    strata.addCharacteristic(characteristic);
                }

                //Boucle sur les characteristiques d'interface
                if (currentStrata.interfaces && currentStrata.interfaces.characteristics)
                    for (var j = 0; j < currentStrata.interfaces.characteristics.length; j++) {
                        var currentCharacteristic = currentStrata.interfaces.characteristics[j];
                        var char = new Characteristic();
                        char.setName(currentCharacteristic.name);
                        char.setFamily(currentCharacteristic.family);
                        char.setInterface(true);
                        strata.replaceCharacteristic(char);
                    }

                //Boucle sur les sous characteristiques
                for (var j = 0; j < currentStrata.subcharacteristics.length; j++) {
                    var currentSubCharacteristic = currentStrata.subcharacteristics[j];
                    var subCharacteristic = new SubCharacteristic();
                    subCharacteristic.setName(currentSubCharacteristic.real_name);
                    subCharacteristic.setUid(currentSubCharacteristic.name);
                    strata.addSubCharacteristic(subCharacteristic);
                }
                stratigraphy.addStratum(strata);

            }
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
