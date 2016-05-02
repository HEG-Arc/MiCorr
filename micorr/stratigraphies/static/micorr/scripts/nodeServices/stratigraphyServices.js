/*
 Ce fichier contient tous les services liés aux stratigraphies pour Node.js
 */
var request = require("request");
var Stratigraphy = require('../business/stratigraphy').Stratigraphy
var Strata = require('../business/strata').Strata
var Characteristic = require('../business/characteristic').Characteristic

var url = "http://dev.micorr.org/micorr";

module.exports = {

    /**
     * Retourne une instance de Stratigraphy en spécifiant son nom
     * @param name le nom de la stratigraphie
     * return une instance de la stratigraphie
     */
    getStratigraphyByName: function (name) {
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
                //Boucle sur les characteristiques
                for(var j = 0; j < currentStrata.characteristics.length; j++){
                    var currentCharacteristic = currentStrata.characteristics[j];
                    var characteristic = new Characteristic();
                    characteristic.setName(currentCharacteristic.name);
                    characteristic.setFamily(currentCharacteristic.family);
                    //il faut encore récupérer les sous characteristiques
                    strata.addCharacteristic(characteristic);
                }
                stratigraphy.addStrata(strata);
            }
            return true;
        });

    }
};