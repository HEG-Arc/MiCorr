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
        global.poissonDisk = mod.exports;
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

    var PoissonDiskSampler = function () {
        function PoissonDiskSampler(width, height) {
            _classCallCheck(this, PoissonDiskSampler);

            // Coordonnées des points sur la surface
            this.pointList = [];
            // Nombre de points maximum sur la surface
            this.maxPoints = 100;

            this.pi2 = Math.PI * 2;
            this.w = width;
            this.h = height;
            this.distanceMap = null;
            this.excludeMap = null;
            this.excludeThreshold = 0;

            this.nr = 0;
            this.pp = null;
        }

        /* créé un point au hasard
         * @params radiusmin : rayon de la distance minimum
         *         radiusmax : rayon de la distance maximum
         *         type : nom de l'image. Ne sert pas au calcul des points
         *         imgw : largeur de l'image. ne sert pas au calcul des points
         *         imgh : hauteur de l'image. ne sert pas au calcul des points
         * €returns
         */


        _createClass(PoissonDiskSampler, [{
            key: "createPointsPerso",
            value: function createPointsPerso(radiusmin, radiusmax, type, imgw, imgh) {
                var numFailed = 0;
                var maxFails = 500;
                do {
                    if (this.nr === 0) {
                        // Si aucun point n'existe on en créé un
                        this.pp = this.createfirstPointPerso(radiusmin, radiusmax, type, imgw, imgh);
                    } else {
                        // Sinon on créé des points autour
                        this.pp = this.generateRandomAroundPerso(this.pp, radiusmin, radiusmax, type, imgw, imgh);
                    }
                    // sert à voir si le point en touche un autre
                    if (this.hitTest(this.pp)) {
                        this.pointList[this.nr] = this.pp;
                        this.nr++;
                        numFailed = 0;
                    } else {
                        numFailed++;
                    }
                } while (numFailed > 0 && numFailed < maxFails);
            }
        }, {
            key: "createfirstPointPerso",
            value: function createfirstPointPerso(radiusMin, radiusMax, type, imgw, imgh) {
                var ranX = parseInt(Math.random() * this.w, 10),
                    ranY = parseInt(Math.random() * this.h, 10),
                    radius;

                if (this.distanceMap === null) {
                    radius = parseInt(radiusMin + Math.random() * (radiusMax - radiusMin), 10);
                } else {
                    var p = this.getHitMapPixel(ranX, ranY);
                    radius = radiusMin + (radiusMax - radiusMin) * (p[0] / 255);
                }
                return { x: ranX, y: ranY, r: radius, t: type, w: imgw, h: imgh };
            }
        }, {
            key: "generateRandomAroundPerso",
            value: function generateRandomAroundPerso(p_point, radiusMin, radiusMax, type, imgw, imgh) {
                var ran, radius, a, newX, newY;

                ran = Math.random();
                radius = parseInt(p_point.r + radiusMax * ran, 10);
                a = this.pi2 * ran;
                newX = parseInt(p_point.x + radius * Math.sin(a), 10);
                newY = parseInt(p_point.y + radius * Math.cos(a), 10);

                if (newX <= 0 || newX >= this.w) {
                    newX = parseInt(ran * this.w, 10);
                }

                if (newY <= 0 || newY >= this.h) {
                    newY = parseInt(ran * this.h, 10);
                }

                if (this.distanceMap === null) {
                    radius = radiusMin + Math.random() * (radiusMax - radiusMin);
                } else {
                    // red color
                    var p = this.getHitMapPixel(newX, newY);
                    radius = radiusMin + (radiusMax - radiusMin) * (p[0] / 255);
                }

                return {
                    x: newX,
                    y: newY,
                    r: radius,
                    t: type,
                    w: imgw,
                    h: imgh
                };
            }
        }, {
            key: "createPoints",
            value: function createPoints() {
                var nr = 0,
                    pp,
                    numFailed = 0;

                while (nr < this.maxPoints && numFailed < this.maxFails) {
                    if (nr === 0) {
                        pp = this.createfirstPoint();
                    } else {
                        pp = this.generateRandomAround(pp);
                    }

                    if (this.hitTest(pp)) {
                        this.pointList[nr] = pp;
                        nr++;
                        numFailed = 0;
                    } else {
                        numFailed++;
                    }
                }
            }
        }, {
            key: "hitTest",
            value: function hitTest(p_point) {
                if (this.excludeMap !== null) {
                    var p = this.getExcludeMapPixel(p_point.x, p_point.y);
                    if (p[0] <= this.excludeThreshold) {
                        return false;
                    }
                }

                var l = this.pointList.length,
                    d = 0,
                    dx = 0,
                    dy = 0,
                    i = l,
                    pTemp;

                if (l > 0) {
                    while (i--) {
                        pTemp = this.pointList[i];
                        dx = pTemp.x - p_point.x;
                        dy = pTemp.y - p_point.y;
                        d = Math.sqrt(dx * dx + dy * dy);

                        if (d <= pTemp.r + p_point.r) {
                            return false;
                        }
                    }
                }

                return true;
            }
        }, {
            key: "createfirstPoint",
            value: function createfirstPoint() {
                var ranX = parseInt(Math.random() * this.w, 10),
                    ranY = parseInt(Math.random() * this.h, 10),
                    radius;

                if (this.distanceMap === null) {
                    radius = parseInt(this.radiusMin + Math.random() * (this.radiusMax - this.radiusMin), 10);
                } else {
                    var p = this.getHitMapPixel(ranX, ranY);
                    radius = this.radiusMin + (this.radiusMax - this.radiusMin) * (p[0] / 255);
                }
                return { x: ranX, y: ranY, r: radius };
            }
        }, {
            key: "getExcludeMapPixel",
            value: function getExcludeMapPixel(p_x, p_y) {
                return this.excludeMap.getImageData(p_x, p_y, 1, 1).data;
            }
        }, {
            key: "getHitMapPixel",
            value: function getHitMapPixel(p_x, p_y) {
                return this.distanceMap.getImageData(p_x, p_y, 1, 1).data;
            }
        }, {
            key: "generateRandomAround",
            value: function generateRandomAround(p_point) {
                var ran, radius, a, newX, newY;

                ran = Math.random();
                radius = parseInt(p_point.r + this.radiusMax * ran, 10);
                a = this.pi2 * ran;
                newX = parseInt(p_point.x + radius * Math.sin(a), 10);
                newY = parseInt(p_point.y + radius * Math.cos(a), 10);

                if (newX <= 0 || newX >= this.w) {
                    newX = parseInt(ran * this.w, 10);
                }

                if (newY <= 0 || newY >= this.h) {
                    newY = parseInt(ran * this.h, 10);
                }

                if (this.distanceMap === null) {
                    radius = this.radiusMin + Math.random() * (this.radiusMax - this.radiusMin);
                } else {
                    // red color
                    var p = this.getHitMapPixel(newX, newY);
                    radius = this.radiusMin + (this.radiusMax - this.radiusMin) * (p[0] / 255);
                }

                return {
                    x: newX,
                    y: newY,
                    r: radius
                };
            }
        }]);

        return PoissonDiskSampler;
    }();

    exports.PoissonDiskSampler = PoissonDiskSampler;
});
//# sourceMappingURL=poissonDisk.js.map
