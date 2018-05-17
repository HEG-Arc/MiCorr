/**
 * Created by Thierry Hubmann
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 * C'est la classe Business de la caractéristique
 */

import {SubCharacteristic} from './subCharacteristic';

class Characteristic{
    constructor(family, sourceC){
       if (family)
            this.family = family;
        if (sourceC) {
            if ('uid' in sourceC)
            {
                this.setUid(sourceC.uid);
                this.setName(sourceC.name);
            }
            else if ('symbol' in sourceC)
            {
                this.setName(sourceC.symbol); //name is currently used as uid on save...
            }
            else
            {
                this.setName(sourceC.name) ;
                this.setRealName(sourceC.real_name);
            }
            if ('int' in sourceC)
                this.int = sourceC.int;
            else
                this.int = this.family.startsWith("interface");
        }
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

    isVisible(){
        return this.visible;
    }

    setVisible(visible){
        this.visible = visible;
    }

    getOrder(){
        return this.order;
    }

    setOrder(order){
        this.order = order;
    }

    getName(){
        return this.name;
    }

    setName(name){
        this.name = name;
    }

    getRealName(){
        return this.realName;
    }

    setRealName(realName){
        this.realName = realName;
    }

    getDescription(){
        return this.description;
    }

    setDescription(description){
        this.description = description;
    }

    getFamily(){
        return this.family;
    }

    setFamily(family){
        this.family = family;
    }
    isInterface(){
        return this.int;
    }

    setInterface(int){
        this.int = int;
    }


}

export {Characteristic};
