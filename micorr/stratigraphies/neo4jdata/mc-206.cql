:param common_props {version:3, date:"2017-11-13",comparisonIndicator1:1, comparisonIndicator2:1,comparisonIndicator3:1, comparisonIndicator4:1, comparisonIndicator5:1}

// Add new "no microstructure" Characteristic to Metal Microstructure family
MATCH (f:Family {uid:"mMicrostructureFamily"})
MERGE (c:Characteristic {name: "no microstructure",uid:"mnoMicrostructureCharacteristic",type:"Strata",visible:true, order:0})
ON CREATE set c+=$common_props
MERGE (f)<-[r:BELONGS_TO]-(c)
RETURN f,r,c;

