(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './characteristic', './subCharacteristic'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./characteristic'), require('./subCharacteristic'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.characteristic, global.subCharacteristic);
        global.strata = mod.exports;
    }
})(this, function (exports, _characteristic, _subCharacteristic) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Strata = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    let Strata = function () {
        function Strata(nature) {
            _classCallCheck(this, Strata);

            this.nature = nature;
            this.dependencies = new Array();
            this.characteristics = new Array();
            this.subCharacteristics = new Array();
            this.init();
        }

        _createClass(Strata, [{
            key: 'toJson',
            value: function toJson() {
                var jsonStrata = [];
                var jsonChar = [];
                var jsonInterface = [];

                var jsonStrata = { 'name': this.getUid(), 'characteristics': [], 'interfaces': [] };

                //On récupère les caractéristiques
                for (var i = 0; i < this.characteristics.length; i++) {
                    if (!this.characteristics[i].isInterface()) {
                        jsonStrata.characteristics.push({ 'name': this.characteristics[i].getName() });
                    }
                }
                //On récupère les sous caractéristiques
                for (var i = 0; i < this.subCharacteristics.length; i++) {
                    jsonStrata.characteristics.push({ 'name': this.subCharacteristics[i].getName() });
                }

                //On récupère les caractéristiques d'interface
                for (var i = 0; i < this.characteristics.length; i++) {
                    if (this.characteristics[i].isInterface()) {
                        jsonStrata.interfaces.push({ 'name': this.characteristics[i].getName() });
                    }
                }

                return jsonStrata;
            }
        }, {
            key: 'getCharacteristicsByFamily',
            value: function getCharacteristicsByFamily(family) {
                var charact = [];
                for (var i = 0; i < this.characteristics.length; i++) {
                    if (this.characteristics[i].getFamily() == family) {
                        charact.push(this.characteristics[i]);
                    }
                }
                return charact;
            }
        }, {
            key: 'getSubCharacteristicsByFamily',
            value: function getSubCharacteristicsByFamily(family) {
                var charact = [];
                for (var i = 0; i < this.subCharacteristics.length; i++) {
                    if (this.subCharacteristics[i].getFamily() == family) {
                        charact.push(this.subCharacteristics[i]);
                    }
                }
                return charact;
            }
        }, {
            key: 'clearCharacteristicsFromFamily',
            value: function clearCharacteristicsFromFamily(family) {

                for (var i = 0; i < this.characteristics.length; i++) {
                    if (this.characteristics[i].getFamily() == family) {
                        this.characteristics.splice(i, 1);
                        i--;
                    }
                }
            }
        }, {
            key: 'clearSubCharacteristicsFromFamily',
            value: function clearSubCharacteristicsFromFamily(family) {
                for (var i = 0; i < this.subCharacteristics.length; i++) {
                    if (this.subCharacteristics[i].getFamily() == family) {
                        this.subCharacteristics.splice(i, 1);
                        i--;
                    }
                }
            }
        }, {
            key: 'isFamily',
            value: function isFamily(family) {
                var exists = false;
                if (getCharacteristicsByFamily(family).length > 0) {
                    exists = true;
                }
                return exists;
            }
        }, {
            key: 'isSubCharacteristic',
            value: function isSubCharacteristic(name) {
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
        }, {
            key: 'addSubCharacteristic',
            value: function addSubCharacteristic(subCharacteristic) {
                this.subCharacteristics.push(subCharacteristic);
            }
        }, {
            key: 'replaceSubCharacteristic',
            value: function replaceSubCharacteristic(subCharacteristic) {
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
        }, {
            key: 'addCharacteristic',
            value: function addCharacteristic(characteristic) {
                this.characteristics.push(characteristic);
            }
        }, {
            key: 'replaceCharacteristic',
            value: function replaceCharacteristic(characteristic) {
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
        }, {
            key: 'removeCharacteristic',
            value: function removeCharacteristic(uid) {}
        }, {
            key: 'removeSubCharacteristic',
            value: function removeSubCharacteristic(uid) {}
        }, {
            key: 'getSubCharacteristics',
            value: function getSubCharacteristics() {
                return this.subCharacteristics;
            }
        }, {
            key: 'getCharacteristics',
            value: function getCharacteristics() {
                return this.characteristics;
            }
        }, {
            key: 'getNature',
            value: function getNature() {
                return this.nature;
            }
        }, {
            key: 'setNature',
            value: function setNature(nature) {
                this.nature = nature;
            }
        }, {
            key: 'getId',
            value: function getId() {
                return this.id;
            }
        }, {
            key: 'setId',
            value: function setId(id) {
                this.id = id;
            }
        }, {
            key: 'getUid',
            value: function getUid() {
                return this.uid;
            }
        }, {
            key: 'setUid',
            value: function setUid(uid) {
                this.uid = uid;
            }
        }, {
            key: 'getIndex',
            value: function getIndex() {
                return this.index;
            }
        }, {
            key: 'setIndex',
            value: function setIndex(index) {
                this.index = index;
            }
        }, {
            key: 'findDependency',
            value: function findDependency(dep) {
                for (var i = 0; i < this.dependencies.length; i++) {
                    if (this.dependencies[i] == dep) return true;
                }
                return false;
            }
        }, {
            key: 'init',
            value: function init() {

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

                if (this.nature == 'Corroded metal') {
                    this.dependencies.push('thicknessFamily');
                    var ratioChar = new characteristic.Characteristic();
                    ratioChar.setName('r1Characteristic');
                    ratioChar.setRealName('r1');
                    ratioChar.setFamily('cmCorrosionRatioFamily');

                    this.replaceCharacteristic(ratioChar);
                }
            }
        }]);

        return Strata;
    }();

    exports.Strata = Strata;
});
