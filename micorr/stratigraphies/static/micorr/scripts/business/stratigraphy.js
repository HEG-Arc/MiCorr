(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './strata'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./strata'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.strata);
        global.stratigraphy = mod.exports;
    }
})(this, function (exports, _strata) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Stratigraphy = undefined;

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

    var Stratigraphy = function () {
        function Stratigraphy() {
            _classCallCheck(this, Stratigraphy);

            //contient toutes les strates de la stratigraphie
            this.stratas = [];
        }

        _createClass(Stratigraphy, [{
            key: 'toJson',
            value: function toJson() {
                var jsonStratigraphy = { 'artefact': this.getArtefact(), 'stratigraphy': this.getUid(), 'stratas': [] };

                for (var i = 0; i < this.stratas.length; i++) {
                    jsonStratigraphy.stratas.push(this.stratas[i].toJson());
                }

                return jsonStratigraphy;
            }
        }, {
            key: 'setStratumLabel',
            value: function setStratumLabel(stratum) {
                var natureFamilyAbbrev = stratum.getNatureFamilyAbbrev();
                var natureFamilyindex = 1;
                for (var i = 0; i < this.stratas.length && i < stratum.index; i++) {
                    if (natureFamilyAbbrev == this.stratas[i].getNatureFamilyAbbrev()) {
                        natureFamilyindex++;
                    }
                }
                stratum.setLabel(natureFamilyAbbrev + natureFamilyindex);
            }
        }, {
            key: 'addStratum',
            value: function addStratum(stratum) {
                this.stratas.push(stratum);
                this.setStratumLabel(stratum);
            }
        }, {
            key: 'swapTwoStrata',
            value: function swapTwoStrata(index1, index2) {
                var temp;
                temp = this.stratas[index1];
                this.stratas[index1] = this.stratas[index2];
                this.stratas[index2] = temp;

                this.stratas[index1].setIndex(index1);
                this.stratas[index2].setIndex(index2);
                this.setStratumLabel(this.stratas[index1]);
                this.setStratumLabel(this.stratas[index2]);
            }
        }, {
            key: 'delStratum',
            value: function delStratum(index) {
                var idel = parseInt(index);
                this.stratas.splice(idel, 1);
                if (this.stratas[idel] != undefined) {
                    this.stratas[idel].setIndex(idel);
                    this.setStratumLabel(this.stratas[idel]);
                }
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
            key: 'getDescription',
            value: function getDescription() {
                return this.description;
            }
        }, {
            key: 'setDescription',
            value: function setDescription(description) {
                this.description = description;
            }
        }, {
            key: 'getStratas',
            value: function getStratas() {
                return this.stratas;
            }
        }, {
            key: 'setArtefact',
            value: function setArtefact(artefact) {
                this.artefact = artefact;
            }
        }, {
            key: 'getArtefact',
            value: function getArtefact() {
                return this.artefact;
            }
        }]);

        return Stratigraphy;
    }();

    exports.Stratigraphy = Stratigraphy;
});
//# sourceMappingURL=stratigraphy.js.map
