/**
 * Created by Thierry Hubmann
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 * C'est la classe business de la sous-caractéristique
 */

class SubCharacteristic {

    constructor(family, sourceSC){
        if (family)
            this.family = family;
        if (sourceSC) {
            this.uid = sourceSC.uid;
            this.name = sourceSC.name;
        }
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

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getFamily() {
        return this.family;
    }

    setFamily(family) {
        this.family = family;
    }
}

export {SubCharacteristic};
