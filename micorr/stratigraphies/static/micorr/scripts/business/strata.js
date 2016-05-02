(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './characteristic'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./characteristic'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.characteristic);
        global.strata = mod.exports;
    }
})(this, function (exports, _characteristic) {
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
        }

        _createClass(Strata, [{
            key: 'addCharacteristic',
            value: function addCharacteristic(characteristic) {
                this.characteristics.push(characteristic);
            }
        }, {
            key: 'removeCharacteristic',
            value: function removeCharacteristic(uid) {}
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
        }]);

        return Strata;
    }();

    exports.Strata = Strata;
});
