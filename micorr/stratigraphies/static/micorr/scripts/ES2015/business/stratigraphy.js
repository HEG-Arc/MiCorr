/**
 * Created by thierry on 27.04.16.
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 */

import {Strata} from './strata';

class Stratigraphy {


    constructor() {
        //contient toutes les strates de la stratigraphie
        this.stratas = [];
    }

    toJson(){
        var jsonStratigraphy = {'artefact': this.getArtefact(), 'stratigraphy': this.getUid(), 'stratas': []};

        for(var i = 0; i < this.stratas.length; i++){
            jsonStratigraphy.stratas.push(this.stratas[i].toJson());
        }

        return jsonStratigraphy;
    }
    /**
     * Ajoute une strate à la stratigraphie
     * @param strata La strate à ajouter
     */
        addStrata(strata) {
        this.stratas.push(strata);
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getUid() {
        return this.uid;
    }

    setUid(uid) {
        this.uid = uid;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getStratas(){
        return this.stratas;
    }
    setArtefact(artefact){
        this.artefact = artefact;
    }
    getArtefact(){
        return this.artefact;
    }


}

export{Stratigraphy};