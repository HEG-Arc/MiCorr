:param common_props {version:5, date:'2020-07-16'}
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

// Update or Create family associating them to relevant FamilyGroup for dynamic display
WITH 1 as binocular, 2 as cross_section
UNWIND [
  {fg:'fgMorphology',order:0, observation:binocular, uid:'shapeFamily', name:'Shape', visible: false, variable: false,
   description:'Geometry of the stratum in the observed area. Only the film/coating/layer options are made visible. The blank option corresponds to a stratum which shape is not known.'},
  {fg:'fgMorphology',order:1, observation:binocular, uid:'widthFamily', name: 'Width', visible: true, variable: false},
  {fg:'fgMorphology',order:2, observation:cross_section, uid:'stratumWidthVarFamily', name:'Stratum width', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:3, observation:cross_section, uid:'areaWidthVarFamily', name:'Observed area width', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:4, observation:cross_section, uid:'percentageWidthVarFamily', name:'Percentage width', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:5, observation:binocular, uid:'thicknessFamily',name:'Thickness', visible: true, variable: false},
  {fg:'fgMorphology',order:6, observation:binocular, uid:'minThicknessVarFamily', name:'Minimal thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:7, observation:binocular, uid:'maxThicknessVarFamily', name:'Maximal thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:8, observation:binocular, uid:'avgThicknessVarFamily', name:'Average thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:9, observation:cross_section, uid:'minThicknessCSVarFamily', name:'Minimal thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:10, observation:cross_section, uid:'maxThicknessCSVarFamily', name:'Maximal thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:11, observation:cross_section, uid:'avgThicknessCSVarFamily', name:'Average thickness', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:12, observation:binocular, uid:'continuityFamily', name:'Continuity', visible: false, variable: false},
  {fg:'fgMorphology',order:13, observation:binocular, uid:'directionFamily', name:'Direction', visible: false, variable: false},
  {fg:'fgMorphology',order:14, observation:binocular, uid:'colourFamily', name :'Colour', visible: true, variable: false},
  {fg:'fgMorphology',order:15, observation:binocular, uid:'brightnessFamily', name: 'Brightness', visible: false, variable: false},
  {fg:'fgMorphology',order:16, observation:binocular, uid:'opacityFamily', name:'Opacity', visible: false, variable: false},
  {fg:'fgTexture', order:0, observation:binocular, uid:'porosityFamily', name:'Compactness', visible: true, variable: false,
   description:'Assessed on the observed area. The blank option corresponds to a stratum which compactness is not known.'},
  {fg:'fgTexture', order:1, observation:cross_section, uid:'compactnessVarFamily', name:'Compactness amount', visible: true, variable: true, unit:'%',
   description:'Amount of porosities determined on the observed area.'},
  {fg:'fgTexture', order:2, observation:binocular, uid:'cohesionFamily', name:'Cohesion', visible: true, variable: false,
   description:'Assessed on the observed area. Only the powdery option is made visible. The blank option corresponds to a stratum which cohesion is not known.'},
  {fg:'fgTexture', order:3, observation:binocular, uid:'hardnessFamily', name:'Hardness', visible: false, variable: false,
   description:'Assessed on the observed area. The blank option corresponds to a stratum which hardness is not known.'},
  {fg:'fgTexture', order:4, observation:cross_section, uid:'microhardnessVarFamily', name:'Microhardness', visible: false, variable: true, unit:'HV',
   description:'Determined on the observed area.'},
  {fg:'fgTexture', order:5, observation:binocular, uid:'crackingFamily', name:'Cracking', visible: true, variable: false,
   description: 'Assessed on the observed area. Pattern which results of the combined and synergistic interaction of mechanical stress and corrosion reactions.'},
  {fg:'fgTexture', order:6, observation:binocular, uid:'crackingStructureFamily', name:'Cracking structure', visible: true, variable: false,
   description:'Options of patterns. The blank option corresponds to a stratum which cracking is not known.'},
  {fg:'fgTexture', order:6, observation:cross_section, uid:'crackingStructureCSFamily', name:'Cracking structure', visible: false, variable: false,
   description:'Options of patterns. The blank option corresponds to a stratum which cracking is not known.'},
  {fg:'fgTexture', order:7, observation:binocular, uid:'crackingSurfaceDirectionFamily', name:'Cracking surface direction', visible: true, variable: false,
   description:'Orientation of the crack in a plane tangential to the surface of the object and direction of propagation.'},
  {fg:'fgTexture', order:8, observation:binocular, uid:'crackingInwardDirectionFamily', name:'Cracking inward direction', visible: false, variable: false,
   description:'Orientation of the crack in a plane perpendicular to the surface of the object and with respect to the corrosion layers and direction of propagation.'},
  {fg:'fgTexture', order:8, observation:cross_section, uid:'crackingInwardDirectionCSFamily', name:'Cracking inward direction', visible: false, variable: false,
   description:'Orientation of the crack in a plane perpendicular to the surface of the object and with respect to the corrosion layers and direction of propagation.'},
  {fg:'fgTexture', order:9, observation:binocular, uid:'crackingWidthFamily', name:'Cracking width', visible: false, variable: false,
   description:'Average space between the lips of the cracks. To compare to the back of a classical sclapel blade type 11 which is 400µm width.'},
  {fg:'fgTexture', order:10, observation:binocular, uid:'crackingWidthVarFamily', name:'Cracking width', visible: false, variable: true, unit:'μm',
   description:'Average spacing of the lips of the crack.'},
  {fg:'fgTexture', order:11, observation:binocular, uid:'crackingLengthVarFamily', name:'Cracking length', visible: false, variable: true, unit:'μm',
   description:'Average crack size parallel to the surface.'},
  {fg:'fgTexture', order:12, observation:binocular, uid:'crackingDepthVarFamily', name:'Cracking depth', visible: false, variable: true, unit:'μm',
   description:'Average crack size perpendicular to the surface.'},
  {fg:'fgTexture', order:10, observation:cross_section, uid:'crackingWidthCSVarFamily', name:'Cracking width', visible: false, variable: true, unit:'μm',
   description:'Average spacing of the lips of the crack.'},
  {fg:'fgTexture', order:11, observation:cross_section, uid:'crackingLengthCSVarFamily', name:'Cracking length', visible: false, variable: true, unit:'μm',
   description:'Average crack size parallel to the surface.'},
  {fg:'fgTexture', order:12, observation:cross_section, uid:'crackingDepthCSVarFamily', name:'Cracking depth', visible: false, variable: true, unit:'μm',
   description:'Average crack size perpendicular to the surface.'},
  {fg:'fgTexture', order:13, observation:binocular, uid:'crackingFillingFamily', name:'Cracking filling', visible: false, variable: false,
   description:'Material which might fill the cracks.'},
  {fg:'fgTexture', order:13, observation:cross_section, uid:'crackingFillingCSFamily', name:'Cracking filling', visible: false, variable: false,
   description:'Material which might fill the cracks.'},
  {fg:'fgTexture', order:14, observation:binocular, uid:'crackingEdgesFamily', name:'Cracking edges', visible: false, variable: false},
  {fg:'fgTexture', order:15, observation:binocular, uid:'crackingTypeOfCracksFamily', name:'Cracking type of cracks', visible: false, variable: false,
   description:'Main specific types of cracks.'},
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
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description
WITH f, updt
MATCH (a:FamilyGroup {uid: updt.fg})
WITH f, a
MERGE (a)-[:SHOWS]->(f)
RETURN a,f;

