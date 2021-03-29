import {Strata} from "./strata";
import {Characteristic} from "./characteristic";
import {SubCharacteristic} from "./subCharacteristic";
import {returnNatureCharacteristic} from "../init";

/**
 * Created by Thierry Hubmann
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 * C'est la classe business de la Stratigraphie
 */


class Stratigraphy {

    constructor(colourFamily) {
        //contient toutes les strates de la stratigraphie
        this.stratas = [];
        this.colourFamily = colourFamily ? colourFamily : 'colourFamily';
    }

    toJson() {
        var jsonStratigraphy = {'artefact': this.getArtefact(), 'stratigraphy': this.getUid(), 'stratas': []};

        for (var i = 0; i < this.stratas.length; i++) {
            jsonStratigraphy.stratas.push(this.stratas[i].toJson());
        }

        return jsonStratigraphy;
    }

    setStratumLabel(stratum) {
        var natureFamilyAbbrev = stratum.getNatureFamilyAbbrev();
        var natureFamilyindex = 1;
        for (var i = 0; i < this.stratas.length && i < stratum.index; i++) {
            if (natureFamilyAbbrev == this.stratas[i].getNatureFamilyAbbrev()) {
                natureFamilyindex++;
            }
        }
        stratum.setLabel(natureFamilyAbbrev + natureFamilyindex);
    }

    /**
     * Ajoute une strate à la stratigraphie
     * @param stratum La strate à ajouter
     */
    addStratum(stratum) {
        if (this.stratas.length)
            this.stratas[this.stratas.length-1].forceRefresh++;
        this.stratas.push(stratum);
        this.setStratumLabel(stratum);
    }

    forceRefresh() {
        // force refresh all stratigraohy's strata
        // strata directive watches its stratum.forceRefresh and will self redraw on change
        for (let stratum of this.stratas)
            stratum.forceRefresh++;
    }

    swapTwoStrata(index1, index2) {
        var temp;
        temp = this.stratas[index1];
        this.stratas[index1] = this.stratas[index2];
        this.stratas[index2] = temp;

        this.stratas[index1].setIndex(index1);
        this.stratas[index2].setIndex(index2);
        this.setStratumLabel(this.stratas[index1]);
        this.setStratumLabel(this.stratas[index2]);
        this.forceRefresh();
    }

    delStratum(index) {
        if (this.selectedStrata && this.selectedStrata > index)
            this.selectedStrata--;
        this.stratas.splice(index, 1);
        for (let i = index; i < this.stratas.length; i++) {
            if (this.stratas[i] != undefined) {
                this.stratas[i].setIndex(i);
                this.setStratumLabel(this.stratas[i]);
            }
        }
        this.forceRefresh();
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

    getStratas() {
        return this.stratas;
    }

    setArtefact(artefact) {
        this.artefact = artefact;
    }

    getArtefact() {
        return this.artefact;
    }

    load(data, defaultDescription) {
        // load this Stratigraphy from data

        defaultDescription = defaultDescription || data.description;
        if (defaultDescription != undefined) {
            this.setDescription(defaultDescription);
        }
        //Boucle sur les strates
        for (var i = 0; i < data.strata.length; i++) {
            var sratumData = data.strata[i];
            var stratum = new Strata(undefined, false, i);
            stratum.setUid(sratumData.name);
            if (this.getDescription() != undefined) {
                stratum.setName(this.getDescription() + '_strata_' + stratum.getIndex());
            }
            //Boucle sur les caracteristiques
            for (let j = 0; j < sratumData.characteristics.length; j++) {
                stratum.addCharacteristic(new Characteristic(sratumData.characteristics[j]));
            }
            stratum.setNature(stratum.getNature());

            //Boucle sur les caracteristiques d'interface
            if ('characteristics' in sratumData.interfaces)
                for (let j = 0; j < sratumData.interfaces.characteristics.length; j++) {
                    let char = new Characteristic(sratumData.interfaces.characteristics[j]);
                    stratum.replaceCharacteristic(char);
                }
            //Récupération des sous caractéristiques:
            var subCharacteristicsList = sratumData['subcharacteristics'];
            var sChar;

            // new subcharacteristic data loaded with parent family information for dynamic conversion
            for (let sc of subCharacteristicsList) {
                if (sc.family) {
                    stratum.addSubCharacteristic(new SubCharacteristic(sc.family, sc))
                }
            }
            // secondary Components
            if (sratumData.secondaryComponents)
                for (let component of sratumData.secondaryComponents) {
                    for (let c of component.characteristics)
                        stratum.addCharacteristic(new Characteristic(c), stratum.secondaryComponents[0].characteristics)
                    if (component.containers)
                        stratum.secondaryComponents[0].containers = component.containers;
                }
            // Element containers
            if (sratumData.containers) {
                stratum.containers = sratumData.containers
            }
            // Variables
            if (sratumData.variables) {
                stratum.variables = sratumData.variables
            }

            //Récupération des strates enfant
            for (var j = 0; j < sratumData.children.length; j++) {
                var childData = sratumData.children[j];
                var childStratum = new Strata(undefined, true);
                childStratum.setUid(childData.name);
                //Boucle sur les caracteristiques
                for (let k = 0; k < childData.characteristics.length; k++) {
                    childStratum.addCharacteristic(new Characteristic(childData.characteristics[k]));
                }
                childStratum.setNature(childStratum.getNature());
                stratum.addChildStrata(childStratum);
            }

            /*Si la strate n'a pas d'enfants et que c'est une strate CM, on lui ajoute ses deux
             enfants. Celà permet de transformer les anciennes strates qui auraient été enregistrées
             avant l'instauration des strates enfants. */
            if (stratum.getNature() == 'Corroded metal' && sratumData.children.length == 0) {
                //Ajout de la sous strate CP
                var cpNature = returnNatureCharacteristic('CP');
                var childCPStrata = new Strata(cpNature.getRealName(), true);
                childCPStrata.replaceCharacteristic(cpNature);
                childCPStrata.setUid(stratum.getUid() + '_childCP');
                stratum.addChildStrata(childCPStrata);

                //Ajout de la sous strate M
                var mNature = returnNatureCharacteristic('M');
                var childMStrata = new Strata(mNature.getRealName(), true);
                childMStrata.replaceCharacteristic(mNature);
                childMStrata.setUid(stratum.getUid() + '_childM');
                stratum.addChildStrata(childMStrata);
            }

            this.addStratum(stratum);
        }
    }

}

export {Stratigraphy};
