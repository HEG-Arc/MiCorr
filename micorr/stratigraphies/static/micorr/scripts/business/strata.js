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
        function Strata() {
            _classCallCheck(this, Strata);

            this.characteristics = [];
            this.subCharacteristics = [];
        }

        /**
         * Retourne les characteristiques correspondant à la famille donnée en paramètre
         * @param family la famille recherchée
         * @returns les characteristiques correspondante
         */


        _createClass(Strata, [{
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
            key: 'addCharacteristic',
            value: function addCharacteristic(characteristic) {
                this.characteristics.push(characteristic);
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
        }]);

        return Strata;
    }();

    exports.Strata = Strata;
});
