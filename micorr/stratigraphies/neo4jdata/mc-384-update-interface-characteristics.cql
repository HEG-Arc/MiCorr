:param common_props {version:8, date:"2020-08-31"}

/**************************
// MC-384 Interface update adding support for fieldset

data set generated with notebooks/MetalPAT_import_new_characteristics_from_csv.ipynb
based on google sheet [https://docs.google.com/spreadsheets/d/1TAXM1qKFOoqlx5MwpVYnh2dSFWaZyumvk-ohkVOcGew/edit#gid=1581905147]
export to csv
 */

WITH 1 as binocular, 2 as cross_section
UNWIND [
// new family_name=Profile
{fg:'fgInterface', order:1, observation:cross_section, uid:'interfaceProfileCSFamily', name:'Profile', visible: False, variable: False, description:'Determined on the observed area.'},
// new family_name=Transition
{fg:'fgInterface', order:2, observation:cross_section, uid:'interfaceTransitionCSFamily', name:'Transition', visible: False, variable: False, description:'Determined on the observed area.'},
// new fieldset=Roughness
{fg:'fgInterface', order:4, observation:cross_section, uid:'interfaceRpCSVarFamily', name:'Rp', visible: False, variable: True, description:'Maximum height of peak on the observed area. (measurment according to norme ISO 4288:1996)', unit:'µm', fieldset:'Roughness'},
{fg:'fgInterface', order:5, observation:cross_section, uid:'interfaceRcCSVarFamily', name:'Rc', visible: False, variable: True, description:'Average height of the elements on the observed area. (measurment according to norme ISO 4288:1996)', unit:'µm', fieldset:'Roughness'},
{fg:'fgInterface', order:6, observation:cross_section, uid:'interfaceRtCSVarFamily', name:'Rt', visible: False, variable: True, description:'Total roughness corresponding to the sum of Rp and Rc. (measurment according to norme ISO 4288:1996)', unit:'µm', fieldset:'Roughness'},
{fg:'fgInterface', order:7, observation:cross_section, uid:'interfaceRaCSVarFamily', name:'Ra', visible: False, variable: True, description:'Standard deviation or arithmetic mean of the distances between successive peaks and troughs. (measurment according to norme ISO 4288:1996)', unit:'µm', fieldset:'Roughness'},
// new family_name=Adherence
{fg:'fgInterface', order:8, observation:cross_section, uid:'interfaceAdherenceCSFamily', name:'Adherence', visible: False, variable: False, description:'Determined on the observed area.'}
] as updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description,f.fieldset=updt.fieldset
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description,f.fieldset=updt.fieldset
WITH f, updt
MATCH (a:FamilyGroup {uid: updt.fg})
WITH f, a
MERGE (a)-[:SHOWS]->(f)
RETURN a,f;

// fgInterface CS characteristics:
UNWIND [
// new family_name=Profile
{family_uid:'interfaceProfileCSFamily', uid:'interfaceBlankCSCharacteristic', name:'Blank', order:1},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceStraightCSCharacteristic', name:'Straight', order:2, description:'No waves along the observed length.'},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceWavyCSCharacteristic', name:'Wavy', order:3, description:'Shows variations or undulations with a low height to length ratio. Angles are greater than 90°.'},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceBumpyCSCharacteristic', name:'Bumpy', order:4, description:'Presents variations that are close in height and length. Angles can be equal to or less than 90°.'},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceIrregularCSCharacteristic', name:'Irregular', order:5, description:'Presents variations whose height and length are unrelated. Angles may be variable.'},
// new family_name=Transition
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceSharpCSCharacteristic', name:'Sharp', order:6, description:'Very sharp transition between strata.'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceDiffuseCSCharacteristic', name:'Diffuse', order:7, description:'Weak noticeable transition between strata. A large diffuse transition zone may require identification as an additional stratum.'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceSemi-GradualSuperiorCSCharacteristic', name:'semi-gradual superior', order:8, description:'Marked transition between two strata where the upper stratum has penetration into the lower stratum.'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceSemi-GradualInferiorCSCharacteristic', name:'semi-gradual inferior', order:9, description:'Marked transition between two strata where the lower stratum has penetration into the upper stratum.'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceGradualCSCharacteristic', name:'Gradual', order:10, description:'Marked transition between two interpenetrating strata.'},
// new fieldset=Roughness
// new family_name=Adherence
{family_uid:'interfaceAdherenceCSFamily', uid:'interfaceBlankCSCharacteristic', name:'Blank', order:11},
{family_uid:'interfaceAdherenceCSFamily', uid:'interfaceAdherentCSCharacteristic', name:'Adherent', order:12, description:'It is difficult to separate the strata with a thin blade (scalpel).'},
{family_uid:'interfaceAdherenceCSFamily', uid:'interfaceNonAdherentCSCharacteristic', name:'Non adherent', order:13, description:'The strata separate without any particular intervention.'}
]
AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url
  WITH c,updt
  MATCH (f:Family {uid:updt.family_uid})
  MERGE (c)-[:BELONGS_TO]->(f)
  RETURN c;
