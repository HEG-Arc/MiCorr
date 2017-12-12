/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Contient les 3 directives qui sont utilisées dans MiCorrApp
 */

/* Cette directive représente le dessin de chaque strate
 */
angular.module('micorrApp').directive('strata', function ($compile, StratigraphyData) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<div class="svgcanvas col-md-10 text-center"><div></div><div></div></div>',
        link: function (scope, element, attrs) {
            var index = attrs.index;

            var st = scope.stratigraphy;

            var str = st.getStratas()[index];

            var interfaceDiv = element.context.childNodes[0];
            var strataDiv = element.context.childNodes[1];
            strataDiv.id = "strata" + index;
            interfaceDiv.id = "strataInterface" + index;

            var graphGenUtil = new graphGenerationUtil.GraphGenerationUtil(null, st);
            graphGenUtil.setStratig(st);


            /*
             * Si le SVG n'a jamais été généré ou que la strate à changé on le dessine
             */

            //Dessin de l'interface et de la strate
            graphGenUtil.drawInterface(str, interfaceDiv.id);
            graphGenUtil.drawStrata(str, strataDiv.id);


            //Gestion en cas de clic sur une strate
            $(element.children()[0]).bind('click', function () {
                scope.update(index);
                scope.setInterfaceTab(true);
            });
            // événement sur strate
            $(element.children()[1]).bind('click', function () {
                scope.update(index);
                scope.setInterfaceTab(false);
            });
        }
    };


    /* Cette directive permet de retrouver le svg créé par raphaeljs,
     * mettre le contenu de ce svg dans un canvas et ensuite créer un png téléchargeable
     * Ce png contient aussi les images qui se trouvaient sur le svg
     */
})
    /* Cette directive définit la classification (nommage) de la strate (CP1, CP2, M1, M2, M3, M1)
     * en fonction des autres strates de la stratigraphie
     * L'affichage vient à gauche des dessins des strates
     */
    .directive('stratainfo', function ($compile, StratigraphyData) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: '<div class="col-md-2 row text-right" style="padding-top:20px"><div style="float:left"></div><div style="float:rigth"></div></div>',
            link: function (scope, element, attrs) {

                var index = attrs.index;    // index de la strate

                // on récupère les strates et la strate
                var stratas = StratigraphyData.getStratigraphy().getStratas();
                element.children()[0].id = 'info'+index;

                element.children()[0].innerHTML = '<button class="btn btn-link btn-xs" ng-click="removeStrata(' + index + ')" title="delete this strata"><span class="glyphicon glyphicon-remove"></span></button>';

                // on affiche les boutons pour bouger la strate
                var btns = "";
                if (index > 0)
                    btns += '<button ng-click="movestrataup(' + index + ')" type="button" class="btn btn-link btn-xs" title="move up this strata"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></button>';
                if (index < stratas.length - 1)
                    btns += '<button ng-click="movestratadown(' + index + ')" type="button" class="btn btn-link btn-xs" title="move down this strata"><span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></button>';

                $(element.children()[1]).append(btns);
                // strata labels are now displayed inside stratigraphy svg
                //var label=stratas[index].getLabel();
                //$(element.children()[1]).append('<div class="labelinfo" >' + label + '</div>');

                $(element.children()[1]).bind('click', function () {
                    scope.update(index);
                    scope.setInterfaceTab(false);
                });

                $compile(element.contents())(scope);

            }
        };
    });
