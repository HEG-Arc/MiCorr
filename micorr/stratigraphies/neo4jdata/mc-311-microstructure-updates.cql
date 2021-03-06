:param common_props {version:4, date:"2018-05-02"}
/**************************
// MC-311 Rename M and CP Microstructure sub-characteristics
  to remove the parent characteristic name that was redundantly
  copied into each Sub Characterist name
 e.g :
  slipLinesGrainLarge : "slip Lines Grain Large" =>  "slip lines"
  twinLinesGrainLarge : "twin Lines Grain Large" => "twin lines"
  etc...

  MC-209 rename "twin lines" M Microstructure sub-characteristics to "twin lines / Newmann bands"
*/


UNWIND [
  {uid: 'eutecticPhaseDeformedDendritic', name: 'eutectic phase'},
  {uid: 'inclusionsDeformedDendritic', name: 'inclusions'},
  {uid: 'slipLinesDeformedDendritic', name: 'slip lines'},
  {uid: 'twinLinesDeformedDendritic', name: 'twin lines / Newmann bands'},

  {uid: 'eutecticPhaseGrainElongated', name: 'eutectic phase'},
  {uid: 'inclusionsGrainElongated', name: 'inclusions'},
  {uid: 'slipLinesGrainElongated', name: 'slip lines'},
  {uid: 'twinLinesGrainElongated', name: 'twin lines / Newmann bands'},

  {uid: 'eutecticPhaseGrainSmall', name: 'eutectic phase'},
  {uid: 'inclusionsGrainSmall', name: 'inclusions'},
  {uid: 'slipLinesGrainSmall', name: 'slip lines'},
  {uid: 'twinLinesGrainSmall', name: 'twin lines / Newmann bands'},

  {uid: 'eutecticPhaseGrainLarge', name: 'eutectic phase'},
  {uid: 'inclusionsGrainLarge', name: 'inclusions'},
  {uid: 'slipLinesGrainLarge', name: 'slip lines'},
  {uid: 'twinLinesGrainLarge', name: 'twin lines / Newmann bands'},

  {uid: 'eutecticPhaseDendritic', name: 'eutectic phase'},
  {uid: 'inclusionsDendritic', name: 'inclusions'},
  {uid: 'slipLinesDendritic', name: 'slip lines'},
  {uid: 'twinLinesDendritic', name: 'twin lines / Newmann bands'},

  {uid: 'twinLinesPseudomorphOfGranularCpri', name: 'twin lines'},
  {uid: 'slipLinesPseudomorphOfGranularCpri', name: 'slip lines'},
  {uid: 'inclusionsPseudomorphOfGranularCpri', name: 'inclusions'},
  {uid: 'eutecticPhasePseudomorphOfGranularCpri', name: 'eutectic phase'},

  {uid: 'twinLinesPseudomorphOfDendriticCpri', name: 'twin lines'},
  {uid: 'slipLinesPseudomorphOfDendriticCpri', name: 'slip lines'},
  {uid: 'inclusionsPseudomorphOfDendriticCpri', name: 'inclusions'},
  {uid: 'eutecticPhasePseudomorphOfDendriticCpri', name: 'eutectic phase'},

  {uid: 'twinLinesHexagonalNetworkCpri', name: 'twin lines'},
  {uid: 'slipLinesHexagonalNetworkCpri', name: 'slip lines'},
  {uid: 'inclusionsHexagonalNetworkCpri', name: 'inclusions'},
  {uid: 'eutecticPhaseHexagonalNetworkCpri', name: 'eutectic phase'},

  {uid: 'twinLinesAlternatingBandsCpri', name: 'twin lines'},
  {uid: 'slipLinesAlternatingBandsCpri', name: 'slip lines'},
  {uid: 'inclusionsAlternatingBandsCpri', name: 'inclusions'},
  {uid: 'eutecticPhaseAlternatingBandsCpri', name: 'eutectic phase'},

  {uid: 'twinLinesScatteredAggregateMicrostructureCpri', name: 'twin lines'},
  {uid: 'slipLinesScatteredAggregateMicrostructureCpri', name: 'slip lines'},
  {uid: 'inclusionsScatteredAggregateMicrostructureCpri', name: 'inclusions'},
  {uid: 'eutecticPhaseScatteredAggregateMicrostructureCpri', name: 'eutectic phase'},

  {uid: 'twinLinesIsolatedAggregateMicrostructureCpri', name: 'twin lines'},
  {uid: 'slipLinesIsolatedAggregateMicrostructureCpri', name: 'slip lines'},
  {uid: 'inclusionsIsolatedAggregateMicrostructureCpri', name: 'inclusions'},
  {uid: 'eutecticPhaseIsolatedAggregateMicrostructureCpri', name: 'eutectic phase'},

  {uid: 'twinLinesCristallineMicrostructureCpri', name: 'twin lines'},
  {uid: 'slipLinesCristallineMicrostructureCpri', name: 'slip lines'},
  {uid: 'inclusionsCristallineMicrostructureCpri', name: 'inclusions'},
  {uid: 'eutecticPhaseCristallineMicrostructureCpri', name: 'eutectic phase'},

  {uid: 'eutecticPhaseNoMicrostructureCpri', name: 'eutectic phase'},
  {uid: 'inclusionsNoMicrostructureCpri', name: 'inclusions'},
  {uid: 'slipLinesNoMicrostructureCpri', name: 'slip lines'},
  {uid: 'twinLinesNoMicrostructureCpri', name: 'twin lines'}
]
AS updt
  MATCH (sc:SubCharacteristic {uid: updt.uid})
    SET sc.name = updt.name
  RETURN sc.uid, sc.name;

/**************************
// MC-311 Adds inclusions sub-characteristic for M "No Microstructure" characteristic
// MC-210 Adds "elongated inclusions" sub-c for M "grain large", "grain small" and "grain elongated" characteristics

*/
UNWIND [
  // MC-311
  {cuid: 'mnoMicrostructureCharacteristic', uid: 'inclusionsNoMicrostructure', name: 'inclusions'},
  // MC-210
  {cuid: 'grainSmallCharacteristic', uid: 'elongatedInclusionsGrainSmall', name: 'elongated inclusions'},
  {cuid: 'grainLargeCharacteristic', uid: 'elongatedInclusionsGrainLarge', name: 'elongated inclusions'},
  {cuid: 'grainElongatedCharacteristic', uid: 'elongatedInclusionsGrainElongated', name: 'elongated inclusions'}
]
AS updt
  MERGE (sc:SubCharacteristic {uid: updt.uid})
    ON CREATE SET sc+=$common_props, sc.name = updt.name
  WITH sc,updt
  MATCH (c:Characteristic {uid:updt.cuid})
  MERGE (c)-[:HAS_SPECIALIZATION]->(sc)
  RETURN sc;

/**************************
// MC-207 Adds new M Microstructures "graphite lamellas", "Martensite" and "Bainite"
//       and their sub-characteristics : "eutectic phase" and "inclusions"
*/
UNWIND [
  {cuid: 'graphiteLamellasCharacteristic', cname: 'graphite lamellas', uid: 'eutecticPhaseGraphiteLamellas', name: 'eutectic phase'},
  {cuid: 'graphiteLamellasCharacteristic', cname: 'graphite lamellas', uid: 'inclusionsGraphiteLamellas', name: 'inclusions'},
  {cuid: 'martensiteCharacteristic', cname: 'martensite', uid: 'eutecticPhaseMartensite', name: 'eutectic phase'},
  {cuid: 'martensiteCharacteristic', cname: 'martensite', uid: 'inclusionsMartensite', name: 'inclusions'},
  {cuid: 'bainiteCharacteristic', cname: 'bainite', uid: 'eutecticPhaseBainite', name: 'eutectic phase'},
  {cuid: 'bainiteCharacteristic', cname: 'bainite', uid: 'inclusionsBainite', name: 'inclusions'}
]
AS updt
  MERGE (sc:SubCharacteristic {uid: updt.uid})
    ON CREATE SET sc+=$common_props, sc.name = updt.name
  WITH sc,updt
    MERGE (c:Characteristic {uid:updt.cuid})
    ON CREATE SET c+=$common_props, c.name = updt.cname, c.visible = TRUE
  WITH sc,c
    MERGE (c)-[:HAS_SPECIALIZATION]->(sc)
  WITH sc,c
    MATCH (f:Family {uid:"mMicrostructureFamily"})
    WITH c,f,sc
    MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c,sc;
