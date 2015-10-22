/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Divers méthodes et propriétés qui sont utilisés tout au long de l'application
 */

/* Factory qui retourne l'instance qui convient selon la nature
 * @params nature : nom de la nature dont on veut l'instance
 * €returns instance de la nature qui convient
 */
function natureFactory (nature){
    if (nature == "cmCharacteristic" || nature == "CM")
        return new CM();
    else if (nature == "cpCharacteristic" || nature == "CP")
        return new CP();
    else if (nature == "dCharacteristic" || nature == "D")
        return new D();
    else if (nature == "mCharacteristic" || nature == "M")
        return new M();
    else if (nature == "nmmCharacteristic" || nature == "NMM")
        return new NMM();
    else if (nature == "pomCharacteristic" || nature == "POM")
        return new POM();
    else if (nature == "sCharacteristic" || nature == "S")
        return new S();
    else if (nature == "svCharacteristic" || nature == "SV")
        return new SV();
}

/* retourne la largeur des strates
 * @params charactéristique de largeur
 * €returns largeur qui convient, par défaut 500px
 */
function getWidths(width) {
    if (width == "largeCharacteristic")
        return 650;
    else if (width == "normalWidthCharacteristic")
        return 500;
    else if (width == "smallCharacteristic")
        return 300;
    else
        return 500;
}

/* Retourne la hauteur des strates
 * @params charactéristique de hauteur
 * €returns hauteur qui convient, par défaut 100px
 */
function getThicknesses(thickness) {
    if (thickness == "thickCharacteristic")
        return 150;
    else if (thickness == "normalThicknessCharacteristic")
        return 100;
    else if (thickness == "thinCharacteristic")
        return 50;
    else
        return 100;

}

// matreials or voids constituing the corroded artefact
var natures = {"natures" : [
    {"guidc" : "cmCharacteristic", "description" : "Corroded metal", "code" : "CM"},
    {"guidc" : "cpCharacteristic", "description" : "Corroded product", "code" : "CP"},
    {"guidc" : "dCharacteristic", "description" : "Deposit", "code" : "D"},
    {"guidc" : "mCharacteristic", "description" : "Metal", "code" : "M"},
    {"guidc" : "nmmCharacteristic", "description" : "Non-Metallic material", "code" : "NMM"},
    {"guidc" : "pomCharacteristic", "description" : "Pseudomorph of organic material", "code" : "POM"},
    {"guidc" : "sCharacteristic", "description" : "Soil", "code" : "S"},
    {"guidc" : "svCharacteristic", "description" : "Strucural void", "code" : "SV"},
]};

/* fonction qui parcourt une liste de caractéristique et qui retourne une caractéristique si elle est trouvée en fonction du paramètre
 * @params data : liste de caractéristiques
 *         name : nom de la caractéristique à trouver
 * €returns nom de la caractéristique trouvée dans la liste
 */
getCharacteristicByItsName = function(data, name) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == name){
            return data[i];
        }
    }
    return "";
}

/* fonction qui parcourt une liste de caractéristique et qui retourne toutes les caractéristiques si elle sont trouvée en fonction du paramètre
 * @params data : liste de caractéristiques
 *         name : nom de la caractéristique à trouver
 * €returns nom de la caractéristique trouvée dans la liste
 */
getCharacteristicByItsNameMulti = function(data, name) {
    var t = [];

    for (var i = 0; i < name.length; i++){
        for (var j = 0; j < data.length; j++){
            if (name[i].name == data[j].name){
                t.push(data[j]);
            }
        }
    }

    return t;
}

/* Compare deux strates et définit si elle est identique ou pas
 * @params deux strates
 * €returns true = identique, false = différente
 */
function compareTwoStratas(s1, s2) {
    if (s1.getNatureFamily() == s2.getNatureFamily()) {
        var s1car = s1.getJsonCharacteristics();
        var s2car = s2.getJsonCharacteristics();
        var s1int = s1.getJsonInterface();
        var s2int = s2.getJsonInterface();

        for (var i = 0; i < s1int.length; i++)
            s1car.push(s1int[i]);
        for (var i = 0; i < s2int.length; i++)
            s2car.push(s2int[i]);

        if (s1car.length != s2car.length)
            return false;

        for (var i = 0; i < s1car.length; i++) {
            var trouve = false;
            for (var j = 0; j < s2car.length; j++){
                if (s1car[i].name == s2car[j].name)
                trouve = true;
            }
            if (trouve == false)
                return false;
        }

        return true;
    }
    else
        return false;
}

/* retourne un nombre aléatoire entier entre min et max, min non inclu
 * @params min, max
 * €returns nombre aléatoire
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/* Dessine des craquelures sur une strate. Utilise des courbes de béziers aléatoirement pour dessiner les lignes
 * @params paper : surface de dessin
 *         width : largeur
 *         height : hauteur
 *         nbLines : nombre de craquelures horizontales
 *         nbCol : nombre de craquelures verticales
 * €returns
 */
function drawCracking(paper, width, height, nbLines, nbCol) {
    var nb_hoph = 8; // nombre de courbes de béziers horizontales
    var nb_hopv = 5; // nombre de courbes de béziers verticales
    var y = height / (nbLines+1);
    //horizontal
    for (var c = 0; c < nbLines; c++) {
        var x = 0;
        var t_hoph = width/nb_hoph;
        for (var i = 0; i < nb_hoph; i++){
            var x_delta_hop = x + t_hoph / 2 + getRandomInt(-30 , 30);
            var y_delta_hop = y + getRandomInt(-30 , 30);
            paper.path(['M', x, y, 'Q', x_delta_hop, y_delta_hop, x + t_hoph, y]).attr("stroke-width", 2);
            x += t_hoph;
        }
        y += height / (nbLines + 1);
    }

    //vertical
    x = width / (nbCol + 1);
    for (var c = 0; c < nbCol; c++){
        y = 0;
        var t_hop_v = height / nb_hopv;
        for (var i = 0; i < nb_hopv; i++){
            var x_delta_hop = x + getRandomInt(-30 , 30);//t_hoph / 2 + getRandomInt(-30 , 30);
            var y_delta_hop = y + t_hop_v / 2 + getRandomInt(-30 , 30);
            paper.path(['M', x, y, 'Q', x_delta_hop, y_delta_hop, x , y + t_hop_v]).attr("stroke-width", 2);
            y += t_hop_v;
        }
        x += width / (nbCol + 1)
    }
}

/* Dessine les interfaces en fonction de paramètres
 * @params paper : surface de dessin
 *         index : position de la strate dans la stratigraphie, 0 = au début
 *         width : largeur
 *         height : hauteur
 *         type : type de dessin voulu,bumpy, wavy, irregular
 *         nb_hop : nombre de courbes de béziers voulu
 *         bottomBackgroundColor : couleur inférieure de l'interface
 *         topBackgroundColor : couleur supérieure de l'interface
 * €returns
 */
function drawInterface(paper, index, width, height, type, nb_hop, bottomBackgroundColor, topBackgroundColor, borderWidth, interfaceLineThickness, diffuse, transition) {
    /* Le dessin des interfaces se fait en 3 étapes
    *  1) Tout d'abord on colorie la zone de dessin avec la couleur topBackground et sans cadre
    *  2) on dessine la ligne d'interface avec le tableau line = []
    *  3) on dessine la ligne d'interface accompagnée d'un polygone qui vient faire office de partie inférieure de l'interface et avec la couleur bottombackgroundcolor
    */

    // Si la couleur des deux strates est noire alors la ligne d'interface est blanche
    var strokeColor = "black";
    if (bottomBackgroundColor == "black" && topBackgroundColor == "black")
        strokeColor = "white";

    var bubbleTransitionSize = 4;

    var rect = paper.rect(0, 0, width, height).attr("stroke-width", 0); // zone de dessin sans cadre

    if ((transition == "semiGradualInferiorCharacteristic"  || transition == "gradualCharacteristic") && index != 0){
        var pds = new PoissonDiskSampler(width, height);
        for (var i = 0; i < 50; i++)
            pds.createPointsPerso(10, 10, 'none', 0,  0);
        for (var i = 0; i < pds.pointList.length; i++){
            paper.circle(pds.pointList[i].x, pds.pointList[i].y + bubbleTransitionSize, bubbleTransitionSize).attr("fill", bottomBackgroundColor);
            //console.log("X " +  pds.pointList[i].x + " Y + " + pds.pointList[i].y);
        }
    }


    rect.attr("fill", topBackgroundColor);
    var y = height / 2;
    var t = [];
    var line = [];
    var nb = nb_hop;
    var x = 0;
    var h_hop = width / nb;
    var y = height / 2;
    for (var i = 0 ; i < nb; i++) {
        t.push('M');
        line.push('M');
        t.push(x);
        line.push(x);
        t.push(y);
        line.push(y);
        t.push('Q');
        line.push('Q');
        // on utilise les courbes de béziers pour faire des vagues
        if (type == "wavy"){
            t.push(x + width/nb/2);
            line.push(x + width/nb/2);
            if ((i % 2) == 0){
                line.push(y + y / 2);
                t.push(y + y / 2);
            }
            else{
                line.push(y - y / 2);
                t.push(y - y / 2);
            }
        }
        else if (type == "bumpy") { // on fait des bosses avec les courbes de béziers en introduisant des hauteurs aléatoires
            t.push(x + width/nb/2);
            line.push(x + width/nb/2);
            var rnd = getRandomInt(0, y);
            if ((i % 2) == 0){
                line.push(y + rnd);
                t.push(y + rnd);
            }
            else{
                line.push(y - rnd);
                t.push(y - rnd);
            }
        }
        else if (type == "irregular") { // on faire des formes irrégulières avec les courbes de béziers avec des valeurs aléatoires
            var rndx = getRandomInt(0, width/nb);
            t.push(x + rndx);
            line.push(x + rndx);
            var rnd = getRandomInt(-height*0.8, height*0.8);
            line.push(y + rnd);
            t.push(y + rnd);

        }
        line.push(x + h_hop);
        t.push(x + h_hop);
        line.push(y);
        t.push(y);


        t.push('L');
        t.push(x + h_hop);
        t.push(height);
        t.push('L');
        t.push(x);
        t.push(height);

        x += h_hop;
    }

    var lineAttrs = new Array();
    lineAttrs.push({"stroke-width" : interfaceLineThickness});

    if (diffuse){
        lineAttrs.push({"stroke-dasharray": ["."]});
        lineAttrs.push({"stroke": "grey"});
    }
    paper.path(line).attr("stroke", strokeColor).attr(lineAttrs);
    paper.path(t).attr("fill", bottomBackgroundColor).attr("stroke", bottomBackgroundColor);;


    // Si c'est la première interface alros la bordure extérieure commence au milieu
    var startHeight = 0;
    if (index == 0)
        startHeight = height/2;
    paper.path("M0 " + startHeight + "L0 " + height).attr("stroke-width", borderWidth);
    paper.path("M" + width + " " + startHeight + "L" + width + " " + height).attr("stroke-width", borderWidth);


    if (transition == "semiGradualSuperiorCharacteristic" || transition == "gradualCharacteristic"){
        var heightBottom = height/2 - bubbleTransitionSize;
        var pds = new PoissonDiskSampler(width, heightBottom);
        for (var i = 0; i < 50; i++)
            pds.createPointsPerso(10, 10, 'none', 0,  0);
        for (var i = 0; i < pds.pointList.length; i++){
            paper.circle(pds.pointList[i].x, pds.pointList[i].y + (height / 2), bubbleTransitionSize).attr("fill", topBackgroundColor);
            //console.log("X " +  pds.pointList[i].x + " Y + " + pds.pointList[i].y);
        }
    }

}

/* dessine des vagues sur une zone de dessins
 * @params paper : surface de dessin
 *         nb_hop : nombre de courbes de béziers
 *         nb_lines : nombre de vagues
 *         width : largeur
 *         height : hauteur
 * €returns
 */
function drawalternatingBands(paper, nb_hop, nb_lines, width, height) {
    var rect = paper.rect(0, 0, width, height).attr("stroke-width", 0);

    var y = height / nb_lines;

    for (var a = 0; a < nb_lines; a++) {
        var t = [];
        var nb = nb_hop;
        var x = 0;
        var h_hop = width / nb;

        for (var i = 0 ; i < nb; i++) {
            t.push('M');
            t.push(x);
            t.push(y);
            t.push('Q');

            t.push(x + width/nb/2);
            if ((i % 2) == 0)
                t.push(y + height / nb_lines);
            else
                t.push(y - height / nb_lines);

            t.push(x + h_hop);
            t.push(y);

            x += h_hop;
        }
        y += height / nb_lines;
        paper.path(t).attr("stroke", "grey");;
    }
}

/* regex qui teste les valeurs entrées par l'utilisateur pour le nom des artefacts et stratigraphies
 * @params text : nom des interfaces ou stratigraphies
 * €returns true si ok, false si pas ok
 */
function testUserInput(text) {
    var exp = "^[a-zA-Z0-9\_]{2,100}$";
    var regexp = new RegExp(exp, "i");
    return regexp.test(text);
}

/* formate le nom de la couleur en enlevant characteristic à la fin et en transformant le noir en anthracite
 * @params couleur au format caractéristique
 * €returns couleur formattée
 */
function returnFormattedColor (color) {
    color = color.replace('Characteristic', '');
    if (color == "black")
        color = "#474747";
    return color;
}

/* formate le nom de la couleur en enlevant characteristic à la fin et en transformant le noir en anthracite
 * @params couleur au format caractéristique
 * €returns couleur formattée
 */
function returnSubCharacteristicsFromParent(data, family, lvl1, lvl2) {
    var subList = [];
    var subsubList = [];
    // On parcourt toutes les familles
    for (var i = 0; i < data.length; i++){
        if (data[i].family == family){
            var caracts = data[i].characteristics;
            for (var j = 0; j < caracts.length; j++){
                if (caracts[j].name == lvl1){
                    var caract = caracts[j];
                    for (var k = 0; k < caract.subcharacteristics.length; k++){
                        var subcaract = caract.subcharacteristics[k];
                        subList.push({'name' : subcaract.name});

                        if (subcaract.name == lvl2) {
                            var subsubcaracts = subcaract.subcharacteristics;
                            for (var l = 0; l < subsubcaracts.length; l++){
                                var subsubcaract = subsubcaracts[l];
                                subsubList.push({'name' : subsubcaract.name});
                            }
                        }

                    }
                }
            }
            break;
        }
    }

    if (lvl2 == '')
        return subList;
    else
        return subsubList;
}

















