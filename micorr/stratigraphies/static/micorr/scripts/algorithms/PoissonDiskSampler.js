/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Implémentation du Poisson Disk Distribution Algorithm
 * Cette implémentation est tirée de https://github.com/kimchristiansen/poisson-disk-sampler-js
 */

/*
 * Le PDS sert à répartir de façon homogène des points sur une surface sans que ceux-ci ne se touchent
 */
function PoissonDiskSampler(width, height) {
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

	var nr = 0;
	var pp;
    /* créé un point au hasard
     * @params radiusmin : rayon de la distance minimum
     *         radiusmax : rayon de la distance maximum
     *         type : nom de l'image. Ne sert pas au calcul des points
     *         imgw : largeur de l'image. ne sert pas au calcul des points
     *         imgh : hauteur de l'image. ne sert pas au calcul des points
     * €returns
     */
	this.createPointsPerso = function(radiusmin, radiusmax,  type, imgw, imgh) {
		var numFailed = 0;
		var maxFails = 500;
		do {
			if (nr === 0) { // Si aucun point n'existe on en créé un
				pp = this.createfirstPointPerso(radiusmin, radiusmax, type, imgw, imgh);
			} else { // Sinon on créé des points autour
				pp = this.generateRandomAroundPerso(pp, radiusmin, radiusmax, type, imgw, imgh);
			}
            // sert à voir si le point en touche un autre
			if (this.hitTest(pp)) {
				this.pointList[nr] = pp;
				nr++;
				numFailed = 0;
			} else {
				numFailed++;
			}
		} while (numFailed > 0 && numFailed < maxFails);
	}

      /* créé le premier  point au hasard
     * @params radiusmin : rayon de la distance minimum
     *         radiusmax : rayon de la distance maximum
     *         type : nom de l'image. Ne sert pas au calcul des points
     *         imgw : largeur de l'image. ne sert pas au calcul des points
     *         imgh : hauteur de l'image. ne sert pas au calcul des points
     * €returns x : position x
     *          y : position y
     *          r : rayon de l'image
     *          t : nom de l'image
     *          w : largeur de l'image
     *          h : hauteur de l'image
     */
	this.createfirstPointPerso = function(radiusMin, radiusMax, type, imgw, imgh) {
		var ranX = parseInt(Math.random() * this.w, 10),
			ranY = parseInt(Math.random() * this.h, 10),
			radius;

		if (this.distanceMap === null) {
			radius = parseInt(radiusMin + (Math.random() * (radiusMax - radiusMin)),10);
		} else {
			var p = this.getHitMapPixel(ranX, ranY);
			radius = radiusMin + ((radiusMax - radiusMin) * (p[0] / 255));
		}
		return {x:ranX, y:ranY, r:radius, t:type, w:imgw, h:imgh};
	};

     /* créé un point au hasard
     * @params radiusmin : rayon de la distance minimum
     *         radiusmax : rayon de la distance maximum
     *         type : nom de l'image. Ne sert pas au calcul des points
     *         imgw : largeur de l'image. ne sert pas au calcul des points
     *         imgh : hauteur de l'image. ne sert pas au calcul des points
     * €returns x : position x
     *          y : position y
     *          r : rayon de l'image
     *          t : nom de l'image
     *          w : largeur de l'image
     *          h : hauteur de l'image
     */
	this.generateRandomAroundPerso = function(p_point, radiusMin, radiusMax, type, imgw, imgh) {
		var ran,
			radius,
			a,
			newX,
			newY;

		ran = Math.random();
		radius = parseInt(p_point.r + radiusMax * (ran), 10);
		a = this.pi2 * (ran);
		newX = parseInt(p_point.x + (radius * Math.sin(a)), 10);
		newY = parseInt(p_point.y + (radius * Math.cos(a)), 10);

		if (newX <= 0 || newX >= this.w) {
			newX = parseInt(ran * this.w, 10);
		}

		if (newY <= 0 || newY >= this.h) {
			newY = parseInt(ran * this.h, 10);
		}

		if (this.distanceMap === null) {
			radius = radiusMin + (Math.random() * (radiusMax - radiusMin));
		} else {
			// red color
			var p = this.getHitMapPixel(newX, newY);
			radius = radiusMin + ((radiusMax - radiusMin) * (p[0] / 255));
		}

		return {
			x : newX,
			y : newY,
			r : radius,
			t : type,
            w : imgw,
            h : imgh
		};
	};

    // créé un point au hasard sur la carte
	this.createPoints = function() {
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
	};

    // regarde si le point créé touche un autre point
	this.hitTest = function(p_point) {
		if( this.excludeMap !== null ) {
			var p = this.getExcludeMapPixel(p_point.x, p_point.y);
			if(p[0] <= this.excludeThreshold) {
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

				if (d <= (pTemp.r + p_point.r)) {
					return false;
				}
			}
		}

		return true;
	};

	this.createfirstPoint = function() {
		var ranX = parseInt(Math.random() * this.w, 10),
			ranY = parseInt(Math.random() * this.h, 10),
			radius;

		if (this.distanceMap === null) {
			radius = parseInt(this.radiusMin + (Math.random() * (this.radiusMax - this.radiusMin)),10);
		} else {
			var p = this.getHitMapPixel(ranX, ranY);
			radius = this.radiusMin + ((this.radiusMax - this.radiusMin) * (p[0] / 255));
		}
		return {x:ranX, y:ranY, r:radius};
	};

	this.getExcludeMapPixel = function(p_x, p_y) {
		return this.excludeMap.getImageData(p_x, p_y, 1, 1).data;
	};

	this.getHitMapPixel = function(p_x, p_y) {
		return this.distanceMap.getImageData(p_x, p_y, 1, 1).data;
	};

	this.generateRandomAround = function(p_point) {
		var ran,
			radius,
			a,
			newX,
			newY;

		ran = Math.random();
		radius = parseInt(p_point.r + this.radiusMax * (ran), 10);
		a = this.pi2 * (ran);
		newX = parseInt(p_point.x + (radius * Math.sin(a)), 10);
		newY = parseInt(p_point.y + (radius * Math.cos(a)), 10);

		if (newX <= 0 || newX >= this.w) {
			newX = parseInt(ran * this.w, 10);
		}

		if (newY <= 0 || newY >= this.h) {
			newY = parseInt(ran * this.h, 10);
		}

		if (this.distanceMap === null) {
			radius = this.radiusMin + (Math.random() * (this.radiusMax - this.radiusMin));
		} else {
			// red color
			var p = this.getHitMapPixel(newX, newY);
			radius = this.radiusMin + ((this.radiusMax - this.radiusMin) * (p[0] / 255));
		}

		return {
			x : newX,
			y : newY,
			r : radius
		};
	};
}
