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
    description:'Assessed on the observed area. The blank option corresponds to a stratum which microstructure is not known.'}
] as updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description
WITH f, updt
MATCH (a:FamilyGroup {uid: updt.fg})
WITH f, a
MERGE (a)-[:SHOWS]->(f)
RETURN a,f;

// microstructureFamily characteristics:
UNWIND [
{family_uid:"microstructureFamily", uid:"microstructureBlankCharacteristic", name:"Blank", order:1},
{family_uid:"microstructureFamily", uid:"microstructureAlternativeBandsCharacteristic", name:"Alternative bands", order:2, description:"Occurrence of several alternately repeating layers of corrosion products of different composition."},
{family_uid:"microstructureFamily", uid:"microstructureCristallineMicrostructureCharacteristic", name:"Cristalline microstructure", order:3, description:"Presence of a crystalline aggregates. The blank option corresponds to a stratum which cristalline microstructure is not known."},
// microstructureCristallineMicrostructureCharacteristic optgroup options:
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureBlankCharacteristic", name:"Blank", order:4, optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureDendriticCharacteristic", name:"Dendritic", order:5, description:"Formed from crystals of protrusions, assembled
dendrite (in the shape of a fern, of trees).", image_url:"https://lh6.googleusercontent.com/FyP0N-Th3gRuKFukmtMQPekDzkTkk4rqsVoqWgZLep7-kvuIVy0tXhyBwC9BHm1TlRKAZdSNhPCAFfyNE-DmsKJbKz7YSqrn0SwjfX0WZbPeS_gJhDmiIizLf6osIuEfGqBLvBUXgA=w126-h119", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureDrusyAggregateCharacteristic", name:"Drusy aggregate", order:6, description:"Aggregate formed of protruding crystals lining a surface.", image_url:"https://lh3.googleusercontent.com/i904_m1OrYim9EZyNZiQ4PDGfeoV8NleF91S1_pBrvGLqI_pKfiNdinc-htQa15MAXxgG5NXIoB4h7jIzUfXvEVvD9X-lUZgM45paGcCPi83H81NhUvog3mOwzGVKDJeOXuG1hdiQw=w126-h107", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureGéodeCharacteristic", name:"Géode", order:7, description:"Aggregate formed of protruding crystals lining a cavity.", image_url:"https://lh6.googleusercontent.com/wmlMDLY_Q1Q4pggxDLKvQ4MuGrToL5YALEBs5jKLQVRfhG7lbEbhlDglSBYpDSjNV0eigOj_eO_68YVX70Nag3qLHBcT-ThfO0wdCW8c5Qj-P8rKyj2COndVtCd84xnuf6lSGiqIiA=w126-h137", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureLamellarCharacteristic", name:"Lamellar", order:8, description:"Formed from tabular plate-like embedded crystals superimposed and adhering to each other.", image_url:"https://lh3.googleusercontent.com/V6WXsI2qcUrYqUQ9rxv5TzoB2mLdN0OREnWXUbk3iMEu3pelwL7EOSDVt16NQIo9w4SN3qvKey-LyZ5B_jMYls0kvkPRZffbhbjxiaOdnFoA2qizxmmB5CwY7AbiHpVGc0ryHr_-bw=w126-h134", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureFoliatedCharacteristic", name:"Foliated", order:9, description:"Formed from tabular enclosed crystals in the form of easily separable platelets or superimposed laminae.", image_url:"https://lh4.googleusercontent.com/aL1ihcSMWB5xH-xPdEoF-aQA64jBRspxWCPZhqY4mUTI6iyfP-bhm4KhjK6T7QallyIGxQLFOfJGu-RnBSZUdDZbBydugpVCKGKCp4jQS2hTou_CmJ99Nktw7yn2_BIdSsU05N8Liw=w126-h128", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureFibrousCharacteristic", name:"Fibrous", order:10, description:"Formed of elongated, capillary, parallel included crystals. They can be curved.", image_url:"https://lh3.googleusercontent.com/bboWl7IRuuQd9FL5Q_u6YQTgqyCRZcd-__v2uvLY9D7WU07k-yEtQFkTVZCn6oSpBiFFJMGYRn9BN57Dn7WS_nypdrmiSYd5zxRLl5d5qQRXt2pKAVCDoCMSdj96nIL0L5g0YB8Eow=w126-h107", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureStellatedCharacteristic", name:"Stellated", order:11, description:"Formed from acicular elongated embedded crystals or radiant capillaries.", image_url:"https://lh4.googleusercontent.com/E-vNQvqQtMZwnLMRPfytsxQaM0qt6jAzzpp5PJo4ccMmYmIU_Fw5_52P3l43gSvMqKy2rZkfaKNMODHNwWImoue6fwQN7jmHfXPXug2JpYJMzMbBWjtgZ03ovyZINwsaVNEeSgroWg=w126-h132", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureConcentricCharacteristic", name:"Concentric", order:12, description:"Formed of more or less spherical layers superimposed one on top of the other around a centre.", image_url:"https://lh4.googleusercontent.com/nEwdFT7hC2c4Ll1oI8aZ8vVbtw-lbcWjXT9Bdsl2gqM4XUyjXbTFujOhgi4VSd6b29oJqWAxyePZHKoN_aL-35Z_VsvyQpbSP79H-QILK4MnlLLPm20j_Mv8LM3jp99S6Uz51IWzAg=w126-h108", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureBandedCharacteristic", name:"Banded", order:13, description:"Formed from layers superimposed on each other.", image_url:"https://lh3.googleusercontent.com/Mxzty5aqKR5wWrNkfIYwaN74V_OlwuFXWYTpzzH1ghTSieP-aho0cV22cMk-FfGDDAV1Fy5k0-yM9Rv7zc_0A5x82SSSoWXEFJx_cmIyccUzw3IXNYagbvFilAhvj1rbNqbVO-u51w=w126-h106", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureBotryoidalCharacteristic", name:"Botryoidal", order:14, description:"Spherical in shape forming groups of crystals in the manner of a bunch of grapes.", image_url:"https://lh3.googleusercontent.com/xA43KIvNJkH5niUyikcCfh7XI9EtNP4xwHW5v1i3MHcHC0rGSC5QwYIcNgv7CHSz9MJWVfSrrsHAdNsW8PnlxdstdyE5GeBLN66Q3SIPrnlbNb0SRQRj5dUrrnfQBF6_8hGDnSkpEg=w126-h109", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureReniformCharacteristic", name:"Reniform", order:15, description:"With a surface that has nipples like a kidney.", image_url:"https://lh3.googleusercontent.com/nXvRKJdJ_KFA13aUzttXcttqcFB98NKFwM49w3i1OiLlkhZhCgGWSX8V6Cfbtj7jfoETl08rNYJyf8DirEYW9b0b0zRk23BkEZCX299aID-2CLGEvdVj5MCcxRHuEwVsHwSdYoT5CQ=w126-h130", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureStalactiformCharacteristic", name:"Stalactiform", order:16, description:"In the form of stalactite or stalagmite.", image_url:"https://lh5.googleusercontent.com/0wQ8ygBXwk8tUE-KVIFq2DGP0UfG5yOHUrUtQz7yWuDMyPnEYPb2dL7nnm70a2CJiuueVvtVKV51JGBUA_4QJwUmh5lThz2nQkLEY2euTEooVhIoGIehb28XEL-_RDqMGzW1b2A-Iw=w126-h134", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureGlobularCharacteristic", name:"Globular", order:17, description:"Spherical or hemispherical shape. When the crystals globules are superimposed, the aggregate becomes reniform or botryoidal.", image_url:"https://lh5.googleusercontent.com/4S9204hhpo2khAjRGdiCBG_I52NO7iLkzeKsjqlqqs8uorDNK4q71FM2P1tSHrjnPzljtlmdAFkRuX3iAlfbSwyD2zypA-MzVZI-BEI_OF11LqfSx7gFC90gJgniq9oN1O9Q-IjKgw=w126-h146", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureGranularCharacteristic", name:"Granular", order:18, description:"Compact material having facets of crystals included on the surface.", image_url:"https://lh6.googleusercontent.com/31wLwVd4-ECmxuvm3qrC-AqwQLJqmdCGiehASXQNO1-xZYEpCIvL1JqUJjPKw6kTNFw69pQsYdqTcUM94cfgPIu5lxqkIPQjwzmKhwdboualf0-wuDHs3j4nV1mB6zWNpq_kfbgeJQ=w126-h128", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructureMassiveCharacteristic", name:"Massive", order:19, description:"Compact material without visible crystalline organization.", image_url:"https://lh5.googleusercontent.com/Ua5DBHBX58l5mjzcS7uS05nhRFzG2tsmBYKIYHq_8bbsXia4OYkfDd5ih-dVu13uFv3pGcsVUVLobx0xYS4yNZ71qyw8T2klwYIGr3fhgeAxbOdSG0PPLVL1QpYmEjAx_sxvD3g_ZA=w126-h131", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"cristallineMicrostructurePowderishCharacteristic", name:"Powderish", order:20, description:"Powder-like material of low to very low cohesion.", image_url:"https://lh4.googleusercontent.com/leMfZHd9RwkJswH-TUHtnK4zmkv14hcl3nNfCtDiuvz7h18DTLCw2fDfEFUciHMAh0vkWqdaQ3g4En7Ypnw3D5sHkfQSA_NktpQ7a5oNtzWkS_OZiUBG7Mvl3Dim9XfyCWOGaz2LVA=w126-h113", optgroup:"Cristalline microstructure"},
{family_uid:"microstructureFamily", uid:"microstructureIsolatedAggregateMicrostructureCharacteristic", name:"Isolated aggregate microstructure", order:21, description:"Stratum containing one or more aggregate(s) having a minority volume over the area observed."},
{family_uid:"microstructureFamily", uid:"microstructureScatteredAggregateMicrostructureCharacteristic", name:"Scattered aggregate microstructure", order:22, description:"Stratum containing numerous aggregates separated from each other and distributed over the observed area."},
{family_uid:"microstructureFamily", uid:"microstructureDendritesCharacteristic", name:"Dendrites", order:23, description:"Stratum containing crystals in the form of trees with branches."},
{family_uid:"microstructureFamily", uid:"microstructureEquiaxeGrainsCharacteristic", name:"Equiaxe grains", order:24, description:"Stratum consisting of equiaxed grains."},
{family_uid:"microstructureFamily", uid:"microstructurePseudomorphOfDendriticMicrostructureCharacteristic", name:"Pseudomorph of dendritic microstructure", order:25, description:"Microstructure formed by selective replacement of dendritic and interdendritic zones. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the dendritic microstructure of the original metal."},
{family_uid:"microstructureFamily", uid:"microstructurePseudomorphOfGrainMicrostructureCharacteristic", name:"Pseudomorph of grain microstructure", order:26, description:"Microstructure formed by selective replacement of grains and grain boundaries. Form revealed by the presence of zones in a corrosion layer stratum corresponding to the grain microstructure of the original metal."},
{family_uid:"microstructureFamily", uid:"microstructureHexagonalMicrostructureCharacteristic", name:"Hexagonal microstructure", order:27, description:"Hexagonal network distribution of a stratum"},
{family_uid:"microstructureFamily", uid:"microstructureLenticularCharacteristic", name:"Lenticular", order:28, description:"Stratum with lens-like microstructure."},
{family_uid:"microstructureFamily", uid:"microstructureStructuralVoidCharacteristic", name:"Structural void", order:29, description:"Microstructure consisting of material in the gaseous state."},
{family_uid:"microstructureFamily", uid:"microstructurePebblesCharacteristic", name:"Pebbles", order:30, description:"20 to 75 mm."},
{family_uid:"microstructureFamily", uid:"microstructureGravelCharacteristic", name:"Gravel", order:31, description:"2 to 20 mm."},
{family_uid:"microstructureFamily", uid:"microstructureCoarseSandsCharacteristic", name:"Coarse sands", order:32, description:"0,4 to 2 mm. Crumbling."},
{family_uid:"microstructureFamily", uid:"microstructureFineSandsCharacteristic", name:"Fine sands", order:33, description:"0,08 to 0,4 mm. Easily malleable. No plasticity. Soft touch, Dusty in dry state."},
{family_uid:"microstructureFamily", uid:"microstructureLimonsCharacteristic", name:"Limons", order:34, description:"0,01 to 0,08 mm. Easily malleable. No plasticity. Soft touch, Dusty in dry state"},
{family_uid:"microstructureFamily", uid:"microstructureClayCharacteristic", name:"Clay", order:35, description:"< 0,01 mm. Plasticity. High kneading resistance. Sticky when wet. Very hard when dry."}
]
AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url
  WITH c,updt
  MATCH (f:Family {uid:updt.family_uid})
  MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c;

