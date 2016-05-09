/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Contient les 3 directives qui sont utilisées dans MiCorrApp
 */

/* Cette directive représente le dessin de chaque strate
 * elle est composée de trois div. la première est la globale. cette div possède deux div
 * la première qui est embarquée est la div d'interface
 * la seconde est la div de strate
 * Dans chaque div, un <svg></svg> est créé grâce à raphaeljs
 * chaque svg est affiché à l'écrean
 */
angular.module('micorrApp').directive('strata', function($compile, StratigraphyData){
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        template : '<div class="svgcanvas col-md-11 text-center"><div></div><div title="We ask for your age only for statistical purposes."></div></div>',
        link : function(scope, element, attrs) {
            var stratigraphy = StratigraphyData.getStratigraphy();
            var strata = stratigraphy.getStratas()[attrs.index];

        }
    };


/* Cette directive permet de retrouver le svg créé par raphaeljs,
 * mettre le contenu de ce svg dans un canvas et ensuite créer un png téléchargeable
 * Ce png contient aussi les images qui se trouvaient sur le svg
 */
}).directive('stratapng', function($compile, StrataData){
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        template : '<canvas></canvas>',
        link : function(scope, element, attrs) {
            // on récupère notre image
            var index = attrs.index;
            var images = StrataData.getImages();
            var image = images[index];
            // on convertir en svg avec la librairie raphael.export
            var svg = image.toSVG();
            // on convertit en image et on l'inscruste dans notre canvas
            canvg(element[0], svg);
        }
    };
})
/* Cette directive définit la classification (nommage) de la strate (CP1, CP2, M1, M2, M3, M1)
 * en fonction des autres strates de la stratigraphie
 * L'affichage vient à gauche des dessins des strates
 */
.directive('stratainfo', function($compile, StrataData){
    return {
        restrict : 'EA',
        replace : true,
        transclude : true,
        template : '<div class="col-md-1 text-center"><div></div><div></div></div>',
        link : function(scope, element, attrs) {
            var index = attrs.index;    // index de la strate

            // on récupère les strates et la strate
            var stratas = scope.rstratas;
            var strata = stratas[index];
            var nb = stratas.length;

            var similarName = "";
            var sameNature = 0;

            var similar = false;

            // pour la strate actuelle on parcourt toutes les strates jusqu'à celle ci
            for (var i = 0; i < index; i++) {
                var s2 = stratas[i];

                if (strata.getShortNatureFamily() == s2.getShortNatureFamily()){
                    if (compareTwoStratas(strata, s2)){ // si les strates sont similaires alors on prend le nom de la strate similaire
                        strata.setOrderName(s2.getOrderName()); // la propriété orderName permet de stocker pour une strate, son nom (CP1, CP2, M1, M2, M3, M1)
                        similar = true;
                    }
                    sameNature++;
                }
            }

            // si les strates ne sont pas similaire alors on créé un nouveau nom et on lui ajouter le nom à la propriété orderName
            if (!similar)
                strata.setOrderName(strata.getShortNatureFamily() + (sameNature + 1));

            // On affiche le nom de la strate
            //element.children()[0].innerText = strata.getOrderName();

            element.children()[0].innerHTML = '<button class="btn btn-link btn-xs" ng-click="removeStrata('+index+')" title="delete this strata"><span class="glyphicon glyphicon-remove"></span></button></br>' + strata.getOrderName();

            // on affiche les boutons pour bouger la strate
            var btns = "";
            if (index > 0)
                btns += '<button ng-click="movestrataup(' + index + ')" type="button" class="btn btn-link btn-xs" title="move up this strata"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></button>';
            if (index < stratas.length - 1)
                btns += '<button ng-click="movestratadown(' + index + ')" type="button" class="btn btn-link btn-xs" title="move down this strata"><span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></button>';

            $(element.children()[1]).append(btns);
            $compile(element.contents())(scope);
        }
    };
});
