/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Contient les 3 directives qui sont utilisées dans MiCorrApp
 */

/* Cette directive représente le dessin de chaque strate
 */
import angular from "angular";
import strataTemplate from './strata.html';
import stratainfoTemplate from './stratainfo.html';
import $ from "jquery";
import {GraphGenerationUtil} from "../utils/graphGenerationUtil";

let stratainfo;
let strata;

strata = function ($compile, StratigraphyData) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: strataTemplate,
        scope: {
            stratum:'=',
            index:'=',
            stratigraphy:'<',
            update:'&',
            setInterfaceTab:'&'
        },
        link: function (scope, element, attrs) {
            function updateContent() {

                let stratum = scope.stratum;
                let interfaceDiv = element[0].childNodes[0];
                let strataDiv = element[0].childNodes[1];
                strataDiv.id = "strata" + stratum.index;
                interfaceDiv.id = "strataInterface" + stratum.index;
                $(strataDiv).empty();
                $(interfaceDiv).empty();
                // here we remove div style attribut to avoid issue when drawing CM stratum empty interface
                // with angular reusing div with style.height  already set by previous drawing of a different interface
                $(interfaceDiv).removeAttr('style');
                let graphGenUtil = new GraphGenerationUtil(null, scope.stratigraphy);
                graphGenUtil.drawInterface(stratum, interfaceDiv.id);
                graphGenUtil.drawStrata(stratum, strataDiv.id);
            }

            scope.$watchGroup(['stratigraphy.colourFamily','stratum.forceRefresh'], function (newVal, oldVal) {
                updateContent();
            });
            updateContent();
        }
    };
};

stratainfo = function ($compile, StratigraphyData) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: stratainfoTemplate,
         scope: {
             index: '=',
             stratigraphy: '<',
             onDel: '&',
             onDown: '&',
             onUp: '&',
             update: '&',
             setInterfaceTab: '&'
         },
        link: function (scope, element, attrs) {
            // todo verify need of this binding / replace by ng-click and remove link fn here
            $(element.children()[1]).bind('click', function () {
                scope.update({index:scope.index});
                scope.setInterfaceTab({val:false});
            });

            $compile(element.contents())(scope);

        }
    };
};

export {strata, stratainfo};
