
/**************************
// MC-331 Rename M and CP Microstructure sub-characteristics
  to remove the parent characteristic name that was redundantly
  copied into each Sub Characterist name
 e.g :
  slipLinesGrainLarge : "slip Lines Grain Large" =>  "slip lines"
  twinLinesGrainLarge : "twin Lines Grain Large" => "twin lines"
  etc...
*/


UNWIND [
  {uid: 'eutecticPhaseDeformedDendritic', name: 'eutectic phase'},
  {uid: 'inclusionsDeformedDendritic', name: 'inclusions'},
  {uid: 'slipLinesDeformedDendritic', name: 'slip lines'},
  {uid: 'twinLinesDeformedDendritic', name: 'twin lines'},

  {uid: 'eutecticPhaseGrainElongated', name: 'eutectic phase'},
  {uid: 'inclusionsGrainElongated', name: 'inclusions'},
  {uid: 'slipLinesGrainElongated', name: 'slip lines'},
  {uid: 'twinLinesGrainElongated', name: 'twin lines'},

  {uid: 'eutecticPhaseGrainSmall', name: 'eutectic phase'},
  {uid: 'inclusionsGrainSmall', name: 'inclusions'},
  {uid: 'slipLinesGrainSmall', name: 'slip lines'},
  {uid: 'twinLinesGrainSmall', name: 'twin lines'},

  {uid: 'eutecticPhaseGrainLarge', name: 'eutectic phase'},
  {uid: 'inclusionsGrainLarge', name: 'inclusions'},
  {uid: 'slipLinesGrainLarge', name: 'slip lines'},
  {uid: 'twinLinesGrainLarge', name: 'twin lines'},

  {uid: 'eutecticPhaseDendritic', name: 'eutectic phase'},
  {uid: 'inclusionsDendritic', name: 'inclusions'},
  {uid: 'slipLinesDendritic', name: 'slip lines'},
  {uid: 'twinLinesDendritic', name: 'twin lines'},

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

