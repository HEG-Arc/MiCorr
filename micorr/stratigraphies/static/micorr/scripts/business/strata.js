/*
 * MiCorrApp @ HE-ARC
 *
 * Version: 1
 *
 * Ce fichier représente les classes business de MiCorrApp
 * Tout tourne autour des classes business
 * Il existe 7 nature de matériau (CM, CP, D, M ,NMM, POM, S, SV)
 * Chacune de ces familles héritent de la classe Strata qui contient les propriétés en commun de chaque familles
 * Chaque famille hérite de caractéristiques qui lui sont propres (par exemple ColourStrata, BrightnessStrata,...)
 * Cet héritage multiple permet de définir des propriété a chacune des différentes nature de matériau
 * Chaque propriété a des getters/setters
 *
 * La propriété dependencies permet d'indiquer à quel type de charactéristique appartient une nature.
 * Par exemple la classe D hérite de ColourStrata et possède la dependance colourFamily.
 * Cela sert à indiquer de quoi a hérité la nature. On aurait pu utiliser instanceof pour savoir de quoi on a hérité mais
 * malheureusement la POO en javascript ne fonctionne pas très bien.
 *
 * Chaque classe a une méthode qui permet de retourner ses caractéristiques au format JSON
 *
 */

/*
* Classe mère
* Toutes les natures héritent de cette classe
*/

function Strata() {
    this.name = "";
    this.orderName = "";
    this.uid = "";
    this.shapeFamily = "";
    this.widthFamily = "";
    this.thicknessFamily = "";
    this.continuityFamily = "";
    this.directionFamily = "";
    this.interfaceprofileFamily = "";
    this.natureFamily = "";
    this.natureFamilyUid = "";
    this.shortNatureFamily = "";

    this.dependencies = new Array();

    this.toJsonCharacteristics = function() {
        var json = [];
        if (this.shapeFamily != "")
            json.push({'name' : this.shapeFamily});
        if (this.widthFamily != null)
            json.push({'name' : this.widthFamily});
        if (this.thicknessFamily != "")
            json.push({'name' : this.thicknessFamily});
        if (this.continuityFamily != "")
            json.push({'name' : this.continuityFamily});
        if (this.directionFamily != "")
            json.push({'name' : this.directionFamily});
        if (this.interfaceprofileFamily != null)
            json.push({'name' : this.interfaceprofileFamily})
        if (this.natureFamily != "")
            json.push({'name' : this.natureFamilyUid});

        return json;
    };

    this.setNatureFamilyUid = function(natureFamilyUid) {
        this.natureFamilyUid = natureFamilyUid;
    };

    this.getNatureFamilyUid = function() {
        return this.natureFamilyUid;
    };

    this.getOrderName = function() {
        return this.orderName;
    };

    this.setOrderName = function(orderName){
        this.orderName = orderName;
    };

    this.getShortNatureFamily = function() {
        return this.shortNatureFamily;
    };

    this.getNatureFamily = function() {
        return this.natureFamily;
    };

    /* sert a voir si on a hérité d'une classe. La POO en JS n'est pas au point et l'opérateur instanceof ne fonctionne pas
     * Par exemple, D a hérité de ColourStrata. Dans D on met la dépendance colourFamily
     * Cette méthode vérifie si le paramètre dep se trouve dans dependencies
     * par exemple l'utilisateur appelle cette méthode avec comme paramètre colourFamily et la méthode retourne true car elle
     * a trouvé colourFamily dans dependencies
     */
    this.findDependency = function(dep) {
        for (var i = 0; i < this.dependencies.length; i++){
            if (this.dependencies[i] == dep)
                return true;
        }
        return false;
    };

    this.setName = function(name){
        this.name = name;
    };

    this.getName = function() {
        if (this.name == null)
            return "undefined";
        return this.name;
    };

    this.setDirectionFamily = function(directionFamily){
        this.directionFamily = directionFamily;
    };

    this.getDirectionFamily = function(){
        return this.directionFamily;
    };

    this.setContinuityFamily = function(continuityFamily){
        this.continuityFamily = continuityFamily;
    };

    this.getContinuityFamily = function(){
        return this.continuityFamily;
    };

    this.setThicknessFamily = function(thicknessFamily){
        this.thicknessFamily = thicknessFamily;
    };

    this.getThicknessFamily = function() {
        return this.thicknessFamily;
    };

    this.setWidthFamily = function(widthFamily) {
        this.widthFamily = widthFamily;
    };

    this.getWidthFamily = function() {
        return this.widthFamily;
    };

    this.setShapeFamily = function(shapeFamily){
        this.shapeFamily = shapeFamily;
    };

    this.getShapeFamily = function(){
        return this.shapeFamily;
    };

    this.setUid = function(uid) {
        this.uid = uid
    };

    this.getUid = function() {
        return this.uid;
    };

    this.getInterfaceprofileFamily = function() {
        return this.interfaceprofileFamily;
    };

    this.setInterfaceprofileFamily = function(interfaceprofileFamily) {
        this.interfaceprofileFamily = interfaceprofileFamily;
    };
}

// caractéristiques des couleurs
function ColourStrata() {
    this.colourFamily = "";

    this.setColourFamily = function(colourFamily){
        this.colourFamily = colourFamily;
    };

    this.getColourFamily = function(){
        return this.colourFamily;
    };

    this.getJsonColour = function() {
        return {'name' : this.colourFamily};
    };
}

// caractéristique de luminosité
function BrightnessStrata() {
    this.brightnessFamily = "";

    this.setBrightnessFamily = function(brightnessFamily){
        this.brightnessFamily = brightnessFamily;
    };

    this.getBrightnessFamily = function() {
        return this.brightnessFamily;
    };

    this.getJsonBrightness = function() {
        return {'name' : this.brightnessFamily};
    };
}

// caractéristique d'opacité
function OpacityStrata() {
    this.opacityFamily = "";

    this.getOpacityFamily = function() {
        return this.opacityFamily;
    };

    this.setOpacityFamily = function(opacityFamily) {
        this.opacityFamily = opacityFamily;
    };

    this.getJsonOpacity = function() {
        return {'name' : this.opacityFamily};
    };
}

// caractéristique de magnétisme
function MagnetismStrata() {
    this.magnetismFamily = "";

    this.getMagnetismFamily = function() {
        return this.magnetismFamily;
    };

    this.setMagnetismFamily = function(magnetismFamily) {
        this.magnetismFamily = magnetismFamily;
    };

    this.getJsonMagnetism = function() {
        return {'name' : this.magnetismFamily};
    };
}

// caractéristique de porosité
function PorosityStrata() {
    this.porosityFamily = "";

    this.getPorosityFamily = function(){
        return this.porosityFamily;
    };

    this.setPorosityFamily = function(porosityFamily) {
        this.porosityFamily = porosityFamily;
    };

    this.getJsonPorosity = function() {
        return {'name' : this.porosityFamily};
    };
}

// caractéristique de microstructure pour CP
function CpriMicrostructureStrata() {
    // par défaut CP et CM n'ont pas de microstructures
    this.cpriMicrostructureFamily = "noMicrostructureCharacteristic";

    this.getCpriMicrostructureFamily = function() {
        return this.cpriMicrostructureFamily;
    };
    this.setCpriMicrostructureFamily = function(cpriMicrostructureFamily) {
        this.cpriMicrostructureFamily = cpriMicrostructureFamily;
    };

    this.getJsonCprimicrostructure = function() {
        return {'name' : this.cpriMicrostructureFamily};
    };
}

// caractéristique de microstructure pour M
function MMicrostructureStrata() {
    this.mmicrostructureFamily = "";

    this.getMmicrostructureFamily = function() {
        return this.mmicrostructureFamily;
    };

    this.setMmicrostructureFamily = function(mmicrostructureFamily) {
        this.mmicrostructureFamily = mmicrostructureFamily;
    };

    this.getJsonMmicrostructure = function() {
        return {'name' : this.mmicrostructureFamily};
    };
}

// sous caractéristique pour microstructure CP
function SubCPRIMicrostructureStrata() {
    this.subcprimicrostructureFamily = [];

    this.setSubcprimicrostructureFamily = function(subcprimicrostructureFamily) {
        this.subcprimicrostructureFamily = subcprimicrostructureFamily;
    };

    this.getSubcprimicrostructureFamily = function() {
        return this.subcprimicrostructureFamily;
    };

    this.getJsonSubCpriMicrostructure = function() {
        var t = [];
        for (var i = 0; i < this.subcprimicrostructureFamily.length; i++) {
            t.push({'name' : this.subcprimicrostructureFamily[i].name});
        }
        return t;
    };
}

//  caractéristique d'extension  d'aggrégation de composition pour microstructure cpri
function CpriMicrostructureAggregateCompositionExtensionStrata(){
    this.cprimicrostructureaggregatecompositionextensionFamily = [];

    this.getCprimicrostructureaggregateCompositionextensionFamily = function() {
        return this.cprimicrostructureaggregatecompositionextensionFamily;
    };

    this.setCprimicrostructureaggregateCompositionextensionFamily = function(cprimicrostructureaggregatecompositionextensionFamily) {
        this.cprimicrostructureaggregatecompositionextensionFamily = cprimicrostructureaggregatecompositionextensionFamily;
    };

    this.getJsonCprimicrostructureaggregateCompositionextensionFamily = function() {
        var t = [];
        for (var i = 0; i < this.cprimicrostructureaggregatecompositionextensionFamily.length; i++) {
            t.push({'name' : this.cprimicrostructureaggregatecompositionextensionFamily[i].name});
        }
        return t;
    };
}

// caractéristique de sous microstructure pour M
function SubMMicrostructureStrata() {
    this.submmicrostructureFamily = [];

    this.getSubmmicrostructureFamily = function() {
        return this.submmicrostructureFamily;
    };

    this.setSubmmicrostructureFamily = function(submmicrostructureFamily) {
        this.submmicrostructureFamily = submmicrostructureFamily;
    };

    this.getJsonSubmmicrostructure = function() {
        var t = [];
        for (var i = 0; i < this.submmicrostructureFamily.length; i++) {
            t.push({'name' : this.submmicrostructureFamily[i].name});
        }
        return t;
    };
}

// caractéristique d'extension de composition pour CP
function CpCompositionExtensionStrata() {
    this.cpcompositionextensionFamily = [];

    this.getCpcompositionextensionFamily = function (){
        return this.cpcompositionextensionFamily;
    };

    this.setCpcompositionextensionFamily = function (cpcompositionextensionFamily){
        this.cpcompositionextensionFamily = cpcompositionextensionFamily;
    };

    this.getJsonCpcompositionExtension = function(){
        var t = [];
        for (var i = 0; i < this.cpcompositionextensionFamily.length; i++) {
            t.push({'name' : this.cpcompositionextensionFamily[i].name});
        }
        return t;
    };
}

// caractéristique de cohésion
function CohesionStrata() {
    this.cohesionFamily = "";

    this.getCohesionFamily = function() {
        return this.cohesionFamily;
    };

    this.setCohesionFamily = function(cohesionFamily) {
        this.cohesionFamily = cohesionFamily;
    };

    this.getJsonCohesion = function() {
        return {'name' : this.cohesionFamily};
    };
}

// caractéristique de dureté
function HardnessStrata() {
    this.hardnessFamily = "";

    this.getHardnessFamily = function() {
        return this.hardnessFamily;
    };

    this.setHardnessFamily = function(hardnessFamily) {
        this.hardnessFamily = hardnessFamily;
    };

    this.getJsonHardness = function() {
        return {'name' : this.hardnessFamily};
    };
}

// caractéristique de craquelure
function CrackingStrata() {
    this.crackingFamily = "";

    this.getCrackingFamily = function(){
        return this.crackingFamily;
    };

    this.setCrackingFamily = function(crackingFamily) {
        this.crackingFamily = crackingFamily;
    };

    this.getJsonCracking = function() {
        return {'name' : this.crackingFamily};
    };
}

// caractéristique de composition pour S
function SCompositionStrata() {
    this.scompositionFamily = "";

    this.getScompositionFamily = function() {
        return this.scompositionFamily;
    };

    this.setScompositionFamily = function(scompositionFamily) {
        this.scompositionFamily = scompositionFamily;
    };

    this.getJsonScomposition = function() {
        return {'name' : this.scompositionFamily};
    };
}

// caractéristique de composition pour NMM
function NMMCompositionStrata() {
    this.nmmcompositionFamily = "";

    this.getNmmCompositionFamily = function() {
        return this.nmmcompositionFamily;
    };

    this.setNmmCompositionFamily = function(nmmcompositionFamily) {
        this.nmmcompositionFamily = nmmcompositionFamily;
    };

    this.getJsonNmmcomposition = function() {
        return {'name' : this.nmmcompositionFamily};
    };
}

// caractéristique de composition pour D
function DCompositionStrata () {
    this.dcompositionFamily = "";

    this.getDcompositionFamily = function() {
        return this.dcompositionFamily;
    };

    this.setDcompositionFamily = function(dcompositionFamily) {
        this.dcompositionFamily = dcompositionFamily;
    };

    this.getJsonDComposition = function() {
        return {'name' : this.dcompositionFamily};
    };
}

// caractéristique de composition pour POM
function POMCompositionStrata() {
    this.pomcompositionFamily = "";

    this.getPomcompositionFamily = function() {
        return this.pomcompositionFamily;
    };

    this.setPomCompositionFamily = function(pomcompositionFamily) {
        this.pomcompositionFamily = pomcompositionFamily;
    };

    this.getJsonPomcomposition = function() {
        return {'name' : this.pomcompositionFamily};
    };
}

// caractéristique de composition pour CP
function CPCompositionStrata() {
    this.cpcompositionFamily = "";

    this.getCpcompositionFamily = function() {
        return this.cpcompositionFamily;
    };

    this.setCpcompositionFamily = function(cpcompositionFamily) {
        this.cpcompositionFamily = cpcompositionFamily;
    };

    this.getJsonCPComposition = function() {
        return {'name' : this.cpcompositionFamily};
    };
}

// caractéristique de composition pour CM
function CMCompositionStrata() {
    this.cmcompositionFamily = "";

    this.getCmcompositionFamily = function() {
        return this.cmcompositionFamily;
    };

    this.setCmcompositionFamily = function(cmcompositionFamily) {
        this.cmcompositionFamily = cmcompositionFamily;
    };

    this.getJsonCmcomposition = function() {
        return {'name' : this.cmcompositionFamily};
    };
}

// sous caractéristique de composition pour CM
function SubCMCompositionStrata() {
    this.subcmcompositionFamily = "";

    this.getSubCmcompositionFamily = function() {
        return this.subcmcompositionFamily;
    };

    this.setSubCmcompositionFamily = function(subcmcompositionFamily) {
        this.subcmcompositionFamily = subcmcompositionFamily;
    };

    this.getJsonSubCmcomposition = function() {
        return {'name' : this.subcmcompositionFamily};
    };
}

// caractéristique de composition pour M
function MCompositionStrata() {
    this.mcompositionFamily = "";

    this.getMcompositionFamily = function() {
        return this.mcompositionFamily;
    };

    this.setMcompositionFamily = function(mcompositionFamily) {
        this.mcompositionFamily = mcompositionFamily;
    };

    this.getJsonMComposition = function() {
        return {'name' : this.mcompositionFamily};
    };
}

// caractéristique de composition pour M
function SubMCompositionStrata() {
    this.submcompositionFamily = "";

    this.getSubmcompositionFamily = function() {
        return this.submcompositionFamily;
    };

    this.setSubmcompositionFamily = function(submcompositionFamily) {
        this.submcompositionFamily = submcompositionFamily;
    };

    this.getJsonSubMComposition = function() {
        return {'name' : this.submcompositionFamily};
    };
}

// Interface de transition
function InterfaceTransitionStrata() {
    this.interfacetransitionFamily = "";
    this.getInterfacetransitionFamily = function() {
        return this.interfacetransitionFamily;
    };

    this.setInterfacetransitionFamily = function(interfacetransitionFamily){
        this.interfacetransitionFamily = interfacetransitionFamily;
    };

    this.getJsonInterfaceTransition = function() {
        return {'name' : this.interfacetransitionFamily};
    };
}

// dureté de l'interface
function InterfaceRoughnessStrata() {
    this.interfaceroughnessFamily = "";

    this.getInterfaceroughnessFamily = function() {
        return this.interfaceroughnessFamily;
    };

    this.setInterfaceroughnessFamily = function(interfaceroughnessFamily) {
        this.interfaceroughnessFamily = interfaceroughnessFamily;
    };

    this.getJsonInterfaceroughness = function() {
        return {'name' : this.interfaceroughnessFamily};
    };
}

//Adhérence de l'interface
function InterfaceAdherenceStrata() {
    this.interfaceadherenceFamily = "";

    this.getInterfaceadherenceFamily = function() {
        return this.interfaceadherenceFamily;
    };

    this.setInterfaceadherenceFamily = function(interfaceadherenceFamily) {
        this.interfaceadherenceFamily = interfaceadherenceFamily;
    };

    this.getJsonInterfaceAdherence = function() {
        return {'name' : this.interfaceadherenceFamily};
    };
}

// caractéristique de niveau de corrosion pour CM
function CMLevelOfCorrosionStrata() {
    this.cmLevelOfCorrosionFamily = "";

    this.setCmLevelOfCorrosionFamily = function(cmLevelOfCorrosionFamily) {
        this.cmLevelOfCorrosionFamily = cmLevelOfCorrosionFamily;
    };

    this.getCmLevelOfCorrosionFamily = function() {
        return this.cmLevelOfCorrosionFamily;
    };

    this.getJsonCmLevelOfCorrosionFamily = function() {
        return {'name' : this.cmLevelOfCorrosionFamily};
    };
}
// sous caractéristique de niveau de corrosion pour CM
function SubCMLevelOfCorrosionStrata() {
    this.subcmLevelOfCorrosionFamily = "";

    this.setSubCmLevelOfCorrosionFamily = function(subcmLevelOfCorrosionFamily) {
        this.subcmLevelOfCorrosionFamily = subcmLevelOfCorrosionFamily;
    };

    this.getSubCmLevelOfCorrosionFamily = function() {
        return this.subcmLevelOfCorrosionFamily;
    };

    this.getJsonSubCmLevelOfCorrosionFamily = function() {
        return {'name' : this.subcmLevelOfCorrosionFamily};
    };
}


// caractéristique d'extension d'aggrégation de composition pour microstructure cpri
function CpriMicrostructureAggregateCompositionStrata(){
    this.cprimicrostructureaggregatecompositionFamily = "";

    this.getCprimicrostructureaggregateCompositionFamily = function() {
        return this.cprimicrostructureaggregateCompositionFamily;
    };

    this.setCprimicrostructureaggregateCompositionFamily = function(cprimicrostructureaggregateCompositionFamily) {
        this.cprimicrostructureaggregateCompositionFamily = cprimicrostructureaggregateCompositionFamily;
    };

    this.getJsonCprimicrostructureaggregateCompositionFamily = function() {
        return {'name' : this.cprimicrostructureaggregateCompositionFamily};
    };
}

// sous caractéristique  d'aggrégation de composition pour microstructure cpri
function SubCpriMicrostructureAggregateCompositionStrata(){
    this.subcprimicrostructureaggregatecompositionFamily = "";

    this.getSubcprimicrostructureaggregateCompositionFamily = function() {
        return this.subcprimicrostructureaggregatecompositionFamily;
    };

    this.setSubcprimicrostructureaggregateCompositionFamily = function(subcprimicrostructureaggregatecompositionFamily) {
        this.subcprimicrostructureaggregatecompositionFamily = subcprimicrostructureaggregatecompositionFamily;
    };

    this.getJsonSubcprimicrostructureaggregateCompositionFamily = function() {
        return {'name' : this.subcprimicrostructureaggregatecompositionFamily};
    };
}

// sous sous caractéristique  d'aggrégation de composition pour microstructure cpri
function SubSubCpriMicrostructureAggregateCompositionStrata(){
    this.subsubcprimicrostructureaggregatecompositionFamily = "";

    this.getSubsubcprimicrostructureaggregateCompositionFamily = function() {
        return this.subsubcprimicrostructureaggregatecompositionFamily;
    };

    this.setSubsubcprimicrostructureaggregateCompositionFamily = function(subsubcprimicrostructureaggregatecompositionFamily) {
        this.subsubcprimicrostructureaggregatecompositionFamily = subsubcprimicrostructureaggregatecompositionFamily;
    };

    this.getJsonSubsubcprimicrostructureaggregateCompositionFamily = function() {
        return {'name' : this.subsubcprimicrostructureaggregatecompositionFamily};
    };
}

// sous caractéristique de composition pour CP
function SubCpCompositionStrata() {
    this.subcpcompositionFamily = "";

    this.setSubcpcompositionFamily = function(subcpcompositionFamily) {
        this.subcpcompositionFamily = subcpcompositionFamily;
    };

    this.getSubcpcompositionFamily = function() {
        return this.subcpcompositionFamily;
    };

    this.getJsonSubcpcompositionFamily = function() {
        return {'name' : this.subcpcompositionFamily};
    };
}

// sous sous caractéristique de composition pour CP
function SubSubCpCompositionStrata() {
    this.subsubcpcompositionFamily = "";

    this.setSubsubcpcompositionFamily = function(subsubcpcompositionFamily) {
        this.subsubcpcompositionFamily = subsubcpcompositionFamily;
    };

    this.getSubsubcpcompositionFamily = function() {
        return this.subsubcpcompositionFamily;
    };

    this.getJsonSubsubcpcompositionFamily = function() {
        return {'name' : this.subsubcpcompositionFamily};
    };
}


// Soil
function S() {
    Strata.call(this);
    ColourStrata.call(this);
    BrightnessStrata.call(this);
    OpacityStrata.call(this);
    MagnetismStrata.call(this);
    PorosityStrata.call(this);
    CohesionStrata.call(this);
    HardnessStrata.call(this);
    CrackingStrata.call(this);
    SCompositionStrata.call(this);
    InterfaceTransitionStrata.call(this);
    InterfaceRoughnessStrata.call(this);
    InterfaceAdherenceStrata.call(this);

    this.natureFamily = "Soil";
    this.shortNatureFamily = "S";
    this.natureFamilyUid = "sCharacteristic";

    this.dependencies.push('colourFamily');
    this.dependencies.push('brightnessFamily');
    this.dependencies.push('opacityFamily');
    this.dependencies.push('magnetismFamily');
    this.dependencies.push('porosityFamily');
    this.dependencies.push('cohesionFamily');
    this.dependencies.push('hardnessFamily');
    this.dependencies.push('crackingFamily');
    this.dependencies.push('scompositionFamily');
    this.dependencies.push('interfacetransitionFamily');
    this.dependencies.push('interfaceroughnessFamily');
    this.dependencies.push('interfaceadherenceFamily');

    this.getJsonCharacteristics = function() {
        var c = this.toJsonCharacteristics();
        if (this.colourFamily != "")
            c.push(this.getJsonColour());
        if (this.cohesionFamily != "")
            c.push(this.getJsonCohesion());
        if (this.hardnessFamily != "")
            c.push(this.getJsonHardness());
        if (this.crackingFamily != "")
            c.push(this.getJsonCracking());
        if (this.porosityFamily != "")
            c.push(this.getJsonPorosity());
        if (this.brightnessFamily != "")
            c.push(this.getJsonBrightness());
        if (this.opacityFamily != "")
            c.push(this.getJsonOpacity());
        if (this.magnetismFamily != "")
            c.push(this.getJsonMagnetism());
        if (this.scompositionFamily != "")
            c.push(this.getJsonScomposition());


        return c;
    }

    this.getJsonInterface = function() {
        var json = [];
        if (this.interfaceprofileFamily != "")
            json.push({'name' : this.interfaceprofileFamily});
        if (this.interfacetransitionFamily != "")
            json.push({'name' : this.interfacetransitionFamily});
        if (this.interfaceroughnessFamily != "")
            json.push({'name' : this.interfaceroughnessFamily});
        if (this.interfaceadherenceFamily != "")
            json.push({'name' : this.interfaceadherenceFamily});
        return json;
    };
};

//Non Metallic Material
function NMM() {
    Strata.call(this);
    ColourStrata.call(this);
    BrightnessStrata.call(this);
    OpacityStrata.call(this);
    MagnetismStrata.call(this);
    PorosityStrata.call(this);
    CohesionStrata.call(this);
    HardnessStrata.call(this);
    CrackingStrata.call(this);
    NMMCompositionStrata.call(this);
    InterfaceTransitionStrata.call(this);
    InterfaceRoughnessStrata.call(this);
    InterfaceAdherenceStrata.call(this);

    this.natureFamily = "Non-Metallic material";
    this.shortNatureFamily = "NMM";
    this.natureFamilyUid = "nmmCharacteristic";

    this.dependencies.push('colourFamily');
    this.dependencies.push('brightnessFamily');
    this.dependencies.push('opacityFamily');
    this.dependencies.push('magnetismFamily');
    this.dependencies.push('porosityFamily');
    this.dependencies.push('cohesionFamily');
    this.dependencies.push('hardnessFamily');
    this.dependencies.push('crackingFamily');
    this.dependencies.push('nmmcompositionFamily');
    this.dependencies.push('interfacetransitionFamily');
    this.dependencies.push('interfaceroughnessFamily');
    this.dependencies.push('interfaceadherenceFamily');

    this.getJsonCharacteristics = function() {
        var c = this.toJsonCharacteristics();
        if (this.colourFamily != "")
            c.push(this.getJsonColour());
        if (this.cohesionFamily != "")
            c.push(this.getJsonCohesion());
        if (this.hardnessFamily != "")
            c.push(this.getJsonHardness());
        if (this.crackingFamily != "")
            c.push(this.getJsonCracking());
        if (this.porosityFamily != "")
            c.push(this.getJsonPorosity());
        if (this.brightnessFamily != "")
            c.push(this.getJsonBrightness());
        if (this.opacityFamily != "")
            c.push(this.getJsonOpacity());
        if (this.magnetismFamily != "")
            c.push(this.getJsonMagnetism());
        if (this.nmmcompositionFamily != "")
            c.push(this.getJsonNmmcomposition());

        return c;
    }

    this.getJsonInterface = function() {
        var json = [];
        if (this.interfaceprofileFamily != "")
            json.push({'name' : this.interfaceprofileFamily});
        if (this.interfacetransitionFamily != "")
            json.push({'name' : this.interfacetransitionFamily});
        if (this.interfaceroughnessFamily != "")
            json.push({'name' : this.interfaceroughnessFamily});
        if (this.interfaceadherenceFamily != "")
            json.push({'name' : this.interfaceadherenceFamily});
        return json;
    };
};

//Deposit
function D() {
    Strata.call(this);
    ColourStrata.call(this);
    BrightnessStrata.call(this);
    OpacityStrata.call(this);
    MagnetismStrata.call(this);
    PorosityStrata.call(this);
    CohesionStrata.call(this);
    HardnessStrata.call(this);
    CrackingStrata.call(this);
    DCompositionStrata.call(this);
    InterfaceTransitionStrata.call(this);
    InterfaceRoughnessStrata.call(this);
    InterfaceAdherenceStrata.call(this);

    this.natureFamily = "Deposit";
    this.shortNatureFamily = "D";
    this.natureFamilyUid = "dCharacteristic";

    this.dependencies.push('colourFamily');
    this.dependencies.push('brightnessFamily');
    this.dependencies.push('opacityFamily');
    this.dependencies.push('magnetismFamily');
    this.dependencies.push('porosityFamily');
    this.dependencies.push('cohesionFamily');
    this.dependencies.push('hardnessFamily');
    this.dependencies.push('crackingFamily');
    this.dependencies.push('dcompositionFamily');
    this.dependencies.push('interfacetransitionFamily');
    this.dependencies.push('interfaceroughnessFamily');
    this.dependencies.push('interfaceadherenceFamily');

    this.getJsonCharacteristics = function() {
        var c = this.toJsonCharacteristics();
        if (this.colourFamily != "")
            c.push(this.getJsonColour());
        if (this.cohesionFamily != "")
            c.push(this.getJsonCohesion());
        if (this.hardnessFamily != "")
            c.push(this.getJsonHardness());
        if (this.crackingFamily != "")
            c.push(this.getJsonCracking());
        if (this.porosityFamily != "")
            c.push(this.getJsonPorosity());
        if (this.brightnessFamily != "")
            c.push(this.getJsonBrightness());
        if (this.opacityFamily != "")
            c.push(this.getJsonOpacity());
        if (this.magnetismFamily != "")
            c.push(this.getJsonMagnetism());
        if (this.dcompositionFamily != "")
            c.push(this.getJsonDComposition());


        return c;
    }

    this.getJsonInterface = function() {
        var json = [];
        if (this.interfaceprofileFamily != "")
            json.push({'name' : this.interfaceprofileFamily});
        if (this.interfacetransitionFamily != "")
            json.push({'name' : this.interfacetransitionFamily});
        if (this.interfaceroughnessFamily != "")
            json.push({'name' : this.interfaceroughnessFamily});
        if (this.interfaceadherenceFamily != "")
            json.push({'name' : this.interfaceadherenceFamily});
        return json;
    };
};

//Structural Void
function SV() {
    Strata.call(this);

    this.natureFamily = "Structural Void";
    this.shortNatureFamily = "SV";
    this.natureFamilyUid = "svCharacteristic";
    this.getJsonCharacteristics = function() {
        var c = this.toJsonCharacteristics();
        return c;
    }

    this.getJsonInterface = function() {
        var json = [];
        if (this.interfaceprofileFamily != "")
            json.push({'name' : this.interfaceprofileFamily});
        return json;
    };

};

// Pseudomorph of Organic Material
function POM() {
    Strata.call(this);
    ColourStrata.call(this);
    BrightnessStrata.call(this);
    OpacityStrata.call(this);
    MagnetismStrata.call(this);
    PorosityStrata.call(this);
    CohesionStrata.call(this);
    HardnessStrata.call(this);
    CrackingStrata.call(this);
    POMCompositionStrata.call(this);
    InterfaceTransitionStrata.call(this);
    InterfaceRoughnessStrata.call(this);
    InterfaceAdherenceStrata.call(this);

    this.natureFamily = "Pseudomorph of organic material";
    this.shortNatureFamily = "POM";
    this.natureFamilyUid = "pomCharacteristic";

    this.dependencies.push('colourFamily');
    this.dependencies.push('brightnessFamily');
    this.dependencies.push('opacityFamily');
    this.dependencies.push('magnetismFamily');
    this.dependencies.push('porosityFamily');
    this.dependencies.push('cohesionFamily');
    this.dependencies.push('hardnessFamily');
    this.dependencies.push('crackingFamily');
    this.dependencies.push('pomcompositionFamily');
    this.dependencies.push('interfacetransitionFamily');
    this.dependencies.push('interfaceroughnessFamily');
    this.dependencies.push('interfaceadherenceFamily');

    this.getJsonCharacteristics = function() {
        var c = this.toJsonCharacteristics();
        if (this.colourFamily != "")
            c.push(this.getJsonColour());
        if (this.cohesionFamily != "")
            c.push(this.getJsonCohesion());
        if (this.hardnessFamily != "")
            c.push(this.getJsonHardness());
        if (this.crackingFamily != "")
            c.push(this.getJsonCracking());
        if (this.porosityFamily != "")
            c.push(this.getJsonPorosity());
        if (this.brightnessFamily != "")
            c.push(this.getJsonBrightness());
        if (this.opacityFamily != "")
            c.push(this.getJsonOpacity());
        if (this.magnetismFamily != "")
            c.push(this.getJsonMagnetism());
        if (this.pomcompositionFamily != "")
            c.push(this.getJsonPomcomposition());

        return c;
    }

    this.getJsonInterface = function() {
        var json = [];
        if (this.interfaceprofileFamily != "")
            json.push({'name' : this.interfaceprofileFamily});
        if (this.interfacetransitionFamily != "")
            json.push({'name' : this.interfacetransitionFamily});
        if (this.interfaceroughnessFamily != "")
            json.push({'name' : this.interfaceroughnessFamily});
        if (this.interfaceadherenceFamily != "")
            json.push({'name' : this.interfaceadherenceFamily});
        return json;
    };
};

// Corrosion Product
function CP() {
    Strata.call(this);
    ColourStrata.call(this);
    BrightnessStrata.call(this);
    OpacityStrata.call(this);
    MagnetismStrata.call(this);
    PorosityStrata.call(this);
    CpriMicrostructureStrata.call(this);
    CohesionStrata.call(this);
    HardnessStrata.call(this);
    CrackingStrata.call(this);
    InterfaceTransitionStrata.call(this);
    InterfaceRoughnessStrata.call(this);
    InterfaceAdherenceStrata.call(this);
    CpCompositionExtensionStrata.call(this);
    CpriMicrostructureAggregateCompositionStrata.call(this);
    SubCpriMicrostructureAggregateCompositionStrata.call(this);
    SubSubCpriMicrostructureAggregateCompositionStrata.call(this);
    CpriMicrostructureAggregateCompositionExtensionStrata.call(this);
    CPCompositionStrata.call(this);
    SubCpCompositionStrata.call(this);
    SubSubCpCompositionStrata.call(this);
    SubCPRIMicrostructureStrata.call(this);


    this.natureFamily = "Corroded Products";
    this.shortNatureFamily = "CP";
    this.natureFamilyUid = "cpCharacteristic";

    this.dependencies.push('colourFamily');
    this.dependencies.push('brightnessFamily');
    this.dependencies.push('opacityFamily');
    this.dependencies.push('magnetismFamily');
    this.dependencies.push('porosityFamily');
    this.dependencies.push('cprimicrostructureFamily');
    this.dependencies.push('cohesionFamily');
    this.dependencies.push('hardnessFamily');
    this.dependencies.push('crackingFamily');
    this.dependencies.push('interfacetransitionFamily');
    this.dependencies.push('interfaceroughnessFamily');
    this.dependencies.push('interfaceadherenceFamily');
    this.dependencies.push('cpcompositionextensionFamily');
    this.dependencies.push('cprimicrostructureaggregatecompositionFamily');
    this.dependencies.push('cpcompositionextensionFamily');
    this.dependencies.push('cprimicrostructureaggregatecompositionFamily');
    this.dependencies.push('cprimicrostructureaggregatecompositionextensionFamily');
    this.dependencies.push('cpcompositionFamily');
    this.dependencies.push('subcpcompositionFamily');
    this.dependencies.push('subsubcpcompositionFamily');
    this.dependencies.push('subcprimicrostructureFamily');
    this.dependencies.push('subcprimicrostructureaggregatecompositionFamily');
    this.dependencies.push('subsubcprimicrostructureaggregatecompositionFamily');


    this.getJsonCharacteristics = function() {
        var c = this.toJsonCharacteristics();
        if (this.colourFamily != "")
            c.push(this.getJsonColour());
        if (this.cohesionFamily != "")
            c.push(this.getJsonCohesion());
        if (this.hardnessFamily != "")
            c.push(this.getJsonHardness());
        if (this.crackingFamily != "")
            c.push(this.getJsonCracking());
        if (this.porosityFamily != "")
            c.push(this.getJsonPorosity());
        if (this.brightnessFamily != "")
            c.push(this.getJsonBrightness());
        if (this.opacityFamily != "")
            c.push(this.getJsonOpacity());
        if (this.magnetismFamily != "")
            c.push(this.getJsonMagnetism());
        if (this.cpriMicrostructureFamily != "")
            c.push(this.getJsonCprimicrostructure());
        if (this.cprimicrostructureaggregateCompositionFamily != "")
            c.push(this.getJsonCprimicrostructureaggregateCompositionFamily());
        /*if (this.cprimicrostructureaggregateCompositionextensionFamily != "")
            c.push(this.getJsonCprimicrostructureaggregateCompositionextensionFamily());*/
        if (this.cprimicrostructureaggregatecompositionFamily != "")
            c.push(this.getJsonCprimicrostructureaggregateCompositionFamily());
        /*if (this.cprimicrostructureaggregatecompositionextensionFamily != "")
            c.push(this.getJsonCprimicrostructureaggregateCompositionextensionFamily());*/
        if (this.cpcompositionFamily != "")
            c.push(this.getJsonCPComposition());
        if (this.subcpcompositionFamily != "")
            c.push(this.getJsonSubcpcompositionFamily());
        if (this.subsubcpcompositionFamily != "")
            c.push(this.getJsonSubsubcpcompositionFamily());
        if (this.subcprimicrostructureaggregatecompositionFamily != "")
            c.push(this.getJsonSubcprimicrostructureaggregateCompositionFamily());
        if (this.subsubcprimicrostructureaggregatecompositionFamily != null)
            c.push(this.getJsonSubsubcprimicrostructureaggregateCompositionFamily());
        if (this.subcprimicrostructureFamily.length > 0) {
            var q = this.getJsonSubCpriMicrostructure();
            for (var i = 0; i < q.length; i++)
                c.push(q[i]);
        }
        if (this.cpcompositionextensionFamily.length > 0) {
            var q = this.getJsonCpcompositionExtension();
            for (var i = 0; i < q.length; i++)
                c.push(q[i]);
        }
        if (this.cprimicrostructureaggregatecompositionextensionFamily.length > 0) {
            var q = this.getJsonCprimicrostructureaggregateCompositionextensionFamily();
            for (var i = 0; i < q.length; i++)
                c.push(q[i]);
        }
        return c;
    }

    this.getJsonInterface = function() {
        var json = [];
        if (this.interfaceprofileFamily != "")
            json.push({'name' : this.interfaceprofileFamily});
        if (this.interfacetransitionFamily != "")
            json.push({'name' : this.interfacetransitionFamily});
        if (this.interfaceroughnessFamily != "")
            json.push({'name' : this.interfaceroughnessFamily});
        if (this.interfaceadherenceFamily != "")
            json.push({'name' : this.interfaceadherenceFamily});
        return json;
    };
};

// Corroded Metal
function CM() {
    Strata.call(this);
    ColourStrata.call(this);
    BrightnessStrata.call(this);
    OpacityStrata.call(this);
    MagnetismStrata.call(this);
    PorosityStrata.call(this);
    CpriMicrostructureStrata.call(this);
    CohesionStrata.call(this);
    HardnessStrata.call(this);
    CrackingStrata.call(this);
    CMCompositionStrata.call(this);
    InterfaceTransitionStrata.call(this);
    InterfaceRoughnessStrata.call(this);
    InterfaceAdherenceStrata.call(this);
    CMLevelOfCorrosionStrata.call(this);
    SubCMCompositionStrata.call(this);
    SubCMLevelOfCorrosionStrata.call(this);
    SubCPRIMicrostructureStrata.call(this);
    CPCompositionStrata.call(this);
    SubCpCompositionStrata.call(this);
    SubSubCpCompositionStrata.call(this);

    this.natureFamily = "Corroded metal";
    this.shortNatureFamily = "CM";
    this.natureFamilyUid = "cmCharacteristic";

    this.dependencies.push('colourFamily');
    this.dependencies.push('brightnessFamily');
    this.dependencies.push('opacityFamily');
    this.dependencies.push('magnetismFamily');
    this.dependencies.push('porosityFamily');
    this.dependencies.push('cprimicrostructureFamily');
    this.dependencies.push('cohesionFamily');
    this.dependencies.push('hardnessFamily');
    this.dependencies.push('crackingFamily');
    this.dependencies.push('cmcompositionFamily');
    this.dependencies.push('interfacetransitionFamily');
    this.dependencies.push('interfaceroughnessFamily');
    this.dependencies.push('interfaceadherenceFamily');
    this.dependencies.push('cmlevelofcorrosionFamily');
    this.dependencies.push('subcmcompositionFamily');
    this.dependencies.push('subcmlevelofcorrosionFamily');
    this.dependencies.push('subcprimicrostructureFamily');
    this.dependencies.push('cpcompositionFamily');
    this.dependencies.push('subcpcompositionFamily');
    this.dependencies.push('subsubcpcompositionFamily');

    this.getJsonCharacteristics = function() {
        var c = this.toJsonCharacteristics();
        if (this.colourFamily != "")
            c.push(this.getJsonColour());
        if (this.cohesionFamily != "")
            c.push(this.getJsonCohesion());
        if (this.hardnessFamily != "")
            c.push(this.getJsonHardness());
        if (this.crackingFamily != "")
            c.push(this.getJsonCracking());
        if (this.porosityFamily != "")
            c.push(this.getJsonPorosity());
        if (this.brightnessFamily != "")
            c.push(this.getJsonBrightness());
        if (this.opacityFamily != "")
            c.push(this.getJsonOpacity());
        if (this.magnetismFamily != "")
            c.push(this.getJsonMagnetism());
        if (this.cpriMicrostructureFamily != "")
            c.push(this.getJsonCprimicrostructure());
        if (this.cmcompositionFamily != "")
            c.push(this.getJsonCmcomposition());
        if (this.cmLevelOfCorrosionFamily != "")
            c.push(this.getJsonCmLevelOfCorrosionFamily());
        if (this.subcmcompositionFamily != "")
            c.push(this.getJsonSubCmcomposition());
        if (this.subcmLevelOfCorrosionFamily != "")
            c.push(this.getJsonSubCmLevelOfCorrosionFamily());
        if (this.cpcompositionFamily != "")
            c.push(this.getJsonCPComposition());
        if (this.subcpcompositionFamily != "")
            c.push(this.getJsonSubcpcompositionFamily());
        if (this.subsubcpcompositionFamily != "")
            c.push(this.getJsonSubsubcpcompositionFamily());
        if (this.subcprimicrostructureFamily.length > 0) {
            var q = this.getJsonSubCpriMicrostructure();
            for (var i = 0; i < q.length; i++)
                c.push(q[i]);
        }

        return c;
    }

    this.getJsonInterface = function() {
        var json = [];
        if (this.interfaceprofileFamily != "")
            json.push({'name' : this.interfaceprofileFamily});
        if (this.interfacetransitionFamily != "")
            json.push({'name' : this.interfacetransitionFamily});
        if (this.interfaceroughnessFamily != "")
            json.push({'name' : this.interfaceroughnessFamily});
        if (this.interfaceadherenceFamily != "")
            json.push({'name' : this.interfaceadherenceFamily});
        return json;
    };
};

//Metal
function M() {
    Strata.call(this);
    ColourStrata.call(this);
    BrightnessStrata.call(this);
    OpacityStrata.call(this);
    MagnetismStrata.call(this);
    PorosityStrata.call(this);
    MMicrostructureStrata.call(this);
    CohesionStrata.call(this);
    HardnessStrata.call(this);
    CrackingStrata.call(this);
    MCompositionStrata.call(this);
    SubMCompositionStrata.call(this);
    InterfaceTransitionStrata.call(this);
    InterfaceRoughnessStrata.call(this);
    InterfaceAdherenceStrata.call(this);
    SubMMicrostructureStrata.call(this);

    this.natureFamily = "Metal";
    this.shortNatureFamily = "M";
    this.natureFamilyUid = "mCharacteristic";

    this.dependencies.push('colourFamily');
    this.dependencies.push('brightnessFamily');
    this.dependencies.push('opacityFamily');
    this.dependencies.push('magnetismFamily');
    this.dependencies.push('porosityFamily');
    this.dependencies.push('mmicrostructureFamily');
    this.dependencies.push('cohesionFamily');
    this.dependencies.push('hardnessFamily');
    this.dependencies.push('crackingFamily');
    this.dependencies.push('mcompositionFamily');
    this.dependencies.push('interfacetransitionFamily');
    this.dependencies.push('interfaceroughnessFamily');
    this.dependencies.push('interfaceadherenceFamily');
    this.dependencies.push('submmicrostructureFamily');
    this.dependencies.push('submcompositionFamily');

    this.getJsonCharacteristics = function() {
        var c = this.toJsonCharacteristics();
        if (this.colourFamily != "")
            c.push(this.getJsonColour());
        if (this.cohesionFamily != "")
            c.push(this.getJsonCohesion());
        if (this.hardnessFamily != "")
            c.push(this.getJsonHardness());
        if (this.crackingFamily != "")
            c.push(this.getJsonCracking());
        if (this.porosityFamily != "")
            c.push(this.getJsonPorosity());
        if (this.brightnessFamily != "")
            c.push(this.getJsonBrightness());
        if (this.opacityFamily != "")
            c.push(this.getJsonOpacity());
        if (this.magnetismFamily != "")
            c.push(this.getJsonMagnetism());
        if (this.mmicrostructureFamily != "")
            c.push(this.getJsonMmicrostructure());
        if (this.mcompositionFamily != "")
            c.push(this.getJsonMComposition());
        if (this.submcompositionFamily != "")
            c.push(this.getJsonSubMComposition());
        //if (this.submcompositionFamily != "")
        //    c.push(this.getJsonSubMComposition());
        /*if (this.submmicrostructureFamily != "")
            c.push(this.getJsonSubmmicrostructure());*/
        if (this.submmicrostructureFamily.length > 0) {
            var q = this.getJsonSubmmicrostructure();
            for (var i = 0; i < q.length; i++)
                c.push(q[i]);
        }
        return c;
    }

    this.getJsonInterface = function() {
        var json = [];
        if (this.interfaceprofileFamily != "")
            json.push({'name' : this.interfaceprofileFamily});
        if (this.interfacetransitionFamily != "")
            json.push({'name' : this.interfacetransitionFamily});
        if (this.interfaceroughnessFamily != "")
            json.push({'name' : this.interfaceroughnessFamily});
        if (this.interfaceadherenceFamily != "")
            json.push({'name' : this.interfaceadherenceFamily});
        return json;
    };
};
