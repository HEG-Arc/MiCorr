:param common_props {version:9, date:"2021-01-03"}

/**************************
// MC-384 Composition update

data set generated with notebooks/MetalPAT_import_new_characteristics_from_csv.ipynb
based on google sheet [https://docs.google.com/spreadsheets/d/1TAXM1qKFOoqlx5MwpVYnh2dSFWaZyumvk-ohkVOcGew/edit#gid=1581905147]
export to csv and html
 */

//FAMILY

WITH 1 as binocular, 2 as cross_section
UNWIND [
// Observation: binocular
// new family_name=Material uid: compositionMaterialFamily
{fg:'fgComposition', order:1, observation:binocular, uid:'compositionMaterialFamily', name:'Material', visible: False, variable: False, description:'Compound constituting either NMM or POM', natures:['nmm', 'pom']},
// new family_name=Main element(s) uid: compositionMainElementsFamily
{fg:'fgComposition', order:2, observation:binocular, uid:'compositionMainElementsFamily', name:'Main element(s)', visible: False, variable: False, description:'Determined in the observed area. Only the family element(s) should be given.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], list_elem_family:'elementFamily', upto:0},
// new family_name=Secondary element(s) uid: compositionSecondaryElementsFamily
{fg:'fgComposition', order:3, observation:binocular, uid:'compositionSecondaryElementsFamily', name:'Secondary element(s)', visible: False, variable: False, description:'Any other element(s) having a concentration greater than 1% (in weight) and / or affecting the properties of the CP.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], list_elem_family:'elementFamily', upto:0},
// new fieldset=Compounds
{fg:'fgComposition', order:5, observation:binocular, uid:'compositionCompoundsXrdFamily', name:'XRD', visible: False, variable: False, description:'Formula.', natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], fieldset:'Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:6, observation:binocular, uid:'compositionCompoundsRamanSpectroscopyFamily', name:'Raman spectroscopy', visible: False, variable: False, description:'Formula.', natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], fieldset:'Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:7, observation:binocular, uid:'compositionCompoundsFtirFamily', name:'FTIR', visible: False, variable: False, description:'Formula.', natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], fieldset:'Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:8, observation:binocular, uid:'compositionCompoundsOthersFamily', name:'Others', visible: False, variable: False, description:'Formula.', natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], fieldset:'Compounds', list_elem_family:'compoundFamily', upto:1},
// new family_name=M/CP Ratio uid: compositionMcpRatioFamily
{fg:'fgComposition', order:9, observation:binocular, uid:'cmCorrosionRatioFamily', name:'M/CP Ratio', visible: False, variable: False, description:'', natures:['cm'], new_uid:'compositionMcpRatioFamily'},
// new family_name=Additional element(s) uid: compositionAdditionalElementsFamily
{fg:'fgComposition', order:10, observation:binocular, uid:'compositionAdditionalElementsFamily', name:'Additional element(s)', visible: False, variable: False, description:'Any other element(s) not reported in main and secondary element(s). For CM, any element(s) not in M and CP.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], list_elem_family:'elementFamily', upto:0},
// new fieldset=Second band / aggregate_compounds
{fg:'fgComposition', order:15, observation:binocular, uid:'compositionSecondBandAggregateCompoundsXrdFamily', name:'XRD', visible: False, variable: False, description:'Formula.', natures:['cp'], fieldset:'Second band / aggregate_compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:16, observation:binocular, uid:'compositionSecondBandAggregateCompoundsRamanSpectroscopyFamily', name:'Raman spectroscopy', visible: False, variable: False, description:'Formula.', natures:['cp'], fieldset:'Second band / aggregate_compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:17, observation:binocular, uid:'compositionSecondBandAggregateCompoundsFtirFamily', name:'FTIR', visible: False, variable: False, description:'Formula.', natures:['cp'], fieldset:'Second band / aggregate_compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:18, observation:binocular, uid:'compositionSecondBandAggregateCompoundsOthersFamily', name:'Others', visible: False, variable: False, description:'Formula.', natures:['cp'], fieldset:'Second band / aggregate_compounds', list_elem_family:'compoundFamily', upto:1},
// new fieldset=Second band / aggregate
// new family_name=Second band / aggregate uid: compositionSecondBandAggregateFamily
{fg:'fgComposition', order:20, observation:binocular, uid:'compositionSecondBandAggregateAdditionalElementsFamily', name:'additional element(s)', visible: False, variable: False, description:'Any other element(s) not reported in main and secondary element(s).', natures:['cp'], fieldset:'Second band / aggregate', list_elem_family:'elementFamily', upto:0},
// Observation: cross_section
// new fieldset=Main element(s)
{fg:'fgComposition', order:2, observation:cross_section, uid:'compositionMainElementsListCSFamily', name:'List', visible: False, variable: False, description:'Determined in the observed area. Only the family element(s) should be given.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Main element(s)', list_elem_family:'elementFamily', upto:0},
{fg:'fgComposition', order:3, observation:cross_section, uid:'compositionMainElementsAmountCSVarFamily', name:'Amount', visible: False, variable: True, description:'In % (mass).', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'%', fieldset:'Main element(s)'},
// new fieldset=Secondary element(s)
{fg:'fgComposition', order:5, observation:cross_section, uid:'compositionSecondaryElementsListCSFamily', name:'List', visible: False, variable: False, description:'Any other element(s) having a concentration greater than 1% (in weight) and / or affecting the properties of the CP.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Secondary element(s)', list_elem_family:'elementFamily', upto:0},
{fg:'fgComposition', order:6, observation:cross_section, uid:'compositionSecondaryElementsAmountCSVarFamily', name:'Amount', visible: False, variable: True, description:'In % (mass).', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'%', fieldset:'Secondary element(s)'},
// new fieldset=Compounds
{fg:'fgComposition', order:8, observation:cross_section, uid:'compositionCompoundsXrdCSFamily', name:'XRD', visible: False, variable: False, description:'Formula.', natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], fieldset:'Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:9, observation:cross_section, uid:'compositionCompoundsRamanSpectroscopyCSFamily', name:'Raman spectroscopy', visible: False, variable: False, description:'Formula.', natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], fieldset:'Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:10, observation:cross_section, uid:'compositionCompoundsFtirCSFamily', name:'FTIR', visible: False, variable: False, description:'Formula.', natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], fieldset:'Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:11, observation:cross_section, uid:'compositionCompoundsOthersCSFamily', name:'Others', visible: False, variable: False, description:'Formula.', natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], fieldset:'Compounds', list_elem_family:'compoundFamily', upto:1},
// new fieldset=Additional element(s)
{fg:'fgComposition', order:13, observation:cross_section, uid:'compositionAdditionalElementsListCSFamily', name:'List', visible: False, variable: False, description:'Any other element(s) not reported in main and secondary element(s). For CM, any element(s) not in M and CP.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], fieldset:'Additional element(s)', list_elem_family:'elementFamily', upto:0},
{fg:'fgComposition', order:14, observation:cross_section, uid:'compositionAdditionalElementsAmountCSVarFamily', name:'Amount', visible: False, variable: True, description:'In % (mass).', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'%', fieldset:'Additional element(s)'},
{fg:'fgComposition', order:15, observation:cross_section, uid:'compositionAdditionalElementsMAmountCSVarFamily', name:'M Amount', visible: False, variable: True, description:'In M part of CM, in % (mass).', natures:['cm'], unit:'%', fieldset:'Additional element(s)'},
{fg:'fgComposition', order:16, observation:cross_section, uid:'compositionAdditionalElementsCpAmountCSVarFamily', name:'CP Amount', visible: False, variable: True, description:'In CP part of CM, in % (mass).', natures:['cm'], unit:'%', fieldset:'Additional element(s)'},
{fg:'fgComposition', order:17, observation:cross_section, uid:'compositionAdditionalElementsAggAmountCSVarFamily', name:'Agg Amount', visible: False, variable: True, description:'In  aggregate(s) of CM, in % (mass).', natures:['cm'], unit:'%', fieldset:'Additional element(s)'},
// new fieldset=Second band / aggregate_main element(s)
{fg:'fgComposition', order:19, observation:cross_section, uid:'compositionSecondBandAggregateMainElementsListCSFamily', name:'List', visible: False, variable: False, description:'Only the family element(s) should be given.', natures:['cp'], fieldset:'Second band / aggregate_main element(s)', list_elem_family:'elementFamily', upto:0},
{fg:'fgComposition', order:20, observation:cross_section, uid:'compositionSecondBandAggregateMainElementsAmountCSVarFamily', name:'Amount', visible: False, variable: True, description:'In % (mass).', natures:['cp'], unit:'%', fieldset:'Second band / aggregate_main element(s)'},
// new fieldset=Second band / aggregate_secondary element(s)
{fg:'fgComposition', order:22, observation:cross_section, uid:'compositionSecondBandAggregateSecondaryElementsListCSFamily', name:'List', visible: False, variable: False, description:'Any other element(s) having a concentration greater than 1% (in weight) and / or affecting the properties of the CP.', natures:['cp'], fieldset:'Second band / aggregate_secondary element(s)', list_elem_family:'elementFamily', upto:0},
{fg:'fgComposition', order:23, observation:cross_section, uid:'compositionSecondBandAggregateSecondaryElementsAmountCSVarFamily', name:'Amount', visible: False, variable: True, description:'In % (mass).', natures:['cp'], unit:'%', fieldset:'Second band / aggregate_secondary element(s)'},
// new fieldset=Second band / aggregate_Compounds
{fg:'fgComposition', order:25, observation:cross_section, uid:'compositionSecondBandAggregateCompoundsXrdCSFamily', name:'XRD', visible: False, variable: False, description:'Formula.', natures:['cp'], fieldset:'Second band / aggregate_Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:26, observation:cross_section, uid:'compositionSecondBandAggregateCompoundsRamanSpectroscopyCSFamily', name:'Raman spectroscopy', visible: False, variable: False, description:'Formula.', natures:['cp'], fieldset:'Second band / aggregate_Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:27, observation:cross_section, uid:'compositionSecondBandAggregateCompoundsFtirCSFamily', name:'FTIR', visible: False, variable: False, description:'Formula.', natures:['cp'], fieldset:'Second band / aggregate_Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:28, observation:cross_section, uid:'compositionSecondBandAggregateCompoundsOthersCSFamily', name:'Others', visible: False, variable: False, description:'Formula.', natures:['cp'], fieldset:'Second band / aggregate_Compounds', list_elem_family:'compoundFamily', upto:1},
{fg:'fgComposition', order:29, observation:cross_section, uid:'compositionSecondBandAggregateCompoundsListCSFamily', name:'List', visible: False, variable: False, description:'Any other element(s) not reported in main and secondary element(s).', natures:['cp'], fieldset:'Second band / aggregate_Compounds', list_elem_family:'elementFamily', upto:0},
{fg:'fgComposition', order:30, observation:cross_section, uid:'compositionSecondBandAggregateCompoundsAmountCSVarFamily', name:'Amount', visible: False, variable: True, description:'In % (mass).', natures:['cp'], unit:'%', fieldset:'Second band / aggregate_Compounds'},
{fg:'fgComposition', order:1, observation:cross_section, uid:'compositionMaterialCSFamily', name:'Material', visible: False, variable: False, description:'', natures:['nmm', 'pom']}
] as updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset
    WITH f, updt
        MATCH (a:FamilyGroup {uid: updt.fg})
        WITH f, a, updt
            MERGE (a)-[:SHOWS]->(f)
            WITH f,updt
                UNWIND updt.natures AS nature
                MATCH (n:Nature {uid:nature})
                MERGE (n)-[:HAS_FAMILY]->(f)
                WITH  f, updt
                    MATCH (ef:Family {uid: updt.list_elem_family})
                    MERGE (f)-[r:IS_LIST_OF {upto: updt.upto}]->(ef)
    RETURN f;

// UnShow obsolete families now replaced by single compositionFamily
UNWIND [
'sCompositionFamily',
'nmmCompositionFamily',
'dCompositionFamily',
'pomCompositionFamily']
AS uid
    MATCH (fg:FamilyGroup {uid:'fgComposition'})-[r:SHOWS]->(f:Family {uid:uid})
        DELETE r
        RETURN f;

// Delete compositionFamily and its characteristics that has been replaced by compositionMaterialFamily
MATCH (fg:FamilyGroup {uid:'fgComposition'})-[r:SHOWS]->(f:Family {uid:'compositionFamily'})<-[:BELONGS_TO]-(c:Characteristic)
DETACH DELETE c;

MATCH (fg:FamilyGroup {uid:'fgComposition'})-[r:SHOWS]->(f:Family {uid:'compositionFamily'})
DETACH DELETE f;



/* Binocular and Cross-section composition characteristics:
import_family_group('Composition',filter_observation='Binocular', fieldsets=['Second band / aggregate'])
*/

UNWIND [
{family_uid:'compositionCompoundsFamily', uid:'compositionCompoundsTechniquesCharacteristic', name:'Techniques', order:1, natures:['cp','deposit','nmm', 'pom', 'soil']},
{family_uid:'compositionAdditionalElementsFamily', uid:'compositionSecondBandAggregateCompoundCharacteristic', name:'compound', order:2, natures:['cp'], description:'Formula of the CP(s) deduced from its (their) main and secondary element(s).'},
{family_uid:'compositionAdditionalElementsFamily', uid:'compositionSecondBandAggregateTechniquesCharacteristic', name:'Techniques', order:3, natures:['cp']},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialBoneCharacteristic', name:'Bone', order:1, natures:['nmm', 'pom'], description:'Rigid organ that constitutes part of the vertebrate skeleton in animals.'},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialEnamelCharacteristic', name:'Enamel', order:2, natures:['nmm'], description:'Opaque or semi-transparent glossy substance that is a type of glass, applied by vitrification to metallic surfaces for ornament or as a protective coating.'},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialLeatherCharacteristic', name:'Leather', order:3, natures:['nmm', 'pom'], description:'Organic material created by tanning of animals skin.'},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialNielloCharacteristic', name:'Niello', order:4, natures:['nmm'], description:'Black compound of sulphur with silver, lead, or copper, used for filling in engraved designs in silver or other metals.'},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialPaintCharacteristic', name:'Paint', order:5, natures:['nmm'], description:'Pigmented material applied as a thin layer and forming a solid film.'},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialTextileCharacteristic', name:'Textile', order:6, natures:['nmm', 'pom'], description:'Flexible material composed of a network of artificial or natural fibers.'},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialWaxCharacteristic', name:'Wax', order:7, natures:['nmm'], description:'Organic compound, lipophilic, malleable, solid at ambient temperatures and melts above about 40°C. Insoluble in water, but soluble in nonpolar, organic solvents. Can be produced by plants, animals or with artificial material.'},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialWoodCharacteristic', name:'Wood', order:8, natures:['nmm', 'pom'], description:'Porous and fibrous structure founds in trees and plants.'},
{family_uid:'compositionMaterialFamily', uid:'compositionMaterialOtherCharacteristic', name:'Other', order:9, natures:['nmm']},
// new fieldset=Compounds
{family_uid:'cmCorrosionRatioFamily', uid:'r1', name:'Low', order:10, natures:['cm'], new_uid:'compositionMcpRatioLowCharacteristic'},
{family_uid:'cmCorrosionRatioFamily', uid:'r2', name:'Average', order:11, natures:['cm'], new_uid:'compositionMcpRatioAverageCharacteristic'},
{family_uid:'cmCorrosionRatioFamily', uid:'r3', name:'High', order:12, natures:['cm'], new_uid:'compositionMcpRatioHighCharacteristic'},
{family_uid:'compositionMaterialCSFamily', uid:'compositionMaterialBoneCSCharacteristic', name:'Bone', order:1, natures:['nmm', 'pom'], description:'Rigid organ that constitutes part of the vertebrate skeleton in animals.'},
{family_uid:'compositionMaterialCSFamily', uid:'compositionMaterialEnamelCSCharacteristic', name:'Enamel', order:2, natures:['nmm'], description:'Opaque or semi-transparent glossy substance that is a type of glass, applied by vitrification to metallic surfaces for ornament or as a protective coating.'},
{family_uid:'compositionMaterialCSFamily', uid:'compositionMaterialLeatherCSCharacteristic', name:'Leather', order:3, natures:['nmm', 'pom'], description:'Organic material created by tanning of animals skin.'},
{family_uid:'compositionMaterialCSFamily', uid:'compositionMaterialNielloCSCharacteristic', name:'Niello', order:4, natures:['nmm'], description:'Black compound of sulphur with silver, lead, or copper, used for filling in engraved designs in silver or other metals.'},
{family_uid:'compositionMaterialCSFamily', uid:'compositionMaterialPaintCSCharacteristic', name:'Paint', order:5, natures:['nmm'], description:'Pigmented material applied as a thin layers and forming a solid film.'},
{family_uid:'compositionMaterialCSFamily', uid:'compositionMaterialTextileCSCharacteristic', name:'Textile', order:6, natures:['nmm', 'pom'], description:'Flexible material composed of a network of artificial or natural fibers.'},
{family_uid:'compositionMaterialCSFamily', uid:'compositionMaterialWaxCSCharacteristic', name:'Wax', order:7, natures:['nmm'], description:'Organic compound, lipophilic, malleable, solid at ambient temperatures and melt above about 40°C. Insoluble in water, but soluble in nonpolar, organic solvents. Can be produced by plants, animals or with artificial material.'}

] AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url
  WITH c,updt
  MATCH (f:Family {uid:updt.family_uid})
  MERGE (c)-[:BELONGS_TO]->(f)
  WITH c,updt
   UNWIND updt.natures AS nature
     MATCH (n:Nature {uid:nature})
     MERGE (n)-[:HAS]->(c)
  RETURN n,c;


 //Composition Binocular SUBCHARACTERISTICS
UNWIND [
{parent_uid:'compositionCompoundsTechniquesCharacteristic', uid:'compositionCompoundsTechniquesXrdCharacteristic', name:'XRD', variable:False, order:1, natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], list_elem_family:'compoundFamily', upto:1},
{parent_uid:'compositionCompoundsTechniquesCharacteristic', uid:'compositionCompoundsTechniquesRamanSpectroscopyCharacteristic', name:'Raman spectroscopy', variable:False, order:2, natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], list_elem_family:'compoundFamily', upto:1},
{parent_uid:'compositionCompoundsTechniquesCharacteristic', uid:'compositionCompoundsTechniquesFtirCharacteristic', name:'FTIR', variable:False, order:3, natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], list_elem_family:'compoundFamily', upto:1},
{parent_uid:'compositionCompoundsTechniquesCharacteristic', uid:'compositionCompoundsTechniquesOthersCharacteristic', name:'Others', variable:False, order:4, natures:['cp', 'deposit', 'nmm', 'pom', 'soil'], list_elem_family:'compoundFamily', upto:1},
{parent_uid:'compositionSecondBandAggregateTechniquesCharacteristic', uid:'compositionSecondBandAggregateTechniquesXrdCharacteristic', name:'XRD', variable:False, order:1, natures:['cp'], list_elem_family:'compoundFamily', upto:1},
{parent_uid:'compositionSecondBandAggregateTechniquesCharacteristic', uid:'compositionSecondBandAggregateTechniquesRamanSpectroscopyCharacteristic', name:'Raman spectroscopy', variable:False, order:2, natures:['cp'], list_elem_family:'compoundFamily', upto:1},
{parent_uid:'compositionSecondBandAggregateTechniquesCharacteristic', uid:'compositionSecondBandAggregateTechniquesFtirCharacteristic', name:'FTIR', variable:False, order:3, natures:['cp'], list_elem_family:'compoundFamily', upto:1},
{parent_uid:'compositionSecondBandAggregateTechniquesCharacteristic', uid:'compositionSecondBandAggregateTechniquesOthersCharacteristic', name:'Others', variable:False, order:4, natures:['cp'], list_elem_family:'compoundFamily', upto:1}
 ] AS updt
  MERGE (sc:SubCharacteristic {uid: updt.uid})
    ON CREATE SET sc+=$common_props, sc.name = updt.name, sc.description = updt.description, sc.order = updt.order, sc.variable = updt.variable, sc.unit = updt.unit
    ON MATCH SET sc.name = updt.name, sc.description = updt.description, sc.order = updt.order, sc.variable = updt.variable, sc.unit = updt.unit
  WITH sc,updt
    MATCH (c:Characteristic {uid:updt.parent_uid})
    MERGE (c)-[:HAS_SPECIALIZATION]->(sc)
 WITH  sc, updt
    MATCH (ef:Family {uid: updt.list_elem_family})
    MERGE (sc)-[r:IS_LIST_OF {upto: updt.upto}]->(ef)
    WITH sc,updt
        UNWIND updt.natures AS nature
        MATCH (n:Nature {uid:nature})
            MERGE (n)-[:HAS]->(sc)
    RETURN n,sc;

