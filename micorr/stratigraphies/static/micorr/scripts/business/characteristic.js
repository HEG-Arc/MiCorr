(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './subCharacteristic'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./subCharacteristic'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.subCharacteristic);
        global.characteristic = mod.exports;
    }
})(this, function (exports, _subCharacteristic) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Characteristic = undefined;

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

    var Characteristic = function () {
        function Characteristic(family, sourceC) {
            _classCallCheck(this, Characteristic);

            if (family) this.family = family;
            if (sourceC) {
                if ('uid' in sourceC) {
                    this.uid = sourceC.uid;
                    this.name = sourceC.name;
                } else if ('symbol' in sourceC) {
                    this.name = sourceC.symbol; //name is currently used as uid on save...
                } else {
                    this.name = sourceC.name;
                    this.real_name = sourceC.real_name;
                }
            }
        }

        _createClass(Characteristic, [{
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
            key: 'isVisible',
            value: function isVisible() {
                return this.visible;
            }
        }, {
            key: 'setVisible',
            value: function setVisible(visible) {
                this.visible = visible;
            }
        }, {
            key: 'getOrder',
            value: function getOrder() {
                return this.order;
            }
        }, {
            key: 'setOrder',
            value: function setOrder(order) {
                this.order = order;
            }
        }, {
            key: 'getName',
            value: function getName() {
                return this.name;
            }
        }, {
            key: 'setName',
            value: function setName(name) {
                this.name = name;
            }
        }, {
            key: 'getRealName',
            value: function getRealName() {
                return this.realName;
            }
        }, {
            key: 'setRealName',
            value: function setRealName(realName) {
                this.realName = realName;
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
            key: 'getFamily',
            value: function getFamily() {
                return this.family;
            }
        }, {
            key: 'setFamily',
            value: function setFamily(family) {
                this.family = family;
            }
        }, {
            key: 'isInterface',
            value: function isInterface() {
                return this.int;
            }
        }, {
            key: 'setInterface',
            value: function setInterface(int) {
                this.int = int;
            }
        }]);

        return Characteristic;
    }();

    exports.Characteristic = Characteristic;
});
//# sourceMappingURL=characteristic.js.map
