/**
 * Created by Thierry Hubmann
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 * C'est la classe business de la Strate
 */

class Strata {

    constructor(nature, child) {
        this.nature = nature;
        this.natureFamilyAbbrev = null;
        this.label = null;
        this.dependencies = new Array();
        this.characteristics = new Array();
        this.subCharacteristics = new Array();
        this.childStrata = new Array();
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
        var charact = [];
        for (var i = 0; i < this.characteristics.length; i++) {
            if (this.characteristics[i].getFamily() == family) {
                charact.push(this.characteristics[i]);
            }
        }
        return charact;
    }

    /**
     * Returns either first characteristic with requested family
     *  or its requested property
     * @param family: characteristics's family searched
     * @param property: (optional) property of the charasteric object requested
     * @returns characteristic object / characteristic[property] value
     */
    getFirstCharacteristicByFamily(family, property) {
        let c = this.characteristics.find(e => e.getFamily() == family);
        if (!property)
            return c;
        else {
            if (c)
                return c[property];
            else
                return c;
        }
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
    clearCharacteristicsFromFamily(family) {

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
    clearSubCharacteristicsFromFamily(family) {
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

    addChildStrata(childStratum) {
        this.childStrata.push(childStratum);
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
            this.natureFamilyAbbrev = this.natureFamilyAbbrev || this.characteristics.find(function (elem) {
                return elem.family == "natureFamily"
            }).name.split("Char")[0].toUpperCase()
        if (this.natureFamilyAbbrev)
            return this.natureFamilyAbbrev;
        else
            return "";
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
    updateCharacteristic(familyName, characteristicSource)
    {
        if (characteristicSource && this.findDependency(familyName)) {
            let c = new characteristic.Characteristic(familyName, characteristicSource);
            this.replaceCharacteristic(c) ;
            return true;
        }
        return false;
    }

    updateCharacteristicList(familyName, characteristicList) {
        if (this.findDependency(familyName)) {
            this.clearCharacteristicsFromFamily(familyName);
            for (let cSource of characteristicList)
                this.addCharacteristic(new characteristic.Characteristic(familyName, cSource));
            return true;
        }
        return false;
    }
    updateSubCharacteristic(familyName, subCharacteristicSource) {
        if (subCharacteristicSource && this.findDependency(familyName)) {
            let sc = new subCharacteristic.SubCharacteristic(familyName, subCharacteristicSource);
            this.replaceSubCharacteristic(sc);
            return true;
        }
        return false;
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

        if (this.nature == "Soil") {

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
        }

        if (this.nature == "Non-Metallic material") {
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
        }


        if (this.nature == "Deposit") {

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
        }

        if (this.nature == "Pseudomorph of organic material") {
            this.addDependency('colourFamily');
            this.addDependency('brightnessFamily');
            this.addDependency('opacityFamily');
            this.addDependency('magnetismFamily');
            this.addDependency('porosityFamily');
            this.addDependency('cohesionFamily');
            this.addDependency('hardnessFamily');
            this.addDependency('crackingFamily');
            this.addDependency('pomcompositionFamily');
            this.addDependency('interfacetransitionFamily');
            this.addDependency('interfaceroughnessFamily');
            this.addDependency('interfaceadherenceFamily');
        }

        if (this.nature == "Corrosion products") {
            this.addDependency('colourFamily');
            this.addDependency('brightnessFamily');
            this.addDependency('opacityFamily');
            this.addDependency('magnetismFamily');
            this.addDependency('porosityFamily');
            this.addDependency('cprimicrostructureFamily');
            this.addDependency('cohesionFamily');
            this.addDependency('hardnessFamily');
            this.addDependency('crackingFamily');
            this.addDependency('interfacetransitionFamily');
            this.addDependency('interfaceroughnessFamily');
            this.addDependency('interfaceadherenceFamily');
            this.addDependency('cpcompositionextensionFamily');
            this.addDependency('cprimicrostructureaggregatecompositionFamily');
            this.addDependency('cprimicrostructureaggregatecompositionextensionFamily');
            this.addDependency('cpcompositionFamily');
            this.addDependency('subcpcompositionFamily');
            this.addDependency('subsubcpcompositionFamily');
            this.addDependency('subcprimicrostructureFamily');
            this.addDependency('subcprimicrostructureaggregatecompositionFamily');
            this.addDependency('subsubcprimicrostructureaggregatecompositionFamily');
        }

        if (this.nature == "Metal") {

            this.addDependency('colourFamily');
            this.addDependency('brightnessFamily');
            this.addDependency('opacityFamily');
            this.addDependency('magnetismFamily');
            this.addDependency('porosityFamily');
            this.addDependency('mmicrostructureFamily');
            this.addDependency('cohesionFamily');
            this.addDependency('hardnessFamily');
            this.addDependency('crackingFamily');
            this.addDependency('mcompositionFamily');
            this.addDependency('interfacetransitionFamily');
            this.addDependency('interfaceroughnessFamily');
            this.addDependency('interfaceadherenceFamily');
            this.addDependency('submmicrostructureFamily');
            this.addDependency('submcompositionFamily');
        }


    }

    toJson() {
        var childStrata = [];

        var jsonStrata = {'name': this.getUid(), 'characteristics': [], 'interfaces': [], 'children': []};

        //On récupère les caractéristiques
        for (var i = 0; i < this.characteristics.length; i++) {
            if (!this.characteristics[i].isInterface()) {
                jsonStrata.characteristics.push({'name': this.characteristics[i].getName()});
            }
        }
        //On récupère les sous caractéristiques
        for (var i = 0; i < this.subCharacteristics.length; i++) {
            jsonStrata.characteristics.push({'name': this.subCharacteristics[i].getUid()});
        }

        //On récupère les caractéristiques d'interface
        for (var i = 0; i < this.characteristics.length; i++) {
            if (this.characteristics[i].isInterface()) {
                jsonStrata.interfaces.push({'name': this.characteristics[i].getName()});
            }
        }

        //On récupère les strates enfants si ce n'est pas une strate enfant
        if (!this.child) {
            for (var i = 0; i < this.childStrata.length; i++) {
                jsonStrata.children.push(this.childStrata[i].toJson());
            }
        }

        return jsonStrata;

    }


}

export {Strata};
