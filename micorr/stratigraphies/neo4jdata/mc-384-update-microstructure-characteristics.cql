:param common_props {version:7, date:"2020-08-27"}

/**************************
// MC-384 Mirostructure update with images and add support for select hierarchy with optgroup in characteristics

data set generated with notebooks/MetalPAT_import_new_characteristics_from_csv.ipynb
based on google sheet [https://docs.google.com/spreadsheets/d/1TAXM1qKFOoqlx5MwpVYnh2dSFWaZyumvk-ohkVOcGew/edit#gid=1581905147]
export to csv and html
 */

WITH 1 as binocular, 2 as cross_section
UNWIND [
{fg:'fgMicrostructure', order:1, observation:binocular, uid:'microstructureFamily', name:'Microstructure', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which microstructure is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{fg:'fgMicrostructure', order:1, observation:cross_section, uid:'microstructureCSFamily', name:'Microstructure', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which microstructure is not known.', natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']}
] as updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description
WITH f, updt
MATCH (a:FamilyGroup {uid: updt.fg})
WITH f, a
MERGE (a)-[:SHOWS]->(f)
RETURN a,f;

/* Binocular microstructureFamily characteristics:
import_family_group('Microstructure', filter_observation='Binocular', fieldsets=[],optgroups=['Crystalline microstructure'], filter_print=CHARACTERISTIC, shared_sub_characteristics=True)
*/
UNWIND [
{family_uid:'microstructureFamily', uid:'microstructureBlankCharacteristic', name:'Blank', order:1, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'microstructureFamily', uid:'microstructureAlternativeBandsCharacteristic', name:'Alternative bands', order:2, natures:['cp'], description:'Occurrence of several alternately repeating layers of corrosion products of different composition.'},
/* microstructureCrystallineMicrostructureCharacteristic is an optgroup only not a characteristic in binocular
{family_uid:'microstructureFamily', uid:'microstructureCrystallineMicrostructureCharacteristic', name:'Crystalline microstructure', order:3, natures:['cp', 'deposit', 'metal'], description:'Presence of crystalline aggregates. The blank option corresponds to a stratum which crystalline microstructure is not known.'},
*/
/* microstructureCrystallineMicrostructureCharacteristic optgroup options: */
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureBlankCharacteristic', name:'Blank', order:4, natures:['cp', 'deposit', 'metal'], optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureBandedCharacteristic', name:'Banded', order:5, natures:['cp', 'deposit'], description:'Formed from layers superimposed on each other.', image_url:'https://lh4.googleusercontent.com/fdYPf57cIFWtdMmNrX1TrRNsVn3vmEIPkma9u57vPAOZ2V7kHqnEcyAs7W4JMAekIbNj18IY9dFmDRLY39BKEOCfN4Xcp3rQbPkLf0D-o2y5Y2sxcVGnESgRvDYktMVsI_LE_zwJtw=w126-h119', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureBotryoidalCharacteristic', name:'Botryoidal', order:6, natures:['cp', 'deposit'], description:'Spherical in shape forming groups of crystals in the manner of a bunch of grapes.', image_url:'https://lh5.googleusercontent.com/i4g_3cUyoX1m7PWIrJOQVl-TbXIbTnBz41b83SllOGO0W2lv0pd0vmZA1SeZGeCjTTTjY9AvviqrAKsopsTeq-GhMVTLJx1yptb_QpvzjvYcl66LIpECe4wv8HXu0Hwkp4gr8q-r5w=w126-h119', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureConcentricCharacteristic', name:'Concentric', order:7, natures:['cp', 'deposit'], description:'Formed of more or less spherical layers superimposed one on top of the other around a centre.', image_url:'https://lh6.googleusercontent.com/72GfWaDDYl2KtElaU2BbpDyqe00EUlncq-FlZqO21pZTNzGyO3h6pHNZGblX5yoSrKluyTl1kZ9zLY41hXq5iRVtjVoev0t1Hx6HzemtOqcM-5vVu8sQBD5BkU1fYjK-iLnLTPf-0A=w126-h119', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureDendriticCharacteristic', name:'Dendritic', order:8, natures:['cp', 'deposit'], description:'Formed from crystals of protrusions, assembled dendrite (in the shape of a fern, of trees).', image_url:'https://lh6.googleusercontent.com/zFdJCGpMpuNKit_YfodsttD9erbjRH_qkqHSE-3g-dl5rZEgzgQ5eJI2SFKIlgNAQ-zvvfOlVqv1DJb2ctYXK_oF-hHdhy-I_VNIE8b_7KsaRC--TzouMeHSMBTqI7b4jghrnVWP0A=w126-h119', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureDrusyAggregateCharacteristic', name:'Drusy aggregate', order:9, natures:['cp', 'deposit'], description:'Aggregate formed of protruding crystals lining a surface.', image_url:'https://lh6.googleusercontent.com/eFcnIRjj6QWFDmsVQoyCxBMmT1wXXIS4TqtCXMMmMC-4r1n-UB2wB8xSMyi4k-UF3-ulhqXrD6aTZ4Y0XAiTQF63c0fMOHnbV8CCrFAsG04tB3lCrZP9vO-HObEEw9jDtbGNQUUKPA=w126-h107', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureFibrousCharacteristic', name:'Fibrous', order:10, natures:['cp', 'deposit'], description:'Formed of elongated, capillary, parallel included crystals. They can be curved.', image_url:'https://lh6.googleusercontent.com/qM52BaYNjLdqNXtc-POMWe4wd-gZzSbo3MzUIQgtKVQhwJKDmcHreBPLpRydTTFlstRuzOv3qE4nSmnOEWFDD00-1-AxXLJX8C4A0rWaapWAx0XrBVkvKbCCuWULImcinQX__14qtQ=w126-h111', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureFoliatedCharacteristic', name:'Foliated', order:11, natures:['cp', 'deposit'], description:'Formed from tabular enclosed crystals in the form of easily separable platelets or superimposed laminae.', image_url:'https://lh5.googleusercontent.com/FwLc8PsH_yPdhx1Xszp5LK6NUrV2hCN72C94nskeoFnR8BodMYRFBz4IOTKFIL4TfwNTgFu-7Az0KSLmRljJdI9S7Wb8--GYwIoV1UW9h0_-pGlK-LejDNjEdO1NMfnFiQMfiYVv0A=w126-h137', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureGéodeCharacteristic', name:'Géode', order:12, natures:['cp', 'deposit'], description:'Aggregate formed of protruding crystals lining a cavity.', image_url:'https://lh3.googleusercontent.com/RzYba3qdUOG21kO2VYznO4AYAPi0CvrluuunlGym2JeMhUCjaw-O8kYRa4oxSD4jHWfZb14GGS41IB_OcxpbOLl3N7tx_FrrN_lNM-LYWMQpWho9LHANvrMxUxjW2_j0D_rS66rDTg=w126-h137', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureGlobularCharacteristic', name:'Globular', order:13, natures:['cp', 'deposit'], description:'Spherical or hemispherical shape. When the crystals globules are superimposed, the aggregate becomes reniform or botryoidal.', image_url:'https://lh4.googleusercontent.com/0YlQymWECiZ2VxzFDAT_nqfSS7cK3Ez2uMIhZ88x58AQEiUoQdsAald10rZwhKPeySjxYa77SMg8K3VytIFlXU04BFfSpHxvmvwQ01YFKnbZs93pU3oABkV6C88k267QBo-FrdlNOA=w126-h134', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureGranularCharacteristic', name:'Granular', order:14, natures:['cp', 'deposit'], description:'Compact material having facets of crystals included on the surface.', image_url:'https://lh4.googleusercontent.com/0wfF-nBStQ6k-8NK1vb16rP8y7LedIzBIiwqzs2WWWpg3ZS8fAh19WYkdXFh_KbEjniZlWyra2yQpaUUVejfHRNONyD9N-q-j6QhbsvoePqlkuicmrDBt6gQxQ1wQygr8nY_ssIVkg=w126-h134', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureLamellarCharacteristic', name:'Lamellar', order:15, natures:['cp', 'deposit'], description:'Formed from tabular plate-like embedded crystals superimposed and adhering to each other.', image_url:'https://lh5.googleusercontent.com/c4jNRGFd3E7gKN3fqN1WPSXze5jihOZ_Q0O2AVqNgQJXK3vzta-zKkuF6cCH8IKF-DpyNFx6UKCEeZKtQ7-NP8z2yQ8XSwzj6E10Cp69oYKjIlZGp9_Uk9FXC0TdXXfNdeUjxu7PQQ=w126-h134', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureMassiveCharacteristic', name:'Massive', order:16, natures:['cp', 'deposit'], description:'Compact material without visible crystalline organization.', image_url:'https://lh3.googleusercontent.com/6E60izC1kDN1GgdG1nv3YU1tnCRbtngsTB2Q8RJT5Rfb1fSBmaVmYtW6Q1whoT2GjIJkm_1_TrO9wZVjNOPEsltHHY4tp12BL6FLsgxxtRHosqymI76EhSfsE51p9PDQQDWLobVxVw=w126-h132', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructurePowderyCharacteristic', name:'Powdery', order:17, natures:['cp', 'deposit', 'metal'], description:'Powder-like material of low to very low cohesion.', image_url:'https://lh4.googleusercontent.com/nHoRxn49ZYD-ctHLMIplygBvzwB6nt_m_QiII2rHRVkIYLTNp0lrd4_TyZw66RUGCnOc9emc81aeymZnlX455UpziRhkjDyMC-rYeCPZM0My6WexEBFiE7a5AW-tO8bHkP6pJRqRTg=w126-h132', optgroup:'Crystalline microstructure', old_uid:'powderyCharacteristic'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureReniformCharacteristic', name:'Reniform', order:18, natures:['cp', 'deposit'], description:'With a surface that has nipples like a kidney.', image_url:'https://lh6.googleusercontent.com/NlZNaHqjeaSlYYyex9EUVDLuvhcXMh21qXi4aYozhPcDvJ-fvf2z51dOXDubawCiSBZmSFmmacPBbKK7CElSSS9z3XAva-rhv4Q41XVEG7F_vGsMqqBTxq0gMAIVky58uHYP1YWvrg=w126-h132', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureStalactiformCharacteristic', name:'Stalactiform', order:19, natures:['cp', 'deposit'], description:'In the form of stalactite or stalagmite.', image_url:'https://lh6.googleusercontent.com/FUMP-RidQ-aPB2cguWzBNRmRFC188oJOxiH4FUISamIG3_qCSSrBhCwKTANPLiIuggI1LfuLewaZuyqrFaMPSq_J07j65HP8IPstqZZwo0mvM9LCUgbiRhIbjrnbwR-nbUqqh3HpjA=w126-h132', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'crystallineMicrostructureStellatedCharacteristic', name:'Stellated', order:20, natures:['cp', 'deposit'], description:'Formed from acicular elongated embedded crystals or radiant capillaries.', image_url:'https://lh4.googleusercontent.com/8bCBNYJAYiSy_pvT8olupFZMuvdFcCUR8xdiHhLnbj-CSeNByvlQn8-877_VswxhjkKbTAASX93zEZ625R9LLp44XAaIeMVd065Ks8c339npBdrlZloEzBUrx3ZFMQjgR5UaD8fogg=w126-h132', optgroup:'Crystalline microstructure'},
{family_uid:'microstructureFamily', uid:'microstructureDendritesCharacteristic', name:'Dendrites', order:21, natures:['metal'], description:'Stratum containing crystals in the form of trees with branches.'},
{family_uid:'microstructureFamily', uid:'microstructureEquiaxeGrainsCharacteristic', name:'Equiaxe grains', order:22, natures:['metal'], description:'Stratum consisting of equiaxed grains.'},
{family_uid:'microstructureFamily', uid:'microstructureIsolatedAggregateMicrostructureCharacteristic', name:'Isolated aggregate microstructure', order:23, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing one or more aggregate(s) having a minority volume over the area observed.'},
{family_uid:'microstructureFamily', uid:'microstructurePseudomorphOfDendriticMicrostructureCharacteristic', name:'Pseudomorph of dendritic microstructure', order:24, natures:['cp'], description:'Microstructure formed by selective replacement of dendritic and interdendritic zones. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the dendritic microstructure of the original metal.'},
{family_uid:'microstructureFamily', uid:'microstructurePseudomorphOfGrainMicrostructureCharacteristic', name:'Pseudomorph of grain microstructure', order:25, natures:['cp'], description:'Microstructure formed by selective replacement of grains and grain boundaries. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the grain microstructure of the original metal.'},
{family_uid:'microstructureFamily', uid:'microstructureScatteredAggregateMicrostructureCharacteristic', name:'Scattered aggregate microstructure', order:26, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing numerous aggregates separated from each other and distributed over the observed area.'},
{family_uid:'microstructureFamily', uid:'microstructureClayCharacteristic', name:'Clay', order:27, natures:['soil'], description:'< 0,01 mm. Plasticity. High kneading resistance. Sticky when wet. Very hard when dry.'},
{family_uid:'microstructureFamily', uid:'microstructureCoarseSandsCharacteristic', name:'Coarse sands', order:28, natures:['soil'], description:'0,4 to 2 mm. Crumbling.'},
{family_uid:'microstructureFamily', uid:'microstructureFineSandsCharacteristic', name:'Fine sands', order:29, natures:['soil'], description:'0,08 to 0,4 mm. Easily malleable. No plasticity. Soft touch, Dusty in dry state.'},
{family_uid:'microstructureFamily', uid:'microstructureGravelCharacteristic', name:'Gravel', order:30, natures:['soil'], description:'2 to 20 mm.'},
{family_uid:'microstructureFamily', uid:'microstructureLimonsCharacteristic', name:'Limons', order:31, natures:['soil'], description:'0,01 to 0,08 mm. Easily malleable. No plasticity Soft touch, Dusty in dry state'},
{family_uid:'microstructureFamily', uid:'microstructurePebblesCharacteristic', name:'Pebbles', order:32, natures:['soil'], description:'20 to 75 mm.'}
]
AS updt MERGE (c:Characteristic {uid: updt.uid})
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

// Delete  Characteristics wrongly added in commit 13aeb0d1

UNWIND ['microstructureLenticularCharacteristic',
'lenticularCharacteristic',
'lensShapedCharacteristic',
'microstructureHexagonalMicrostructureCharacteristic',
'microstructureStructuralVoidCharacteristic']
as uid MATCH (n:Characteristic {uid:uid}) DETACH DELETE n;

//Cross-Section CHARACTERISTICS
UNWIND [
{family_uid:'microstructureCSFamily', uid:'microstructureBlankCSCharacteristic', name:'Blank', order:1, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'microstructureCSFamily', uid:'microstructureAlternativeBandsCSCharacteristic', name:'Alternative bands', order:2, natures:['cp', 'metal'], description:'Occurrence of several alternately repeating layers of corrosion products of different composition.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCrystallineMicrostructureCSCharacteristic', name:'Crystalline microstructure', order:3, natures:['cp'], description:'Presence of crystalline aggregates.'},
{family_uid:'microstructureCSFamily', uid:'microstructureDeformedDendritesCSCharacteristic', name:'Deformed dendrites', order:4, natures:['metal'], description:'Stratum containing crystals in the form of deformed trees with branches.'},
{family_uid:'microstructureCSFamily', uid:'microstructureDendritesCSCharacteristic', name:'Dendrites', order:5, natures:['metal'], description:'Stratum containing crystals in the form of trees with branches.'},
{family_uid:'microstructureCSFamily', uid:'microstructureElongatedGrainsCSCharacteristic', name:'Elongated grains', order:6, natures:['metal'], description:'Stratum consisting of grains elongated in one or several direction(s).'},
{family_uid:'microstructureCSFamily', uid:'microstructureEquiaxeGrainsCSCharacteristic', name:'Equiaxe grains', order:7, natures:['metal'], description:'Stratum consisting of equiaxed grains.'},
{family_uid:'microstructureCSFamily', uid:'microstructureIsolatedAggregateMicrostructureCSCharacteristic', name:'Isolated aggregate microstructure', order:8, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing one or more aggregate(s) having a minority volume over the area observed.'},
{family_uid:'microstructureCSFamily', uid:'microstructureIsolatedAggregateMicrostructureInCpCSCharacteristic', name:'Isolated aggregate microstructure in CP', order:9, natures:['cm'], description:'CP section of the stratum containing one or more aggregate(s) having a minority volume over the area observed.'},
{family_uid:'microstructureCSFamily', uid:'microstructureNoMicrostructureVisibleAtThisObservationScaleCSCharacteristic', name:'No microstructure visible at this observation scale', order:10, natures:['cp', 'metal']},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', name:'Pseudomorph of dendritic microstructure', order:11, natures:['cp'], description:'Microstructure formed by selective replacement of dendritic and interdendritic zones. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the dendritic microstructure of the original metal.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', name:'Pseudomorph of grain microstructure', order:12, natures:['cp'], description:'Microstructure formed by selective replacement of grains and grain boundaries. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the grain microstructure of the original metal.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfOrganicMaterialCSCharacteristic', name:'Pseudomorph of organic material', order:13, natures:['cp'], description:'Microstructure formed by the replacement of the constituents of organic materials by corrosion products. The alteration process has led to a preservation of the initial form of the organic materials and a partial or total transformation of the organic matter.'},
{family_uid:'microstructureCSFamily', uid:'microstructureScatteredAggregateMicrostructureCSCharacteristic', name:'Scattered aggregate microstructure', order:14, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing numerous aggregates separated from each other and distributed over the observed area.'},
{family_uid:'microstructureCSFamily', uid:'microstructureClayCSCharacteristic', name:'Clay', order:15, natures:['soil'], description:'< 0,01 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCoarseSandsCSCharacteristic', name:'Coarse sands', order:16, natures:['soil'], description:'0,4 to 2 mm. Crumbling.'},
{family_uid:'microstructureCSFamily', uid:'microstructureFineSandsCSCharacteristic', name:'Fine sands', order:17, natures:['soil'], description:'0,08 to 0,4 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureGravelCSCharacteristic', name:'Gravel', order:18, natures:['soil'], description:'2 to 20 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureLimonsCSCharacteristic', name:'Limons', order:19, natures:['soil'], description:'0,01 to 0,08 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePebblesCSCharacteristic', name:'Pebbles', order:20, natures:['soil'], description:'20 to 75 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureBetaCompoundsCSCharacteristic', name:'Beta compounds', order:21, natures:['metal']},
{family_uid:'microstructureCSFamily', uid:'microstructureCementiteCSCharacteristic', name:'Cementite', order:22, natures:['metal'], description:'Cementite is an iron carbide with the chemical formula Fe₃C.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCopperAlphaPhaseCSCharacteristic', name:'Copper alpha phase', order:23, natures:['metal'], description:'Primary phase in most copper based alloys'},
{family_uid:'microstructureCSFamily', uid:'microstructureFerriteCSCharacteristic', name:'Ferrite', order:24, natures:['metal'], description:'Ferrite is a solid solution of carbon in the iron allotrope α.'},
{family_uid:'microstructureCSFamily', uid:'microstructureGraphiteLamellasCSCharacteristic', name:'Graphite lamellas', order:25, natures:['metal'], description:'Phase characteristic of grey cast iron.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePearliteCSCharacteristic', name:'Pearlite', order:26, natures:['metal'], description:'Perlite is a two-phase component generally consisting of alternating lamellae of cementite (Fe₃C) and ferrite.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePEutecticCSCharacteristic', name:'P-eutectic', order:27, natures:['metal'], description:'Structural components in grey cast iron alloys, also referred to as steatite.'},
{family_uid:'microstructureCSFamily', uid:'microstructureOthers?CSCharacteristic', name:'Others?', order:28, natures:['metal']}
] AS updt MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description, c.order = updt.order
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.order = updt.order
  WITH c,updt
  MATCH (f:Family {uid:updt.family_uid})
  MERGE (c)-[:BELONGS_TO]->(f)
  WITH c,updt
  UNWIND updt.natures AS nature
  MATCH (n:Nature {uid:nature})
  MERGE (n)-[:HAS]->(c)
  RETURN n,c;

 //Cross-Section SUBCHARACTERISTICS
UNWIND [
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'blankCharacteristic', name:'Blank', variable:False, order:1, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', variable:False, order:2, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:3, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', variable:False, order:4, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:5, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', variable:False, order:6, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', variable:True, order:7, natures:['metal'], unit:'µm'},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', variable:True, order:8, natures:['metal'], unit:'%', description:'In % of the observed area.'},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'blankCharacteristic', name:'Blank', variable:False, order:1, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', variable:False, order:2, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:3, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', variable:False, order:4, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:5, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', variable:False, order:6, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', variable:True, order:7, natures:['metal'], unit:'µm', description:'In µm.'},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', variable:True, order:8, natures:['metal'], unit:'%', description:'In % of the observed area.'},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'blankCharacteristic', name:'Blank', variable:False, order:1, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', variable:False, order:2, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:3, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', variable:False, order:4, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:5, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', variable:False, order:6, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', variable:True, order:7, natures:['metal'], unit:'µm', description:'In µm.'},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', variable:True, order:8, natures:['metal'], unit:'%', description:'In % of the observed area.'},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'blankCharacteristic', name:'Blank', variable:False, order:1, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', variable:False, order:2, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:3, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', variable:False, order:4, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:5, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', variable:False, order:6, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'grainSizeCharacteristic', name:'Grain size', variable:True, order:7, natures:['metal'], unit:'µm', description:'In µm.'},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', variable:True, order:8, natures:['metal'], unit:'µm', description:'In µm.'},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', variable:True, order:9, natures:['metal'], unit:'%', description:'In % of the observed area.'},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'blankCharacteristic', name:'Blank', variable:False, order:1, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:2, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'inclusionsCharacteristic', name:'Inclusions', variable:False, order:3, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:4, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'twinLinesCharacteristic', name:'Twin lines / Newman bands', variable:False, order:5, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'blankCharacteristic', name:'Blank', variable:False, order:1, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:2, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'inclusionsCharacteristic', name:'Inclusions', variable:False, order:3, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:4, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'twinLinesCharacteristic', name:'Twin lines / Newman bands', variable:False, order:5, natures:['cp']}
] AS updt
  MERGE (sc:SubCharacteristic {uid: updt.uid})
    ON CREATE SET sc+=$common_props, sc.name = updt.name, sc.description = updt.description, sc.order = updt.order, sc.variable = updt.variable, sc.unit = updt.unit
    ON MATCH SET sc.name = updt.name, sc.description = updt.description, sc.order = updt.order, sc.variable = updt.variable, sc.unit = updt.unit
  WITH sc,updt
    MATCH (c:Characteristic {uid:updt.parent_uid})
    MERGE (c)-[:HAS_SPECIALIZATION]->(sc)
  WITH sc,updt
    UNWIND updt.natures AS nature
    MATCH (n:Nature {uid:nature})
        MERGE (n)-[:HAS]->(sc)
  RETURN n,sc;

// delete Crystalline microstructureFamily characteristics wrongly added with french spelling
match (f:Family {uid:'microstructureFamily'})<-[:BELONGS_TO]-(c:Characteristic)
WHERE c.uid CONTAINS 'ristalline'
DETACH DELETE c;

UNWIND ['microstructureBetaCompounds(VoirComposesDuBz)CSCharacteristic',
'microstructureCrystallineMicrostructureCharacteristic',
'microstructureBetaCompoundsVoirComposésDuBzCSCharacteristic',
 'microstructureOthersCSCharacteristic',
 'microstructureP-EutecticCSCharacteristic']
as uid
MATCH (c:Characteristic {uid:uid}) DETACH DELETE c
