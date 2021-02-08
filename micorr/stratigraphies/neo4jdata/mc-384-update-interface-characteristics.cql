:param common_props {version:8, date:"2020-08-31"}

/**************************
// MC-384 Interface update adding support for fieldset

data set generated with notebooks/MetalPAT_import_new_characteristics_from_csv.ipynb
based on google sheet [https://docs.google.com/spreadsheets/d/1TAXM1qKFOoqlx5MwpVYnh2dSFWaZyumvk-ohkVOcGew/edit#gid=1581905147]
export to csv
 */

WITH 1 as binocular, 2 as cross_section
UNWIND [
// new family_name=Profile uid: interfaceProfileCSFamily
{fg:'fgInterface', order:1, observation:cross_section, uid:'interfaceProfileCSFamily', name:'Profile', visible: False, variable: False, description:'Determined on the observed area.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'interfaceProfileCSFamily'},
// new family_name=Transition uid: interfaceTransitionCSFamily
{fg:'fgInterface', order:2, observation:cross_section, uid:'interfaceTransitionCSFamily', name:'Transition', visible: False, variable: False, description:'Determined on the observed area.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'interfaceTransitionCSFamily'},
// new fieldset=Roughness
// new family_name=Roughness uid: interfaceRoughnessFamily
{fg:'fgInterface', order:4, observation:cross_section, uid:'interfaceRpCSVarFamily', name:'Rp', visible: False, variable: True, description:'Maximum height of peak on the observed area. (measurment according to norme ISO 4288:1996)', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Roughness', new_uid:'interfaceRoughnessRpCSVarFamily'},
{fg:'fgInterface', order:5, observation:cross_section, uid:'interfaceRcCSVarFamily', name:'Rc', visible: False, variable: True, description:'Average height of the elements on the observed area. (measurment according to norme ISO 4288:1996)', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Roughness', new_uid:'interfaceRoughnessRcCSVarFamily'},
{fg:'fgInterface', order:6, observation:cross_section, uid:'interfaceRtCSVarFamily', name:'Rt', visible: False, variable: True, description:'Total roughness corresponding to the sum of Rp and Rc. (measurment according to norme ISO 4288:1996)
', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Roughness', new_uid:'interfaceRoughnessRtCSVarFamily'},
{fg:'fgInterface', order:7, observation:cross_section, uid:'interfaceRaCSVarFamily', name:'Ra', visible: False, variable: True, description:'Standard deviation or arithmetic mean of the distances between successive peaks and troughs. (measurment according to norme ISO 4288:1996)', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], unit:'µm', fieldset:'Roughness', new_uid:'interfaceRoughnessRaCSVarFamily'},
// new family_name=Adherence uid: interfaceAdherenceCSFamily
{fg:'fgInterface', order:8, observation:cross_section, uid:'interfaceAdherenceCSFamily', name:'Adherence', visible: False, variable: False, description:'Determined on the observed area.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'interfaceAdherenceCSFamily'},

// new family_name=Profile uid: interfaceProfileFamily
{fg:'fgInterface', order:1, observation:binocular, uid:'interfaceProfileFamily', name:'Profile', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which upper interface profile is not known.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], new_uid:'interfaceProfileFamily'},
// new family_name=Transition uid: interfaceTransitionFamily
{fg:'fgInterface', order:2, observation:binocular, uid:'interfaceTransitionFamily', name:'Transition', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which transition with upper stratum is not known.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'interfaceTransitionFamily'},
// new family_name=Roughness uid: interfaceRoughnessFamily
{fg:'fgInterface', order:3, observation:binocular, uid:'interfaceRoughnessFamily', name:'Roughness', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which upper interface roughness is not known.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'interfaceRoughnessFamily'},
// new family_name=Adherence uid: interfaceAdherenceFamily
{fg:'fgInterface', order:4, observation:binocular, uid:'interfaceAdherenceFamily', name:'Adherence', visible: False, variable: False, description:'Assessed on the observed area. The blank option corresponds to a stratum which adherence with upper stratum is not known.', natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], new_uid:'interfaceAdherenceFamily'}
] as updt
MERGE (f:Family {uid: updt.uid})
    ON CREATE SET  f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset, f.new_uid= updt.new_uid
    ON MATCH SET   f+=$common_props, f.order=updt.order, f.observation=updt.observation, f.variable=updt.variable, f.visible=updt.visible, f.name=updt.name, f.unit=updt.unit, f.description=updt.description, f.fieldset=updt.fieldset, f.new_uid= updt.new_uid
    WITH f, updt
        MATCH (a:FamilyGroup {uid: updt.fg})
        WITH f, a, updt
            MERGE (a)-[:SHOWS]->(f)
            WITH f,updt
                UNWIND updt.natures AS nature
                MATCH (n:Nature {uid:nature})
                MERGE (n)-[:HAS_FAMILY]->(f)
                WITH  f, updt
                    MATCH (ef:Family {uid: updt.list_elem_family})
                    MERGE (f)-[r:IS_LIST_OF {upto: updt.upto}]->(ef)
    RETURN f;

// fgInterface CS characteristics:
UNWIND [
{family_uid:'interfaceProfileFamily', uid:'interfaceProfileBlankCharacteristic', name:'Blank', order:1, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv']},
{family_uid:'interfaceProfileFamily', uid:'straightCharacteristic', name:'Straight', order:2, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'No waves along the observed length.', new_uid:'interfaceProfileStraightCharacteristic'},
{family_uid:'interfaceProfileFamily', uid:'wavyCharacteristic', name:'Wavy', order:3, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Shows variations or undulations with a low height to length ratio. Angles are greater than 90°.', new_uid:'interfaceProfileWavyCharacteristic'},
{family_uid:'interfaceProfileFamily', uid:'bumpyCharacteristic', name:'Bumpy', order:4, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Presents variations that are close in height and length. Angles can be equal to or less than 90°.', new_uid:'interfaceProfileBumpyCharacteristic'},
{family_uid:'interfaceProfileFamily', uid:'irregularCharacteristic', name:'Irregular', order:5, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Presents variations whose height and length are unrelated. Angles may be variable.', new_uid:'interfaceProfileIrregularCharacteristic'},
{family_uid:'interfaceTransitionFamily', uid:'sharpCharacteristic', name:'Sharp', order:6, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Very sharp transition between strata.', new_uid:'interfaceTransitionSharpCharacteristic'},
{family_uid:'interfaceTransitionFamily', uid:'diffuseCharacteristic', name:'Diffuse', order:7, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'   ', new_uid:'interfaceTransitionDiffuseCharacteristic'},
{family_uid:'interfaceTransitionFamily', uid:'gradualCharacteristic', name:'Gradual', order:8, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Marked transition between two interpenetrating strata.', new_uid:'interfaceTransitionGradualCharacteristic'},
{family_uid:'interfaceRoughnessFamily', uid:'interfaceRoughnessBlankCharacteristic', name:'Blank', order:9, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'interfaceRoughnessFamily', uid:'smoothCharacteristic', name:'Smooth', order:10, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Asperities not detectable by tactile evaluation. Roughness lower than that of n°0 (or n°1000) abrasive papers.', new_uid:'interfaceRoughnessSmoothCharacteristic'},
{family_uid:'interfaceRoughnessFamily', uid:'slightlyRoughCharacteristic', name:'Slightly rough', order:11, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Low asperities detectable by tactile evaluation but not or hardly detectable by visual evaluation. Roughness between the roughness of abrasive papers n°0 (or n°1000) and n°100.', new_uid:'interfaceRoughnessSlightlyRoughCharacteristic'},
{family_uid:'interfaceRoughnessFamily', uid:'roughCharacteristic', name:'Rough', order:12, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'High asperities detectable by tactile and visual evaluation. Roughness superior to that of n°100 abrasive papers.', new_uid:'interfaceRoughnessRoughCharacteristic'},
{family_uid:'interfaceRoughnessFamily', uid:'unevenCharacteristic', name:'Uneven', order:13, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Visible asperities too big for tactile evaluation.', new_uid:'interfaceRoughnessUnevenCharacteristic'},
{family_uid:'interfaceAdherenceFamily', uid:'interfaceAdherenceBlankCharacteristic', name:'Blank', order:14, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'interfaceAdherenceFamily', uid:'inseparableCharacteristic', name:'Inseparable', order:15, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'The strata cannot be separated with a thin blade (scalpel).', new_uid:'interfaceAdherenceInseparableCharacteristic'},
{family_uid:'interfaceAdherenceFamily', uid:'adherentCharacteristic', name:'Adherent', order:16, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'It is difficult to separate the strata with a thin blade (scalpel).', new_uid:'interfaceAdherenceAdherentCharacteristic'},
{family_uid:'interfaceAdherenceFamily', uid:'looselyCharacteristic', name:'Loosely', order:17, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'The strata can be easily separated using a thin blade (scalpel).', new_uid:'interfaceAdherenceLooselyCharacteristic'},
{family_uid:'interfaceAdherenceFamily', uid:'nonAdherentCharacteristic', name:'Non adherent', order:18, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'The strata separate without any particular intervention.', new_uid:'interfaceAdherenceNonAdherentCharacteristic'},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceProfileBlankCSCharacteristic', name:'Blank', order:1, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv']},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceStraightCSCharacteristic', name:'Straight', order:2, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'No waves along the observed length.', new_uid:'interfaceProfileStraightCSCharacteristic'},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceWavyCSCharacteristic', name:'Wavy', order:3, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Shows variations or undulations with a low height to length ratio. Angles are greater than 90°.', new_uid:'interfaceProfileWavyCSCharacteristic'},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceBumpyCSCharacteristic', name:'Bumpy', order:4, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Presents variations that are close in height and length. Angles can be equal to or less than 90°.', new_uid:'interfaceProfileBumpyCSCharacteristic'},
{family_uid:'interfaceProfileCSFamily', uid:'interfaceIrregularCSCharacteristic', name:'Irregular', order:5, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil', 'sv'], description:'Presents variations whose height and length are unrelated. Angles may be variable.', new_uid:'interfaceProfileIrregularCSCharacteristic'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceSharpCSCharacteristic', name:'Sharp', order:6, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Very sharp transition between strata.', new_uid:'interfaceTransitionSharpCSCharacteristic'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceDiffuseCSCharacteristic', name:'Diffuse', order:7, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Weak noticeable transition between strata. A large diffuse transition zone may require identification as an additional stratum.', new_uid:'interfaceTransitionDiffuseCSCharacteristic'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceSemi-GradualSuperiorCSCharacteristic', name:'semi-gradual superior', order:8, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Marked transition between two strata where the upper stratum has penetration into the lower stratum.', new_uid:'interfaceTransitionSemiGradualSuperiorCSCharacteristic'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceSemi-GradualInferiorCSCharacteristic', name:'semi-gradual inferior', order:9, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Marked transition between two strata where the lower stratum has penetration into the upper stratum.', new_uid:'interfaceTransitionSemiGradualInferiorCSCharacteristic'},
{family_uid:'interfaceTransitionCSFamily', uid:'interfaceGradualCSCharacteristic', name:'Gradual', order:10, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'Marked transition between two interpenetrating strata.', new_uid:'interfaceTransitionGradualCSCharacteristic'},
// new fieldset=Roughness
{family_uid:'interfaceAdherenceCSFamily', uid:'interfaceAdherenceBlankCSCharacteristic', name:'Blank', order:11, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil']},
{family_uid:'interfaceAdherenceCSFamily', uid:'interfaceAdherentCSCharacteristic', name:'Adherent', order:12, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'It is difficult to separate the strata with a thin blade (scalpel).', new_uid:'interfaceAdherenceAdherentCSCharacteristic'},
{family_uid:'interfaceAdherenceCSFamily', uid:'interfaceNonAdherentCSCharacteristic', name:'Non adherent', order:13, natures:['cp', 'deposit', 'metal', 'nmm', 'pom', 'soil'], description:'The strata separate without any particular intervention.', new_uid:'interfaceAdherenceNonAdherentCSCharacteristic'}
]
AS updt
  MERGE (c:Characteristic {uid: updt.uid})
    ON CREATE SET c+=$common_props, c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url, c.new_uid= updt.new_uid
    ON MATCH SET c.name = updt.name, c.description = updt.description, c.order = updt.order, c.optgroup=updt.optgroup, c.image_url = updt.image_url, c.new_uid= updt.new_uid
  WITH c,updt
  MATCH (f:Family {uid:updt.family_uid})
  MERGE (c)-[:BELONGS_TO]->(f)
  WITH c,updt
   UNWIND updt.natures AS nature
     MATCH (n:Nature {uid:nature})
     MERGE (n)-[:HAS]->(c)
  RETURN n,c;

//delete unwanted interfaceBlankCSCharacteristic badly added in two familyGroup by previous commit #d53b82e
MATCH (c:Characteristic {uid:'interfaceBlankCSCharacteristic'})
DETACH DELETE c
