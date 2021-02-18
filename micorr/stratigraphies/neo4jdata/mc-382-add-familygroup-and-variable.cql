:param common_props {version:8, date:'2020-08-31'}
/**************************
 MC-382 -  MC-383 MetalPAT-Interreg - Binocular / Cross-section Observation Mode
 adds support for characteristics with Variable and  dynamic UI from graph db
*/

//CREATE CONSTRAINT ON (n:FamilyGroup) ASSERT n.uid IS UNIQUE;

//Create New FamilyGroup nodes corresponding to our tabs in Stratigraphy UI
UNWIND [
    {order:0, uid:'fgMorphology', name:'Morphology'},
    {order:1, uid:'fgTexture', name:'Texture'},
    {order:2, uid:'fgMicrostructure', name:'Microstructure'},
    {order:3, uid:'fgComposition', name:'Composition'},
    {order:4, uid:'fgInterface', name:'Interface'}
] AS new_fg
MERGE (fg:FamilyGroup {uid:new_fg.uid})
    ON CREATE SET fg+=$common_props, fg.name=new_fg.name, fg.order=new_fg.order
RETURN fg;

// delete Family previously created erroneous uid
MATCH (f:Family {uid:'crackingLendthVarFamily'})
DETACH DELETE f;


