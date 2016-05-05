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

    let Stratigraphy = function () {
        function Stratigraphy() {
            _classCallCheck(this, Stratigraphy);

            //contient toutes les strates de la stratigraphie
            this.stratas = [];
        }

        /**
         * Ajoute une strate à la stratigraphie
         * @param strata La strate à ajouter
         */


        _createClass(Stratigraphy, [{
            key: 'addStrata',
            value: function addStrata(strata) {
                this.stratas.push(strata);
            }
        }, {
            key: 'removeStrata',
            value: function removeStrata(uid) {}
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
        }]);

        return Stratigraphy;
    }();

    exports.Stratigraphy = Stratigraphy;
});
