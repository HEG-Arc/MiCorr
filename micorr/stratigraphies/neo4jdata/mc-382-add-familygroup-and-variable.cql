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

// Update or Create family associating them to relevant FamilyGroup for dynamic display
WITH 1 as binocular, 2 as cross_section
UNWIND [
  {fg:'fgMorphology',order:0, observation:binocular, uid:'shapeFamily', name:'Shape', visible: false, variable: false,
   description:'Geometry of the stratum in the observed area. Only the film/coating/layer options are made visible. The blank option corresponds to a stratum which shape is not known.'},
  {fg:'fgMorphology',order:1, observation:binocular, uid:'widthFamily', name: 'Width', visible: true, variable: false},
  {fg:'fgMorphology',order:2, observation:cross_section, uid:'stratumWidthVarFamily', fieldset:'Width', name:'Stratum', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:3, observation:cross_section, uid:'areaWidthVarFamily', fieldset:'Width', name:'Observed area', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:4, observation:cross_section, uid:'percentageWidthVarFamily', fieldset:'Width', name:'Percentage', visible: false, variable: true, unit:'%', description:'Percentage (stratum vs observed area)'},
  {fg:'fgMorphology',order:5, observation:binocular, uid:'thicknessFamily', fieldset:'Thickness', name:'Relative', visible: true, variable: false},
  {fg:'fgMorphology',order:6, observation:binocular, uid:'minThicknessVarFamily', fieldset:'Thickness', name:'Minimal', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:7, observation:binocular, uid:'maxThicknessVarFamily', fieldset:'Thickness', name:'Maximal', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:8, observation:binocular, uid:'avgThicknessVarFamily', fieldset:'Thickness', name:'Average', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:9, observation:cross_section, uid:'minThicknessCSVarFamily', fieldset:'Thickness', name:'Minimal', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:10, observation:cross_section, uid:'maxThicknessCSVarFamily', fieldset:'Thickness', name:'Maximal', visible: false, variable: true, unit:'μm'},
  {fg:'fgMorphology',order:11, observation:cross_section, uid:'avgThicknessCSVarFamily', fieldset:'Thickness', name:'Average', visible: false, variable: true, unit:'μm'},
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
/*  {fg:'fgTexture', order:5, observation:binocular, uid:'crackingFamily', name:'Cracking', visible: true, variable: false,
   description: 'Assessed on the observed area. Pattern which results of the combined and synergistic interaction of mechanical stress and corrosion reactions.'},
*/  {fg:'fgTexture', order:6, observation:binocular, uid:'crackingStructureFamily', fieldset:'Cracking', name:'Structure', visible: true, variable: false,
   description:'Options of patterns. The blank option corresponds to a stratum which cracking is not known.'},
  {fg:'fgTexture', order:6, observation:cross_section, uid:'crackingStructureCSFamily', fieldset:'Cracking', name:'Structure', visible: false, variable: false,
   description:'Options of patterns. The blank option corresponds to a stratum which cracking is not known.'},
  {fg:'fgTexture', order:7, observation:binocular, uid:'crackingSurfaceDirectionFamily', fieldset:'Cracking', name:'Surface direction', visible: true, variable: false,
   description:'Orientation of the crack in a plane tangential to the surface of the object and direction of propagation.'},
  {fg:'fgTexture', order:8, observation:binocular, uid:'crackingInwardDirectionFamily', fieldset:'Cracking', name:'Inward direction', visible: false, variable: false,
   description:'Orientation of the crack in a plane perpendicular to the surface of the object and with respect to the corrosion layers and direction of propagation.'},
  {fg:'fgTexture', order:8, observation:cross_section, uid:'crackingInwardDirectionCSFamily', fieldset:'Cracking', name:'Inward direction', visible: false, variable: false,
   description:'Orientation of the crack in a plane perpendicular to the surface of the object and with respect to the corrosion layers and direction of propagation.'},
  {fg:'fgTexture', order:9, observation:binocular, uid:'crackingWidthFamily', fieldset:'Cracking', name:'Width', visible: false, variable: false,
   description:'Average space between the lips of the cracks. To compare to the back of a classical scalpel blade type 11 which is 400µm width.'},
  {fg:'fgTexture', order:10, observation:binocular, uid:'crackingWidthVarFamily', fieldset:'Cracking', name:'Width', visible: false, variable: true, unit:'μm',
   description:'Average spacing of the lips of the crack.'},
  {fg:'fgTexture', order:11, observation:binocular, uid:'crackingLengthVarFamily', fieldset:'Cracking', name:'Length', visible: false, variable: true, unit:'μm',
   description:'Average crack size parallel to the surface.'},
  {fg:'fgTexture', order:12, observation:binocular, uid:'crackingDepthVarFamily', fieldset:'Cracking', name:'Depth', visible: false, variable: true, unit:'μm',
   description:'Average crack size perpendicular to the surface.'},
  {fg:'fgTexture', order:10, observation:cross_section, uid:'crackingWidthCSVarFamily', fieldset:'Cracking', name:'Width', visible: false, variable: true, unit:'μm',
   description:'Average spacing of the lips of the crack.'},
  {fg:'fgTexture', order:11, observation:cross_section, uid:'crackingLengthCSVarFamily', fieldset:'Cracking', name:'Length', visible: false, variable: true, unit:'μm',
   description:'Average crack size parallel to the surface.'},
  {fg:'fgTexture', order:12, observation:cross_section, uid:'crackingDepthCSVarFamily', fieldset:'Cracking', name:'Depth', visible: false, variable: true, unit:'μm',
   description:'Average crack size perpendicular to the surface.'},
  {fg:'fgTexture', order:13, observation:binocular, uid:'crackingFillingFamily', fieldset:'Cracking', name:'Filling', visible: false, variable: false,
   description:'Material which might fill the cracks.'},
  {fg:'fgTexture', order:13, observation:cross_section, uid:'crackingFillingCSFamily', fieldset:'Cracking', name:'Filling', visible: false, variable: false,
   description:'Material which might fill the cracks.'},
  {fg:'fgTexture', order:14, observation:binocular, uid:'crackingEdgesFamily', fieldset:'Cracking', name:'Edges', visible: false, variable: false},
  {fg:'fgTexture', order:15, observation:binocular, uid:'crackingTypeOfCracksFamily', fieldset:'Cracking', name:'Type of cracks', visible: false, variable: false,
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
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset
WITH f, updt
MATCH (a:FamilyGroup {uid: updt.fg})
WITH f, a
MERGE (a)-[:SHOWS]->(f)
RETURN a,f;

