:param common_props {version:3, date:"2017-10-30"}

//New node Label FamilyGroup
CREATE CONSTRAINT ON (n:FamilyGroup) ASSERT n.uid IS UNIQUE;

// Morphology FamilyGroup
UNWIND ['shapeFamily','widthFamily','thicknessFamily','continuityFamily',
'directionFamily','colourFamily','brightnessFamily',
'opacityFamily','magnetismFamily'] AS fuid
// 2 merges bellow to first bind new fg then create the relation
// see https://neo4j.com/docs/developer-manual/current/cypher/clauses/merge///merge-merge-on-a-relationship-between-two-existing-nodes
MATCH (f:Family {uid:fuid})
MERGE (fg:FamilyGroup {uid:'fgMorphology',name:'Morphology',uiPosition:0})
ON CREATE set fg+=$common_props
MERGE (fg)-[r:INCLUDES]->(f)
RETURN fg,r,f;


// Texture FamilyGroup
UNWIND ['porosityFamily','cohesionFamily','hardnessFamily','crackingFamily'] AS fuid
MATCH (f:Family {uid:fuid})
MERGE (fg:FamilyGroup {uid:'fgTexture',name:'Texture',uiPosition:1})
ON CREATE set fg+=$common_props
MERGE (fg)-[r:INCLUDES]->(f)
RETURN fg,r,f;

// Microstructure FamilyGroup
//MATCH (f:Family)--(c:Characteristic) WHERE F.uid contains "MicrostructureFamily" return F,c
MATCH (f:Family) WHERE f.uid contains "MicrostructureFamily"
MERGE (fg:FamilyGroup {uid:'fgMicrostructure',name:'Microstructure',uiPosition:2})
ON CREATE set fg+=$common_props
MERGE (fg)-[r:INCLUDES]->(f)
RETURN fg,r,f;


MATCH (f:Family) WHERE f.uid CONTAINS  'CompositionFamily'
MERGE (fg:FamilyGroup {uid:'fgComposition',name:'Composition',uiPosition:3})
ON CREATE set fg+=$common_props
MERGE (fg)-[r:INCLUDES]->(f)
RETURN fg,r,f;

// Interface
UNWIND ['interfaceProfileFamily','interfaceTransitionFamily','interfaceRoughnessFamily','interfaceAdherenceFamily'] AS fuid
MATCH (f:Family {uid:fuid})
MERGE (fg:FamilyGroup {uid:'fgInterface',name:'Interface',uiPosition:4})
ON CREATE set fg+=$common_props
MERGE (fg)-[r:INCLUDES]->(f)
RETURN fg,r,f;


