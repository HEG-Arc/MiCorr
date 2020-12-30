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

/* Binocular microstructureFamily characteristics: */
UNWIND [
{family_uid:'microstructureFamily', uid:'microstructureBlankCharacteristic', name:'Blank', order:1, natures:['cp']},
{family_uid:'microstructureFamily', uid:'microstructureAlternativeBandsCharacteristic', name:'Alternative bands', order:2, natures:['cp'], description:'Occurrence of several alternately repeating layers of corrosion products of different composition.'},
{family_uid:'microstructureFamily', uid:'microstructureIsolatedAggregateMicrostructureCharacteristic', name:'Isolated aggregate microstructure', order:4, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing one or more aggregate(s) having a minority volume over the area observed.'},
{family_uid:'microstructureFamily', uid:'microstructureScatteredAggregateMicrostructureCharacteristic', name:'Scattered aggregate microstructure', order:5, natures:['cp', 'cm', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Stratum containing numerous aggregates separated from each other and distributed over the observed area.'},
{family_uid:'microstructureFamily', uid:'microstructureDendritesCharacteristic', name:'Dendrites', order:6, natures:['metal'], description:'Stratum containing crystals in the form of trees with branches.'},
{family_uid:'microstructureFamily', uid:'microstructureEquiaxeGrainsCharacteristic', name:'Equiaxe grains', order:7, natures:['metal'], description:'Stratum consisting of equiaxed grains.'},
{family_uid:'microstructureFamily', uid:'microstructurePseudomorphOfDendriticMicrostructureCharacteristic', name:'Pseudomorph of dendritic microstructure', order:8, natures:['cp'], description:'Microstructure formed by selective replacement of dendritic and interdendritic zones. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the dendritic microstructure of the original metal.'},
{family_uid:'microstructureFamily', uid:'microstructurePseudomorphOfGrainMicrostructureCharacteristic', name:'Pseudomorph of grain microstructure', order:9, natures:['cp'], description:'Microstructure formed by selective replacement of grains and grain boundaries. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the grain microstructure of the original metal.'},
{family_uid:'microstructureFamily', uid:'microstructurePebblesCharacteristic', name:'Pebbles', order:13, natures:['soil'], description:'20 to 75 mm.'},
{family_uid:'microstructureFamily', uid:'microstructureGravelCharacteristic', name:'Gravel', order:14, natures:['soil'], description:'2 to 20 mm.'},
{family_uid:'microstructureFamily', uid:'microstructureCoarseSandsCharacteristic', name:'Coarse sands', order:15, natures:['soil'], description:'0,4 to 2 mm. Crumbling.'},
{family_uid:'microstructureFamily', uid:'microstructureFineSandsCharacteristic', name:'Fine sands', order:16, natures:['soil'], description:'0,08 to 0,4 mm. Easily malleable. No plasticity. Soft touch, Dusty in dry state.'},
{family_uid:'microstructureFamily', uid:'microstructureLimonsCharacteristic', name:'Limons', order:17, natures:['soil'], description:'0,01 to 0,08 mm. Easily malleable. No plasticity Soft touch, Dusty in dry state'},
{family_uid:'microstructureFamily', uid:'microstructureClayCharacteristic', name:'Clay', order:18, natures:['soil'], description:'< 0,01 mm. Plasticity. High kneading resistance. Sticky when wet. Very hard when dry.'},
/* Binocular microstructure SUBCHARACTERISTICS */
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureBlankCharacteristic', name:'Blank', variable:False, order:1, natures:[], optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureDendriticCharacteristic', name:'Dendritic', variable:False, order:2, natures:['cp', 'deposit'], image_url:'https://lh6.googleusercontent.com/FyP0N-Th3gRuKFukmtMQPekDzkTkk4rqsVoqWgZLep7-kvuIVy0tXhyBwC9BHm1TlRKAZdSNhPCAFfyNE-DmsKJbKz7YSqrn0SwjfX0WZbPeS_gJhDmiIizLf6osIuEfGqBLvBUXgA=w126-h119',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureDrusyAggregateCharacteristic', name:'Drusy aggregate', variable:False, order:3, natures:['cp', 'deposit'], image_url:'https://lh3.googleusercontent.com/i904_m1OrYim9EZyNZiQ4PDGfeoV8NleF91S1_pBrvGLqI_pKfiNdinc-htQa15MAXxgG5NXIoB4h7jIzUfXvEVvD9X-lUZgM45paGcCPi83H81NhUvog3mOwzGVKDJeOXuG1hdiQw=w126-h107',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureGéodeCharacteristic', name:'Géode', variable:False, order:4, natures:['cp', 'deposit'], image_url:'https://lh6.googleusercontent.com/wmlMDLY_Q1Q4pggxDLKvQ4MuGrToL5YALEBs5jKLQVRfhG7lbEbhlDglSBYpDSjNV0eigOj_eO_68YVX70Nag3qLHBcT-ThfO0wdCW8c5Qj-P8rKyj2COndVtCd84xnuf6lSGiqIiA=w126-h137',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureLamellarCharacteristic', name:'Lamellar', variable:False, order:5, natures:['cp', 'deposit'], image_url:'https://lh3.googleusercontent.com/V6WXsI2qcUrYqUQ9rxv5TzoB2mLdN0OREnWXUbk3iMEu3pelwL7EOSDVt16NQIo9w4SN3qvKey-LyZ5B_jMYls0kvkPRZffbhbjxiaOdnFoA2qizxmmB5CwY7AbiHpVGc0ryHr_-bw=w126-h134',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureFoliatedCharacteristic', name:'Foliated', variable:False, order:6, natures:['cp', 'deposit'], image_url:'https://lh4.googleusercontent.com/aL1ihcSMWB5xH-xPdEoF-aQA64jBRspxWCPZhqY4mUTI6iyfP-bhm4KhjK6T7QallyIGxQLFOfJGu-RnBSZUdDZbBydugpVCKGKCp4jQS2hTou_CmJ99Nktw7yn2_BIdSsU05N8Liw=w126-h128',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureFibrousCharacteristic', name:'Fibrous', variable:False, order:7, natures:['cp', 'deposit'], image_url:'https://lh3.googleusercontent.com/bboWl7IRuuQd9FL5Q_u6YQTgqyCRZcd-__v2uvLY9D7WU07k-yEtQFkTVZCn6oSpBiFFJMGYRn9BN57Dn7WS_nypdrmiSYd5zxRLl5d5qQRXt2pKAVCDoCMSdj96nIL0L5g0YB8Eow=w126-h107',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureStellatedCharacteristic', name:'Stellated', variable:False, order:8, natures:['cp', 'deposit'], image_url:'https://lh4.googleusercontent.com/E-vNQvqQtMZwnLMRPfytsxQaM0qt6jAzzpp5PJo4ccMmYmIU_Fw5_52P3l43gSvMqKy2rZkfaKNMODHNwWImoue6fwQN7jmHfXPXug2JpYJMzMbBWjtgZ03ovyZINwsaVNEeSgroWg=w126-h132',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureConcentricCharacteristic', name:'Concentric', variable:False, order:9, natures:['cp', 'deposit'], image_url:'https://lh4.googleusercontent.com/nEwdFT7hC2c4Ll1oI8aZ8vVbtw-lbcWjXT9Bdsl2gqM4XUyjXbTFujOhgi4VSd6b29oJqWAxyePZHKoN_aL-35Z_VsvyQpbSP79H-QILK4MnlLLPm20j_Mv8LM3jp99S6Uz51IWzAg=w126-h108',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureBandedCharacteristic', name:'Banded', variable:False, order:10, natures:['cp', 'deposit'], image_url:'https://lh3.googleusercontent.com/Mxzty5aqKR5wWrNkfIYwaN74V_OlwuFXWYTpzzH1ghTSieP-aho0cV22cMk-FfGDDAV1Fy5k0-yM9Rv7zc_0A5x82SSSoWXEFJx_cmIyccUzw3IXNYagbvFilAhvj1rbNqbVO-u51w=w126-h106',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureBotryoidalCharacteristic', name:'Botryoidal', variable:False, order:11, natures:['cp', 'deposit'], image_url:'https://lh3.googleusercontent.com/xA43KIvNJkH5niUyikcCfh7XI9EtNP4xwHW5v1i3MHcHC0rGSC5QwYIcNgv7CHSz9MJWVfSrrsHAdNsW8PnlxdstdyE5GeBLN66Q3SIPrnlbNb0SRQRj5dUrrnfQBF6_8hGDnSkpEg=w126-h109',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureReniformCharacteristic', name:'Reniform', variable:False, order:12, natures:['cp', 'deposit'], image_url:'https://lh3.googleusercontent.com/nXvRKJdJ_KFA13aUzttXcttqcFB98NKFwM49w3i1OiLlkhZhCgGWSX8V6Cfbtj7jfoETl08rNYJyf8DirEYW9b0b0zRk23BkEZCX299aID-2CLGEvdVj5MCcxRHuEwVsHwSdYoT5CQ=w126-h130',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureStalactiformCharacteristic', name:'Stalactiform', variable:False, order:13, natures:['cp', 'deposit'], image_url:'https://lh5.googleusercontent.com/0wQ8ygBXwk8tUE-KVIFq2DGP0UfG5yOHUrUtQz7yWuDMyPnEYPb2dL7nnm70a2CJiuueVvtVKV51JGBUA_4QJwUmh5lThz2nQkLEY2euTEooVhIoGIehb28XEL-_RDqMGzW1b2A-Iw=w126-h134',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureGlobularCharacteristic', name:'Globular', variable:False, order:14, natures:['cp', 'deposit'], image_url:'https://lh5.googleusercontent.com/4S9204hhpo2khAjRGdiCBG_I52NO7iLkzeKsjqlqqs8uorDNK4q71FM2P1tSHrjnPzljtlmdAFkRuX3iAlfbSwyD2zypA-MzVZI-BEI_OF11LqfSx7gFC90gJgniq9oN1O9Q-IjKgw=w126-h146',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureGranularCharacteristic', name:'Granular', variable:False, order:15, natures:['cp', 'deposit'], image_url:'https://lh6.googleusercontent.com/31wLwVd4-ECmxuvm3qrC-AqwQLJqmdCGiehASXQNO1-xZYEpCIvL1JqUJjPKw6kTNFw69pQsYdqTcUM94cfgPIu5lxqkIPQjwzmKhwdboualf0-wuDHs3j4nV1mB6zWNpq_kfbgeJQ=w126-h128',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructureMassiveCharacteristic', name:'Massive', variable:False, order:16, natures:['cp', 'deposit'], image_url:'https://lh5.googleusercontent.com/Ua5DBHBX58l5mjzcS7uS05nhRFzG2tsmBYKIYHq_8bbsXia4OYkfDd5ih-dVu13uFv3pGcsVUVLobx0xYS4yNZ71qyw8T2klwYIGr3fhgeAxbOdSG0PPLVL1QpYmEjAx_sxvD3g_ZA=w126-h131',optgroup:'Cristalline microstructure'},
{family_uid:'microstructureFamily', uid:'cristallineMicrostructurePowderishCharacteristic', name:'Powderish', variable:False, order:17, natures:['cp', 'deposit', 'metal'], image_url:'https://lh4.googleusercontent.com/leMfZHd9RwkJswH-TUHtnK4zmkv14hcl3nNfCtDiuvz7h18DTLCw2fDfEFUciHMAh0vkWqdaQ3g4En7Ypnw3D5sHkfQSA_NktpQ7a5oNtzWkS_OZiUBG7Mvl3Dim9XfyCWOGaz2LVA=w126-h113',optgroup:'Cristalline microstructure'}
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
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:1, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', variable:False, order:2, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', variable:False, order:3, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', variable:True, order:4, natures:['metal'], unit:'µm'},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', variable:True, order:5, natures:['metal'], unit:'%'},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:6, natures:['metal']},
{parent_uid:'microstructureDeformedDendritesCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', variable:False, order:7, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:1, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', variable:False, order:2, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', variable:False, order:3, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', variable:True, order:4, natures:['metal'], unit:'µm'},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', variable:True, order:5, natures:['metal'], unit:'%'},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:6, natures:['metal']},
{parent_uid:'microstructureDendritesCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', variable:False, order:7, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', variable:False, order:1, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', variable:False, order:2, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', variable:True, order:3, natures:['metal'], unit:'µm'},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', variable:True, order:4, natures:['metal'], unit:'%'},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:5, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:6, natures:['metal']},
{parent_uid:'microstructureElongatedGrainsCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', variable:False, order:7, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'grainSizeCharacteristic', name:'Grain size', variable:True, order:1, natures:['metal'], unit:'µm'},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'elongatedInclusionsCharacteristic', name:'Elongated inclusions', variable:False, order:2, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'nonElongatedInclusionsCharacteristic', name:'Non elongated inclusions', variable:False, order:3, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'inclusionsSizeCharacteristic', name:'Inclusions size', variable:True, order:4, natures:['metal'], unit:'µm'},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'inclusionsDistributionCharacteristic', name:'Inclusions distribution', variable:True, order:5, natures:['metal'], unit:'%'},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:6, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:7, natures:['metal']},
{parent_uid:'microstructureEquiaxeGrainsCSCharacteristic', uid:'twinLinesNewmannBandsCharacteristic', name:'Twin lines / Newmann bands', variable:False, order:8, natures:['metal']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:1, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'inclusionsCharacteristic', name:'Inclusions', variable:False, order:2, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:3, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfDendriticMicrostructureCSCharacteristic', uid:'twinLinesCharacteristic', name:'Twin lines', variable:False, order:4, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'eutecticPhaseCharacteristic', name:'Eutectic phase', variable:False, order:1, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'inclusionsCharacteristic', name:'Inclusions', variable:False, order:2, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'slipLinesCharacteristic', name:'Slip lines', variable:False, order:3, natures:['cp']},
{parent_uid:'microstructurePseudomorphOfGrainMicrostructureCSCharacteristic', uid:'twinLinesCharacteristic', name:'Twin lines', variable:False, order:4, natures:['cp']}
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

