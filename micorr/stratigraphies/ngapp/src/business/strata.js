/**
 * Created by Thierry Hubmann
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 * C'est la classe business de la Strate
 */

import {Characteristic} from "./characteristic";
import {SubCharacteristic} from "./subCharacteristic";

let natureCharacteristicNameToNatureUID = {
    'Corroded metal': 'cm',
    'Soil': 'soil',
    'Non-Metallic material': 'nmm',
    'Deposit': 'deposit',
    'Pseudomorph of organic material':'pom',
    'Corrosion products': 'cp',
    'Metal': 'metal'
}

class Strata {

    constructor(nature, child, index) {
        this.setNature(nature);
        this.natureFamilyAbbrev = null;
        this.label = null;
        this.dependencies = [];
        this.characteristics = [];
        this.subCharacteristics = [];
        this.childStrata = [];
        this.secondaryComponents = [{characteristics: [], subCharacteristics: [], containers: {}}];
        this.containers = {}; //map of Element list
        this.variables = {};
        this.child = child;
        this.index = index;
        this.forceRefresh=0;
    }


    /**
     * Retourne une strate enfant de la nature en paramètres
     * @param nature la nature recherchée
     * @returns la strate enfant
     */
    getChildStrataByNature(nature) {

        for (var i = 0; i < this.childStrata.length; i++) {
            if (this.childStrata[i].getNature() == nature) {
                return this.childStrata[i];
            }
        }
        return null;
    }


    /**
     * Retourne les characteristiques correspondant à la famille donnée en paramètre
     * @param family la famille recherchée
     * @returns les characteristiques correspondante
     */
    getCharacteristicsByFamily(family) {
        return this.characteristics.filter(e => e.family == family);
    }

    getSecondaryComponentCharacteristicsByFamily(family, secondaryComponentIndex = 0) {
        return this.secondaryComponents[secondaryComponentIndex].characteristics.filter(e => e.family == family);
    }

    /**
     * Returns either first characteristic with requested family
     * or its requested property
     * @param family: characteristics's family searched
     * @param property: (optional) property of the charasteric object requested
     * @param inArrayProperty: (optional default to "characteristics") Array or name of the Array property in Strata where to search for characteristic
     * @returns characteristic object / characteristic[property] value
     */
    getFirstCharacteristicByFamily(family, property, inArrayProperty = "characteristics") {
        if (typeof (inArrayProperty) == "string")
            inArrayProperty = this[inArrayProperty];
        let c = inArrayProperty.find(e => e.getFamily() == family);
        if (!property)
            return c;
        else {
            if (c)
                return c[property];
            else
                return c;
        }
    }

    getFirstSecondaryComponentCharacteristicByFamily(family, property, secondaryComponentIndex = 0) {
        return this.getFirstCharacteristicByFamily(family, property, this.secondaryComponents[secondaryComponentIndex].characteristics)
    }

    /**
     * Returns either first subCharacteristics with requested family
     * or its requested property
     * @param family: subCharacteristics's family searched
     * @param property: (optional) property of the SubCharacteristic object requested
     * @returns characteristic object / characteristic[property] value
     */
    getFirstSubCharacteristicByFamily(family, property) {
        return this.getFirstCharacteristicByFamily(family, property, this.subCharacteristics);
    }

    getFirstSecondaryComponentSubCharacteristicByFamily(family, property, secondaryComponentIndex = 0) {
        return this.getFirstCharacteristicByFamily(family, property, this.secondaryComponents[secondaryComponentIndex].subCharacteristics);
    }

    /**
     * Retourne les sous caractéristiques de la famille en paramètre
     * @param family
     * @returns {Array} liste de sous caractéristiques
     */
    getSubCharacteristicsByFamily(family) {
        return this.subCharacteristics.filter(e => e.family == family);
    }

    getSecondaryComponentSubCharacteristicsByFamily(family, secondaryComponentIndex = 0) {
        return this.secondaryComponents[secondaryComponentIndex].subCharacteristics.filter(e => e.family == family);
    }

    /**
     * Supprime toutes les characteristiques d'une famille
     * @param family
     */
    clearCharacteristicsFromFamily(family, inArrayProperty = 'characteristics') {
        if (typeof (inArrayProperty) === "string")
            inArrayProperty = this[inArrayProperty];
        for (var i = 0; i < inArrayProperty.length; i++) {
            if (inArrayProperty[i].getFamily() == family) {
                inArrayProperty.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * Supprime toutes les sous characteristiques d'une famille
     * @param family
     */
    clearSubCharacteristicsFromFamily(family) {
        this.clearCharacteristicsFromFamily(family, 'subCharacteristics')
    }

    isFamily(family) {
        return (this.getCharacteristicsByFamily(family).length > 0);
    }

    /**
     * Cette méthode indique si au moins une des sous-caracterisitiques existe dans une strate.
     * @param (...uids) de la ou des sous caracteristique(s) à vérifier
     * @returns boolean indiquant si un des uids fait partie des sous characteristiques de la strate
     */
    isSubCharacteristic(...uids) {
        // find if any of the uids passed as arguments
        return this.subCharacteristics.find(sc => uids.includes(sc.getUid()));
    }

    /**
     * Ajoute une sous caractéristique sans vérifier si il en existe déjà une pour cette famille
     * @param subCharacteristic
     */
    addSubCharacteristic(subCharacteristic) {
        this.subCharacteristics.push(subCharacteristic);
    }

    /*
    * Replace, add or suppress a characteristic (resp. sub-characteristic) of the same family
    *
    * @param characteristic: ( Characteristic / SubCharacteristic)
    *  characteristic to assign to the stratum.
    *  if !characteristic.name then any stratum characteristic of family (characteristic.family)
    *  will be suppressed
    *
    *  @param inArrayProperty: ("characteristics", "subCharacteristics", etc..)
    */
    replaceCharacteristic(characteristic, inArrayProperty = "characteristics") {
        //todo refactoring switch characteristics and subCharacteristics to Map instead of Array
        if (typeof (inArrayProperty) === "string")
            inArrayProperty = this[inArrayProperty];
        let i = inArrayProperty.findIndex(e => e.family == characteristic.family);
        if (characteristic.getName()) {
            if (i == -1) //no existing characteristic found
                // add characteristic
                inArrayProperty.push(characteristic);
            else
                // replace existing one with characteristic
                inArrayProperty[i] = characteristic;
        } else
            // Characteristic without name/uid
        if (i != -1)
            //clear existing characteristic of same family
            inArrayProperty.splice(i, 1);
    }

    /**
     * Remplace une sous caractéristique de la famille de celle donnée en paramètre
     * @param subCharacteristic
     */
    replaceSubCharacteristic(subCharacteristic, inArrayProperty = "subCharacteristics") {
        this.replaceCharacteristic(subCharacteristic, inArrayProperty);
    }

    addCharacteristic(characteristic, inArrayProperty = "characteristics") {
        if (typeof (inArrayProperty) === "string")
            inArrayProperty = this[inArrayProperty];
        inArrayProperty.push(characteristic);
    }

    addChildStrata(childStratum) {
        this.childStrata.push(childStratum);
    }

    /**
     * Permet de savoir si la strate est une strate enfant.
     * @returns Un booleen qui indique si c'est une strate enfant
     */
    isChild() {
        return this.child;
    }

    /**
     * Permet d'indiquer que la strate est une strate enfant
     * @param child
     */
    setChild(child) {
        this.child = child;
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
        if (!this.nature && this.characteristics)
            return this.characteristics.find(elem => elem.family == "natureFamily").realName;
        return this.nature;
    }

    setNature(nature) {
        this.nature = nature;
        // get uid of Nature node corresponding to natureFamily characteristic of name nature
        this.natureUID = natureCharacteristicNameToNatureUID[nature];
    }

    /**
     * Return natureFamily abbreviation (or prefix) of the stratum (e.g. CP for Corrosion products)
     */
    getNatureFamilyAbbrev() {
        if (this.characteristics)
            this.natureFamilyAbbrev = this.natureFamilyAbbrev || this.characteristics.find(elem => elem.family == "natureFamily").name.split("Char")[0].toUpperCase();
        return this.natureFamilyAbbrev || "";
    }

    /**
     * setter for label called by Stratigraphy object based on position of stratum in the stratigraphy
     * and its NatureFamilyAbbrev (e.g: CP2, MC1...)
     */
    setLabel(label) {
        this.label = label;
    }

    getLabel() {
        return (this.label);
    }

    getUid() {
        return this.uid;
    }

    setUid(uid) {
        this.uid = uid;
    }

    getName() {
        if (this.name == undefined) {
            return this.uid;
        } else {
            return this.name;
        }
    }

    setName(name) {
        this.name = name;
    }

    getIndex() {
        return this.index;
    }

    setIndex(index) {
        this.index = index;
    }



    findDependency(dep) {
        // temp use of case insensitive match before refactoring and using Map instead of list
        // because of unwanted case differences between Family and dependency key. For ex.
        // cprimicrostructureaggregatecompositionFamily vs cpriMicrostructureAggregateCompositionFamily

        let reIDep = new RegExp("^" + dep + "$", "i");
        for (let dependency of this.dependencies) {
            if (dependency.search(reIDep) == 0) {
                if (dependency != dep)
                    console.log('findDependency(' + dep + ')=' + dependency);
                return true;
            }

        }
        return false;
    }

    /**
     * Helper methods to update stratum Characteristic from controller scope variables
     * @returns true if characteristic has been updated based on stratum dependency and characteristicSource
     */
    updateCharacteristic(familyName, characteristicSource, dependencyName = null, inArrayProperty = "characteristics") {
        dependencyName = dependencyName || familyName; //dependencyName defaults to familyName but could be different
        if (characteristicSource && this.findDependency(dependencyName)) {
            let c = new Characteristic(familyName, characteristicSource);
            this.replaceCharacteristic(c, inArrayProperty);
            return true;
        }
        return false;
    }

    updateSecondaryComponentCharacteristic(familyName, characteristicSource, dependencyName, secondaryComponentIndex = 0) {
        return this.updateCharacteristic(familyName, characteristicSource, dependencyName, this.secondaryComponents[secondaryComponentIndex].characteristics);
    }

    updateCharacteristicList(familyName, characteristicList, dependencyName = null, inArrayProperty = "characteristics") {
        dependencyName = dependencyName || familyName; //dependencyName defaults to familyName but could be different
        if (typeof (inArrayProperty) === "string")
            inArrayProperty = this[inArrayProperty];
        if (this.findDependency(familyName)) {
            this.clearCharacteristicsFromFamily(familyName, inArrayProperty);
            for (let cSource of characteristicList)
                this.addCharacteristic(new Characteristic(familyName, cSource));
            return true;
        }
        return false;
    }

    updateSecondaryComponentCharacteristicList(familyName, characteristicList, dependencyName, secondaryComponentIndex = 0) {
        if (this.findDependency(dependencyName)) {
            this.clearCharacteristicsFromFamily(familyName, this.secondaryComponents[0].characteristics);
            for (let cSource of characteristicList)
                this.addCharacteristic(new Characteristic(familyName, cSource), this.secondaryComponents[0].characteristics);
            return true;
        }
        return false;
    }

    setContainerElements(familyName, elements, containers = null) {
        // default target containers is this.containers
        containers = containers || this.containers;
        containers[familyName] = elements.slice();
        return true;
    }

    getContainerElements(familyName, containers = null) {
        // default source containers is this.containers
        containers = containers || this.containers;
        if (familyName in containers)
            return containers[familyName];
        else
            return [];
    }

    setSecondaryComponentContainerElements(familyName, elements, secondaryComponentIndex = 0) {
        return this.setContainerElements(familyName, elements, this.secondaryComponents[secondaryComponentIndex].containers);
    }

    getSecondaryComponentContainerElements(familyName, secondaryComponentIndex = 0) {
        return this.getContainerElements(familyName, this.secondaryComponents[secondaryComponentIndex].containers);
    }

    updateSubCharacteristic(familyName, subCharacteristicSource, dependencyName = null, inArrayProperty = "subCharacteristics") {
        dependencyName = dependencyName || familyName; //dependencyName defaults to familyName but could be different
        if (subCharacteristicSource && this.findDependency(dependencyName)) {
            let sc = new SubCharacteristic(familyName, subCharacteristicSource);
            this.replaceSubCharacteristic(sc, inArrayProperty);
            return true;
        }
        return false;
    }

    updateSecondaryComponentSubCharacteristic(familyName, subCharacteristicSource, dependencyName, secondaryComponentIndex = 0) {
        return this.updateSubCharacteristic(familyName, subCharacteristicSource, dependencyName, this.secondaryComponents[secondaryComponentIndex].subCharacteristics);
    }

    /**
     * Permet d'enregistrer le dessin SVG.JS d'une image pour éviter de la redessiner à chaque fois
     */
    setStrataImage(strataImage) {
        this.strataImage = strataImage;
    }

    getStrataImage() {
        return this.strataImage;
    }

    setInterfaceImage(interfaceImage) {
        this.interfaceImage = interfaceImage;
    }

    getInterfaceImage() {
        return this.interfaceImage;
    }



    toJson() {
        return {
            name: this.uid,
            characteristics: this.characteristics.filter(e => !e.isInterface()).map(e => ({name: e.name})),
            subCharacteristics: this.subCharacteristics.map(e => ({name: e.uid})),
            interfaces: this.characteristics.filter(e => e.isInterface()).map(e => ({name: e.name})),
            children: this.child ? [] : this.childStrata.map(el => el.toJson()),
            secondaryComponents: this.secondaryComponents.slice(),
            containers: Object.fromEntries(Object.entries(this.containers).map(
                ([family, elements]) => [family, elements.map(e => ({name: e.symbol ? e.symbol : e.name}))])),
            variables: {...this.variables}
        };
    }
}

export {Strata};
