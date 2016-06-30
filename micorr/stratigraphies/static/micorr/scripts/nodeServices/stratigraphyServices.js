/*
 Ce fichier contient tous les services liés aux stratigraphies pour Node.js
 */
var request = require("request");
var Stratigraphy = require('../business/stratigraphy').Stratigraphy;
var Strata = require('../business/strata').Strata;
var Characteristic = require('../business/characteristic').Characteristic;
var SubCharacteristic = require('../business/subCharacteristic').SubCharacteristic;
var GraphGenerationUtil = require('../utils/graphGenerationUtil').GraphGenerationUtil;

var url = "http://localhost/micorr";

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
            //Boucle sur les strates
            for (var i = 0; i < jsonData.length; i++) {
                var strata = new Strata();
                var currentStrata = jsonData[i];
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
                for (var j = 0; j < currentStrata.interfaces.characteristics.length; j++) {
                    var currentCharacteristic = currentStrata.interfaces.characteristics[j];
                    var char = new Characteristic();
                    char.setName(currentCharacteristic.name);
                    char.setFamily(currentCharacteristic.family);
                    char.setInterface(true);

                    //Si c'est une caracteristique d'une de ces familles on peut en ajouter plusieurs
                    if (char.getFamily() == "cpcompositionextensionFamily" || char.getFamily() == "cprimicrostructureaggregatecompositionextensionFamily") {
                        strata.addCharacteristic(char)
                    }
                    else {
                        //Sinon, il n'y en a que une donc on la remplace
                        strata.replaceCharacteristic(char);
                    }
                }

                //Boucle sur les sous characteristiques
                for (var j = 0; j < currentStrata.subcharacteristics.length; j++) {
                    var currentSubCharacteristic = currentStrata.subcharacteristics[j];
                    var subCharacteristic = new SubCharacteristic();
                    subCharacteristic.setName(currentSubCharacteristic.real_name);
                    subCharacteristic.setUid(currentSubCharacteristic.name);                        
                    strata.addSubCharacteristic(subCharacteristic);
                }
                stratigraphy.addStrata(strata);

            }
            return callback(stratigraphy);
        });
    },

    drawStratigraphy: function (stratigraphy, width, callback) {

        //drawer.drawStrata(stratigraphy.getStratas()[0], 'drawing');
        var jsdom = require("jsdom").jsdom;
        var document = jsdom("<div id='drawing'></div><div id='result'></div><div id='exp'><div/>")
        var window = document.defaultView;

        var drawer = new GraphGenerationUtil(window, stratigraphy);
        if (width == undefined) {
            width = 200;
        }
        var result = drawer.drawStratigraphy(width);
        console.log('stratigraphy drawed')
        return callback(result);
    },



        /*
         var svg = new Rsvg(svgdata);

         var fileContent = svg.render({
         format: format,
         width: svg.width,
         height: svg.height
         }).data;


         console.log('error while drawing');

         return callback(fileContent);
         }
         */

    };
