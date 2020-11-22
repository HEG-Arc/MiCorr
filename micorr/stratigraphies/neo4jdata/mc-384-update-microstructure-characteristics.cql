:param common_props {version:7, date:"2020-08-27"}

/**************************
// MC-384 Mirostructure update with images and add support for select hierarchy with optgroup in characteristics

data set generated with notebooks/MetalPAT_import_new_characteristics_from_csv.ipynb
based on google sheet [https://docs.google.com/spreadsheets/d/1TAXM1qKFOoqlx5MwpVYnh2dSFWaZyumvk-ohkVOcGew/edit#gid=1581905147]
export to csv and html
 */

WITH 1 as binocular, 2 as cross_section
UNWIND [
{fg:'fgMicrostructure', order:1, observation:binocular, uid:'microstructureFamily', name:'Microstructure', visible: False, variable: False,
    description:'Assessed on the observed area. The blank option corresponds to a stratum which microstructure is not known.'},
{fg:'fgMicrostructure', order:1, observation:cross_section, uid:'microstructureCSFamily', name:'Microstructure', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which microstructure is not known.'}
] as updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description
WITH f, updt
MATCH (a:FamilyGroup {uid: updt.fg})
WITH f, a
MERGE (a)-[:SHOWS]->(f)
RETURN a,f;

/* microstructureFamily characteristics: */
UNWIND [ {family_uid:'microstructureCSFamily', uid:'microstructureBlankCSCharacteristic', name:'Blank', order:1, natures:['metal']},
{family_uid:'microstructureCSFamily', uid:'microstructureDeformedDendritesCSCharacteristic', name:'Deformed dendrites', order:2, natures:['metal'], description:'Stratum containing crystals in the form of deformed trees with branches.'},
{family_uid:'microstructureCSFamily', uid:'microstructureDendritesCSCharacteristic', name:'Dendrites', order:3, natures:['metal'], description:'Stratum containing crystals in the form of trees with branches.'},
{family_uid:'microstructureCSFamily', uid:'microstructureElongatedGrainsCSCharacteristic', name:'Elongated grains', order:4, natures:['metal'], description:'Stratum consisting of grains elongated in one or several direction(s).'},
{family_uid:'microstructureCSFamily', uid:'microstructureEquiaxeGrainsCSCharacteristic', name:'Equiaxe grains', order:5, natures:['metal'], description:'Stratum consisting of equiaxed grains.'},
{family_uid:'microstructureCSFamily', uid:'microstructureNoMicrostructureVisibleAtThisObservationScaleCSCharacteristic', name:'No microstructure visible at this observation scale', order:6, natures:['cp', 'metal']},
{family_uid:'microstructureCSFamily', uid:'microstructureAlternativeBandsCSCharacteristic', name:'Alternative bands', order:7, natures:['cp'], description:'Occurrence of several alternately repeating layers of corrosion products of different composition.'},
{family_uid:'microstructureCSFamily', uid:'microstructureIsolatedAggregateMicrostructureCSCharacteristic', name:'Isolated aggregate microstructure', order:8, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing one or more aggregate(s) having a minority volume over the area observed.'},
{family_uid:'microstructureCSFamily', uid:'microstructureIsolatedAggregateMicrostructureInCpCSCharacteristic', name:'Isolated aggregate microstructure in CP', order:9, natures:['cm'], description:'CP section of the stratum containing one or more aggregate(s) having a minority volume over the area observed.'},
{family_uid:'microstructureCSFamily', uid:'microstructureScatteredAggregateMicrostructureCSCharacteristic', name:'Scattered aggregate microstructure', order:10, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing numerous aggregates separated from each other and distributed over the observed area.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', name:'Pseudomorph of dendritic microstructure', order:11, natures:['cp'], description:'Microstructure formed by selective replacement of dendritic and interdendritic zones. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the dendritic microstructure of the original metal.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', name:'Pseudomorph of grain microstructure', order:12, natures:['cp'], description:'Microstructure formed by selective replacement of grains and grain boundaries. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the grain microstructure of the original metal.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfOrganicMaterialCSCharacteristic', name:'Pseudomorph of organic material', order:13, natures:['cp'], description:'Microstructure formed by the replacement of the constituents of organic materials by corrosion products. The alteration process has led to a preservation of the initial form of the organic materials and a partial or total transformation of the organic matter.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePebblesCSCharacteristic', name:'Pebbles', order:14, natures:['soil'], description:'20 to 75 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureGravelCSCharacteristic', name:'Gravel', order:15, natures:['soil'], description:'2 to 20 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCoarseSandsCSCharacteristic', name:'Coarse sands', order:16, natures:['soil'], description:'0,4 to 2 mm. Crumbling.'},
{family_uid:'microstructureCSFamily', uid:'microstructureFineSandsCSCharacteristic', name:'Fine sands', order:17, natures:['soil'], description:'0,08 to 0,4 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureLimonsCSCharacteristic', name:'Limons', order:18, natures:['soil'], description:'0,01 to 0,08 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureClayCSCharacteristic', name:'Clay', order:19, natures:['soil'], description:'< 0,01 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCementiteCSCharacteristic', name:'Cementite', order:20, natures:['metal'], description:'Cementite is an iron carbide with the chemical formula Fe₃C.'},
{family_uid:'microstructureCSFamily', uid:'microstructureFerriteCSCharacteristic', name:'Ferrite', order:21, natures:['metal'], description:'Ferrite is a solid solution of carbon in the iron allotrope α.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePearliteCSCharacteristic', name:'Pearlite', order:22, natures:['metal'], description:'Perlite is a two-phase component generally consisting of alternating lamellae of cementite (Fe₃C) and ferrite.'},
{family_uid:'microstructureCSFamily', uid:'microstructureGraphiteLamellasCSCharacteristic', name:'Graphite lamellas', order:23, natures:['metal'], description:'Phase characteristic of grey cast iron.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCopperAlphaPhaseCSCharacteristic', name:'Copper alpha phase', order:24, natures:['metal'], description:'Primary phase in most copper based alloys'},
{family_uid:'microstructureCSFamily', uid:'microstructureP-EutecticCSCharacteristic', name:'P-eutectic', order:25, natures:['metal'], description:'Structural components in grey cast iron alloys, also referred to as steatite.'},
{family_uid:'microstructureCSFamily', uid:'microstructureBetaCompounds(VoirComposésDuBz)CSCharacteristic', name:'Beta compounds (voir composés du Bz)', order:26, natures:['metal']},
{family_uid:'microstructureCSFamily', uid:'microstructureOthers?CSCharacteristic', name:'Others?', order:27, natures:['metal']}] AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url
  WITH c,updt
  MATCH (f:Family {uid:updt.family_uid})
  MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c,f;

//Cross-Section CHARACTERISTICS
UNWIND [
{family_uid:'microstructureCSFamily', uid:'microstructureBlankCSCharacteristic', name:'Blank', order:1, natures:['metal']},
{family_uid:'microstructureCSFamily', uid:'microstructureDeformedDendritesCSCharacteristic', name:'Deformed dendrites', order:2, natures:['metal'], description:'Stratum containing crystals in the form of deformed trees with branches.'},
{family_uid:'microstructureCSFamily', uid:'microstructureDendritesCSCharacteristic', name:'Dendrites', order:3, natures:['metal'], description:'Stratum containing crystals in the form of trees with branches.'},
{family_uid:'microstructureCSFamily', uid:'microstructureElongatedGrainsCSCharacteristic', name:'Elongated grains', order:4, natures:['metal'], description:'Stratum consisting of grains elongated in one or several direction(s).'},
{family_uid:'microstructureCSFamily', uid:'microstructureEquiaxeGrainsCSCharacteristic', name:'Equiaxe grains', order:5, natures:['metal'], description:'Stratum consisting of equiaxed grains.'},
{family_uid:'microstructureCSFamily', uid:'microstructureNoMicrostructureVisibleAtThisObservationScaleCSCharacteristic', name:'No microstructure visible at this observation scale', order:6, natures:['cp', 'metal']},
{family_uid:'microstructureCSFamily', uid:'microstructureAlternativeBandsCSCharacteristic', name:'Alternative bands', order:7, natures:['cp'], description:'Occurrence of several alternately repeating layers of corrosion products of different composition.'},
{family_uid:'microstructureCSFamily', uid:'microstructureIsolatedAggregateMicrostructureCSCharacteristic', name:'Isolated aggregate microstructure', order:8, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing one or more aggregate(s) having a minority volume over the area observed.'},
{family_uid:'microstructureCSFamily', uid:'microstructureIsolatedAggregateMicrostructureInCpCSCharacteristic', name:'Isolated aggregate microstructure in CP', order:9, natures:['cm'], description:'CP section of the stratum containing one or more aggregate(s) having a minority volume over the area observed.'},
{family_uid:'microstructureCSFamily', uid:'microstructureScatteredAggregateMicrostructureCSCharacteristic', name:'Scattered aggregate microstructure', order:10, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing numerous aggregates separated from each other and distributed over the observed area.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', name:'Pseudomorph of dendritic microstructure', order:11, natures:['cp'], description:'Microstructure formed by selective replacement of dendritic and interdendritic zones. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the dendritic microstructure of the original metal.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', name:'Pseudomorph of grain microstructure', order:12, natures:['cp'], description:'Microstructure formed by selective replacement of grains and grain boundaries. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the grain microstructure of the original metal.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePseudomorphOfOrganicMaterialCSCharacteristic', name:'Pseudomorph of organic material', order:13, natures:['cp'], description:'Microstructure formed by the replacement of the constituents of organic materials by corrosion products. The alteration process has led to a preservation of the initial form of the organic materials and a partial or total transformation of the organic matter.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePebblesCSCharacteristic', name:'Pebbles', order:14, natures:['soil'], description:'20 to 75 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureGravelCSCharacteristic', name:'Gravel', order:15, natures:['soil'], description:'2 to 20 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCoarseSandsCSCharacteristic', name:'Coarse sands', order:16, natures:['soil'], description:'0,4 to 2 mm. Crumbling.'},
{family_uid:'microstructureCSFamily', uid:'microstructureFineSandsCSCharacteristic', name:'Fine sands', order:17, natures:['soil'], description:'0,08 to 0,4 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureLimonsCSCharacteristic', name:'Limons', order:18, natures:['soil'], description:'0,01 to 0,08 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureClayCSCharacteristic', name:'Clay', order:19, natures:['soil'], description:'< 0,01 mm.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCementiteCSCharacteristic', name:'Cementite', order:20, natures:['metal'], description:'Cementite is an iron carbide with the chemical formula Fe₃C.'},
{family_uid:'microstructureCSFamily', uid:'microstructureFerriteCSCharacteristic', name:'Ferrite', order:21, natures:['metal'], description:'Ferrite is a solid solution of carbon in the iron allotrope α.'},
{family_uid:'microstructureCSFamily', uid:'microstructurePearliteCSCharacteristic', name:'Pearlite', order:22, natures:['metal'], description:'Perlite is a two-phase component generally consisting of alternating lamellae of cementite (Fe₃C) and ferrite.'},
{family_uid:'microstructureCSFamily', uid:'microstructureGraphiteLamellasCSCharacteristic', name:'Graphite lamellas', order:23, natures:['metal'], description:'Phase characteristic of grey cast iron.'},
{family_uid:'microstructureCSFamily', uid:'microstructureCopperAlphaPhaseCSCharacteristic', name:'Copper alpha phase', order:24, natures:['metal'], description:'Primary phase in most copper based alloys'},
{family_uid:'microstructureCSFamily', uid:'microstructureP-EutecticCSCharacteristic', name:'P-eutectic', order:25, natures:['metal'], description:'Structural components in grey cast iron alloys, also referred to as steatite.'},
{family_uid:'microstructureCSFamily', uid:'microstructureBetaCompounds(VoirComposesDuBz)CSCharacteristic', name:'Beta compounds (voir composés du Bz)', order:26, natures:['metal']},
{family_uid:'microstructureCSFamily', uid:'microstructureOthersCSCharacteristic', name:'Others?', order:27, natures:['metal']}] AS updt
  MERGE (c:Characteristic {uid: updt.uid})
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
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', order:1, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', order:2, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', order:3, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', order:4, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', order:5, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', order:6, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', order:7, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', order:1, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', order:2, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', order:3, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', order:4, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', order:5, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', order:6, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', order:7, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', order:1, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', order:2, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', order:3, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', order:4, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', order:5, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', order:6, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', order:7, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'grainSizeCharacteristic', name:'Grain size', order:1, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', order:2, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', order:3, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', order:4, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', order:5, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', order:6, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', order:7, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', order:8, natures:['metal']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', order:1, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'inclusionsCharacteristic', name:'Inclusions', order:2, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', order:3, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'twinLinesCharacteristic', name:'Twin lines', order:4, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', order:1, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'inclusionsCharacteristic', name:'Inclusions', order:2, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', order:3, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'twinLinesCharacteristic', name:'Twin lines', order:4, natures:['cp']} ] AS updt
  MERGE (sc:SubCharacteristic {uid: updt.uid})
    ON CREATE SET sc+=$common_props, sc.name = updt.name, sc.description = updt.description, sc.order = updt.order
    ON MATCH SET sc.name = updt.name, sc.description = updt.description, sc.order = updt.order
  WITH sc,updt
    MATCH (c:Characteristic {uid:updt.parent_uid})
    MERGE (c)-[:HAS_SPECIALIZATION]->(sc)
  RETURN c,sc;
