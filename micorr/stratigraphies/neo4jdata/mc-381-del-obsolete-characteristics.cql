/**************************
 MC-381 -  MC-383 MetalPAT-Interreg - Binocular / Cross-section Observation Mode
 removes obsolete composition family and Characteristics from db
 */

:param common_props {version:5, date:"2020-07-16"}

// graphdb cleanup
// MATCH (f:Family) WHERE  f.uid CONTAINS 'Composition' AND NOT f.uid IN  ['sCompositionFamily','dCompositionFamily','nmmCompositionFamily','pomCompositionFamily']  AND NOT (f)-[:IS_LIST_OF]-(:Family)  RETURN f.uid
// removing old test nodes:Person and relationships :OWNS and :IS_CHILD_OF


// Retrieve the list of obsolete composition characteristics that have been replace by list of elements
// to delete
// MATCH (f:Family)<-[:BELONGS_TO]-(c:Characteristic)
//  WHERE  f.uid CONTAINS 'Composition'
//     AND NOT f.uid IN  ['sCompositionFamily','dCompositionFamily','nmmCompositionFamily','pomCompositionFamily']
//     AND NOT (f)-[:IS_LIST_OF]->()
// OPTIONAL MATCH (c)-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic)
// RETURN f.uid,f.name,c.uid,c.name,sc.uid,sc.name;

// freeze the families list obtained from above query and delete the corresponding nodes
UNWIND ["cpCompositionFamily",
"cpCompositionExtensionFamily",
"cpriMicrostructureAggregateCompositionFamily",
"cpriMicrostructureAggregateCompositionExtensionFamily",
"cmCompositionFamily",
"mCompositionFamily",
"cmCpAggregatesCompositionFamily"] as f_uid
MATCH (f:Family {uid:f_uid})
OPTIONAL MATCH (f)<-[:BELONGS_TO]-(c:Characteristic)
OPTIONAL MATCH (c)-[:HAS_SPECIALIZATION]->(sc:SubCharacteristic)
DETACH DELETE f,c,sc;


// remove redundant unused Label nodes
MATCH (n:Label) DETACH DELETE n;

