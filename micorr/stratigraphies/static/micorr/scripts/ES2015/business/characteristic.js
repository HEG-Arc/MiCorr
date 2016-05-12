/**
 * Created by thierry on 27.04.16.
 *
 * Cette classe est développée en ES2015 et est recompilée avec Babel
 */

import {SubCharacteristic} from './subCharacteristic';

class Characteristic{
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
