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


}

export {Stratigraphy};
