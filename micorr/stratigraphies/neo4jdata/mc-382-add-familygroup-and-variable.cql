:param common_props {version:5, date:"2020-07-16"}
/**************************
 MC-382 -  MC-383 MetalPAT-Interreg - Binocular / Cross-section Observation Mode
 adds support for characteristics with Variable and  dynamic UI from graph db
*/

CREATE CONSTRAINT ON (n:FamilyGroup) ASSERT n.uid IS UNIQUE;

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
// Update or Create family associating them to relevant FamilyGroup for dynamic display
WITH 1 as binocular, 2 as cross_section
UNWIND [
  {fg:'fgMorphology',order:0, observation:binocular, uid:'widthFamily', name: 'Width', visible: true, variable: false},
  {fg:'fgMorphology',order:1, observation:cross_section, uid:'stratumWidthVarFamily', name:'Stratum width', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:2, observation:cross_section, uid:'areaWidthVarFamily', name:'Observed area width', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:3, observation:cross_section, uid:'percentageWidthVarFamily', name:'Percentage width', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:4, observation:binocular, uid:'thicknessFamily',name:'Thickness', visible: true, variable: false},
  {fg:'fgMorphology',order:5, observation:binocular + cross_section, uid:'minThicknessVarFamily', name:'Minimal thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:6, observation:binocular + cross_section, uid:'maxThicknessVarFamily', name:'Maximal thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:7, observation:binocular + cross_section, uid:'avgThicknessVarFamily', name:'Average thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:8, observation:binocular, uid:'shapeFamily', name:'Shape', visible: false, variable: false},
  {fg:'fgMorphology',order:7, observation:binocular, uid:'continuityFamily', name:'Continuity', visible: false, variable: false},
  {fg:'fgMorphology',order:8, observation:binocular, uid:'directionFamily', name:'Direction', visible: false, variable: false},
  {fg:'fgMorphology',order:9, observation:binocular, uid:'colourFamily', name :'Colour', visible: true, variable: false},
  {fg:'fgMorphology',order:10, observation:binocular, uid:'brightnessFamily', name: 'Brightness', visible: false, variable: false},
  {fg:'fgMorphology',order:11, observation:binocular, uid:'opacityFamily', name:'Opacity', visible: false, variable: false},
  {fg:'fgTexture', order:0, observation:binocular, uid:'porosityFamily', name:'Compactness', visible: true, variable: false},
  {fg:'fgTexture', order:1, observation:cross_section, uid:'compactnessVarFamily', name:'Compactness amount', visible: true, variable: true, unit:'%'},
  {fg:'fgTexture', order:2, observation:binocular, uid:'cohesionFamily', name:'Cohesion', visible: true, variable: false},
  {fg:'fgTexture', order:3, observation:binocular, uid:'hardnessFamily', name:'Hardness', visible: false, variable: false},
  {fg:'fgTexture', order:4, observation:cross_section, uid:'microhardnessVarFamily', name:'Microhardness', visible: false, variable: true, unit:'HV'},
  {fg:'fgTexture', order:5, observation:binocular, uid:'crackingFamily', name:'Cracking', visible: true, variable: false},
  {fg:'fgTexture', order:6, observation:binocular + cross_section, uid:'crackingWidthVarFamily', name:'Cracking width', visible: false, variable: true, unit:'μm'},
  {fg:'fgTexture', order:7, observation:binocular + cross_section, uid:'crackingLendthVarFamily', name:'Cracking length', visible: false, variable: true, unit:'μm'},
  {fg:'fgTexture', order:8, observation:binocular + cross_section, uid:'crackingDepthVarFamily', name:'Cracking depth', visible: false, variable: true, unit:'μm'},
  {fg:'fgInterface', order:0, observation:binocular, uid:'interfaceProfileFamily', name:'Profile', visible: true, variable: false},
  {fg:'fgInterface', order:1, observation:binocular, uid:'interfaceTransitionFamily', name:'Transition', visible: true, variable: false},
  {fg:'fgInterface', order:2, observation:binocular, uid:'interfaceRoughnessFamily', name:'Roughness', visible: true, variable: false},
  {fg:'fgInterface', order:3, observation:binocular, uid:'interfaceAdherenceFamily', name:'Adherence', visible: false, variable: false},
  {fg:'fgComposition', order:0, observation:binocular, uid:'sCompositionFamily', name:'Composition', visible: false, variable: false},
  {fg:'fgComposition', order:0, observation:binocular, uid:'nmmCompositionFamily', name:'Composition', visible: false, variable: false},
  {fg:'fgComposition', order:0, observation:binocular, uid:'dCompositionFamily', name:'Composition', visible: false, variable: false},
  {fg:'fgComposition', order:0, observation:binocular, uid:'pomCompositionFamily', name:'Composition', visible: false, variable: false},
  {fg:'fgMicrostructure', order:0, observation:binocular, uid:'cpriMicrostructureFamily', name:'Microstructure', visible: true, variable: false},
  {fg:'fgMicrostructure', order:0, observation:binocular, uid:'mMicrostructureFamily', name:'Microstructure', visible: true, variable: false},
  {fg:'fgMicrostructure', order:0, observation:binocular, uid:'cmCpMicrostructureFamily', name:'Microstructure', visible: true, variable: false}
  ] AS updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name
WITH f, updt
MATCH (a:FamilyGroup {uid: updt.fg})
WITH f, a
MERGE (a)-[:SHOWS]->(f)
RETURN a,f;

