:param common_props {version:4, date:"2018-05-04", comparisonIndicator1:1}

/**************************
// MC-269 Strate CP : Microstructure
//-ajouter comme nouvelles options : structural void et POM (et classer les caracteristiques)

*/


UNWIND [
  // reorder by name
  {uid:"alternatingBandsCharacteristic", name:"alternating bands", order:1},
  {uid:"cristallineMicrostructureCharacteristic", name:"cristalline microstructure", order:2},
  {uid:"hexagonalNetworkCharacteristic", name:"hexagonal network", order:3},
  {uid:"isolatedAggregateMicrostructureCharacteristic", name:"isolated aggregate microstructure", order:4},
  {uid:"lenticularCharacteristic", name:"lenticular", order:5},
  {uid:"noMicrostructureCharacteristic", name:"no microstructure", order:6},
  {uid:"pseudomorphOfDendriticCharacteristic", name:"pseudomorph of dendritic microstructure", order:7},
  {uid:"pseudomorphOfGranularCharacteristic", name:"pseudomorph of granular microstructure", order:8},
  {uid:"scatteredAggregateMicrostructureCharacteristic", name:"scattered aggregate microstructure", order:10},
  // add new characteristics
  {uid: 'pseudomorphOfOrganicMaterialCharacteristic', name: 'pseudomorph of organic material', order:9},
  {uid: 'structuralVoidCharacteristic', name: 'structural void', order:11}
]
AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.order = updt.order
    ON MATCH SET c.order = updt.order
  WITH c,updt
  MATCH (f:Family {uid:"cpriMicrostructureFamily"})
  MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c;
