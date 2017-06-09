/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Implémentation de l'algorithme de voronoi
 * Cette implémentation est tirée de https://github.com/gorhill/Javascript-Voronoi
 */

/*
 * Le PDS sert à répartir de façon homogène des points sur une surface sans que ceux-ci ne se touchent
 */
var Voronoi = {
    voronoi: new Voronoi(),
    sites: [],  // points de voronoi. Caché dans notre exemple
    diagram: null,
    bbox: null,
	width : 0,
	height : 0,
	paper : null, ///zone de dessin

     /* créé un point au hasard
     * @params nbSites : nombre de points voulus sur la zone de dessin
     *         width : largeur de la zone de dessin
     *         height : hauteur de la zone de dessin
     *         paper : zone de dessin
     * €returns
     */
    init: function(nbSites, width, height, paper) {
		this.bbox = {xl:0,xr: width,yt:0,yb:height};
        this.width = width;
		this.height = height;
		this.paper = paper;
        this.randomSites(nbSites,true); // Création des points sur la carte
        this.render();                  // dessin des traits reliants les points
    },

    // cette méthode créé au hasard des points sur notre zone de dessin
    randomSites: function(n,clear) {
        if (clear) {this.sites = [];}
        // create vertices
        var xmargin = this.width;
            ymargin = this.height;
            xo = xmargin,
            dx = this.width-xmargin*2,
            yo = ymargin,
            dy = this.height-ymargin*2;
        for (var i=0; i<n; i++) {
            this.sites.push({
                x: xo + Math.random()*dx + Math.random()/dx,
                y: yo + Math.random()*dy + Math.random()/dy
                });
            }
        this.diagram = this.voronoi.compute(this.sites, this.bbox);		
	},

    // une fois les points créés. Cette méthode relie les points entre eux
    render: function() {
        // voronoi
        if (!this.diagram) {return;}
        var edges = this.diagram.edges,
            iEdge = edges.length,
            edge, v;
        while (iEdge--) { // parcourt des points
            edge = edges[iEdge];
			var line = "";

            // création des scripts pour raphaeljs
			v = edge.va;
			line += "M" + v.x + " " + v.y + "L";
            v = edge.vb;
			line += v.x + " " + v.y;
            this.paper.path(line);
            }
	}
};