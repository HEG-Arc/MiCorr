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

    /**
     * Ajoute une strate à la stratigraphie
     * @param strata La strate à ajouter
     */
        addStrata(strata) {
        this.stratas.push(strata);
    }

    /**
     * Supprime une strate de la stratigraphie
     * @param uid
     */
        removeStrata(uid) {

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

}

export{Stratigraphy};