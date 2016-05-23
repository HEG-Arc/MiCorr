/**
 * Created by thierry on 27.04.16.
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 */

class SubCharacteristic{

    constructor(){

    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    getUid(){
        return this.uid;
    }

    setUid(uid){
        this.uid = uid;
    }

    getName(){
        return this.name;
    }

    setName(name){
        this.name = name;
    }

    getFamily(){
        return this.family;
    }

    setFamily(family){
        this.family = family;
    }
}

export{SubCharacteristic};