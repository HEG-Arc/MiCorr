:param common_props { version: 3, date: "2017-12-15", comparisonIndicator1: 1, comparisonIndicator2: 1, comparisonIndicator3: 1, comparisonIndicator4: 1, comparisonIndicator5: 1 }

MATCH (f:Family {uid:"mMicrostructureFamily"})
MERGE (c:Characteristic { name: "graphite lamellas", uid: "graphiteLamellasCharacteristic", type: "Strata", visible: true, order: 6 })
ON CREATE set c+=$common_props
MERGE (f)<-[r:BELONGS_TO]-(c)

MERGE (c)-[r2:HAS_SPECIALIZATION]->(sc1:SubCharacteristic { name: "eutectic phase graphite lamellas", uid: "eutecticPhaseGraphiteLamellas", type: "Strata", visible: true })
ON CREATE set sc1+=$common_props

MERGE (c)-[r3:HAS_SPECIALIZATION]->(sc2:SubCharacteristic { name: "inclusions graphite lamellas", uid: "inclusionsGraphiteLamellas", type: "Strata", visible: true })
ON CREATE set sc2+=$common_props

RETURN f,r,c;

// -----------

/*MATCH (f:Family {uid:"mMicrostructureFamily"})
MERGE (c:Characteristic { name: "graphite lamellas", uid: "graphiteLamellasCharacteristic", type: "Strata", visible: true, order: 6 })
ON CREATE set c+={ version: 3, date: "2017-12-15", comparisonIndicator1: 1, comparisonIndicator2: 1, comparisonIndicator3: 1, comparisonIndicator4: 1, comparisonIndicator5: 1 }
MERGE (f)<-[r:BELONGS_TO]-(c)

MERGE (c)-[r2:HAS_SPECIALIZATION]->(sc1:SubCharacteristic { name: "inclusions graphite lamellas", uid: "inclusionsGraphiteLamellas", type: "Strata", visible: true })
ON CREATE set sc1+={ version: 3, date: "2017-12-15", comparisonIndicator1: 1, comparisonIndicator2: 1, comparisonIndicator3: 1, comparisonIndicator4: 1, comparisonIndicator5: 1 }

RETURN f,r,c;*/

