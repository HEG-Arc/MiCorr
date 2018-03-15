/**
 * Created by Thierry Hubmann
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 * C'est la classe business de la Strate
 */

import {Characteristic} from "./characteristic";
import {SubCharacteristic} from "./subCharacteristic";

class Strata {

    constructor(nature, child) {
        this.nature = nature;
        this.natureFamilyAbbrev = null;
        this.label = null;
        this.dependencies = [];
        this.characteristics = [];
        this.subCharacteristics = [];
        this.childStrata = [];
        this.secondaryComponents = [{characteristics: [], subCharacteristics: [], containers: {}}];
        this.containers = {}; //map of Element list
        this.child = child;

        this.init();


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

    getSecondaryComponentCharacteristicsByFamily(family, secondaryComponentIndex=0) {
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
    getFirstCharacteristicByFamily(family, property, inArrayProperty="characteristics") {
        if (typeof(inArrayProperty)=="string")
            inArrayProperty=this[inArrayProperty];
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
    getFirstSecondaryComponentCharacteristicByFamily(family, property, secondaryComponentIndex=0) {
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
    getFirstSecondaryComponentSubCharacteristicByFamily(family, property,secondaryComponentIndex=0) {
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

    getSecondaryComponentSubCharacteristicsByFamily(family, secondaryComponentIndex=0) {
        return this.secondaryComponents[secondaryComponentIndex].subCharacteristics.filter(e => e.family == family);
    }

    /**
     * Supprime toutes les characteristiques d'une famille
     * @param family
     */
    clearCharacteristicsFromFamily(family, inArrayProperty ='characteristics') {
        if (typeof(inArrayProperty)==="string")
            inArrayProperty=this[inArrayProperty];
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
       this.clearCharacteristicsFromFamily(family,'subCharacteristics')
    }

    isFamily(family) {
        return (this.getCharacteristicsByFamily(family).length > 0);
    }

    /**
     * Cette méthode indique si une sous-caracterisitique existe dans une strate.
     * @param le nom de la sous caracteristique à vérifier
     * @returns boolean indiquant si la sous-caracteristique existe
     */
    isSubCharacteristic(name) {
        var exists = false;
        var i = 0;
        while (exists == false && i < this.subCharacteristics.length) {
            if (this.subCharacteristics[i].getUid() == name) {
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
     * @param characteristic / subcharacteristic
      * inArrayProperty ("characteristics", "subCharacteristics", etc..)
     */
    replaceCharacteristic(characteristic, inArrayProperty="characteristics") {
        //todo refactoring switch characteristics and subCharacteristics to Map instead of Array
        if (typeof(inArrayProperty)==="string")
            inArrayProperty=this[inArrayProperty];
        var i = inArrayProperty.findIndex(e => e.family == characteristic.family );
        if (i==-1)
            inArrayProperty.push(characteristic);
        else
            inArrayProperty[i] = characteristic;
    }

    /**
     * Remplace une sous caractéristique de la famille de celle donnée en paramètre
     * @param subCharacteristic
     */
    replaceSubCharacteristic(subCharacteristic,inArrayProperty="subCharacteristics") {
        this.replaceCharacteristic(subCharacteristic, inArrayProperty);
    }

    addCharacteristic(characteristic,inArrayProperty="characteristics") {
        if (typeof(inArrayProperty)==="string")
            inArrayProperty=this[inArrayProperty];
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
        return this.nature;
    }

    setNature(nature) {
        this.nature = nature;
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
        }
        else {
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
    addDependency(dep) {
        this.dependencies.push(dep);
    }
    findDependency(dep) {
        // temp use of case insensitive match before refactoring and using Map instead of list
        // because of unwanted case differences between Family and dependency key. For ex.
        // cprimicrostructureaggregatecompositionFamily vs cpriMicrostructureAggregateCompositionFamily

        let reIDep = new RegExp("^" + dep + "$", "i") ;
        for (let dependency of this.dependencies) {
            if (dependency.search(reIDep) == 0)
            {
                if (dependency!=dep)
                    console.log('findDependency('+dep+')='+dependency);
                return true;
            }

        }
        return false;
    }
    /**
     * Helper methods to update stratum Characteristic from controller scope variables
     * @returns true if characteristic has been updated based on stratum dependency and characteristicSource
     */
    updateCharacteristic(familyName, characteristicSource, dependencyName=null, inArrayProperty="characteristics")
    {
        dependencyName = dependencyName || familyName; //dependencyName defaults to familyName but could be different
        if (characteristicSource && this.findDependency(dependencyName)) {
            let c = new Characteristic(familyName, characteristicSource);
            this.replaceCharacteristic(c, inArrayProperty);
            return true;
        }
        return false;
    }
    updateSecondaryComponentCharacteristic(familyName, characteristicSource, dependencyName, secondaryComponentIndex=0)
    {
        return this.updateCharacteristic(familyName, characteristicSource, dependencyName, this.secondaryComponents[secondaryComponentIndex].characteristics);
    }

    updateCharacteristicList(familyName, characteristicList, dependencyName=null,  inArrayProperty="characteristics") {
        dependencyName = dependencyName || familyName; //dependencyName defaults to familyName but could be different
        if (typeof(inArrayProperty)==="string")
            inArrayProperty=this[inArrayProperty];
        if (this.findDependency(familyName)) {
            this.clearCharacteristicsFromFamily(familyName, inArrayProperty);
            for (let cSource of characteristicList)
                this.addCharacteristic(new Characteristic(familyName, cSource));
            return true;
        }
        return false;
    }
    updateSecondaryComponentCharacteristicList(familyName, characteristicList, dependencyName, secondaryComponentIndex=0){
        if (this.findDependency(dependencyName)) {
            this.clearCharacteristicsFromFamily(familyName, this.secondaryComponents[0].characteristics);
            for (let cSource of characteristicList)
                this.addCharacteristic(new Characteristic(familyName, cSource), this.secondaryComponents[0].characteristics);
            return true;
        }
        return false;
    }

    setContainerElements(familyName, elements, containers=null) {
        // default target containers is this.containers
        containers = containers || this.containers;
        if (this.findDependency(familyName)) {
            containers[familyName]=elements.slice();
            return true;
        }
        return false;
    }
    getContainerElements(familyName, containers=null) {
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

    updateSubCharacteristic(familyName, subCharacteristicSource, dependencyName=null, inArrayProperty="subCharacteristics") {
        dependencyName = dependencyName || familyName; //dependencyName defaults to familyName but could be different
        if (subCharacteristicSource && this.findDependency(dependencyName)) {
            let sc = new SubCharacteristic(familyName, subCharacteristicSource);
            this.replaceSubCharacteristic(sc, inArrayProperty);
            return true;
        }
        return false;
    }
    updateSecondaryComponentSubCharacteristic(familyName, subCharacteristicSource, dependencyName, secondaryComponentIndex=0)
    {
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


    /**
     * Cette méthode initialise la strate en ajoutant à un tableau les propriétés modifiables
     * et en lui attribuant des valeurs par défaut
     */
    init() {

        this.addDependency('thicknessFamily');
        this.addDependency('widthFamily');
        this.addDependency('continuityFamily');
        this.addDependency('directionFamily');

        //Les strates CM n'ont pas d'interface
        if (this.nature != "Corroded metal") {
            this.addDependency('interfaceprofileFamily');
        }
        switch (this.nature) {
            case "Corroded metal":
                this.addDependency('cmmCompositionAdditionalElements');
                this.addDependency('cmcpCompositionAdditionalElements');
                this.addDependency('cmcpagCompositionAdditionalElements');
                break;
            case "Soil":
                this.addDependency('colourFamily');
                this.addDependency('brightnessFamily');
                this.addDependency('opacityFamily');
                this.addDependency('magnetismFamily');
                this.addDependency('porosityFamily');
                this.addDependency('cohesionFamily');
                this.addDependency('hardnessFamily');
                this.addDependency('crackingFamily');
                this.addDependency('scompositionFamily');
                this.addDependency('interfacetransitionFamily');
                this.addDependency('interfaceroughnessFamily');
                this.addDependency('interfaceadherenceFamily');
                break;
            case "Non-Metallic material":
                this.addDependency('colourFamily');
                this.addDependency('brightnessFamily');
                this.addDependency('opacityFamily');
                this.addDependency('magnetismFamily');
                this.addDependency('porosityFamily');
                this.addDependency('cohesionFamily');
                this.addDependency('hardnessFamily');
                this.addDependency('crackingFamily');
                this.addDependency('nmmcompositionFamily');
                this.addDependency('interfacetransitionFamily');
                this.addDependency('interfaceroughnessFamily');
                this.addDependency('interfaceadherenceFamily');
                break;
            case "Deposit":
                this.addDependency('colourFamily');
                this.addDependency('brightnessFamily');
                this.addDependency('opacityFamily');
                this.addDependency('magnetismFamily');
                this.addDependency('porosityFamily');
                this.addDependency('cohesionFamily');
                this.addDependency('hardnessFamily');
                this.addDependency('crackingFamily');
                this.addDependency('dcompositionFamily');
                this.addDependency('interfacetransitionFamily');
                this.addDependency('interfaceroughnessFamily');
                this.addDependency('interfaceadherenceFamily');
                break;
            case "Pseudomorph of organic material":
                this.addDependency('colourFamily');
                this.addDependency('brightnessFamily');
                this.addDependency('opacityFamily');
                this.addDependency('magnetismFamily');
                this.addDependency('porosityFamily');
                this.addDependency('cohesionFamily');
                this.addDependency('hardnessFamily');
                this.addDependency('crackingFamily');
                this.addDependency('pomcompositionFamily');
                this.addDependency('pomCompositionMetallicPollutants');
                this.addDependency('interfacetransitionFamily');
                this.addDependency('interfaceroughnessFamily');
                this.addDependency('interfaceadherenceFamily');
                break;
            case "Corrosion products":
                this.addDependency('colourFamily');
                this.addDependency('brightnessFamily');
                this.addDependency('opacityFamily');
                this.addDependency('magnetismFamily');
                this.addDependency('porosityFamily');
                this.addDependency('cohesionFamily');
                this.addDependency('hardnessFamily');
                this.addDependency('crackingFamily');
                this.addDependency('interfacetransitionFamily');
                this.addDependency('interfaceroughnessFamily');
                this.addDependency('interfaceadherenceFamily');
                this.addDependency('cpcompositionextensionFamily');
                this.addDependency('cpCompositionMainElements');
                this.addDependency('cpCompositionSecondaryElements');
                this.addDependency('cpCompositionCompounds');
                this.addDependency('cpCompositionAdditionalElements');

                this.addDependency('cprimicrostructureFamily');
                this.addDependency('cprimicrostructureaggregatecompositionFamily');
                this.addDependency('cprimicrostructureaggregatecompositionextensionFamily');
                this.addDependency('subcprimicrostructureFamily');
                this.addDependency('subcprimicrostructureaggregatecompositionFamily');
                this.addDependency('subsubcprimicrostructureaggregatecompositionFamily');
                // => to be replaced by:
                //cp Secondary Components dependencies
                this.addDependency('cpSdyCptMainElements');
                this.addDependency('cpSdyCptSecondaryElements');
                this.addDependency('cpSdyCptCompounds');
                this.addDependency('cpSdyCptAdditionalElements');
                break;
            case "Metal":
                this.addDependency('colourFamily');
                this.addDependency('brightnessFamily');
                this.addDependency('opacityFamily');
                this.addDependency('magnetismFamily');
                this.addDependency('porosityFamily');
                this.addDependency('mmicrostructureFamily');
                this.addDependency('cohesionFamily');
                this.addDependency('hardnessFamily');
                this.addDependency('crackingFamily');
                this.addDependency('mCompositionMainElements');
                this.addDependency('mCompositionSecondaryElements');
                this.addDependency('interfacetransitionFamily');
                this.addDependency('interfaceroughnessFamily');
                this.addDependency('interfaceadherenceFamily');
                this.addDependency('submmicrostructureFamily');
                break;
        }

    }

    toJson() {
        var childStrata = [],i;

        var jsonStrata = {
            name: this.getUid(), characteristics: [], interfaces: [], children: [], secondaryComponents: [],
            containers: {}
        };

        //On récupère les caractéristiques
        for (i = 0; i < this.characteristics.length; i++) {
            if (!this.characteristics[i].isInterface()) {
                jsonStrata.characteristics.push({name: this.characteristics[i].getName()});
            }
        }
        //On récupère les sous caractéristiques
        for (i = 0; i < this.subCharacteristics.length; i++) {
            jsonStrata.characteristics.push({name: this.subCharacteristics[i].getUid()});
        }

        //On récupère les caractéristiques d'interface
        for (i = 0; i < this.characteristics.length; i++) {
            if (this.characteristics[i].isInterface()) {
                jsonStrata.interfaces.push({name: this.characteristics[i].getName()});
            }
        }

        //On récupère les strates enfants si ce n'est pas une strate enfant
        if (!this.child) {
            for (i = 0; i < this.childStrata.length; i++) {
                jsonStrata.children.push(this.childStrata[i].toJson());
            }
        }
        // secondaryComponents

        jsonStrata.secondaryComponents = this.secondaryComponents.slice();

        // containers
        for (let [family,elements] of Object.entries(this.containers)) {
            jsonStrata.containers[family]=elements.map(e => {if (e.symbol) return {name: e.symbol}; else return {name: e.name}; } );
        }
        return jsonStrata;

    }


}

export {Strata};
