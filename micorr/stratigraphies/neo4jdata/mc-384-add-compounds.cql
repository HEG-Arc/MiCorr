:param common_props {version:10, date:"2022-01-23"}

MERGE (f:Family {uid: 'compoundFamily', name: 'Compound'})
WITH f
UNWIND [{uid: 'cpdLitharge', name: 'Litharge (PbO)'}, {uid: 'cpdMassicot', name: 'Massicot (PbO)'},
  {uid: 'cpdCerussite', name: 'Cerussite (PbCO3)'}, {uid: 'cpdHydrocerussite', name: 'Hydrocerussite (Pb3(CO3)2(OH)2)'}]
AS data
MERGE (c:Compound:Characteristic {uid: data.uid})
  ON CREATE
  SET c+=$common_props, c.name = data.name
WITH f, c
MERGE (c)-[:BELONGS_TO]->(f)
RETURN c, f;
