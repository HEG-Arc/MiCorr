/**
 * Created by thierry on 27.04.16.
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 */
import {Characteristic} from './characteristic';
import {SubCharacteristic} from './subCharacteristic';

class Strata {

    constructor(nature) {
        this.nature = nature;
        this.dependencies = new Array();
        this.characteristics = new Array();
        this.subCharacteristics = new Array();
        this.init();
    }

    toJson(){
        var jsonStrata = [];
        var jsonChar = [];
        var jsonInterface = [];

        var jsonStrata = {'name': this.getUid(), 'characteristics': [], 'interfaces': []};

        //On récupère les caractéristiques
        for(var i = 0; i < this.characteristics.length; i++){
            if(!this.characteristics[i].isInterface()){
                jsonStrata.characteristics.push({'name' : this.characteristics[i].getName()});
            }
        }
        //On récupère les sous caractéristiques
        for(var i = 0; i < this.subCharacteristics.length; i++){
                jsonStrata.characteristics.push({'name' : this.subCharacteristics[i].getName()});
        }

        //On récupère les caractéristiques d'interface
        for(var i = 0; i < this.characteristics.length; i++){
            if(this.characteristics[i].isInterface()){
                jsonStrata.interfaces.push({'name' : this.characteristics[i].getName()});
            }
        }

        return jsonStrata;

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



    /**
     * Retourne les sous caractéristiques de la famille en paramètre
     * @param family
     * @returns {Array} liste de sous caractéristiques
     */
    getSubCharacteristicsByFamily(family) {
        var charact = [];
        for (var i = 0; i < this.subCharacteristics.length; i++) {
            if (this.subCharacteristics[i].getFamily() == family) {
                charact.push(this.subCharacteristics[i]);
            }
        }
        return charact;
    }

    /**
     * Supprime toutes les characteristiques d'une famille
     * @param family
     */
    clearCharacteristicsFromFamily(family){

        for (var i = 0; i < this.characteristics.length; i++) {
            if (this.characteristics[i].getFamily() == family) {
                this.characteristics.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * Supprime toutes les sous characteristiques d'une famille
     * @param family
     */
    clearSubCharacteristicsFromFamily(family){
        for (var i = 0; i < this.subCharacteristics.length; i++) {
            if (this.subCharacteristics[i].getFamily() == family) {
                this.subCharacteristics.splice(i, 1);
                i--;
            }
        }
    }

    isFamily(family) {
        var exists = false;
        if (getCharacteristicsByFamily(family).length > 0) {
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

    /**
     * Ajoute une sous caractéristique sans vérifier si il en existe déjà une pour cette famille
     * @param subCharacteristic
     */
        addSubCharacteristic(subCharacteristic) {
        this.subCharacteristics.push(subCharacteristic);
    }

    /**
     * Remplace une sous caractéristique de la famille de celle donnée en paramètre
     * @param subCharacteristic
     */
        replaceSubCharacteristic(subCharacteristic) {
        var found = false;
        var i = 0;

        while (!found && i < this.subCharacteristics.length) {
            if (subCharacteristic.family == this.subCharacteristics[i].family) {
                found = true;
                this.subCharacteristics[i] = subCharacteristic;
            }
            i++;
        }
        if (!found) {
            this.subCharacteristics.push(subCharacteristic);
        }
    }

    addCharacteristic(characteristic) {
        this.characteristics.push(characteristic);
    }

    replaceCharacteristic(characteristic) {
        var found = false;
        var i = 0;

        while (!found && i < this.characteristics.length) {
            if (characteristic.family == this.characteristics[i].family) {
                found = true;
                this.characteristics[i] = characteristic;
            }
            i++;
        }
        if (!found) {
            this.characteristics.push(characteristic);
        }

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


    getNature() {
        return this.nature;
    }

    setNature(nature) {
        this.nature = nature;
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

    getIndex() {
        return this.index;
    }

    setIndex(index) {
        this.index = index;
    }

    findDependency(dep) {
        for (var i = 0; i < this.dependencies.length; i++) {
            if (this.dependencies[i] == dep)
                return true;
        }
        return false;
    }

    /**
     * Cette méthode initialise la strate en ajoutant à un tableau les propriétés modifiables
     * et en lui attribuant des valeurs par défaut
     */
        init() {

        var profileChar = new characteristic.Characteristic();
        profileChar.setName('straightCharacteristic');
        profileChar.setRealName('straight');
        profileChar.setFamily('interfaceProfileFamily');
        profileChar.setInterface(true);
        this.replaceCharacteristic(profileChar);


        this.dependencies.push('thicknessFamily');
        this.dependencies.push('widthFamily');
        this.dependencies.push('continuityFamily');
        this.dependencies.push('directionFamily');
        this.dependencies.push('interfaceprofileFamily');

        if (this.nature == "Soil") {

            this.dependencies.push('colourFamily');
            this.dependencies.push('brightnessFamily');
            this.dependencies.push('opacityFamily');
            this.dependencies.push('magnetismFamily');
            this.dependencies.push('porosityFamily');
            this.dependencies.push('cohesionFamily');
            this.dependencies.push('hardnessFamily');
            this.dependencies.push('crackingFamily');
            this.dependencies.push('scompositionFamily');
            this.dependencies.push('interfacetransitionFamily');
            this.dependencies.push('interfaceroughnessFamily');
            this.dependencies.push('interfaceadherenceFamily');
        }

        if (this.nature == "Non-Metallic material") {
            this.dependencies.push('colourFamily');
            this.dependencies.push('brightnessFamily');
            this.dependencies.push('opacityFamily');
            this.dependencies.push('magnetismFamily');
            this.dependencies.push('porosityFamily');
            this.dependencies.push('cohesionFamily');
            this.dependencies.push('hardnessFamily');
            this.dependencies.push('crackingFamily');
            this.dependencies.push('nmmcompositionFamily');
            this.dependencies.push('interfacetransitionFamily');
            this.dependencies.push('interfaceroughnessFamily');
            this.dependencies.push('interfaceadherenceFamily');
        }


        if (this.nature == "Deposit") {

            this.dependencies.push('colourFamily');
            this.dependencies.push('brightnessFamily');
            this.dependencies.push('opacityFamily');
            this.dependencies.push('magnetismFamily');
            this.dependencies.push('porosityFamily');
            this.dependencies.push('cohesionFamily');
            this.dependencies.push('hardnessFamily');
            this.dependencies.push('crackingFamily');
            this.dependencies.push('dcompositionFamily');
            this.dependencies.push('interfacetransitionFamily');
            this.dependencies.push('interfaceroughnessFamily');
            this.dependencies.push('interfaceadherenceFamily');
        }

        if (this.nature == "Pseudomorph of organic material") {
            this.dependencies.push('colourFamily');
            this.dependencies.push('brightnessFamily');
            this.dependencies.push('opacityFamily');
            this.dependencies.push('magnetismFamily');
            this.dependencies.push('porosityFamily');
            this.dependencies.push('cohesionFamily');
            this.dependencies.push('hardnessFamily');
            this.dependencies.push('crackingFamily');
            this.dependencies.push('pomcompositionFamily');
            this.dependencies.push('interfacetransitionFamily');
            this.dependencies.push('interfaceroughnessFamily');
            this.dependencies.push('interfaceadherenceFamily');
        }

        if (this.nature == "Corrosion products") {
            this.dependencies.push('colourFamily');
            this.dependencies.push('brightnessFamily');
            this.dependencies.push('opacityFamily');
            this.dependencies.push('magnetismFamily');
            this.dependencies.push('porosityFamily');
            this.dependencies.push('cprimicrostructureFamily');
            this.dependencies.push('cohesionFamily');
            this.dependencies.push('hardnessFamily');
            this.dependencies.push('crackingFamily');
            this.dependencies.push('interfacetransitionFamily');
            this.dependencies.push('interfaceroughnessFamily');
            this.dependencies.push('interfaceadherenceFamily');
            this.dependencies.push('cpcompositionextensionFamily');
            this.dependencies.push('cprimicrostructureaggregatecompositionFamily');
            this.dependencies.push('cprimicrostructureaggregatecompositionextensionFamily');
            this.dependencies.push('cpcompositionFamily');
            this.dependencies.push('subcpcompositionFamily');
            this.dependencies.push('subsubcpcompositionFamily');
            this.dependencies.push('subcprimicrostructureFamily');
            this.dependencies.push('subcprimicrostructureaggregatecompositionFamily');
            this.dependencies.push('subsubcprimicrostructureaggregatecompositionFamily');
        }

        if (this.nature == "Metal") {

            this.dependencies.push('colourFamily');
            this.dependencies.push('brightnessFamily');
            this.dependencies.push('opacityFamily');
            this.dependencies.push('magnetismFamily');
            this.dependencies.push('porosityFamily');
            this.dependencies.push('mmicrostructureFamily');
            this.dependencies.push('cohesionFamily');
            this.dependencies.push('hardnessFamily');
            this.dependencies.push('crackingFamily');
            this.dependencies.push('mcompositionFamily');
            this.dependencies.push('interfacetransitionFamily');
            this.dependencies.push('interfaceroughnessFamily');
            this.dependencies.push('interfaceadherenceFamily');
            this.dependencies.push('submmicrostructureFamily');
            this.dependencies.push('submcompositionFamily');
        }

        if(this.nature == 'Corroded metal'){
            this.dependencies.push('thicknessFamily');
            var ratioChar = new characteristic.Characteristic();
            ratioChar.setName('r1Characteristic');
            ratioChar.setRealName('r1');
            ratioChar.setFamily('cmCorrosionRatioFamily')

            this.replaceCharacteristic(ratioChar);



        }


    }


}

export{Strata};