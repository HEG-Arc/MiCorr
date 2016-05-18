/**
 * Created by thierry on 27.04.16.
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 */
import {Characteristic} from './characteristic';
import {SubCharacteristic} from './subCharacteristic';

class Strata {
    constructor() {
        this.characteristics = [];
        this.subCharacteristics = [];
    }


    /**
     * Retourne les characteristiques correspondant à la famille donnée en paramètre
     * @param family la famille recherchée
     * @returns les characteristiques correspondante
     */
        getCharacteristicsByFamily(family) {
        var charact = [];
        for (var i = 0; i < this.characteristics.length; i++) {
            if (this.characteristics[i].getFamily() == family) {
                charact.push(this.characteristics[i]);
            }
        }
        return charact;
    }


    isFamily(family){
        var exists = false;
        if(getCharacteristicsByFamily(family).length > 0){
            exists = true;
        }
        return exists;
    }
    /**
     * Cette méthoe indique si une sous-caracterisitique existe dans une strate.
     * @param le nom de la sous caracteristique à vérifier
     * @returns boolean indiquant si la sous-caracteristique existe
     */
    isSubCharacteristic(name) {
        var exists = false;
        var i = 0;
        while (exists == false && i < this.subCharacteristics.length) {
            if (this.subCharacteristics[i].getName() == name) {
                exists = true;
            }
            i++;
        }
        return exists;
    }

    addSubCharacteristic(subCharacteristic) {
        this.subCharacteristics.push(subCharacteristic);
    }

    addCharacteristic(characteristic) {
        this.characteristics.push(characteristic);
    }

    removeCharacteristic(uid) {

    }

    removeSubCharacteristic(uid) {

    }

    getSubCharacteristics() {
        return this.subCharacteristics;
    }

    getCharacteristics() {
        return this.characteristics;
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

    getIndex(){
        return this.index;
    }

    setIndex(index){
        this.index = index;
    }

}

export{Strata};