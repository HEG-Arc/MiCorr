(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.strata = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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

    var Strata = function () {
        function Strata(nature, child) {
            _classCallCheck(this, Strata);

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


        _createClass(Strata, [{
            key: "getChildStrataByNature",
            value: function getChildStrataByNature(nature) {

                for (var i = 0; i < this.childStrata.length; i++) {
                    if (this.childStrata[i].getNature() == nature) {
                        return this.childStrata[i];
                    }
                }
                return null;
            }
        }, {
            key: "getCharacteristicsByFamily",
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
            key: "getFirstCharacteristicByFamily",
            value: function getFirstCharacteristicByFamily(family, property) {
                var c = this.characteristics.find(function (e) {
                    return e.getFamily() == family;
                });
                if (!property) return c;else {
                    if (c) return c[property];else return c;
                }
            }
        }, {
            key: "getSubCharacteristicsByFamily",
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
            key: "clearCharacteristicsFromFamily",
            value: function clearCharacteristicsFromFamily(family) {

                for (var i = 0; i < this.characteristics.length; i++) {
                    if (this.characteristics[i].getFamily() == family) {
                        this.characteristics.splice(i, 1);
                        i--;
                    }
                }
            }
        }, {
            key: "clearSubCharacteristicsFromFamily",
            value: function clearSubCharacteristicsFromFamily(family) {
                for (var i = 0; i < this.subCharacteristics.length; i++) {
                    if (this.subCharacteristics[i].getFamily() == family) {
                        this.subCharacteristics.splice(i, 1);
                        i--;
                    }
                }
            }
        }, {
            key: "isFamily",
            value: function isFamily(family) {
                var exists = false;
                if (getCharacteristicsByFamily(family).length > 0) {
                    exists = true;
                }
                return exists;
            }
        }, {
            key: "isSubCharacteristic",
            value: function isSubCharacteristic(name) {
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
        }, {
            key: "addSubCharacteristic",
            value: function addSubCharacteristic(subCharacteristic) {
                this.subCharacteristics.push(subCharacteristic);
            }
        }, {
            key: "replaceSubCharacteristic",
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
            key: "addCharacteristic",
            value: function addCharacteristic(characteristic) {
                this.characteristics.push(characteristic);
            }
        }, {
            key: "addChildStrata",
            value: function addChildStrata(childStratum) {
                this.childStrata.push(childStratum);
            }
        }, {
            key: "replaceCharacteristic",
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
            key: "isChild",
            value: function isChild() {
                return this.child;
            }
        }, {
            key: "setChild",
            value: function setChild(child) {
                this.child = child;
            }
        }, {
            key: "removeCharacteristic",
            value: function removeCharacteristic(uid) {}
        }, {
            key: "removeSubCharacteristic",
            value: function removeSubCharacteristic(uid) {}
        }, {
            key: "getSubCharacteristics",
            value: function getSubCharacteristics() {
                return this.subCharacteristics;
            }
        }, {
            key: "getCharacteristics",
            value: function getCharacteristics() {
                return this.characteristics;
            }
        }, {
            key: "getNature",
            value: function getNature() {
                return this.nature;
            }
        }, {
            key: "setNature",
            value: function setNature(nature) {
                this.nature = nature;
            }
        }, {
            key: "getNatureFamilyAbbrev",
            value: function getNatureFamilyAbbrev() {
                if (this.characteristics) this.natureFamilyAbbrev = this.natureFamilyAbbrev || this.characteristics.find(function (elem) {
                    return elem.family == "natureFamily";
                }).name.split("Char")[0].toUpperCase();
                if (this.natureFamilyAbbrev) return this.natureFamilyAbbrev;else return "";
            }
        }, {
            key: "setLabel",
            value: function setLabel(label) {
                this.label = label;
            }
        }, {
            key: "getLabel",
            value: function getLabel() {
                return this.label;
            }
        }, {
            key: "getUid",
            value: function getUid() {
                return this.uid;
            }
        }, {
            key: "setUid",
            value: function setUid(uid) {
                this.uid = uid;
            }
        }, {
            key: "getName",
            value: function getName() {
                if (this.name == undefined) {
                    return this.uid;
                } else {
                    return this.name;
                }
            }
        }, {
            key: "setName",
            value: function setName(name) {
                this.name = name;
            }
        }, {
            key: "getIndex",
            value: function getIndex() {
                return this.index;
            }
        }, {
            key: "setIndex",
            value: function setIndex(index) {
                this.index = index;
            }
        }, {
            key: "addDependency",
            value: function addDependency(dep) {
                this.dependencies.push(dep);
            }
        }, {
            key: "findDependency",
            value: function findDependency(dep) {
                // temp use of case insensitive match before refactoring and using Map instead of list
                // because of unwanted case differences between Family and dependency key. For ex.
                // cprimicrostructureaggregatecompositionFamily vs cpriMicrostructureAggregateCompositionFamily

                var reIDep = new RegExp("^" + dep + "$", "i");
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var dependency = _step.value;

                        if (dependency.search(reIDep) == 0) {
                            if (dependency != dep) console.log('findDependency(' + dep + ')=' + dependency);
                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return false;
            }
        }, {
            key: "updateCharacteristic",
            value: function updateCharacteristic(familyName, characteristicSource) {
                if (characteristicSource && this.findDependency(familyName)) {
                    var c = new characteristic.Characteristic(familyName, characteristicSource);
                    this.replaceCharacteristic(c);
                    return true;
                }
                return false;
            }
        }, {
            key: "updateCharacteristicList",
            value: function updateCharacteristicList(familyName, characteristicList) {
                if (this.findDependency(familyName)) {
                    this.clearCharacteristicsFromFamily(familyName);
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = characteristicList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var cSource = _step2.value;

                            this.addCharacteristic(new characteristic.Characteristic(familyName, cSource));
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    return true;
                }
                return false;
            }
        }, {
            key: "updateSubCharacteristic",
            value: function updateSubCharacteristic(familyName, subCharacteristicSource) {
                if (subCharacteristicSource && this.findDependency(familyName)) {
                    var sc = new subCharacteristic.SubCharacteristic(familyName, subCharacteristicSource);
                    this.replaceSubCharacteristic(sc);
                    return true;
                }
                return false;
            }
        }, {
            key: "setStrataImage",
            value: function setStrataImage(strataImage) {
                this.strataImage = strataImage;
            }
        }, {
            key: "getStrataImage",
            value: function getStrataImage() {
                return this.strataImage;
            }
        }, {
            key: "setInterfaceImage",
            value: function setInterfaceImage(interfaceImage) {
                this.interfaceImage = interfaceImage;
            }
        }, {
            key: "getInterfaceImage",
            value: function getInterfaceImage() {
                return this.interfaceImage;
            }
        }, {
            key: "init",
            value: function init() {

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
        }, {
            key: "toJson",
            value: function toJson() {
                var childStrata = [];

                var jsonStrata = { 'name': this.getUid(), 'characteristics': [], 'interfaces': [], 'children': [] };

                //On récupère les caractéristiques
                for (var i = 0; i < this.characteristics.length; i++) {
                    if (!this.characteristics[i].isInterface()) {
                        jsonStrata.characteristics.push({ 'name': this.characteristics[i].getName() });
                    }
                }
                //On récupère les sous caractéristiques
                for (var i = 0; i < this.subCharacteristics.length; i++) {
                    jsonStrata.characteristics.push({ 'name': this.subCharacteristics[i].getUid() });
                }

                //On récupère les caractéristiques d'interface
                for (var i = 0; i < this.characteristics.length; i++) {
                    if (this.characteristics[i].isInterface()) {
                        jsonStrata.interfaces.push({ 'name': this.characteristics[i].getName() });
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
        }]);

        return Strata;
    }();

    exports.Strata = Strata;
});
//# sourceMappingURL=strata.js.map
