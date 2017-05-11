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
        global.subCharacteristic = mod.exports;
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

    let SubCharacteristic = function () {
        function SubCharacteristic() {
            _classCallCheck(this, SubCharacteristic);
        }

        _createClass(SubCharacteristic, [{
            key: "getId",
            value: function getId() {
                return this.id;
            }
        }, {
            key: "setId",
            value: function setId(id) {
                this.id = id;
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
                return this.name;
            }
        }, {
            key: "setName",
            value: function setName(name) {
                this.name = name;
            }
        }, {
            key: "getFamily",
            value: function getFamily() {
                return this.family;
            }
        }, {
            key: "setFamily",
            value: function setFamily(family) {
                this.family = family;
            }
        }]);

        return SubCharacteristic;
    }();

    exports.SubCharacteristic = SubCharacteristic;
});
